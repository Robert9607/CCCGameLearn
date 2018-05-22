var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({ port: 8181 });

const CMD = {
	S_to_C: {
		sign: 1001,
		newClientJoin: 1002,
		updataOthers: 1003,
		startMove: 1004,
		touchMove: 1005,
	},
	C_to_S: {
		position: 1001,
		startGame: 1002,
		heart: 1003,
		touch: 1004,
	}
};

var clientList = [1, 1];
var sign = 0;
var length = 0;
var readyNum = 0;
var pos = [{ x: 0, y: 0 }, { x: 0, y: 0 }];

function sysn() {
	length = 0;
	readyNum = 0;
	for (let i = 0; i < clientList.length; i++) {
		if (clientList[i] && clientList[i] !== 1 && clientList[i].readyState === clientList[i].OPEN) {
			length++;
			if (clientList[i].ready) {
				readyNum++;
			}
			console.log('clientID ' + clientList[i].clientID);
		} else {
			clientList[i] = 1;
			sign = i;
			console.log('undefined ' + clientList[i]);
		}
	}
}

function sendMsg(index, msg) {
	if (clientList[index] && clientList[index] !== 1
		&& clientList[index].readyState === clientList[index].OPEN) {
		msg.data.time = Date.parse(new Date());
		clientList[index].send(JSON.stringify(msg));
	}
}

function sendPos(index, data) {
	if (!(clientList[index] && clientList[index] !== 1
		&& clientList[index].readyState === clientList[index].OPEN)) {
		return;
	}
	var tPos = { x: 0, y: 0 };
	let timeTatol = clientList[0].timeModified + clientList[1].timeModified;
	tPos.x = data.sPos.x + timeTatol * data.speed * Math.sin(data.radian);
	tPos.y = data.sPos.y + timeTatol * data.speed * Math.cos(data.radian);
	data.tPos = tPos;
	var connect = {
		code: CMD.S_to_C.touchMove,
		data: data
	};
	sendMsg(index, connect);
}

wss.on('connection', function (ws) {
	console.log('client connected');
	sysn();
	if (length >= 2) {
		ws.close();
	}
	clientList[sign] = ws;
	ws.clientID = sign;
	ws.ready = false;
	ws.on('message', function (message) {
		let time = Date.parse(new Date());
		var jsonData = JSON.parse(message);
		if (CMD.C_to_S.position === jsonData.code) {//位置移动
			var index = (ws.clientID + 1) % 2;
			var connect = {
				code: CMD.S_to_C.updataOthers,
				data: jsonData.data
			};
			pos[index] = jsonData.data;
			sendMsg(index, connect);
		} else if (CMD.C_to_S.startGame === jsonData.code) {//玩家准备好了
			ws.ready = true;
			sysn();
			if (2 === readyNum) {
				for (let i = 0; i < 2; i++) {
					var connect = {
						code: CMD.S_to_C.startMove,
						data: pos[i]
					};
					sendMsg(i, connect);
				}
			}
		} else if (CMD.C_to_S.heart === jsonData.code) {
			ws.timeModified = jsonData.data.time - time;
		} else if (CMD.C_to_S.touch === jsonData.code) {
			var index = (ws.clientID + 1) % 2;
			sendPos(index, jsonData.data);
		}
	});
	ws.send(JSON.stringify({ code: CMD.S_to_C.sign, data: { sign: ws.clientID } }));
});


