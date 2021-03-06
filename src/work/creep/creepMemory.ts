import { SpawnTaskInf } from "task/taskClass/extends/SpawnTask";

export type creepRoleConstant =
    | "buildAndRepair"
    | "carryResource"
    | "sourceScout"
    | "oUpgradeController"
    | "oClaim"
    | "oCarrier"
    | "oInvaderCoreAttacker"
    | "oInvaderAttacker";

export type concreteCreepRoleMemory<T extends creepRoleConstant> = T extends "buildAndRepair"
    ? buildAndRepair
    : T extends "carryResource"
    ? carryResource
    : T extends "sourceScout"
    ? sourceScout
    : T extends "oUpgradeController"
    ? oUpgradeController
    : T extends "oClaim"
    ? oClaim
    : T extends "oCarrier"
    ? oCarrier
    : T extends "oInvaderCoreAttacker"
    ? oInvaderCoreAttacker
    : T extends "oInvaderAttacker"
    ? oInvaderAttacker
    : never;

declare global {
    interface CreepMemory {
        task: SpawnTaskInf & { taskInf?: BaseMemoryTaskInf };
        dontPullMe?: boolean;
    }
}

export interface RoleCreepMemory<T extends creepRoleConstant> {
    task: SpawnTaskInf & { taskInf?: concreteCreepRoleMemory<T> };
    dontPullMe?: boolean;
}

export interface BaseMemoryTaskInf {
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

interface oCarrier extends BaseMemoryTaskInf {
    scoutRoomName: string;
}
interface oInvaderCoreAttacker extends BaseMemoryTaskInf {
    scoutRoomName: string;
}

interface oInvaderAttacker extends BaseMemoryTaskInf {
    scoutRoomName: string;
}
