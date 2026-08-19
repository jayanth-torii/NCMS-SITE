import React from "react";
import { useSelector } from "react-redux";
import { FiUser } from "react-icons/fi";
import { EditorPage, EditorHeader, Panel } from "../../components/editorLayout";
import { ROLE_LABELS } from "../../config/adminPages";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);

  const rows = [
    ["Name", user?.name],
    ["Email", user?.email],
    ["Username", user?.username],
    ["Role", user?.role ? ROLE_LABELS[user.role] || user.role : ""],
    ["Department", user?.department || "—"],
  ];

  return (
    <EditorPage>
      <EditorHeader
        icon={FiUser}
        eyebrow="Account"
        title="My Profile"
        subtitle="Your admin account details."
      />
      <Panel style={{ maxWidth: 560 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "1.4rem", borderBottom: "1px solid #e7e9f5" }}>
          <span
            style={{
              width: 58,
              height: 58,
              borderRadius: 16,
              background: "linear-gradient(120deg, #0e2455, #1e3a8a)",
              color: "#fff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "1.3rem",
            }}
          >
            {(user?.name || "A")[0].toUpperCase()}
          </span>
          <div>
            <div style={{ fontWeight: 800, color: "#0e2455", fontSize: "1.1rem" }}>{user?.name || "Admin"}</div>
            <div style={{ fontSize: ".82rem", color: "#6b7192" }}>{user?.email}</div>
          </div>
        </div>
        <div style={{ padding: "1.25rem 1.4rem" }}>
          {rows.map(([k, v]) => (
            <div key={k} style={{ display: "flex", gap: 12, padding: ".5rem 0", borderBottom: "1px solid #eef0f9", fontSize: ".88rem" }}>
              <span style={{ width: 140, fontWeight: 700, color: "#6b7192", fontSize: ".8rem", textTransform: "uppercase", letterSpacing: ".04em" }}>
                {k}
              </span>
              <span style={{ color: "#0e2455", fontWeight: 600 }}>{v || "—"}</span>
            </div>
          ))}
        </div>
      </Panel>
    </EditorPage>
  );
};

export default Profile;
