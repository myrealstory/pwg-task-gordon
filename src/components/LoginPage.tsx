"use client";

import React,{ useState } from "react";
import { HeaderInline } from "./HeaderInline";
import axios from "@/lib/axiosAccount"
import Image from "next/image";
import CorrectIcon from "@/images/Tick_Circle.png";
import CloseIcon from "@/images/Icon_Close.png";
import loader from "@/images/loadingSpin.png";



export const LoginPage = () => {

    const [formValue, setFormValue] = useState({
        email: "admin@yahoo.com",
        password: "admin123",
    });

    const [formError, setFormError] = useState({
        email: false,
        password: false,
        passwordErrorMessage:"",
        emailErrorMessage:"",
    });

    const [message , setMessage] = useState({
        message: "",
        loginStatus: false,
    });

    const [showModal, setShowModal] = useState<{
        loading: boolean;
        switch: boolean;
    }>({
        loading: false,
        switch: false,
    });


    const handleInput = ( e:React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValue(prev => ({ ...prev, [name]: value }));
        validateForm(name, value);
    }

    const validateForm = (name: string , value: string) => {
        let isValid = true;

         if (name === "email") {
            if (!value) {
                setFormError(prev => ({ ...prev, "email": true, emailErrorMessage: "Email is required" }));
                isValid = false;
            } else {
                const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                if (!emailRegex.test(value)) {
                    setFormError(prev => ({ ...prev, "email": true, emailErrorMessage: "Email is invalid" }));
                    isValid = false;
                } else {
                    setFormError(prev => ({ ...prev, "email": false, emailErrorMessage: "" }));
                }
            }
        }

        if (name === "password") {
            if (!value) {
                setFormError(prev => ({ ...prev, "password": true, passwordErrorMessage: "Password is required" }));
                isValid = false;
            } else if (value.length < 6) {
                setFormError(prev => ({ ...prev, "password": true, passwordErrorMessage: "Password should be at least 6 characters" }));
                isValid = false;
            } else {
                setFormError(prev => ({ ...prev, "password": false, passwordErrorMessage: "" }));
            }
        }

        return isValid;

    };

    const handleBlur = (e : React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        validateForm(name, value);
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setShowModal({
            loading: true,
            switch: true,
        });

        const isEmailValid = validateForm("email", formValue.email);
        const isPasswordValid = validateForm("password", formValue.password);

        if(isEmailValid && isPasswordValid){
            try{
                const response = await axios.post("/login", formValue);
                if(response.status === 200){
                    localStorage.setItem("token", response.data.token);
                    setMessage({message: response.data.message, loginStatus: true});
                    setShowModal({
                        loading: false,
                        switch: true,
                    });
                }
                if(response.status === 401){
                    setMessage({message: "Invalid credentials", loginStatus: false});
                    setShowModal({
                        loading: false,
                        switch: true,
                    });
                }
            }catch(error : any){
                setMessage({message: error.message, loginStatus: false});
                setShowModal({
                    loading: false,
                    switch: true,
                });
            }
        }
    }


    return (
        <div className="bg-white w-full md:max-w-[500px] min-w-[300px] flex justify-center items-center flex-col rounded-3xl p-10 mx-4">
            <h4 className=" text-center text-3xl mb-16">Login Page</h4>
            <form className="w-[80%] mb-4">
                <div className="flex flex-col items-center justify-center gap-7 mb-6 w-full">
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
                </div>

                <button
                    type="submit"
                    className={`bg-primaryYellow text-black w-full rounded-full p-2 mt-7 text-lg ${formError.email || formError.password ? "cursor-normal pointer-events-none" : "cursor-pointer"}`}
                    disabled={formError.email || formError.password ? true : false}
                    onClick={handleSubmit}
                    >
                    Login
                </button>
            </form>
            <button
                type="button"
                className="text-primaryYellow md:w-[70%] mx-auto bg-transparent p-2 text-center text-xl"
                onClick={() => window.location.href = "/register"}
            >Create an account</button>
            {showModal.switch && (
                <div className="bg-blurBG w-screen h-screen fixed top-0 left-0">
                    <div className=" bg-white w-full max-w-[600px] min-w-[330px] py-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-10 rounded-3xl">
                        <Image 
                            src={showModal.loading === true ? loader :message.loginStatus === true ? CorrectIcon : CloseIcon}
                            width={0}
                            height={0}
                            alt="icon"
                            sizes="100vw"
                            className={`w-[60px] h-auto aspect-square ${showModal.loading && "animate-spin"}`}
                        />
                        <p className="text-xl text-center text-black">{showModal.loading ? "please wait moment..." :message.message}</p>
                        {showModal.loading === false && (
                            <button 
                            className="w-[150px] rounded-full bg-primaryYellow uppercase text-black text-center py-2 text-lg"
                            onClick={() => {
                                if(message.loginStatus === true){
                                    window.location.href = "/home";
                                } else{
                                setShowModal({
                                    loading: false,
                                    switch: false
                                })}    
                                }
                            }
                            >
                            ok
                        </button>
                            )
                            }
                    </div>

                </div>
            )}
        </div>
    )
}