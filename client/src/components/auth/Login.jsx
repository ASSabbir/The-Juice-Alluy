// import { Link, useNavigate } from 'react-router-dom';
import login from '../../assets/login.png'
// import { useContext, useState } from 'react';
// import { AuthContext } from '../Main/AuthProvider';
// import Swal from 'sweetalert2';
// import axios from 'axios';

import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";




const Login = () => {
    const { handelSignin, googleSign } = useContext(AuthContext)
    const [flag,setFlag]=useState(false)
    const [showDummy, setShowDummy] = useState(false);
    const navg = useNavigate()
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

    const fillCredentials = (email, password) => {
        document.querySelector('input[name="email"]').value = email;
        document.querySelector('input[name="password"]').value = password;
    };

    const handelSubmit = (e) => {
        e.preventDefault();
        setFlag(true)
        const email = e.target.email.value
        const password = e.target.password.value
        if (email === '' || password === '') {
            Toast.fire({
                icon: "error",
                title: 'All fields must be filled out.'
            });
            return
        }

        handelSignin(email, password)
            .then(user2 => {
                Toast.fire({
                    icon: "success",
                    title: `WelCome ${user2.user.displayName} `
                });
                setFlag(false)
                navg(location.state ? location.state : '/')

            })
            .catch(error => {
                console.log(error)
                Toast.fire({
                    icon: "error",
                    title: error.code
                });
            })

    }

    const handelgoogle = () => {
        googleSign()
            .then((user2) => {
                Toast.fire({
                    icon: "success",
                    title: `WelCome ${user2.user.displayName} `
                });
                const user={email:user2.user.email,role:'User'}
                axios.post('https://skillpath-bay.vercel.app/users', user)
                    .then(res => console.log(res.data))
                    .catch(error => { console.log(error) })

                navg(location.state ? location.state : '/')

            })
            .catch(error => {
                Toast.fire({
                    icon: "error",
                    title: error.code
                });
                console.log(error)
            })
    }

    return (
        <div className="hero bg-gray-200 py-32 dark:bg-gray-950">
            <div className="hero-content  flex-col lg:flex-row-reverse">
                <div className="text-center w-1/2 lg:text-left ">
                    <img src={login} alt="" />
                </div>
                <div className="card bg-base-100 w-1/2   max-w-sm shrink-0 ">
                    <div className="w-full max-w-md p-8 space-y-3 rounded-xl bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white">
                        <h1 className="text-4xl text-color1 font-bold text-center">Login</h1>
                        <form onSubmit={handelSubmit} className="space-y-6">
                            <div className="space-y-1 text-sm">
                                <label className="block text-gray-600">Email</label>
                                <input type="text" name="email" placeholder="email" className="w-full px-4 py-3 rounded-md border-gray-300 border-2 bg-gray-50 text-gray-800 " />
                            </div>
                            <div className="space-y-1 text-sm">
                                <label className="block text-gray-600">Password</label>
                                <input type="password" name="password" placeholder="Password" className="w-full border-2 px-4 py-3 rounded-md border-gray-300 bg-gray-50 text-gray-800 " />
                            </div>

                            <button type="button" onClick={() => setShowDummy(!showDummy)} className="block w-full p-3 text-center hover:bg-color1 rounded-sm text-gray-50 bg-color2 duration-200">
                                Use Dummy Credentials
                            </button>

                            {showDummy && (
                                <div className="space-y-2">
                                    <button type="button" onClick={() => fillCredentials('foradmin@gmail.com', '123456789@Aa')} className="block w-full p-2 bg-blue-500 text-white rounded-md">Dummy Admin</button>
                                    <button type="button" onClick={() => fillCredentials('forUser@gmail.com', '123456789@Aa')} className="block w-full p-2 bg-green-500 text-white rounded-md">Dummy User</button>
                                    
                                </div>
                            )}

                            {
                                flag ?
                                    <button disabled className="block w-full p-3 text-center rounded-sm text-gray-50 bg-[#80A5DC] ">
                                        <span className="loading loading-bars loading-sm"></span>
                                    </button>
                                    :
                                    <button className="block w-full p-3 text-center hover:bg-color1 rounded-sm text-gray-50 bg-color2 duration-200">
                                        Sign In
                                    </button>
                            }
                        </form>

                        <div className="flex items-center pt-4 space-x-1">
                            <div className="flex-1 h-px sm:w-16 bg-gray-300"></div>
                            <p className="px-3 text-sm text-gray-600">Login with social accounts</p>
                            <div className="flex-1 h-px sm:w-16 bg-gray-300"></div>
                        </div>
                        <div className="flex justify-center space-x-4">
                            <button onClick={handelgoogle} aria-label="Log in with Google" className="p-3 rounded-sm ">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current hover:fill-color2 duration-150">
                                    <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
                                </svg>
                            </button>
                        </div>
                        <p className="text-xs text-center sm:px-6 text-gray-600">Dont have an account?
                            <Link to={'/'} className="underline text-gray-800 dark:text-white">Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
