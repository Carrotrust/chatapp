import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "./AuthContext";

interface ISocketContext {
  socket: Socket | null;
  onlineUsers: string[];
}

export const useSocketContext = (): ISocketContext => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocketContext must be within a SocketContextProvider");
  }
  return context;
};

const SocketContext = createContext<ISocketContext | undefined>(undefined);

const socketUrl =
  import.meta.env.MODE === "development" ? "http://localhost:5500" : "/";

const SocketContextProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { isLoading, authUser } = useAuthContext();

  useEffect(() => {
    if (authUser && !isLoading) {
      const socket = io(socketUrl, {
        query: {
          userId: authUser.id,
        },
      });
      socketRef.current = socket;

      socket.on("getOnlineUsers", (users: string[]) => {
        setOnlineUsers(users);
      });

      return () => {
        socket.close();
        socketRef.current = null;
      };
    } else if (!authUser && !isLoading) {
      if (socketRef.current) {
        socketRef.current.close();
      }
    }
  }, [authUser, isLoading]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        onlineUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
