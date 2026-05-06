"use client"
import {NotificationDetails } from "@/lib/types"
import { Bell } from "lucide-react"
import { Button } from "../ui/button"
import { Popover,PopoverContent,PopoverTrigger } from "../ui/popover"
import { useState,useEffect } from "react"

interface props{
    userId: string
}

export default function NotificationBell({userId}:props) {
    const [notifications,setNotifcations] = useState<NotificationDetails[]>([])
    const [unReadCount,setUnreadCount] = useState(0)
    useEffect(()=>{
        const fetchNotifications =async () => {
            try {
                const res = await fetch(`/api/notification/${userId}`)
                const data = await res.json();
                setNotifcations(data.notifications)
                setUnreadCount(data.notifications.length)
            } catch (error) {
                console.error(error);
            }
        }
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000)
        return ()=> clearInterval(interval)
    },[userId])

    const markALLRead = async () => {
        await fetch(`/api/notification/${userId}`,
        {method: 'PATCH',
            headers:{
                'Content-Type': 'application/json',
            }
        }
        )
        setUnreadCount(0)
        setNotifcations([])
    }

    return(
        <Popover>
            <PopoverTrigger asChild>
                <Button className="relative">
                    <Bell/>
                    {unReadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unReadCount}
            </span>
          )}
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="flex flex-col gap-2">
                {
                    unReadCount>0 && (
                        <Button onClick={markALLRead} className="relative">Mark as Read</Button>
                    )
                }
                    <p className="font-bold">Notifications</p>
                    {
                        notifications.length === 0 && <p>No Notifications</p>

                    }
                    {
                        notifications.map(n=>(
                            <div key={n.id}>
                                <p>
                                    {n.actor.username}
                                    {n.type === 'LIKE'?'liked your post':'commented on your post'}
                                </p>
                                {n.post && <p>{n.post.title}</p>}
                            </div>
                        ))
                    }
                </div>
            </PopoverContent>
        </Popover>
    )
}

