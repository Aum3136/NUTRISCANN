import Navbar from "./Navbar";

const Layout = ({ children }: any) => {
  return (
    <div
      className="min-h-screen text-[#1a2e1a]"
      style={{
        background: "linear-gradient(135deg, #f8faf8 0%, #f0f7f0 40%, #fcfdfc 100%)",
      }}
    >
      {/* Subtle grid texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(34,197,94,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.15) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Green glow top-left */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-green-500/3 rounded-full blur-3xl pointer-events-none" />
      {/* Blue glow bottom-right */}
      <div className="fixed bottom-0 right-0 w-80 h-80 bg-teal-500/3 rounded-full blur-3xl pointer-events-none" />

      <Navbar />
      <div className="pt-20 px-6 max-w-7xl mx-auto relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Layout;