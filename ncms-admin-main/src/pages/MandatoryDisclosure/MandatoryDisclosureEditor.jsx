import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Button } from "reactstrap";
import {
  FiImage,
  FiShield,
  FiLink,
  FiAward,
  FiFileText,
  FiFlag,
  FiCode,
  FiPlus,
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { getContent, updateContent } from "../../services/data.service";
import { canWritePage } from "../../store/slices/authSlice";
import ImageControl from "../../components/ImageControl";
import FileControl from "../../components/FileControl";
import {
  T,
  EditorPage,
  EditorHeader,
  TabRail,
  Panel,
  SectionHead,
  SaveBar,
  Callout,
  EmptyState,
  PrimaryButton,
  GhostButton,
  Field,
} from "../../components/editorKit";
import { GlobalUploadModal, GlobalConfirmModal } from "../../components/shared";

/* ================================================================== *
 * Mandatory Disclosure Editor — Content Manager
 * Manages the public Mandatory Disclosure page: page banner + the
 * policy / affiliation / report / campus document groups. Data shape
 * and API are unchanged — this is a UI redesign of the generic editor
 * to match the reference admin panel.
 * ================================================================== */

// ---- helpers --------------------------------------------------------

const clone = (v) => (v == null ? {} : JSON.parse(JSON.stringify(v)));

const get = (obj, path) => path.reduce((acc, k) => (acc == null ? acc : acc[k]), obj);

const setPath = (obj, path, value) => {
  const root = clone(obj);
  let cur = root;
  for (let i = 0; i < path.length - 1; i++) {
    const k = path[i];
    if (cur[k] == null || typeof cur[k] !== "object") {
      cur[k] = typeof path[i + 1] === "number" ? [] : {};
    }
    cur = cur[k];
  }
  cur[path[path.length - 1]] = value;
  return root;
};

// ---- tab definitions -------------------------------------------------

const GROUPS = [
  { key: "policies", label: "Policy Documents", icon: FiShield },
  { key: "quickLinks", label: "Quick Links", icon: FiLink, hasImage: true },
  { key: "affiliationOrders", label: "Affiliation Orders", icon: FiAward },
  { key: "reports", label: "Reports", icon: FiFileText },
  { key: "campusInitiatives", label: "Campus Initiatives", icon: FiFlag },
];

const TABS = [
  { id: "banner", label: "Page Banner", desc: "Title & image", icon: FiImage },
  ...GROUPS.map((g, i) => ({
    id: g.key,
    label: g.label,
    desc: "Document group",
    icon: g.icon,
  })),
  { id: "raw", label: "Advanced (Raw JSON)", desc: "Full content", icon: FiCode },
];

// ---- reusable pieces -------------------------------------------------

const ItemAction = ({ icon: Icon, danger, title, onClick, disabled }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    disabled={disabled}
    style={{
      width: 30,
      height: 30,
      borderRadius: 8,
      border: `1px solid ${danger ? T.dangerLine : T.line}`,
      background: "#fff",
      color: danger ? T.danger : T.ink,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1,
    }}
  >
    <Icon size={14} />
  </button>
);

const AddBtn = ({ children, onClick }) => (
  <Button
    type="button"
    onClick={onClick}
    style={{
      width: "100%",
      background: "transparent",
      color: T.ink,
      border: `1.5px dashed ${T.line}`,
      borderRadius: T.radiusSm,
      fontWeight: 700,
      fontSize: ".85rem",
      padding: ".65rem",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: ".45rem",
    }}
  >
    <FiPlus size={15} /> {children}
  </Button>
);

const PathField = ({ data, setData, path, label, hint, type, rows, placeholder }) => {
  const value = get(data, path);
  const isList = Array.isArray(value);
  const asString = value == null ? "" : isList ? value.join("\n") : String(value);
  return (
    <Field label={label} hint={hint}>
      {type === "textarea" ? (
        <textarea
          rows={rows || 3}
          value={asString}
          placeholder={placeholder}
          onChange={(e) => setData(setPath(data, path, isList ? e.target.value.split("\n") : e.target.value))}
          style={{
            width: "100%",
            borderRadius: T.radiusSm,
            border: `1px solid ${T.line}`,
            padding: ".6rem .8rem",
            fontSize: ".92rem",
            background: "#fff",
          }}
        />
      ) : (
        <input
          type={type || "text"}
          value={asString}
          placeholder={placeholder}
          onChange={(e) => setData(setPath(data, path, e.target.value))}
          style={{
            width: "100%",
            borderRadius: T.radiusSm,
            border: `1px solid ${T.line}`,
            padding: ".6rem .8rem",
            fontSize: ".92rem",
            background: "#fff",
          }}
        />
      )}
    </Field>
  );
};

// ---- editor ----------------------------------------------------------

const MandatoryDisclosureEditor = () => {
  const canWrite = useSelector((state) => canWritePage(state, "mandatoryDisclosure"));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState(null);
  const [tab, setTab] = useState("banner");
  const [rawText, setRawText] = useState("");
  const [rawError, setRawError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    setSavedAt(null);
    getContent("/api/mandatory-disclosure")
      .then((res) => setData(res?.data || res || {}))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tab === "raw" && data) setRawText(JSON.stringify(data, null, 2));
  }, [tab, data]);

  const stats = useMemo(() => {
    const docs = GROUPS.reduce((sum, g) => sum + (data?.[g.key]?.sections?.length || 0), 0);
    return [{ value: docs, label: "Documents" }];
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateContent("/api/mandatory-disclosure", data);
      setSavedAt(Date.now());
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const set = (path, value) => setData(setPath(data, path, value));

  const listAt = (path) => get(data, path) || [];

  const setSection = (key, index, next) => {
    const sections = listAt([key, "sections"]);
    set([key, "sections"], sections.map((s, i) => (i === index ? next : s)));
  };

  const addSection = (key) => {
    const sections = listAt([key, "sections"]);
    const maxId = sections.reduce((m, s) => Math.max(m, Number(s.id) || 0), 0);
    set([key, "sections"], [...sections, { id: maxId + 1, title: "", pdf: "" }]);
  };

  const removeSection = (key, index) => {
    set([key, "sections"], listAt([key, "sections"]).filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <EditorPage>
        <GlobalUploadModal />
        <GlobalConfirmModal />
        <Panel style={{ padding: "3rem", textAlign: "center" }}>
          <div style={{ minHeight: "30vh", display: "grid", placeItems: "center" }}>
            <span style={{ color: T.accent, fontWeight: 600 }}>Loading content…</span>
          </div>
        </Panel>
      </EditorPage>
    );
  }

  const d = data || {};
  const B = d.banner || {};

  return (
    <EditorPage>
      <GlobalUploadModal />
      <GlobalConfirmModal />
      <EditorHeader
        icon={FiShield}
        eyebrow="Content Manager"
        title="Mandatory Disclosure Editor"
        subtitle="Manage every section of the public Mandatory Disclosure page."
        stats={stats}
        mode={canWrite ? "edit" : undefined}
      />

      {error && <Callout tone="error">{error}</Callout>}
      {savedAt && <Callout tone="blue">Saved successfully.</Callout>}

      <div className="d-flex justify-content-end mb-3">
        <GhostButton icon={FiCode} onClick={() => setTab("raw")}>
          Raw JSON
        </GhostButton>
      </div>

      <Row className="g-4">
        <Col lg={3}>
          <TabRail tabs={TABS} activeTab={tab} onTab={setTab} />
        </Col>

        <Col lg={9}>
          {/* ---------------- PAGE BANNER ---------------- */}
          {tab === "banner" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead icon={FiImage} title="Page Banner" subtitle="Title and banner image shown at the top of the public Mandatory Disclosure page." />
              <PathField data={data} setData={setData} path={["banner", "title"]} label="Title" />
              <ImageControl label="Banner image" value={B.image || ""} onChange={(url) => set(["banner", "image"], url)} />
            </Panel>
          )}

          {/* ---------------- DOCUMENT GROUPS ---------------- */}
          {GROUPS.map((g) => {
            if (tab !== g.key) return null;
            const group = d[g.key] || {};
            const sections = group.sections || [];
            const Icon = g.icon;
            return (
              <Panel key={g.key} style={{ padding: "1.5rem" }}>
                <SectionHead
                  icon={Icon}
                  title={g.label}
                  subtitle={`Documents listed under this group on the public page.`}
                  right={
                    <Button
                      type="button"
                      onClick={() => addSection(g.key)}
                      style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
                    >
                      <FiPlus size={15} /> Add Document
                    </Button>
                  }
                />
                <PathField data={data} setData={setData} path={[g.key, "title"]} label="Group title" />
                {g.hasImage && (
                  <ImageControl
                    label="Group image"
                    value={group.image || ""}
                    onChange={(url) => set([g.key, "image"], url)}
                  />
                )}

                <div style={{ marginTop: "1.2rem" }}>
                  {sections.length === 0 && (
                    <EmptyState icon={Icon} title="No documents yet" hint="Add the first document to this group." />
                  )}
                  {sections.map((s, i) => (
                    <Panel
                      key={s.id ?? i}
                      style={{
                        padding: "1rem 1.1rem",
                        marginBottom: ".9rem",
                        boxShadow: T.shadowSoft,
                      }}
                    >
                      <div className="d-flex align-items-center" style={{ gap: 8, marginBottom: 12 }}>
                        <span style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: T.muted }}>
                          Document {i + 1}
                        </span>
                        <span style={{ flex: 1 }} />
                        <ItemAction icon={FiArrowUp} title="Move up" onClick={() => { /* move */ }} disabled />
                        <ItemAction icon={FiArrowDown} title="Move down" onClick={() => { /* move */ }} disabled />
                        <ItemAction icon={FiTrash2} danger title="Remove" onClick={() => removeSection(g.key, i)} />
                      </div>
                      <Row className="g-3">
                        <Col md={7}>
                          <Field label="Title">
                            <input
                              type="text"
                              value={s.title || ""}
                              placeholder="Document title"
                              onChange={(e) => setSection(g.key, i, { ...s, title: e.target.value })}
                              style={{ width: "100%", borderRadius: T.radiusSm, border: `1px solid ${T.line}`, padding: ".6rem .8rem", fontSize: ".92rem", background: "#fff" }}
                            />
                          </Field>
                        </Col>
                        <Col md={5}>
                          <FileControl
                            label="Document PDF"
                            value={s.pdf || ""}
                            onChange={(url) => setSection(g.key, i, { ...s, pdf: url })}
                          />
                        </Col>
                      </Row>
                    </Panel>
                  ))}
                  {sections.length > 0 && (
                    <AddBtn onClick={() => addSection(g.key)}>Add document</AddBtn>
                  )}
                </div>
              </Panel>
            );
          })}

          {/* ---------------- RAW JSON ---------------- */}
          {tab === "raw" && (
            <Panel style={{ padding: "1.75rem" }}>
              <SectionHead icon={FiCode} title="Advanced (Raw JSON)" subtitle="Full Mandatory Disclosure page content as JSON." />
              <p style={{ color: T.muted, fontSize: ".88rem" }}>
                Edit, then <strong>Apply</strong>, then <strong>Save</strong>.
              </p>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={26}
                style={{
                  width: "100%",
                  fontFamily: "monospace",
                  fontSize: ".8rem",
                  border: `1px solid ${T.line}`,
                  borderRadius: T.radiusSm,
                  padding: "1rem",
                  background: "#fff",
                }}
              />
              {rawError && <p className="text-danger mt-2" style={{ fontSize: ".85rem" }}>{rawError}</p>}
              <div className="mt-2 d-flex gap-2 flex-wrap">
                <GhostButton onClick={() => setRawText(JSON.stringify(data, null, 2))}>Reset</GhostButton>
                <PrimaryButton
                  onClick={() => {
                    try {
                      const parsed = JSON.parse(rawText);
                      setData(parsed);
                      setRawError("");
                    } catch (e) {
                      setRawError("Invalid JSON: " + e.message);
                    }
                  }}
                >
                  Apply JSON to form
                </PrimaryButton>
              </div>
            </Panel>
          )}
        </Col>
      </Row>

      <SaveBar
        saving={saving}
        onSave={handleSave}
        disabled={!canWrite}
        label={canWrite ? "Save All Changes" : "Read Only"}
        summary={canWrite ? `${stats[0].value} documents` : "You have read-only access to this page."}
      />
    </EditorPage>
  );
};

export default MandatoryDisclosureEditor;
