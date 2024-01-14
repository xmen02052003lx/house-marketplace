import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg"
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth"
import { db } from "../firebase.config"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
// because we gonna use this for the img src, so we dont need to do the 'ReactComponent' like above
import visibilityIcon from "../assets/svg/visibilityIcon.svg"
import OAuth from "../components/OAuth"

function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const { name, email, password } = formData
  const navigate = useNavigate()

  const onChange = e => {
    setFormData(prevState => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onSubmit = async e => {
    e.preventDefault()

    try {
      // get auth value
      const auth = getAuth()
      // creating a user with createUserWithEmailAndPassword (this function returns a Promise)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      // get the actual user info (we gonna need this for the database)
      const user = userCredential.user
      // updating the display name
      updateProfile(auth.currentUser, {
        displayName: name,
      })

      // i dont want to modify the original formData so i copy it
      const formDataCopy = { ...formData }
      // this will delete password from the formDataCopy object, because i dont want to store the password in database
      // You don't need to store a password as authenticating a user is handled by Firebase Auth and is a separate part of Firebase to the Firestore. Firestore is where you store your data, that is your database and the Firebase Auth handles everything to do with user sessions, sign up, log in and authentication.
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()

      // setDoc will update the database and add our user to the users collection
      // the 'user.uid' just like the primary key
      //  We are only using the Firestore for a database, nothing else. Firebase Auth is only for authentication.
      // We need a users collection in our Firestore to be able to link listing creation with a user, which you can't really do with Auth.
      // So each listing document has a reference to a specific user in the users collection.
      await setDoc(doc(db, "users", user.uid), formDataCopy)
      // redirected
      navigate("/")
    } catch (error) {
      toast.error("Something went wrong with registration")
    }
  }

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>

        <main>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              className="nameInput"
              placeholder="Name"
              id="name"
              value={name}
              onChange={onChange}
            />{" "}
            <input
              type="email"
              className="emailInput"
              placeholder="Email"
              id="email"
              value={email}
              onChange={onChange}
            />
            <div className="passwordInputDiv">
              <input
                type={showPassword ? "text" : "password"}
                className="passwordInput"
                placeholder="Password"
                id="password"
                value={password}
                onChange={onChange}
              />
              <img
                src={visibilityIcon}
                alt="show password"
                className="showPassword"
                onClick={() => setShowPassword(prevState => !prevState)}
              />
            </div>
            <Link to="/forgot-password" className="forgotPasswordLink">
              Forgot Password
            </Link>
            <div className="signUpBar">
              <p className="signUpText">Sign Up</p>
              <button className="signUpButton">
                <ArrowRightIcon fill="#fff" width="34px" height="34px" />
              </button>
            </div>
          </form>
          <OAuth />
          <Link to="/sign-in" className="registerLink">
            Sign In
          </Link>
        </main>
      </div>
    </>
  )
}
export default SignUp
