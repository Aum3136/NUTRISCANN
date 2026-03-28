const History = () => {
  return (
    <div className="max-w-4xl mx-auto mt-10">

      <h1 className="text-3xl font-bold mb-6">
        📜 Scan History
      </h1>

      <div className="border border-dashed border-white/20 rounded-xl p-10 text-center bg-white/5">

        <p className="text-gray-400 mb-4">
          No scans yet
        </p>

        <button className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600">
          Start Scanning
        </button>

      </div>

    </div>
  );
};

export default History;