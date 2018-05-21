import global from "./global";
import netControl from "./Net/NetControl";

cc.Class({
    extends: cc.Component,

    properties: {
        angle: 30,
    },

    onLoad: function(){
        this.velocity = {
            x: 20 * Math.sin(Math.PI / 180 * this.angle),
            y: 10
        };
        this.size = cc.director.getWinSize();
    },
    onStartDrop: function () {
        this.schedule(this.onDrop, 0);
    },
    onDrop: function () {
        if (2 !== global.state) return;
        if (this.node.y <= -this.size.height/2 + 10 ) {
            this.velocity.y = Math.abs(this.velocity.y) * global.absorb;
        } else if (this.node.y >= this.size.height/2 - 10 ) {
            this.velocity.y = -1 * Math.abs(this.velocity.y) * global.absorb;
        }
        if (this.node.x <= -this.size.width/2 + 10 ) {
            this.velocity.x = Math.abs(this.velocity.x) * global.absorb
        } else if (this.node.x >= this.size.width/2 - 10) {
            this.velocity.x = -1 * Math.abs(this.velocity.x) * global.absorb;
        }
        this.node.x += this.velocity.x;
        this.node.y += this.velocity.y;
        this.velocity.y -= global.gravity;
        console.log(this.velocity.y);
    },

    start () {

    },
});
