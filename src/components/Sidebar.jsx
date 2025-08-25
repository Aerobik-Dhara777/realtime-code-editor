import React from "react";
import Avatar from "react-avatar";

/**
 * Sidebar props:
 * - clients: array of { socketID, username } from server
 * - roomId: string room id to copy
 * - currentUser: string username of the current client (to mark as You)
 * - onCopyRoom: optional fn(roomId)
 * - onLeave: optional fn()
 */
export default function Sidebar({
  clients = [],
  roomId = "",
  currentUser = "",
  onCopyRoom,
  onLeave,
}) {
  const handleCopy = () => {
    if (onCopyRoom) {
      onCopyRoom(roomId);
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(roomId).catch(() => {
        // fallback: do nothing
      });
    }
  };

  const handleLeave = () => {
    if (onLeave) {
      onLeave();
      return;
    }
    // default leave behaviour: navigate home
    window.location.href = "/";
  };

  return (
    <div className="w-72 sm:w-80 md:w-72 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl border-r border-slate-600/30 shadow-2xl relative overflow-hidden h-full">
      <div className="h-full overflow-y-auto overflow-x-hidden relative">
        {/* ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-emerald-500/5 pointer-events-none"></div>

        {/* Header */}
        <div className="relative p-4 md:p-6 border-b border-slate-600/30 bg-gradient-to-r from-slate-800/60 to-slate-700/40 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="relative">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2025-07-21_220933-removebg-preview-E9NW4XaNQvB1LrZWsD1aTQ3vR3IPto.png"
                alt="Code Logo"
                className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 drop-shadow-2xl rounded-full"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-emerald-400/20 rounded-full blur-xl"></div>
            </div>

            <div>
              <h1 className="text-slate-50 font-bold text-lg md:text-xl tracking-tight">
                Code here
              </h1>
              <p className="text-slate-400 text-xs md:text-sm font-medium tracking-wide">made by Dhara</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-slate-800/40 rounded-xl border border-slate-600/20 backdrop-blur-sm w-full">
            <div className="relative">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"></div>
              <div className="absolute inset-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-emerald-400 rounded-full animate-ping opacity-30"></div>
            </div>
            <span className="text-emerald-300 text-xs md:text-sm font-semibold tracking-wide">Connected</span>
          </div>
        </div>

        {/* Current user card */}
        <div className="relative p-4 md:p-6 border-b border-slate-600/30 z-10">
          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-slate-800/30 rounded-2xl border border-slate-600/20 backdrop-blur-sm hover:bg-slate-700/40 transition-all duration-300">
            <div className="relative">
              <Avatar
                name={currentUser || "You"}
                size="48"
                round
                color="#ec4899"
                fgColor="#ffffff"
                className="md:!w-12 md:!h-12"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-emerald-400 rounded-full border-2 md:border-3 border-slate-800 shadow-lg shadow-emerald-400/30"></div>
            </div>

            <div className="flex-1">
              <div className="text-slate-100 font-bold text-base md:text-lg">
                {currentUser || "You"}
                {currentUser ? <span className="text-slate-400 text-sm ml-2">(You)</span> : null}
              </div>
              <div className="text-emerald-300 text-xs md:text-sm font-semibold tracking-wide flex items-center gap-2">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                Online
              </div>
            </div>
          </div>
        </div>

        {/* Users list */}
        <div className="p-4 md:p-6 z-10">
          <div className="text-slate-300 uppercase tracking-widest text-xs font-bold mb-4 md:mb-6 flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-slate-800/20 rounded-xl border border-slate-600/20">
            <span className="text-base md:text-lg">👥</span>
            <span className="bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">Users</span>
            <span className="ml-auto text-xs text-slate-400 font-medium">{clients?.length ?? 0}</span>
          </div>

          <div className="space-y-3">
            {clients && clients.length > 0 ? (
              clients.map((client) => (
                <div
                  key={client.socketID}
                  className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-2xl border border-slate-600/20 backdrop-blur-sm hover:bg-slate-700/40 transition-all"
                >
                  <div className="relative">
                    <Avatar
                      name={client.username || "User"}
                      size="40"
                      round
                      color="#6366f1"
                      fgColor="#ffffff"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-800"></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-slate-100 font-bold truncate">
                        {client.username || "Unknown"}
                      </div>
                      {currentUser && client.username === currentUser && (
                        <div className="text-xs text-slate-400">(You)</div>
                      )}
                    </div>
                    <div className="text-emerald-300 text-xs font-semibold">Online</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-sm">No users connected</div>
            )}
          </div>
        </div>

        {/* Bottom actions */}
        <div className="relative p-4 md:p-6 space-y-2 md:space-y-3 z-10">
          <button
            onClick={handleCopy}
            className="w-full py-2.5 md:py-3 px-3 md:px-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-base md:text-lg">📋</span>
              <span className="tracking-wide text-sm md:text-base">Copy ROOM ID</span>
            </div>
          </button>

          <button
            onClick={handleLeave}
            className="w-full py-2.5 md:py-3 px-3 md:px-4 bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 hover:from-violet-400 hover:via-purple-400 hover:to-blue-400 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-base md:text-lg">🚪</span>
              <span className="tracking-wide text-sm md:text-base">Leave</span>
            </div>
          </button>
        </div>

        {/* Bottom status */}
        <div className="relative p-4 md:p-6 border-t border-slate-600/30 bg-gradient-to-r from-slate-800/40 to-slate-700/30 backdrop-blur-sm z-10">
          <div className="flex items-center justify-between text-xs md:text-sm mb-2 md:mb-3">
            <div className="flex items-center gap-2 md:gap-3 p-2 bg-slate-800/40 rounded-lg border border-slate-600/20">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-sm shadow-lg shadow-yellow-400/30"></div>
              <span className="text-slate-200 font-semibold">JavaScript</span>
            </div>
            <span className="text-slate-400 font-medium bg-slate-800/30 px-2 md:px-3 py-1 rounded-lg border border-slate-600/20">
              UTF-8
            </span>
          </div>
          <div className="text-xs md:text-sm text-slate-400 font-medium text-center p-2 bg-slate-800/20 rounded-lg border border-slate-600/20">
            <span className="bg-gradient-to-r from-slate-300 to-slate-500 bg-clip-text text-transparent">
              Ready to code together
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
