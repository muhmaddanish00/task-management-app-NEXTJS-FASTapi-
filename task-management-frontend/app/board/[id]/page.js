"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function BoardDetail() {
  const params = useParams();
  const router = useRouter();
  
  // States
  const [board, setBoard] = useState(null);
  const [newListTitle, setNewListTitle] = useState(""); 
  const [newTaskTitles, setNewTaskTitles] = useState({}); 
  
  // Edit states
  const [editingTaskId, setEditingTaskId] = useState(null); 
  const [editTaskTitle, setEditTaskTitle] = useState(""); 

  // Backend se data mangwana
  const fetchBoardData = () => {
    fetch(`http://localhost:8000/boards/${params.id}`)
      .then((response) => response.json())
      .then((data) => setBoard(data))
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    fetchBoardData();
  }, [params.id]);

  // Nayi List Banane ka function
  const createList = async (e) => {
    e.preventDefault();
    if (!newListTitle) return;

    try {
      const response = await fetch("http://localhost:8000/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newListTitle, board_id: parseInt(params.id) }),
      });

      if (response.ok) {
        setNewListTitle(""); 
        fetchBoardData(); 
      }
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  // Naya Task Banane ka function
  const createTask = async (e, listId) => {
    e.preventDefault();
    const taskTitle = newTaskTitles[listId];
    if (!taskTitle) return;

    try {
      const response = await fetch("http://localhost:8000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: taskTitle, 
          description: "", 
          list_id: listId 
        }),
      });

      if (response.ok) {
        setNewTaskTitles({ ...newTaskTitles, [listId]: "" }); 
        fetchBoardData(); 
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // List Delete karne ka function
  const deleteList = async (listId) => {
    if (!window.confirm("Kya aap waqai yeh list delete karna chahte hain? Iske saaray tasks bhi delete ho jayenge!")) return;

    try {
      const response = await fetch(`http://localhost:8000/lists/${listId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchBoardData();
      }
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  // Task Delete karne ka function
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchBoardData();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Task ko dusri list mein move karne ka function
  const moveTask = async (task, newListId) => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: task.title, 
          description: task.description || "", 
          list_id: parseInt(newListId) 
        }),
      });

      if (response.ok) {
        fetchBoardData();
      }
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  // Task ka naam update (Edit) karne ka function
  const updateTask = async (task) => {
    if (!editTaskTitle.trim()) return; 

    try {
      const response = await fetch(`http://localhost:8000/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: editTaskTitle, 
          description: task.description || "", 
          list_id: task.list_id 
        }),
      });

      if (response.ok) {
        setEditingTaskId(null); 
        setEditTaskTitle(""); 
        fetchBoardData(); 
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  if (!board) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-blue-600 p-8 text-black">
      
      {/* Top Bar */}
      <div className="flex items-center gap-4 mb-8 text-white">
        <button 
          onClick={() => router.push("/")}
          className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded transition"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold capitalize">{board.title}</h1>
      </div>

      {/* Lists Area */}
      <div className="flex gap-6 overflow-x-auto pb-4 items-start">
        
        {/* Lists Map Karna */}
        {board.lists && board.lists.map((list) => (
          <div key={list.id} className="bg-gray-100 w-80 shrink-0 rounded-lg p-4 shadow">
            
            {/* List Title aur Delete Button */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-800">{list.title}</h3>
              <button 
                onClick={() => deleteList(list.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1 rounded transition"
                title="List Delete Karein"
              >
                ✕
              </button>
            </div>
            
            {/* Tasks Dikhane ka Area */}
            <div className="flex flex-col gap-2 mb-4">
              {list.tasks && list.tasks.length > 0 ? (
                list.tasks.map((task) => (
                  <div key={task.id} className="bg-white p-3 rounded shadow-sm border border-gray-200 group">
                    
                    {/* Edit Mode Check */}
                    {editingTaskId === task.id ? (
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={editTaskTitle}
                          onChange={(e) => setEditTaskTitle(e.target.value)}
                          className="p-1 text-sm border border-blue-400 rounded outline-none"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button 
                            onClick={() => updateTask(task)}
                            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setEditingTaskId(null)}
                            className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Normal Task UI */}
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-gray-800 text-sm font-medium">{task.title}</p>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setEditingTaskId(task.id);
                                setEditTaskTitle(task.title);
                              }}
                              className="text-gray-300 hover:text-blue-500 transition"
                              title="Task Edit Karein"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => deleteTask(task.id)}
                              className="text-gray-300 hover:text-red-600 transition"
                              title="Task Delete Karein"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {/* Move Task Dropdown */}
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <select 
                            value={list.id} 
                            onChange={(e) => moveTask(task, e.target.value)}
                            className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded p-1 w-full focus:outline-none focus:border-blue-400 cursor-pointer"
                          >
                            <option value={list.id} disabled>Move to...</option>
                            {board.lists.map((l) => (
                              <option key={l.id} value={l.id}>
                                {l.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}

                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm italic">Koi task nahi hai...</p>
              )}
            </div>

            {/* Naya Task Add karne ka Form */}
            <form onSubmit={(e) => createTask(e, list.id)} className="flex flex-col gap-2 mt-2">
              <input
                type="text"
                value={newTaskTitles[list.id] || ""}
                onChange={(e) => setNewTaskTitles({ ...newTaskTitles, [list.id]: e.target.value })}
                placeholder="Naya task likhein..."
                className="p-2 text-sm border border-gray-300 rounded bg-white text-black outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button 
                type="submit" 
                className="bg-blue-100 text-blue-800 text-sm p-2 rounded hover:bg-blue-200 transition font-medium text-left"
              >
                + Task Add Karein
              </button>
            </form>
          </div>
        ))}

        {/* Nayi List Add karne ka Dabba */}
        <div className="bg-white/20 w-80 shrink-0 rounded-lg p-4 border border-white/30">
          <form onSubmit={createList} className="flex flex-col gap-2">
            <input
              type="text"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              placeholder="Nayi list ka naam... (e.g. To Do)"
              className="p-2 border-none rounded bg-white text-black outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button 
              type="submit" 
              className="bg-blue-800 text-white p-2 rounded hover:bg-blue-900 transition font-medium"
            >
              + List Add Karein
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}