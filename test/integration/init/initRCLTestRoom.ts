import { IntegrationTestHelper } from "../helper";
import { initWorld } from "./initWorld";

export async function initRCLTestRoom(helper: IntegrationTestHelper, spawnRoom: string): Promise<void> {
    return await initWorld(helper, spawnRoom);
}
