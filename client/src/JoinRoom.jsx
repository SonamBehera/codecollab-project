import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (roomCode.trim() === "") return;
    navigate(`/room/${roomCode}`);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-500 to-indigo-600">
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-10 rounded-2xl shadow-2xl w-[90%] max-w-md"
      >
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Join a Room
        </h1>

        <input
          type="text"
          placeholder="Enter Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg mb-4"
        />

        <button
          onClick={handleJoin}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md"
        >
          Join Now
        </button>
      </motion.div>
    </div>
  );
}
