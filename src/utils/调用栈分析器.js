/**
                  调用栈分析器

 为了更好的分析代码效率和优化效率，开发了这个调用栈信息耗时的工具
 该工具比较占用cpu(也不是很占用）建议上线后关闭此功能）只要 1 不生效，就没性能影响



 使用方式

 1.挂载
 module.exports.loop=require("这个js").warpLoop(main); // main就是主函数的loop
 // module.exports.loop=main;

 2.修改挂载
 修改挂载看下面挂载

 3.修改变量
 saveSum=300; // 保存的帧数
 // printTick=10; // Game.time % printTick ==0 打印堆栈信息
 require("这个js").print()


 挂载参数说明

 挂载的地方
 function Mount //  挂载函数
 function runtimeMount // 没办法挂在prototype时候用Mount


 挂载方式:
 ---单例模式
 registerAnalysis(单例模式,"名称");  支持递归挂载 （对象种包含对象)
 样例:
 let entity=
 {
    randomGet:function (array) {
        return array[Math.floor(array.length*Math.random())]
    },
    entity2:{
        "randomGet2":function (array) {
            return array[Math.floor(array.length*Math.random())]
        },
     }
  }
 registerAnalysis(entity,"entity"); //里面的 randomGet randomGet2 都会记录性能


 ---类对象
 pureFunctionsToWarp 只有cpu计算的
 hardFunctionsToWarp 有固定消耗的
 {name: 'PathFinder.search', parent: PathFinder, val: PathFinder.search},
 {name: 'RoomPosition.findClosestByPath', parent: RoomPosition.prototype, val: RoomPosition.prototype.findClosestByPath},





 打印参数说明：
 total:0, // 全部 cpu
 hardLess:0, // total - hard
 pure:0, // total - child node total 纯当前函数消耗的cpu
 time:0, // 调用次数
 hard:0, // 包含 0.2 cpu 的
 hardOK:0, // 0.2 cpu 成功的调用次数

 */















// loop的名字
let loopName='loop';

