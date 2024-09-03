import { AddUserIcon } from "../../svg/AddUser";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { getDownloadURL, getStorage, ref as Ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import avaterImage from "../../assets/avater.png";

const UserList = () => {
  const user = useSelector((user) => user.login.loggedIn);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [friendRequest, setFriendRequest] = useState([]);
  const [cancleRequest, setCancleRequest] = useState([]);
  const [friends, setFriends] = useState([]);
  const storage = getStorage();
  const db = getDatabase();
  useEffect(() => {
    const starCountRef = ref(db, "users/");
    onValue(starCountRef, (snapshot) => {
      setIsLoading(true);
      const users = [];
      snapshot.forEach((userList) => {
        if (user.uid !== userList.key) {
          getDownloadURL(Ref(storage, userList.key))
            .then((downloadURL) => {
              users.push({
                ...userList.val(),
                id: userList.key,
                photoURL: downloadURL,
              });
            })
            .catch((error) => {
              users.push({
                ...userList.val(),
                id: userList.key,
                photoURL: null,
              });
            })
            .then(() => {
              setUsers([...users]);
              setIsLoading(false);
            });
        }
      });
    });
  }, [db, storage, user.uid]);

  const handellFriendRequest = (data) => {
    set(push(ref(db, "friendRequest")), {
      senderName: user.displayName,
      senderId: user.uid,
      senderProfile: user.photoURL ?? "/src/assets/avater.png",
      receiverName: data.username,
      receiverId: data.id,
      receiverProfile: data.photoURL ?? "/src/assets/avater.png",
    });
  };
  // Show friend request
  useEffect(() => {
    const starCountRef = ref(db, "friendRequest/");
    onValue(starCountRef, (snapshot) => {
      let data = [];
      snapshot.forEach((item) => {
        data.push(item.val().receiverId + item.val().senderId);
      });
      setFriendRequest(data);
    });
  }, [db]);

  // cancel friend request
  useEffect(() => {
    const starCountRef = ref(db, "friendRequest/");
    onValue(starCountRef, (snapshot) => {
      let cancleRequest = [];
      snapshot.forEach((item) => {
        cancleRequest.push({ ...item.val(), id: item.key });
      });
      setCancleRequest(cancleRequest);
    });
  }, [db]);
  const cancleFriendRequest = (data) => {
    const index = cancleRequest.findIndex(
      (item) => item.receiverId === data.id && item.senderId === user.uid
    );
    if (index >= 0) {
      set(ref(db, "friendRequest/" + cancleRequest[index].id), null);
    }
  };

  // Show friend
  useEffect(() => {
    const starCountRef = ref(db, "friends");
    onValue(starCountRef, (snapshot) => {
      let data = [];
      snapshot.forEach((item) => {
        if (
          item.val().senderId === user.uid ||
          item.val().receiverId === user.uid
        ) {
          data.push({ ...item.val(), id: item.key });
        }
      });
      setFriends(data);
    });
  }, [db, user.uid]);

  const isFriend = (userId) => {
    return friends.some(
      (friend) =>
        (friend.senderId === userId && friend.receiverId === user.uid) ||
        (friend.receiverId === userId && friend.senderId === user.uid)
    );
  };

  const handellUnfriend = (data) => {
    const index = friends.findIndex(
      (item) =>
        (item.receiverId === data.id && item.senderId === user.uid) ||
        (item.senderId === data.id && item.receiverId === user.uid)
    );
    if (index >= 0) {
      set(ref(db, "friends/" + friends[index].id), null);
    }
  };
  return (
    <div className="px-5 lg:px-8 pt-3 pb-5 max-h-[400px] md:max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-webkit">
      <h1 className="text-lg md:text-xl font-fontBold text-black">
        All Users {users.length ? `(${users.length})` : null}
      </h1>
      {isLoading ? (
        <p className="mt-[18px] mb-[18px]">Loading...</p>
      ) : (
        <>
          {users.map((item, index) => (
            <div className="flex items-center justify-between mt-5" key={index}>
              <div className="flex items-center gap-x-2">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden">
                  <img src={item.photoURL || avaterImage} alt={item.username} />
                </div>
                <h3 className="text-base lg:text-lg font-fontRegular text-black capitalize">
                  {item.username}
                </h3>
              </div>

              {isFriend(item.id) ? (
                <button
                  className="text-white bg-red-500 px-2 py-1 md:px-3 md:py-1 rounded-md cursor-pointer"
                  onClick={() => handellUnfriend(item)}
                >
                  Unfriend
                </button>
              ) : (
                <>
                  {friendRequest.includes(item.id + user.uid) ||
                  friendRequest.includes(user.uid + item.id) ? (
                    <button
                      className="text-[15px] lg:text-base text-white bg-red-500 px-.5 py-1 md:px-3 md:py-1 rounded-md cursor-pointer"
                      onClick={() => cancleFriendRequest(item)}
                    >
                      Cancel request
                    </button>
                  ) : (
                    <div
                      className="text-black cursor-pointer"
                      onClick={() => handellFriendRequest(item)}
                    >
                      <AddUserIcon />
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default UserList;
