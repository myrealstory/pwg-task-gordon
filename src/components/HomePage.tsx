"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axiosPost";

interface StoryData {
    title:string;
    body:string;
    tags:[string];
}

interface IndexDataType {
    data : StoryData[];
    page: number;
    limit: number;
    totalPages: number;
    totalPosts: number;
}

interface ModalType {
    type: "" | "add" | "edit" | "delete" | "view" | "error";
    show: boolean;
    message?: string;
}

export const HomePage = () =>{

    const getToken = localStorage.getItem("token");
    const [Data, setData] = useState<IndexDataType | null>(null);
    const [modal, setModal] = useState<ModalType>({
        type: "",
        show: false,
        message: "",
    })

    useEffect(() => {
        if (!getToken) {
            window.location.href = "/";
        }
        const getStoryData = async () => {
            try {
                const response = await axios.get("");
                if(response.status === 200){
                    setData(response.data);
                }
            }catch(error){
                setModal({type: "error", show: true, message: "Login was Error, Please login again"});
                
            }
        }
        getStoryData();
    }, []);


    return (
        <></>
    );
}