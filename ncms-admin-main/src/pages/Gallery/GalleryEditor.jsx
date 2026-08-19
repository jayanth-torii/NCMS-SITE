import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Button } from "reactstrap";
import {
  FiImage,
  FiFolder,
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
} from "../../components/editorLayout";
import { GlobalUploadModal, GlobalConfirmModal } from "../../components/shared";
import "./gallery.scss";

/* ================================================================== *
 * Gallery Editor — Content Manager
 * Manages the public Gallery page: banner hero + photo categories.
 * Categories are a dynamic object of name -> image list, so this
 * editor lets you add / rename / delete categories and curate each
 * category's photo grid.
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
  { id: "categories", label: "Categories", desc: "Photo galleries", icon: FiFolder },
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

const GalleryEditor = () => {
  const canWrite = useSelector((state) => canWritePage(state, "gallery"));
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
    getContent("/api/gallery")
      .then((res) => setData(res || {}))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tab === "raw" && data) setRawText(JSON.stringify(data, null, 2));
  }, [tab, data]);

  const stats = useMemo(() => {
    const cats = Object.keys(data?.imageData || {}).length;
    const photos = Object.values(data?.imageData || {}).reduce((sum, arr) => sum + (arr || []).length, 0);
    return [
      { value: cats, label: "Categories" },
      { value: photos, label: "Photos" },
    ];
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateContent("/api/gallery", data);
      setSavedAt(Date.now());
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const set = (path, value) => setData(setPath(data, path, value));

  // ---- category helpers (imageData is an object: name -> [urls]) ----
  const categories = () => {
    const obj = get(data, ["imageData"]) || {};
    return Object.entries(obj).map(([name, images]) => ({ name, images: images || [] }));
  };

  const setCategories = (entries) => {
    const next = {};
    entries.forEach(({ name, images }) => {
      next[name || "Untitled"] = images;
    });
    set(["imageData"], next);
  };

  const addCategory = () => {
    setCategories([...categories(), { name: "", images: [] }]);
  };

  const renameCategory = (index, name) => {
    setCategories(categories().map((c, i) => (i === index ? { ...c, name } : c)));
  };

  const removeCategory = (index) => {
    setCategories(categories().filter((_, i) => i !== index));
  };

  const addPhoto = (index) => {
    setCategories(categories().map((c, i) => (i === index ? { ...c, images: [...c.images, ""] } : c)));
  };

  const removePhoto = (index, photoIndex) => {
    setCategories(
      categories().map((c, i) =>
        i === index ? { ...c, images: c.images.filter((_, x) => x !== photoIndex) } : c
      )
    );
  };

  const changePhoto = (index, photoIndex, url) => {
    setCategories(
      categories().map((c, i) =>
        i === index ? { ...c, images: c.images.map((img, x) => (x === photoIndex ? url : img)) } : c
      )
    );
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
  const banner = d.banner || {};
  const cats = categories();
  const photoCount = cats.reduce((sum, c) => sum + c.images.length, 0);

  return (
    <EditorPage>
      <GlobalUploadModal />
      <GlobalConfirmModal />
      <EditorHeader
        icon={FiImage}
        eyebrow="Content Manager"
        title="Gallery Editor"
        subtitle="Manage every section of the public Gallery page."
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
              <SectionHead icon={FiImage} title="Banner" subtitle="Top hero banner shown at the top of the Gallery page." />
              <PathField data={data} setData={setData} path={["banner", "title"]} label="Title" />
              <PathField data={data} setData={setData} path={["banner", "description"]} label="Description" type="textarea" rows={4} />
              <ImageControl label="Banner image" value={banner.imageSrc || ""} onChange={(url) => set(["banner", "imageSrc"], url)} />
            </Panel>
          )}

          {/* ---------------- CATEGORIES ---------------- */}
          {tab === "categories" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead
                icon={FiFolder}
                title="Photo Categories"
                subtitle="Each category is a section on the public gallery page with its own photo grid."
                right={
                  <Button
                    type="button"
                    onClick={addCategory}
                    style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
                  >
                    <FiPlus size={15} /> Add Category
                  </Button>
                }
              />

              {cats.length === 0 && (
                <EmptyState icon={FiFolder} title="No categories yet" hint="Add your first photo category." />
              )}

              {cats.map((cat, i) => (
                <Panel
                  key={i}
                  style={{
                    padding: "1rem 1.1rem",
                    marginBottom: ".9rem",
                    boxShadow: T.shadowSoft,
                  }}
                >
                  <div className="d-flex align-items-center" style={{ gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                    <FiFolder size={16} style={{ color: T.muted, flex: "0 0 auto" }} />
                    <input
                      type="text"
                      value={cat.name}
                      placeholder="Category name"
                      onChange={(e) => renameCategory(i, e.target.value)}
                      style={{
                        flex: "1 1 180px",
                        minWidth: 180,
                        borderRadius: T.radiusSm,
                        border: `1px solid ${T.line}`,
                        padding: ".5rem .7rem",
                        fontSize: ".9rem",
                        background: "#fff",
                      }}
                    />
                    <span style={{ flex: 1 }} />
                    <ItemAction
                      icon={FiPlus}
                      title="Add photo"
                      onClick={() => addPhoto(i)}
                    />
                    <ItemAction
                      icon={FiTrash2}
                      danger
                      title="Remove category"
                      onClick={() => removeCategory(i)}
                    />
                  </div>

                  <div className="gal-grid" style={{ marginTop: ".4rem" }}>
                    {cat.images.map((img, j) => (
                      <div key={j} className="gal-thumb">
                        <ImageControl
                          label={`Photo ${j + 1}`}
                          value={img || ""}
                          onChange={(url) => changePhoto(i, j, url)}
                        />
                        <div className="d-flex justify-content-end mt-1">
                          <ItemAction
                            icon={FiTrash2}
                            danger
                            title="Remove photo"
                            onClick={() => removePhoto(i, j)}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="gal-thumb gal-thumb--add" onClick={() => addPhoto(i)} style={{ cursor: "pointer" }}>
                      <FiPlus size={22} />
                      <span>Add Photo</span>
                    </div>
                  </div>
                  {cat.images.length === 0 && (
                    <p style={{ color: T.muted, fontSize: ".82rem", marginTop: ".6rem" }}>
                      No photos in this category yet.
                    </p>
                  )}
                </Panel>
              ))}

              {cats.length > 0 && (
                <AddBtn onClick={addCategory}>Add category</AddBtn>
              )}
            </Panel>
          )}

          {/* ---------------- RAW JSON ---------------- */}
          {tab === "raw" && (
            <Panel style={{ padding: "1.75rem" }}>
              <SectionHead icon={FiCode} title="Advanced (Raw JSON)" subtitle="Full Gallery page content as JSON." />
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
        summary={canWrite ? `${cats.length} categories · ${photoCount} photos` : "You have read-only access to this page."}
      />
    </EditorPage>
  );
};

export default GalleryEditor;
