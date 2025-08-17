import { useState } from "react";
import { AppContext } from "../context/appcontext";
import { useContext, useEffect } from "react";
import { doc,getDoc,updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate()
  const [image, setImage] = useState(null);
  const [bio , setBio] = useState("")
  const { userData, userId, ImageUrl, setImageUrl } = useContext(AppContext);


  useEffect(() => {
    if(ImageUrl === ""){
      setImageUrl(userData?.avatar)
    }
  }, []);


async function changeUserImage(userId, ImageUrl) {
  const userRef = doc(db, "Users", userId);
  await updateDoc(userRef, {
    avatar: ImageUrl,
  });

}


  async function uploadImage(formData) {
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
    setImageUrl(finalRes?.data?.url)
    changeUserImage(userId,finalRes?.data?.url)
  }

  useEffect(() => {
    // const docRef = doc(db,Users?.Username)
    // const docSnap = getDoc(docRef)
    // if (docSnap.data().bio){
    //   setBio(docSnap.data().bio)
    // }
    if (image!==null) {
      const formData = new FormData();
      formData.append("image", image);
      uploadImage(formData);
      
    }
    // else{navigate("/login")}
  }, [image]);

  return (
    <div className="profile">
      <div className="profile-container nunitofont">
        <img src="pingPop_logo.png" alt="PingPop" className="profile-logo" />
        <div className="profile-card nunitofont">
          <h3>Profile Details </h3>
          <label htmlFor="avatar">
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={ImageUrl ? ImageUrl : "user.png"}
              alt=""
              className="profile-avatar"
            />
            Upload Profile Image
          </label>
          <input type="text" placeholder={userData?.Username} required />
          <textarea placeholder={userData?.bio} onChange={(e)=> setBio(e.target.bio)} value={bio}></textarea>
          <button type="submit" onClick={() => navigate("/home")}> Save </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
