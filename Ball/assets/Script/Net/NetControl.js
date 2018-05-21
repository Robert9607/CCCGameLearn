//定义全局的变量
import NetConfig from "./NetConfig";
import global from "../global";
const netControl = {
    _sock: {},  //当前的webSocket的对象
    connect: function () {
        if (this._sock.readyState !== 1) {
            //当前接口没有打开
            //重新连接
            this._sock = new WebSocket(NetConfig.host + ":" + NetConfig.port);
            this._sock.onopen = this._onOpen.bind(this);
            this._sock.onclose = this._onClose.bind(this);
            this._sock.onmessage = this._onMessage.bind(this);
        }
        return this;
    },

    _onOpen: function () {
        //this._sock.send("hello servers");
    },
    _onClose: function (err) {
        //this._sock.send("bye bye servers");
    },
    _onMessage: function (obj) {
        console.log("on message");
        var msgData = obj.data;
        var jsonData = JSON.parse(msgData);
        if (1001 === jsonData.code) {
            console.log('sign');
            global.sign = jsonData.data.sign;
        } else if (1002 === jsonData.code) {
            console.log('move');
            //global.eventlistener.fire('updataOthers', jsonData.data);
            // console.log('code ' + jsonData.code + ' x: ' + jsonData.data.x + ' y: ' + jsonData.data.y);
            // var event = new cc.Event.EventCustom('updataOthers', true);
            // event.setUserData(jsonData.data);
            // GameContoller.node.dispatchEvent(event);
        } else if (1003 === jsonData.code) {
            global.eventlistener.fire('startMove', jsonData.data);
        }
    },

    send: function (msg) {
        console.log(msg);
        this._sock.send(msg);
    },

};
export default netControl;