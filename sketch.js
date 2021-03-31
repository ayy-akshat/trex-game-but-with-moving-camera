var cloud1, cloud2, cloud3, cloudImg;
var clouds;
var ground;
var colGround;
var trex, trex_running, trexStop;
var edges;
var groundImage;
var obstacle, obstImgs;
var gameOver, gameOverImg;
var restart, restartImg;

var score;

var PLAY = 1;
var END = 0;

var gameState;

var obstacles;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexStop = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  cloudImg = loadImage("cloud.png");
  obstImgs = 
  [
    loadImage('obstacle1.png'),
    loadImage('obstacle2.png'),
    loadImage('obstacle3.png'),
    loadImage('obstacle4.png'),
    loadImage('obstacle5.png'),
    loadImage('obstacle6.png')
  ];
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  score = 1;
  
  gameState = PLAY;
  
  obstacles = createGroup();
  
  clouds = createGroup();

  cloud1 = createSprite(600, random(50, 150));
  cloud1.velocityX = -3;
  cloud1.addImage("cloud", cloudImg);
  cloud1.scale = 1;
  cloud2 = createSprite(800, random(50, 150));
  cloud2.velocityX = -3;
  cloud2.addImage("cloud", cloudImg);
  cloud2.scale = 1;
  cloud3 = createSprite(1000, random(50, 150));
  cloud3.velocityX = -3;
  cloud3.addImage("cloud", cloudImg);
  cloud3.scale = 1;

  clouds.add(cloud1);
  clouds.add(cloud2);
  clouds.add(cloud3);

  ground = createSprite(200, 180, 400, 2);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  
  // creating trex
  trex = createSprite(50, 160);
  trex.velocityX = 5;
  trex.addAnimation("running", trex_running);
  trex.addAnimation("done", trexStop);
  trex.setCollider("rectangle", 0, 0, 40, 100);
  // trex.debug = true;
  
  trex.scale = 0.5;
  trex.x = 50

  colGround = createSprite(50, 190, 50, 5);
  colGround.visible = false;
  
  gameOver = createSprite(300, 100);
  gameOver.addImage("gameOver", gameOverImg);
  gameOver.visible = false;
  gameOver.scale = 0.5;
  
  restart = createSprite(300, 140);
  restart.addImage("restart", restartImg);
  restart.visible = false;
  restart.scale = 0.5;
  
  camera.zoom = height/800;
}

function draw() {
  //set background color
  background("white");

  camera.position.x = trex.x + width/4;
  camera.position.y = 0;
  gameOver.position.x = camera.position.x;
  restart.position.x = camera.position.x;
  
  if (gameState == PLAY){
    trex.velocityX = 12 + score/100;
    if (trex.velocityX > 30)
    {
      trex.velocityX = 30;
    }
    colGround.x = trex.x;
    colGround.velocityX = trex.velocityX;

    
    score *= 1.01;
    
    trex.velocityY += 0.6;
    
    if ((ground.x + ground.width/4) < trex.x) {
      ground.x += ground.width / 2;
      console.log('yes');
    }
    
    if ((keyDown("space") || keyDown('up') || mouseIsPressed) && trex.y > 150) {
      trex.velocityY = -10;
    }
    
    for (var i = 0; i < clouds.length; i++) {
      if (clouds[i].x < camera.position.x - 400) {
        clouds[i].x = camera.position.x + 400;
        clouds[i].y = random(50, 150);
        clouds[i].scale = 1;
      }
    }
    
    SpawnObstacle();
    
    if (trex.isTouching(obstacles)){
      gameState = END;
    }
    
    trex.changeAnimation("running", trex_running);
    
    clouds.setVelocityXEach(3);
    
    gameOver.visible = false;
    restart.visible = false;
    
  }else if (gameState == END){
    trex.velocityX = 0;
    
    trex.velocityY = 0;
    
    trex.changeAnimation("done", trexStop);

    obstacles.setLifetimeEach(-1);
    clouds.setVelocityXEach(0);
    
    if (mousePressedOver(restart) || keyWentDown('space') || keyWentDown('up')){
      reset();
    }
    
    gameOver.visible = true;
    restart.visible = true;
  }
  
  text("Score: " + Math.round(score), camera.position.x - width/10, 50);
  
  trex.collide(colGround);

  drawSprites();
}

function SpawnObstacle() {
  if (frameCount % 60 === 0) {
    obstacle = createSprite(camera.position.x + 400, 163, 10, 40);
    var rand = Math.round(random(0, 5));
    obstacle.addImage(obstImgs[rand]);
    obstacle.scale = 0.5;
    obstacle.lifetime = 250;
    obstacles.add(obstacle);
  }
}

function reset(){
  score = 1;
  obstacles.destroyEach();
  gameState = PLAY;
}
