import { createContext, useContext, useEffect, useState } from "react"; 
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

// window.Buffer = window.Buffer || require("buffer").Buffer; 

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export default useSocketContext;

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if(authUser){
      const socket = io("https://chimein.onrender.com", {
        query:{
          userId: authUser._id
        }
      });

      setSocket(socket);

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      })
      
      return () => socket.close();
    } else{
      if(socket){
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return <SocketContext.Provider value={{socket, onlineUsers}} >{children}</SocketContext.Provider>
};