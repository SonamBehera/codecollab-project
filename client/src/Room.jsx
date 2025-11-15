import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { socket } from "./socket"; // your socket.io-client instance
import CodeSection from "./codesection";

export default function Room() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [username] = useState("User" + Math.floor(Math.random() * 1000));

  // Collaborative code
  const [code, setCode] = useState("// Start coding here...");

  // Users in the room
  const [users, setUsers] = useState([]);

  // Chat states
  const [chat1Messages, setChat1Messages] = useState([]);
  const [chat1Input, setChat1Input] = useState("");
  const [chat2Messages, setChat2Messages] = useState([]);
  const [chat2Input, setChat2Input] = useState("");

  const chat1Ref = useRef(null);
  const chat2Ref = useRef(null);

  // Join room & setup socket listeners
  useEffect(() => {
    socket.emit("join-room", { roomId: id, username });

    socket.on("users-update", (userList) => setUsers(userList));
    socket.on("code-update", (newCode) => setCode(newCode));
    socket.on("chat1-message", (msg) => setChat1Messages((prev) => [...prev, msg]));
    socket.on("chat2-message", (msg) => setChat2Messages((prev) => [...prev, msg]));

    return () => {
      socket.off("users-update");
      socket.off("code-update");
      socket.off("chat1-message");
      socket.off("chat2-message");
    };
  }, [id, username]);

  // Handle code changes
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("code-change", { roomId: id, code: newCode });
  };

  // Send chat messages
  const sendChat1 = () => {
    if (!chat1Input.trim()) return;
    socket.emit("chat1-message", { roomId: id, message: chat1Input, name: username });
    setChat1Input("");
  };

  const sendChat2 = () => {
    if (!chat2Input.trim()) return;
    socket.emit("chat2-message", { roomId: id, message: chat2Input, name: username });
    setChat2Input("");
  };

  // Auto-scroll chat panels
  useEffect(() => {
    if (chat1Ref.current) chat1Ref.current.scrollTop = chat1Ref.current.scrollHeight;
    if (chat2Ref.current) chat2Ref.current.scrollTop = chat2Ref.current.scrollHeight;
  }, [chat1Messages, chat2Messages]);

  return (
    <div className="h-screen p-6 bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-indigo-700">Room: {id}</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Leave Room
        </button>
      </div>

      <div className="flex flex-1 gap-4">
        {/* Collaborative code editor + run/output */}
        <div className="flex-1">
          <CodeSection code={code} onCodeChange={handleCodeChange} />
        </div>

        {/* Right panel: users + chats */}
        <div className="w-80 flex flex-col gap-4">
          {/* Users */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-2">Users in Room</h2>
            <ul className="space-y-1">
              {users.map((user) => (
                <li key={user.id} className="text-gray-700">{user.name}</li>
              ))}
            </ul>
          </div>

          {/* Chat 1 */}
          <div className="bg-white p-2 rounded-lg shadow-lg flex flex-col h-48">
            <h2 className="font-bold mb-1">Chat 1</h2>
            <div ref={chat1Ref} className="flex-1 overflow-y-auto border p-1 mb-1">
              {chat1Messages.map((msg, idx) => (
                <div key={idx}><strong>{msg.name}:</strong> {msg.message}</div>
              ))}
            </div>
            <div className="flex gap-1">
              <input
                value={chat1Input}
                onChange={(e) => setChat1Input(e.target.value)}
                placeholder="Type message"
                className="flex-1 border rounded p-1"
              />
              <button onClick={sendChat1} className="bg-blue-500 text-white p-1 rounded">
                Send
              </button>
            </div>
          </div>

          {/* Chat 2 */}
          <div className="bg-white p-2 rounded-lg shadow-lg flex flex-col h-48">
            <h2 className="font-bold mb-1">Chat 2</h2>
            <div ref={chat2Ref} className="flex-1 overflow-y-auto border p-1 mb-1">
              {chat2Messages.map((msg, idx) => (
                <div key={idx}><strong>{msg.name}:</strong> {msg.message}</div>
              ))}
            </div>
            <div className="flex gap-1">
              <input
                value={chat2Input}
                onChange={(e) => setChat2Input(e.target.value)}
                placeholder="Type message"
                className="flex-1 border rounded p-1"
              />
              <button onClick={sendChat2} className="bg-green-500 text-white p-1 rounded">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
