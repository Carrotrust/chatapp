import { useSocketContext } from "../../context/SocketContext";
import useConversation, { ConversationType } from "../../store/useStore";

const Conversation = ({ conversation }: { conversation: ConversationType }) => {
  const { setSelectedConversation, selectedConversation } = useConversation();
  const isSelected = selectedConversation?.id === conversation.id;

  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(conversation.id);

  return (
    <>
      <div
        onClick={() => setSelectedConversation(conversation)}
        className={`flex gap-2 items-center hover:bg-sky-500 rounded
       p-2 py-1 cursor-pointer ${isSelected ? "bg-sky-500" : ""}`}
      >
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className="w-8 md:w-12 rounded-full">
            <img src={conversation.profilePic} alt="user avatar" />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="font-bold text-gray-200 text-sm md:text-md">
              {conversation.fullname}
            </p>
            {/* <span className="text-xl hidden md:inline-block">
              {conversation.emoji}
            </span> */}
          </div>
        </div>
      </div>

      <div className="divider my-0 py-0 h-1" />
    </>
  );
};
export default Conversation;
