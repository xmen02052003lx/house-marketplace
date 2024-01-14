import { useLocation, useNavigate } from "react-router-dom"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import googleIcon from "../assets/svg/googleIcon.svg"

function OAuth() {
  const navigate = useNavigate()
  const location = useLocation()

  const onGoogleClick = async () => {
    try {
      // create a auth when deadling with auth
      //   those code (from line 16 to 18, from 'const auth = ...' to 'const result = ...') will authenticate (whether it's sign in or sing up) a user up with Google
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      //   getting the user from the Google sign in
      const user = result.user
      //   Put the user in the databse (firestore)
      //   get reference to the document | Why we need to reference to the doc? I dont understand (the answer is the belowed comment - to see if we have a reference to that document)
      // passing the user id to see if we have a reference to that document
      //   Check for user
      const docRef = doc(db, "users", user.uid)
      const docSnap = await getDoc(docRef)

      //   if user doesnt exist, create a user in the db
      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        })
      }
      navigate("/")
    } catch (error) {
      toast.error("Could not authorize with Google")
    }
    // const provider = new GoogleAuthProvider()
    // const auth = getAuth()
    // signInWithPopup(auth, provider)
    //   .then(result => {
    //     // This gives you a Google Access Token. You can use it to access the Google API.
    //     const credential = GoogleAuthProvider.credentialFromResult(result)
    //     const token = credential.accessToken
    //     // The signed-in user info.
    //     const user = result.user
    //     // IdP data available using getAdditionalUserInfo(result)
    //     // ...
    //   })
    //   .catch(error => {
    //     // Handle Errors here.
    //     const errorCode = error.code
    //     const errorMessage = error.message
    //     // The email of the user's account used.
    //     const email = error.customData.email
    //     // The AuthCredential type that was used.
    //     const credential = GoogleAuthProvider.credentialFromError(error)
    //     // ...
    //   })
  }

  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === "/sign-up" ? "up" : "in"} with</p>
      <button className="socialIconDiv" onClick={onGoogleClick}>
        <img className="socialIconImg" src={googleIcon} alt="google" />
      </button>
    </div>
  )
}
export default OAuth
