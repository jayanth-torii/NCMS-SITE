import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { uploadFile } from "../services/data.service";

// Convert a stored media path into a previewable URL.
// - Backend-uploaded files (/uploads/..) live on the API host (port 4001).
// - Everything else (images/pdfs/...) also resolves against the backend host,
//   which proxies the web's public folder — so previews always work in admin.
const API_BASE = (
  process.env.REACT_APP_DATABASEURL ||
  process.env.REACT_APP_BACKENDURL ||
  "http://localhost:4001"
).replace(/\/+$/, "");

export const getPreviewUrl = (url) => {
  if (!url) return "";
  const webUrl = String(url).replace(/\\/g, "/");
  if (/^https?:\/\//i.test(webUrl)) return webUrl;
  if (webUrl.startsWith("/uploads")) return `${API_BASE}${webUrl}`;
  return `${API_BASE}${webUrl.startsWith("/") ? webUrl : `/${webUrl}`}`;
};

// Global upload-modal bridge: any nested card can request an upload and receive
// the resulting URL via callback. The host page must render <GlobalUploadModal/>.
let openGlobalUploadModal = null;

export const triggerUpload = (callback) => {
  if (openGlobalUploadModal) {
    openGlobalUploadModal(callback);
  } else {
    console.warn("Upload modal not initialized yet.");
  }
};

export const GlobalUploadModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [callback, setCallback] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    openGlobalUploadModal = (cb) => {
      setCallback(() => cb);
      setFile(null);
      setIsOpen(true);
    };
    return () => {
      openGlobalUploadModal = null;
    };
  }, []);

  const close = () => {
    setIsOpen(false);
    setFile(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);
      const res = await uploadFile(file);
      const url = res?.data?.url || res?.data?.data?.url;
      if (url && callback) callback(url);
      close();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={close} centered backdrop="static">
      <ModalHeader toggle={close}>Upload File</ModalHeader>
      <ModalBody>
        <div
          style={{
            border: "2px dashed #e0e5fa",
            borderRadius: "12px",
            padding: "2.5rem 1rem",
            textAlign: "center",
            background: "#f8f9fa",
          }}
        >
          <h5>Select a file to upload</h5>
          <p className="text-muted small mb-3">Supports Images and PDFs</p>
          <div className="d-flex justify-content-center">
            <input
              type="file"
              accept="image/*,application/pdf"
              className="form-control w-75"
              onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
            />
          </div>
          {file && (
            <p className="mt-3 mb-0 text-success" style={{ fontWeight: 600 }}>
              {file.name}
            </p>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={close} disabled={uploading}>
          Cancel
        </Button>
        <Button
          style={{ background: "#0e2455", color: "#fff", border: "none" }}
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? <Spinner size="sm" /> : "Upload File"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

// ---- Global confirmation modal (imperative, promise-based) ----------------
let openGlobalConfirmModal = null;

export const confirmAction = (opts = {}) =>
  new Promise((resolve) => {
    if (openGlobalConfirmModal) openGlobalConfirmModal(opts, resolve);
    else resolve(window.confirm(opts.message || "Are you sure?"));
  });

export const GlobalConfirmModal = () => {
  const [state, setState] = useState({ isOpen: false, opts: {}, resolve: null });

  useEffect(() => {
    openGlobalConfirmModal = (opts, resolve) => setState({ isOpen: true, opts: opts || {}, resolve });
    return () => {
      openGlobalConfirmModal = null;
    };
  }, []);

  const finish = (result) => {
    setState((s) => {
      if (s.resolve) s.resolve(result);
      return { ...s, isOpen: false, resolve: null };
    });
  };

  const { title, message, confirmLabel, tone } = state.opts;

  return (
    <Modal isOpen={state.isOpen} toggle={() => finish(false)} centered>
      <ModalHeader toggle={() => finish(false)}>{title || "Please confirm"}</ModalHeader>
      <ModalBody>
        {message || "Are you sure you want to delete this? This action cannot be undone."}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={() => finish(false)}>
          Cancel
        </Button>
        <Button color={tone === "primary" ? "primary" : "danger"} onClick={() => finish(true)}>
          {confirmLabel || "Delete"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

// Reusable image upload/preview control bound to a string value.
export const ImageControl = ({ label, value, onChange }) => (
  <FormGroup className="mb-3">
    {label && <Label style={{ fontWeight: 600, fontSize: "0.8rem" }}>{label}</Label>}
    <div
      style={{
        border: "1px solid #e0e5fa",
        borderRadius: "8px",
        padding: "0.75rem",
        background: "#fff",
      }}
    >
      {value ? (
        <img
          src={getPreviewUrl(value)}
          alt="preview"
          style={{
            width: "100%",
            height: "180px",
            objectFit: "contain",
            background: "#f8f9fa",
            borderRadius: "6px",
            marginBottom: "0.5rem",
          }}
        />
      ) : (
        <div
          style={{
            height: "120px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9aa0b4",
            background: "#f8f9fa",
            borderRadius: "6px",
            marginBottom: "0.5rem",
          }}
        >
          No image
        </div>
      )}
      <div className="d-flex gap-2">
        <Button type="button" size="sm" outline color="primary" onClick={() => triggerUpload(onChange)}>
          {value ? "Change" : "Upload"}
        </Button>
        {value && (
          <Button
            type="button"
            size="sm"
            outline
            color="danger"
            onClick={async () => {
              if (await confirmAction({ title: "Remove image", message: "Remove this image?", confirmLabel: "Remove" })) onChange("");
            }}
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  </FormGroup>
);

// Editable list of images — grid of previews with Change/Remove + add button.
export const ImageListControl = ({ label, values = [], onChange, addLabel = "+ Add image" }) => {
  const list = Array.isArray(values) ? values : [];
  const setAt = (i, url) => {
    const next = list.slice();
    if (url === "" || url == null) next.splice(i, 1);
    else next[i] = url;
    onChange(next);
  };
  const add = () => triggerUpload((url) => onChange([...list, url]));
  return (
    <FormGroup className="mb-3">
      {label && <Label style={{ fontWeight: 600, fontSize: "0.8rem" }}>{label}</Label>}
      <div className="d-flex flex-wrap gap-2">
        {list.map((src, i) => (
          <div key={i} style={{ width: 160 }}>
            <ImageControl value={src} onChange={(url) => setAt(i, url)} />
          </div>
        ))}
      </div>
      <Button type="button" size="sm" outline color="primary" onClick={add}>{addLabel}</Button>
    </FormGroup>
  );
};

// File (PDF/doc) control — View + Upload/Change + Edit link + Remove.
export const FileControl = ({ label, value, onChange, placeholder }) => {
  const [editing, setEditing] = useState(false);
  return (
    <FormGroup className="mb-2">
      {label && <Label style={{ fontWeight: 600, fontSize: "0.8rem" }}>{label}</Label>}
      <div style={{ border: "1px solid #e0e5fa", borderRadius: "8px", padding: "0.5rem 0.6rem", background: "#fff" }}>
        {value ? (
          <button type="button" onClick={() => window.open(getPreviewUrl(value), "_blank", "noopener,noreferrer")} className="mb-2 view-btn" style={{ fontWeight: 600, fontSize: "0.82rem" }}>
            View
          </button>
        ) : (
          <div className="text-muted mb-2" style={{ fontSize: "0.8rem" }}>{placeholder || "No file"}</div>
        )}
        {editing && (
          <Input
            type="text"
            bsSize="sm"
            className="mb-2"
            value={value || ""}
            placeholder="Paste or edit the file URL / path"
            onChange={(e) => onChange(e.target.value)}
            style={{ fontSize: "0.8rem", wordBreak: "break-all" }}
          />
        )}
        <div className="d-flex gap-2">
          <Button type="button" size="sm" outline color="primary" onClick={() => triggerUpload(onChange)}>
            {value ? "Change" : "Upload"}
          </Button>
          <Button type="button" size="sm" outline color={editing ? "secondary" : "info"} onClick={() => setEditing((v) => !v)}>
            {editing ? "Done" : "Edit link"}
          </Button>
          {value && (
            <Button
              type="button"
              size="sm"
              outline
              color="danger"
              onClick={async () => {
                if (await confirmAction({ title: "Remove file", message: "Remove this file?", confirmLabel: "Remove" })) onChange("");
              }}
            >
              Remove
            </Button>
          )}
        </div>
      </div>
    </FormGroup>
  );
};

// Normalize varied service response shapes into the inner document.
export const unwrapDoc = (response) => {
  if (!response) return null;
  if (response.data && !Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.data) && response.data.length) return response.data[0];
  if (Array.isArray(response) && response.length) return response[0];
  if (response._id) return response;
  return null;
};

export const unwrapList = (response) => {
  if (!response) return [];
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response)) return response;
  return [];
};
