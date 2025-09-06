import React from "react";
import Navbar from "./Navbar";

const Container = ({children}) => (
  <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
    {children}
  </div>
);

const Layout = ({children}) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />
      <main className="pt-6 pb-12">
        <Container>{children}</Container>
      </main>
    </div>
  );
};

export default Layout;
