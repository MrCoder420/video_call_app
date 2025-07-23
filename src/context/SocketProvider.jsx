import React, { createContext, useMemo, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext); 
};

export const SocketProvider = (props) => {
  const socket = useMemo(() => {
    return io("http://localhost:8000");
  }, []); // ✅ Add this empty dependency array

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
