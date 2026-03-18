import { useState, useEffect } from "react";

import "./app.css";
import { TextEntry } from "./components/TextEntry";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export function App() {
  const [entries, setEntries] = useState<{ id: number; text: string }[]>([]);
  const [nextId, setNextId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);


   useEffect(() => {
     loadSavedData();
   }, []);

   useEffect(() => {
     if (!isLoading) {
       saveData();
     }
   }, [entries, nextId, isLoading]);


   const loadSavedData = async () => {
     try {
       const result = await chrome.storage.local.get(["entries", "nextId"]);
       if (result.entries) {
         setEntries(result.entries);
       }
       if (result.nextId) {
         setNextId(result.nextId);
       }
     } catch (error) {
       console.error("Failed to load saved data:", error);
     } finally {
       setIsLoading(false);
     }
   };

   const saveData = async () => {
     try {
       await chrome.storage.local.set({
         entries: entries,
         nextId: nextId,
       });
     } catch (error) {
       console.error("Failed to save data:", error);
     }
   };


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addNewEntry = () => {
    setEntries([...entries, { id: nextId, text: "" }]);
    setNextId(nextId + 1);
  };

  const deleteEntry = (id: number) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const updateEntry = (id: number, text: string) => {
    setEntries(
      entries.map((entry) => (entry.id === id ? { ...entry, text } : entry))
    );
  };


  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }


  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setEntries((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="bg-white min-h-screen p-4">


      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Common Copy</h3>
        <button
          onClick={() => window.parent.postMessage({ action: 'closeOverlay' }, '*')}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>


      <button
        onClick={addNewEntry}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create New
      </button>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={entries} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {entries.map((entry) => (
              <TextEntry
                key={entry.id}
                id={entry.id}
                initialText={entry.text} // Pass the saved text
                onSave={(text) => updateEntry(entry.id, text)}
                onDelete={() => deleteEntry(entry.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
