//定义全局的变量
import NetConfig from "./NetConfig";
import global from "../global";
import CMD from "./CMD";
var SendList = [];
const NetControl = function (obj) {
    let _sock = {};
    obj.connect = function () {
        if (_sock.readyState !== 1) {
            //当前接口没有打开
            //重新连接
            _sock = new WebSocket(NetConfig.host + ":" + NetConfig.port);
            _sock.onopen = _onOpen.bind(obj);
            _sock.onclose = _onClose.bind(obj);
            _sock.onmessage = _onMessage.bind(obj);
        }
    };
    let _onOpen = function () {
        _send();
        _sendHeart();
        _sendPos();
        global.eventlistener.fire('connect');
    };
    let _onClose = function (err) {
    };
    let _onMessage = function (obj) {
        console.log("on message");
        var msgData = obj.data;
        var jsonData = JSON.parse(msgData);
        console.log(jsonData.code);
        if (CMD.S_to_C.sign === jsonData.code) {
            console.log('sign');
            global.sign = jsonData.data.sign;
        } else if (CMD.S_to_C.updataOthers === jsonData.code) {
            //global.eventlistener.fire('updataOthers', jsonData.data);
        } else if (CMD.S_to_C.startMove === jsonData.code) {
            //global.eventlistener.fire('startMove', jsonData.data);
        } else if (CMD.S_to_C.touchMove === jsonData.code) {
            global.eventlistener.fire('otherMove', jsonData.data);
        }
    };

    obj.send = function (msg) {
        SendList.push(msg);
    };

    let _send = function () {
        if (SendList.length > 0) {
            let msg = SendList.splice(0, 1);
            msg[0].data.time = Date.parse(new Date());
            _sock.send(JSON.stringify(msg[0]));
        }
        setTimeout(_send, 0);
    };

    let _sendHeart = function () {
        obj.send({
            code: CMD.C_to_S.heart,
            data: {
            }
        });
        setTimeout(_sendHeart, 5000);
    };

    let _sendPos = function () {
        if (global.needSend) {
            global.needSend = false;
            obj.send({
                code: CMD.C_to_S.touch,
                data: {
                    sPos: global.sPos,
                    speed: global.speed,
                    radian: global.radian,
                }
            });
        }
        setTimeout(_sendPos, 0);
    };
    return obj;
};
export default NetControl;