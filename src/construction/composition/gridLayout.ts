/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
import {
    genePosStr,
    getDiagPosStr,
    ParseCoord,
    getPosStrInRange,
    getPosFromStr,
    getQuadPosStr,
    getRangeToPosStr,
    reverseSet,
    setPosToStr
} from "construction/utils/strToRoomPosition";
import { initConstructionScheduleMemory } from "construction/utils/initConstructionMemory";
import { getCutTiles } from "../../../utils/mincut/minCut";
import { RoomPositionStr } from "construction";

/** 网格建筑布局。
 * 该函数为静态函数，即只要输入相同，则输出必定相同，所以一个房间只需要执行一次。
 * 网格建筑布局是最基本也是最简单的布局之一，只需要用方格道路填满房间，再把建筑放置于方格中即可。
 * 默认不考虑一切已经建好的建筑，并且在规划完成后建筑会自动检查位置是否符合布局要求，不符合会自动重建。
 * 请在main的loop下写上下面这段代码。
 * for(let stateCut in global.stateLoop){
        global.stateLoop[stateCut]();
    }
 */
const keepTime = 20; // 预览的持续时间
const xUp = 0.25;
const buildNumberLimit = CONTROLLER_STRUCTURES;
buildNumberLimit.constructedWall = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 2500,
    6: 2500,
    7: 2500,
    8: 2500
};
buildNumberLimit.rampart = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 2500,
    6: 2500,
    7: 2500,
    8: 2500
};

