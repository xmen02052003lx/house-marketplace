import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"

function Contact() {
  const [message, setMessage] = useState("")
  const [landlord, setLandlord] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const params = useParams()

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, "users", params.landlordId)
      const docSnapshot = await getDoc(docRef)

      if (docSnapshot.exists()) {
        setLandlord(docSnapshot.data())
      } else {
        toast.error("Could not get landlord data")
      }
      console.log(searchParams.get("listingName"))
    }

    getLandlord()
  }, [params.landlordId])

  const onChange = e => setMessage(e.target.value)

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact Landlord</p>
      </header>

      {landlord !== null && (
        <main>
          <div className="contactLandlord">
            <p className="landlordName">Contact: {landlord?.name}</p>
          </div>

          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="messageLabel">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                className="textarea"
                value={message}
                onChange={onChange}
              ></textarea>
            </div>

            {/* i've missed the type="button" and it not worked anymore. Here is the reason:
When you remove the type="button" attribute from the <button> element, it defaults to type="submit". This behavior is important to understand when dealing with buttons inside a <form> element.

In your case, when the type attribute is set to "button," the button acts as a regular button without any default behavior associated with forms. Clicking the button triggers the link defined in the href attribute, and it opens the default email client with the specified email details.

However, when you remove the type="button" attribute or set it to type="submit", the button becomes a submit button by default. If it's placed inside a <form> element, clicking the button will trigger the form submission process. This involves sending an HTTP request to the server, causing a page reload or redirection, depending on how the form is configured.

To maintain the email functionality and avoid form submission, it's a good practice to explicitly set type="button" for buttons that should not trigger form submissions. */}
            <a
              href={`mailto:${landlord.email}?Subject=${searchParams.get(
                "listingName"
              )}&body=${message}`}
            >
              <button type="button" className="primaryButton">
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  )
}
export default Contact
