
export interface StoryData {
    id: number;
    usedId: number;
    date: string;
    title: string;
    body: string;
    tags: string[];
}

export type IndexDataType = {
    data: StoryData[] | null ;
    page: number;
    limit: number;
    totalPages: number;
    totalPosts: number;
} & DecodedToken;

export type WrappedComponentProps = {
    data: IndexDataType ;
    modal: ModalType;
    adminMode: boolean;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalAccounts?: number;
    totalPosts?: number;
}

export type OuterModalType = {
    show: boolean;
    message?: string;
    id?: number;
} 

export type ModModalType = {
    type: "" | "add" | "edit" | "delete" | "error";
}
export type ModalType = OuterModalType & ModModalType;

export type DecodedToken = {
    role: string;
}

export type PopupContainerType ={
    modModal: ModalType;
    modal: ModalType;
    triggerModal: (type:ModModalType["type"], show:boolean, userId:number) => void;
    data: StoryData[];
}