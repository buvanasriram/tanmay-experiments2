class SlingShot{
    constructor(bodyA, pointB){
        var options = {
            bodyA: bodyA,
            pointB: pointB,
            stiffness: 0.04,
            length: 10
        }
    
        this.pointB = pointB
        this.sling = Constraint.create(options);
        World.add(world, this.sling);
    }

    fly(){  
        this.sling.bodyA = null;
    }

    display(){
       // image(this.sling1, this.pointB.x,this.pointB.y-30, 50,150);
       // image(this.sling2, this.pointB.x-30,this.pointB.y-30, 50,80)
        if(this.sling.bodyA){
            
            var pointA = this.sling.bodyA.position;
            var pointB = this.pointB;
            stroke(48,22,8);
            if (pointA.x < 200) {
                strokeWeight(7);
                line(pointA.x, pointA.y, pointB.x+30, pointB.y);
                line(pointA.x, pointA.y, pointB.x+80, pointB.y-3);
                image(sling3Img, pointA.x-20, pointA.y-10,15,30)
            }
            else {
                strokeWeight(3);
                line(pointA.x+25, pointA.y, pointB.x+30, pointB.y);
                line(pointA.x+25, pointA.y, pointB.x+80, pointB.y-3);
                image(sling3Img, pointA.x+15, pointA.y-10,15,30)
            }
        
            
        }
    }
    
    attach(bodyA) {
        this.sling.bodyA = bodyA;
    }
}