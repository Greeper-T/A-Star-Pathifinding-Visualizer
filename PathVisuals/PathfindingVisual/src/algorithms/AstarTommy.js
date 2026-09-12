import { getNeighbors } from "../utils/GridUtils";

function diagnalHeuristic(startNode, endingNode){
    let dx = Math.abs(startNode.col - endingNode.col)
    let dy = Math.abs(startNode.row - endingNode.row)

    let D = 1;
    let Dtwo = Math.sqrt(2)

    return D * (dx + dy) + (Dtwo - 2 *D) * Math.min(dx, dy)
}

export function AstarAttempt(grid, startingNode, endingNode) {
  let openList = [];
  let closedList = [];

  startingNode.g = 0;
  startingNode.h = diagnalHeuristic(startingNode, endingNode);
  startingNode.f = startingNode.g + startingNode.h;

  openList.push(startingNode);

  while (openList.length > 0) {
    // sorting the list
    openList.sort((a, b) => a.f - b.f);
    // gets the first element of the list
    let current = openList.shift();

    closedList.push(current);

    if (current === endingNode) {
      return closedList;
    }

    let neighbors = getNeighbors(current, grid, true);

    for (let neighbor of neighbors) {
      if (neighbor.isWall || closedList.includes(neighbor)) continue;

      const isDiagonal =
        neighbor.row !== current.row &&
        neighbor.col !== current.col;

      const moveCost = isDiagonal ? Math.SQRT2 : 1;

      const tempG = current.g + moveCost * neighbor.weight;

      if (tempG < neighbor.g) {
        neighbor.previousNode = current;
        neighbor.g = tempG;
        neighbor.h = diagnalHeuristic(neighbor, endingNode);
        neighbor.f = neighbor.g + neighbor.h;

        if (!openList.includes(neighbor)) {
          openList.push(neighbor);
        }
      }
    }
  }

  return closedList;
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