import { useState } from "preact/hooks";
import "./app.css";
import { TextEntry } from "./components/TextEntry";

export function App() {
  const [entries, setEntries] = useState<string[]>([]);

  const addNewEntry = () => {
    setEntries([...entries, ""]);
  };

  const deleteEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4">
      <button
        onClick={addNewEntry}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create New
      </button>

      <div className="space-y-2">
        {entries.map((_, index) => (
          <TextEntry key={index} onDelete={() => deleteEntry(index)} />
        ))}
      </div>
    </div>
  );
}
