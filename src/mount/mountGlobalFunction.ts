export function globalFunctionRegister(): void {//在global上写入全局函数对象
    if (!global.bpg) {
        global.bpg = function (bodyparts: Array<bpgGene>): BodyPartConstant[] {
            /**
             *一个bodyparts生成器。
            具体使用示例：
            传入：[{'move':1,'work':1},{'move':2,'carry':2}]
            传出：['move','work','move','move','carry','carry']
            *
            * @param {Array<bpgGene>} bodyparts 一个由多个bpgGene类型构成的数组。
            * @returns {BodyPartConstant[]} 身体部件常量列表。
            */
            let bodypartsList: BodyPartConstant[] = [];
            if (!!global.GenedGetBodyparts && bodyparts == global.GenedGetBodyparts) return global.GenedBodypartsList; //如果上一次的和这一次的设置一样，则跳过。
            for (let i = 0, j = bodyparts.length; i < j; i++) {
                for (let key in bodyparts[i]) {
                    for (let name of BODYPARTS_ALL) {
                        if (key == name) {
                            for (let i1 = 0, j1 = <number>bodyparts[i][key]; i1 < j1; i1++) {
                                bodypartsList.push(name);
                            }
                        }
                    }
                }
            }
            global.GenedGetBodyparts = bodyparts;
            global.GenedBodypartsList = bodypartsList;
            return bodypartsList;
        }
        console.log('[global] 重新挂载全局函数');
    }
    else {
        return
    }
}
