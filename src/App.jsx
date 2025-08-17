
import RouteHandler from './pages/routehandling';
import { db } from './config/firebase';
import { collection, addDoc, getDocs, setDoc } from "firebase/firestore";
import  {useState,useEffect, useContext} from "react"
import { useNavigate } from "react-router-dom";
import { User } from 'lucide-react';
import { AppContext } from './context/appcontext';


const ComponentName = () => {

  const navigate = useNavigate()
  
  const {loadUserData,userId,readDatabase,setreadDatabase,reload,setReload} = useContext(AppContext);
 

async function GetDB() {
  await getDocs(collection(db, "Users")).then((items) => {
    setreadDatabase(items);
  });
}

useEffect(() => {
  GetDB();
}, []);


async function dataLoad() {
  await loadUserData(userId)
}


useEffect(()=>{

     const findUser = readDatabase?.docs?.find(
       (items) => items?.id === userId
     );
 if(findUser){
  dataLoad()
  return navigate("/home")
  
 }
 return navigate("/login")
},[readDatabase])

useEffect(()=>{
  if(reload){
     dataLoad()
     setReload(false)
  }
},[reload])
  


  return (
    <div className='main-container'>
    <RouteHandler/> 
    </div>
  );
};

export default ComponentName;


