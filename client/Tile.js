export class Tile
{
    constructor(player)
    {
        this.player = player;
    }

    SetEmpty()
    {
        this.player = undefined;
    }

    IsEmpty()
    {
        return this.player == undefined;
    }
}