export function getGridLayout(room: Room): void {
    const startCpu = Game.cpu.getUsed();
    // 初始化memory
    initConstructionScheduleMemory(room, "gridLayout");
    const roadExpandStrList: RoomPositionStr[] = [];
    // 先确定中心，这里设置为了本房间第一个spawn。
    Game.spawns[room.memory.firstSpawnName].pos.getDiagSquare().forEach(pos => {
        roadExpandStrList.push(setPosToStr(pos));
    });
    const roadExpand = new Set(roadExpandStrList);
    const buildingExpand = new Set([setPosToStr(Game.spawns[room.memory.firstSpawnName].pos)]);
    let ifContinue = true;
    let ifEnough = false;
    while (ifContinue) {
        // 判断数量是否足够
        if (!ifEnough) {
            // 进行一次扩张，如果没有墙和沼泽阻碍扩张，则会增加4n-4个空位(n>2)
            let ExpandList: RoomPosition[] = [];
            roadExpand.forEach((posStr: RoomPositionStr) => {
                getPosFromStr(posStr)
                    .getQuadSquare()
                    .forEach((posE: RoomPosition) => {
                        ExpandList.push(posE);
                    });
            });
            ExpandList.forEach(pos => {
                roadExpand.add(setPosToStr(pos));
            });
            ExpandList = [];
            buildingExpand.forEach((posStr: RoomPositionStr) => {
                getPosFromStr(posStr)
                    .getQuadSquare()
                    .forEach((posE: RoomPosition) => {
                        ExpandList.push(posE);
                    });
            });
            ExpandList.forEach(pos => {
                buildingExpand.add(setPosToStr(pos));
            });
        } else {
            // 保留一份完整的buildSet和roadSet
            const fullBuildingExpand = new Set<string>(buildingExpand.keys());
            const fullRoadExpand = new Set<string>(roadExpand.keys());
            // 寻找通往其他房间的路径（如果有的话）
            const directionList = [FIND_EXIT_TOP, FIND_EXIT_RIGHT, FIND_EXIT_BOTTOM, FIND_EXIT_LEFT];
            const outwardsRoadPosSet = new Set<string>();
            for (const direction of directionList) {
                const targetRoomPositionList = room.find(direction);
                const pos = Game.spawns[room.memory.firstSpawnName].pos.findClosestByPath(targetRoomPositionList);
                if (pos) {
                    const ret = PathFinder.search(Game.spawns[room.memory.firstSpawnName].pos, pos, {
                        // 我们需要把默认的移动成本设置的更高一点
                        // 这样我们就可以在 roomCallback 里把道路移动成本设置的更低
                        plainCost: 2,
                        swampCost: 10,

                        roomCallback(roomName) {
                            const roomSearch = Game.rooms[roomName];
                            // 在这个示例中，`room` 始终存在
                            // 但是由于 PathFinder 支持跨多房间检索
                            // 所以你要更加小心！
                            if (!roomSearch) return false;
                            const costs = new PathFinder.CostMatrix();

                            // 在这里遍历所有建筑，并将cost设置为最高
                            buildingExpand.forEach(posStr => {
                                const coord = ParseCoord(posStr);
                                costs.set(coord.x, coord.y, 0xff);
                            });
                            // 在这里遍历所有路，并将cost设置为1
                            roadExpand.forEach(posStr => {
                                const coord = ParseCoord(posStr);
                                costs.set(coord.x, coord.y, 1);
                            });

                            return costs;
                        }
                    });
                    ret.path.forEach(pos1 => {
                        outwardsRoadPosSet.add(setPosToStr(pos1));
                    });
                }
            }
            // 寻找source,controller,minerals的路径，同时确定link和container的位置，使用path.finder进行寻找。
            // 这里不需要处理多种道路重叠的情况。

            const sourceAndControllerRoadPosSet = new Set<string>(); // 寻找source,controller的路径
            let sourceAndControllerContainerPosSet = new Set<string>();
            let sourceAndControllerLinkPosSet = new Set<string>();
            const sourceContainerPosSet = new Set<string>();
            const controllerContainerPosSet = new Set<string>();
            const sourceLinkPosSet = new Set<string>();
            const controllerLinkPosSet = new Set<string>();
            const goals = _.map(
                (room.find(FIND_SOURCES) as { pos: RoomPosition; structureType?: string }[]).concat(
                    room.controller as StructureController
                ),
                function (source) {
                    // 我们没办法走到 source 上 -- 将 `range` 设置为 1
                    // 所以我们将寻路至其旁边,这里应该寻路到对应的container上
                    if (typeof source.structureType === "undefined") {
                        return { pos: source.pos, range: 1, name: "source" };
                    } else {
                        return { pos: source.pos, range: 3, name: "controller" };
                    }
                }
            );

            for (const goal of goals) {
                const ret = PathFinder.search(Game.spawns[room.memory.firstSpawnName].pos, goal, {
                    // 我们需要把默认的移动成本设置的更高一点
                    // 这样我们就可以在 roomCallback 里把道路移动成本设置的更低
                    plainCost: 2,
                    swampCost: 10,

                    roomCallback(roomName) {
                        const roomSearch = Game.rooms[roomName];
                        // 在这个示例中，`room` 始终存在
                        // 但是由于 PathFinder 支持跨多房间检索
                        // 所以你要更加小心！
                        if (!roomSearch) return false;
                        const costs = new PathFinder.CostMatrix();

                        // 在这里遍历所有建筑，并将cost设置为最高
                        buildingExpand.forEach(posStr => {
                            const coord = ParseCoord(posStr);
                            costs.set(coord.x, coord.y, 0xff);
                        });
                        // 在这里遍历所有路，并将cost设置为1
                        roadExpand.forEach(posStr => {
                            const coord = ParseCoord(posStr);
                            costs.set(coord.x, coord.y, 1);
                        });

                        return costs;
                    }
                });

                if (ret.path.length > 0) {
                    if (goal.name === "source") {
                        const pos = ret.path.pop() as RoomPosition;
                        ret.path.forEach(pos1 => {
                            sourceAndControllerRoadPosSet.add(setPosToStr(pos1));
                        });
                        sourceContainerPosSet.add(setPosToStr(pos));
                        const posAround = pos.getSquare();
                        for (const posAroundPos of posAround) {
                            const terrain: Terrain[] = posAroundPos.lookFor(LOOK_TERRAIN);
                            if (
                                terrain[0] !== "wall" &&
                                !isPosSetInPos(sourceAndControllerRoadPosSet, setPosToStr(posAroundPos))
                            ) {
                                sourceLinkPosSet.add(setPosToStr(posAroundPos));
                                break;
                            }
                        }
                    } else if (goal.name === "controller") {
                        const pos = ret.path.pop() as RoomPosition;
                        ret.path.forEach(pos1 => {
                            sourceAndControllerRoadPosSet.add(setPosToStr(pos1));
                        });
                        controllerContainerPosSet.add(setPosToStr(pos));
                        const posAround = pos.getSquare();
                        for (const posAroundPos of posAround) {
                            const terrain: Terrain[] = posAroundPos.lookFor(LOOK_TERRAIN);
                            if (
                                terrain[0] !== "wall" &&
                                !isPosSetInPos(sourceAndControllerRoadPosSet, setPosToStr(posAroundPos))
                            ) {
                                controllerLinkPosSet.add(setPosToStr(posAroundPos));
                                break;
                            }
                        }
                    }
                }
            }

            sourceAndControllerRoadPosSet.forEach(posStr => {
                roadExpand.delete(posStr);
            });
            sourceAndControllerContainerPosSet = mergeSet(controllerContainerPosSet, sourceContainerPosSet);
            sourceAndControllerLinkPosSet = mergeSet(controllerLinkPosSet, sourceLinkPosSet);

            // 寻找mineral路径
            const mineralRoadPosSet = new Set<string>(); // 寻找source,controller的路径
            const mineralContainerPosSet = new Set<string>();
            const mineralGoals = _.map(
                room.find(FIND_MINERALS) as { pos: RoomPosition; structureType?: string }[],
                function (source) {
                    // 我们没办法走到 source 上 -- 将 `range` 设置为 1
                    // 所以我们将寻路至其旁边,这里应该寻路到对应的container上
                    return { pos: source.pos, range: 1 };
                }
            );

            for (const mineralGoal of mineralGoals) {
                const ret = PathFinder.search(Game.spawns[room.memory.firstSpawnName].pos, mineralGoal, {
                    // 我们需要把默认的移动成本设置的更高一点
                    // 这样我们就可以在 roomCallback 里把道路移动成本设置的更低
                    plainCost: 2,
                    swampCost: 10,

                    roomCallback(roomName) {
                        const roomSearch = Game.rooms[roomName];
                        // 在这个示例中，`room` 始终存在
                        // 但是由于 PathFinder 支持跨多房间检索
                        // 所以你要更加小心！
                        if (!roomSearch) return false;
                        const costs = new PathFinder.CostMatrix();

                        // 在这里遍历所有建筑，并将cost设置为最高
                        buildingExpand.forEach(posStr => {
                            const coord = ParseCoord(posStr);
                            costs.set(coord.x, coord.y, 0xff);
                        });
                        // 在这里遍历所有路，并将cost设置为1
                        roadExpand.forEach(posStr => {
                            const coord = ParseCoord(posStr);
                            costs.set(coord.x, coord.y, 1);
                        });

                        return costs;
                    }
                });
                if (ret.path.length > 0) {
                    mineralContainerPosSet.add(setPosToStr(ret.path.pop() as RoomPosition));
                    mineralContainerPosSet.forEach(posStr => {
                        if (roadExpand.has(posStr)) {
                            roadExpand.delete(posStr);
                        }
                    });
                }
                ret.path.forEach(pos => {
                    mineralRoadPosSet.add(setPosToStr(pos));
                });
                mineralRoadPosSet.forEach(posStr => {
                    if (roadExpand.has(posStr)) {
                        roadExpand.delete(posStr);
                    }
                });
            }
            // 为所有建筑确定位置，并将分配结果存入room.memory.constructionSchedule["gridLayout"]中，方便建筑建造函数调用结果。
            // 判断是否有中央布局的位置（四个构成斜正方形的building空位,会自动由内向外判断，尽量取离spawn最近的），如果没有则告知并提醒用户手动规划，有则转移给centerConstruction的memory.
            let center = "";
            let buildingExpandWithoutSpawn = buildingExpand;
            buildingExpandWithoutSpawn.delete(setPosToStr(Game.spawns[room.memory.firstSpawnName].pos)); // 避免把spawn作为中心布局点
            buildingExpandWithoutSpawn = reverseSet(buildingExpandWithoutSpawn); // 一开始的集合元素遍历顺序是由外向内，这里把集合里的元素倒过来，变成由内向外。
            buildingExpandWithoutSpawn.forEach(posStr0 => {
                getDiagPosStr(posStr0).forEach(posStr1 => {
                    let i5 = 0;
                    getDiagPosStr(posStr1).forEach(posStr2 => {
                        if (buildingExpandWithoutSpawn.has(posStr2)) {
                            i5++;
                        }
                    });
                    if (i5 === 4) {
                        center = posStr1;
                    }
                });
            });
            getDiagPosStr(center).forEach(posStr => {
                buildingExpand.delete(posStr); // 从原集合中去除这四个位置
                buildingExpandWithoutSpawn.delete(posStr); // 从原集合中去除这四个位置
            });

            // 判断powerSpawn,Nuker，ob,两个spawn的位置（尽量靠近storage）
            const obSet = new Set<string>();
            for (const posStr of buildingExpandWithoutSpawn) {
                obSet.add(posStr);
                buildingExpandWithoutSpawn.delete(posStr);
                buildingExpand.delete(posStr);
                break;
            }
            let buildingExpandPowerSpawn = buildingExpandWithoutSpawn;
            buildingExpandPowerSpawn = reverseSet(buildingExpandPowerSpawn);
            const powerSpawnSet = new Set<string>();
            const nukerSet = new Set<string>();
            const spawnSet = new Set<string>();
            spawnSet.add(setPosToStr(Game.spawns[room.memory.firstSpawnName].pos));
            for (const posStr of buildingExpandPowerSpawn) {
                powerSpawnSet.add(posStr);
                buildingExpandPowerSpawn.delete(posStr);
                buildingExpand.delete(posStr);
                break;
            }
            for (const posStr of buildingExpandPowerSpawn) {
                nukerSet.add(posStr);
                buildingExpandPowerSpawn.delete(posStr);
                buildingExpand.delete(posStr);
                break;
            }
            let i3 = 0;
            for (const posStr of buildingExpandPowerSpawn) {
                i3++;
                spawnSet.add(posStr);
                buildingExpandPowerSpawn.delete(posStr);
                buildingExpand.delete(posStr);
                if (i3 > 1) {
                    break;
                }
            }
            // 判断塔的位置（任意两个塔之间距离应大于等于3，并且尽量靠近storage）
            const buildingExpandWithoutSpawnAndCenter = buildingExpandPowerSpawn;
            const towerSet = new Set<string>();
            buildingExpandWithoutSpawnAndCenter.forEach(posStr => {
                let i2 = 0;
                towerSet.forEach(towerPosStr => {
                    if (getRangeToPosStr(posStr, towerPosStr) >= 3) {
                        i2++;
                    }
                });
                if (i2 === towerSet.size && towerSet.size <= 6) {
                    towerSet.add(posStr);
                    buildingExpand.delete(posStr); // 从原集合中去除这六个位置
                    buildingExpandWithoutSpawnAndCenter.delete(posStr);
                }
            });

            // 判断lab的位置（斜着4x5，占12个building空位,20格road空位）
            let buildingExpandWithoutAbove = buildingExpandWithoutSpawnAndCenter;
            buildingExpandWithoutAbove = reverseSet(buildingExpandWithoutAbove);
            let m = 0;
            const labSet = new Set<string>();
            const square2Set = new Set<string>();
            const square3Set = new Set<string>();
            const coreLabPos: string[] = [];
            let ifRun = true;
            let cpu = Game.cpu.getUsed();
            buildingExpandWithoutAbove.forEach(posStr0 => {
                if (ifRun) {
                    m++;
                    let i1 = 0;
                    getDiagPosStr(posStr0).forEach(posStr1 => {
                        getDiagPosStr(posStr1).forEach(posStr2 => {
                            square2Set.add(posStr2);
                        });
                    });
                    square2Set.forEach(posStr => {
                        if (buildingExpandWithoutAbove.has(posStr)) {
                            i1++;
                        }
                    });
                    if (i1 === 9) {
                        getQuadPosStr(posStr0).forEach(posStr1 => {
                            if (ifRun) {
                                let j = 0;
                                getDiagPosStr(posStr1).forEach(posStr2 => {
                                    getDiagPosStr(posStr2).forEach(posStr3 => {
                                        square3Set.add(posStr3);
                                    });
                                });
                                square3Set.forEach(posStr => {
                                    if (buildingExpandWithoutAbove.has(posStr)) {
                                        j++;
                                    }
                                });
                                if (j === 9) {
                                    ifRun = false;
                                    coreLabPos.push(posStr0, posStr1);
                                } else {
                                    square3Set.clear();
                                }
                            }
                        });
                    } else {
                        square2Set.clear();
                    }
                }
            });
            cpu = Game.cpu.getUsed() - cpu;
            if (square2Set.size === 9 && square3Set.size === 9 && coreLabPos.length === 2) {
                console.log(`在第${m}个位置检索后，找到了lab布局，消耗cpu为${cpu.toFixed(2)}`);
                // TODO进一步确定各个lab的位置
                square2Set.forEach(posStr => {
                    labSet.add(posStr);
                    buildingExpand.delete(posStr);
                });
                square3Set.forEach(posStr => {
                    labSet.add(posStr);
                    buildingExpand.delete(posStr);
                });
            } else {
                console.log("未找到lab布局");
            }

            const wallAndRampartPosSet = getMinCut(true, fullBuildingExpand, room);
            const wallPosSet = new Set<string>();
            const rampartPosSet = new Set<string>();

            let anyRoadSet = new Set<string>(); // anyRoadSet只用作显示。
            const anyRoadSetList = [roadExpand, sourceAndControllerRoadPosSet, mineralRoadPosSet, outwardsRoadPosSet];
            for (const set of anyRoadSetList) {
                anyRoadSet = mergeSet(anyRoadSet, set);
            }
            wallAndRampartPosSet.forEach(posStr => {
                if (anyRoadSet.has(posStr)) {
                    // 判断是否有路在pos下
                    rampartPosSet.add(posStr);
                    anyRoadSet.delete(posStr);
                } else {
                    wallPosSet.add(posStr);
                }
            });

            // 分配extension位置
            const extensionPosSet = new Set<string>();
            buildingExpand.forEach(posStr => {
                if (extensionPosSet.size < 60) {
                    extensionPosSet.add(posStr);
                }
            });
            if (extensionPosSet.size < 60) {
                console.log("extension位置不足，现在数量为" + extensionPosSet.size.toString());
            }

            // 初始化memory
            initConstructionScheduleMemory(room, "gridLayout");
            room.memory.constructionSchedule.gridLayout.creepWorkPos = {
                centerPos: [center]
            };
            room.memory.constructionSchedule.gridLayout.layout = {
                road: {
                    baseRoad: { posStrList: Array.from(fullRoadExpand.keys()), levelToBuild: 8 },
                    sourceAndControllerRoad: {
                        posStrList: Array.from(sourceAndControllerRoadPosSet.keys()),
                        levelToBuild: 2
                    },
                    mineralRoad: {
                        posStrList: Array.from(mineralRoadPosSet.keys()),
                        levelToBuild: 8
                    },
                    outwardsRoad: {
                        posStrList: Array.from(outwardsRoadPosSet.keys()),
                        levelToBuild: 5
                    }
                },
                extension: {
                    extension: {
                        posStrList: Array.from(extensionPosSet.keys()),
                        levelToBuild: 1
                    }
                },
                tower: {
                    tower: {
                        posStrList: Array.from(towerSet.keys())
                    }
                },
                container: {
                    sourceContainer: {
                        posStrList: Array.from(sourceContainerPosSet.keys()),
                        levelToBuild: 1
                    },
                    controllerContainer: {
                        posStrList: Array.from(controllerContainerPosSet.keys()),
                        levelToBuild: 1
                    },
                    mineralContainer: {
                        posStrList: Array.from(mineralContainerPosSet.keys()),
                        levelToBuild: 8
                    }
                },
                link: {
                    sourceLink: {
                        posStrList: Array.from(sourceLinkPosSet.keys()),
                        levelToBuild: 6
                    },
                    controllerLink: {
                        posStrList: Array.from(controllerLinkPosSet.keys()),
                        levelToBuild: 5
                    },
                    centerLink: {
                        posStrList: [Array.from(getDiagPosStr(center).keys())[0]],
                        levelToBuild: 5
                    }
                },
                constructedWall: {
                    wall: {
                        posStrList: Array.from(wallPosSet.keys()),
                        levelToBuild: 5
                    }
                },
                rampart: {
                    rampart: {
                        posStrList: Array.from(rampartPosSet.keys()),
                        levelToBuild: 5
                    }
                },
                spawn: {
                    spawn: {
                        posStrList: Array.from(spawnSet.keys())
                    }
                },
                storage: {
                    storage: {
                        posStrList: [Array.from(getDiagPosStr(center).keys())[1]]
                    }
                },
                terminal: {
                    terminal: {
                        posStrList: [Array.from(getDiagPosStr(center).keys())[2]]
                    }
                },
                factory: {
                    factory: {
                        posStrList: [Array.from(getDiagPosStr(center).keys())[3]]
                    }
                },
                lab: {
                    lab: {
                        posStrList: Array.from(labSet.keys())
                    }
                },
                powerSpawn: {
                    powerSpawn: {
                        posStrList: Array.from(powerSpawnSet.keys())
                    }
                },
                observer: {
                    observer: {
                        posStrList: Array.from(obSet.keys())
                    }
                },
                nuker: {
                    nuker: {
                        posStrList: Array.from(nukerSet.keys())
                    }
                },
                extractor: {
                    extractor: {
                        posStrList: [setPosToStr(room.find(FIND_MINERALS)[0].pos)]
                    }
                }
            };
            // 运行渲染函数。用数字搭配不同的颜色表示建筑，运行(keepTime)tick并把缓存挂在global上，告知用户自行查看。
            const layout: map<"Text">[] = [];
            const setList = [
                extensionPosSet,
                anyRoadSet,
                getDiagPosStr(center),
                towerSet,
                labSet,
                powerSpawnSet,
                nukerSet,
                spawnSet,
                obSet,
                sourceAndControllerContainerPosSet,
                mineralContainerPosSet,
                sourceAndControllerLinkPosSet,
                wallPosSet,
                rampartPosSet
            ]; // 集合
            const text = ["房", "路", "中", "塔", "瓶", "力", "弹", "出", "观", "容", "容", "节", "墙", "城"]; // 显示文字
            const color = [
                "#00FFFF",
                "#CCCCCC",
                "#FF6347",
                "#FF9900",
                "#3399CC",
                "#FF6666",
                "#FF9900",
                "#FF6347",
                "#FF6347",
                "#CCCCCC",
                "#3399CC",
                "#FF6347",
                "#0066CC",
                "#99CC33"
            ]; // 文字颜色

            for (let i = 0, j = setList.length; i < j; i++) {
                pushLayout(setList[i], i, layout, xUp, text, color);
            }
            const visual0 = global.GUI.draw(new RoomVisual(room.name), layout);
            if (!global.state) global.state = {};
            if (!global.stateLoop) global.stateLoop = {};
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            global.testX.gridLayout = visual0.export();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            global.testX.gridLayoutRoom = room.name;
            global.state.gridLayout = Game.time;
            global.stateLoop.gridLayout = () => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                if (Game.time - (global.state.gridLayout as number) < keepTime && global.testX.gridLayout) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    const visual = new RoomVisual(global.testX.gridLayoutRoom);
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    visual.import(global.testX.gridLayout);
                }
            };
            // 结束并跳出循环

            ifContinue = false;
            continue;
        }
        // _判断实际可用空位数量
        // __判断是否可以放下road，不可以则弹出集合
        for (const roadExpandPosStr of roadExpand) {
            const roadExpandPos = getPosFromStr(roadExpandPosStr);
            const terrain: Terrain[] = roadExpandPos.lookFor(LOOK_TERRAIN);
            if (terrain[0] !== "plain") {
                // 不考虑在沼泽和墙上放置路。
                roadExpand.delete(setPosToStr(roadExpandPos));
            }
        }
        // __判断是否可以放下building，不可以则弹出集合
        for (const buildingExpandPosStr of buildingExpand) {
            const buildingExpandPos = getPosFromStr(buildingExpandPosStr);
            const terrain: Terrain[] = buildingExpandPos.lookFor(LOOK_TERRAIN);
            if (terrain[0] === "wall") {
                // 不考虑在墙上放置建筑。
                buildingExpand.delete(setPosToStr(buildingExpandPos));
            }
        }
        // __判断是否在controller4格范围内或者source2格范围内或者mineral的1格范围内，是则弹出集合
        // ___取得范围内的位置字符串集合，并进行删除。
        getPosStrInRange(setPosToStr((room.controller as StructureController).pos), 4).forEach(posStr => {
            roadExpand.delete(posStr);
            buildingExpand.delete(posStr);
        });
        for (const source of room.find(FIND_SOURCES)) {
            getPosStrInRange(setPosToStr(source.pos), 2).forEach(posStr => {
                roadExpand.delete(posStr);
                buildingExpand.delete(posStr);
            });
        }
        getPosStrInRange(setPosToStr(room.find(FIND_MINERALS)[0].pos), 1).forEach(posStr => {
            roadExpand.delete(posStr);
            buildingExpand.delete(posStr);
        });
        // __判断是否building周围还有路，没有则弹出集合
        for (const buildingExpandPosStr of buildingExpand) {
            const buildingExpandPos = getPosFromStr(buildingExpandPosStr);
            const buildingExpandPosAround = buildingExpandPos.getSquare();
            let j = 0;
            for (const buildingExpandPosAroundPos of buildingExpandPosAround) {
                const terrain: Terrain[] = buildingExpandPosAroundPos.lookFor(LOOK_TERRAIN);
                if (terrain[0] === "wall" || !isPosSetInPos(roadExpand, setPosToStr(buildingExpandPosAroundPos))) {
                    j++;
                }
            }
            if (j === 8) {
                buildingExpand.delete(setPosToStr(buildingExpandPos));
            }
        }
        // __判断是否路周围还有building，没有则放弃(暂时不使用，因为极端情况下可能需要路来作为连通图的桥,而作者还写不来连通图的算法)
        // 判断方格数量是否足够放下所有需要占位的building
        console.log(buildingExpand.size);
        if (88 <= buildingExpand.size) {
            ifEnough = true;
        }
    }
    const endCpu = Game.cpu.getUsed();
    console.log(`耗费cpu:${(endCpu - startCpu).toFixed(2)}`);
}

