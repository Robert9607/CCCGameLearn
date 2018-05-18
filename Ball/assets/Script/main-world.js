import Ball from "./Ball";
import GameData from "./GameData";
//const net = require('./Net/NetControl')
cc.Class({
    extends: cc.Component,

    properties: {
        ball: {
            default: [],
            type: Ball,
        },
        next: {
            default: null,
            type: cc.Button,
        },
        title: {
            default: null,
            type: cc.Label,
        },
        BGSound: {
            default: null,
            url: cc.AudioClip,
        },
        pengzhuangSound: {
            default: null,
            url: cc.AudioClip,
        },

    },

    // LIFE-CYCLE CALLBACKS:
    onLoad: function () {
        if (GameData.current === undefined) {
            GameData.current = cc.audioEngine.play(this.BGSound, true);
        } 
        if (0 === GameData.type) {
            this.ball[1].node.active = false;
            this.ball[0].onStartDrop();
        } else if (1 === GameData.type) {
            this.ball[0].onStartDrop();
            this.ball[1].onStartDrop();
            this.schedule(this.pengzhuang, 0);
        }
        var title = ["case1","case2"];
        this.title.string = title[GameData.type];

    },
    pengzhuang: function () {
        let ballBox1 = this.ball[0].node.getBoundingBox();
        let ballBox2 = this.ball[1].node.getBoundingBox();
        if (ballBox1.intersects(ballBox2)) {
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
            this.ball[0].state = false;
            this.ball[1].state = false;
            cc.audioEngine.playEffect(this.pengzhuangSound, false);
        }
    },
    buttonClick: function () {
        GameData.type++;
        GameData.type %= 2;
        console.log('login button click = ' + GameData.type);
        this.ball[0].unscheduleAllCallbacks();
        this.ball[1].unscheduleAllCallbacks();
        this.node.emit('enterMainWorld');
        this.node.dispatchEvent(new cc.Event.EventCustom('enterMainWorld',true));
        //GameController.enterMainWorld();
    },
    start() {

    },

    // update (dt) {},
});
