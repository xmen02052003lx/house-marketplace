import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import Spinner from "../components/Spinner"
import ListingItem from "../components/ListingItem"

function Category() {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)

  const params = useParams()

  //   we cant add async function as the 1st parameter in useEffect
  useEffect(() => {
    const fetchListings = async () => {
      try {
        // get reference to the collection (not to the document)
        const listingsRef = collection(db, "listings")
        // create a query, set a query, we have not executed it yet
        const q = query(
          listingsRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(10)
        )
        // execute the query
        const querySnapshot = await getDocs(q)

        const listings = []

        querySnapshot.forEach(doc =>
          listings.push({
            id: doc.id,
            data: doc.data(),
          })
        )

        setListings(listings)
        setLoading(false)
      } catch (error) {
        toast.error("Could not fetch listings")
      }
    }

    fetchListings()
  }, [])
  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === "rent"
            ? "Places for rent"
            : "Places for sale"}
        </p>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map(listing => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p>No listings for {params.categoryName}</p>
      )}
    </div>
  )
}
export default Category
