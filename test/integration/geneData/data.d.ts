type analyseData = singleAnalyseData[];
type singleAnalyseData = [string, string, string | number, number];
type singleOutputData = [objectInf, objectInf, string | number, number, string];
type outputData = singleOutputData[];
interface objectInf {
    idType: string;
    baseType: string;
    namedType: string;
}
interface nameToId {
    [id: string]: {
        type: objectInf;
        room: roomPosData[];
        id: string;
    };
}
interface objData<T> {
    type: T;
    room: string;
    _id: string;
    name: T extends "creep" ? string : undefined;
}
interface roomPosData {
    gameTime: number;
    room: string;
}

interface controllerData {
    [roomName: string]: string;
}
