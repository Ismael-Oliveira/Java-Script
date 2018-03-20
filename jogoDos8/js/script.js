
//array que armazena o estado do jogo
var tiles = [],
	answer = [];
	
var clicks = 0,nivel = 1;

var startScreen = document.querySelector("#startScreen");
	startScreen.addEventListener('click',startGame,false);
var overScreen = document.querySelector("#overScreen");	
var clk = document.getElementById("clicks");
document.addEventListener("keydown",function(e){
	//console.log(e.keyCode);
	if(e.keyCode == 18){
		mudaNivel();
		//console.log(nivel);
	}
});

function mudaNivel(){
	nivel = !nivel;
}
//função que inicializa os elementos do jogo
function init(){
	//varre os elementos 'btn' adicionando a imagem e inserindo os elementos no array	
	for(var i = 1; i < 9; i++){
		var tile = document.querySelector("#n"+i);
		tile.style.background = "url('img/n"+ i +".png')";
		tile.addEventListener("click",moveTile,false);
		tiles.push(tile);
	}
	//completa o array com um espaço nulo e o copia para a resposta, depois renderiza o tabuleiro
	tiles.push(null);
	answer = tiles;
	render();
}

function render(){
	
	for(var i in tiles){
		var tile = tiles[i];
		if(tile){
			tile.style.left = (i%3) * 100 + 5 +"px";
			if(i < 3){
				tile.style.top = "5px"; 
			}else if(i < 6){
				tile.style.top = "105px";
			}else{
				tile.style.top = "205px";
			}
		}
	}
}

function randomSort(oldArray){
	var newArray;	
//	console.log('test randomSort');
	if(!nivel){
		do{
			newArray = [];
			while(newArray.length < oldArray.length){
				var i = Math.floor(Math.random()*oldArray.length);
				if(newArray.indexOf(oldArray[i]) < 0){
					newArray.push(oldArray[i]);
				}
			}
			
		}while(!validGame(newArray));
		
		return newArray;
	}else{
		//condição sem resolução
		do{
			newArray = [];
			while(newArray.length < oldArray.length){
				var i = Math.floor(Math.random()*oldArray.length);
				if(newArray.indexOf(oldArray[i]) < 0){
					newArray.push(oldArray[i]);
				}
			}
			
		}while(validGame(newArray));
		
		return newArray;
	 }
}

function validGame(array){
	var inversions = 0;
	var len = array.length;
//	console.log('test validGame');
	
	for(var i = 0; i< len -1; i++){
		for(var j = i +1; j < len; j++){
			if(array[i] && array[j] && array[i].dataset.value > array[j].dataset.value ){
				inversions++;
			}
		}
	}
	console.log(inversions);
	return inversions%2 === 0;
}


function startGame(){
//	console.log('test startGame');
	clicks = 0;
	clk.innerHTML = "";
	tiles = randomSort(tiles);
	this.style.opacity = "0";
	this.style.zIndex = "-1";
	this.removeEventListener("click",startGame,false);
	render();
}

function moveTile(){
	clicks++;
	var index = tiles.indexOf(this);

	if(index % 3 !== 0){//verifica se index nao esta na coluna da esquerda
		if(!tiles[index -1]){
			tiles[index - 1] = this;
			tiles[index] = null;
		}
	}
	if(index % 3 !== 2){ //verifica se index nao esta na coluna da direita
		if(!tiles[index + 1]){
			tiles[index + 1] = this;
			tiles[index] = null;
		}
	}
	if(index > 2){ //verifica se index nao esta no topo
		if(!tiles[index - 3]){
			tiles[index - 3] = this;
			tiles[index] = null;
		}
	}
	if(index  < 6){ //verifica se index nao esta no topo
		if(!tiles[index + 3]){
			tiles[index + 3] = this;
			tiles[index] = null;
		}
	}
	
	if(chkWin()){
		gameOver();
	}
	render();
}

function chkWin(){
	for(var i in tiles){
		var a = tiles[i];
		var b = answer[i];
		if(a !== b){
			return false;
		}
	}
	return true;
}

function gameOver(){
	overScreen.style.opacity = "1";
	overScreen.style.zIndex = "1";
	clk.innerHTML = "Voce venceu este jogo com "+clicks+" movimentos.";
	setTimeout(function(){
		overScreen.addEventListener('click',startGame,false);
	},500);
	
}
window.addEventListener("load",init);

