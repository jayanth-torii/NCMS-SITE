import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Button } from "reactstrap";
import {
  FiImage,
  FiGrid,
  FiZap,
  FiCode,
  FiPlus,
  FiArrowUp,
  FiArrowDown,
  FiTrash2,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { getContent, updateContent } from "../../services/data.service";
import { canWritePage } from "../../store/slices/authSlice";
import ImageControl from "../../components/ImageControl";
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
 * Departments Page Editor — Content Manager
 * Manages the public Departments landing page: banner hero, the
 * programme directory intro, and the Challenge Yourself image grid.
 * Content shape + API are unchanged — this is a UI redesign of the
 * generic editor to match the reference admin panel.
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

const TABS = [
  { id: "banner", label: "Banner", desc: "Hero banner & image", icon: FiImage },
  { id: "programmes", label: "Programmes", desc: "Directory intro", icon: FiGrid },
  { id: "challenge", label: "Challenge", desc: "Image grid", icon: FiZap },
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

const DepartmentsPageEditor = () => {
  const canWrite = useSelector((state) => canWritePage(state, "departmentsPage"));
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
    getContent("/api/departments-page")
      .then((res) => setData(res || {}))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tab === "raw" && data) setRawText(JSON.stringify(data, null, 2));
  }, [tab, data]);

  const stats = useMemo(() => {
    const sections = Object.keys(data?.programmes || {}).length;
    const images = data?.challenge?.images?.length || 0;
    return [
      { value: sections, label: "Sections" },
      { value: images, label: "Images" },
    ];
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateContent("/api/departments-page", data);
      setSavedAt(Date.now());
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const set = (path, value) => setData(setPath(data, path, value));

  // ---- array helpers ----
  const listAt = (path) => get(data, path) || [];

  const updateItem = (path, index, next) => {
    set(path, listAt(path).map((it, i) => (i === index ? next : it)));
  };

  const removeItem = (path, index) => {
    set(path, listAt(path).filter((_, i) => i !== index));
  };

  const moveItem = (path, index, dir) => {
    const arr = listAt(path).slice();
    const target = index + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    set(path, arr);
  };

  const addItem = (path, sample) => {
    set(path, [...listAt(path), clone(sample)]);
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
  const banner = d.bannerSection || {};
  const programmes = d.programmes || {};
  const challenge = d.challenge || {};
  const challengeImages = challenge.images || [];

  return (
    <EditorPage>
      <GlobalUploadModal />
      <GlobalConfirmModal />
      <EditorHeader
        icon={FiGrid}
        eyebrow="Content Manager"
        title="Departments Page Editor"
        subtitle="Manage every section of the public Departments page."
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
          {/* ---------------- BANNER ---------------- */}
          {tab === "banner" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead icon={FiImage} title="Banner" subtitle="Top hero banner shown at the top of the Departments page." />
              <PathField data={data} setData={setData} path={["bannerSection", "title"]} label="Title" />
              <ImageControl label="Banner image" value={banner.image || ""} onChange={(url) => set(["bannerSection", "image"], url)} />
            </Panel>
          )}

          {/* ---------------- PROGRAMMES ---------------- */}
          {tab === "programmes" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead icon={FiGrid} title="Programmes" subtitle="Intro copy and image for the programme directory section." />
              <PathField data={data} setData={setData} path={["programmes", "title"]} label="Title" />
              <PathField data={data} setData={setData} path={["programmes", "description"]} label="Description" type="textarea" rows={3} />
              <ImageControl label="Programme image" value={programmes.image || ""} onChange={(url) => set(["programmes", "image"], url)} />
            </Panel>
          )}

          {/* ---------------- CHALLENGE ---------------- */}
          {tab === "challenge" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead
                icon={FiZap}
                title="Challenge Yourself"
                subtitle="Heading, intro copy and the image grid for the challenge section."
                right={
                  <Button
                    type="button"
                    onClick={() => addItem(["challenge", "images"], { alt: "", text: "", image: "" })}
                    style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
                  >
                    <FiPlus size={15} /> Add Image
                  </Button>
                }
              />
              <PathField data={data} setData={setData} path={["challenge", "title"]} label="Title" />
              <PathField data={data} setData={setData} path={["challenge", "description"]} label="Description" type="textarea" rows={3} />

              <div style={{ marginTop: "1.2rem" }}>
                {challengeImages.length === 0 && (
                  <EmptyState icon={FiZap} title="No images yet" hint="Add your first challenge image." />
                )}
                {challengeImages.map((img, i) => (
                  <Panel
                    key={i}
                    style={{
                      padding: "1rem 1.1rem",
                      marginBottom: ".9rem",
                      boxShadow: T.shadowSoft,
                    }}
                  >
                    <div className="d-flex align-items-center" style={{ gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: T.muted }}>
                        Image {i + 1}
                      </span>
                      <span style={{ flex: 1 }} />
                      <ItemAction icon={FiArrowUp} title="Move up" onClick={() => moveItem(["challenge", "images"], i, -1)} disabled={i === 0} />
                      <ItemAction icon={FiArrowDown} title="Move down" onClick={() => moveItem(["challenge", "images"], i, 1)} disabled={i === challengeImages.length - 1} />
                      <ItemAction icon={FiTrash2} danger title="Remove" onClick={() => removeItem(["challenge", "images"], i)} />
                    </div>
                    <Row className="g-3">
                      <Col md={6}>
                        <PathField data={data} setData={setData} path={["challenge", "images", i, "alt"]} label="Alt text" />
                      </Col>
                      <Col md={6}>
                        <PathField data={data} setData={setData} path={["challenge", "images", i, "text"]} label="Caption (optional)" />
                      </Col>
                    </Row>
                    <ImageControl
                      label="Image"
                      value={img.image || ""}
                      onChange={(url) => updateItem(["challenge", "images"], i, { ...img, image: url })}
                    />
                  </Panel>
                ))}
                {challengeImages.length > 0 && (
                  <AddBtn onClick={() => addItem(["challenge", "images"], { alt: "", text: "", image: "" })}>
                    Add image
                  </AddBtn>
                )}
              </div>
            </Panel>
          )}

          {/* ---------------- RAW JSON ---------------- */}
          {tab === "raw" && (
            <Panel style={{ padding: "1.75rem" }}>
              <SectionHead icon={FiCode} title="Advanced (Raw JSON)" subtitle="Full Departments page content as JSON." />
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
        summary={canWrite ? `${stats[0].value} sections · ${stats[1].value} images` : "You have read-only access to this page."}
      />
    </EditorPage>
  );
};

export default DepartmentsPageEditor;
