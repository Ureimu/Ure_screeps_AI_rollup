type analyseData = [string, string, string | number, number][];
interface nameToId {
    [id: string]: {
        type: {
            idType: string;
            baseType: string;
            namedType: string;
        };
        room: string | roomPosData[];
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
