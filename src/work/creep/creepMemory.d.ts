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

type creepRoleConstant = "buildAndRepair" | "carryResource" | "sourceScout" | "oUpgradeController" | "oClaim";

type concreteCreepRoleMemory<T extends creepRoleConstant> = T extends "buildAndRepair"
    ? buildAndRepair
    : T extends "carryResource"
    ? carryResource
    : T extends "sourceScout"
    ? sourceScout
    : T extends "oUpgradeController"
    ? oUpgradeController
    : T extends "oClaim"
    ? oClaim
    : never;
interface CreepMemory {
    task: SpawnTaskInf & { taskInf?: BaseMemoryTaskInf };
    dontPullMe?: boolean;
}

interface RoleCreepMemory<T extends creepRoleConstant> {
    task: SpawnTaskInf & { taskInf?: concreteCreepRoleMemory<T> };
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

interface oUpgradeController extends BaseMemoryTaskInf {
    scoutRoomName: string;
}

interface oClaim extends BaseMemoryTaskInf {
    scoutRoomName: string;
}
