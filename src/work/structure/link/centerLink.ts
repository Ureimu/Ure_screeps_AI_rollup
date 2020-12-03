export function centerLink(centerLink: StructureLink) {
    if(!centerLink.room.memory.construction["centerLink"].memory.id)centerLink.room.memory.construction["centerLink"].memory.id=centerLink.id;

}
