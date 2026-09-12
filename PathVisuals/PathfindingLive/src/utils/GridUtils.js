export function createNode(row, col) {
  return {
    row,
    col,
    isStart: false,
    isEnd: false,
    isWall: false,
    g: Infinity,
    h: 0,
    f: Infinity,
    previousNode: null,
  };
}

export function createGrid(rows, cols) {
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const currentRow = [];
    for (let c = 0; c < cols; c++) {
      currentRow.push(createNode(r, c));
    }
    grid.push(currentRow);
  }
  return grid;
}

export function getNeighbors(node, grid, isDiagonal) {
  const neighbors = [];
  const { row, col } = node;

  // Straight directions
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  if (isDiagonal) {
    if (row > 0 && col > 0)
      neighbors.push(grid[row - 1][col - 1]);

    if (row > 0 && col < grid[0].length - 1)
      neighbors.push(grid[row - 1][col + 1]);

    if (row < grid.length - 1 && col > 0)
      neighbors.push(grid[row + 1][col - 1]);

    if (row < grid.length - 1 && col < grid[0].length - 1)
      neighbors.push(grid[row + 1][col + 1]);
  }

  return neighbors;
}