import { putCenterLinkConstructionSites } from "./centerLink";
import { putControllerLinkConstructionSites } from "./controllerLink";
import { putSourceLinkConstructionSites } from "./sourceLink";

export function putLinkConstructionSites(room: Room) {
    let indexList = [putCenterLinkConstructionSites,putSourceLinkConstructionSites,putControllerLinkConstructionSites];
    let linkNameList = ["centerLink","sourceLink","controllerLink"];
    let i = 0;
    for (let func of indexList) {
        if(room.memory.construction[linkNameList[i]].constructionSitesCompleted == false){
            func(room);
        }
        i++;
    }
}
