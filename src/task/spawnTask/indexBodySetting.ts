export function roleListx() {
    let roleList_x: { [name: string]: bpgGene[] } = {
        'harvestSource': [{ move: 1, work: 2 }, { carry: 1 }],
        'buildAndRepair': [{ move: 1, work: 1, carry: 1 }],
        'carrySource': [{ move: 1, carry: 2 }],
        'upgradeController': [{ move: 1, carry: 1, work: 1 }],
        'carryResource': [{ move: 1, carry: 2 }],
    };
    return roleList_x;
}
