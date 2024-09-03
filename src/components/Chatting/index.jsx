import { SmileIcon } from "../../svg/Smile";
import { GalleryIcon } from "../../svg/Gallery";
import { useSelector } from "react-redux";
import avaterImage from "../../assets/avater.png";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import moment from "moment";
import Lottie from "lottie-react";

import registrationAnimation from "../../animation/emoj.json";

const Chatting = () => {
  const user = useSelector((state) => state.login.loggedIn);
  const singleFriend = useSelector((state) => state.active.active);
  const [message, setMessage] = useState("");
  const [singleMessage, setSingleMessage] = useState([]);
  const db = getDatabase();

  const sendMessage = () => {
    if (singleFriend?.status === "single") {
      set(push(ref(db, "singleMessage")), {
        senderId: user.uid,
        senderName: user.displayName,
        receiverId: singleFriend.id,
        receiverName: singleFriend.name,
        message: message,
        date: new Date().toISOString(), // Store date as ISO string
      }).then(() => {
        setMessage("");
      });
    }
  };

  const formatDate = (date) => {
    const messageDate = moment(date);
    const now = moment();

    // Determine how to format the date
    if (now.diff(messageDate, "minutes") < 60) {
      return messageDate.fromNow(); // "x minutes ago"
    } else if (now.diff(messageDate, "hours") < 24) {
      return messageDate.fromNow(); // "x hours ago"
    } else if (now.isSame(messageDate, "year")) {
      return messageDate.format("MMMM Do"); // "August 29th"
    } else {
      return messageDate.format("MMMM Do YYYY"); // "August 29th 2023"
    }
  };

  useEffect(() => {
    if (singleFriend?.status === "single") {
      onValue(ref(db, "singleMessage"), (snapshot) => {
        const data = [];
        snapshot.forEach((item) => {
          if (
            (item.val().senderId === user.uid &&
              item.val().receiverId === singleFriend.id) ||
            (item.val().receiverId === user.uid &&
              item.val().senderId === singleFriend.id)
          ) {
            data.push(item.val());
          }
        });
        setSingleMessage(data);
      });
    }
  }, [db, singleFriend?.id]);

  return (
    <>
      {singleFriend?.status ? (
        <>
          <div className="w-[100%] bg-white rounded-md shadow-md overflow-hidden my-2">
            <div className="py-4 bg-[#212121] px-6">
              <div className="flex items-center gap-x-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={singleFriend?.photoURL || avaterImage}
                    alt={singleFriend?.name || "Please Select a Friend"}
                  />
                </div>
                <div>
                  <span className="text-white font-fontBold capitalize">
                    {singleFriend?.name || "Please Select a Friend"}
                  </span>
                </div>
              </div>
            </div>
            <div className="h-[425px] bg-white px-6 pb-2 overflow-y-scroll scrollbar-thin scrollbar-webkit">
              {/* Sender Massage */}

              {singleFriend?.status === "single"
                ? singleMessage.map((item, index) => (
                    <>
                      {item?.senderId === user?.uid ? (
                        <div className="w-[60%] ml-auto" key={index}>
                          <div className="flex items-center gap-x-3 my-3">
                            <div className="w-full ml-auto text-right">
                              <p className="text-white font-reguler text-sm bg-slate-500 px-4 py-2 rounded-md inline-block">
                                {item.message}
                              </p>
                            </div>
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                              <img
                                className="w-full h-full object-cover"
                                src={user?.photoURL || avaterImage}
                                alt={
                                  user?.displayName || "Please Select a Friend"
                                }
                              />
                            </div>
                          </div>
                          <span className="text-xs text-slate-500 block ml-auto text-right">
                            {formatDate(item?.date)}
                          </span>
                        </div>
                      ) : (
                        <div className="w-[60%] mr-auto" key={index}>
                          <div className="flex items-center gap-x-3 my-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                              <img
                                className="w-full h-full object-cover"
                                src={singleFriend?.photoURL || avaterImage}
                                alt={
                                  singleFriend?.name || "Please Select a Friend"
                                }
                              />
                            </div>
                            <div className="w-full ml-auto">
                              <p className="text-black font-reguler text-sm bg-[#e5e5e5] px-4 py-2 rounded-md inline-block">
                                {item?.message}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-slate-500 block mr-auto">
                            {formatDate(item?.date)}
                          </span>
                        </div>
                      )}
                    </>
                  ))
                : "No Message Found"}
            </div>
            <div className="bg-[#F5F5F5] py-1.5 md:py-4 px-1.5 md:px-0">
              <div className="bg-white md:w-[532px] rounded-md mx-auto py-1.5 md:py-3 px-1.5 md:px-0 flex items-center gap-x-0.5 md:gap-x-3 justify-between">
                <div className="flex items-center md:justify-center gap-x-0.5 md:gap-x-3 w-[20%] md:w-[15%">
                  <SmileIcon />
                  <GalleryIcon />
                </div>
                <input
                  type="text"
                  placeholder="Type a message"
                  className="w-[60%] md:w-[60%] outline-none"
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                />
                <div className="w-[20%] md:w-[15%] md:pr-2">
                  <button
                    onClick={sendMessage}
                    className="w-full py-2 bg-[#4A81D3] text-white rounded-md font-fontBold text-sm"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-[100%] bg-white overflow-hidden py-3 px-5 flex flex-col items-center justify-center min-h-80">
            <h2 className="text-center font-fontBold text-xl">
              Please Select a Friend
            </h2>
            <div className="w-40 h-40 rounded-full overflow-hidden mt-5">
              <Lottie animationData={registrationAnimation} loop={true} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Chatting;