// 硬消耗的函数集合
let hardFunctionsToWarp = [
    {name: 'Game.notify', parent: Game, val: Game.notify},
    {name: 'Market.cancelOrder', parent: Game.market, val: Game.market.cancelOrder},
    {name: 'Market.changeOrderPrice', parent: Game.market, val: Game.market.changeOrderPrice},
    {name: 'Market.createOrder', parent: Game.market, val: Game.market.createOrder},
    {name: 'Market.deal', parent: Game.market, val: Game.market.deal},
    {name: 'Market.extendOrder', parent: Game.market, val: Game.market.extendOrder},
    {name: 'ConstructionSite.remove', parent: ConstructionSite.prototype, val: ConstructionSite.prototype.remove},
    {name: 'Creep.attack', parent: Creep.prototype, val: Creep.prototype.attack},
    {name: 'Creep.attackController', parent: Creep.prototype, val: Creep.prototype.attackController},
    {name: 'Creep.build', parent: Creep.prototype, val: Creep.prototype.build},
    {name: 'Creep.claimController', parent: Creep.prototype, val: Creep.prototype.claimController},
    {name: 'Creep.dismantle', parent: Creep.prototype, val: Creep.prototype.dismantle},
    {name: 'Creep.drop', parent: Creep.prototype, val: Creep.prototype.drop},
    {name: 'Creep.generateSafeMode', parent: Creep.prototype, val: Creep.prototype.generateSafeMode},
    {name: 'Creep.harvest', parent: Creep.prototype, val: Creep.prototype.harvest},
    {name: 'Creep.heal', parent: Creep.prototype, val: Creep.prototype.heal},
    {name: 'Creep.move', parent: Creep.prototype, val: Creep.prototype.move},
    {name: 'Creep.notifyWhenAttacked', parent: Creep.prototype, val: Creep.prototype.notifyWhenAttacked},
    {name: 'Creep.pickup', parent: Creep.prototype, val: Creep.prototype.pickup},
    {name: 'Creep.rangedAttack', parent: Creep.prototype, val: Creep.prototype.rangedAttack},
    {name: 'Creep.rangedHeal', parent: Creep.prototype, val: Creep.prototype.rangedHeal},
    {name: 'Creep.rangedMassAttack', parent: Creep.prototype, val: Creep.prototype.rangedMassAttack},
    {name: 'Creep.repair', parent: Creep.prototype, val: Creep.prototype.repair},
    {name: 'Creep.reserveController', parent: Creep.prototype, val: Creep.prototype.reserveController},
    {name: 'Creep.signController', parent: Creep.prototype, val: Creep.prototype.signController},
    {name: 'Creep.suicide', parent: Creep.prototype, val: Creep.prototype.suicide},
    {name: 'Creep.transfer', parent: Creep.prototype, val: Creep.prototype.transfer},
    {name: 'Creep.upgradeController', parent: Creep.prototype, val: Creep.prototype.upgradeController},
    {name: 'Creep.withdraw', parent: Creep.prototype, val: Creep.prototype.withdraw},
    {name: 'Flag.remove', parent: Flag.prototype, val: Flag.prototype.remove},
    {name: 'Flag.setColor', parent: Flag.prototype, val: Flag.prototype.setColor},
    {name: 'Flag.setPosition', parent: Flag.prototype, val: Flag.prototype.setPosition},
    {name: 'PowerCreep.delete', parent: PowerCreep.prototype, val: PowerCreep.prototype.delete},
    {name: 'PowerCreep.drop', parent: PowerCreep.prototype, val: PowerCreep.prototype.drop},
    {name: 'PowerCreep.enableRoom', parent: PowerCreep.prototype, val: PowerCreep.prototype.enableRoom},
    {name: 'PowerCreep.move', parent: PowerCreep.prototype, val: PowerCreep.prototype.move},
    {name: 'PowerCreep.notifyWhenAttacked', parent: PowerCreep.prototype, val: PowerCreep.prototype.notifyWhenAttacked},
    {name: 'PowerCreep.pickup', parent: PowerCreep.prototype, val: PowerCreep.prototype.pickup},
    {name: 'PowerCreep.renew', parent: PowerCreep.prototype, val: PowerCreep.prototype.renew},
    {name: 'PowerCreep.spawn', parent: PowerCreep.prototype, val: PowerCreep.prototype.spawn},
    {name: 'PowerCreep.suicide', parent: PowerCreep.prototype, val: PowerCreep.prototype.suicide},
    {name: 'PowerCreep.transfer', parent: PowerCreep.prototype, val: PowerCreep.prototype.transfer},
    {name: 'PowerCreep.upgrade', parent: PowerCreep.prototype, val: PowerCreep.prototype.upgrade},
    {name: 'PowerCreep.usePower', parent: PowerCreep.prototype, val: PowerCreep.prototype.usePower},
    {name: 'PowerCreep.withdraw', parent: PowerCreep.prototype, val: PowerCreep.prototype.withdraw},
    {name: 'Room.createConstructionSite', parent: Room.prototype, val: Room.prototype.createConstructionSite},
    {name: 'Room.createFlag', parent: Room.prototype, val: Room.prototype.createFlag},
    {name: 'Structure.destroy', parent: Structure.prototype, val: Structure.prototype.destroy},
    {name: 'Structure.notifyWhenAttacked', parent: Structure.prototype, val: Structure.prototype.notifyWhenAttacked},
    {name: 'StructureController.activateSafeMode', parent: StructureController.prototype, val: StructureController.prototype.activateSafeMode},
    {name: 'StructureController.unclaim', parent: StructureController.prototype, val: StructureController.prototype.unclaim},
    {name: 'StructureFactory.produce', parent: StructureFactory.prototype, val: StructureFactory.prototype.produce},
    {name: 'StructureLab.boostCreep', parent: StructureLab.prototype, val: StructureLab.prototype.boostCreep},
    {name: 'StructureLab.runReaction', parent: StructureLab.prototype, val: StructureLab.prototype.runReaction},
    {name: 'StructureLab.unboostCreep', parent: StructureLab.prototype, val: StructureLab.prototype.unboostCreep},
    {name: 'StructureLink.transferEnergy', parent: StructureLink.prototype, val: StructureLink.prototype.transferEnergy},
    {name: 'StructureNuker.launchNuke', parent: StructureNuker.prototype, val: StructureNuker.prototype.launchNuke},
    {name: 'StructureObserver.observeRoom', parent: StructureObserver.prototype, val: StructureObserver.prototype.observeRoom},
    {name: 'StructurePowerSpawn.processPower', parent: StructurePowerSpawn.prototype, val: StructurePowerSpawn.prototype.processPower},
    {name: 'StructureRampart.setPublic', parent: StructureRampart.prototype, val: StructureRampart.prototype.setPublic},
    {name: 'StructureSpawn.spawnCreep', parent: StructureSpawn.prototype, val: StructureSpawn.prototype.spawnCreep},
    {name: 'StructureSpawn.recycleCreep', parent: StructureSpawn.prototype, val: StructureSpawn.prototype.recycleCreep},
    {name: 'StructureSpawn.renewCreep', parent: StructureSpawn.prototype, val: StructureSpawn.prototype.renewCreep},
    {name: 'Spawning.cancel', parent: StructureSpawn.Spawning.prototype, val: StructureSpawn.Spawning.prototype.cancel},
    {name: 'Spawning.setDirections', parent: StructureSpawn.Spawning.prototype, val: StructureSpawn.Spawning.prototype.setDirections},
    {name: 'StructureTerminal.send', parent: StructureTerminal.prototype, val: StructureTerminal.prototype.send},
    {name: 'StructureTower.attack', parent: StructureTower.prototype, val: StructureTower.prototype.attack},
    {name: 'StructureTower.heal', parent: StructureTower.prototype, val: StructureTower.prototype.heal},
    {name: 'StructureTower.repair', parent: StructureTower.prototype, val: StructureTower.prototype.repair},
];

