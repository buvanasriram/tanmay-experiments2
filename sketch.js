const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var box1, enemy1;
var backgroundImg,platform;
var bird, slingshot1;
var gameState = "onSling", bg, score;
var flagBoy = 0;
var flagSlingL = 0;
var flagSlingR = 0;
var stone2Moving  = false;

var shield = null;
var numShields = 10; 
var hitsOnShield = 0;
var maxHitsOnShield = 3;
var collision1, collision2, collision3, collision4, collision5, collision6;
var numHits2 = 0;

function preload() {
    backgroundImg = loadImage("sprites/bg.png");
    sling1Img = loadImage("sprites/sling1.png");
    sling2Img = loadImage("sprites/sling2.png");
    sling3Img = loadImage("sprites/sling3.png");

}

function setup(){
    var canvas = createCanvas(displayWidth,displayHeight-100);
    engine = Engine.create();
    world = engine.world;


    ground = new Ground(width/2,height,width,20);

    // create objects on the left
    platform = new Ground(200, 455, 350, 270);
    boy = new PlayingChar(130,250, 80,150)
    stone = new Stone(200,200);    
    slingshot1 = new SlingShot(stone.body,{x:200, y:200});
    leftsling1 = new Catapult(270,250,50,150, "sprites/sling1.png");
    leftsling2 = new Catapult(240,220,50,80, "sprites/sling2.png");

   
    // create objects on the right   
   // level1 = new Ground(900,Math.round(random(300,700)), 300, 30 )
    //level1 = new Ground(width, height-100, 300, 30 )
    box1 = new Box(900,50,250,100);
    box2 = new Box(900,160,250,100);
    enemy1 = new NonPlayingChar(580,height-200, 100,200);
    stone2 = new Stone(900,10);
    
    rightsling1 = new Catapult(330,40,30,130, "sprites/sling1.png");
    rightsling2 = new Catapult(300,40,30,75, "sprites/sling2.png");

    score = 0;
    Matter.Events.on(engine, 'collisionStart', collision);
}

function draw(){
    background(backgroundImg);
    Engine.update(engine);

  //  text(mouseX+","+mouseY, mouseX, mouseY);
    textSize(20);
    fill("white");
    text("Score: "+ score, 50, 50)
    text("Hits On shield: " + hitsOnShield, 500,50);
    text("Max Hits allowed: "+ maxHitsOnShield, 500,70)
    text("Numhits event based: "+ numHits2, 500,90)

    ground.display();

    // left side - boy, platform and leftsling, stone
    platform.display();
    boy.display();
    stone.display();
    slingshot1.display();
    leftsling1.display();
    leftsling2.display();
    if (shield) shield.display();

    // right side - invisible level, stack of boxes, enemy and rightsling, stone2
    //level1.display();
    box1.display();
    box2.display();

    // enemy position is set according to box1 
    Matter.Body.setPosition(enemy1.body, {x:box1.body.position.x+70, y:box1.body.position.y-145});
    Matter.Body.setPosition(rightsling1.body, {x:box1.body.position.x-50,y:box1.body.position.y-115 })
    Matter.Body.setPosition(rightsling2.body, {x:box1.body.position.x-70,y:box1.body.position.y-145})

    enemy1.display();
    rightsling1.display();
    rightsling2.display();
  
    stone2.display();
   
    // stone2 hits boy
    collision1 = Matter.SAT.collides(stone2.body, boy.body);
    if (collision1.collided) flagBoy = 1;
    if (flagBoy === 1) {
        Matter.Body.setStatic(boy.body, false);
        text("game over", displayWidth/2, displayHeight/2)

    }
    // stone2 hits leftsling1 or 2
    collision2 = Matter.SAT.collides(stone2.body, leftsling1.body);
    if (collision2.collided) flagSlingL = 1;
    collision3 = Matter.SAT.collides(stone2.body, leftsling2.body);
    if (collision3.collided) flagSlingL = 1;
    if (flagSlingL === 1) {
        Matter.Body.setStatic(leftsling1.body, false);
        Matter.Body.setStatic(leftsling2.body, false);
        Matter.Body.setStatic(boy.body, false);
        text("game over", displayWidth/2, displayHeight/2)
    }

    // stone2 hits shield
    if (shield) {
        collision6 = Matter.SAT.collides(stone2.body, shield.body);
        if (collision6.collided) {
            hitsOnShield++; 
            console.log("hit");
        }
        if (hitsOnShield > maxHitsOnShield) {
            World.remove(world, shield);
            shield = null;
        }
    }

    // stone hits rightsling
    collision4 = Matter.SAT.collides(stone.body, rightsling1.body);
    if (collision4.collided) flagSlingR = 1;
    collision5 = Matter.SAT.collides(stone.body, rightsling2.body);
    if (collision5.collided) flagSlingR = 1;

    if (flagSlingR === 1) {
        Matter.Body.setStatic(rightsling1.body, false);
        Matter.Body.setStatic(rightsling2.body, false);
        score = score + 50;
        flagSlingR = 0;
    }
    
    if (frameCount%100 === 0 && stone2.body.speed < 1) stone2Moving = false;
    
    if (stone2Moving === false && flagSlingR === 0) {
        push();
        strokeWeight(3);
        var pointA = stone2.body.position;
        var pointB = {x: pointA.x-50, y:pointA.y - 50};
        stroke(48,22,8)
        line(pointA.x, pointA.y, rightsling2.body.position.x, rightsling2.body.position.y-30);
        line(pointA.x, pointA.y, rightsling1.body.position.x, rightsling1.body.position.y-50);
        pop();
    } 
    // automatically throw stone2 for every 200 frameCount and if enemy is standing 
    if (frameCount%200 === 0 && enemy1.body.speed < 1) {
        stone2Moving  = true;
        Matter.Body.setPosition(stone2.body, {x:enemy1.body.position.x-30, y:enemy1.body.position.y-50})
        Matter.Body.applyForce(stone2.body, {x:stone2.body.position.x, y:stone2.body.position.y}, {x:-130, y:-150});
    }
    
    // score
    box1.score();
    box2.score(); 
    enemy1.score();

}

function mouseDragged(){
    if (gameState === "onSling") {
        Matter.Body.setPosition(stone.body, {x: mouseX , y: mouseY});
    }
}

function mouseReleased(){
    slingshot1.fly();
    gameState = "launched"
}

function keyPressed() {
    if (keyCode === 32) {
        gameState = "onSling";
        Matter.Body.setPosition(stone.body, {x:200,y:200})
       slingshot1.attach(stone.body);
    }
    if (keyCode === 83 ) {//'s'
       // console.log(shield)
        if (shield === null && numShields > 0) 
        {
            shield = new Shield(300,250);
            numShields--;
            hitsOnShield = 0;
            
        }
        
    }
}
function collision(event) {
    var pairs = event.pairs;
    for (var i= 0; i < pairs.length; i++) {
      console.log("in collision "+i)
      var labelA = pairs[i].bodyA.label;
      var labelB = pairs[i].bodyB.label;
      if ((labelA === 'stone' && labelB === 'shield') ||
      (labelA === 'shield' && labelB === 'stone') ) {
        numHits2++;
      }
    }
 }

