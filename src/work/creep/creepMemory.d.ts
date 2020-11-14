declare namespace NodeJS {
    interface Global {
        creepMemory: { [name: string]:creepMemory};
    }
}

interface creepMemory {
    [name: string]:any
}
