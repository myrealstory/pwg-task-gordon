"use client";

import { useEffect, useState } from "react";
import axiosPost from "@/lib/axiosPost";
import { StoryData } from "@/types/HomePageTypes";

export const ViewPostContainer = ({ id }:{id:string}) => {

    const [storyData, setStoryData] = useState<StoryData| null>(null);

    useEffect(()=>{

        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
        }
        const fetchingViewPost = async () => {
            try {
                const apiUrl = `/view/${id}`;
                const response = await axiosPost.get(apiUrl);
                if(response.status === 200){
                    setStoryData(response.data);
                }
            } catch (error) {
                window.location.href = "/home";
            }
        }
        fetchingViewPost();

    },[id])

    const triggerLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    }

    if(storyData === null){
        return <></>;
    }

    return (
        <div className="flex flex-col items-center pt-8 mb-[10rem] w-full 2xl:max-w-[1380px] lg:max-w-[80%] md:max-w-[70%] h-full px-4">
            <div className=" flex items-center justify-between mb-6 w-full">
                <button
                    className="bg-primaryYellow text-black md:py-2 md:px-8 rounded-full py-1 px-3 text-sm"
                    onClick={() => window.location.href = "/home"}
                >
                    Back
                </button>
                <button
                    className="text-xl text-warning"
                    onClick={triggerLogout}
                >
                    Logout
                </button>
            </div>
            <h4
                className={"text-black text-xl text-center mb-16"}
            >
                View Post
            </h4>

            <div className="bg-white rounded-2xl w-full lg:px-16 lg:py-20 px-8 py-10 flex flex-col gap-6">
                <h2 className="text-2xl text-black ">{storyData.title}</h2>
                <p className="text-black text-lg">{storyData.body}</p>
                <div className="flex items-center gap-2 ">
                            {storyData.tags.map((tag,index) =>(
                                <div className="bg-tagColor rounded-full text-center px-2 py-1 flex text-[0.6rem] font-medium" key={index}>
                                    {tag}
                                </div>
                            ))}
                        </div>
            </div>
        </div>
    )
}