import { Send, Search, Info, Image, UserPen, X } from "lucide-react";
import { useState,useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import { useContext } from "react";
import { AppContext } from "../context/appcontext";
import { addDoc,collection ,serverTimestamp} from "firebase/firestore";
import { db } from "../config/firebase";

const Chat = () => {
  const [seeDropDown, setseeDropDown] = useState(false);
  const  navigate = useNavigate()
  const [isLoggedIn,setLoggedIn] = useState(false)
  const {ImageUrl,readDatabase,userData,MessageDB,userId,setReload} = useContext(AppContext) 
  const  [selectedUser,setselectedUser] = useState(null)  
  const  [userMessage,setuserMessage] = useState("")
  const [HoldingImage,setHoldingImage] = useState("")
  const  [SearchUser,setSearchUser] = useState("")


  // const InputDiv = useRef(null)

   useEffect(()=>{
    const temp = localStorage.getItem("token")
    if(temp){
     setLoggedIn(true)
    }
   },[])


  const handleClick = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token")
      navigate("/login")
    }
  };

//user message send logic

async function SendUserMessage() {
 if(userMessage.length>0){
  
  const res = await addDoc(collection(db,"Messages"),{
    receiverID: selectedUser,
    senderID:userId,
    message:userMessage,
    createdAt: serverTimestamp()
  }) 

  if(res){
 
    setReload(true)
    setuserMessage("")
    InputDiv.current.target.value = ""

  }

 }
 if(HoldingImage?.length>0){
   const res = await addDoc(collection(db, "Messages"), {
     receiverID: selectedUser,
     senderID: userId,
     ImageUrlMessage: HoldingImage,
     createdAt: serverTimestamp(),
   }); 
   if (res) {
     setReload(true);
     setHoldingImage("");
   }
 }
  
}
//logic image upload
async function AddChatImage(senderImageUrl){
   const formData = new FormData();
   formData.append("image", senderImageUrl);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_IMAGE_API_KEY
      }`,
      {
        method: "POST",
        body: formData,
      }
    );

    const finalRes = await res.json();
    setHoldingImage(finalRes?.data?.url);
}

  //thunder bolt code
if(isLoggedIn){
  return (
    <div className="chat-bg">
      <div className="chat-main-container">
        <div className="left-chat-container">
          <div
            className="left-chat-div-top nunitofont"
            style={{ position: "relative" }}
          >
            <div className="left-chat-logo-div">
              <img
                className="left-chat-logo"
                src="pingPop_logo.png"
                alt="logo"
              />{" "}
            </div>
            <button
              className="left-chat-profile-btn"
              onClick={() => {
                seeDropDown ? setseeDropDown(false) : setseeDropDown(true);
              }}
            >
              <UserPen size={35} strokeWidth={1.5} />
            </button>
            {seeDropDown ? (
              <div
                className="drop-down"
                style={{ position: "absolute", top: 70, right: 5, zIndex: 2 }}
              >
                {" "}
                <button
                  className="drop-down-btn nunitofont"
                  onClick={() => {
                    navigate("/profile");
                  }}
                >
                  {" "}
                  Edit Profile{" "}
                </button>{" "}
              </div>
            ) : (
              <div></div>
            )}
            <div className="left-profile-div"></div>
          </div>

          <div className="left-chat-div-search nunitofont">
            <input
              type="text"
              placeholder="Search here..."
              className="left-chat-input"
              onChange={(e) => setSearchUser(e.target.value)}
            />
            <button className="left-chat-search-btn">
              {" "}
              <Search />{" "}
            </button>
          </div>

          <div className="left-chat-div-list nunitofont">
            {readDatabase?.docs
              ?.filter((items) => items?.data()?.Username?.includes(SearchUser))
              ?.map((item, index) =>
                item?.id !== userId ? (
                  <button
                    className="left-chat-user-div nunitofont"
                    key={item?.id}
                    value={item?.id}
                    onClick={() => {
                      setselectedUser(item?.id);
                    }}
                  >
                    <div className="left-chat-list-img-div">
                      <img
                        src={
                          item?.data()?.avatar !== ""
                            ? item?.data()?.avatar
                            : "user.png"
                        }
                        className="left-chat-list-img"
                      />
                    </div>
                    <div className="left-chat-list-text-div">
                      <div className="left-chat-list-name">
                        {" "}
                        <p> {item?.data()?.Username} </p>
                      </div>
                      <div className="left-chat-list-msg">
                        {" "}
                      </div>
                    </div>
                  </button>
                ) : null
              )}
          </div>
        </div>
        {selectedUser ? (
          <div className="middle-chat-container nunitofont">
            <div className="middle-navbar nunitofont">
              <img
                src={
                  readDatabase?.docs
                    ?.find((items) => items?.id === selectedUser)
                    ?.data()?.avatar
                    ? readDatabase?.docs
                        ?.find((items) => items?.id === selectedUser)
                        ?.data()?.avatar
                    : "user.png"
                }
                className="middle-navbar-pic"
              />
              <p className="middle-navbar-name">
                {readDatabase?.docs?.map((items) => {
                  if (items?.id === selectedUser) {
                    return items?.data()?.Username;
                  }
                })}{" "}
              </p>
            </div>

            <div className="chat-main-div">
              <div className="floating-input-container">
                <input
                  className="floating-input nunitofont"
                  type="text"
                  placeholder="Type something..."
                  onChange={(e) => setuserMessage(e.target.value)}
                  value={userMessage}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      SendUserMessage();
                    }
                  }}
                  // ref={InputDiv}
                />
                <label htmlFor="imageUpload" className="floating-input-img">
                  {" "}
                  <Image />{" "}
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={(e) => AddChatImage(e.target.files[0])}
                  hidden
                />
                <button
                  className="floating-send-btn"
                  onClick={() => {
                    SendUserMessage();
                  }}
                >
                  <Send />
                </button>
              </div>

              {MessageDB.map((item, index) =>
                (item?.data()?.senderID === selectedUser &&
                  item?.data()?.receiverID === userId) ||
                (item?.data()?.senderID === userId &&
                  item?.data()?.receiverID === selectedUser) ? (
                  <div
                    className={
                      item?.data()?.senderID === userId
                        ? "sender-msg-div"
                        : "receiver-msg-div"
                    }
                    key={index}
                  >
                    <p
                      className={
                        item?.data()?.senderID === userId
                          ? "sender-msg"
                          : "receiver-msg"
                      }
                    >
                      {item?.data()?.message ? (
                        item?.data()?.message
                      ) : (
                        <img
                          className="chat-image"
                          src={item?.data()?.ImageUrlMessage}
                        />
                      )}
                    </p>
                    <div className="main-info">
                      <img
                        src={
                          item?.data()?.senderID === userId
                            ? ImageUrl
                            : readDatabase?.docs
                                ?.find((items) => items?.id === selectedUser)
                                ?.data()?.avatar || "/default-avatar.png"
                        }
                        className="r-pic"
                      />
                      <div>
                        {item
                          ?.data()
                          ?.createdAt?.toDate()
                          .toLocaleString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                      </div>
                    </div>
                  </div>
                ) : null
              )}
              {HoldingImage ? (
                <div className="image-upload-div">
                  <div className="image-upload-div-inside">
                    <img
                      src={HoldingImage}
                      style={{ height: "90%", width: "70%" }}
                    ></img>
                    <button
                      style={{
                        position: "absolute",
                        right: 5,
                        top: 5,
                        borderRadius: 40,
                      }}
                      onClick={() => {
                        setHoldingImage("");
                      }}
                    >
                      {" "}
                      <X />{" "}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="middle-chat-container-default nunitofont">
            <img src="pingPop_logo.png" />
            <p> Welcome to PingPop! </p>
          </div>
        )}

        <div className="right-chat-container">
          <div className="profile-div nunitofont">
            <img
              src={ImageUrl ? ImageUrl : "user.png"}
              className="profile-pic"
            />
            <h2> {userData?.Username} </h2>
            <h3 className="profile-bio"> Hey there! I'm using PingPop. </h3>
          </div>
          <hr />
          <div className="media-div nunitofont">
            <h2> Media </h2>
            <div className="media-pics">
              {MessageDB?.map((items) =>
                items?.data()?.senderID === userId &&
                items?.data()?.ImageUrlMessage &&
                items?.data()?.receiverID === selectedUser ? (
                  <img src={items?.data()?.ImageUrlMessage} />
                ) : null
              )}
            </div>
          </div>
          <button onClick={handleClick} className="logout-btn nunitofont">
            {" "}
            Logout{" "}
          </button>
        </div>
      </div>
    </div>
  );
}

return (
  <div style={{height:"100vh",width:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}>   <OrbitProgress color="#33b2d1" size="medium" text="" textColor="" /> </div>
)

};

export default Chat;
