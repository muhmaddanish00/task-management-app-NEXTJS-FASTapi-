"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");

  const fetchBoards = () => {
    fetch("https://task-management-app-nextjs-fastapi-4.onrender.com/boards")
      .then((response) => response.json())
      .then((data) => setBoards(data))
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const createBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle) return;

    try {
      const response = await fetch("https://task-management-app-nextjs-fastapi-4.onrender.com/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newBoardTitle }),
      });

      if (response.ok) {
        setNewBoardTitle("");
        fetchBoards();
      }
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  // NAYA: Board Delete karne ka function
  const deleteBoard = async (boardId) => {
    // User se confirm karein (Kyunke Board delete hone se uski lists/tasks sab uṛ jayenge)
    if (!window.confirm("Kya aap waqai yeh board delete karna chahte hain? Iske andar ki saari lists aur tasks bhi khatam ho jayenge!")) return;

    try {
      const response = await fetch(`https://task-management-app-nextjs-fastapi-4.onrender.com/boards/${boardId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchBoards(); // Screen se board hatane ke liye list ko refresh karein
      }
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Mera Task Manager
        </h1>

        {/* Naya Board Banane ka Form */}
        <form onSubmit={createBoard} className="mb-8 flex gap-4">
          <input
            type="text"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            placeholder="Naye board ka naam likhein..."
            className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Board Banayein
          </button>
        </form>

        {/* Boards Dikhane Wala Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {boards.length === 0 ? (
            <p className="text-gray-500">Abhi koi board nahi bana...</p>
          ) : (
            boards.map((board) => (
              <div 
                key={board.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-300 transition flex flex-col relative group"
              >
                {/* Board ke andar jane ka Link */}
                <Link href={`/board/${board.id}`} className="p-6 pb-12 flex-1 cursor-pointer block">
                  <h2 className="text-xl font-semibold text-blue-600 capitalize">
                    {board.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">
                    Board ID: {board.id}
                  </p>
                </Link>

                {/* Delete Button */}
                <div className="absolute bottom-3 right-4">
                  <button
                    onClick={() => deleteBoard(board.id)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded transition text-sm font-medium"
                    title="Board Delete Karein"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}