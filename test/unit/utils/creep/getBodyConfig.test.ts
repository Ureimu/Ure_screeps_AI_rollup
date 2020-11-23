import { CARRY, MOVE, WORK } from "../../mock";
import { assert } from "chai";
import getBodyConfig from "../../../../src/utils/creep/getBodyConfig";

describe("getBodyConfig", () => {
  it("可以解析 bodySets", () => {
    const testBodyConfig = getBodyConfig(
      { [WORK]: 2, [CARRY]: 1, [MOVE]: 1 },
      { [WORK]: 4, [CARRY]: 1, [MOVE]: 2 },
      { [WORK]: 6, [CARRY]: 1, [MOVE]: 3 },
      { [WORK]: 8, [CARRY]: 1, [MOVE]: 4 },
      { [WORK]: 10, [CARRY]: 1, [MOVE]: 5 },
      { [WORK]: 12, [CARRY]: 1, [MOVE]: 6 },
      { [WORK]: 12, [CARRY]: 1, [MOVE]: 6 },
      { [WORK]: 12, [CARRY]: 1, [MOVE]: 6 }
    );
    assert.includeMembers(testBodyConfig[300], [CARRY, MOVE, WORK]);
    assert.includeMembers(testBodyConfig[10000], [CARRY, MOVE, WORK]);
  });
});
