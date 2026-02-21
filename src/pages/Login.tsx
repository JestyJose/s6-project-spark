import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Shield } from "lucide-react";

const Login = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        setInfo("Check your email to confirm your account, then sign in.");
      }
    } else {
      const { error } = await signIn(email, password);
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        navigate("/admin");
      }
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-20">
      <div className="bg-card rounded-2xl border border-border shadow-card p-8">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center shadow-hero">
            <Shield className="w-7 h-7 text-primary-foreground" />
          </div>
        </div>
        <h2 className="font-sora text-2xl font-bold text-center text-foreground mb-1">
          {isSignUp ? "Create Account" : "Admin Login"}
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-8">
          {isSignUp ? "Sign up to request admin access." : "Sign in to manage projects."}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-border text-sm text-foreground bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-border text-sm text-foreground bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {error && <p className="text-destructive text-xs">{error}</p>}
          {info && <p className="text-xs" style={{ color: "hsl(var(--status-idea))" }}>{info}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-hero text-primary-foreground font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm disabled:opacity-50"
          >
            {loading ? "Please wait…" : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(""); setInfo(""); }}
            className="text-accent font-semibold hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </main>
  );
};

export default Login;
