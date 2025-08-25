import React from "react"

export default function Button({ children, disabled, ...props }) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`
        w-full h-12 text-base font-semibold rounded-xl border-0 shadow-lg
        transition-all duration-300
        ${disabled
          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
          : "bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white"
        }
      `}
    >
      {children}
    </button>
  )
}
