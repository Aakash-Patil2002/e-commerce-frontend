import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { UserPlus } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [phoneNo, setPhoneNo] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("user"); // default role

  const [error, setError] = useState("");

  const { register, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");

      await register({
        name,
        email,
        password,
        phone_no: phoneNo,
        address,
        role,
      });

      // await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register");
    }
  };

  return (
    <div
      className="flex justify-center items-center"
      style={{ minHeight: "70vh" }}
    >
      <div
        className="glass-card animate-fade-in"
        style={{ padding: "40px", width: "100%", maxWidth: "400px" }}
      >
        <h2
          className="flex items-center gap-2 mb-4"
          style={{ fontSize: "1.8rem" }}
        >
          <UserPlus className="text-primary" /> Register
        </h2>

        {error && (
          <div
            style={{
              color: "var(--danger)",
              marginBottom: "16px",
              background: "rgba(239, 68, 68, 0.1)",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your full name"
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Your email address"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create a password"
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          {/* Address */}
          <div className="form-group">
            <label>Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
            />
          </div>

          {/* Role (Radio Buttons) */}
          <div className="form-group">
            <label>Role</label>

            <div style={{ display: "flex", gap: "15px", marginTop: "8px" }}>
              <label>
                <input
                  type="radio"
                  value="user"
                  checked={role === "user"}
                  onChange={(e) => setRole(e.target.value)}
                />
                User
              </label>

              <label>
                <input
                  type="radio"
                  value="admin"
                  checked={role === "admin"}
                  onChange={(e) => setRole(e.target.value)}
                />
                Admin
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4">
            Register
          </button>
        </form>

        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--primary)" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
