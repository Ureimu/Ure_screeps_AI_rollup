/* eslint-disable */
storage.db["rooms.objects"].update({ room: "W8N7", type: "spawn" }, { $set: { store: { energy: 300 } } })

storage.db["rooms.objects"].update({type: "container" }, { $set: { store: { energy: 1300 } } })

storage.db["rooms.objects"].update({type: "storage" }, { $set: { store: { energy: 200000 } } })

storage.db["rooms.objects"].update({type: "terminal" }, { $set: { store: { energy: 30000 } } })

storage.db["rooms.objects"].update({ room: "W8N7", type: "extension" }, { $set: { store: { energy: 50 } } })

storage.db["rooms.objects"].update({ room: "W8N7", type: "source" }, { $set: { store: { energy: 6000 } } })

storage.db["rooms.objects"].update({ room: "W8N7", type: "creep" }, { $set: { store: { energy: 200 } } })

storage.db["rooms.objects"].update({ room: "W8N7", type: "rampart" }, { $set: { hits: 3000000 } })

storage.db["rooms.objects"].update({ room: "W8N7", type: "constructedWall" }, { $set: { hits: 3000000 } })

storage.db["rooms.objects"].update({ _id: "cdbf0773313f0a9" },{ $set: { level: 8, progress: 1 } })

storage.db["rooms.objects"].find({ type: "constructionSite" }).then((resp) =>resp.map(cs =>storage.db["rooms.objects"].findOne({ _id: cs._id }).then((csDetail) =>storage.db["rooms.objects"].update({ _id: cs._id },{ $set: { progress: csDetail.progressTotal - 1 } }))))

storage.db["rooms.objects"].find({ type: "spawn" }).then((resp) =>resp.map(cs =>storage.db["rooms.objects"].findOne({ _id: cs._id }).then((csDetail) =>storage.db["rooms.objects"].update({ _id: cs._id },{ $set: { store: { energy: 500 } } }))))

.then((resp) =>resp.map(cs =>storage.db["rooms.objects"].findOne({ _id: cs._id }).then((csDetail) =>storage.db["rooms.objects"].update({ _id: cs._id },{ $set: { store: { energy: 500 } } }))))

system.setTickDuration(10)

system.resetAllData()
//docker exec -it screeps-server npx screeps cli
help()
recreateNpcOrders
help(strongholds)
updateNpcOrders
system.runCronjob("updateNpcOrders")
strongholds.expand("W5N4")

screepsmod-dynamicmarket
screepsmod-fast-server
screepsmod-auth

//docker run --rm -v $PWD:/screeps quay.io/ags131/screeps-server yarn add screepsmod-market
screepsmod-market
"node_modules/screepsmod-market/index.js",
"node_modules/screepsmod-fast-server/index.js",
"node_modules/screepsmod-auth/index.js",
"node_modules/screepsmod-admin-utils/index.js"

//sudo passwd root
//su root
/etc/docker/daemon.json

// 创建一个npc终端
storage.env.get(storage.env.keys.GAMETIME).then(time => storage.db['rooms.objects'].insert({ type: 'terminal', x: 29, y: 18,user:'d75fcb3509c5fbc', room: 'W10N0',store:{}}))

storage.db.users.update({ username: 'Ureium' }, { $set: { gcl: 1090900000, power: 666000, credits: 1000000 }}).then(print)

storage.db['users.resources'].insert({ username: 'Ureium' }, { $set: { credits: 1000000 }}).then(print)

storage.db['rooms.objects'].removeWhere({_id: '1eeac2738ed3c72'})

storage.db['rooms.objects'].find({$and: [{type: 'terminal'}, {user: {$eq: null}}]}).then(print)

JSON.stringify(Game.market.getAllOrders())
d75fcb3509c5fbc

Game.market.createOrder({type: ORDER_SELL,resourceType: RESOURCE_ENERGY,price: 9.95,totalAmount: 10000,roomName: "W5N8"   });
