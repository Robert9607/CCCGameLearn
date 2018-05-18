var net = require('./Net/NetControl')

cc.Class({
    extends: cc.Component,

    properties: {
        main_world_prefab: {
            default: null,
            type: cc.Prefab
        },
    },

    onLoad: function () {
        net.connect();
        net.send("hello serve");        
        this.enterMainWorld();
        this.node.on("enterMainWorld",this.enterMainWorld,this);
    },
    enterMainWorld: function(event){
        if(this.runningWorld != undefined){
            this.runningWorld.removeFromParent(true);
        }
        this.runningWorld = cc.instantiate(this.main_world_prefab);
        this.runningWorld.parent = this.node;
    },

});