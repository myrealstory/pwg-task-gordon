"use client";
import React from "react";
import { PopupContainerType } from "@/types/HomePageTypes";
import Image from "next/image";
import ErrorIcon from "@/images/Icon_Close.png";
import  AxiosPosts  from "@/lib/axiosPost";
import { useEffect, useMemo, useRef, useState } from "react";
import { HeaderInline } from "./HeaderInline";
import { TagsOptions } from "@/Mock/TagMock";


export const PopupContainer = ({modModal, modal ,triggerModal,data}: PopupContainerType) => {

    const [availableTags, setAvailableTags] = useState<string[]>(TagsOptions);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [formValue, setFormValue] = useState({
        title: "",
        body: "",
        tags: [""],
    });
    const [formError, setFormError] = useState({
        title: false,
        body: false,
        tags: false,
        titleErrorMessage:"",
        bodyErrorMessage:"",
        tagsErrorMessage:"",
    });
    const tagsAmount = useRef(0);

    // input handling function
    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormValue(prev => ({...prev, [name]: value}));
        onBlurValidation(name,value);
    }

    // onBlur Input validation function
    const onBlurValidation = (name: string, value: string) => {
        let isValid = true;

        if (name === "title") {
            if (value.length === 0) {
                setFormError(prev => ({ ...prev, title: true, titleErrorMessage: "Title is required" }));
                isValid = false;
            } else {
                setFormError(prev => ({ ...prev, title: false, titleErrorMessage: "" }));
            }
        }

        if (name === "body") {
            if (value.length === 0) {
                setFormError(prev => ({ ...prev, body: true, bodyErrorMessage: "Body is required" }));
                isValid = false;
            } else {
                setFormError(prev => ({ ...prev, body: false, bodyErrorMessage: "" }));
            }
        }

        return isValid;
    };

    const handleSelectBlur = (option :string) => {
        if(option !== "") tagsAmount.current += 1; 

        if(tagsAmount.current > 3){
            tagsAmount.current -= 1;
            setFormError(prev => ({...prev, tags: true, tagsErrorMessage: "You can only select 3 tags"}));
            return false;
        }

        if(option === ""){
            if(selectedTags.length === 0){
                setFormError(prev => ({...prev, tags: true, tagsErrorMessage: "tags was required"}));
                return false;
            }else {
                setFormError(prev => ({...prev, tags: false, tagsErrorMessage: ""}));
                return true;
            }
        }
        return true;
    }


    // handleSelect function to select the tags
    const handleSelect = (option: string) =>{
       
        const selectBlurValidate = handleSelectBlur(option);

        if(!selectBlurValidate){
            return ;
        }
        setSelectedTags([...selectedTags, option]);
        setAvailableTags(availableTags.filter((tag)=> tag !== option));
        setFormValue({...formValue, tags: [...selectedTags, option]});
        setFormError({...formError, tags: false, tagsErrorMessage: ""});
    }

    // handleSelectRemove function to remove the tags
    const handleSelectRemove = (option: string) =>{
        tagsAmount.current -= 1;
        setSelectedTags(selectedTags.filter((tag)=> tag !== option));
        setFormValue({...formValue, tags: selectedTags.filter((tag)=> tag !== option)});
        setAvailableTags([...availableTags, option]);
        setFormError({...formError, tags: false, tagsErrorMessage: ""});
    }

    // useMemo to find the current data
    const currentData = useMemo(()=>{
        return data.find((item)=> item.id === modModal.id);
    },[data]);

    // useEffect to set the form value if mode in edit or delete
    useEffect(()=>{
        if(modModal.show === true && (modModal.type === "edit" || modModal.type === "delete") && currentData) {
            setFormValue({
                title: currentData.title,
                body: currentData.body,
                tags: currentData.tags,
            });
            setSelectedTags(currentData.tags);
            setAvailableTags(TagsOptions.filter((tag)=> !currentData.tags.includes(tag)));
            tagsAmount.current = currentData.tags.length;
        }
    },[modModal])

    const validateAllFields = () => {
        const titleValid  = onBlurValidation("title", formValue.title);
        const bodyValid  = onBlurValidation("body", formValue.body);
        const tagsValid  = handleSelectBlur("");

        return titleValid && bodyValid && tagsValid ;
    }

    // handleDelete for delete post
    const handleDelete = async() => {
        try {

            const apiUrl = `/delete/${modModal.id}`;
            const res = await AxiosPosts.delete(apiUrl)
            if(res.status === 200){
                triggerModal("delete", false, 0);
                window.location.reload();
            }

        }catch(error){
            window.location.reload();
            console.log(error);
        }
    }

    const handleEditSubmit = async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        const isValid = validateAllFields();
        if(isValid) {
            try {
                const apiUrl = `/edit/${modModal.id}`;
                const res = await AxiosPosts.put(apiUrl, formValue);

                if(res.status === 200){
                    triggerModal("edit", false, 0);
                    window.location.reload();
                }
            }catch(error){
                window.location.reload();
                console.log(error);
            }
        }
    }

    const handleAddSubmit = async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        const isValid = validateAllFields();
        
        if(isValid){
            try {
                const res = await AxiosPosts.post("/create", formValue);

                if(res.status === 201){
                    triggerModal("add", false);
                    window.location.reload();
                }

            }catch(error){

                window.location.reload();
                console.log(error);
            }
        }
    }
    

    // return the popup container UI
    if(modal.show === true) {
        return (
            <div className="fixed top-0 left-0 w-full h-full bg-blurBG z-50 flex justify-center items-center">
                <div className="bg-white w-96 h-96 rounded-lg flex flex-col justify-center items-center">
                    <Image 
                        src={ErrorIcon} 
                        alt="Error Icon"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-[60px] h-auto mb-6"
                        />
                    <p className="text-black text-lg mb-5">{modal.message}</p>
                    <button 
                        className="bg-primaryYellow text-black px-3 py-2 rounded-lg"
                        onClick={()=>{
                            localStorage.removeItem("token");
                            window.location.href="/"
                        }}
                    >
                        OK
                    </button>
                </div>
            </div>
        )
    }

    if(modModal.show === true && modModal.type === "delete" && currentData) {
        return (
            <div className="fixed top-0 left-0 w-full h-full bg-blurBG z-50 flex justify-center items-center">
                <div className="bg-white px-16 py-8 rounded-lg flex flex-col justify-center items-center gap-5 lg:max-w-[500px] max-w-[400px] w-full text-center">
                    <p className="text-warning text-lg ">{currentData.title}</p>
                    <p className="text-black text-lg ">{"Are you sure you want to delete this post ?"}</p>
                    <div className=" flex gap-6 ">
                        <button
                            className="bg-tagColor text-black px-8 py-1 rounded-full"
                            onClick={()=>triggerModal("", false, 0)}
                        >
                            cancel
                        </button>
                        <button
                            className="bg-warning text-black px-8 py-1 rounded-full"
                            onClick={handleDelete}
                        >
                            delete
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if(modModal.show ===true && ((modModal.type === "edit" && currentData)|| modModal.type === "add")) {
        return (
            <div className="fixed top-0 left-0 w-full h-full bg-blurBG z-50 flex justify-center items-center">
                <div className="bg-white lg:p-16 p-8 rounded-lg flex flex-col justify-center items-center gap-5 w-full lg:max-w-[500px] max-w-[400px]">
                    <p className="text-black lg:text-[1.3rem] text-[1rem]">{modModal.type === "add" ? "Add A Post":"Edit Post"}</p>
                    <div className="w-full">
                        <HeaderInline labelName={"Title"} />
                        <input
                            type="text"
                            className={`border-2 ${formError.title ? "border-warning":"border-primaryYellow"}  rounded-full px-3 py-1 w-full focusRing`}
                            name="title"
                            id="Title"
                            required
                            value={formValue.title}
                            onChange={handleInput}
                            onBlur={()=>onBlurValidation("title", formValue.title)}
                        />
                        {formError.title === true && <p className="text-warning text-md">{formError.titleErrorMessage}</p>}
                    </div>
                    <div className="w-full">
                        <HeaderInline labelName={"Content"} />
                        <textarea
                            className={`border-2 ${formError.body ? "border-warning":"border-primaryYellow"} rounded-lg px-3 py-1 w-full h-36 focusRing`}
                            name="body"
                            id="Content"
                            required
                            value={formValue.body}
                            onChange={handleInput}
                            onBlur={()=>onBlurValidation("body", formValue.body)}
                        />
                        {formError.body === true && <p className="text-warning text-md">{formError.bodyErrorMessage}</p>}
                    </div>
                    <div className="relative w-full lg:mb-8 mb-5">
                        <HeaderInline labelName="Tags"/>
                        <select
                            name="tags"
                            id="Tags"
                            value=""
                            onChange={(e)=>handleSelect(e.target.value)}
                            onBlur={(e) => handleSelectBlur(e.target.value)}
                            className={`border-2 ${formError.tags ? "border-warning":"border-primaryYellow"}  rounded-full px-3 py-1 w-full focusRing text-white`}
                        >
                            <option value="" disabled></option>
                            {availableTags.map((tag, index)=>(
                                <option key={index} value={tag} className="text-black">{tag}</option>
                            ))}
                        </select>
                        <div className="absolute left-3 top-[1.85rem] flex gap-3 z-50 ">
                            {selectedTags.map(tags =>(
                                <button 
                                    key={tags} 
                                    role="button"
                                    className="bg-primaryGrey text-black px-4 py-1 rounded-full text-[0.7rem]"
                                    onClick={()=>handleSelectRemove(tags)}
                                    >
                                        {tags}
                                </button>
                            ))}
                        </div>
                        {formError.tags === true && <p className="text-warning text-md">{formError.tagsErrorMessage}</p>}
                    </div>
                    <div className=" flex gap-6 ">
                        <button
                            className="bg-tagColor text-black px-8 py-1 rounded-full"
                            onClick={()=>triggerModal("", false, 0)}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-primaryYellow text-black px-8 py-1 rounded-full"
                            onClick={(e:React.MouseEvent<HTMLButtonElement>)=>{
                                if(modModal.type === "add"){
                                    handleAddSubmit(e)
                                }else {
                                    handleEditSubmit(e)
                                }
                            }}
                        >
                            {modModal.type === "add" ? "Add" : "Edit"}
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <div></div>
    );
}