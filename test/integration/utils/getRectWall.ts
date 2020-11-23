export function getRectWall(topLeft:[number,number],bottomRight:[number,number]){
    let xList:number[]=[]
    let yList:number[]=[]
    let rectList:number[][]=[]
    for(let i = topLeft[0],j=bottomRight[0];i<=j;i++){
        xList.push(i)
    }
    for(let i = topLeft[1],j=bottomRight[1];i<=j;i++){
        yList.push(i)
    }
    for(let x of [topLeft[0],bottomRight[0]]){
        for(let y of yList){
            rectList.push([x,y])
        }
    }
    xList =xList.slice(1,-1)
    for(let y of [topLeft[1],bottomRight[1]]){
        for(let x of xList){
            rectList.push([x,y])
        }
    }
    return rectList
}
