import Ball from "./Ball";
import global from "./global";
import netControl from "./Net/NetControl";

cc.Class({
    extends: cc.Component,

    properties: {
        ball: {
            default: [],
            type: Ball,
        },
        Bg: {
            default: null,
            type: cc.Node,
        },
        next: {
            default: null,
            type: cc.Button,
        },
        title: {
            default: null,
            type: cc.Label,
        },
        pengzhuangSound: {
            default: null,
            url: cc.AudioClip,
        },

    },

    // LIFE-CYCLE CALLBACKS:
    onLoad: function () {
        this.title.string = "开始";
        this.initTouch();
        global.eventlistener.on("updataOthers", this.updataOthers.bind(this));
        global.eventlistener.on("startMove", this.startMove.bind(this));
    },
    updataOthers: function (data) {
        var index = (global.sign + 1) % 2;
        this.ball[index].node.x = data.x;
        this.ball[index].node.y = data.y;
    },
    startMove: function (data) {
        console.log('start');
        var index = (global.sign + 1) % 2;
        this.ball[index].node.x = data.x;
        this.ball[index].node.y = data.y;
        global.state = 2;
        this.ball[0].onStartDrop();
        this.ball[1].onStartDrop();
        this.schedule(this.pengzhuang, 0);
    },
    initTouch: function () {
        this.Bg.on(cc.Node.EventType.TOUCH_START, function (event) {
        }, this);
        this.Bg.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            if (0 !== global.state) return;
            var x = event.getDeltaX();
            var y = event.getDeltaY();
            this.ball[global.sign].node.x += x;
            this.ball[global.sign].node.y += y;
            netControl.send(JSON.stringify({
                code: 1001,
                data: {
                    x: this.ball[global.sign].node.x,
                    y: this.ball[global.sign].node.y
                }
            }));
        }, this);
        this.Bg.on(cc.Node.EventType.TOUCH_END, function (event) {
            if (0 !== global.state) return;
            var x = event.getDeltaX();
            var y = event.getDeltaY();
            this.ball[global.sign].node.x += x;
            this.ball[global.sign].node.y += y;
            netControl.send(JSON.stringify({
                code: 1001,
                data: {
                    x: this.ball[global.sign].node.x,
                    y: this.ball[global.sign].node.y
                }
            }));
        }, this);
    },
    pengzhuang: function () {
        if (2 !== global.state) return;
        let ballBox1 = this.ball[0].node.getBoundingBox();
        let ballBox2 = this.ball[1].node.getBoundingBox();
        if (ballBox1.intersects(ballBox2)) {
            //如果他们速度和他们的位置
            let conditionX_1 = this.ball[0].velocity.x <= this.ball[1].velocity.x;
            let conditionX_2 = ballBox1.x <= ballBox2.x;
            let conditionY_1 = this.ball[0].velocity.y <= this.ball[1].velocity.y;
            let conditionY_2 = ballBox1.x <= ballBox2.x;
            if (conditionX_1 === conditionX_2 && conditionY_1 === conditionY_2) return;
            var velocityX = 0.5 * this.ball[0].velocity.x + this.ball[1].velocity.x;
            var velocityY = 0.5 * this.ball[0].velocity.y + this.ball[1].velocity.y;
            if (ballBox1.x < ballBox2.x) {
                this.ball[0].velocity.x = -1 * Math.abs(velocityX);
                this.ball[1].velocity.x = Math.abs(velocityX);
            } else {
                this.ball[1].velocity.x = -1 * Math.abs(velocityX);
                this.ball[0].velocity.x = Math.abs(velocityX);
            }
            if (ballBox1.y < ballBox2.y) {
                this.ball[0].velocity.y = -1 * Math.abs(velocityY);
                this.ball[1].velocity.y = Math.abs(velocityY);
            } else {
                this.ball[1].velocity.y = -1 * Math.abs(velocityY);
                this.ball[0].velocity.y = Math.abs(velocityY);
            }
            this.title.string = "碰撞";
            console.log('碰撞');
            //netControl.send("pengzhuangSound");
            cc.audioEngine.playEffect(this.pengzhuangSound, false);
        }
    },
    buttonClick: function () {
        this.title.string = "正在等待其他玩家";
        global.state = 1;
        this.next.node.active = false;
        netControl.send(JSON.stringify({
            code: 1002,
            data: {}
        }));
        // console.log('login button click = ' + global.type);
        // this.ball[0].unscheduleAllCallbacks();
        // this.ball[1].unscheduleAllCallbacks();
        // this.node.dispatchEvent(new cc.Event.EventCustom('enterMainWorld',true));
    },
    start() {

    },

    // update (dt) {},
});
