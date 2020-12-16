/* eslint-disable */
storage.db["rooms.objects"].update({ room: "W8N3", type: "spawn" }, { $set: { store: { energy: 300 } } })

storage.db["rooms.objects"].update({ room: "W8N3", type: "container" }, { $set: { store: { energy: 13000 } } })

storage.db["rooms.objects"].update({ room: "W8N3", type: "storage" }, { $set: { store: { energy: 995000 } } })

storage.db["rooms.objects"].update({ room: "W8N3", type: "extension" }, { $set: { store: { energy: 200 } } })

storage.db["rooms.objects"].update({ room: "W8N3", type: "source" }, { $set: { store: { energy: 6000 } } })

storage.db["rooms.objects"].update({ room: "W8N3", type: "creep" }, { $set: { store: { energy: 200 } } })

storage.db["rooms.objects"].update({ room: "W8N7", type: "rampart" }, { $set: { hits: 3000000 } })

storage.db["rooms.objects"].update({ room: "W8N7", type: "constructedWall" }, { $set: { hits: 3000000 } })

storage.db["rooms.objects"].update({ _id: "1bc30772347c388" },{ $set: { level: 6, progress: 1 } })

storage.db["rooms.objects"].find({ type: "constructionSite" }).then((resp) =>resp.map(cs =>storage.db["rooms.objects"].findOne({ _id: cs._id }).then((csDetail) =>storage.db["rooms.objects"].update({ _id: cs._id },{ $set: { progress: csDetail.progressTotal - 1 } }))))

storage.db["rooms.objects"].find({ type: "spawn" }).then((resp) =>resp.map(cs =>storage.db["rooms.objects"].findOne({ _id: cs._id }).then((csDetail) =>storage.db["rooms.objects"].update({ _id: cs._id },{ $set: { store: { energy: 300 } } }))))
