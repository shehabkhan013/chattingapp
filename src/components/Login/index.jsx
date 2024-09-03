import { useFormik } from "formik";
import { validationSchemaSignIn } from "../../validation/validation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loggedInUser } from "../../fetures/slice/LoginSlice";


const LoginFormCom = ({toast}) => {
    const dispash = useDispatch();
    const [loading, setLoading] = useState(false);
    const navigateTo = useNavigate();
    const auth = getAuth();
    const  initialValues= {
        email: '',
        password: '',
      }
    const formik = useFormik({
        initialValues,
        onSubmit: () => {
            signInUser();
        },
        validationSchema: validationSchemaSignIn
    });

    const signInUser = () => {
        setLoading(true);
        signInWithEmailAndPassword(auth, formik.values.email, formik.values.password)
        .then(({user}) => {
            if(user.emailVerified === true){
                dispash(loggedInUser(user));
                localStorage.setItem('user', JSON.stringify(user));
                toast.success('Login Successful');
                let redirect = setTimeout(() => {
                    navigateTo ('/');
                }, 2000)
                //clearTimeout(redirect);
                setLoading(false);
            }else{
                setLoading(false);
                toast.error('Please verify your email');
            }
        })
        .catch((error) => {
            setLoading(false);
            toast.error(error.message);
        })
    }

  return (
    <>
    <div>
        <h1 className="mb-3 font-fontBold">Login to Access</h1>
        <form onSubmit={formik.handleSubmit}>
            <input type="email" name="email" onChange={formik.handleChange} value={formik.values.email} placeholder="Enter your email" className="w-full px-3 py-2 border border-slate-400 rounded-md outline-none mb-3" />
            {
                formik.touched.email && formik.errors.email ? <p className="text-red-500 mb-3 text-base font-fontReguler sensitive">{formik.errors.email}</p> : null
            }
            <input type="password" name="password" onChange={formik.handleChange} value={formik.values.password} placeholder="Enter your password" className="w-full px-3 py-2 border border-slate-400 rounded-md outline-none mb-3" />
            {
                formik.touched.password && formik.errors.password ? <p className="text-red-500 mb-3 text-base font-fontReguler sensitive">{formik.errors.password}</p> : null
            }
            <button type="submit" className="w-full bg-slate-900 text-white px-3 py-3 rounded-md outline-none text-base font-fontBold"> {loading ? <BeatLoader color="white" size={10} /> : 'Sign In'}</button>
        </form>
        <p className="text-slate-500 font-fontReguler mt-3 text-base ">Don't have an account? <Link to="/registration">Sign Up</Link></p>
    </div>
    </>
    
  )
}

export default LoginFormCom