import { io } from "socket.io-client";



export const initSocket = async () => {
    const options = {
 
        reconnection: true,
        reconnectionAttempts: 5,
        timeout: 10000,
        autoConnect: true,
    };
    //console.log("Backend URL from env:", import.meta.env.VITE_BACKEND_URL);

    return io(import.meta.env.VITE_BACKEND_URL,options)
};



