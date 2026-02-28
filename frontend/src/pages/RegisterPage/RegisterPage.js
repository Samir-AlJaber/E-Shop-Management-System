import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./RegisterPage.css";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer"
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/auth_register.php`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      }
    );

    const data = await response.json();

    if (data.success) {
      setMessage("Registration successful");
      setIsSuccess(true);
    } else {
      setMessage(data.message || "Registration failed");
      setIsSuccess(false);
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar />

      <div className="content-wrapper">
        <div className="register-wrapper">
          <div className="register-card">
            <h2>Create Account</h2>

            {message && (
              <div className={isSuccess ? "success-msg" : "error-msg"}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <select name="role" onChange={handleChange}>
                  <option value="customer">Customer</option>
                  <option value="salesman">Salesman</option>
                  <option value="owner">Owner</option>
                </select>
              </div>

              <button type="submit">Register</button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default RegisterPage;