//nohard

let pureFunctionsToWarp = [
    {name: 'PathFinder.search', parent: PathFinder, val: PathFinder.search},
    {name: 'RoomPosition.findClosestByPath', parent: RoomPosition.prototype, val: RoomPosition.prototype.findClosestByPath},
    {name: 'RoomPosition.findClosestByRange', parent: RoomPosition.prototype, val: RoomPosition.prototype.findClosestByRange},
    {name: 'RoomPosition.findPathTo', parent: RoomPosition.prototype, val: RoomPosition.prototype.findPathTo},
    {name: 'RoomPosition.find', parent: RoomPosition.prototype, val: RoomPosition.prototype.find},
    {name: 'RoomPosition.look', parent: RoomPosition.prototype, val: RoomPosition.prototype.look},
    {name: 'Room.lookAtArea', parent: Room.prototype, val: Room.prototype.lookAtArea},
    {name: 'Room.lookAt', parent: Room.prototype, val: Room.prototype.lookAt},
    {name: 'Room.findPath', parent: Room.prototype, val: Room.prototype.findPath},
    {name: 'Room.findExitTo', parent: Room.prototype, val: Room.prototype.findExitTo},
    {name: 'Creep.findExitTo', parent: Creep.prototype, val: Creep.prototype.moveTo}
]

// 运行时 mount
let runTimePureFunctionsToWarp = [
    {name: 'Game.map.findRoute', parent: Game.map, val: Game.map.findRoute},
    {name: 'Game.map.findExit', parent: Game.map, val: Game.map.findExit},
    {name: 'Game.map.getRoomStatus', parent: Game.map, val: Game.map.getRoomStatus},
    {name: 'Game.market.getAllOrders', parent: Game.market, val: Game.market.getAllOrders}
]


/*****************************************************************************************************/


// 当前用的函数栈
let funcStack=[loopName];

// 多次函数栈
let funcMultiStack={};

// 当前tick 函数使用的时间
let currentTick={};

const colours = {
    纯红: '#FF0000',
    猩红: '#DC143C',
    桃红: '#f47983',
    浅粉: '#FFA0AB',

    橙色: '#FFA500',
    橘红: '#FF4500',

    暗黄: '#DAA520',
    金色: '#FFD700',
    纯黄: '#FFFF00',
    浅黄: '#FFFFA0',

    纯绿: '#008000',
    草绿: '#40de5a',
    亮绿: '#22FF22',
    黄绿: '#ADFF2F',

    暗青: '#008B8B',
    青色: '#00e09e',
    青碧: '#7FFFD4',

    纯蓝: '#0000FF',
    亮蓝: '#87CEFA',
    宝蓝: '#4169E1',
    深蓝: '#00008B',

    蓝紫: '#8A2BE2',
    纯紫: '#B000B0',
    亮紫: '#FF00FF',

    褐色: '#6e511e',
    茶色: '#D2B48C',
    蜜白: '#F0FFF0',
    墨灰: '#758a99',
    黝黑: '#665757',
};
let color=_.values(colours).sort((a,b)=>{
    return -a[a.length-4]+b[b.length-4]
})


/**
 * 生成对象实体
 * @param entity
 */
function getTickBase(entity) {
    return entity||{
        merge:function(another){
            another=getTickBase(another);
            for(let k in this){
                another[k]=another[k]+this[k]
            }
            return another
        },
        add:function(cpu,isHard){
            if(cpu>0.15&&isHard) this.hard+=cpu;
            this.total+=cpu;
            this.time+=1;
            if(cpu>0.15&&isHard)
                this.hardOK+=1;
        },
        total:0,
        hardLess:0, // total - hard
        pure:0, // total - child node total
        time:0,
        hard:0, // 0.2 cpu
        hardOK:0, // 0.2 cpu success times
    }
}

