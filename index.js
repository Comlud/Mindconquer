const Server = require('./Server.js');
const Player = require('./Player.js');
const Board = require('./Board.js');
const Vector = require('./Vector.js');

let server = new Server(2000);
let players = {};
let board = new Board(10, 10);

server.OnPlayerConnect(socket =>
    {
        console.log('Connection.');

        server.OnPlayerDisconnect(socket, () =>
            {
                // Check that the player has actually joined and not just connected.
                if (players[socket.id])
                {
                    console.log(players[socket.id].name + ' left.');
                    delete players[socket.id];
                }
            }
        );

        server.OnPlayerJoin(socket, name =>
            {
                if (players[socket.id])
                {
                    console.log(players[socket.id].name + ' is trying to join more than once!');
                    return;
                }

                // Add player to list.
                const colors = [ '#22577A', '#38A3A5', '#57CC99', '#80ED99', '#C7F9CC' ];
                console.log(name + ' joined.');
                players[socket.id] = new Player(socket.id, name, colors[Object.keys(players).length % colors.length]);

                server.OnPlayerPacketReceived(socket, 'move', data =>
                    {
                        // Validate package.
                        if (!data.hasOwnProperty('x') || !data.hasOwnProperty('y'))
                        {
                            console.log(players[socket.id].name + ' sent an invalid \'move\' package!');
                            return;
                        }

                        // Update board.
                        const position = new Vector(data.x, data.y);
                        if (board.IsValidPosition(position))
                        {
                            board.SetTileWithLogic(position, players[socket.id]);
                        }

                        // Send board information to the players.
                        server.BroadcastServerPacket('board', board);
                    }
                );
            }
        );
    }
);

server.Start();