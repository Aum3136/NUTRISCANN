import Navbar from "./Navbar";

const Layout = ({ children }: any) => {
  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: "linear-gradient(135deg, #0a0f0a 0%, #0d1a0f 40%, #0a0e14 100%)",
      }}
    >
      {/* Subtle grid texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Green glow top-left */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />
      {/* Blue glow bottom-right */}
      <div className="fixed bottom-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <Navbar />
      <div className="pt-20 px-6 max-w-7xl mx-auto relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Layout;