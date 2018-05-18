var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({ port: 8181 });
var clientList = [];
wss.on('connection', function (ws) {
    console.log('client connected');
	clientList[clientList.length] = ws;
    ws.on('message', function (message) {
		//var msgData = message.data;
        console.log('received: %s', message);

        //var jsonData = JSON.parse(message);
        //console.log(jsonData.code+jsonData.data);
    });
	//ws.send("Hello client");
	for(let i = 0; i<clientList.length-1;i++){
		clientList[i].send(JSON.stringify({code: 001,data: 'new client join!'}));	
	}
	//ws.onclose();
	//wss.fire('synPlayerConnect');
    /*ws.on('pengzhaung', function (message) {
        console.log('碰撞');
    });*/
});
/*
wss.on('synPlayerConnect',function(evnet){
	for(let i = 0; i<clientList.length()-1;i++){
		clientList[i].send(JSON.stringify({code: 001,data: 'new client join!'}));	
	}
});*/