function buildTree(currentTick){
    let tree={};
    let build= function(t,ls){ // 建树
        let element = ls[0];
        if(ls.length==1){
            t[element]=t[element];
        }else{
            ls.shift();
            t[element]=t[element]||{};
            build(t[element],ls)
        }
    };
    _.keys(currentTick).forEach(e=>build(tree,e.split("->")));
    let analysisPure=function (tree,name) { // 计算 纯度 和 非硬消耗
        let pure=0;
        let hardLess=0;
        for(let n in tree){
            let fullName = name?name+"->"+n:n;
            pure-=currentTick[fullName].total;
            hardLess-=currentTick[fullName].hard;
            let child=analysisPure(tree[n],fullName)
            hardLess+=child[1] // 硬消耗是递归的，而纯度只要1级儿子节点
        }
        if(name){
            currentTick[name].hardLess=currentTick[name].total+hardLess-currentTick[name].hard;
            currentTick[name].pure=currentTick[name].total+pure-currentTick[name].hard;
        }
        return [pure,hardLess]
    };
    analysisPure(tree);
    return tree;
}

function show(number) {
    if(!number||number<0)
        return ""
    let org=number
    number=(number/tickTimes).toFixed(3).replace(/[.]?0+$/g,"");
    if(org!=parseInt(org)){
        if(number>10) return "<span style=\"color:#FF0000\">"+number+"</span>"
        if(number>3) return "<span style=\"color:#F44336\">"+number+"</span>"
        if(number>1) return "<span style=\"color:#EF9A9A\">"+number+"</span>"
        if(number>0.1) return "<span style=\"color:#FFCDD2\">"+number+"</span>"
        return number
    }
    if(number>10) return "<span style=\"color:#FF0000\">"+number+"</span>"
    if(number>3) return "<span style=\"color:#FFA0AB\">"+number+"</span>"
    return number
}

function getFuncTree(currentTick,tree,name,head="",deep=0){
    if(!tree)tree=buildTree(currentTick);
    let out="";
    let keys = _.keys(tree).sort((a,b)=>currentTick[name?name+"->"+b:b].total-currentTick[name?name+"->"+a:a].total);
    let last = _.last(keys);
    for(let n of keys){
        let fullName = name?name+"->"+n:n;
        let h=head+(name?(last==n?"└──":"├──"):"");
        out+=(
            "<tr><td>"+
            h+"<span style=\"color:"+color[deep%color.length]+"\">"+n+"</span></td><td>"
            +show(currentTick[fullName].total)+"</td><td>"
            +show(currentTick[fullName].hardLess)+"</td><td>"
            +show(currentTick[fullName].pure)+"</td><td>"
            +show(currentTick[fullName].time)+"</td><td>"
            +show(currentTick[fullName].hard)+"</td><td>"
            +show(currentTick[fullName].hardOK)+"</td><td>"
            +"</tr>"
        );
        if(tree[n])out+=getFuncTree(currentTick,tree[n],fullName,head+(name?(last==n?"   ":"|  "):""),deep+1);
    }
    return out
}



function warpAction(name, parent, action, hard){
    let actionName = name.split('.').pop();

    function warppedAction() {
        const start = Game.cpu.getUsed();
        funcStack.push(name);
        let currentName=funcStack.join("->");

        let code = action.apply(this, arguments);

        const end = Game.cpu.getUsed();
        let det=end - start;

        currentTick[currentName]=getTickBase(currentTick[currentName])
        currentTick[currentName].add(det,hard&&code==OK);
        funcStack.pop();

        return code;
    }

    // parent['$_$' + actionName] = action;
    parent[actionName] = warppedAction;
}

/**
 *
 * @param obj 单例模式的对象
 * @param name 对象的别名（最好一样）
 */
