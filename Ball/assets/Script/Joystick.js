import global from "./global";
cc.Class({
    extends: cc.Component,

    properties: {
        BG: {
            default: null,
            type: cc.Node,
        },
        Ball: {
            default: null,
            type: cc.Node,
        },
        angle: 0,
        radiu: 85,
    },

    onLoad: function () {
        this.size = this.BG.getContentSize();
        this.initTouch();
    },
    initTouch: function () {
        this.Ball.on(cc.Node.EventType.TOUCH_START, function (event) {
            global.speed = 1;
        }, this);
        this.Ball.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            var x = this.Ball.x + event.getDeltaX();
            var y = this.Ball.y + event.getDeltaY();

            let dist = cc.pDistance(cc.p(x, y), cc.p(0, 0));
            let radian = Math.atan2(x, y);
            if (global.radian !== radian) {
                global.needSend = true;
                global.radian = radian;
            }
            if (dist > this.radiu) {
                this.Ball.x = Math.sin(radian) * this.radiu;
                this.Ball.y = Math.cos(radian) * this.radiu;
            } else {
                this.Ball.x = x;
                this.Ball.y = y;
            }
        }, this);
        this.Ball.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.Ball.x = 0;
            this.Ball.y = 0;
            global.speed = 0;
            global.needSend = true;
        }, this);
        this.Ball.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            this.Ball.x = 0;
            this.Ball.y = 0;
            global.speed = 0;
            global.needSend = true;
        }, this);

    },
    start() {

    },

});