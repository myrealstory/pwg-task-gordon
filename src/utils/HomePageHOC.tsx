import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosPost";
import axiosAccounts from "@/lib/axiosAccounts";
import { jwtDecode } from "jwt-decode";
import { DecodedToken, IndexDataType, ModalType, WrappedComponentProps } from "@/types/HomePageTypes";

const withRoleBaseFetching = (WrappedComponent: React.FC<WrappedComponentProps>) =>{
    const RoleBasedComponent: React.FC =() =>{
        const [data , setData] = useState<IndexDataType | null>(null);
        const [modal, setModal] = useState<ModalType>({
            type: "",
            show: false,
            message: "",
        });
        const [currentPage, setCurrentPage] = useState(1);
        const [adminMode, setAdminMode] = useState(false);
        const [totalAccounts, setTotalAccounts] = useState(0);
        const [totalPosts, setTotalPosts] = useState(0);

        useEffect(()=>{

            // const fetchStoryData = async ()=>{
            //     const token = localStorage.getItem("token");

            //     if(!token){
            //         setModal({type: "error", show: true, message: "Login was Error, Please login again"});
            //         return;
            //     }

            //     try {
            //         const decodedToken = jwtDecode<DecodedToken>(token);
                    
            //         const response= await axiosInstance({
            //             method: "POST",
            //             url: "/mypost",
            //             data:{
            //                 page: currentPage,
            //                 limit:10,
            //             }
            //         });

            //         if(decodedToken.role === "admin"){
            //             const accountResponse = await axiosAccounts.get("/");
            //             const adminResponse = await axiosInstance({
            //                 method: "GET",
            //                 url: "/",
            //                 data:{
            //                     page: currentPage,
            //                     limit:10,
            //                 }
            //             });
            //             setTotalAccounts(accountResponse.data.accounts.length);
            //             setTotalPosts(adminResponse.data.totalPosts);
            //             setAdminMode(true);
            //         }

            //         setData({...response.data, role: decodedToken.role ? decodedToken.role:"user"});

            //     }catch(error){
            //         setModal({type: "error", show: true, message: "Login was Error, Please login again"});
            //     }
            // }
            const fetchStoryData = async()=>{
                const token = localStorage.getItem("token");

                if(!token) {
                    setModal({
                        type: "error",
                        show: true,
                        message: "Login was Error, Please login again"
                    });
                    return;
                }

                try {
                    const decodedToken = jwtDecode<DecodedToken>(token);

                    const myPostPromise = axiosInstance({
                        method: "POST",
                        url: "/mypost",
                        data:{
                            page: currentPage,
                            limit:10,
                        }
                    });

                    if(decodedToken.role === "admin"){
                        // If the user is an admin, fetch the total number of accounts and total number of posts

                        const [accountResponse, adminResponse] = await Promise.all([
                            axiosAccounts.get("/"),
                            axiosInstance({
                                method: "GET",
                                url: "/",
                                data:{
                                    page: currentPage,
                                    limit:10,
                                }
                            })
                        ]);

                            const myPostResponse = await myPostPromise;
                            setTotalAccounts(accountResponse.data.accounts.length);
                            setTotalPosts(adminResponse.data.totalPosts);
                            setAdminMode(true);

                            setData({...myPostResponse.data, role: decodedToken.role ? decodedToken.role:"user"});
                    }else {
                        const myPostResponse = await myPostPromise;
                        setData({...myPostResponse.data, role: decodedToken.role ? decodedToken.role:"user"});
                    
                    }
                } catch (error) {
                    setModal({
                        type: "error",
                        show: true,
                        message: "Login was Error, Please login again"
                    });
                }
            };
            fetchStoryData();

        },[currentPage,adminMode]);


        if(!data){
            return <></>;
        }

        return (
            <WrappedComponent
                data={data}
                modal={modal}
                adminMode={adminMode}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalAccounts={totalAccounts}
                totalPosts={totalPosts}
            />
        );
    }
    return RoleBasedComponent;
}

export default withRoleBaseFetching;