/* eslint-disable */
export async function getAnalyzeData(db:any,idData:nameToId,gameTime:number,controllerData: controllerData,memory:Memory) {
    await Promise.all([
        db["rooms.objects"].find({}).then((resp: objData<string>[]) => {
            resp.forEach(obj => {
                if (obj.type === "creep") {
                    if (!idData[obj._id]) {
                        idData[obj._id] = {
                            type: {
                                baseType: obj.type,
                                idType: obj._id,
                                // 我这里是直接解析自己creep的名字中自带的类型作为有向图的节点名称。
                                namedType: (obj as objData<"creep">).name
                                    .slice((obj as objData<"creep">).name.indexOf("-") + 1)
                                    .slice(
                                        0,
                                        (obj as objData<"creep">).name
                                            .slice((obj as objData<"creep">).name.indexOf("-") + 1)
                                            .indexOf("-")
                                    )
                            },
                            room: [{ room: obj.room, gameTime }],
                            id: obj._id
                        };
                    } else {
                        const lastIndex =
                            idData[obj._id].room.length - 1;
                        if (
                            idData[obj._id].room[lastIndex].room !== obj.room
                        ) {
                            idData[obj._id].room.push({ room: obj.room, gameTime });
                        }
                    }
                } else if (obj.type === "controller") {
                    controllerData[obj.room] = obj._id;
                    getData(obj,idData,memory, gameTime);
                } else {
                    getData(obj,idData,memory, gameTime);
                }
            });
        })
    ]);
}

function getData(obj:objData<string>,idData: nameToId,memory: Memory,gameTime:number){
    if(memory?.rooms?.[obj.room]?.construction){
        let namedType = obj.type
        let namedTypeChanged = false;
        for(const name in memory.rooms?.[obj.room].construction){
            if(memory.rooms[obj.room].construction[name].id.some(value => value === obj._id)){
                namedType = name;
                namedTypeChanged = true;
                break;
            }
        }
        if (!idData[obj._id]) {
            idData[obj._id] = {
                type: {
                    baseType: obj.type,
                    idType: obj._id,
                    namedType
                },
                room: [{ room: obj.room, gameTime }],
                id: obj._id
            };
        } else {
            const lastIndex =
                idData[obj._id].room.length - 1;
            if (
                idData[obj._id].room[lastIndex].room !== obj.room
            ) {
                idData[obj._id].room.push({ room: obj.room, gameTime });
            }
            if(idData[obj._id].type.namedType === obj.type && namedTypeChanged){
                idData[obj._id].type.namedType = namedType;
            }
        }
    }else{
        if (!idData[obj._id]) {
            idData[obj._id] = {
                type: {
                    baseType: obj.type,
                    idType: obj._id,
                    namedType: obj.type
                },
                room: [{ room: obj.room, gameTime }],
                id: obj._id
            };
        } else {
            const lastIndex =
                idData[obj._id].room.length - 1;
            if (
                idData[obj._id].room[lastIndex].room !== obj.room
            ) {
                idData[obj._id].room.push({ room: obj.room, gameTime });
            }
        }
    }
}
