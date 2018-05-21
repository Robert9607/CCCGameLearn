import global from "./global";
import netControl from "./Net/NetControl";
import EventListener from "./Net/EventListener ";

const GameContoller = cc.Class({
    extends: cc.Component,

    properties: {
        main_world_prefab: {
            default: null,
            type: cc.Prefab
        },
        BGSound: {
            default: null,
            url: cc.AudioClip,
        },
    },

    onLoad: function () {
        global.eventlistener = EventListener({});
        netControl.connect();
        global.eventlistener.on("enterMainWorld", this.enterMainWorld.bind(this));
        cc.audioEngine.play(this.BGSound, true);
        global.eventlistener .fire('enterMainWorld');
    },
    enterMainWorld: function (event) {
        if (this.runningWorld != undefined) {
            this.runningWorld.removeFromParent(true);
        }
        this.runningWorld = cc.instantiate(this.main_world_prefab);
        this.runningWorld.parent = this.node;
    },

});

export default GameContoller;