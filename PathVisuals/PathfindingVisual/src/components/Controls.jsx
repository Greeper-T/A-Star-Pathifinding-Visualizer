export default function Controls({ runAStar, resetGrid, clearBoard, runTommyAStar, generateMaze,
  setStartNode, setEndNode
 }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "10px" }}>
      <hbox style={{marginBottom: "10px"}}>
        <div style={{ marginBottom: "10px" }}>
          <button onClick={runAStar}>Run A*</button>
          <button onClick={runTommyAStar} style={{marginLeft: "10px"}}>Run diagnal A*</button>
          <button onClick={resetGrid} style={{ marginLeft: "10px",  marginRight: "10px"} }>
            Reset Walls
          </button>
          <button onClick={clearBoard}>Clear Board</button>
          <button onClick={generateMaze} style={{marginLeft: "10px"}}>Generate Maze</button>
        </div>
        <div>
          <button onClick={setStartNode}>Set Start Node</button>
          <button onClick={setEndNode}>Set End Node</button>
        </div>
      </hbox>
      
    </div>
  );
}