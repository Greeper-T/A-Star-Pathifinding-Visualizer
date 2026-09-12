import { getNeighbors } from "../utils/GridUtils";

function diagnalHeuristic(startNode, endingNode){
    let dx = Math.abs(startNode.col - endingNode.col)
    let dy = Math.abs(startNode.row - endingNode.row)

let D = 1;
let Dtwo = Math.sqrt(2)

    return D * (dx + dy) + (Dtwo - 2 *D) * Math.min(dx, dy)
}

export function AstarAttempt(grid, startingNode, endingNode){
    let openList = []
    let closedList = []
    startingNode.g = 0
    startingNode.h = diagnalHeuristic(startingNode, endingNode)
    startingNode.f = startingNode.g + startingNode.h

    openList.push(startingNode)

    while(openList.length > 0){
        openList.sort((a, b) => a.f - b.f);
        let current = openList.shift();
        closedList.push(current)
        if(current == endingNode){
            return closedList
        }
        let neibors = getNeighbors(current, grid, true)
        for(let neibor of neibors){
            if(neibor.isWall || closedList.includes(neibor)) continue
            const isDiagonal =
            neibor.row !== current.row &&
            neibor.col !== current.col;

            const cost = isDiagonal ? Math.SQRT2 : 1;

            const tempG = current.g + cost;

            if (tempG < neibor.g || !openList.includes(neibor)) {
                console.log("added neibor")
                neibor.g = tempG
                neibor.h = diagnalHeuristic(neibor, endingNode)
                neibor.f = neibor.h + neibor.g
                neibor.previousNode = current
                openList.push(neibor)
            }
        }
    } 
    console.log(closedList.length)
    return closedList
}

export function getShortestPathT(endNode) {
  const path = [];
  let current = endNode;

  while (current !== null) {
    path.unshift(current);
    current = current.previousNode;
  }

  return path;
}