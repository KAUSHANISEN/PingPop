import {Routes , Route, Navigate } from "react-router-dom"
import Login from "./loginpage"
import Chat from "./chatpage"
import Profile from "./profilepage"

const RouteHandler= () => {
    return(
        
            <Routes>
                <Route path="/" element={ <Navigate to = "/home"/> }></Route>
                <Route path="/login" element={<Login/>}></Route>
                <Route path="/home" element={<Chat/>}></Route>
                <Route path="/profile" element={<Profile/>}></Route>
            
            </Routes>
            
        
    )
}

export default RouteHandler;