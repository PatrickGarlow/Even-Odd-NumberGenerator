import React from "react";

function NumberComponent({ id, number, isRover, isSelected, onDelete, onSelect, noteTag, showNote, note }) {
  return (
    <div
      className={`number-container ${isSelected ? "selected" : ""} ${noteTag}`}
      onClick={onSelect}
      onDoubleClick={() => onDelete(id)}
    >
      <div className={`number-box ${isRover ? "rover" : ""} number${number}`}>
        <div>{number}</div>
      </div>
      {/* Only display the note if showNote is true */}
      {showNote && noteTag === "note-true" && <div className="note">{note}</div>}
    </div>
  );
}

export default NumberComponent;
