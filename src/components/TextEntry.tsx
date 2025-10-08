import { useState } from "preact/hooks";

interface TextEntryProps {
  onSave?: (text: string) => void;
  onDelete?: () => void;
}

export function TextEntry({ onSave, onDelete }: TextEntryProps) {
  const [text, setText] = useState("");
  const [isEditing, setIsEditing] = useState(true);

  const handleSave = () => {
    setIsEditing(false);
    onSave?.(text);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="flex items-center gap-2 p-2 border rounded">
      {isEditing ? (
        <>
          <input
            type="text"
            value={text}
            onChange={(e) => setText((e.target as HTMLInputElement).value)}
            className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter text..."
          />
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
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
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            disabled
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