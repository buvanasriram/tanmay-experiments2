class Catapult extends BaseClass {
    constructor(x, y, width, height, img){
      super(x,y,width,height);
      Matter.Body.setStatic(this.body, true)
   //   Matter.Body.setAngle(this.body, -30)
      this.image = loadImage(img);
      
    }
  };
  