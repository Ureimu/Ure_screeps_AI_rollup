export function centerLink(link: StructureLink): void {
    if (!link.room.memory.construction.centerLink.memory[link.id])
        link.room.memory.construction.centerLink.memory[link.id] = {
            hasPushed: false
        };
}
