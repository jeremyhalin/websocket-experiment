const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 9999});

wss.on('connection', function connection(ws, request, client) {
    ws.on('message', function incoming(data) {
        console.log('received: ', data);
        
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    })
})