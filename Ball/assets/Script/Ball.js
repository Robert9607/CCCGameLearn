import GameData from "./GameData";
cc.Class({
    extends: cc.Component,

    properties: {
        angle: 30,
        state: true,
    },

    onLoad: function(){
        this.velocity = {
            x: 20 * Math.sin(Math.PI / 180 * this.angle),
            y: 10
        };
        this.size = cc.director.getWinSize();
        console.log(this.size);
        this.initTouch();
    },
    initTouch: function () {
        this.touchAble = false;
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            if (!this.state) {
                return;
            }
            var x = event.getDeltaX();
            var y = event.getDeltaY();
            this.node.x += x;
            this.node.y += y;
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if (!this.state) {
                return;
            }
            this.state = false;
        }, this);
    },
    onStartDrop: function () {
        this.schedule(this.onDrop, 0);
    },
    onDrop: function () {
        if (this.state)
            return;
        if (this.node.y <= -this.size.height/2 + 10 ) {
            this.velocity.y = Math.abs(this.velocity.y) * GameData.absorb;
        } else if (this.node.y >= this.size.height/2 - 10 ) {
            this.velocity.y = -1 * Math.abs(this.velocity.y) * GameData.absorb;
        }
        if (this.node.x <= -this.size.width/2 + 10 ) {
            this.velocity.x = Math.abs(this.velocity.x) * GameData.absorb
        } else if (this.node.x >= this.size.width/2 - 10) {
            this.velocity.x = -1 * Math.abs(this.velocity.x) * GameData.absorb;
        }
        this.node.x += this.velocity.x;
        this.node.y += this.velocity.y;
        this.velocity.y -= GameData.gravity;
    },

    start () {

    },

});
