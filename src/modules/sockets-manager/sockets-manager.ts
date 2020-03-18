import * as WebSocket from 'ws';
import * as http from 'http';

export class SocketsManager {
    static wss: WebSocket.Server;

    static init(server: http.Server) {
        this.wss = new WebSocket.Server({server});
        this.wss.on('connection', (ws: WebSocket) => {
            console.log('WebSocket - Connection established');
        });
    }

    static sendMessage(message: Object) {
        this.wss.clients.forEach((client: WebSocket) => {
            client.send(JSON.stringify(message));
        });
    }
}
