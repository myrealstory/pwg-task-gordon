"use client";

import { useState } from "react";
import { HeaderInline } from "./HeaderInline";
import axios from "@/lib/axiosAccount";
import Image from "next/image";
import CorrectIcon from "@/images/Tick_Circle.png";
import CloseIcon from "@/images/Icon_Close.png";

interface FormValueType {
    username: string;
    email: string;
    password: string;
    role: string;
}

interface FormErrorType {
    username: boolean;
    email: boolean;
    password: boolean;
    role: boolean;
    usernameErrorMessage: string;
    emailErrorMessage: string;
    passwordErrorMessage: string;
    roleErrorMessage: string;
}

export const RegisterPage = () => {

    const [formValue, setFormValue] = useState<FormValueType>({
        username: "",
        email:"",
        password: "",
        role: "",
    });
    const [formError, setFormError] = useState<FormErrorType>({
        username: false,
        email: false,
        password: false,
        role: false,
        usernameErrorMessage:"",
        passwordErrorMessage:"",
        emailErrorMessage:"",
        roleErrorMessage: "",
    });

    const [message , setMessage] = useState({
        message: "",
        loginStatus: false,
    });

    const [showModal, setShowModal] = useState(false);

    const handleInput = ( e:React.ChangeEvent<HTMLInputElement>) => {
       const {name , value} = e.target;
       if (name === "email") {
           setFormValue({...formValue, email: value});
       }
       if (name === "password") {
           setFormValue({...formValue, password: value});
       }
       if(name === "username"){
           setFormValue({...formValue, username: value});
       }
    }
    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) =>{
        const {value} = e.target;
        setFormValue({...formValue, role: value});
    }

    const validateForm = (name: string , value: string) => {
        if(name === "email" && !value){
            setFormError({...formError, "email": true, emailErrorMessage: "Email is required"});
        }
        if(name === "password" && !value){
            setFormError({...formError, "password": true, passwordErrorMessage: "Password is required"});
        }
        
        if(name === "username" && !value){
            setFormError({...formError, "username": true, usernameErrorMessage: "Username is required"});
        }
        
        if(name === "role" && value.length === 0){
            setFormError({...formError, "role": true,
            roleErrorMessage: "Role is required"
            });

        }

        if(name === "email"){
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if(!emailRegex.test(value)){
                setFormError({...formError, "email": true, emailErrorMessage: "Email is invalid"});
                return false;
            }else {
                setFormError({...formError, "email": false, emailErrorMessage: ""});
                return true;
            }
        }

        if(name === "password"){
            if(value.length < 6){
                setFormError({...formError, "password": true, passwordErrorMessage: "Password should be at least 6 characters"});
                return false;
            }else {
                setFormError({...formError, "password": false, passwordErrorMessage: ""});
                return true;
            }
        }

        if(name === "username"){
            const usernameRegex = /^[a-zA-Z0-9]+$/;
            if(!usernameRegex.test(value)){
                setFormError({...formError, "username": true, usernameErrorMessage: "Username is invalid"});
                return false;
            }else {
                setFormError({...formError, "username": false, usernameErrorMessage: ""});
                return true;
            }
        }

        if(name === "role"){
            if(value){
                setFormError({...formError, "role": false, roleErrorMessage: ""});
                return true;
            }
        }

    };

    const handleBlur = (e : React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        validateForm(name, value);
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const isEmailValid = validateForm("email", formValue.email);
        const isPasswordValid = validateForm("password", formValue.password);
        const isUsernameValid = validateForm("username", formValue.username);
        const isRoleValid = validateForm("role", formValue.role);

        if(isEmailValid && isPasswordValid && isUsernameValid && isRoleValid){
            try{
                
                const response = await axios.post("/register", formValue);
                if(response.status === 200 || response.status === 201){
                    const successMessage = `${response.data.message}, Please Login`;
                    setMessage({message: successMessage, loginStatus: true});
                    setShowModal(true);
                }
            }catch(error : any){
                const errorMessage = error.response?.data?.error;
                setMessage({message: errorMessage, loginStatus: false});
                setShowModal(true);
            }
        }else {
            return false;
        }
    }
    

    return (
        <div className="w-full md:max-w-[500px] min-w-[330px] flex flex-col justify-center items-center bg-white rounded-3xl p-10 mx-4">
            <h4 className=" text-center text-3xl mb-16">Register User</h4>
            <form className="w-[90%] mb-4">
                <div className="flex flex-col items-center justify-center gap-7 mb-6 w-full">
                    <div className="w-full">
                        <HeaderInline labelName="Username" />
                        <input
                            type="text"
                            id="username"
                            name="username"
                            required
                            className={`w-full border-2 ${formError.username === true ? "border-warning ":" border-primaryYellow"}  rounded-full py-1 px-5 focusRing `}
                            value={formValue.username}
                            onChange = {handleInput}
                            onBlur={handleBlur}
                            />
                            {formError.username && <p className="text-warning text-md">{formError.usernameErrorMessage}</p>}
                    </div>
                    <div className="w-full">
                        <HeaderInline labelName="Email" />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className={`w-full border-2 ${formError.email === true ? "border-warning ":" border-primaryYellow"}  rounded-full py-1 px-5 focusRing `}
                            value={formValue.email}
                            onChange = {handleInput}
                            onBlur={handleBlur}
                            />
                            {formError.email && <p className="text-warning text-md">{formError.emailErrorMessage}</p>}
                    </div>
                    <div className="w-full">
                        <HeaderInline labelName="Password" />
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className={`w-full border-2 ${formError.password === true ? "border-warning ":" border-primaryYellow"} rounded-full py-1 px-5 focusRing`}
                            required
                            minLength={6}
                            value={formValue.password}
                            onChange = {handleInput}
                            onBlur={handleBlur}
                            />
                            {formError.password && <p className="text-warning text-md">{formError.passwordErrorMessage}</p>}
                    </div>
                    <div className="w-full">
                        <HeaderInline labelName="Role" />
                        <select 
                        value={formValue.role} 
                        onChange={handleSelect} 
                        onBlur={handleBlur}
                        name="role" 
                        id="role" 
                        className={`w-full border-2 ${formError.role === true ? "border-warning ":" border-primaryYellow"} rounded-full py-1 px-5 focusRing`}>
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                        {formError.role && <p className="text-warning text-md">{formError.roleErrorMessage}</p>}
                    </div>
                </div>
                <button
                    type="submit"
                    className={`bg-primaryYellow text-black w-full rounded-full p-2 mt-5 text-lg ${formError.email || formError.password || formError.username ? "cursor-none" : "cursor-pointer"}`}
                    disabled={formError.email || formError.password || formError.username ? true : false}
                    onClick={handleSubmit}
                    >
                    Register
                </button>
            </form>
            <button
                className="text-primaryYellow w-[70%] mx-auto bg-transparent p-2 text-center text-xl"
                onClick={() => window.location.href = "/"}
            >
                Back to Login Page
            </button>
            {showModal && (
                <div className="bg-blurBG w-screen h-screen fixed top-0 left-0">
                    <div className=" bg-white w-full max-w-[600px] min-w-[330px] py-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-10 rounded-3xl">
                        <Image 
                            src={message.loginStatus === true ? CorrectIcon : CloseIcon}
                            width={0}
                            height={0}
                            alt="icon"
                            sizes="100vw"
                            className="w-[60px] h-auto aspect-square"
                        />
                        <p className="text-xl text-center text-black">{message.message}</p>
                        <button 
                            className="w-[150px] rounded-full bg-primaryYellow uppercase text-black text-center py-2 text-lg"
                            onClick={() => {
                                    message.loginStatus === true ? window.location.href = "/" : setShowModal(false);
                                }
                            }
                        >
                            ok
                        </button>
                    </div>

                </div>
            )}
        </div>
    );

}
