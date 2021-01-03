export function log(message?: unknown, ...optionalParams: unknown[]): void {
    console.log(Game.time, message, ...optionalParams);
}
