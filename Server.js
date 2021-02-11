module.exports = class Server
{
    constructor(port)
    {
        this.port = port;

        this.express = require('express');
        this.app = this.express();
        this.server = require('http').Server(this.app);
        this.io = require('socket.io')(this.server);
    }

    OnPlayerConnect(callback)
    {
        this.io.on('connection', socket => callback(socket));
    }

    OnPlayerDisconnect(socket, callback)
    {
        socket.on('disconnect', () => callback());
    }

    OnPlayerJoin(socket, callback)
    {
        socket.on('player-join', name => callback(name));
    }

    OnPlayerPacketReceived(socket, packetName, callback)
    {
        socket.on(packetName, data => callback(data));
    }

    SendServerPacket(socket, packetName, data)
    {
        socket.emit(packetName, data);
    }

    BroadcastServerPacket(packetName, data)
    {
        this.io.sockets.emit(packetName, data);
    }

    Start()
    {
        // Configure express.
        this.app.use(this.express.static('client'));

        // Start server.
        this.server.listen(this.port);
        console.log('Server started on port ' + this.port + '.');
    }
}