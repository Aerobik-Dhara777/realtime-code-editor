import React from "react"

export default function Input({ ...props }) {
  return (
    <input
      {...props}
      className="
        w-full h-12 px-3 rounded-lg text-base text-white
        bg-gray-700/50 border border-gray-600 placeholder-gray-400
        focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20
        transition-all duration-300 outline-none
      "
    />
  )
}
