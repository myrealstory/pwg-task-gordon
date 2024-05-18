"use client";

import {useState } from "react";
import { ModModalType, ModalType, WrappedComponentProps } from "@/types/HomePageTypes";
import withRoleBaseFetching from "@/utils/HomePageHOC";
import moment from "moment";
import { PopupContainer } from "./PopupContainer";

const AdminDashBox = ({amount, title, containerStyle }:{amount:number, title:string, containerStyle?:string}) =>{
    return (
        <div className={`flex flex-col items-center justify-center rounded-xl md:py-5 py-3 w-full ${containerStyle}`}>
            <p className="text-black md:text-lg text-md mb-5">{title}</p>
            <p className="text-[2rem] text-black font-medium text-center mb-2">{amount}</p>
        </div>
    );
}


const HomePage: React.FC<WrappedComponentProps> = ({
    data,
    modal,
    adminMode,
    currentPage,
    setCurrentPage,
    totalAccounts,
    totalPosts
}) =>{
    const [modModal, setModModal] = useState<ModalType>({
        type: "",
        show: false,
        id: 0,
    });

    const triggerModal = (type:ModModalType["type"], show:boolean, id:number) => {
        setModModal({type, show, id});
    }

    const triggerLogout = () => {
        localStorage.removeItem("token");
        window.location.href="/";
    }

    const  PaginationBox =() =>{
        const page = [];
        for(let i = 1; i <= data.totalPages; i++){
            page.push(i);
        }
        return (
            <div className="flex justify-center items-center gap-3">
                {page.map(page => (
                        <button 
                            key={page}
                            className={`text-sm ${currentPage === page ? "bg-primaryYellow":"bg-white"} text-black text-center px-3 py-2 rounded-lg`}
                            onClick={()=>setCurrentPage(page)}
                        >
                            {page}
                        </button>
        
                    ))}
            </div>
        )

    }

    if(!data.data) return <></>;

    return (
        <div className="flex flex-col items-center pt-8 mb-[10rem] w-full 2xl:max-w-[1380px] lg:max-w-[80%] md:max-w-[70%] h-full px-4">
            <div className=" flex items-center justify-between mb-6 w-full">
                <button
                    className="bg-primaryYellow text-black md:py-2 md:px-8 rounded-full py-1 px-3 text-sm"
                    onClick={() => triggerModal("add",true, 0)}
                >
                    Add New Post
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
                Post List
            </h4>
            {adminMode === true && (
                <div className="flex lg:gap-16 md:gap-10 sm:gap-8 gap-4 w-full md:mb-16 mb-6">
                    <AdminDashBox 
                        title={"Total Amount"} 
                        amount={totalAccounts ?? 0}
                        containerStyle="bg-tagColor"
                        />
                    <AdminDashBox 
                        title={"Total Posts"} 
                        amount={totalPosts ?? 0}
                        containerStyle="bg-red"
                        />   
                    <AdminDashBox 
                        title={"My Posts"} 
                        amount={data.totalPosts}
                        containerStyle="bg-primaryGreen"
                        />   
                </div>
            )}
            <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 w-full mb-16 gap-16">
                {data.data.map(item =>(
                    <div 
                        key={item.id}
                        className="bg-white rounded-2xl py-6 px-8 w-full h-auto"    
                    >   
                        <p className="text-primaryYellow text-sm mb-6">{moment(item.date).format("YYYY.MM.DD")}</p>
                        <h4 className="text-lg mb-6">{item.title}</h4>
                        <p className="max-h-[120px] text-base multiline-truncate mb-4" dangerouslySetInnerHTML={{ __html:item.body}}/>
                        <div className="flex items-center gap-2 mb-6">
                            {item.tags.map((tag,index) =>(
                                <div className="bg-tagColor rounded-full text-center px-2 py-1 flex text-[0.6rem] font-medium" key={index}>
                                    {tag}
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                className="2xl:mr-2 bg-primaryGreen px-5 py-1 rounded-full text-center text-sm"
                                onClick={()=>triggerModal("edit", true,item.id)}
                            >
                                Edit
                            </button>
                            <button 
                                className=" bg-primaryYellow px-5 py-1 rounded-full text-center text-sm"
                                onClick={()=> window.location.href = `/viewPost/${item.id}`
                            }   
                            >
                                View
                            </button>
                            <button 
                                className=" bg-warning px-5 py-1 rounded-full text-center text-sm"
                                onClick={()=>triggerModal("delete", true,item.id)}
                            >
                                Delete
                            </button>
                        </div>
                        {(modal.show || modModal.show) && data.data !== null && 
                        <PopupContainer
                            modModal={modModal}
                            modal={modal}
                            triggerModal={triggerModal}
                            data={data.data}
                        /> 
                        }
                    </div>
                ))}

            </div>
            {PaginationBox()}
            
        </div>
    );
}

export default withRoleBaseFetching(HomePage);