import { IntegrationTestHelper } from "../helper";
import { initWorld } from "./initWorld";

export async function initCreepTestRoom(helper: IntegrationTestHelper): Promise<void> {
    await initWorld(helper, "W1N1");
}
