import React, { useState, useEffect } from 'react'
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom'
import Home from '../Components/Home/Home'
// import Login from '../Components/Login/Login'
import Registration from '../Components/Registration/Registration'
import { AppProvider } from '../Components/Context/Appcontext'
import Singlepage from '../Components/Singlepage/Singlepage'

const Routing = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        // console.log("storedUser: ", storedUser);
        if (storedUser) {
            setLoggedInUser(storedUser);
        }
    }, []);
    return (
        <AppProvider>
            <Router>
                <Routes>
                    {/* <Route path="/login" element={<Login />} /> */}
                    <Route path="/" element={loggedInUser ? <Navigate to="/home" /> : <Registration setLoggedInUser={setLoggedInUser} />} />
                    <Route path="/home" element={loggedInUser ? <Home loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} /> : <Navigate to="/" />} />
                    <Route path="/single/:id" element={loggedInUser ? <Singlepage /> : <Navigate to="/" />} />
                </Routes>
            </Router>
        </AppProvider>
    )
}

export default Routing