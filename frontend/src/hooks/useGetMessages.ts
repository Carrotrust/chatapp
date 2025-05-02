import { useEffect, useState } from "react";
import useConversation from "../store/useStore";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessage = async () => {
      if (!selectedConversation) return;
      setLoading(true);
      setMessages([]);
      try {
        const res = await fetch(`api/message/${selectedConversation.id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "An Error Occurred");
        setMessages(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getMessage();
  }, [selectedConversation, setMessages]);

  return { loading, messages };
};

export default useGetMessages;
