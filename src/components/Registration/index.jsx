import { useFormik } from "formik";
import { validationSchema } from "../../validation/validation";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";

const RegFormCom = ({toast}) => {
    const [loading, setLoading] = useState(false);
    const navigateTo = useNavigate();
    const auth = getAuth();
    const db = getDatabase();
    const  initialValues= {
        name: '',
        email: '',
        password: '',
      }
    const formik = useFormik({
        initialValues,
        onSubmit: () => {
            createNewUsers();
        },
        validationSchema: validationSchema
      });

      const createNewUsers = () => {
        setLoading(true);
        createUserWithEmailAndPassword(auth, formik.values.email, formik.values.password)
        .then(({user}) => {
            updateProfile(auth.currentUser, {
                displayName: formik.values.name
            }).then(() => {
                sendEmailVerification(auth.currentUser)
                .then(() => {
                    toast.success('Registration Successful',{
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    }) 
                    setTimeout(() => {
                        navigateTo ('/login');
                    }, 2000)
                    setLoading(false);
                })
            })
            .then(() => {
                set(ref(db, 'users/' + user.uid), {
                    username: user.displayName,
                    email: user.email,
                });
            }) 
        })
        .catch((error) => {
            if(error.message.includes('auth/email-already-in-use')){
                toast.error('Email already in use',{
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        
                    }
                )
                setLoading(false);
            }
        });
      }

  return (
    <>
    <div>
        <h1 className="mb-3 font-fontBold">Registration for your new journey</h1>
        <form onSubmit={formik.handleSubmit}>
            <input type="text" name="name" onChange={formik.handleChange} value={formik.values.name} placeholder="Enter your name" className="w-full px-3 py-2 border border-slate-400 rounded-md outline-none mb-3" />
            {
                formik.touched.name && formik.errors.name ? <p className="text-red-500 mb-3 text-base font-fontReguler sensitive">{formik.errors.name}</p> : null
            }
            <input type="email" name="email" onChange={formik.handleChange} value={formik.values.email} placeholder="Enter your email" className="w-full px-3 py-2 border border-slate-400 rounded-md outline-none mb-3" />
            {
                formik.touched.email && formik.errors.email ? <p className="text-red-500 mb-3 text-base font-fontReguler sensitive">{formik.errors.email}</p> : null
            }
            <input type="password" name="password" onChange={formik.handleChange} value={formik.values.password} placeholder="Enter your password" className="w-full px-3 py-2 border border-slate-400 rounded-md outline-none mb-3" />
            {
                formik.touched.password && formik.errors.password ? <p className="text-red-500 mb-3 text-base font-fontReguler sensitive">{formik.errors.password}</p> : null
            }
            <button type="submit" className="w-full bg-slate-900 text-white px-3 py-3 rounded-md outline-none text-base font-fontBold"> {loading ? <BeatLoader color="white" size={10} /> : 'Sign Up'}</button>
        </form>
        <p className="text-slate-500 font-fontReguler mt-3 text-base ">Already have an account? <Link to="/login">Login</Link></p>
    </div>
    </>
    
  )
}

export default RegFormCom