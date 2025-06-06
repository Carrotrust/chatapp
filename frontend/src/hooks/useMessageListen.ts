import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../store/useStore";
import loud from "../sounds/notification.mp3";

const useMessageListen = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      newMessage.shouldShake = true;
      const sound = new Audio(loud);
      sound.play();
      setMessages([...messages, newMessage]);
    });
    return () => {
      socket?.off("newMessage");
    };
  }, [socket, messages, setMessages]);
};

export default useMessageListen;
