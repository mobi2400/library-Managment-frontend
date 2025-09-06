import React from "react";

export const NavLink = ({children, active = false, ...rest}) => {
  return (
    <button
      {...rest}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
        active ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
};
