
import { useState } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TextEntryProps {
  id: number;
  initialText?: string;
  onSave?: (text: string) => void;
  onDelete?: () => void;
}

export function TextEntry({ id, initialText = "", onSave, onDelete }: TextEntryProps) {
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(!initialText);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(
      transform ? { ...transform, x: 0 } : null,
    ),
    transition,
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave?.(text);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Copied to clipboard:", text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 border rounded bg-white"
    >
      <div
        {...(attributes as any)}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
        // role="button"
        // tabIndex={0}
        // aria-disabled={false}
        // aria-pressed={undefined}
        // aria-roledescription="sortable"
        // aria-describedby=""
      >
        ⋮⋮
      </div>

      {isEditing ? (
        <>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
            className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter text..."
          />
          <button
            onClick={handleSave}
            disabled={!text.trim()}
            className={`px-3 py-1 rounded ${
              text.trim()
                ? "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Save
          </button>
        </>
      ) : (
        <>
          <span className="flex-1 px-2 py-1">{text}</span>
          <button
            onClick={handleEdit}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Copy
          </button>
        </>
      )}
      <button
        onClick={onDelete}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );
}
