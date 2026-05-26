import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const foodBgStyle: React.CSSProperties = {
  backgroundImage: `
    linear-gradient(135deg, rgba(240,255,240,0.82) 0%, rgba(220,245,220,0.70) 40%, rgba(200,235,200,0.60) 100%),
    url("https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80")
  `,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

export default function Auth() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginWithEmail, signupWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) return setError("Please fill in all fields.");
    if (tab === "signup" && password !== confirmPassword)
      return setError("Passwords do not match.");
    setLoading(true);
    try {
      if (tab === "signin") {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(email, password);
      }
      navigate("/");
    } catch (e: any) {
      const msg = e?.message || "Something went wrong.";
      setError(
        msg.includes("user-not-found") || msg.includes("wrong-password")
          ? "Invalid email or password."
          : msg.includes("email-already-in-use")
          ? "Email already in use."
          : msg.includes("weak-password")
          ? "Password must be at least 6 characters."
          : "Authentication failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate("/");
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={foodBgStyle}>
      {/* ── LEFT PANEL ── */}
      <div className="flex-1 flex flex-col justify-center px-12 py-16 max-w-2xl">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/40 bg-white/50 backdrop-blur-sm w-fit mb-10"
        >
          <span className="text-green-600 text-sm">🍃</span>
          <span className="text-green-700 text-sm font-semibold tracking-wide">
            AI-Powered Nutrition Coach
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl font-black leading-tight text-gray-900 mb-6"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Scan, Analyze &{" "}
          <span className="text-green-500">Track</span>{" "}
          Your Meals
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-600 text-lg leading-relaxed mb-10 max-w-md"
        >
          Turn your food photos into powerful nutrition insights. Stay healthy,
          track calories, and improve your lifestyle with AI.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex gap-4"
        >
          <button
            onClick={() => { setTab("signup"); }}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 text-white font-bold text-sm shadow-lg hover:bg-green-600 transition-all duration-200 hover:shadow-green-200 hover:shadow-xl"
          >
            Get Started Free <span>›</span>
          </button>
          <button
            onClick={() => { setTab("signin"); }}
            className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-300 bg-white/60 backdrop-blur text-gray-700 font-bold text-sm hover:border-green-400 hover:text-green-600 transition-all duration-200"
          >
            View History
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex gap-8 mt-14"
        >
          {[
            { value: "50K+", label: "Users" },
            { value: "2M+", label: "Meals Scanned" },
            { value: "98%", label: "Accuracy" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-black text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── RIGHT CARD ── */}
      <div className="flex items-center justify-center px-8 py-12 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8"
          style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.12)" }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-2xl mb-3 shadow-sm">
              🍃
            </div>
            <h2 className="text-xl font-bold text-gray-900">NutriScann</h2>
            <p className="text-sm text-gray-400 mt-1">
              {tab === "signin" ? "Welcome back! Sign in to continue." : "Create your account today."}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {(["signin", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  tab === t
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Name field (signup only) */}
              {tab === "signup" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Full Name
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:border-green-400 focus-within:bg-white transition-all">
                    <span className="text-gray-400 mr-2">👤</span>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Email
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:border-green-400 focus-within:bg-white transition-all">
                  <span className="text-gray-400 mr-2">✉️</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-semibold text-gray-600">
                    Password
                  </label>
                  {tab === "signin" && (
                    <button className="text-xs text-green-500 hover:text-green-600 font-medium">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:border-green-400 focus-within:bg-white transition-all">
                  <span className="text-gray-400 mr-2">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 text-xs ml-1"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm Password (signup only) */}
              {tab === "signup" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:border-green-400 focus-within:bg-white transition-all">
                    <span className="text-gray-400 mr-2">🔒</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400"
                    />
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2"
                >
                  ⚠️ {error}
                </motion.div>
              )}

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-all duration-200 shadow-md hover:shadow-green-200 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {tab === "signin" ? "Signing in..." : "Creating account..."}
                  </span>
                ) : tab === "signin" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or continue with</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Google button */}
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:border-gray-300 shadow-sm disabled:opacity-60"
              >
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                  <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                </svg>
                Continue with Google
              </button>

              {/* Footer note */}
              <p className="text-center text-xs text-gray-400">
                {tab === "signin" ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => setTab("signup")}
                      className="text-green-500 font-semibold hover:underline"
                    >
                      Sign up free
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => setTab("signin")}
                      className="text-green-500 font-semibold hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}