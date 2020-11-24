import { IntegrationTestHelper } from "../helper";
import { initWorld } from "./initWorld";

export async function initRCLTestRoom(helper: IntegrationTestHelper, RCL: number,spawnRoom:string): Promise<void> {
  await initWorld(helper, RCL, spawnRoom);
}
