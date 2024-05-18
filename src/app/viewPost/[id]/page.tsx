
import { ViewPostContainer } from "@/components/ViewPostContainer";

export async function generateStaticParams(){
    return [{id: "1"}];
}

export default async function ViewPostPage({params}:{params:{id:string}}) {
    const id = params.id;
    return (
        <ViewPostContainer id={id}/>
    );
}

