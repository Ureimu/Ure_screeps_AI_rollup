export function getStringList(str:string){
    let j = -1;
    let m = str;
    let strList = [];
    while(m.includes("\n")){
        j=m.indexOf("\n");
        strList.push(m.slice(0,j));
        m=m.slice(j+1);
    }
    return strList;
}

export function printMulText(layoutF:Text):map<elementsConstant>[]{
    let objList = [];
    let strList = getStringList(layoutF.content);
    let i = 0;
    for(let strx of strList){
        objList.push({type:<elementsConstant>"Text",layout:{content:strx,x:layoutF.x,y:layoutF.y+i,align:layoutF.align}});
        i+=1;
    }
    return objList;
}
