import React from "react";
import {NavLink} from "../ui/NavLink";

const navItems = [
  {label: "Dashboard", href: "#"},
  {label: "Students", href: "#", current: true},
  {label: "Admins", href: "#"},
  {label: "Settings", href: "#"},
];

const Navbar = () => {
  return (
    <header className="border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 sticky top-0 z-30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="text-lg font-semibold tracking-tight">
            NaiUdaan Library
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink key={item.label} active={item.current}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <button className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-100 transition">
            <span className="i-bell text-gray-500" aria-hidden />
            <span className="sr-only">Notifications</span>
          </button>
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
            👤
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