function isPosSetInPos(posSet: Set<string>, pos: RoomPositionStr): boolean {
    for (const posSetPosStr of posSet) {
        if (posSetPosStr === pos) {
            return true;
        }
    }
    return false;
}

interface Coord {
    x: number;
    y: number;
}

function coordToRoomPositionStr(coordList: Coord[], room: Room): string[] {
    const roomPositionStrList = [];
    for (const coord of coordList) {
        roomPositionStrList.push(genePosStr(coord.x, coord.y, room.name));
    }
    return roomPositionStrList;
}

function pushLayout(
    exp: Set<string>,
    i: number,
    layout: map<"Text">[] = [],
    x: number,
    text: string[],
    color: string[]
): void {
    exp.forEach(posStr => {
        const coord = ParseCoord(posStr);
        layout.push({
            type: "Text",
            layout: {
                x: coord.x + x,
                y: coord.y,
                content: text[i],
                color: color[i]
            }
        });
    });
}

// 生成rampart和wall的摆放位置（使用overMind的minCut）
function getMinCut(preferCloserBarriers = true, fullBuildingExpand: Set<string>, room: Room): Set<string> {
    const colony = room;
    const colonyName = room.name;
    let cpu = Game.cpu.getUsed();
    // Rectangle Array, the Rectangles will be protected by the returned tiles
    const rectArray = [];
    const padding = 3;
    for (const building of fullBuildingExpand) {
        if (building) {
            const { x, y } = ParseCoord(building);
            const [x1, y1] = [Math.max(x - padding, 0), Math.max(y - padding, 0)];
            const [x2, y2] = [Math.min(x + padding, 49), Math.min(y + padding, 49)];
            rectArray.push({ x1, y1, x2, y2 });
        }
    }
    if (colony.controller) {
        const { x, y } = colony.controller.pos;
        const [x1, y1] = [Math.max(x - 3, 0), Math.max(y - 3, 0)];
        const [x2, y2] = [Math.min(x + 3, 49), Math.min(y + 3, 49)];
        rectArray.push({ x1, y1, x2, y2 });
    }

    // Get Min cut
    // Positions is an array where to build walls/ramparts
    const positions = getCutTiles(colonyName, rectArray, preferCloserBarriers, 2);
    // Test output
    // console.log('Positions returned', positions.length);
    cpu = Game.cpu.getUsed() - cpu;
    // console.log('Needed', cpu, ' cpu time');
    console.log(`生成rampart和wall位置个数：${positions.length};` + `该子任务消耗cpu: ${cpu.toFixed(2)}`);
    return new Set(coordToRoomPositionStr(positions, room));
}

function mergeSet<T>(a: Set<T>, b: Set<T>): Set<T> {
    const c = new Set<T>(a.keys());
    const d = new Set<T>(b.keys());
    c.forEach(vars => {
        d.add(vars);
    });
    return d;
}
