/* eslint-disable no-underscore-dangle */
import { runRCLTest } from "./run/runRCLTest";
import { getObjStatus } from "./utils/updateObjects";
const TICK_NUM = 160000;

describe("测试RCL", () => {
    it(`测试 RCL1 -> RCL5`, async () => {
        await runRCLTest(TICK_NUM, undefined, undefined, undefined, undefined, {
            speedLevel: 0,
            startRCL: 1,
            endRCL: 5,
            printInterval: 100,
            subscribeConsole: true
        });
    });
});

describe("测试Link", () => {
    it(`测试Link是否能正常工作`, async () => {
        await runRCLTest(
            TICK_NUM,
            undefined,
            async opts => {
                const data = (await getObjStatus(opts.db, { type: STRUCTURE_LINK })) as {
                    store: { energy: number };
                    _id: string;
                }[];
                data.forEach(item => {
                    console.log(opts.idData[item._id].type.namedType, item.store.energy);
                });
                // console.log(JSON.stringify(data, undefined, 4));
                return;
            },
            undefined,
            undefined,
            {
                speedLevel: 15,
                startRCL: 3,
                endRCL: 8,
                printInterval: 400,
                subscribeConsole: false
            }
        );
    });
});
