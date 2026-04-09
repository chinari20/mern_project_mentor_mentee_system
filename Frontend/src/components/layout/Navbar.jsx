import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../common/Button";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur">
      <div className="container-app flex items-center justify-between py-4">
        <Link to="/" className="text-xl font-extrabold text-slate-950">
          Mentor-Mentee System
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {["/about", "/mentors", "/contact"].map((item) => (
            <NavLink
              key={item}
              to={item}
              className={({ isActive }) =>
                isActive ? "font-semibold text-primary-600" : "text-slate-600"
              }
            >
              {item.replace("/", "") || "home"}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                className="hidden rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 md:block"
                to={`/${user.role}`}
              >
                Dashboard
              </Link>
              <Button variant="secondary" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link className="btn-secondary" to="/login">
                Login
              </Link>
              <Link className="btn-primary" to="/register">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
