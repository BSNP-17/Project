import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../api/adminApi.js";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);

  // Buses state
  const [buses, setBuses] = useState([]);
  const [busPage, setBusPage] = useState(0);
  const [busTotalPages, setBusTotalPages] = useState(0);
  const [busSearch, setBusSearch] = useState("");

  // Bookings state
  const [bookings, setBookings] = useState([]);
  const [bookingPage, setBookingPage] = useState(0);
  const [bookingTotalPages, setBookingTotalPages] = useState(0);

  // Users state
  const [users, setUsers] = useState([]);
  const [userPage, setUserPage] = useState(0);
  const [userTotalPages, setUserTotalPages] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Bus form
  const [showBusForm, setShowBusForm] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [busForm, setBusForm] = useState({
    busNumber: "", operator: "", fromCity: "", toCity: "",
    departureTime: "", arrivalTime: "", price: "",
    totalSeats: "", availableSeats: "", busType: "AC", amenities: "",
  });

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => { if (activeTab === "buses") fetchBuses(0); }, [activeTab]);
  useEffect(() => { if (activeTab === "bookings") fetchBookings(0); }, [activeTab]);
  useEffect(() => { if (activeTab === "users") fetchUsers(0); }, [activeTab]);

  const showSuccess = (msg) => { setSuccess(msg); setTimeout(() => setSuccess(""), 3000); };
  const showError = (msg) => { setError(msg); setTimeout(() => setError(""), 4000); };

  const fetchStats = async () => {
    try { const res = await adminApi.getStats(); setStats(res.data); }
    catch { showError("Failed to load stats"); }
  };

  const fetchBuses = async (page = 0) => {
    setLoading(true);
    try {
      const res = await adminApi.getAllBuses(page, 15);
      setBuses(res.data.content);
      setBusTotalPages(res.data.totalPages);
      setBusPage(res.data.number);
    } catch { showError("Failed to load buses"); }
    setLoading(false);
  };

  const fetchBookings = async (page = 0) => {
    setLoading(true);
    try {
      const res = await adminApi.getAllBookings(page, 15);
      setBookings(res.data.content);
      setBookingTotalPages(res.data.totalPages);
      setBookingPage(res.data.number);
    } catch { showError("Failed to load bookings"); }
    setLoading(false);
  };

  const fetchUsers = async (page = 0) => {
    setLoading(true);
    try {
      const res = await adminApi.getAllUsers(page, 15);
      setUsers(res.data.content);
      setUserTotalPages(res.data.totalPages);
      setUserPage(res.data.number);
    } catch { showError("Failed to load users"); }
    setLoading(false);
  };

  const handleBusSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...busForm,
      price: parseFloat(busForm.price),
      totalSeats: parseInt(busForm.totalSeats),
      availableSeats: parseInt(busForm.availableSeats),
      amenities: busForm.amenities.split(",").map((a) => a.trim()).filter(Boolean),
    };
    try {
      if (editingBus) { await adminApi.updateBus(editingBus.id, payload); showSuccess("Bus updated!"); }
      else { await adminApi.addBus(payload); showSuccess("Bus added!"); }
      setShowBusForm(false); setEditingBus(null); resetBusForm(); fetchBuses(busPage);
    } catch { showError("Failed to save bus"); }
  };

  const handleEditBus = (bus) => {
    setEditingBus(bus);
    setBusForm({
      busNumber: bus.busNumber || "", operator: bus.operator || "",
      fromCity: bus.fromCity || "", toCity: bus.toCity || "",
      departureTime: bus.departureTime ? bus.departureTime.substring(0, 16) : "",
      arrivalTime: bus.arrivalTime ? bus.arrivalTime.substring(0, 16) : "",
      price: bus.price || "", totalSeats: bus.totalSeats || "",
      availableSeats: bus.availableSeats || "", busType: bus.busType || "AC",
      amenities: bus.amenities ? bus.amenities.join(", ") : "",
    });
    setShowBusForm(true);
  };

  const handleDeleteBus = async (id) => {
    if (!window.confirm("Delete this bus?")) return;
    try { await adminApi.deleteBus(id); showSuccess("Bus deleted!"); fetchBuses(busPage); }
    catch { showError("Failed to delete bus"); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try { await adminApi.deleteUser(id); showSuccess("User deleted!"); fetchUsers(userPage); }
    catch { showError("Failed to delete user"); }
  };

  const resetBusForm = () => setBusForm({
    busNumber: "", operator: "", fromCity: "", toCity: "",
    departureTime: "", arrivalTime: "", price: "",
    totalSeats: "", availableSeats: "", busType: "AC", amenities: "",
  });

  const handleLogout = () => {
    localStorage.removeItem("token"); localStorage.removeItem("userData"); navigate("/login");
  };

  // Filter buses by search locally (within current page)
  const filteredBuses = buses.filter((b) =>
    !busSearch ||
    b.busNumber?.toLowerCase().includes(busSearch.toLowerCase()) ||
    b.fromCity?.toLowerCase().includes(busSearch.toLowerCase()) ||
    b.toCity?.toLowerCase().includes(busSearch.toLowerCase()) ||
    b.operator?.toLowerCase().includes(busSearch.toLowerCase())
  );

  const Pagination = ({ currentPage, totalPages, onPageChange }) => (
    <div className="pagination">
      <button className="page-btn" onClick={() => onPageChange(0)} disabled={currentPage === 0}>«</button>
      <button className="page-btn" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0}>‹</button>
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        const start = Math.max(0, currentPage - 2);
        const pg = start + i;
        if (pg >= totalPages) return null;
        return (
          <button key={pg} className={`page-btn ${pg === currentPage ? "active" : ""}`} onClick={() => onPageChange(pg)}>
            {pg + 1}
          </button>
        );
      })}
      <button className="page-btn" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1}>›</button>
      <button className="page-btn" onClick={() => onPageChange(totalPages - 1)} disabled={currentPage >= totalPages - 1}>»</button>
      <span className="page-info">Page {currentPage + 1} of {totalPages}</span>
    </div>
  );

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">🚌</span>
          <span className="logo-text">TravelEase</span>
          <span className="admin-badge">ADMIN</span>
        </div>
        <nav className="sidebar-nav">
          {[
            { id: "dashboard", icon: "📊", label: "Dashboard" },
            { id: "buses", icon: "🚌", label: "Manage Buses" },
            { id: "bookings", icon: "🎫", label: "All Bookings" },
            { id: "users", icon: "👥", label: "Users" },
          ].map((item) => (
            <button key={item.id} className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </aside>

      {/* MAIN */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h1 className="page-title">
            {activeTab === "dashboard" && "Dashboard Overview"}
            {activeTab === "buses" && "Manage Buses"}
            {activeTab === "bookings" && "All Bookings"}
            {activeTab === "users" && "Users"}
          </h1>
          <div className="admin-info">
            <span className="admin-avatar">👤</span>
            <span className="admin-name">Admin</span>
          </div>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {success && <div className="alert alert-success">✅ {success}</div>}

        {/* ---- DASHBOARD ---- */}
        {activeTab === "dashboard" && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card blue"><div className="stat-icon">👥</div><div className="stat-info"><span className="stat-number">{stats?.totalUsers ?? "—"}</span><span className="stat-label">Total Users</span></div></div>
              <div className="stat-card green"><div className="stat-icon">🚌</div><div className="stat-info"><span className="stat-number">{stats?.totalBuses ?? "—"}</span><span className="stat-label">Total Buses</span></div></div>
              <div className="stat-card orange"><div className="stat-icon">🎫</div><div className="stat-info"><span className="stat-number">{stats?.totalBookings ?? "—"}</span><span className="stat-label">Total Bookings</span></div></div>
              <div className="stat-card purple"><div className="stat-icon">💰</div><div className="stat-info"><span className="stat-number">₹{stats?.totalRevenue?.toFixed(0) ?? "—"}</span><span className="stat-label">Total Revenue</span></div></div>
            </div>
            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="action-cards">
                <div className="action-card" onClick={() => { setActiveTab("buses"); setShowBusForm(true); }}><span>➕</span><span>Add New Bus</span></div>
                <div className="action-card" onClick={() => setActiveTab("bookings")}><span>🎫</span><span>View All Bookings</span></div>
                <div className="action-card" onClick={() => setActiveTab("users")}><span>👥</span><span>Manage Users</span></div>
              </div>
            </div>
          </div>
        )}

        {/* ---- BUSES ---- */}
        {activeTab === "buses" && (
          <div className="buses-content">
            <div className="content-header">
              <input
                className="search-input"
                placeholder="🔍 Search by bus no, city, operator..."
                value={busSearch}
                onChange={(e) => setBusSearch(e.target.value)}
              />
              <button className="btn-primary" onClick={() => { resetBusForm(); setEditingBus(null); setShowBusForm(true); }}>➕ Add New Bus</button>
            </div>

            {showBusForm && (
              <div className="modal-overlay" onClick={(e) => e.target.className === "modal-overlay" && setShowBusForm(false)}>
                <div className="modal">
                  <div className="modal-header">
                    <h2>{editingBus ? "✏️ Edit Bus" : "➕ Add New Bus"}</h2>
                    <button className="close-btn" onClick={() => setShowBusForm(false)}>✕</button>
                  </div>
                  <form onSubmit={handleBusSubmit} className="bus-form">
                    <div className="form-grid">
                      <div className="form-group"><label>Bus Number *</label><input required placeholder="e.g. KA01AB1234" value={busForm.busNumber} onChange={(e) => setBusForm({ ...busForm, busNumber: e.target.value })} /></div>
                      <div className="form-group"><label>Operator *</label><input required placeholder="e.g. KSRTC" value={busForm.operator} onChange={(e) => setBusForm({ ...busForm, operator: e.target.value })} /></div>
                      <div className="form-group"><label>From City *</label><input required placeholder="e.g. Bengaluru" value={busForm.fromCity} onChange={(e) => setBusForm({ ...busForm, fromCity: e.target.value })} /></div>
                      <div className="form-group"><label>To City *</label><input required placeholder="e.g. Mumbai" value={busForm.toCity} onChange={(e) => setBusForm({ ...busForm, toCity: e.target.value })} /></div>
                      <div className="form-group"><label>Departure Time *</label><input required type="datetime-local" value={busForm.departureTime} onChange={(e) => setBusForm({ ...busForm, departureTime: e.target.value })} /></div>
                      <div className="form-group"><label>Arrival Time *</label><input required type="datetime-local" value={busForm.arrivalTime} onChange={(e) => setBusForm({ ...busForm, arrivalTime: e.target.value })} /></div>
                      <div className="form-group"><label>Price (₹) *</label><input required type="number" placeholder="e.g. 500" value={busForm.price} onChange={(e) => setBusForm({ ...busForm, price: e.target.value })} /></div>
                      <div className="form-group"><label>Total Seats *</label><input required type="number" placeholder="e.g. 40" value={busForm.totalSeats} onChange={(e) => setBusForm({ ...busForm, totalSeats: e.target.value })} /></div>
                      <div className="form-group"><label>Available Seats *</label><input required type="number" placeholder="e.g. 40" value={busForm.availableSeats} onChange={(e) => setBusForm({ ...busForm, availableSeats: e.target.value })} /></div>
                      <div className="form-group"><label>Bus Type *</label>
                        <select value={busForm.busType} onChange={(e) => setBusForm({ ...busForm, busType: e.target.value })}>
                          <option value="AC">AC</option><option value="Non-AC">Non-AC</option>
                          <option value="Sleeper">Sleeper</option><option value="Volvo">Volvo</option>
                          <option value="Semi-Sleeper">Semi-Sleeper</option>
                        </select>
                      </div>
                      <div className="form-group full-width"><label>Amenities (comma separated)</label><input placeholder="e.g. WiFi, Charging Point" value={busForm.amenities} onChange={(e) => setBusForm({ ...busForm, amenities: e.target.value })} /></div>
                    </div>
                    <div className="form-actions">
                      <button type="button" className="btn-secondary" onClick={() => setShowBusForm(false)}>Cancel</button>
                      <button type="submit" className="btn-primary">{editingBus ? "Update Bus" : "Add Bus"}</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {loading ? <div className="loading">⏳ Loading buses...</div> : (
              <>
                <div className="table-container">
                  <table className="data-table">
                    <thead><tr><th>Bus No.</th><th>Operator</th><th>Route</th><th>Departure</th><th>Type</th><th>Price</th><th>Seats</th><th>Actions</th></tr></thead>
                    <tbody>
                      {filteredBuses.map((bus) => (
                        <tr key={bus.id}>
                          <td><strong>{bus.busNumber}</strong></td>
                          <td>{bus.operator}</td>
                          <td>{bus.fromCity} → {bus.toCity}</td>
                          <td>{bus.departureTime ? new Date(bus.departureTime).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" }) : "—"}</td>
                          <td><span className={`badge badge-${bus.busType?.toLowerCase().replace(" ", "-")}`}>{bus.busType}</span></td>
                          <td>₹{bus.price}</td>
                          <td><span className={bus.availableSeats === 0 ? "seats-full" : "seats-available"}>{bus.availableSeats}/{bus.totalSeats}</span></td>
                          <td className="action-btns">
                            <button className="btn-edit" onClick={() => handleEditBus(bus)}>✏️ Edit</button>
                            <button className="btn-delete" onClick={() => handleDeleteBus(bus.id)}>🗑️ Del</button>
                          </td>
                        </tr>
                      ))}
                      {filteredBuses.length === 0 && <tr><td colSpan="8" className="empty-row">No buses found</td></tr>}
                    </tbody>
                  </table>
                </div>
                <Pagination currentPage={busPage} totalPages={busTotalPages} onPageChange={fetchBuses} />
              </>
            )}
          </div>
        )}

        {/* ---- BOOKINGS ---- */}
        {activeTab === "bookings" && (
          <div className="bookings-content">
            <div className="content-header"><span>Total: {stats?.totalBookings ?? 0} bookings</span></div>
            {loading ? <div className="loading">⏳ Loading bookings...</div> : (
              <>
                <div className="table-container">
                  <table className="data-table">
                    <thead><tr><th>Booking ID</th><th>User ID</th><th>Bus ID</th><th>Seats</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b.id}>
                          <td><strong>{b.bookingId || b.id?.substring(0, 8)}</strong></td>
                          <td className="truncate">{b.userId}</td>
                          <td className="truncate">{b.busId}</td>
                          <td>{b.seatsBooked}</td>
                          <td>₹{b.totalAmount}</td>
                          <td><span className={`status-badge status-${b.status?.toLowerCase()}`}>{b.status}</span></td>
                          <td>{b.bookingTime ? new Date(b.bookingTime).toLocaleDateString("en-IN") : "—"}</td>
                        </tr>
                      ))}
                      {bookings.length === 0 && <tr><td colSpan="7" className="empty-row">No bookings found</td></tr>}
                    </tbody>
                  </table>
                </div>
                <Pagination currentPage={bookingPage} totalPages={bookingTotalPages} onPageChange={fetchBookings} />
              </>
            )}
          </div>
        )}

        {/* ---- USERS ---- */}
        {activeTab === "users" && (
          <div className="users-content">
            <div className="content-header"><span>Total: {stats?.totalUsers ?? 0} users</span></div>
            {loading ? <div className="loading">⏳ Loading users...</div> : (
              <>
                <div className="table-container">
                  <table className="data-table">
                    <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Actions</th></tr></thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td><strong>{u.fullname}</strong></td>
                          <td>{u.email}</td>
                          <td>{u.phoneNumber || "—"}</td>
                          <td>{u.roles?.map((r) => (<span key={r} className={`role-badge ${r.includes("ADMIN") || r === "admin" ? "role-admin" : "role-user"}`}>{r}</span>))}</td>
                          <td>{!u.roles?.some(r => r.includes("ADMIN") || r === "admin") && (
                            <button className="btn-delete" onClick={() => handleDeleteUser(u.id)}>🗑️ Delete</button>
                          )}</td>
                        </tr>
                      ))}
                      {users.length === 0 && <tr><td colSpan="5" className="empty-row">No users found</td></tr>}
                    </tbody>
                  </table>
                </div>
                <Pagination currentPage={userPage} totalPages={userTotalPages} onPageChange={fetchUsers} />
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
