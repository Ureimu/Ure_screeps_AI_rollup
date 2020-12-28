/* eslint-disable no-eval */
export function analyseEventLog(rawEventLog: string, gameTime: number, controllerData: controllerData): analyseData {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const allEventLogString: { [roomName: string]: string } = eval(rawEventLog);
    const allEventLog: { [roomName: string]: EventItem[] } = {};
    for (const roomName in allEventLogString) {
        allEventLog[roomName] = JSON.parse(allEventLogString[roomName]) as EventItem[];
    }
    return getAction(allEventLog, gameTime, controllerData);
}

function getAction(
    allEventLog: { [roomName: string]: EventItem[] },
    gameTime: number,
    controllerData: controllerData
): analyseData {
    // "event\t\ttargetFrom\t\ttargetTo\t\tamount\tresourceType\tgameTime\n"
    const logger: analyseData = [];
    for (const roomName in allEventLog) {
        const eventLog = allEventLog[roomName];
        let log: singleAnalyseData;
        for (const event of eventLog) {
            switch (event.event) {
                case EVENT_TRANSFER:
                    {
                        // `Transfer ${targetFrom} ${targetTo} ${event.data.amount} ${event.data.resourceType} ${gameTime}\n`;
                        log = [event.objectId, event.data.targetId, event.data.amount, gameTime];
                        logger.push(log);
                    }
                    break;
                case EVENT_BUILD:
                    {
                        log = [event.objectId, event.data.targetId, event.data.amount, gameTime];
                        logger.push(log);
                    }
                    break;
                case EVENT_HARVEST:
                    {
                        log = [event.data.targetId, event.objectId, event.data.amount, gameTime];
                        logger.push(log);
                    }
                    break;
                case EVENT_REPAIR:
                    {
                        log = [event.objectId, event.data.targetId, event.data.energySpent, gameTime];
                        logger.push(log);
                    }
                    break;
                case EVENT_UPGRADE_CONTROLLER:
                    {
                        log = [event.objectId, controllerData[roomName], event.data.energySpent, gameTime];
                        logger.push(log);
                    }
                    break;
            }
        }
    }
    return logger;
}
