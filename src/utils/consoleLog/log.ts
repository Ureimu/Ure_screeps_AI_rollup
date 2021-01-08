declare global {
    // Types defined in a global block are available globally

    namespace NodeJS {
        interface Global {
            log(message?: unknown, ...optionalParams: unknown[]): void;
        }
    }
}

export function log(message?: unknown, ...optionalParams: unknown[]): void {
    console.log(Game.time, message, ...optionalParams);
}
