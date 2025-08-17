import Iridescence from "../components/loginbg";
import SplitText from "../components/logintext";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { db } from "../config/firebase";
import { collection, addDoc, getDocs, setDoc } from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();
  const [showLoginCard, setShowLoginCard] = useState(false);
  const [showSignupCard, setShowSignupCard] = useState(false);

  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [readDatabase,setreadDatabase]= useState([])


async function GetDB() {
  await getDocs(collection(db, "Users")).then((items)=>{
   
    setreadDatabase(items)})

}
  
  useEffect(() => {
  GetDB()
  } , [])



  const signUpUserHandler = async () => {
    if (Username.length < 3) {
      toast("Username is less than 3 digits");
      return;
    }
    if (
      !Email.includes("@gmail.com") &&
      !Email.includes("@mail.com") &&
      !Email.includes("@yahoo.com")&&
      !Email.includes(".com")&&
      !Email.includes("@")
    ) {
      toast("Email is not valid");
      return;
    }
    if (Password.length < 8) {
      toast("length too short");
      return;
    }

    const existingUser = readDatabase?.docs?.find(
      (items) => items?.data()?.UserEmail === Email
    );
 
    //true or false
    if (existingUser) {
      toast("User Exists");
      return;
    }

    const docRef = await addDoc(collection(db, "Users"), {
      Username: Username,
      UserEmail: Email,
      Password: Password,
      avatar : "",
      bio : "Hey there! I'm using PingPop."
    });

    toast.success("User Succesfully Registered");
    setTimeout(() => {
      setShowLoginCard(true);
    }, 1500);
  };

                    
  
 const loginUserHandler = async () => {
   const findUser = readDatabase?.docs?.find((items)=> items?.data()?.UserEmail === Email )

   if(!findUser){
    toast.error("Wrong E-Mail or Password");
    return;
   }
   toast.success("User Logged-in successfully")
   localStorage.setItem("token",findUser?.id)
   setTimeout(() => {
    window.location.reload()
    navigate("/home")},1000)
 }




  const handleLoginClick = () => {
    setShowLoginCard(true);
  };

  const handleloginClose = () => {
    setShowLoginCard(false);
  };

  const handleSignupClick = () => {
    setShowSignupCard(true);
  };

  const handlesignupClose = () => {
    setShowSignupCard(false);
  };

  return (
    <>
      <ToastContainer />
      <div className="login-bg">
        <Iridescence
          color={[1, 1, 1]}
          mouseReact={false}
          amplitude={0.1}
          speed={1.0}
        />
      </div>

      <div className="glass-bg">
        <div className="login-logo-div">
          <img className="login-logo" src="pingPop_logo.png" alt="Ping-Pop" />
        </div>
        <div className="login-big-text nunitofont">
          <SplitText
            text="Every Ping deserves a POP!"
            className="text-2xl font-semibold text-center"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
        </div>
        <div className="login-sub-text nunitofont">
          {" "}
          “For every ‘hey’, ‘brb’, and 3am overshare — we got you.”{" "}
        </div>
        <div>
          <div className="login-button-div">
            <button
              className="login-button nunitofont"
              onClick={handleLoginClick}
            >
              Log In
            </button>

            <button
              className="signup-button nunitofont"
              onClick={handleSignupClick}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {showLoginCard && (
        <div className="login-card-div nunitofont">
          <div className="left-login-div">
            {" "}
            <div className="login-card-form">
              <h3 className="login-heading"> Welcome Back!</h3>
              <p className="login-page-subheading">Login to your Account </p>
              {/* <input type="text" placeholder="Username" className='login-form-input' required /> */}
              <input
                type="email"
                placeholder="E-mail"
                className="login-form-input"
                required
                onChange={(e) => {
                  setEmail(e.target.value);}}
              />
              <input
                type="password"
                placeholder="Password"
                className="login-form-input"
                required
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
              />
              <div className="login-page-buttons-div">
                <button className="submit-button-login" onClick={() => {loginUserHandler()}}> Submit </button>
                <button
                  className="close-button-login"
                  onClick={handleloginClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
          <div className="right-login-div">
            <img
              src="/login-girl-pic.jpg"
              alt="Happy Chatting!"
              className="login-card-girl-pic"
            />
          </div>
        </div>
      )}

      {showSignupCard && (
        <div className="login-card-div nunitofont">
          <div className="left-login-div">
            {" "}
            <div className="login-card-form">
              <h3 className="login-heading"> Welcome to PingPop</h3>
              <p className="login-page-subheading">Sign-up to chat away! </p>
              <input
                type="text"
                placeholder="Username"
                className="login-form-input"
                required
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <input
                type="email"
                placeholder="E-mail"
                className="login-form-input"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <input
                type="password"
                placeholder="Password"
                className="login-form-input"
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <div className="login-page-buttons-div">
                <button
                  className="submit-button-login"
                  onClick={() => {
                    signUpUserHandler();
                  }}
                >
                  {" "}
                  Submit{" "}
                </button>
                <button
                  className="close-button-login"
                  onClick={handlesignupClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
          <div className="right-login-div">
            <img
              src="/signup-boy-pic.jpg"
              alt="Happy Chatting!"
              className="login-card-girl-pic"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
