import { Outlet } from "react-router-dom";
import NavBar from "../navbar";

const RootLayout = () => {
  return (
    <>
      <div className="relative w-full h-screen">
        <div className="md:h-[48vh] bg-black w-full"></div>
        <div className="w-full lg:w-3/4 lg:mx-0 bg-white rounded-md md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:shadow-md">
          <NavBar />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default RootLayout;
