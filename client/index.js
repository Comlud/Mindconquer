const socket = io('/');
//io.set('heartbeat interval', 20);
//io.set('heartbeat timeout', 60);

socket.emit('player-join', 'KFC');

socket.emit('move', { x: 2, y: 4 });
//setTimeout(() => socket.emit('move', { x: 4, y: 6 }), 2000);

socket.on('board', data =>
    {
        console.log(data);

        document.getElementById('game-div').innerHTML = '';

        for (let x = 0; x < data.width; x++)
        {
            for (let y = 0; y < data.height; y++)
            {
                const player = data.tiles[JSON.stringify({ x: x, y: y })].player;
                const color = player == undefined ? 'white' : player.color;

                CreateTile({ x: x, y: y }, color, player != undefined, data.width);
            }
        }
    }
);

function CreateTile(position, color, rised, width)
{
    const gameDiv = document.getElementById('game-div');

    let tileDiv = document.createElement('div');
    tileDiv.classList.add('tile-div');

    if (rised)
    {
        tileDiv.classList.add('rised');
    }

    tileDiv.style.backgroundColor = color;
    tileDiv.style.color = shadeColor(color, -50);
    tileDiv.style.top = position.y * 64;
    tileDiv.style.left = position.x * 64;
    tileDiv.style.zIndex = position.y * width + position.x;

    tileDiv.addEventListener('click', () =>
        {
            socket.emit('move', position);
        }
    )

    gameDiv.appendChild(tileDiv);
}

// https://stackoverflow.com/a/13532993/10483029
function shadeColor(color, percent) {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}