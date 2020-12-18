export function getRoleBodyList(room: Room): roleBodySettingList {
    const level = room.controller?.level as number;
    const roleListX: roleBodySettingList = {
        roomMaintenance: {
            harvestSource: {
                bodysetting: [{ move: 1, work: 2 }, { carry: level >= 4 ? 4 : 0 }],
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
        },
        war: {
            sledge: {
                bodysetting: [{ move: 1, work: 1 }],
                maxBodyParts: 50
            },
            aio: {
                bodysetting: [{ move: 2, ranged_attack: 1, heal: 1 }],
                maxBodyParts: 50
            }
        }
    };
    return roleListX;
}
