class Box extends BaseClass {
  constructor(x, y, width, height){
    super(x,y,width,height);
    this.image = loadImage("sprites/wood1.png");
    this.visibility = 255;
  }
  display(){
    if (this.body.speed < 5 ) {
      super.display();
    }
    else {
      if (gameState == "launched") {
        World.remove(world,this.body);
        push();
        this.visibility = this.visibility-5;
        tint(255,this.visibility);
        image(this.image,this.body.position.x,this.body.position.y,50,50);
        pop();
      }
    }
  }
  score() {
    if (this.visibility < 0 && this.visibility > -105) {
      score++;
    }
  }
};
