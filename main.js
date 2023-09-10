'use strict';

const Board = document.getElementById('board');
const StartButton = document.getElementById('start');

const types = {
	empty: 0,
	snake: 1,
	food: 2
};

const boardSize = 10;
let snake = ['00','01','02','03'];
let nextPos = 1;
let score = 1;
let direct = 'ArrowRight';
let right = true;
let Movement, Squares, interval;

const createBoard = () => {
	const fragment = document.createDocumentFragment();
	for (let i = 0; i < boardSize; i++) {
		for (let j = 0; j < boardSize; j++) {
			const Square = document.createElement('div');
			Square.className = 'Squares empty';
			Square.setAttribute('position', `${i}${j}`);
			Square.setAttribute('type', types.empty);
			fragment.appendChild(Square);
		}
	}
	Board.appendChild(fragment);
};

const createFood = (position) => {
	const exist = document.querySelector('div[type="2"]') != null;
	const positionFood = parseInt(Math.random()*100);

	if(exist) return false;

	if(snake.includes(positionFood.toString().length < 2 ? '0' + positionFood : positionFood.toString())) createFood();

	return positionFood.toString().length < 2 ? '0' + positionFood : positionFood.toString();
};

const addition = (pos) => pos.toString().length <= 1 ? '0' + pos : pos.toString();

const createSnake = (position) => snake.includes(position);

const collisionSnake = (lastElement) => {	
	nextPos = 0;
	  if(direct == 'ArrowUp') nextPos+=10;	
	  else if(direct == 'ArrowDown') nextPos-=10;	
	  else if(direct == 'ArrowRight') {
	  	nextPos-=1
	  	right = false;
	  }else if(direct == 'ArrowLeft') {
	  	nextPos+=1
	  	right = true;
	  }

	  lastElement += nextPos;
	  snake.push(addition(lastElement));
	  return;
};

const changeDirections = (key) => {
	direct = key;
	nextPos = 0;
	switch(direct){
		case 'ArrowUp':
			nextPos+=-10;
			break;
		case 'ArrowDown':
			nextPos+=10;
			break;
		case 'ArrowRight':
			right = true;
			nextPos+=1;
			break;
		case 'ArrowLeft':
			right = false;
			nextPos+=-1;
			break;
	}
};

const movement = () => {
	interval = setInterval(() => {
		let lastElement = Number(snake.at(-1));
		lastElement += nextPos;
		const [row,column] = addition(lastElement).split('');

		if (snake[snake.length-2].includes(addition(lastElement))) collisionSnake(lastElement);
		else if(snake.includes(addition(lastElement)) || lastElement > 99 || lastElement < 0 || (right && column == '0') || (!right && column == '9')){
			alert('you lost');
			clearInterval(interval);
			start.disabled = false;
			return;
		}else {
			snake.push(addition(lastElement));
			snake.shift();
		}

		Squares.forEach(sq => {
			if(createSnake(sq.getAttribute('position'))){
				if(sq.getAttribute('type') == 2){
					score++;
					document.getElementById('Score').innerText = score;
					lastElement += nextPos;
					snake.push(addition(lastElement));
				}
				sq.setAttribute('type', types.snake);
				sq.className = 'Squares snake';
			}else if(sq.getAttribute('type') == 2){
			}else{
				sq.setAttribute('type', types.empty);
				sq.className = 'Squares empty';				
			}

			const food = createFood(sq.getAttribute('position'));
			if(food!=false && sq.getAttribute('position') == food){
				sq.className = 'Squares food';
				sq.setAttribute('type', types.food);
			}
		});
	}, 100);
};


StartButton.addEventListener('click', ()=>{
	snake = ['00','01','02','03'];
	Board.innerHTML = '';
	Score.innerText = '';
	Squares = '';
	score = 0;
	createBoard();
	Squares = document.querySelectorAll('.Squares');
	Squares.forEach((sq) => {
		const food = createFood(sq.getAttribute('position'));
		const Snake = createSnake(sq.getAttribute('position'));
		if(Snake){
			sq.className = 'Squares snake';
			sq.setAttribute('type', types.snake);
		}

		if(food!=false && sq.getAttribute('position') == food){
			sq.className = 'Squares food';
			sq.setAttribute('type', types.food);
		}

	});

	movement();
	start.disabled = true;

	document.addEventListener("keydown", e => {
		if(score != 100) changeDirections(e.key);
		else {
			clearInterval(interval);
			alert('You win');
		}
	});
});