// Game Class
class Game {
	//[PT] Construtor da classe
	//[EN] Class constructor
	constructor(canvasId) {
		//[PT] Obter o canvas e o contexto
		//[EN] Get the canvas and the context
	  this.canvas = document.getElementById(canvasId);
	  //[PT] Definir o contexto como 2d
	  //[EN] Set the context to 2d
	  this.ctx = this.canvas.getContext("2d");
	  this.player = new Player(110, 460, 60, 120, "../images/car.png", 5);
	  this.obstacles = [];
	  this.score = 0;
	  //[PT] Variável para verificar se o jogo terminou
	  //[EN] Variable to check if the game is over
	  this.isGameOver = false;
	  //[PT] Variável para armazenar o ID do intervalo
	  //[EN] Variable to store the interval ID
	  this.intervalId = null;
  
	   //[PT] Evento para quando uma tecla é pressionada
	  //[EN] Event for when a key is pressed
	  this.keys = {};
	  document.onkeydown = (event) => {
		switch (event.key) {
		  case "ArrowLeft":
			if (this.player.x > 45) {
			  this.player.moveLeft();
			}
			break;
		  case "ArrowRight":
			if (this.player.x + this.player.width < this.canvas.width - 45) {
			  this.player.moveRight();
			}
			break;
		}
	  };
  
	  document.onkeyup = (event) => {
		this.keys[event.key] = false;
	  };
	  this.road = new Image();
	  this.road.src = "../images/road.png";
	  this.road.onload = () => {
		this.start();
	  };
	}
  
	//[PT] Função para iniciar o jogo
	//[EN] Function to start the game
	start() {
	  this.intervalId = setInterval(() => {
		this.spawnObstacle();
	  }, 4000);
  
	  this.update();
	}
  
	//[PT] Função para desenhar o cenário (estrada)
	//[EN] Function to draw the board (road)
	drawBoard() {
		//[PT] Largura da estrada (considerando a margem)
		//[EN] Road width (considering the margin)
	  const roadWidth = this.canvas.width - 10; 
	  //[PT] Posição X inicial da estrada (considerando a margem)
	  //[EN] Initial X position of the road (considering the margin)
	  const roadX = 10; 
	  //[PT] Posição Y inicial da estrada
	  //[EN] Initial Y position of the road
	  const roadY = 0; 
	  //[PT] Altura da estrada
	  //[EN] Road height
	  const roadHeight = this.canvas.height; 
  
	  //[PT] Padrão para desenhar a estrada (repetir a imagem)
	  //[EN] Pattern to draw the road (repeat the image)
	  const pattern = this.ctx.createPattern(this.road, "repeat");
	  this.ctx.fillStyle = pattern;
  
	  //[PT] Desenhar a estrada (retângulo)
	  //[EN] Draw the road (rectangle)
	  this.ctx.fillRect(roadX, roadY, roadWidth, roadHeight);
	}
  
	//[PT] Função para desenhar o cenário, jogador, obstáculos e pontuação
	//[EN] Function to draw the board, player, obstacles and score
	drawScene() {
	  //[PT] Limpar o canvas
	  //[EN] Clear the canvas
	  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
	  //[PT] Desenhar o cenário
	  //[EN] Draw the board
	  this.drawBoard();
  
	  //[PT] Desenhar o jogador
	  //[EN] Draw the player
	  this.player.draw(this.ctx);
  
	  //[PT] Desenhar os obstáculos
	  //[EN] Draw the obstacles
	  this.obstacles.forEach((obstacle) => {
		obstacle.draw(this.ctx);
	  });
	}
	displayGameOver() {
	  //[PT] Limpar o canvas
	  //[EN] Clear the canvas
	  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
	  //[PT] Exibir a pontuação final
	  //[EN] Display the final score
	  this.ctx.font = "40px Arial";
	  this.ctx.fillStyle = "black";
	  this.ctx.fillText(
		"Final Score: " + this.score,
		this.canvas.width / 2 - 100,
		this.canvas.height / 2 - 40
	  );
  
	  //[PT] Exibir a imagem "Game Over"
	  //[EN] Display the "Game Over" image
	  const gameOverImage = new Image();
	  gameOverImage.src = "../images/game-over.png";
	  gameOverImage.onload = () => {
		const imageWidth = 200; // Width of the game over image
		const imageHeight = 100; // Height of the game over image
		const imageX = this.canvas.width / 2 - imageWidth / 2; // X position to center the image horizontally
		const imageY = this.canvas.height / 2 + 20; // Y position for the image
  
		//[PT] Desenhar a imagem no canvas
		//[ENG] Draw the image on the canvas
		this.ctx.drawImage(gameOverImage, imageX, imageY, imageWidth, imageHeight);
	  };
	}
	
  
	//[PT] Função para atualizar a lógica do jogo
	//[EN] Function to update the game logic
	update() {
	  if (this.isGameOver) {
		clearInterval(this.intervalId);
		this.displayGameOver();
		return;
	  }
  
	  //[PT] Movimentar o jogador
	  //[EN] Move the player
	  if (this.keys.ArrowLeft && this.player.x > 0) {
		this.player.moveLeft();
	  } else if (
		this.keys.ArrowRight &&
		this.player.x + this.player.width < this.canvas.width
	  ) {
		this.player.moveRight();
	  }
  
	  //[PT] Verificar colisão com obstáculos
	  //[EN] Check collision with obstacles
	  this.obstacles.forEach((obstacle) => {
		if (this.player.checkCollision(obstacle)) {
		  this.isGameOver = true;
		}
	  });
  
	  //[PT] Mover os obstáculos
	  //[EN] Move the obstacles
	  this.moveObstacles();
  
	  //[PT] Atualizar o desenho do cenário
	  //[EN] Update the board drawing
	  this.drawScene();
  
	  //[PT] Chamar a próxima atualização do jogo
	  //[EN] Call the next game update
	  requestAnimationFrame(this.update.bind(this));
	}
  
