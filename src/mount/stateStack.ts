/* eslint-disable max-classes-per-file */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export class StateStack {
    public memory: { stack?: [string, unknown, (...args: unknown[]) => unknown][] } = {};
    public invokeState(): boolean {
        if (!this.memory.stack || !this.memory.stack.length) return false;
        const [[, scope, fun]] = this.memory.stack;
        if (!fun) return false;
        fun(scope);
        return true;
    }

    public getState(defaultState = "I"): string {
        if (!this.memory.stack) return defaultState;
        return this.memory.stack[0][0] || defaultState;
    }

    public setState(state: string, scope: unknown, fun: (...args: unknown[]) => unknown): string {
        if (state == null) throw new TypeError("State can not be null");
        if (!this.memory.stack) this.memory.stack = [["", {}, fun]];
        this.memory.stack[0] = [state, scope, fun];
        return state;
    }

    public pushState(state: string, scope = {}, fun: (...args: unknown[]) => unknown): string {
        if (!this.memory.stack) this.memory.stack = [];
        const method = `run${state}`;
        if (fun == null) throw new Error(`No such state or action ${method}`);
        if (this.memory.stack.length >= 100) throw new Error("Automata stack limit exceeded");
        this.memory.stack.unshift([state, scope, fun]);
        return state;
    }

    public popState(): void {
        if (!this.memory.stack || !this.memory.stack.length) return;
        this.memory.stack.shift();
        if (!this.memory.stack.length) this.memory.stack = undefined;
    }

    public clearState(): void {
        this.memory.stack = undefined;
    }
}

export class CreepStateStack extends Creep {}

export class StructureSpawnStateStack extends StructureSpawn {}

export class RoomStateStack extends Room {}

export class PowerCreepStateStack extends PowerCreep {}

export class FlagStateStack extends Flag {}
