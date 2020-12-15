/* eslint-disable camelcase */
interface Room {
    update(): void;
    update<T extends StructureConstant>(type: T): Id<T> | undefined;
    mass_stores?: AnyStructure[];
    deposit?: Deposit[];
    source?: Source[];
    mineral?: Mineral;
    my: boolean;
    level: number;
    // readonly [ResourceConstant: string]: number | undefined;
    // readonly [id: string]: AnyStructure | undefined;
    // readonly [multipleStructure: string]: multipleStructure[] | undefined;
    // readonly [singleStructure: string]: singleStructure | undefined;
}

type ResourceConstantNum = Record<ResourceConstant, number | undefined>;

type multipleStructureList =
    | STRUCTURE_SPAWN
    | STRUCTURE_EXTENSION
    | STRUCTURE_ROAD
    | STRUCTURE_WALL
    | STRUCTURE_RAMPART
    | STRUCTURE_KEEPER_LAIR
    | STRUCTURE_PORTAL
    | STRUCTURE_LINK
    | STRUCTURE_TOWER
    | STRUCTURE_LAB
    | STRUCTURE_CONTAINER
    | STRUCTURE_POWER_BANK;

type singleStructureList =
    | STRUCTURE_OBSERVER
    | STRUCTURE_POWER_SPAWN
    | STRUCTURE_EXTRACTOR
    | STRUCTURE_NUKER
    | STRUCTURE_FACTORY
    | STRUCTURE_INVADER_CORE;

type singleStructure = ConcreteStructure<singleStructureList>;
type multipleStructure = ConcreteStructure<multipleStructureList>;