function registerAnalysis(obj,name,deep=5) {// deep 限制递归，避免爆栈

    for(let key in obj){
        if(key.startsWith("$_$"))continue;
        try{
            if(obj[key] instanceof Function){
                function warppedAction() {
                    let err;
                    let out;
                    funcStack.push(name+"."+key);
                    let currentName=funcStack.join("->");
                    const start = Game.cpu.getUsed();
                    try {// 保证报错了能正确统计
                        out = obj["$_$"+key].apply(obj, arguments);
                    }catch (e) {
                        err=e;// 将错误带出来
                    }finally {
                        const end =  Game.cpu.getUsed();
                        let det = end - start;
                        currentTick[currentName]=getTickBase(currentTick[currentName]);
                        currentTick[currentName].add(det);
                        // console.log(currentName+" "+det);//打印栈信息
                        funcStack.pop();
                    }
                    if(err)throw err;
                    return out;
                }
                obj["$_$"+key]=obj[key]
                obj[key]=warppedAction
            }else if(obj[key] instanceof Object){
                if(deep>0){
                    registerAnalysis(obj[key],name+"."+key,deep-1)
                }
            }
        }catch (e) {
             console.log(key,typeof obj[key]);
        }
    }
}

function runtimeMount(){
    runTimePureFunctionsToWarp.forEach(({name, parent, val}) => warpAction(name, parent, val,true));
}
function mount(){
    hardFunctionsToWarp.forEach(({name, parent, val}) => warpAction(name, parent, val,true));
    pureFunctionsToWarp.forEach(({name, parent, val}) => warpAction(name, parent, val,false));
    let managerRooms = require('managerRooms');
    let utilsRes = require('utilsRes');
    let managerWorld = require('managerWorld');
    let managerWar = require('managerWar');
    let mangerCreeps = require('mangerCreeps');
    let structTower = require('structTower');
    let structLink = require('structLink');
    let structContainer = require('structContainer');

    let roomWorker = require('roomWorker');
    let roomCarrier = require('roomCarrier');
    let roomClaimer = require('roomClaimer');
    let roomAttacker = require('roomAttacker');
    let roomScouter = require('roomScouter');
    let outerHarvester = require('outerHarvester');

    registerAnalysis(managerRooms,"managerRooms");
    registerAnalysis(utilsRes,"utilsRes");
    registerAnalysis(managerWorld,"managerWorld");
    registerAnalysis(managerWar,"managerWar");
    registerAnalysis(mangerCreeps,"mangerCreeps");
    registerAnalysis(structTower,"structTower");
    registerAnalysis(structLink,"structLink");
    registerAnalysis(structContainer,"structContainer");

    registerAnalysis(roomWorker,"roomWorker");
    registerAnalysis(roomCarrier,"roomCarrier");
    registerAnalysis(roomClaimer,"roomClaimer");
    registerAnalysis(roomAttacker,"roomAttacker");
    registerAnalysis(roomScouter,"roomScouter");
    registerAnalysis(outerHarvester,"outerHarvester");



    registerAnalysis(Room,"Room");
}


let tickTimes=0;
let pro={
    saveSum:300, // 保存的帧数
    // printTick:30, // Game.time % printTick ==0 打印堆栈信息
    print:()=>{pro.printAble=true;return "正在生成树状数据"},
    printAble:false,
    warpLoop:function(loop){
        mount();
        return function(){
            runtimeMount()
            const start = Game.cpu.getUsed();
            funcStack=[loopName];
            if(_.keys(currentTick).length>0){
                funcMultiStack[Game.time%pro.saveSum]=currentTick;
            }
            currentTick={};
            currentTick[loopName]=getTickBase(currentTick[loopName]);
            loop();
            const end =  Game.cpu.getUsed();
            currentTick[loopName].add(end-start);

            // if(Game.time%pro.printTick==0){
            if(pro.printAble){
                pro.printAble=false;
                const start = Game.cpu.getUsed();
                tickTimes=0;
                let current={};
                for(let t in funcMultiStack){
                    if(t>=pro.saveSum){
                        delete funcMultiStack[t];
                        continue;
                    }
                    tickTimes++;
                    _.keys(funcMultiStack[t]).forEach(e=>current[e]=funcMultiStack[t][e].merge(current[e]))
                }
                let head=
                    "<table border=\"0\" style='width: 95vw'>"
                    +"<tr><td>"
                    +"统计(AVG) "+tickTimes+" tick 的数据（可以复制到excel)"+"</td><td>"
                    +"total</td><td>"
                    +"hardLs</td><td>"
                    +"pure</td><td>"
                    +"tickTimes</td><td>"
                    +"hard</td><td>"
                    +"hardOK</td><td>"
                    +"</td></tr>"
                let tail="</table>"
                console.log(head+getFuncTree(current)+tail);
                const end =  Game.cpu.getUsed();
                console.log("本次生成树状结构耗时:"+(end-start))
            }
        }
    }
};

module.exports=pro;