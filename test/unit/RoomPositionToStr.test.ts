import { assert } from "chai";
import _ from "lodash";
import { RoomPositionToStr } from "../../src/construction/utils/strToRoomPosition";

interface posStrCollection {
    [name: string]: {
        [name: string]: {
            [name: string]: string[];
        };
    };
    withRoomName: {
        [name: string]: {
            [name: string]: string[];
        };
        legal: {
            [name: string]: string[];
            inCorner: string[];
            inCenter: string[];
            inBorder: string[];
        };
        illegal: {
            [name: string]: string[];
            outOfRange: string[];
        };
    };
    withoutRoomName: {
        [name: string]: {
            [name: string]: string[];
        };
        legal: {
            [name: string]: string[];
            inCorner: string[];
            inCenter: string[];
            inBorder: string[];
        };
        illegal: {
            [name: string]: string[];
            outOfRange: string[];
        };
    };
}

const defaultStr: posStrCollection = {
    withRoomName: {
        legal: {
            inCorner: ["x0y0rW1N1", "x49y49rW1N1", "x0y49rW1N1", "x49y0rW1N1"],
            inCenter: ["x32y43rW1N1", "x13y5rW1N1", "x22y12rW1N1"],
            inBorder: ["x0y16rW1N1", "x18y0rW1N1"]
        },
        illegal: {
            outOfRange: ["x1y-5rW1N1", "x50y0rW1N1"]
        }
    },
    withoutRoomName: {
        legal: {
            inCorner: ["x0y0", "x49y49", "x0y49", "x49y0"],
            inCenter: ["x32y43", "x13y5", "x22y12"],
            inBorder: ["x0y16", "x18y0"]
        },
        illegal: {
            outOfRange: ["x1y-5", "x50y0"]
        }
    }
};

const testPosStrList = ([] as string[]).concat(
    defaultStr.withoutRoomName.illegal.outOfRange,
    defaultStr.withoutRoomName.legal.inCorner,
    defaultStr.withoutRoomName.legal.inCenter,
    defaultStr.withoutRoomName.legal.inBorder
);

const defaultCoord: { [name: string]: { [name: string]: [number, number][] } } = {
    legal: {
        inCorner: [
            [0, 0],
            [49, 49],
            [0, 49],
            [49, 0]
        ],
        inCenter: [
            [32, 43],
            [13, 5],
            [22, 12],
            [2, 2],
            [3, 3]
        ],
        inBorder: [
            [0, 16],
            [18, 0]
        ]
    },
    illegal: {
        outOfRange: [
            [1, -5],
            [50, 0]
        ]
    }
};

describe("RoomPositionToStr without roomName", () => {
    before(() => {
        // runs before all test in this block
    });

    beforeEach(() => {
        // runs before each test in this block
    });

    const rts = new RoomPositionToStr();

    it("should not exist roomName", () => {
        assert.isUndefined(rts.roomName);
    });

    it("regMatch should work", () => {
        const match = rts.regMatch("x0y16rW1N1");
        assert.exists(match?.[1], "do not exist regMatch return x");
        assert.exists(match?.[2], "do not exist regMatch return y");
        assert.exists(match?.[3], "do not exist regMatch return roomName");
    });

    testNormalFunction(rts);
});

describe("RoomPositionToStr with roomName", () => {
    before(() => {
        // runs before all test in this block
    });

    beforeEach(() => {
        // runs before each test in this block
    });

    const rts = new RoomPositionToStr("W1N1");

    it("should exist roomName", () => {
        assert.equal(rts.roomName, "W1N1");
    });

    it("regMatch should work", () => {
        const match = rts.regMatch("x0y16");
        assert.exists(match?.[1], "do not exist regMatch return x");
        assert.exists(match?.[2], "do not exist regMatch return y");
        assert.isUndefined(match?.[3], "exist regMatch return roomName");
    });

    testNormalFunction(rts);
});

function testNormalFunction(rts: RoomPositionToStr) {
    it("should exist range", () => {
        assert.exists(rts.rangeSettings, "do not exist range");
    });

    it('genePosStr should return "" when got coordinates out of range', () => {
        assert.exists(rts.genePosStr(...defaultCoord.legal.inCenter[0]), "err in range");
        assert.strictEqual(rts.genePosStr(...defaultCoord.illegal.outOfRange[0]), "", "err in negative");
        assert.strictEqual(rts.genePosStr(...defaultCoord.illegal.outOfRange[1]), "", "err in positive");
    });

    it('functions which return set should return set that not having a "" and in range', () => {
        for (const str of testPosStrList) {
            const setList = [
                rts.getDiagPosStr(str),
                rts.getQuadPosStr(str),
                rts.getSquarePosStr(str),
                rts.getPosStrInRange(str, 1)
            ];
            for (const set of setList) {
                assert.isNotTrue(set.has(""), 'err: set should not have ""');
                for (const posStr of set) {
                    const match = rts.regMatch(posStr);
                    if (match) {
                        assert.isTrue(rts.ifInSquare(Number(match?.[1]), Number(match?.[2])));
                    } else {
                        assert.isNull(match);
                    }
                }
            }
        }
    });

    it("test get2SnakePosStr", () => {
        let roomName;
        if (!rts.roomName) {
            roomName = "W1N1";
        }
        const snakeSet = new Set<string>([
            rts.genePosStr(defaultCoord.legal.inCenter[3][0], defaultCoord.legal.inCenter[3][1], roomName),
            rts.genePosStr(defaultCoord.legal.inCenter[4][0], defaultCoord.legal.inCenter[4][1], roomName)
        ]);
        console.log(JSON.stringify(Array.from(rts.get2SnakePosStr(snakeSet))));
    });
}
