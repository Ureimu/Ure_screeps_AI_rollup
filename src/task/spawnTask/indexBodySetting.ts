export function roleListx(room: Room) {
    let level = <number>room.controller?.level;
    let roleList_x: roleSettingList = {
        //roomMaintance
        harvestSource: {
            bodysetting: [{ move: 1, work: 2 }, { carry: level >= 5 ? 4 : 0 }],
            numberSetting: 2,
            maxBodyParts:50,
        },
        buildAndRepair: {
            bodysetting: [{ move: 1, work: 1, carry: 1 }],
            numberSetting: level >= 5 ? 2 : 3,
            maxBodyParts:25,
        },
        carrySource: {
            bodysetting: [{ move: 1, carry: 2 }],
            numberSetting: 1,
            maxBodyParts:50,
        },
        upgradeController: {
            bodysetting: [{ move: 1, carry: 1, work: 1 }],
            numberSetting: 1,
            maxBodyParts:50,
        },
        carryResource: {
            bodysetting: [{ move: 1, carry: 2 }],
            numberSetting: 1,
            maxBodyParts:50,
        },
        centerCarry: {
            bodysetting: [{ carry: 1 }, { move: 1 }],
            numberSetting: 1,
            maxBodyParts:33,
        },
        //war
        sledge: {
            bodysetting: [{ move: 1, work: 1 }],
            numberSetting: 2,
            maxBodyParts:50,
        },
        aio: {
            bodysetting: [{ move: 2, ranged_attack: 1, heal: 1 }],
            numberSetting: 2,
            maxBodyParts:50,
        }
    };
    return roleList_x;
}
