import findEx from "utils/findEx";

/**
 * 检查建筑是否满足推送任务的条件，如果满足，则调用callback函数推送任务到任务池。
 *
 * @export
 * @param {AnyStructure} structure
 * @param {[() => boolean, () => boolean]} condition 状态机函数数组。
 * @param {() => void} callback 推送任务的函数
 */
export function checkStructureTask(
    structure: AnyStructure,
    condition: [() => boolean, () => boolean],
    callback: () => void
): void {
    const structureName = findEx.lookForStructureName(structure);
    if (!structure.room.memory.construction[structureName].memory[structure.id])
        structure.room.memory.construction[structureName].memory[structure.id] = {
            hasPushed: false
        };
    if (condition[0]() && !structure.room.memory.construction[structureName].memory[structure.id].hasPushed) {
        callback();
        structure.room.memory.construction[structureName].memory[structure.id].hasPushed = true;
    }

    if (condition[1]() && structure.room.memory.construction[structureName].memory[structure.id].hasPushed) {
        structure.room.memory.construction[structureName].memory[structure.id].hasPushed = false;
    }
}
