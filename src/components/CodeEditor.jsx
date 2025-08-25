import React from "react";
import EditorArea from "./EditorArea";

export default function CodeEditor({
  username,
  roomId,
  socket,
  clients = [],
  toggleMobileSidebar = () => {},
}) {
  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 relative">
      <div className="flex flex-1 min-h-0">
        <div className="flex-1 md:ml-0 flex flex-col min-h-0">
          {/* EditorArea handles the hamburger and receives the toggle fn */}
          <EditorArea toggleMobileSidebar={toggleMobileSidebar} socket={socket} roomId={roomId} />
        </div>
      </div>

      <div className="bg-slate-800/60 border-t border-slate-600/30 px-3 md:px-6 py-2 md:py-3 flex items-center justify-between text-xs text-slate-400 backdrop-blur-sm overflow-x-auto flex-shrink-0">
        <div className="flex items-center gap-3 md:gap-6 min-w-max">
          <span className="bg-slate-700/40 px-2 md:px-3 py-1 rounded-lg border border-slate-600/20 font-medium whitespace-nowrap">
            Ln 2, Col 15
          </span>
          <span className="bg-slate-700/40 px-2 md:px-3 py-1 rounded-lg border border-slate-600/20 font-medium whitespace-nowrap">
            Spaces: 2
          </span>
          <span className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-300 px-2 md:px-3 py-1 rounded-lg border border-yellow-400/20 font-semibold whitespace-nowrap">
            JavaScript
          </span>
        </div>
        <div className="flex items-center gap-3 md:gap-6 min-w-max ml-4">
          <span className="bg-slate-700/40 px-2 md:px-3 py-1 rounded-lg border border-slate-600/20 font-medium">
            UTF-8
          </span>
          <span className="bg-slate-700/40 px-2 md:px-3 py-1 rounded-lg border border-slate-600/20 font-medium">
            LF
          </span>
          <div className="flex items-center gap-1 md:gap-2 bg-emerald-400/10 px-2 md:px-3 py-1 rounded-lg border border-emerald-400/20">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
            <span className="text-emerald-300 font-semibold">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
