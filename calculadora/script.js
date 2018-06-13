
function calcular() {

    var operacao = document.getElementById('operacao').value;
    
    var num1 = document.getElementById('num1').value;
    var num2 = document.getElementById('num2').value;

    num1 = parseFloat(num1);
    num2 = parseFloat(num2);

    var res = 0.0;

    switch(operacao) {
        case '1':
            res = num1 * num2;
            break;
        case '2':
            res = num1 / num2;
            break;
        case '3':
            res = num1 + num2;
            break;
        case '4':
            res = num1 - num2;
            break;
        default:
            alert('Digite um número ou operador válido.');
            res = 0;
            return false;
    }

    document.getElementById('result').value = res;

}