let helpCall ={
    run:function(creep){
        if(!creep.memory.lasthits){//伤害部分,用来呼救
            creep.memory.lasthits = creep.hits;
            creep.memory.beingAttacked = false;
        }
        if (creep.hits < creep.memory.lasthits){
            creep.say('attacked');
            creep.memory.beingAttacked = true;
        }
        if (creep.memory.beingAttacked == true && creep.hits == creep.hitsMax){
            creep.say('healed');
            creep.memory.beingAttacked = false;
        }
        creep.memory.lasthits =creep.hits;
    }
}

global.helpCall = helpCall.run;