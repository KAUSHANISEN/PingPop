import { doc, getDocs,getDoc, onSnapshot, updateDoc,collection,query,orderBy } from "firebase/firestore";
import { createContext, useEffect, useState } from "react"
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const navigate = useNavigate();
    const [userId, setUserId] = useState(localStorage.getItem("token") || null);
    const [userData, setuserData] = useState(null);
    const [chatData,setchatData] = useState(null); 
    const  [ImageUrl,setImageUrl] = useState("")
    const [readDatabase, setreadDatabase] = useState([]); //possible user data fetched
    const  [MessageDB,setMessageDB] = useState([]) // possible message
    const  [reload,setReload] = useState(false)

    useEffect(()=> {
        const user = localStorage.getItem("token")
        setUserId(user) 
    },[])

    
    const loadUserData = async (userId) => {
        try{
            const userRef = doc(db,'Users',userId);
            const userSnap =  await getDoc(userRef);
            const userData = userSnap.data()
           
          const q = query(collection(db,"Messages"),orderBy("createdAt","desc"))
          const Getallmessages = await getDocs(q)
           setMessageDB(Getallmessages?.docs);
            setuserData(userData);
            if(userData?.avatar!=="" && userData?.Username){
                navigate("/home")
            setImageUrl(userData?.avatar );
             setInterval(async() => {  
            await updateDoc(userRef,{
                lastSeen: Date.now()
            })
           
            
            }, 60000);
            }
            else{
                navigate("/profile")
            }
            
            
        } catch(error){
            console.log(error)
        }
    }

   
     const value ={
     userData, setuserData,
     chatData,setchatData,
     userId, setUserId,
     loadUserData,ImageUrl,setImageUrl,readDatabase,setreadDatabase,MessageDB,setMessageDB,reload,setReload
     }
 
     return(
       <AppContext.Provider value={value}>
        {props.children}
       </AppContext.Provider>
     )
     
}

export default AppContextProvider; 