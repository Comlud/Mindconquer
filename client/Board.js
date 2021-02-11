import { Vector } from '/Vector.js';

export class Board
{
    constructor(width, height)
    {
        this.width = width;
        this.height = height;

        this.tiles = {};
    }
}