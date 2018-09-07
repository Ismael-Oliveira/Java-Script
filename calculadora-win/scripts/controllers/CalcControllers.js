class CalcController {

    constructor() {
        this._displayCalcEl = document.querySelector('#display');
        this._displayCalc = '0';
        this._operation  = [];

        this._lastNumber = '';
        this._clear = false;
        this._lastOperator = '';

        this.initialize();
        this.setLastNumberToDisplay();
        this.initButtonsEvents();
        this.initKeyBoard();
    }

    initialize() {
        this._displayCalcEl.innerHTML = this.displayCalc;
    }

    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event=>{
            element.addEventListener(event, fn, false);
        });
    }

    initButtonsEvents(){
        let buttons = document.querySelectorAll('.row > button');
        buttons.forEach(btn=>{
            this.addEventListenerAll(btn,'click drag', e => {
                this.execBtn(btn.innerHTML);
            });
            // btn.addEventListener('click', e=>{
            //     console.log(btn.innerHTML);
            // })
        })
    }

    clearEntry(){
       
        if(this._operation.length > 1){
            console.log('test', this._operation.length);
            this._lastNumber = '';
            this._lastOperator = '';

            this._operation.pop();
    
            this.setLastNumberToDisplay();
        
        }else {
            this._operation = [];
            this.displayCalc = 0;
        }

        this._clear = false;
            
    }

    clearAll(){
    
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.displayCalc  = 0;
        this._clear = false;

    }

    isOperator(value){
        return (['+','-','*','/','%'].indexOf(value) > -1 ? true : false);
    }

    getLastNumber(){
        let lastNumber;
        let i = this._operation.length - 1;

        for (i; i >= 0 ; i--) {
            if(!isNaN(this._operation[i])){
                lastNumber = this._operation[i];
                break;
            }            
        }

        if(!lastNumber){
            lastNumber =  this._lastNumber;
        }

        return lastNumber;
    }

    module(){
        let after;
        let previous = this.getLastNumber();
        
        if(this._operation.length == 1){
        
            if(previous.indexOf('-') == -1){
                after = '-' + previous; 
            }else {
                after = previous.split('');
                after.shift();
            }
        }

        if(this._operation.length == 2){

            after = this._operation[1];
            
            if(after == '+'){
                after = '-'; 
            }else {
                after = '+'; 
            }
        
        }

        if(this._operation.length == 3){

            after = previous.split('');

            if(after[2] != '-'){
                after = '-' + previous; 
            }else {
                after.shift();
            }
        }

        this.setLastOperation(after);        
        this.setLastNumberToDisplay();
    }

    previousEntry(){

        if(this._operation.length == 2){
            return;
        }
        
        let previous = this.getLastNumber();
        
        previous = previous.split('');

        previous.pop();

        if(previous.length == 0){
            this.setLastOperation('0');
            this.setLastNumberToDisplay();
            return;
        }
        previous = previous.join('');
        
        this.setLastOperation(previous);
        this.setLastNumberToDisplay();
    }

    numberFrac(value){
        
        if(isNaN(value)){
            this.displayCalc = 'erro!';
        }else {
            this._operation.pop();
            this.addOperation((1/value));
        }
    }

    squareRoot(value){
        if(!isNaN(value)){
            this.setLastOperation(parseFloat(Math.sqrt(value).toString()).toFixed(2));
        }else{
            this.displayCalc = 'Number invalid';
        }
                  
        this.setLastNumberToDisplay();        
    }

    raisedTo2(value){
        if(!isNaN(value)){
            this.setLastOperation(Math.pow(value,2).toString());
        }else{
            this.displayCalc = 'Number invalid';
        }
              
        this.setLastNumberToDisplay();  
    }

    setLastNumberToDisplay(){
        let lastNumber = this.getLastNumber();

        if(!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }

    getLastOperation(){
        return this._operation[this._operation.length - 1];
    }

    pushOperation(value){
        this._operation.push(value);

        if(this._operation.length > 3){
            this.calc();
        }
    }

    getResult(){
        return eval(this._operation.join(''));
    }

    addDot(){
        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > - 1) return;
        
        if((this.isOperator(lastOperation)) || !lastOperation){
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();
    }

    setLastOperation(value){
        this._operation[this._operation.length - 1] = value;
    }

    returnLastItem(number = 'not' ) {

        let i = this._operation.length - 1;
        let lastItem;

        if(isNaN(number)){
            for (i ; i >= 0; i--) {
                if(isNaN(this._operation[i])){
                    lastItem = this._operation[i];
                    break;
                }          
            }
        }else {
            for (i ; i >= 0; i--) {
                if(!isNaN(this._operation[i])){
                    lastItem = this._operation[i];
                    break;
                }           
            }            
        } 


        if(!lastItem) {
            lastItem = isNaN(number) ? this._lastOperator : this._lastNumber;
        }
        
        return lastItem;
    }

    calc(){
        
        let lastOperation = '';
        
        this._lastOperator = this.returnLastItem();

        if(this._operation.length < 3){
            
            if(this._operation.length == 1){
                this._clear = true;
            }

            let firstItem = this._operation[0];

            if(this._lastOperator === ""){
                return;
            }

            if(this._lastNumber === '' ){
                this._operation = [firstItem, this._lastOperator, firstItem];
            }else{
                this._operation = [firstItem, this._lastOperator, this._lastNumber];
            }
        }

        if(this._operation.length > 3){
            lastOperation = this._operation.pop();
            this._lastNumber = this.getResult().toString();
            this._clear = false;

        }else if(this._operation.length == 3){
            this._lastNumber = this.getLastNumber();
            this._clear = true;
        }

        let result = this.getResult().toString();

        // console.log(result);

        if(lastOperation === '%'){
            this._operation = [result/100];
        }else{
            this._operation = [result];
            if(lastOperation) this._operation.push(lastOperation);
        }

        this.setLastNumberToDisplay();
    }

    addOperation(value){

        if(this.isOperator(value)) {
            if(!this._operation.length) {
                this.pushOperation('0');
                this.pushOperation(value);
            }else {
                //last operation is a number
                if(!isNaN(this.getLastOperation()) ){
                    this.pushOperation(value);
                }else{
                  //verify whether the values are equals
                  if(this.getLastOperation() === value){
                      return;
                  }else {
                    this._operation[this._operation.length - 1] = value;
                  }
                }
                this._clear = false;
            }
        }else {
            //se o vetor for igual a vazio
            if(!this._operation.length){
                this.pushOperation(value);
            }else{
                if(this._clear){
                    this._clear = false;
                    this._operation = [];
                    console.log('test invalido', value);
                    this.pushOperation(value);

                }else if(!isNaN(this.getLastOperation())){
                    //concatena with the last number.
                    this._operation[this._operation.length - 1] = this.getLastNumber() + value.toString();
                }else {
                    this.pushOperation(value);
                }
                
            }
        }

        this.setLastNumberToDisplay();
        // console.log(this._operation);   
    }

    initKeyBoard(){
        document.addEventListener('keyup', (e)=>{
            // console.log(e.key);
            switch (e.key) {
                case 'Escape':
                    this.clearAll();
                    break;
    
                case 'Backspace':
                    this.clearEntry();
                    break;   
        
                case '.':
                case ',':
                    this.addDot();
                    break;
    
                case '=':
                case 'Enter':
                    this.calc();
                    break;
    
                case '%':
                case '/':  
                case '-':
                case '+':    
                case '*':
                    this.addOperation(e.key);
                    break;
                //caso seja um numero  
                case '0':
                case '1':
                case '2':
                case '3':              
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;
            }
        });
    }


    execBtn(value){
        
        switch (value) {
            case '+':
            case '-':
            case '%':
                this.addOperation(value);
                break;
            case '÷':
                this.addOperation('/');
                break;                
            case 'X':
                this.addOperation('*');
                break;  
            case '√':
                this.squareRoot(this.getLastNumber());
                break;               
            case 'x²':
                this.raisedTo2(this.getLastNumber());
                break; 
            case '¹/x':
                this.numberFrac(this.getLastNumber());
                break; 
            case '←':
                this.previousEntry();
                break;
            case 'C':
                this.clearAll();
                break;               
            case 'CE':
                this.clearEntry();
                break; 
            case ',':
                this.addDot();
                break; 
            case '±':
                this.module();
                break;
            case '=':
                this.calc();
                break;
            case '0':
            case '1':
            case '2':
            case '3':                                                 
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(value);
                break;
        
            default:
                this.setError();
                break;
        }
    }

    setError(){
        this._displayCalcEl.innerHTML = 'ERROR';
    }

    get displayCalc() {
        return this._displayCalc.innerHTML;
    }

    set displayCalc(value) {
        
        if(value.toString().length > 10) {
            this.displayCalc = parseFloat(value).toFixed(2);
            return;
        }

        this._displayCalcEl.innerHTML = value;
        
    }

}