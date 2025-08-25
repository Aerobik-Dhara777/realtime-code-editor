import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { v4 as uuidv4 } from "uuid"
import { useNavigate } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"
import  Button  from "../components/Button"   // adjust import path
import  Input  from "../components/Input"     // adjust import path


export default function HomePage() {
  const [username, setUsername] = useState("")
  const [roomId, setRoomId] = useState("")
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const logoRef = useRef(null)
  const titleRef = useRef(null)
  const formRef = useRef(null)


  useEffect(() => {
    const tl = gsap.timeline()


    tl.fromTo(
      logoRef.current,
      { opacity: 0, y: -30, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "back.out(1.7)" }
    )


    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.5"
    )


    tl.fromTo(
      formRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.3"
    )


    gsap.to(logoRef.current, {
      y: -10,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1,
    })
  }, [])


  const handleJoin = () => {
    if (!username.trim()) {
      toast.error("Please enter a username!", {
        position: "top-center",
        duration: 3000,
      })
      return
    }
    
    if (!roomId.trim()) {
      toast.error("Please enter a room ID!", {
        position: "top-center", 
        duration: 3000,
      })
      return
    }

    // Show loading toast
    const loadingToast = toast.loading("Joining room...", {
      position: "top-center",
    })

    // Simulate joining room validation
    setTimeout(() => {
      toast.dismiss(loadingToast)
      toast.success(`Welcome ${username}! Joining room: ${roomId}`, {
        position: "top-center",
        duration: 2000,
      })
      
      console.log("Joining room:", { username, roomId })
      
      // Navigate to EditorPage with state
      navigate("/editor", {
        state: {
          username: username.trim(),
          roomId: roomId.trim(),
        }
      })
    }, 2000)
  }


  const generateRoomId = () => {
    // Generate a new UUID v4 room ID
    const newRoomId = uuidv4()
    setRoomId(newRoomId)

    // Show success notification with custom gradient
    toast.success("New room ID generated!", {
      position: "top-center",
      duration: 3000,
      icon: "🎉",
      style: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
      }
    })

    const roomInput = document.querySelector('input[placeholder="Room ID"]')
    if (roomInput) {
      gsap.fromTo(
        roomInput,
        { scale: 1.05, boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)" },
        { scale: 1, boxShadow: "none", duration: 0.5, ease: "power2.out" }
      )
    }
  }


  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4 relative"
    >
      {/* Toast Container with Enhanced Gradients */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: '',
          duration: 4000,
          style: {
            background: '#374151',
            color: '#fff',
            border: '1px solid #6B7280',
          },

          // Default options for specific types
          success: {
            style: {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontWeight: '500',
            },
          },
          error: {
            style: {
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
              color: '#ffffff',
            },
          },
          loading: {
            style: {
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#ffffff',
            },
          },
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>


      <div className="relative z-10 w-full max-w-md mx-auto text-center">
        {/* Logo */}
        <div ref={logoRef} className="mb-8">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2025-07-21_220933-removebg-preview-E9NW4XaNQvB1LrZWsD1aTQ3vR3IPto.png"
              alt="Code help logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>


        {/* Title */}
        <div ref={titleRef} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
            Code Here
          </h1>
          <p className="text-gray-400 text-lg">Let's code together in real-time</p>
        </div>


        {/* Form */}
        <div
          ref={formRef}
          className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-8 shadow-2xl"
        >
          <div className="space-y-6">
            {/* Username input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 text-left">Username</label>
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 h-12 text-base focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300"
              />
            </div>


            {/* Room ID input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 text-left">Room ID</label>
              <Input
                type="text"
                placeholder="Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 h-12 text-base focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300"
              />
            </div>


            {/* Join button */}
            <Button
              onClick={handleJoin}
              disabled={!username.trim() || !roomId.trim()}
              className="w-full h-12 text-base bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-semibold border-0 shadow-lg"
            >
              Join Room
            </Button>
          </div>


          {/* Create new room */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an invite?{" "}
              <button
                onClick={generateRoomId}
                className="text-orange-400 hover:text-orange-300 underline underline-offset-2 transition-colors duration-200 font-medium"
              >
                Create new room!
              </button>
            </p>
          </div>
        </div>


        {/* Footer */}
        <div className="mt-8">
          <p className="text-gray-500 text-xs">Powered by React, Three.js & WebGL</p>
          <p>made by dhara</p>
        </div>
      </div>
    </div>
  )
}
