declare namespace NodeJS {
    interface Global {
        creepMemory: {
            [name: string]: {
                bundledPos?: RoomPosition;
                bundledUpgradePos?: RoomPosition;
                bundledStoragePos?: RoomPosition;
                bundledLinkPos?: RoomPosition;
            };
        };
    }
}

type creepRoleConstant = "buildAndRepair" | "carryResource" | "sourceScout";

type concreteCreepRoleMemory<T extends creepRoleConstant> = T extends "buildAndRepair"
    ? buildAndRepair
    : T extends "carryResource"
    ? carryResource
    : T extends "sourceScout"
    ? sourceScout
    : never;

interface CreepMemory {
    task: SpawnTaskInf & { taskInf?: BaseMemoryTaskInf };
    taskPool?: TaskPool;
    bodyparts: bpgGene[];
    dontPullMe?: boolean;
}

interface RoleCreepMemory<T extends creepRoleConstant> {
    task: SpawnTaskInf & { taskInf?: concreteCreepRoleMemory<T> };
    taskPool?: TaskPool;
    bodyparts: bpgGene[];
    dontPullMe?: boolean;
}

interface BaseMemoryTaskInf {
    state: number[];
    lastSource?: string;
}

interface buildAndRepair extends BaseMemoryTaskInf {
    lastRenovate: Id<AnyStructure> | null;
    lastRenovateHit: number;
}

interface carryResource extends BaseMemoryTaskInf {
    resourceType: ResourceConstant;
    structureCarryFrom: string;
    structureCarryTo: string;
    resourceNumber: number;
}

interface sourceScout extends BaseMemoryTaskInf {
    scoutRoomName: string;
}
