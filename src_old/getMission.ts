//在console使用Memory.getMission.ifRun=true来查看任务信息。

{   
    let getMission = {
        run: function(){
            if(!Memory.getMission){
                Memory.getMission = {
                    firstRun: false,
                    ifRun: false,
                    counter:0,
                    string_x: []
                };
            }
            if(Memory.getMission.ifRun == true){
                if(Memory.getMission.counter == 0){
                    Memory.getMission.firstRun = true;
                }
                else{
                    Memory.getMission.firstRun = false;
                }
                if(Memory.getMission.firstRun == true){
                    Memory.getMission.string_x = [];
                    let missionName = Memory.c_k_info.creepRoleListGivenOutOutwards;
                    for(let m=0,n=missionName.length;m<n;m++){
                        let x=missionName[m];
                        for(let i=0,j=Memory.creepWorkSetting[x].length;i<j;i++){
                            Memory.getMission.string_x.push(
                                '任务角色:'+x +'\t任务编号：'+i + '\n'
                                +Memory.creepWorkSetting[x][i].logString + '\n'
                                +'目前状态：'+Memory.creepWorkSetting[x][i].ifRun
                            );
                            Memory.getMission.string_x.push('Memory.creepWorkSetting.'+ x +'['+i+']'+'.ifRun='+!Memory.creepWorkSetting[x][i].ifRun);
                        };
                    }
                    Memory.getMission.counter = Memory.getMission.string_x.length;
                }
                let number_x = Memory.getMission.string_x.length - Memory.getMission.counter;
                console.log(Memory.getMission.string_x[number_x]);
                Memory.getMission.counter-=1;
                if(Memory.getMission.counter == 0) {
                    Memory.getMission.ifRun = false;
                }
            }
        }
    };
    module.exports = getMission;
}