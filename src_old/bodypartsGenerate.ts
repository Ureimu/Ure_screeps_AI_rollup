global.bpg = function (bodyparts) {
    /**
     *一个bodyparts生成器。
    具体使用示例：
    传入：[{'move':1,'work':1},{'move':2,'carry':2}]
    传出：['move','work','move','move','carry','carry']
    *
    * @param {Array[]} bodyparts 一个由多个键值表构成的数组。
    * @returns {Array} bodypartsList 请使用Memory.bodyparts获取。
    */
    let bodypartsList = [];
    if (!!global.GenedGetBodyparts && bodyparts == global.GenedGetBodyparts) return global.GenedBodypartsList; //如果上一次的和这一次的设置一样，则跳过。
    let list0: BodyPartConstant[] = ['move', 'work', 'carry', 'attack', 'ranged_attack', 'heal', 'claim', 'tough'];
    for (let i = 0, j = bodyparts.length; i < j; i++) {
        for (let key in bodyparts[i]) {
            for (let name of list0) {
                if (key == name) {
                    for (let i1 = 0, j1 = bodyparts[i][key]; i1 < j1; i1++) {
                        bodypartsList.push(name);
                    }
                }
            }
        }
    }
    global.GenedGetBodyparts = bodyparts;
    global.GenedBodypartsList = bodypartsList;
    return bodypartsList;
};