export default function Node({ node, onMouseDown, onMouseEnter, onMouseUp }) {
  const { row, col, isStart, isEnd, isWall } = node;

  let className = "node";
  if (isStart) className += " node-start";
  else if (isEnd) className += " node-end";
  else if (isWall) className += " node-wall";

  return (
    <div
      id={`node-${row}-${col}`}
      className={className}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={onMouseUp}
    >
      
    </div>
  );
}