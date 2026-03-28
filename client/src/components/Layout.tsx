import Navbar from "./Navbar";

const Layout = ({ children }: any) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">

      <Navbar />

      {/* 👇 IMPORTANT */}
      <div className="pt-24 px-6 max-w-6xl mx-auto">
        {children}
      </div>

    </div>
  );
};

export default Layout;