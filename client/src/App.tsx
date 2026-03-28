import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Upload from "./pages/Upload";
import History from "./pages/History";
import Diet from "./pages/Diet";
import Charts from "./pages/Charts";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="/history" element={<History />} />
          <Route path="/diet" element={<Diet />} />
          <Route path="/charts" element={<Charts />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;