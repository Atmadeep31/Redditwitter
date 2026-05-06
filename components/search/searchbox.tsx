"use client"

import { Search } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ChangeEvent, useState } from "react";
import { useRouter } from 'next/navigation';


const SearchBox = () => {
    const [query, setQuery] = useState("")
    const router = useRouter();
    const trimmer = (query:string)=>{
        const trimmedQuery = query.trim().toLowerCase();
        return trimmedQuery;
    }
    const handleChange = (e:ChangeEvent<HTMLTextAreaElement>)=>{
       // const trimmedQuery = trimmer(e.target.value)
        setQuery( trimmer(e.target.value));
    }
    return (
        <div>
            <div className=" flex flex-row flex-wrap max-w-xl">
                <Textarea 
                value={query}
                onChange={handleChange}
                placeholder="Search by tags" 
                className="w-64 "/>
                <Button onClick={()=>router.push(`/Search?query=${query}`)}><Search/></Button>
            </div>
       </div>
    )
}

export default SearchBox;