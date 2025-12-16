import { useState } from "react";
import Login from "./components/Login"; // eslint-disable-line no-unused-vars
import MagicalHat from "./components/MagicalHat"; // eslint-disable-line no-unused-vars
import dataManager from "./utils/dataManager";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Admin credentials
  const ADMIN_EMAIL = "admin@walmart.com";
  const ADMIN_PASSWORD = "SecretSanta2025!";

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handlePickComplete = () => {
    setTimeout(() => {
      // Reset after showing the result
      setUser(null);
    }, 5000);
  };

  const handleAdminAccess = async () => {
    const password = prompt("Enter Admin Password:");
    if (password === null) return; // User cancelled

    if (password === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      // Load admin data after successful authentication
      await dataManager.init();
      const data = dataManager.getData();
      setAdminData(data);
      setShowAdmin(true);
    } else {
      alert("Invalid admin password!");
    }
  };

  const handleAdminView = async () => {
    if (!isAdminAuthenticated) {
      await handleAdminAccess();
      return;
    }
    await dataManager.init();
    const data = dataManager.getData();
    setAdminData(data);
    setShowAdmin(true);
  };

  const handleResetData = async () => {
    if (
      confirm(
        "Are you sure you want to reset all data? This will reload from server and clear localStorage!"
      )
    ) {
      try {
        await dataManager.resetData();
        // Refresh admin data after reset
        await dataManager.init();
        const data = dataManager.getData();
        setAdminData(data);
        alert("Data has been reset from server!");
      } catch (error) {
        console.error("Error resetting data:", error);
        alert("Error resetting data. Please try again.");
      }
    }
  };

  const handleResetAllAssignments = async () => {
    if (
      confirm(
        "Are you sure you want to reset ALL assignments? Users will be able to pick again."
      )
    ) {
      try {
        await dataManager.resetAllAssignments();
        // Refresh admin data after reset
        const data = dataManager.getData();
        setAdminData(data);
        alert("All assignments have been reset!");
      } catch (error) {
        console.error("Error resetting assignments:", error);
        alert("Error resetting assignments. Please try again.");
      }
    }
  };

  const handleResetUserAssignment = async (userEmail) => {
    if (
      confirm(
        `Reset assignment for ${userEmail}? This will allow them to pick again.`
      )
    ) {
      try {
        await dataManager.resetUserAssignment(userEmail);
        // Refresh admin data
        const data = dataManager.getData();
        setAdminData(data);
        alert("User assignment has been reset!");
      } catch (error) {
        console.error("Error resetting user assignment:", error);
        alert("Error resetting user assignment. Please try again.");
      }
    }
  };

  const handleRefreshData = async () => {
    try {
      await dataManager.init();
      const data = dataManager.getData();
      setAdminData(data);
      alert("Data refreshed!");
    } catch (error) {
      console.error("Error refreshing data:", error);
      alert("Error refreshing data. Please try again.");
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(adminData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `secret-santa-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCloseAdmin = () => {
    setShowAdmin(false);
    setAdminData(null);
  };

  if (showAdmin) {
    return (
      <div className="app">
        <div style={{ padding: "20px", fontFamily: "monospace" }}>
          <h2>🎅 Secret Santa Admin Panel</h2>
          <div style={{ marginBottom: "20px" }}>
            <button onClick={handleCloseAdmin} style={{ marginRight: "10px" }}>
              Close Admin
            </button>
            <button
              onClick={handleRefreshData}
              style={{ backgroundColor: "#17a2b8", color: "white", marginRight: "10px" }}
            >
              Refresh Data
            </button>
            <button
              onClick={handleResetAllAssignments}
              style={{ backgroundColor: "#ffc107", color: "black", marginRight: "10px" }}
            >
              Reset All Assignments
            </button>
            <button
              onClick={handleResetData}
              style={{ backgroundColor: "#dc3545", color: "white", marginRight: "10px" }}
            >
              Reset All Data
            </button>
            <button
              onClick={handleExportData}
              style={{ backgroundColor: "#6c757d", color: "white" }}
            >
              Export Data
            </button>
          </div>

          {/* Statistics */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "10px",
              marginBottom: "20px",
              padding: "15px",
              backgroundColor: "#f8f9fa",
              borderRadius: "5px",
            }}
          >
            <div>
              <strong>Total Users:</strong> {adminData?.users?.length || 0}
            </div>
            <div>
              <strong>Picked:</strong>{" "}
              {adminData?.users?.filter((u) => u.hasPicked).length || 0}
            </div>
            <div>
              <strong>Remaining:</strong>{" "}
              {(adminData?.users?.length || 0) -
                (adminData?.users?.filter((u) => u.hasPicked).length || 0)}
            </div>
            <div>
              <strong>Completion:</strong>{" "}
              {adminData?.users?.length > 0
                ? Math.round(
                    ((adminData?.users?.filter((u) => u.hasPicked).length ||
                      0) /
                      adminData.users.length) *
                      100
                  )
                : 0}
              %
            </div>
          </div>

          <h3>Users ({adminData?.users?.length || 0})</h3>
          <div
            style={{
              maxHeight: "400px",
              overflow: "auto",
              border: "1px solid #ccc",
              padding: "10px",
              backgroundColor: "#f8f9fa",
            }}
          >
            {adminData?.users?.length > 0 ? (
              adminData.users.map((user, i) => (
                <div
                  key={user.email || i}
                  style={{
                    padding: "10px",
                    marginBottom: "5px",
                    border: "1px solid #dee2e6",
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: user.hasPicked ? "#d4edda" : "#fff3cd",
                  }}
                >
                  <div>
                    <strong>{user.name}</strong> ({user.email})
                    <br />
                    <span style={{ color: user.hasPicked ? "#155724" : "#856404" }}>
                      {user.hasPicked
                        ? `✅ Picked: ${user.pickedRecipient}`
                        : "❌ Not picked yet"}
                    </span>
                  </div>
                  {user.hasPicked && (
                    <button
                      onClick={() => handleResetUserAssignment(user.email)}
                      style={{
                        backgroundColor: "#ffc107",
                        color: "#000",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "3px",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                  >
                    Reset User
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                No users found. Try refreshing the data.
              </div>
            )}
          </div>

          <h3>Assignments ({adminData?.assignments?.length || 0})</h3>
          <div
            style={{
              maxHeight: "300px",
              overflow: "auto",
              border: "1px solid #ccc",
              padding: "10px",
              backgroundColor: "#f8f9fa",
            }}
          >
            {adminData?.assignments?.length > 0 ? (
              adminData.assignments.map((assignment, i) => (
                <div
                  key={assignment.giverEmail || i}
                  style={{
                    padding: "10px",
                    marginBottom: "5px",
                    border: "1px solid #dee2e6",
                    borderRadius: "5px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong>{assignment.giverName}</strong> → <strong style={{ color: "#28a745" }}>{assignment.recipientName}</strong>
                      <br />
                      <small style={{ color: "#666" }}>
                        {assignment.giverEmail} → {assignment.recipientEmail}
                      </small>
                      <br />
                      <small style={{ color: "#666" }}>
                        {new Date(assignment.timestamp).toLocaleString()}
                      </small>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                No assignments yet. Users haven't started picking.
              </div>
            )}
          </div>

          <details style={{ marginTop: "20px" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold", padding: "10px 0" }}>
              Raw Data (Click to expand)
            </summary>
            <textarea
              value={JSON.stringify(adminData, null, 2)}
              readOnly
              style={{
                width: "100%",
                height: "200px",
                fontFamily: "monospace",
                fontSize: "12px",
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
              }}
            />
          </details>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Admin button (hidden, only accessible by keyboard shortcut or URL) */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
        }}
      >
        {isAdminAuthenticated ? (
          <div style={{ display: "flex", gap: "5px" }}>
            <button
              onClick={handleAdminView}
              style={{
                opacity: 0.1,
                padding: "5px",
                fontSize: "12px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
              }}
              onMouseOver={(e) => (e.target.style.opacity = "1")}
              onMouseOut={(e) => (e.target.style.opacity = "0.1")}
            >
              🔓 Admin Panel
            </button>
            <button
              onClick={() => {
                setIsAdminAuthenticated(false);
                setShowAdmin(false);
                setAdminData(null);
              }}
              style={{
                opacity: 0.1,
                padding: "5px",
                fontSize: "12px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
              }}
              onMouseOver={(e) => (e.target.style.opacity = "1")}
              onMouseOut={(e) => (e.target.style.opacity = "0.1")}
            >
              🚪 Logout
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdminView}
            style={{
              opacity: 0.1,
              padding: "5px",
              fontSize: "12px",
              backgroundColor: "#333",
              color: "white",
              border: "none",
            }}
            onMouseOver={(e) => (e.target.style.opacity = "1")}
            onMouseOut={(e) => (e.target.style.opacity = "0.1")}
          >
            🔒 Admin
          </button>
        )}
      </div>

      {!user ? (
        <Login onLogin={handleLogin} onAdminAccess={handleAdminAccess} />
      ) : (
        <MagicalHat user={user} onPickComplete={handlePickComplete} />
      )}
    </div>
  );
}

export default App;
