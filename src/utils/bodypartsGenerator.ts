export function bpg(bodyparts: Array<bpgGene>): BodyPartConstant[] {
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
        if (bodyparts[i].repeat !== undefined&&bodyparts[i].repeat!=0) {
            repeatNum = <number>bodyparts[i]["repeat"];
        }
        if (repeatNum == 1) {
            for (let key in bodyparts[i]) {
                if (BODYPARTS_ALL.includes(<BodyPartConstant>key)) {
                    for (let i1 = 0, j1 = <number>bodyparts[i][<BodyPartConstant>key]; i1 < j1; i1++) {
                        bodypartsList.push(<BodyPartConstant>key);
                    }
                }
            }
        } else {
            let nowList: BodyPartConstant[] = [];
            for (let key in bodyparts[i]) {
                if (BODYPARTS_ALL.includes(<BodyPartConstant>key)) {
                    for (let i1 = 0, j1 = <number>bodyparts[i][<BodyPartConstant>key]; i1 < j1; i1++) {
                        nowList.push(<BodyPartConstant>key);
                    }
                }
            }
            for (let i = 0; i < repeatNum; i++) {
                bodypartsList = bodypartsList.concat(nowList);
            }
        }
    }
    global.GenedGetBodyparts = bodyparts;
    global.GenedBodypartsList = bodypartsList;
    return bodypartsList;
}

export function getBpNum(bodyparts: Array<bpgGene>, bodypartName?: BodyPartConstant): number {
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
            repeatNum = <number>bodyparts[i]["repeat"];
        }
        for (let key in <bpgGene>bodyparts[i]) {
            if(typeof bodypartName !== "undefined"){
                if (key == bodypartName) {
                    bodypartNumber += <number>bodyparts[i][key] * repeatNum;
                }
            } else {
                if (BODYPARTS_ALL.includes(<BodyPartConstant>key)){
                    bodypartNumber += <number>bodyparts[i][<BodyPartConstant>key] * repeatNum;
                }
            }
        }
    }
    global.GenedGetBodypartsNum = bodyparts;
    global.GenedBodypartsNum = bodypartNumber;
    return bodypartNumber;
}

export function getBpEnergy(bodyparts: Array<bpgGene>): number {
    let enengyNum = 0;
    let bodypartCost = {
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
            repeatNum = <number>bodyparts[i]["repeat"];
        }
        if (repeatNum == 1) {
            for (let key in bodyparts[i]) {
                if (BODYPARTS_ALL.includes(<BodyPartConstant>key)) {
                    for (let i1 = 0, j1 = <number>bodyparts[i][<BodyPartConstant>key]; i1 < j1; i1++) {
                        enengyNum += bodypartCost[<BodyPartConstant>key];
                    }
                }
            }
        } else {
            let nowEnergy: number = 0;
            for (let key in bodyparts[i]) {
                if (BODYPARTS_ALL.includes(<BodyPartConstant>key)) {
                    for (let i1 = 0, j1 = <number>bodyparts[i][<BodyPartConstant>key]; i1 < j1; i1++) {
                        nowEnergy += bodypartCost[<BodyPartConstant>key];
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

