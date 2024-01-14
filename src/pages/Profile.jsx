import { getAuth, updateProfile } from "firebase/auth"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  getDoc,
} from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg"
import homeIcon from "../assets/svg/homeIcon.svg"
import ListingItem from "../components/ListingItem"

function Profile() {
  const auth = getAuth()
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })

  const { name, email } = formData

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings")
      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      )

      const querySnapshot = await getDocs(q)

      const listings = []

      querySnapshot.forEach(doc => {
        return listings.push({ id: doc.id, data: doc.data() })
      })

      setListings(listings)
      setLoading(false)
    }

    fetchUserListings()
  }, [auth.currentUser.uid])

  const onLogout = () => {
    auth.signOut()
    navigate("/")
  }

  const onSubmit = async () => {
    try {
      // update in auth
      if (auth.currentUser.displayName !== name) {
        // update display name in fb
        await updateProfile(auth.currentUser, {
          displayName: name,
        })
        // why update in firestore??? i dont understand! i think update in auth with updateProfile is suffice -> answered in note.txt
        // update in firestore
        //because the id in firestore is the same as the id in the authentication
        const userRef = doc(db, "users", auth.currentUser.uid)
        // Set the "users" field of the uid
        await updateDoc(userRef, {
          name,
        })
      }

      toast.success("Profile updated")
    } catch (error) {
      console.log(error)
      toast.error("Could not update profile details")
    }
  }

  const onChange = e => {
    setFormData(prevState =>
      // because we want to return an object so we wrap it around parentheses like this, otherwist it will execute the code
      ({ ...prevState, [e.target.id]: e.target.value })
    )
  }

  const onDelete = async listingId => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "listings", listingId))
      // update the UI immediately (if we omit these code below, we have to reload the page to see the updated listing)
      const updatedListings = listings.filter(
        listing => listing.id !== listingId
      )
      setListings(updatedListings)
      toast.success("Successfully deleted listing")
    }
  }
  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button className="logOut" onClick={onLogout}>
          Logout
        </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              changeDetails && onSubmit()
              setChangeDetails(prevState => !prevState)
            }}
          >
            {changeDetails ? "done" : "change"}
          </p>
        </div>

        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? "profileName" : "profileNameActive"}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type="text"
              id="email"
              className="profileEmail"
              disabled
              value={email}
              onChange={onChange}
            />
          </form>
        </div>

        <Link to="/create-listing" className="createListing">
          <img src={homeIcon} alt="home" /> <p>Sell or rent your home</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>

        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">Your Listings</p>
            <ul className="listingsList">
              {listings.map(listing => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}
export default Profile