	//[PT] Função para criar obstáculos
	//[EN] Function to create obstacles
	spawnObstacle() {
	  const obstacleWidth = 130; // Fixed obstacle width
	  const obstacleHeight = 40; // Fixed obstacle height
	  const minWidth = this.player.width + 20; // Minimum distance between player and obstacle
	  const distanceBetweenObstacles = 300; // Distance between the obstacles vertically
	  
	  const minSpawnX = 10; // Left side position
	  const maxSpawnX = this.canvas.width - obstacleWidth - 10; // Right side position
	  
	  const x = Math.random() < 0.5 ? minSpawnX : maxSpawnX; // Randomly choose start position
	  
	  let y = 0;
	  if (this.obstacles.length > 0) {
		const lastObstacle = this.obstacles[this.obstacles.length - 1];
		y = lastObstacle.y - distanceBetweenObstacles - obstacleHeight;
	  } else {
		y = -obstacleHeight; // Start above the canvas for the first obstacle
	  }
	  
	  const obstacle = new Obstacle(x, y, obstacleWidth, obstacleHeight, "brown");
	  this.obstacles.push(obstacle);
	}
	
  
	//[PT] Função para mover os obstáculos
	//[EN] Function to move the obstacles
	moveObstacles() {
	  this.obstacles.forEach((obstacle) => {
		obstacle.y += 1; //[PT] Velocidade de movimento dos obstáculos
						//[EN] Obstacles movement speed	
  
		if (obstacle.y > this.canvas.height) {
		  //[PT] Remover obstáculo se passar do limite
		  //[EN] Remove obstacle if it passes the limit
		  const index = this.obstacles.indexOf(obstacle);
		  this.obstacles.splice(index, 1);
		  this.score += 1; //[PT] Incrementar pontuação quando obstáculo é evitado
						   //[EN] Increment score when obstacle is avoided
		}
	  });
	}
  }
  
  // Player Class
  class Player {
	constructor(x, y, width, height, imageSrc, speed) {
	  this.x = x;
	  this.y = y;
	  this.width = width;
	  this.height = height;
	  this.speed = speed;
	  this.speed = speed;
	  this.image = new Image();
	  this.image.src = imageSrc;
	}
  
	//[PT] Função para desenhar o jogador
	//[EN] Function to draw the player
	draw(ctx) {
	  ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
  
	//[PT] Função para mover o jogador para a esquerda
	//[EN] Function to move the player to the left
	moveLeft() {
	  this.x -= this.speed 
	}
	//[PT] Função para mover o jogador para a direita
	//[EN] Function to move the player to the right
	moveRight() {
	  this.x += this.speed;
	}
  
	//[PT] Função para verificar colisão com um obstáculo
	//[EN] Function to check collision with an obstacle
	checkCollision(obstacle) {
	  return (
		this.x < obstacle.x + obstacle.width &&
		this.x + this.width > obstacle.x &&
		this.y < obstacle.y + obstacle.height &&
		this.y + this.height > obstacle.y
	  );
	}
  }
  
  //Obstacle  Class 
  class Obstacle {
	constructor(x, y, width, height, color) {
	  this.x = x;
	  this.y = y;
	  this.width = width;
	  this.height = height;
	  this.color = color;
	}
  
	//[PT] Função para desenhar o obstáculo
	//[EN] Function to draw the obstacle	
	draw(ctx) {
	  ctx.fillStyle = this.color;
	  ctx.fillRect(this.x, this.y, this.width, this.height);
	}
  }
  
  //[PT] Criação do objeto Game e início do jogo
  window.onload = () => {
	document.getElementById("start-button").onclick = () => {
	  const game = new Game("canvas");
	  game.start();
	};
  };
  
  
  
  
  
  
  