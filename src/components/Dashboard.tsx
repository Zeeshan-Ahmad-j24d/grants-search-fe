import { useStytchMember, useStytchMemberSession } from "@stytch/react/b2b";
import "./grants.css";

const Dashboard = () => {
  const { member } = useStytchMember();
  const { session } = useStytchMemberSession();
  console.log("session", session?.roles);
  const canApply = session?.roles?.some(
    (role) => role === "grant_applicant" || role === "stytch_admin"
  );

  return (
    <div className="grants-page">
      <div className="grants-header">
        <h1 className="grants-title">Dashboard</h1>
        <div className="user-actions">
          <span className="user-welcome">Welcome, {member?.email_address}</span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginTop: "24px",
        }}
      >
        {/* Quick Stats Boxes */}
        <div className="grant-card">
          <h3 className="grant-title">Active Grants</h3>
          <div className="grant-meta">
            <p
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#0b74ff",
                margin: "12px 0",
              }}
            >
              12
            </p>
            <p>Open for submission</p>
          </div>
        </div>

        <div className="grant-card">
          <h3 className="grant-title">Upcoming Deadlines</h3>
          <div className="grant-meta">
            <p
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#ff6b00",
                margin: "12px 0",
              }}
            >
              5
            </p>
            <p>Due this month</p>
          </div>
        </div>

        <div className="grant-card">
          <h3 className="grant-title">Total Funding Available</h3>
          <div className="grant-meta">
            <p
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#00a67e",
                margin: "12px 0",
              }}
            >
              €2.5M
            </p>
            <p>Across all active grants</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div style={{ marginTop: "32px" }}>
        <h2 style={{ fontSize: "20px", marginBottom: "16px" }}>
          Recent Activity
        </h2>
        <div className="grant-card">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 4px 0" }}>
                  Quality Label Humanitarian Aid Updated
                </h4>
                <p style={{ margin: 0, color: "#6b7280" }}>
                  Status changed to "Open for submission"
                </p>
              </div>
              <span style={{ color: "#6b7280", fontSize: "14px" }}>
                2 hours ago
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 4px 0" }}>New Grant Added</h4>
                <p style={{ margin: 0, color: "#6b7280" }}>
                  Networking and Marketing FSTP
                </p>
              </div>
              <span style={{ color: "#6b7280", fontSize: "14px" }}>
                1 day ago
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 4px 0" }}>Deadline Approaching</h4>
                <p style={{ margin: 0, color: "#6b7280" }}>
                  OFFERR Call closes in 5 days
                </p>
              </div>
              <span style={{ color: "#6b7280", fontSize: "14px" }}>
                3 days ago
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
