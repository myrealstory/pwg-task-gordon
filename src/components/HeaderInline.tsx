
export const HeaderInline = ({labelName}:{labelName: string}) =>{
    return (
        <div>
            <label htmlFor={labelName} className="text-black text-md mb-2">
                {labelName}
            </label>
        </div>
    )
}
