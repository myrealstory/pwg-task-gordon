import { ViewPostContainer } from "@/components/ViewPostContainer";


export default async function ViewPostPage({params}:{params:{id:string}}){

    const slugId = params.id;

    return (
        <ViewPostContainer id={slugId}/>
    );

}