import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Map, User, Mail, Lock, Loader2 } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message ?? "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "var(--color-primary-bg)",
    borderColor: "var(--color-border)",
  };

  const handleFocus = (e) => (e.target.style.borderColor = "var(--color-accent-orange)");
  const handleBlur = (e) => (e.target.style.borderColor = "var(--color-border)");

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--color-primary-bg)" }}>
      <div className="w-full max-w-md">
        <div
          className="rounded-2xl p-8 border"
          style={{
            background: "var(--color-card-bg)",
            borderColor: "var(--color-border)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Map className="w-8 h-8 text-accent-orange" />
              <span className="text-2xl font-extrabold text-text-primary">Jatra</span>
            </div>
            <h1 className="text-xl font-bold text-text-primary mt-2">Create your account</h1>
            <p className="text-text-muted text-sm mt-1">Start planning your journey today</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                id="signup-name"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-text-primary placeholder:text-text-muted outline-none border transition-all duration-200"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                id="signup-email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-text-primary placeholder:text-text-muted outline-none border transition-all duration-200"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                id="signup-password"
                type="password"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-text-primary placeholder:text-text-muted outline-none border transition-all duration-200"
                style={inputStyle}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover-lift"
              style={{
                background: "linear-gradient(to right, var(--color-accent-orange), var(--color-accent-orange-light))",
                color: "var(--color-primary-bg)",
                boxShadow: "0 4px 15px rgba(249,115,22,0.3)",
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-accent-orange font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}