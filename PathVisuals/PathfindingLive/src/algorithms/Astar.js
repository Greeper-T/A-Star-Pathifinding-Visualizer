import { getNeighbors } from "../utils/GridUtils";

function heuristic(a, b) {
  // manhattan distance
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export function astar(grid, startNode, endNode) {
  const openSet = [];
  openSet.push(startNode);

  startNode.g = 0;
  startNode.f = heuristic(startNode, endNode);

  // closed list
  const visitedNodesInOrder = [];

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();

    visitedNodesInOrder.push(current);

    if (current === endNode) return visitedNodesInOrder;

    const neighbors = getNeighbors(current, grid, false);

    for (let neighbor of neighbors) {
      if (neighbor.isWall) continue;

      const tempG = current.g + 1;

      if (tempG < neighbor.g) {
        neighbor.previousNode = current;
        neighbor.g = tempG;
        neighbor.h = heuristic(neighbor, endNode);
        neighbor.f = neighbor.g + neighbor.h;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return visitedNodesInOrder;
}

export function getShortestPath(endNode) {
  const path = [];
  let current = endNode;

  while (current !== null) {
    path.unshift(current);
    current = current.previousNode;
  }

  return path;
}