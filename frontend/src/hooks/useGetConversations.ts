import { useEffect, useState } from "react";
import { ConversationType } from "../store/useStore";
import toast from "react-hot-toast";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);

  const [conversations, setConversations] = useState<ConversationType[]>([]);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/message/conversations");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setConversations(data);
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  return { loading, conversations };
};

export default useGetConversations;
