const Vector = require('./Vector.js');
const Tile = require('./Tile.js');

module.exports = class Board
{
    constructor(width, height)
    {
        this.width = width;
        this.height = height;

        this.tiles = {};
        for (let x = 0; x < width; x++)
        {
            for (let y = 0; y < height; y++)
            {
                this.tiles[JSON.stringify(new Vector(x, y))] = new Tile(undefined);
            }
        }
    }

    GetTile(position)
    {
        return this.tiles[JSON.stringify(position)];
    }

    // Just sets a tile without considering game rules on how to fill in other tiles.
    SetTileWithoutLogic(position, player)
    {
        this.tiles[JSON.stringify(position)].player = player;
    }

    // Sets a tile and will fill in other tiles based on game rules.
    SetTileWithLogic(position, player)
    {
        this.SetTileWithoutLogic(position, player);

        this.FillTiles(position, player, new Vector(0, -1));    // North.
        this.FillTiles(position, player, new Vector(0, 1));     // South.
        this.FillTiles(position, player, new Vector(-1, 0));    // West.
        this.FillTiles(position, player, new Vector(1, 0));     // East.

        this.FillTiles(position, player, new Vector(-1, -1));   // North west.
        this.FillTiles(position, player, new Vector(1, -1));    // North east.
        this.FillTiles(position, player, new Vector(-1, 1));    // South west.
        this.FillTiles(position, player, new Vector(1, 1));     // South east.
    }

    FillTiles(position, player, direction)
    {
        const toPosition = this.FindClosestEqualTilePosition(position, player, direction);

        // toPosition is nullable.
        if (toPosition)
        {
            this.SetTiles(position, toPosition, direction, player);
        }
    }

    SetTiles(fromPosition, toPosition, direction, player)
    {
        // Deep copy.
        let position = JSON.parse(JSON.stringify(fromPosition));

        while (true)
        {
            if (this.IsValidPosition(position))
            {
                this.SetTileWithoutLogic(position, player);
            }

            position.x += direction.x;
            position.y += direction.y;

            if (position.x == toPosition.x && position.y == toPosition.y)
            {
                break;
            }
        }
    }

    FindClosestEqualTilePosition(startPosition, player, direction)
    {
        // Deep copy.
        let position = JSON.parse(JSON.stringify(startPosition));

        while (true)
        {
            position.x += direction.x;
            position.y += direction.y;

            if (this.IsValidPosition(position))
            {
                const tile = this.GetTile(position);

                if (tile.IsEmpty())
                {
                    break;
                }
                else if (tile.player.id == player.id)
                {
                    return position;
                }
            }
            else break;
        }

        return null;
    }

    IsValidPosition(position)
    {
        return position.x >= 0 && position.x < this.width && position.y >= 0 && position.y < this.height;
    }
}