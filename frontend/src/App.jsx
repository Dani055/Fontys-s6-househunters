import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import MainPage from './pages/MainPage/MainPage';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import Login from './pages/Login/Login'
import RegisterPage from './pages/RegisterPage/RegisterPage';
import CreateListing from './pages/CreateListing/CreateListing';
import EditListing from './pages/EditListing/EditListing';
import ListingDetails from './pages/ListingDetails/ListingDetails';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import { toast } from 'react-toastify';
import { useEffect, useContext, useState } from 'react';
import { checkLoginKey } from './service/userService';
import { UserContext } from './UserProvider';
import Protected from './components/Protected/Protected';
import NotFound from './pages/NotFound/NotFound';
import ListingResults from './pages/ListingResults/ListingResults';

function App() {
  const { loggedUser, setLoggedUser } = useContext(UserContext);
  const [isBusy, setIsBusy] = useState(true);

  useEffect(() => {
    async function getUser() {
      const token = window.sessionStorage.getItem("tkn");
      if (token !== null) {
        try {
          const res = await checkLoginKey();
          setLoggedUser(res.user);
        } catch (err) {
          toast.error(err);
          window.sessionStorage.removeItem("tkn");
          setLoggedUser(null);
          setIsBusy(false);
        }
      }
      setIsBusy(false)
    }
    getUser();

  }, [])
  return (
    <div className="App">
      {!isBusy && <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/results" element={<ListingResults />} />
          <Route path="/login" element={<Login />} />

          <Route path="/profile/:username" element={
            <Protected loggedUser={loggedUser}>
              <ProfilePage />
            </Protected>
          } />
          <Route path="/profile" element={
            <Protected loggedUser={loggedUser}>
              <ProfilePage />
            </Protected>
          } />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/listing/create" element={
            <CreateListing />
          } />

          <Route path="/listing/edit/:listingId" element={
            <Protected loggedUser={loggedUser}>
              <EditListing />
            </Protected>
          } />
          <Route path="/listing/details/:listingId" element={<ListingDetails />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
      }
      <ToastContainer hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default App;
