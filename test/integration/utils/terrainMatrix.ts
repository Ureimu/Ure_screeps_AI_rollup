import * as _ from "lodash";

type TerrainTypes = "plain" | "wall" | "swamp";
const TYPES: TerrainTypes[] = ["plain", "wall", "swamp"];

export default class Matrix {
  private data: { [coords: string]: TerrainTypes };

  /**
        Constructor
    */
  public constructor() {
    this.data = {};
  }

  /**
        Getters
    */
  public get(x: number, y: number): TerrainTypes {
    return _.get(this.data, `${x}:${y}`, "plain");
  }

  /**
        Setters
    */
  public set(x: number, y: number, value: TerrainTypes): this {
    if (TYPES.includes(value)) {
      _.set(this.data, `${x}:${y}`, value);
    } else {
      throw new Error(`invalid value ${value}`);
    }
    return this;
  }

  /**
        Serialize the terrain for database storage
    */
  public serialize(): string {
    let str = "";
    for (let y = 0; y < 50; y += 1) {
      for (let x = 0; x < 50; x += 1) {
        const terrain = this.get(x, y);
        const mask = TYPES.indexOf(terrain);
        if (mask !== -1) {
          str += mask;
        } else {
          throw new Error(`invalid terrain type: ${terrain}`);
        }
      }
    }
    return str;
  }

  /**
        Return a string representation of the matrix
    */
  public static unserialize(str: string): Matrix {
    const matrix = new Matrix();
    _.each(str.split(""), (mask, idx) => {
      const x = idx % 50;
      const y = Math.floor(idx / 50);
      const terrain: TerrainTypes = _.get(TYPES, mask);
      if (terrain == null) {
        throw new Error(`invalid terrain mask: ${mask}`);
      } else if (terrain !== "plain") {
        matrix.set(x, y, terrain);
      }
    });
    return matrix;
  }

  /**
        Return a string representation of the matrix
    */
  public toStringTerrain(): string {
    let stringTerrain = "";
    for (let y = 0; y < 50; y += 1) {
      for (let x = 0; x < 50; x += 1) {
        const terrainType = this.get(x, y);
        if (terrainType === "plain") {
          stringTerrain += "0";
        } else if (terrainType === "wall") {
          stringTerrain += "1";
        } else if (terrainType === "swamp") {
          stringTerrain += "2";
        }
      }
      stringTerrain += "\n";
    }
    return stringTerrain;
  }
}
