import Lottie from "lottie-react"
import RegFormCom from "../components/Registration"
import registrationAnimation from "../animation/registration.json"
import { ToastContainer, toast } from 'react-toastify';

const Registration = () => {
  return (
    <>
    <ToastContainer />
    <div className="w-full h-screen flex justify-center items-center">
        <div className="w-2/4 bg-white shadow-md rounded-sm p-4 flex items-center gap-x-2 justify-between">
            <div className="w-[48%]">
            <Lottie animationData={registrationAnimation} loop={true} />
            </div>
            <div className="w-[48%]">
                <RegFormCom toast={toast}/>
            </div>
        </div>
    </div>
    </>
  )
}

export default Registration