import React from "react";

const variants = {
  neutral: "bg-gray-100 text-gray-700 border border-gray-200",
  blue: "bg-blue-50 text-blue-600 border border-blue-100",
  green: "bg-green-50 text-green-600 border border-green-100",
  yellow: "bg-yellow-50 text-yellow-700 border border-yellow-100",
  red: "bg-red-50 text-red-600 border border-red-100",
};

const size = {
  sm: "text-[10px] font-medium px-2 py-0.5",
};

export const Badge = ({children, tone = "neutral"}) => (
  <span className={`inline-flex rounded-full ${size.sm} ${variants[tone]}`}>
    {children}
  </span>
);
