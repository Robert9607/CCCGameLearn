var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({ port: 8181 });
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
			clientList[i].send(JSON.stringify({ code: 1002, data: clientList[i].clientID + 'new client join!' }));
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
function sendMsg(index, data) {
	if (clientList[index] && clientList[index] !== 1
		&& clientList[index].readyState === clientList[index].OPEN) {
		clientList[index].send(data);
	}
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
		console.log('received: %s', message);
		var jsonData = JSON.parse(message);
		if (1001 === jsonData.code) {//位置移动
			var index = (ws.clientID + 1) % 2;
			var connect = JSON.stringify({
				code: 1002,
				data: jsonData.data
			});
			pos[index] = jsonData.data;
			//sendMsg(index, connect);
		} else if (1002 === jsonData.code) {//玩家准备好了
			ws.ready = true;
			sysn();
			console.log(readyNum);

			if (2 === readyNum) {
				for (let i = 0; i < 2; i++) {
					var connect = JSON.stringify({
						code: 1003,
						data: pos[i]
					});
					sendMsg(i, connect);
				}
				/*var connect1 = JSON.stringify({
					code: 1003,
					data: {}
				});
				sendMsg(0, connect1);
				sendMsg(1, connect2);*/
			}
		}
		//console.log(jsonData.code+jsonData.data);
	});
	ws.send(JSON.stringify({ code: 1001, data: { sign: ws.clientID } }));

});
