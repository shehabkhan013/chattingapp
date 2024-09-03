import Chatting from "../components/Chatting";
import Friends from "../components/Friends";

const Messages = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr,4fr]">
      <div className="w-full bg-[#FBFBFB]">
        <Friends />
      </div>
      <div className="w-full px-3">
        <Chatting />
      </div>
    </div>
  );
};

export default Messages;
