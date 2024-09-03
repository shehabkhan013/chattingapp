import { Link, useLocation, useNavigate } from "react-router-dom";
import { FriendsIcon } from "../../svg/Frinds";
import { MessageIcon } from "../../svg/Message";
import { CameraIcon } from "../../svg/Camera";
import { getAuth, signOut } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "../../fetures/slice/LoginSlice";
import { createPortal } from "react-dom";
import Modals from "../Modals";
import avaterImage from "../../assets/avater.png";
import { useState } from "react";

function NavBar() {
  const user = useSelector((user) => user.login.loggedIn);

  const location = useLocation();
  const auth = getAuth();
  const [show, setShow] = useState(false);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const handelLogout = () => {
    signOut(auth)
      .then(() => {
        navigateTo("/login");
        localStorage.removeItem("user");
        dispatch(logOutUser());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="flex justify-between items-center py-3 px-5 md:px-7 bg-slate-900">
        <div className="flex items-center gap-x-2">
          <div className="relative">
            <div className="w-10 h-10 md:w-16 md:h-16 rounded-full overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={user.photoURL || avaterImage}
                alt=""
              />
            </div>
            <div
              className="absolute bottom-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-white rounded-full flex justify-center items-center cursor-pointer"
              onClick={() => setShow(true)}
            >
              <CameraIcon />
            </div>
          </div>
          <div>
            <span className="font-fontRegular text-white text-sm md:text-base">
              {user.displayName}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-x-2">
          <Link
            to="/"
            className={`${
              location.pathname === "/" ? "bg-[#6CD0FB] text-white" : "bg-white"
            } text-[$292D32] w-8 h-8 md:w-10 md:h-10 rounded-full  flex justify-center items-center`}
          >
            <FriendsIcon />
          </Link>
          <Link
            to="/messages"
            className={`${
              location.pathname === "/messages"
                ? "bg-[#6CD0FB] text-white"
                : "bg-white"
            } text-[$292D32] w-8 h-8 md:w-10 md:h-10 rounded-full  flex justify-center items-center`}
          >
            <MessageIcon />
          </Link>
        </div>
        <div>
          <button
            onClick={handelLogout}
            className="font-fontBold px-3 py-1 text-xs md:text-sm text-white bg-[#6CD0FB] rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
      {show && createPortal(<Modals setShow={setShow} />, document.body)}
    </>
  );
}

export default NavBar;
