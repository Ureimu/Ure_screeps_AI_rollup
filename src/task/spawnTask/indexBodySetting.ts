export function roleListx() {
    let roleList_x: { [name: string]: bpgGene[] } = {
        //roomMaintance
        harvestSource: [{ move: 1, work: 2 }, { carry: 1 }],
        buildAndRepair: [{ move: 1, work: 1, carry: 1 }],
        carrySource: [{ move: 1, carry: 2 }],
        upgradeController: [{ move: 1, carry: 1, work: 1 }],
        carryResource: [{ move: 1, carry: 2 }],
        //war
        sledge: [{ move: 1, work: 1 }],
        aio: [{ move: 2, ranged_attack: 1, heal: 1 }]
    };
    return roleList_x;
}
