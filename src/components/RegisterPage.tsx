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
        const { name, value } = e.target;
        setFormValue(prev => ({ ...prev, [name]: value }));
        validateForm(name, value);
    }
    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) =>{
        const {value} = e.target;
        setFormValue({...formValue, role: value});
    }

    const validateForm = (name: string, value: string) => {
        let isValid = true;
    
        // Email validation
        if (name === "email") {
            if (!value) {
                setFormError(prev => ({ ...prev, email: true, emailErrorMessage: "Email is required" }));
                isValid = false;
            } else {
                const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                if (!emailRegex.test(value)) {
                    setFormError(prev => ({ ...prev, email: true, emailErrorMessage: "Email is invalid" }));
                    isValid = false;
                } else {
                    setFormError(prev => ({ ...prev, email: false, emailErrorMessage: "" }));
                }
            }
        }
    
        // Password validation
        if (name === "password") {
            if (!value) {
                setFormError(prev => ({ ...prev, password: true, passwordErrorMessage: "Password is required" }));
                isValid = false;
            } else if (value.length < 6) {
                setFormError(prev => ({ ...prev, password: true, passwordErrorMessage: "Password should be at least 6 characters" }));
                isValid = false;
            } else {
                setFormError(prev => ({ ...prev, password: false, passwordErrorMessage: "" }));
            }
        }
    
        // Username validation
        if (name === "username") {
            if (!value) {
                setFormError(prev => ({ ...prev, username: true, usernameErrorMessage: "Username is required" }));
                isValid = false;
            } else {
                const usernameRegex = /^[a-zA-Z0-9]+$/;
                if (!usernameRegex.test(value)) {
                    setFormError(prev => ({ ...prev, username: true, usernameErrorMessage: "Username is invalid" }));
                    isValid = false;
                } else {
                    setFormError(prev => ({ ...prev, username: false, usernameErrorMessage: "" }));
                }
            }
        }
    
        // Role validation
        if (name === "role") {
            if (!value) {
                setFormError(prev => ({ ...prev, role: true, roleErrorMessage: "Role is required" }));
                isValid = false;
            } else {
                setFormError(prev => ({ ...prev, role: false, roleErrorMessage: "" }));
            }
        }
    
        return isValid;
    };
    

    const handleBlur = (e : React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        validateForm(name, value);
    }

    const validateAllFields = (): boolean => {
        const emailValid = validateForm("email", formValue.email);
        const passwordValid = validateForm("password", formValue.password);
        const usernameValid = validateForm("username", formValue.username);
        const roleValid = validateForm("role", formValue.role);
    
        return emailValid && passwordValid && usernameValid && roleValid;
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const allFieldsValid = validateAllFields();

        if (allFieldsValid) {
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
                className="text-primaryYellow md:w-[70%]  mx-auto bg-transparent p-2 text-center text-xl"
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
