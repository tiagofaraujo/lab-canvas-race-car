// Game Class
class Game {
	constructor(canvasId) {
	  this.canvas = document.getElementById(canvasId);
	  this.ctx = this.canvas.getContext("2d");
	  this.player = new Player(110, 460, 60, 120, "../images/car.png", 5);
	  this.obstacles = [];
	  this.score = 0;
	  this.isGameOver = false;
	  this.intervalId = null;
  
	  // Event listeners para movimento do jogador
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
  
	// Função para iniciar o jogo
	start() {
	  this.intervalId = setInterval(() => {
		this.spawnObstacle();
	  }, 4000);
  
	  this.update();
	}
  
	// Função para desenhar o cenário (estrada)
	drawBoard() {
	  const roadWidth = this.canvas.width - 10; // Largura da estrada (considerando a margem)
	  const roadX = 10; // Posição X inicial da estrada (considerando a margem)
	  const roadY = 0; // Posição Y inicial da estrada
	  const roadHeight = this.canvas.height; // Altura da estrada
  
	  // Repetir o desenho do cenário para preencher o canvas inteiro
	  const pattern = this.ctx.createPattern(this.road, "repeat");
	  this.ctx.fillStyle = pattern;
  
	  // Desenhar a estrada dentro das bordas (considerando a margem)
	  this.ctx.fillRect(roadX, roadY, roadWidth, roadHeight);
	}
  
	// Função para desenhar o cenário, jogador, obstáculos e pontuação
	drawScene() {
	  // Limpar o canvas
	  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
	  // Desenhar o cenário
	  this.drawBoard();
  
	  // Desenhar o jogador
	  this.player.draw(this.ctx);
  
	  // Desenhar os obstáculos
	  this.obstacles.forEach((obstacle) => {
		obstacle.draw(this.ctx);
	  });
	}
	displayGameOver() {
	  // Clear the canvas
	  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
	  // Display the final score
	  this.ctx.font = "40px Arial";
	  this.ctx.fillStyle = "black";
	  this.ctx.fillText(
		"Final Score: " + this.score,
		this.canvas.width / 2 - 100,
		this.canvas.height / 2 - 40
	  );
  
	  // Display the "Game Over" image
	  const gameOverImage = new Image();
	  gameOverImage.src = "../images/game-over.png";
	  gameOverImage.onload = () => {
		const imageWidth = 200; // Width of the game over image
		const imageHeight = 100; // Height of the game over image
		const imageX = this.canvas.width / 2 - imageWidth / 2; // X position to center the image horizontally
		const imageY = this.canvas.height / 2 + 20; // Y position for the image
  
		// Draw the image on the canvas
		this.ctx.drawImage(gameOverImage, imageX, imageY, imageWidth, imageHeight);
	  };
	}
	
  
	// Função para atualizar a lógica do jogo
	update() {
	  if (this.isGameOver) {
		clearInterval(this.intervalId);
		this.displayGameOver();
		return;
	  }
  
	  // Movimentar o jogador
	  if (this.keys.ArrowLeft && this.player.x > 0) {
		this.player.moveLeft();
	  } else if (
		this.keys.ArrowRight &&
		this.player.x + this.player.width < this.canvas.width
	  ) {
		this.player.moveRight();
	  }
  
	  // Verificar colisão com obstáculos
	  this.obstacles.forEach((obstacle) => {
		if (this.player.checkCollision(obstacle)) {
		  this.isGameOver = true;
		}
	  });
  
	  // Mover os obstáculos
	  this.moveObstacles();
  
	  // Atualizar o desenho do cenário
	  this.drawScene();
  
	  // Chamar a próxima atualização do jogo
	  requestAnimationFrame(this.update.bind(this));
	}
  
	// Função para criar obstáculos
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
	
  
	// Função para mover os obstáculos
	moveObstacles() {
	  this.obstacles.forEach((obstacle) => {
		obstacle.y += 1; // Velocidade de movimento dos obstáculos
  
		if (obstacle.y > this.canvas.height) {
		  // Remover obstáculo se passar do limite
		  const index = this.obstacles.indexOf(obstacle);
		  this.obstacles.splice(index, 1);
		  this.score += 1; // Incrementar pontuação quando obstáculo é evitado
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
	  //q: how to speed up the player
	  //a: add a speed parameter to the constructor and use it in the move methods below 
	  this.speed = speed;
	  this.speed = speed;
	  this.image = new Image();
	  this.image.src = imageSrc;
	}
  
	// Função para desenhar o jogador
	draw(ctx) {
	  ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
  
	// Função para mover o jogador para a esquerda
	moveLeft() {
	  this.x -= this.speed 
	}
	// Função para mover o jogador para a direita
	moveRight() {
	  this.x += this.speed;
	}
  
	// Função para verificar colisão com um obstáculo
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
  
	// Função para desenhar o obstáculo
	draw(ctx) {
	  ctx.fillStyle = this.color;
	  ctx.fillRect(this.x, this.y, this.width, this.height);
	}
  }
  
  // Criação do objeto Game e início do jogo
  window.onload = () => {
	document.getElementById("start-button").onclick = () => {
	  const game = new Game("canvas");
	  game.start();
	};
  };
  
  
  
  
  
  
  