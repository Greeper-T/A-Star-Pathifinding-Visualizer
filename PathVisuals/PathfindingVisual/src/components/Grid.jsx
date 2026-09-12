import { useState, useEffect } from "react";
import Node from "./Node";
import Controls from "./Controls";
import { createGrid } from "../utils/GridUtils";
import { astar, getShortestPath } from "../algorithms/Astar";
import { AstarAttempt, getShortestPathT } from "../algorithms/AstarTommy";

export default function Grid() {
  const [grid, setGrid] = useState([]);
  const [mousePressed, setMousePressed] = useState(false);
  const [isSetStart, setIsSetStart] = useState(false);
  const [isSetEnd, setIsSetEnd] = useState(false);

  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);

  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [selectedNode, setSelectedNode] = useState(null);

useEffect(() => {
  if (!isPlaying) return;
  if (currentStep >= steps.length) return;

  const timeout = setTimeout(() => {
    runStep(steps[currentStep]);
    setCurrentStep(prev => prev + 1);
  }, 20);

  return () => clearTimeout(timeout);
}, [isPlaying, currentStep, steps]);


useEffect(() => {
  function handleKeyDown(e) {
    // Toggle play/pause with "p"
    if (e.key === "p") {
      setIsPlaying(prev => !prev);
    }

    // Step forward with space
    if (e.code === "Space") {
      e.preventDefault();

      if (!isPlaying && currentStep < steps.length) {
        runStep(steps[currentStep]);
        setCurrentStep(prev => prev + 1);
      }
    }
  }

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [isPlaying, currentStep, steps]);

  useEffect(() => {
  const newGrid = createGrid(20, 50);

  setGrid(newGrid);

  // Find start & end inside grid
  for (let row of newGrid) {
    for (let node of row) {
      if (node.isStart) setStartNode(node);
      if (node.isEnd) setEndNode(node);
    }
  }
}, []);

  function handleMouseDown(e, row, col) {
    if (e.button !== 0) return; 

    const newGrid = grid.slice();
    const node = newGrid[row][col];

    // SET START NODE
    if (isSetStart) {
      if (startNode) startNode.isStart = false;

      node.isStart = true;
      setStartNode(node);
      setIsSetStart(false);

      setGrid(newGrid);
      return;
    }

    // SET END NODE
    if (isSetEnd) {
      if (endNode) endNode.isEnd = false;

      node.isEnd = true;
      setEndNode(node);
      setIsSetEnd(false);

      setGrid(newGrid);
      return;
    }

    // TOGGLE WALL
    node.isWall = !node.isWall;
    setGrid(newGrid);
    setMousePressed(true);
  }

  function handleMouseEnter(row, col) {
    if (!mousePressed) return;

    const newGrid = grid.slice();
    const node = newGrid[row][col];
    node.isWall = true;

    setGrid(newGrid);
  }

  function handleMouseUp() {
    setMousePressed(false);
  }

  function runAStar() {
  if (!startNode || !endNode) {
    alert("Set start and end nodes first");
    return;
  }

  const newGrid = grid.map(row =>
    row.map(node => ({
      ...node,
      g: Infinity,
      h: 0,
      f: Infinity,
      previousNode: null,
    }))
  );

  const freshStart = newGrid[startNode.row][startNode.col];
  const freshEnd = newGrid[endNode.row][endNode.col];

  const visited = astar(newGrid, freshStart, freshEnd);
  const path = getShortestPath(freshEnd);

  console.log(path);

  if (path.length <= 1) {
    alert("This path is not possible");
    return;
  }

  const animationSteps = [];

  for (let node of visited) {
    animationSteps.push({ type: "visited", node });
  }

  for (let node of path) {
    animationSteps.push({ type: "path", node });
  }

  setGrid(newGrid);

  setSteps(animationSteps);
  setCurrentStep(0);
  setIsPlaying(true);
}

  function runTommyAStar() {
   if (!startNode || !endNode) {
    alert("Set start and end nodes first");
    return;
  }

  const newGrid = grid.map(row =>
    row.map(node => ({
      ...node,
      g: Infinity,
      h: 0,
      f: Infinity,
      previousNode: null,
    }))
  );

  const freshStart = newGrid[startNode.row][startNode.col];
  const freshEnd = newGrid[endNode.row][endNode.col];

  const visited = AstarAttempt(newGrid, freshStart, freshEnd);
  const path = getShortestPathT(freshEnd);

  console.log(path);

  if (path.length <= 1) {
    alert("This path is not possible");
    return;
  }

  const animationSteps = [];

  for (let node of visited) {
    animationSteps.push({ type: "visited", node });
  }

  for (let node of path) {
    animationSteps.push({ type: "path", node });
  }

  setGrid(newGrid);

  setSteps(animationSteps);
  setCurrentStep(0);
  setIsPlaying(true);
  }

  function runStep(step) {
    const { node, type } = step;
      const element = document.getElementById(
        `node-${node.row}-${node.col}`
      );

      if (!element) return;

      if (type === "visited") {
        element.classList.add("node-visited");
      } else if (type === "path") {
        element.classList.add("node-path");
      }
}

  function animate(visitedNodes, path) {
    for (let i = 0; i < visitedNodes.length; i++) {
      setTimeout(() => {
        const node = visitedNodes[i];

        if (!node.isStart && !node.isEnd) {
          document.getElementById(
            `node-${node.row}-${node.col}`
          ).className = "node node-visited";
        }
      }, 20 * i);
    }

    setTimeout(() => {
      animatePath(path);
    }, 20 * visitedNodes.length);
  }

  function animatePath(path) {
    for (let i = 0; i < path.length; i++) {
      setTimeout(() => {
        const node = path[i];

        if (!node.isStart && !node.isEnd) {
          document.getElementById(
            `node-${node.row}-${node.col}`
          ).className = "node node-path";
        }
      }, 50 * i);
    }
  }

  function resetGrid() {
    setStartNode(null);
    setEndNode(null);
    clearBoard()
    setGrid(createGrid(20, 50));
  }

  function clearBoard() {
    for (let rows of grid) {
      for (let node of rows) {
        const element = document.getElementById(
          `node-${node.row}-${node.col}`
        );

        let className = "node ";

        // Reset algorithm values
        node.g = Infinity;
        node.h = 0;
        node.f = Infinity;
        node.previousNode = null;

        if (!element) continue;

        if (node.isWall) {
          className += "node-wall";
        }
        else if (node.isStart) {
          className += "node-start";
        }
        else if (node.isEnd) {
          className += "node-end";
        }
        else if (node.terrain === "water") {
          className += "node-water";
        }
        else if (node.terrain === "grass") {
          className += "node-grass";
        }

        element.className = className;
      }
    }

    // Force React re-render so values update
    setGrid([...grid]);
  }

  function generateMaze() {
    const newGrid = grid.map(row =>
      row.map(node => {

        if (node.isStart || node.isEnd) {
          return {
            ...node,
            terrain: "normal",
            weight: 1,
          };
        }

        const rand = Math.random();

        // WALLS
        if (rand < 0.15) {
          return {
            ...node,
            isWall: true,
            terrain: "wall",
          };
        }

        // WATER
        if (rand < 0.25) {
          return {
            ...node,
            isWall: false,
            terrain: "water",
            weight: 5,
          };
        }

        // TALL GRASS
        if (rand < 0.40) {
          return {
            ...node,
            isWall: false,
            terrain: "grass",
            weight: 2,
          };
        }

        // NORMAL
        return {
          ...node,
          isWall: false,
          terrain: "normal",
          weight: 1,
        };
      })
    );

  setGrid(newGrid);
}

  function enableSetStartNode() {
    setIsSetEnd(false);
    setIsSetStart(true);
    clearBoard()
  }

  function enableSetEndNode() {
    setIsSetEnd(true);
    setIsSetStart(false);
    clearBoard()
  }

  function handleRightClick(node) {
    setSelectedNode(node);
  }

  return (
  <div>
    <Controls
      runAStar={runAStar}
      runTommyAStar={runTommyAStar}
      resetGrid={resetGrid}
      clearBoard={clearBoard}
      generateMaze={generateMaze}
      setStartNode={enableSetStartNode}
      setEndNode={enableSetEndNode}
    />

    {grid.map((row, rowIdx) => (
      <div key={rowIdx} style={{ display: "flex" }}>
        {row.map((node, nodeIdx) => (
          <Node
            key={nodeIdx}
            node={node}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            onMouseUp={handleMouseUp}
            onRightClick={handleRightClick}
          />
        ))}
      </div>
    ))}

    {selectedNode && (
      <div className="node-popup">
        <button
          className="close-button"
          onClick={() => setSelectedNode(null)}
        >
          X
        </button>

        <h3>Node Info</h3>

        <p>Row: {selectedNode.row}</p>
        <p>Col: {selectedNode.col}</p>

        <p>
          G Cost:{" "}
          {selectedNode.g !== Infinity
            ? selectedNode.g.toFixed(2)
            : "∞"}
        </p>

        <p>
          H Cost:{" "}
          {selectedNode.h !== Infinity
            ? selectedNode.h.toFixed(2)
            : "∞"}
        </p>

        <p>
          F Cost:{" "}
          {selectedNode.f !== Infinity
            ? selectedNode.f.toFixed(2)
            : "∞"}
        </p>

        <p>
          Wall: {selectedNode.isWall ? "Yes" : "No"}
        </p>
        <p>Terrain: {selectedNode.terrain}</p>
        <p>Weight: {selectedNode.weight}</p>

        <p>
          Previous Node:{" "}
          {selectedNode.previousNode
            ? `(${selectedNode.previousNode.row}, ${selectedNode.previousNode.col})`
            : "None"}
        </p>
      </div>
    )}
  </div>
);
}
