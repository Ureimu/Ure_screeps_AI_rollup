/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { IntegrationTestHelper } from "../helper";
import { getAnalyzeData } from "./getAnalyzeData";
import { analyseEventLog } from "./getEventLog";

export async function getAnalyzeDataAfterTick(
    gameTime: number,
    controllerData: controllerData,
    helper: IntegrationTestHelper,
    idData: nameToId,
    analyseData: analyseData
): Promise<void> {
    const { db, env } = helper.server.common.storage;
    const memory: Memory = JSON.parse(await helper.user.memory);
    const rawEventLog = await env.get(env.keys.ROOM_EVENT_LOG);
    await getAnalyzeData(db, idData, gameTime, controllerData, memory);
    const analysed = analyseEventLog(rawEventLog, gameTime, controllerData);
    analyseData.push(...analysed);
}
