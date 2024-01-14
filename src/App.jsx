import { BrowserRouter, Routes, Route } from "react-router-dom"
import Explore from "./pages/Explore"
import Offers from "./pages/Offers"
import Category from "./pages/Category"
import Profile from "./pages/Profile"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Listing from "./pages/Listing"
import PrivateRoute from "./components/PrivateRoute"
import ForgotPassword from "./pages/ForgotPassword"
import CreateListing from "./pages/CreateListing"
import Contact from "./pages/Contact"
import Navbar from "./components/Navbar"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route
            path="/category/:categoryName/:listingId"
            element={<Listing />}
          />
          <Route path="/contact/:landlordId" element={<Contact />} />
        </Routes>
        <Navbar />
      </BrowserRouter>
      <ToastContainer />
    </>
  )
}

export default App
