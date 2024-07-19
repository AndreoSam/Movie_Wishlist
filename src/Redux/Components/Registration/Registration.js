import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Registration.css"

function Registration({ setLoggedInUser }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleLogin = () => {
        if (email && email.includes('@')) {
            localStorage.setItem('user', email);
            setLoggedInUser(email);
            navigate('/home');
        } else {
            // alert("Please enter a valid email address.");
            setError(true);
        }
    };

    return (
        <div className="reg_main">
            <div className="reg_main_2">
                <h2>Login</h2>
                <div className="reg_main_3">
                    {error && <p style={{ color: "red" }}>**Please enter a valid email address.</p>}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                    <button onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>
    );
}

export default Registration;
