/* disble eslint */
import { useEffect, useState } from "react"
import moment from 'moment'

function Comment({comment}) {
    const[user,setUser]=useState({})
    console.log(user)
    useEffect(()=>{
    const getUser=async()=>{
        try{
            const res=await fetch(`/api/user/${comment.userId}`);
            const data=await res.json()
            console.log(data)
            if(res.ok){
                setUser(data)
            }

        } catch(error){
         console.log(error)
        }
    }

    getUser()


    },[comment])

    
 

    return (
       
        <div className="flex  border-b dark:border-gray-600 text-sm p-4">
          <div className=" ">
         <img className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 mr-3" src={  user.user?.profilePicture  } alt="" />
          </div>

          <div className=" flex-1">
           <div className=" flex items-center mb-1">
            <span className="font-bold mr-1 text-xs truncate">{user? `@${user.user?.username}`:"anonymous user"}</span>
            <span className="text-gray-500  text-xs">{moment(comment.createdAt).fromNow()}</span>
           </div>
           <p className="text-gray-500 mb-2">{comment.content}</p>
          </div>
        </div>
    )
}

export default Comment