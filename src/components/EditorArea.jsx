// EditorArea.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import ACTIONS from "../Actions"; // adjust path if required

// language imports same as you already have...
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { sql } from "@codemirror/lang-sql";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { php } from "@codemirror/lang-php";
import { java } from "@codemirror/lang-java";
import { xml } from "@codemirror/lang-xml";
import { json as jsonLang } from "@codemirror/lang-json";
import { cpp } from "@codemirror/lang-cpp";
import { rust } from "@codemirror/lang-rust";
import { markdown } from "@codemirror/lang-markdown";

export default function EditorArea({ toggleMobileSidebar, socket, roomId }) {
  const [tabs, setTabs] = useState([{ name: "index.js" }, { name: "App.js" }]);
  const [active, setActive] = useState("index.js");
  const [files, setFiles] = useState({
    "index.js": `function login() {\n  console.log("User logged in");\n}\n`,
    "App.js": `export default function App() {\n  return <h1>Hello CodeMirror</h1>\n}\n`,
  });

  // skipNext per filename to avoid echoing remote updates
  const skipNext = useRef(new Set());
  // per-file debounce timers
  const debounceTimers = useRef({});

  // --- helpers for language / extensions (same as your current code) ---
  const getExtensionForFile = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    switch (ext) {
      case "js": return javascript({ jsx: false, typescript: false });
      case "jsx": return javascript({ jsx: true, typescript: false });
      case "ts": return javascript({ jsx: false, typescript: true });
      case "tsx": return javascript({ jsx: true, typescript: true });
      case "py": return python();
      case "sql": return sql();
      case "html": return html();
      case "css": return css();
      case "php": return php();
      case "java": return java();
      case "xml": return xml();
      case "json": return jsonLang();
      case "md":
      case "markdown": return markdown();
      case "c": case "h": case "hpp": case "cc": case "cpp": case "cxx":
        return cpp();
      case "rs": return rust();
      default: return javascript({ jsx: true });
    }
  };

  const extensions = useMemo(() => [getExtensionForFile(active), EditorView.lineWrapping], [active]);

  // Emit change to server (debounced per file)
  const emitChangeToServer = (filename, value) => {
    if (!socket || !socket.connected) return;
    socket.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      filename,
      code: value,
    });
  };

  const scheduleEmit = (filename, value, delay = 150) => {
    if (debounceTimers.current[filename]) clearTimeout(debounceTimers.current[filename]);
    debounceTimers.current[filename] = setTimeout(() => {
      emitChangeToServer(filename, value);
      delete debounceTimers.current[filename];
    }, delay);
  };

  // onChange from CodeMirror
  const onChange = (value) => {
    setFiles((prev) => ({ ...prev, [active]: value }));

    // if this change is caused by a remote update, skip emitting once
    if (skipNext.current.has(active)) {
      skipNext.current.delete(active);
      return;
    }

    // debounce and send
    scheduleEmit(active, value, 150);
  };

  // Listen for incoming code updates (from server)
  useEffect(() => {
    if (!socket) return;

    const handleCodeChange = ({ filename, code }) => {
      const file = filename ?? active; // fallback
      // mark to skip the next local change for that file
      skipNext.current.add(file);
      setFiles((prev) => ({ ...prev, [file]: code }));
    };

    const handleSyncAll = ({ files: serverFiles }) => {
      // server sends full files map on join
      if (serverFiles && Object.keys(serverFiles).length > 0) {
        // server snapshot should override local for initial sync
        setFiles((prev) => ({ ...serverFiles, ...prev }));
        // optionally set active to the first server file if you like:
        const first = Object.keys(serverFiles)[0];
        if (first) setActive((a) => a || first);
      }
    };

    socket.on(ACTIONS.CODE_CHANGE, handleCodeChange);
    socket.on(ACTIONS.SYNC_CODE, handleSyncAll);

    return () => {
      socket.off(ACTIONS.CODE_CHANGE, handleCodeChange);
      socket.off(ACTIONS.SYNC_CODE, handleSyncAll);
    };
  }, [socket, active, roomId]);

  // (Optional) If your server doesn't proactively send SYNC_CODE, you can request it:
  // useEffect(() => {
  //   if (!socket) return;
  //   socket.emit(ACTIONS.SYNC_CODE, { socketId: socket.id, roomId });
  // }, [socket]);

  const code = files[active] ?? "";

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-900/95 to-slate-800/90 relative overflow-hidden min-h-0">
      {/* Tab Bar (unchanged) */}
      <div className="relative bg-slate-800/60 border-b border-slate-600/30 px-3 md:px-6 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center overflow-x-auto scrollbar-hide">
          <button onClick={toggleMobileSidebar} className="md:hidden mr-3 p-2 rounded-lg bg-slate-700/60">
            {/* hamburger icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1>hello broo !! focus on carier not girls 😎</h1>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 bg-gradient-to-br from-slate-900/90 to-slate-800/80 relative backdrop-blur-sm overflow-hidden">
        <div className="h-full p-3 md:p-6">
          <div className="h-full rounded-xl border border-slate-600/30 bg-slate-900/60 shadow-xl overflow-hidden">
            <CodeMirror value={code} height="100%" theme="dark" extensions={extensions} onChange={onChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
