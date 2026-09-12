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

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= steps.length) {
      setIsPlaying(false);
      return;
    }

    const timeout = setTimeout(() => {
      runStep(steps[currentStep]);
      setCurrentStep(prev => prev + 1);
    }, 1);

    return () => clearTimeout(timeout);
  }, [isPlaying, currentStep, steps]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "p") {
        setIsPlaying(prev => !prev);
      }

      if (e.code === "Space") {
        e.preventDefault();
        if (!isPlaying && currentStep < steps.length) {
          runStep(steps[currentStep]);
          setCurrentStep(prev => prev + 1);
        }
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!endNode) { alert("no end node"); return; }

        const newGrid = deepCopyGrid(grid);
        for (let row of newGrid) {
          for (let node of row) {
            if (node.isEnd) {
              const newRow = node.row - 1;
              if (newRow < 0) return;
              if (newGrid[newRow][node.col].isWall) return;
              if (newGrid[newRow][node.col].isStart) return;

              newGrid[newRow][node.col].isEnd = true;
              node.isEnd = false;

              const newEnd = newGrid[newRow][node.col];
              setEndNode(newEnd);

              const result = showPath(newGrid, startNode, newEnd);
              if (result && result.path.length > 1) {
                const nextStart = result.path[1];
                result.freshGrid[startNode.row][startNode.col].isStart = false;
                result.freshGrid[nextStart.row][nextStart.col].isStart = true;
                setStartNode(result.freshGrid[nextStart.row][nextStart.col]);
                setGrid(result.freshGrid);
              }
              return;
            }
          }
        }
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!endNode) { alert("no end node"); return; }

        const newGrid = deepCopyGrid(grid);
        for (let row of newGrid) {
          for (let node of row) {
            if (node.isEnd) {
              const newRow = node.row + 1;
              if (newRow >= newGrid.length) return;
              if (newGrid[newRow][node.col].isWall) return;
              if (newGrid[newRow][node.col].isStart) return;

              newGrid[newRow][node.col].isEnd = true;
              node.isEnd = false;

              const newEnd = newGrid[newRow][node.col];
              setEndNode(newEnd);

              const result = showPath(newGrid, startNode, newEnd);
              if (result && result.path.length > 1) {
                const nextStart = result.path[1];
                result.freshGrid[startNode.row][startNode.col].isStart = false;
                result.freshGrid[nextStart.row][nextStart.col].isStart = true;
                setStartNode(result.freshGrid[nextStart.row][nextStart.col]);
                setGrid(result.freshGrid);
              }
              return;
            }
          }
        }
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (!endNode) { alert("no end node"); return; }

        const newGrid = deepCopyGrid(grid);
        for (let row of newGrid) {
          for (let node of row) {
            if (node.isEnd) {
              const newCol = node.col - 1;
              if (newCol < 0) return;
              if (newGrid[node.row][newCol].isWall) return;
              if (newGrid[node.row][newCol].isStart) return;

              newGrid[node.row][newCol].isEnd = true;
              node.isEnd = false;

              const newEnd = newGrid[node.row][newCol];
              setEndNode(newEnd);

              const result = showPath(newGrid, startNode, newEnd);
              if (result && result.path.length > 1) {
                const nextStart = result.path[1];
                result.freshGrid[startNode.row][startNode.col].isStart = false;
                result.freshGrid[nextStart.row][nextStart.col].isStart = true;
                setStartNode(result.freshGrid[nextStart.row][nextStart.col]);
                setGrid(result.freshGrid);
              }
              return;
            }
          }
        }
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (!endNode) { alert("no end node"); return; }

        const newGrid = deepCopyGrid(grid);
        for (let row of newGrid) {
          for (let node of row) {
            if (node.isEnd) {
              const newCol = node.col + 1;
              if (newCol >= newGrid[0].length) return;
              if (newGrid[node.row][newCol].isWall) return;
              if (newGrid[node.row][newCol].isStart) return;

              newGrid[node.row][newCol].isEnd = true;
              node.isEnd = false;

              const newEnd = newGrid[node.row][newCol];
              setEndNode(newEnd);

              const result = showPath(newGrid, startNode, newEnd);
              if (result && result.path.length > 1) {
                const nextStart = result.path[1];
                result.freshGrid[startNode.row][startNode.col].isStart = false;
                result.freshGrid[nextStart.row][nextStart.col].isStart = true;
                setStartNode(result.freshGrid[nextStart.row][nextStart.col]);
                setGrid(result.freshGrid);
              }
              return;
            }
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, currentStep, steps, grid, startNode, endNode]);

  useEffect(() => {
    const newGrid = createGrid(20, 50);
    setGrid(newGrid);

    for (let row of newGrid) {
      for (let node of row) {
        if (node.isStart) setStartNode(node);
        if (node.isEnd) setEndNode(node);
      }
    }
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────

  function deepCopyGrid(g) {
    return g.map(row => row.map(node => ({ ...node })));
  }

  function clearVisuals(g) {
    for (let row of g) {
      for (let node of row) {
        const el = document.getElementById(`node-${node.row}-${node.col}`);
        if (!el) continue;
        if (node.isWall) el.className = "node node-wall";
        else if (node.isStart) el.className = "node node-start";
        else if (node.isEnd) el.className = "node node-end";
        else el.className = "node";
      }
    }
  }

  // ── Core actions ───────────────────────────────────────────────────────────

  function handleMouseDown(row, col) {
    const newGrid = deepCopyGrid(grid);
    const node = newGrid[row][col];

    if (isSetStart) {
      // Clear old start
      for (let r of newGrid) for (let n of r) n.isStart = false;
      node.isStart = true;
      setStartNode(node);
      setIsSetStart(false);
      clearVisuals(newGrid);
      setGrid(newGrid);
      return;
    }

    if (isSetEnd) {
      for (let r of newGrid) for (let n of r) n.isEnd = false;
      node.isEnd = true;
      setEndNode(node);
      setIsSetEnd(false);
      clearVisuals(newGrid);
      setGrid(newGrid);
      return;
    }

    node.isWall = !node.isWall;
    setGrid(newGrid);
    setMousePressed(true);
  }

  function handleMouseEnter(row, col) {
    if (!mousePressed) return;
    const newGrid = deepCopyGrid(grid);
    newGrid[row][col].isWall = true;
    setGrid(newGrid);
  }

  function handleMouseUp() {
    setMousePressed(false);
  }

  function runStep(step) {
    const { node, type } = step;
    if (node.isStart || node.isEnd) return;

    const el = document.getElementById(`node-${node.row}-${node.col}`);
    if (!el) return;

    if (type === "visited") el.className = "node node-visited";
    else if (type === "path") el.className = "node node-path";
  }

  // showPath accepts the grid + nodes explicitly so it never reads stale state.
  // Returns { freshGrid, path } so callers can move start along the path.
  function showPath(currentGrid, start, end) {
    if (!start || !end) return null;

    // Build a fresh grid with algorithm values reset
    const freshGrid = currentGrid.map(row =>
      row.map(node => ({
        ...node,
        g: Infinity,
        h: 0,
        f: Infinity,
        previousNode: null,
      }))
    );

    const freshStart = freshGrid[start.row][start.col];
    const freshEnd = freshGrid[end.row][end.col];

    const visited = astar(freshGrid, freshStart, freshEnd);
    const path = getShortestPath(freshEnd);

    // Reset visuals without touching grid state
    clearVisuals(freshGrid);
    setGrid(freshGrid);

    const animationSteps = [
      ...visited.map(node => ({ type: "visited", node })),
      ...path.map(node => ({ type: "path", node })),
    ];

    setSteps(animationSteps);
    setCurrentStep(visited.length + 1);
    setIsPlaying(true);

    return { freshGrid, path };
  }

  function runAStar() {
    if (!startNode || !endNode) {
      alert("Set start and end nodes first");
      return;
    }

    const freshGrid = deepCopyGrid(grid).map(row =>
      row.map(node => ({ ...node, g: Infinity, h: 0, f: Infinity, previousNode: null }))
    );

    const freshStart = freshGrid[startNode.row][startNode.col];
    const freshEnd = freshGrid[endNode.row][endNode.col];

    const visited = astar(freshGrid, freshStart, freshEnd);
    const path = getShortestPath(freshEnd);

    clearVisuals(freshGrid);
    setGrid(freshGrid);
    
    const animationSteps = [
      ...visited.map(node => ({ type: "visited", node })),
      ...path.map(node => ({ type: "path", node })),
    ];

    setSteps(animationSteps);
    setCurrentStep(0);
    setIsPlaying(true);
  }

  function runTommyAStar() {
    if (!startNode || !endNode) {
      alert("Set start and end nodes first");
      return;
    }

    const freshGrid = deepCopyGrid(grid).map(row =>
      row.map(node => ({ ...node, g: Infinity, h: 0, f: Infinity, previousNode: null }))
    );

    const freshStart = freshGrid[startNode.row][startNode.col];
    const freshEnd = freshGrid[endNode.row][endNode.col];

    const visited = AstarAttempt(freshGrid, freshStart, freshEnd);
    const path = getShortestPathT(freshEnd);

    clearVisuals(freshGrid);
    setGrid(freshGrid);

    const animationSteps = [
      ...visited.map(node => ({ type: "visited", node })),
      ...path.map(node => ({ type: "path", node })),
    ];

    setSteps(animationSteps);
    setCurrentStep(0);
    setIsPlaying(true);
  }

  function resetGrid() {
    setIsPlaying(false);
    setSteps([]);
    setCurrentStep(0);
    setStartNode(null);
    setEndNode(null);
    const newGrid = createGrid(20, 50);
    setGrid(newGrid);
    for (let row of newGrid) {
      for (let node of row) {
        if (node.isStart) setStartNode(node);
        if (node.isEnd) setEndNode(node);
      }
    }
  }

  function clearBoard() {
    const newGrid = grid.map(row =>
      row.map(node => ({
        ...node,
        g: Infinity,
        h: 0,
        f: Infinity,
        previousNode: null,
      }))
    );
    clearVisuals(newGrid);
    setGrid(newGrid);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  }

  function generateMaze() {
    const newGrid = grid.map(row =>
      row.map(node => {
        if (node.isStart || node.isEnd) return { ...node };
        return { ...node, isWall: Math.random() >= 0.7 };
      })
    );
    setGrid(newGrid);
  }

  function enableSetStartNode() {
    setIsSetEnd(false);
    setIsSetStart(true);
  }

  function enableSetEndNode() {
    setIsSetEnd(true);
    setIsSetStart(false);
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
            />
          ))}
        </div>
      ))}
    </div>
  );
}