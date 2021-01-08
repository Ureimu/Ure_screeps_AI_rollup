import { roleBodySettingList } from "task/taskClass/RoleBodySetting";

export function getRoleBodyList(room: Room): roleBodySettingList {
    const level = room.controller?.level as number;
    const roleListX: roleBodySettingList = {
        roomMaintenance: () => {
            return {
                harvestSource: {
                    bodysetting: [{ move: 1, work: 2 }, { carry: level >= 4 ? 4 : 1 }],
                    maxBodyParts: 50
                },
                buildAndRepair: {
                    bodysetting: [{ move: 1, work: 1, carry: 1 }],
                    maxBodyParts: 25
                },
                carrySource: {
                    bodysetting: [{ move: 1, carry: 2 }],
                    maxBodyParts: 50
                },
                upgradeController: {
                    bodysetting: [{ move: 1, carry: 1, work: 1 }],
                    maxBodyParts: 50
                },
                carryResource: {
                    bodysetting: [{ move: 1, carry: 2 }],
                    maxBodyParts: 50
                },
                centerCarry: {
                    bodysetting: [{ carry: 1 }, { move: 1 }],
                    maxBodyParts: 33
                }
            };
        },
        war: () => {
            return {
                sledge: {
                    bodysetting: [{ move: 1, work: 1 }],
                    maxBodyParts: 50
                },
                aio: {
                    bodysetting: [{ move: 2, ranged_attack: 1, heal: 1 }],
                    maxBodyParts: 50
                }
            };
        },
        outwardsSource: () => {
            return {
                sourceScout: {
                    bodysetting: [{ move: 1 }],
                    maxBodyParts: 1
                },
                oHarvestSource: {
                    bodysetting: [{ move: 1, work: 2 }, { carry: 1 }],
                    maxBodyParts: 15
                },
                oUpgradeController: {
                    bodysetting: [{ move: 2, work: 1, carry: 1 }],
                    maxBodyParts: 24
                },
                oClaim: {
                    bodysetting: [{ claim: 1, move: 1 }],
                    maxBodyParts: 4
                },
                oCarrier: {
                    bodysetting: [{ move: 1, carry: 2 }],
                    maxBodyParts: 30
                },
                oInvaderCoreAttacker: {
                    bodysetting: [{ move: 4, attack: 4 }],
                    maxBodyParts: 16
                },
                oInvaderAttacker: {
                    bodysetting: [{ move: 5, attack: 4, ranged_attack: 1, heal: 1 }],
                    maxBodyParts: 22
                }
            };
        }
    };
    return roleListX;
}
