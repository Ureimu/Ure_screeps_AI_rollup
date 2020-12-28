import { helper } from "../helper";

/* eslint-disable */
export async function updateSpawnRoomObj(db: any, spawnRoom:string): Promise<void> {
    await Promise.all([
        db["rooms.objects"]
            .find({ type: "constructionSite" })
            .then((resp: any[]) =>
                resp.map(cs =>
                    db["rooms.objects"]
                        .findOne({ _id: cs._id })
                        .then((csDetail: { progressTotal: number }) =>
                            db["rooms.objects"].update(
                                { _id: cs._id },
                                { $set: { progress: csDetail.progressTotal - 10 } }
                            )
                        )
                )
            ),
        db["rooms.objects"]
            .find({ type: "spawn" })
            .then((resp: any[]) =>
                resp.map((cs: { _id: any }) =>
                    db["rooms.objects"]
                        .findOne({ _id: cs._id })
                        .then(() => db["rooms.objects"].update({ _id: cs._id }, { $set: { store: { energy: 300 } } }))
                )
            ),
        db["rooms.objects"].update({ room: spawnRoom, type: "constructedWall" }, { $set: { hits: 3000000 } }),
        db["rooms.objects"].update({ room: spawnRoom, type: "rampart" }, { $set: { hits: 3000000 } }),
        db["rooms.objects"].update({ room: spawnRoom, type: "storage" }, { $set: { store: { energy: 950000 } } })
    ]);
}

export async function upgradeController(db: any, controllerId:string, RCL:number): Promise<void> {
    const C = helper.server.constants;
    await Promise.all([
        db["rooms.objects"].update(
            { _id: controllerId },
            { $set: { level: RCL, progress: C.CONTROLLER_LEVELS[RCL] - 100 - ((RCL - 8) ** 3 + 243) * 200 } }
        )
    ]);
}

