import React, { useEffect, useState } from "react";
import { Table, Modal, ModalHeader, ModalBody } from "reactstrap";
import { FiInbox, FiTrash2, FiEye, FiRefreshCw } from "react-icons/fi";
import { toast } from "react-toastify";
import { getApplyNowForms, deleteApplyNowForm, getContactUsForms, deleteContactUsForm } from "../../services/data.service";
import { EditorPage, EditorHeader, DataPanel, TableActionBtn, GhostButton } from "../../components/editorLayout";

const fmtDate = (d) => {
  try {
    return new Date(d).toLocaleString();
  } catch (e) {
    return d || "";
  }
};

const SubmissionsInbox = ({ kind }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewRow, setViewRow] = useState(null);

  const load = () => {
    setLoading(true);
    const fn = kind === "apply-now" ? getApplyNowForms : getContactUsForms;
    fn()
      .then((r) => setRows(r?.data || []))
      .catch(() => toast.error("Failed to load submissions"))
      .finally(() => setLoading(false));
  };

  useEffect(load, [kind]); // eslint-disable-line react-hooks/exhaustive-deps

  const remove = async (row) => {
    if (!window.confirm("Delete this submission?")) return;
    try {
      if (kind === "apply-now") await deleteApplyNowForm(row._id);
      else await deleteContactUsForm(row._id);
      toast.success("Deleted");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const fieldOrder = kind === "apply-now"
    ? ["name", "email", "mobile_number", "program", "course", "message", "createdAt"]
    : ["name", "email", "mobile_number", "subject", "message", "formType", "createdAt"];

  const fieldLabels = {
    name: "Name",
    email: "Email",
    mobile_number: "Mobile",
    program: "Program",
    course: "Course",
    subject: "Subject",
    message: "Message",
    formType: "Type",
    createdAt: "Submitted",
  };

  return (
    <EditorPage>
      <EditorHeader
        icon={FiInbox}
        eyebrow="Submissions"
        title={kind === "apply-now" ? "Apply Now Submissions" : "Contact Queries"}
        subtitle="Enquiries and applications received from the public site."
        stats={[{ value: rows.length, label: "Received" }]}
      />

      <div className="d-flex justify-content-end mb-3">
        <GhostButton icon={FiRefreshCw} onClick={load}>Refresh</GhostButton>
      </div>

      <DataPanel>
        <Table hover responsive className="mb-0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>{kind === "apply-now" ? "Program" : "Subject"}</th>
              <th>Date</th>
              <th style={{ width: 110 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "#9aa0b4" }}>Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "#9aa0b4" }}>No submissions yet.</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r._id}>
                  <td style={{ fontWeight: 600, color: "#0e2455" }}>{r.name || "—"}</td>
                  <td>{r.email || "—"}</td>
                  <td>{r.mobile_number || "—"}</td>
                  <td>{kind === "apply-now" ? r.program || "—" : r.subject || "—"}</td>
                  <td style={{ fontSize: ".8rem", color: "#6b7192" }}>{fmtDate(r.createdAt)}</td>
                  <td>
                    <TableActionBtn icon={FiEye} onClick={() => setViewRow(r)} style={{ marginRight: 6 }}>
                      View
                    </TableActionBtn>
                    <TableActionBtn icon={FiTrash2} tone="danger" onClick={() => remove(r)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </DataPanel>

      <Modal isOpen={!!viewRow} toggle={() => setViewRow(null)} centered size="lg">
        <ModalHeader toggle={() => setViewRow(null)}>Submission details</ModalHeader>
        <ModalBody>
          {viewRow && (
            <Table borderless className="mb-0" style={{ fontSize: ".88rem" }}>
              <tbody>
                {fieldOrder
                  .filter((k) => viewRow[k] !== undefined && viewRow[k] !== null && String(viewRow[k]).trim() !== "")
                  .map((k) => (
                    <tr key={k}>
                      <td style={{ fontWeight: 600, width: 150, verticalAlign: "top", color: "#666" }}>{fieldLabels[k]}</td>
                      <td style={{ whiteSpace: "pre-wrap" }}>{k === "createdAt" ? fmtDate(viewRow[k]) : String(viewRow[k])}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}
        </ModalBody>
      </Modal>
    </EditorPage>
  );
};

export default SubmissionsInbox;
