// EditorPage.jsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import CodeEditor from "../components/CodeEditor";
import { initSocket } from "../socket";
import ACTIONS from "../Actions";

export default function EditorPage() {
  const socketRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { roomID } = useParams(); // optional, if you use :roomID in route
  const [userInfo, setUserInfo] = useState({ username: "", roomId: "" });
  const [clients, setClients] = useState([]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!location.state?.username || !location.state?.roomId) {
      navigate("/", { replace: true });
      return;
    }

    const { username, roomId } = location.state;
    setUserInfo({ username, roomId });

    let mounted = true;

    function handleErrors(e) {
      console.error("Socket error:", e);
      toast.error("Socket connection failed, try again later.");
      navigate("/", { replace: true });
    }

    function handleJoined(payload) {
      if (!mounted) return;
      const { username: joinedUsername, clients: serverClients } = payload || {};
      if (Array.isArray(serverClients)) setClients(serverClients);
      if (joinedUsername && joinedUsername !== username) {
        toast.success(`${joinedUsername} joined the room.`);
      }
      console.log("JOINED:", payload);
    }

    function handleDisconnected(payload) {
      if (!mounted) return;
      const { socketID, username: leftUsername, clients: serverClients } = payload || {};
      if (Array.isArray(serverClients)) {
        setClients(serverClients);
      } else if (socketID) {
        setClients((prev) => prev.filter((c) => c.socketID !== socketID));
      }

      // ✅ Gradient colorful toast when someone leaves
      if (leftUsername) {
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg rounded-xl pointer-events-auto flex items-center justify-between px-4 py-3`}
            >
              <span className="font-semibold">{leftUsername} left the room 🚪</span>
            </div>
          ),
          { duration: 3000 }
        );
      }

      console.log("DISCONNECTED:", payload);
    }

    const init = async () => {
      try {
        const s = await initSocket();
        if (!mounted) {
          s.disconnect();
          return;
        }
        socketRef.current = s;

        s.on("connect_error", handleErrors);
        s.on("connect_failed", handleErrors);

        s.emit(ACTIONS.JOIN, { roomId, username });

        s.on(ACTIONS.JOINED, handleJoined);
        s.on(ACTIONS.DISCONNECTED, handleDisconnected);
      } catch (err) {
        console.error("Failed to init socket:", err);
        handleErrors(err);
      }
    };

    init();

    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.off("connect_error", handleErrors);
        socketRef.current.off("connect_failed", handleErrors);
        socketRef.current.off(ACTIONS.JOINED, handleJoined);
        socketRef.current.off(ACTIONS.DISCONNECTED, handleDisconnected);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [location.state, navigate]);

  const toggleMobileSidebar = () => setIsMobileSidebarOpen((v) => !v);

  if (!location.state) return null;

  return (
    <div className="flex h-screen">
      {/* Add toaster for custom UI */}
      <Toaster position="top-right" toastOptions={{ duration: 2000 }} />

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar
          clients={clients}
          roomId={userInfo.roomId}
          currentUser={userInfo.username}
          onCopyRoom={(id) => navigator.clipboard.writeText(id)}
          onLeave={() => navigate("/")}
        />
      </div>

      {/* Mobile sidebar */}
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar
              clients={clients}
              roomId={userInfo.roomId}
              currentUser={userInfo.username}
              onCopyRoom={(id) => {
                navigator.clipboard.writeText(id);
                setIsMobileSidebarOpen(false);
              }}
              onLeave={() => {
                setIsMobileSidebarOpen(false);
                navigate("/");
              }}
            />
          </div>
        </div>
      )}

      {/* Main editor */}
      <div className="flex-1">
        <CodeEditor
          username={userInfo.username}
          roomId={userInfo.roomId}
          socket={socketRef.current}
          clients={clients}
          toggleMobileSidebar={toggleMobileSidebar}
        />
      </div>
    </div>
  );
}
