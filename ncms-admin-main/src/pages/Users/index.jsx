import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Table } from "reactstrap";
import { FiTrash2, FiPlus, FiUsers, FiEdit2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { getUsers, createUser, updateUser, deleteUser } from "../../services/data.service";
import { EditorPage, EditorHeader, DataPanel, TableActionBtn, PrimaryButton, GhostButton, Field, TextField } from "../../components/editorLayout";
import { ROLES, ROLE_LABELS } from "../../config/adminPages";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "faculty", department: "" });

  const load = () => {
    setLoading(true);
    getUsers()
      .then((r) => setUsers(r?.data || []))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", email: "", password: "", role: "faculty", department: "" });
    setModal(true);
  };

  const openEdit = (u) => {
    setEditing(u);
    setForm({ name: u.name || "", email: u.email || "", password: "", role: u.role || "faculty", department: u.department || "" });
    setModal(true);
  };

  const save = async () => {
    try {
      if (editing) {
        await updateUser(editing._id, form);
        toast.success("User updated");
      } else {
        await createUser(form);
        toast.success("User created");
      }
      setModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const remove = async (u) => {
    if (!window.confirm(`Delete ${u.name || u.email}?`)) return;
    try {
      await deleteUser(u._id);
      toast.success("User deleted");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <EditorPage>
      <EditorHeader
        icon={FiUsers}
        eyebrow="Admin"
        title="User Management"
        subtitle="Create and manage admin accounts with role-based access."
        stats={[{ value: users.length, label: "Users" }]}
      />

      <div className="d-flex justify-content-end mb-3">
        <PrimaryButton icon={FiPlus} onClick={openAdd} type="button">
          Add User
        </PrimaryButton>
      </div>

      <DataPanel>
        <Table hover responsive className="mb-0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th style={{ width: 120 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "#9aa0b4" }}>Loading…</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "#9aa0b4" }}>No users yet.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 600, color: "#1e1b4b" }}>{u.name || "—"}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      style={{
                        borderRadius: 999,
                        padding: ".2rem .7rem",
                        fontSize: ".74rem",
                        fontWeight: 700,
                        background: u.role === "admin" ? "#fef3c7" : "#eef0f9",
                        color: u.role === "admin" ? "#d97706" : "#6b7192",
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>{u.department || "—"}</td>
                  <td>
                    <TableActionBtn icon={FiEdit2} onClick={() => openEdit(u)} style={{ marginRight: 6 }}>
                      Edit
                    </TableActionBtn>
                    <TableActionBtn icon={FiTrash2} tone="danger" onClick={() => remove(u)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </DataPanel>

      <Modal isOpen={modal} toggle={() => setModal(false)} centered>
        <ModalHeader toggle={() => setModal(false)}>{editing ? "Edit User" : "Add User"}</ModalHeader>
        <ModalBody>
          <Field label="Name">
            <TextField value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Email">
            <TextField type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label={editing ? "New Password (leave blank to keep)" : "Password"}>
            <TextField type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </Field>
          <Field label="Role">
            <TextField type="select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {ROLES.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r] || r}</option>
              ))}
            </TextField>
          </Field>
          <Field label="Department">
            <TextField value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="e.g. UG_Commerce" />
          </Field>
        </ModalBody>
        <ModalFooter>
          <GhostButton onClick={() => setModal(false)}>Cancel</GhostButton>
          <PrimaryButton type="button" onClick={save}>
            {editing ? "Save Changes" : "Create User"}
          </PrimaryButton>
        </ModalFooter>
      </Modal>
    </EditorPage>
  );
};

export default Users;
