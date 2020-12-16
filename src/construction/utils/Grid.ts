export class Grid {
    /** @var height */
    /** @var width */
    public width;
    public height;
    public arr: unknown[];

    /**
     * @param int
     * @param int
     */
    public constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.arr = [];
    }

    /**
     * @param int
     * @param int
     */
    public set(x: number, y: number, val: unknown): Grid {
        if (x > this.width || y > this.height) throw new RangeError("Out of bounds");
        const pos = y * this.height + x;
        this.arr[pos] = val;
        return this;
    }

    /**
     * @param int
     * @param int
     */
    public get(x: number, y: number): unknown {
        const pos = y * this.height + x;
        return this.arr[pos];
    }

    /**
     *
     */
    public toString(): string {
        return this.arr.toString();
    }
}
