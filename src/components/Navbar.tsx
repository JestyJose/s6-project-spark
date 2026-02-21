import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { GraduationCap, Shield, LogOut, LayoutGrid, Menu, X } from "lucide-react";

const Navbar = () => {
  const { pathname } = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-sora font-bold text-foreground text-sm hidden sm:block">
            Department Project Hub
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              pathname === "/" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Projects
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === "/admin" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          )}

          {user ? (
            <button onClick={() => signOut()} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === "/login" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              Admin Login
            </Link>
          )}
        </nav>

        <button className="sm:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="sm:hidden border-t border-border bg-card px-4 py-3 flex flex-col gap-1">
          <Link to="/" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary">Projects</Link>
          {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary">Admin</Link>}
          {user ? (
            <button onClick={() => { signOut(); setMobileOpen(false); }} className="px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary text-left">Sign Out</button>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary">Admin Login</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
