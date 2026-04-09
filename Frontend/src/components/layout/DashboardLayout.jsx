import { Bell, BookMarked, Calendar, LayoutDashboard, MessageCircle, Star, User2, Users } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const roleNav = {
  mentee: [
    { to: "/mentee", label: "Dashboard", icon: LayoutDashboard },
    { to: "/mentee/browse-mentors", label: "Browse Mentors", icon: Users },
    { to: "/mentee/profile", label: "Profile", icon: User2 },
    { to: "/mentee/requests", label: "Requests", icon: Users },
    { to: "/mentee/sessions", label: "Sessions", icon: Calendar },
    { to: "/mentee/goals", label: "Goals", icon: BookMarked },
    { to: "/mentee/messages", label: "Messages", icon: MessageCircle },
    { to: "/mentee/notifications", label: "Notifications", icon: Bell },
    { to: "/mentee/favorites", label: "Favorites", icon: Star },
  ],
  mentor: [
    { to: "/mentor", label: "Dashboard", icon: LayoutDashboard },
    { to: "/mentor/profile", label: "Profile", icon: User2 },
    { to: "/mentor/requests", label: "Requests", icon: Users },
    { to: "/mentor/mentees", label: "Mentees", icon: Users },
    { to: "/mentor/sessions", label: "Sessions", icon: Calendar },
    { to: "/mentor/availability", label: "Availability", icon: BookMarked },
    { to: "/mentor/reviews", label: "Reviews", icon: Star },
    { to: "/mentor/messages", label: "Messages", icon: MessageCircle },
  ],
  admin: [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/approvals", label: "Approvals", icon: BookMarked },
    { to: "/admin/categories", label: "Categories", icon: Star },
    { to: "/admin/reports", label: "Reports", icon: Bell },
  ],
};

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navItems = roleNav[user?.role] || [];

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col justify-between bg-slate-950 px-6 py-8 text-white lg:flex">
          <div>
            <Link to="/" className="text-xl font-extrabold">
              Mentor-Mentee
            </Link>
            <div className="mt-10 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === `/${user?.role}`}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        isActive ? "bg-white text-slate-950" : "text-slate-300 hover:bg-slate-900"
                      }`
                    }
                  >
                    <Icon size={18} />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </div>
          <button
            onClick={logout}
            className="rounded-2xl border border-slate-800 px-4 py-3 text-left text-sm font-semibold text-slate-300"
          >
            Logout
          </button>
        </aside>
        <div className="flex-1">
          <div className="border-b border-slate-200 bg-white px-4 py-5 sm:px-8">
            <p className="text-sm text-slate-500">Signed in as {user?.role}</p>
            <h1 className="text-2xl font-extrabold text-slate-950">{user?.name}</h1>
          </div>
          <div className="p-4 sm:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
