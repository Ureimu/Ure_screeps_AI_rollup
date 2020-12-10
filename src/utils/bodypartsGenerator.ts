export function bpg(bodyparts: bpgGene[]): BodyPartConstant[] {
    /**
     *一个bodyparts生成器。
    具体使用示例：
    传入：[{'move':1,'work':1},{'move':2,'carry':2}]
    传出：['move','work','move','move','carry','carry']
    repeat属性不可以为0！
    *
    * @param {Array<bpgGene>} bodyparts 一个由多个bpgGene类型构成的数组。
    * @returns {BodyPartConstant[]} 身体部件常量列表。
    */
    let bodypartsList: BodyPartConstant[] = [];
    for (let i = 0, j = bodyparts.length; i < j; i++) {
        let repeatNum = 1;
        if (bodyparts[i].repeat !== undefined && bodyparts[i].repeat !== 0) {
            repeatNum = bodyparts[i].repeat as number;
        }
        if (repeatNum === 1) {
            for (const key in bodyparts[i]) {
                if (BODYPARTS_ALL.includes(key as BodyPartConstant)) {
                    for (let i1 = 0, j1 = bodyparts[i][key as BodyPartConstant] as number; i1 < j1; i1++) {
                        bodypartsList.push(key as BodyPartConstant);
                    }
                }
            }
        } else {
            const nowList: BodyPartConstant[] = [];
            for (const key in bodyparts[i]) {
                if (BODYPARTS_ALL.includes(key as BodyPartConstant)) {
                    for (let i1 = 0, j1 = bodyparts[i][key as BodyPartConstant] as number; i1 < j1; i1++) {
                        nowList.push(key as BodyPartConstant);
                    }
                }
            }
            for (let k = 0; k < repeatNum; k++) {
                bodypartsList = bodypartsList.concat(nowList);
            }
        }
    }
    global.GenedGetBodyparts = bodyparts;
    global.GenedBodypartsList = bodypartsList;
    return bodypartsList;
}

export function getBpNum(bodyparts: bpgGene[], bodypartName?: BodyPartConstant): number {
    /**
     *一个bodyparts生成器。
    具体使用示例：
    传入：[{'move':1,'work':1},{'move':2,'carry':2}]
    传出：['move','work','move','move','carry','carry']
    *
    * @param {Array<bpgGene>} bodyparts 一个由多个bpgGene类型构成的数组。
    * @returns {BodyPartConstant[]} 身体部件常量列表。
    */
    let bodypartNumber = 0;
    for (let i = 0, j = bodyparts.length; i < j; i++) {
        let repeatNum = 1;
        if (bodyparts[i].repeat !== undefined) {
            repeatNum = bodyparts[i].repeat as number;
        }
        for (const key in bodyparts[i]) {
            if (typeof bodypartName !== "undefined") {
                if (key === bodypartName) {
                    bodypartNumber += (bodyparts[i][key] as number) * repeatNum;
                }
            } else {
                if (BODYPARTS_ALL.includes(key as BodyPartConstant)) {
                    bodypartNumber += (bodyparts[i][key as BodyPartConstant] as number) * repeatNum;
                }
            }
        }
    }
    global.GenedGetBodypartsNum = bodyparts;
    global.GenedBodypartsNum = bodypartNumber;
    return bodypartNumber;
}

export function getBpEnergy(bodyparts: bpgGene[]): number {
    let enengyNum = 0;
    const bodypartCost = {
        move: 50,
        work: 100,
        carry: 50,
        attack: 80,
        ranged_attack: 150,
        heal: 250,
        claim: 600,
        tough: 10
    };
    for (let i = 0, j = bodyparts.length; i < j; i++) {
        let repeatNum = 1;
        if (bodyparts[i].repeat !== undefined) {
            repeatNum = bodyparts[i].repeat as number;
        }
        if (repeatNum === 1) {
            for (const key in bodyparts[i]) {
                if (BODYPARTS_ALL.includes(key as BodyPartConstant)) {
                    for (let i1 = 0, j1 = bodyparts[i][key as BodyPartConstant] as number; i1 < j1; i1++) {
                        enengyNum += bodypartCost[key as BodyPartConstant];
                    }
                }
            }
        } else {
            let nowEnergy = 0;
            for (const key in bodyparts[i]) {
                if (BODYPARTS_ALL.includes(key as BodyPartConstant)) {
                    for (let i1 = 0, j1 = bodyparts[i][key as BodyPartConstant] as number; i1 < j1; i1++) {
                        nowEnergy += bodypartCost[key as BodyPartConstant];
                    }
                }
            }
            enengyNum += nowEnergy * repeatNum;
        }
    }
    global.GenedgetBpEnergyBodyparts = bodyparts;
    global.GenedgetBpEnergyBodypartsCost = enengyNum;
    return enengyNum;
}
