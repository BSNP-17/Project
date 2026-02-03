import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import BusResults from "./pages/BusResults";
import SeatSelection from "./pages/SeatSelection";  // ✅ ADDED
import Profile from "./pages/Profile";  // ✅ Add

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />     
        <Route path="/login" element={<Login />} />     
        <Route path="/home" element={<Home />} />       
        <Route path="/register" element={<Register />} />
        <Route path="/buses" element={<BusResults />} />  {/* ✅ Keep both */}
        <Route path="/seat/:busId" element={<SeatSelection />} />  {/* ✅ UNCOMMENTED */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
