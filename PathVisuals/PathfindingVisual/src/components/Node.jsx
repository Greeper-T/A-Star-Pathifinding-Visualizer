export default function Node({
  node,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  onRightClick,
}) {

  let extraClass = "";

  if (node.isStart) extraClass = "node-start";
  else if (node.isEnd) extraClass = "node-end";
  else if (node.isWall) extraClass = "node-wall";
  else if (node.terrain === "water") {
  extraClass = "node-water";
}
else if (node.terrain === "grass") {
  extraClass = "node-grass";
}

  return (
    <div
      id={`node-${node.row}-${node.col}`}
      className={`node ${extraClass}`}

      onMouseDown={(e) =>
        onMouseDown(e, node.row, node.col)
      }

      onMouseEnter={() =>
        onMouseEnter(node.row, node.col)
      }

      onMouseUp={() => onMouseUp()}

      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick(node);
      }}
    ></div>
  );
}