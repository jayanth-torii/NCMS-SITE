import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Button } from "reactstrap";
import {
  FiImage,
  FiInfo,
  FiList,
  FiGrid,
  FiShield,
  FiClock,
  FiTable,
  FiCode,
  FiPlus,
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
  FiEye,
  FiFlag,
  FiLink,
  FiLayers,
  FiTarget,
  FiFileText,
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
import "./library.scss";

/* ================================================================== *
 * Library Editor — Content Manager
 * Manages the public Library page: banner, about & vision, objectives
 * & rules, gallery, policies & composition, timings & services and
 * the collections statistics table. Content shape and API are
 * unchanged — this is a UI redesign of the generic editor to match
 * the reference admin panel.
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

// ---- tab definitions (mirrors the public page structure) ---------------

const TABS = [
  { id: "banner", label: "Banner", desc: "Hero & image", icon: FiImage },
  { id: "about", label: "About & Vision", desc: "Intro & statements", icon: FiInfo },
  { id: "accordion", label: "Objectives & Rules", desc: "Accordion blocks", icon: FiList },
  { id: "gallery", label: "Gallery", desc: "Photo gallery", icon: FiGrid },
  { id: "policies", label: "Policies & Composition", desc: "Docs & image", icon: FiShield },
  { id: "overview", label: "Timings & Services", desc: "Overview blocks", icon: FiClock },
  { id: "collections", label: "Collections", desc: "Stats table", icon: FiTable },
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

const LibraryEditor = () => {
  const canWrite = useSelector((state) => canWritePage(state, "library"));
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
    getContent("/api/library")
      .then((res) => setData(res || {}))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tab === "raw" && data) setRawText(JSON.stringify(data, null, 2));
  }, [tab, data]);

  const stats = useMemo(() => {
    const gallery = data?.Our_Gallery?.images?.length || 0;
    const blocks = data?.Library_OverView?.OverViewContent?.length || 0;
    return [
      { value: gallery, label: "Images" },
      { value: blocks, label: "Blocks" },
    ];
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateContent("/api/library", data);
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
  const BAN = d.BannerSection || {};
  const AV = d.AboutVisionMissionSections || {};
  const ABOUT = AV.AboutSection || {};
  const VM = AV.VisionMission || {};
  const ACC = AV.AccordionSections || [];
  const GAL = d.Our_Gallery || {};
  const POL = d.Policies_And_Composition || {};
  const OV = d.Library_OverView || {};
  const OVERVIEW = OV.OverViewContent || [];
  const COLL = OV.Collections || {};
  const collColumns = COLL.Columns || [];
  const collRows = COLL.Rows || [];

  const setCollections = (next) => set(["Library_OverView", "Collections"], next);

  const setCol = (i, v) => {
    const next = collColumns.slice();
    next[i] = v;
    setCollections({ ...COLL, Columns: next });
  };

  const setCell = (ri, ci, v) =>
    setCollections({
      ...COLL,
      Rows: collRows.map((r, i) => (i === ri ? r.map((c, x) => (x === ci ? v : c)) : r)),
    });

  const addRow = () =>
    setCollections({ ...COLL, Rows: [...collRows, collColumns.map(() => "")] });

  const removeRow = (ri) =>
    setCollections({ ...COLL, Rows: collRows.filter((_, i) => i !== ri) });

  const addCol = () =>
    setCollections({
      ...COLL,
      Columns: [...collColumns, "New Column"],
      Rows: collRows.map((r) => [...r, ""]),
    });

  const removeCol = (ci) =>
    setCollections({
      ...COLL,
      Columns: collColumns.filter((_, i) => i !== ci),
      Rows: collRows.map((r) => r.filter((_, i) => i !== ci)),
    });

  return (
    <EditorPage>
      <GlobalUploadModal />
      <GlobalConfirmModal />
      <EditorHeader
        icon={FiTable}
        eyebrow="Content Manager"
        title="Library Editor"
        subtitle="Manage every section of the public Library page."
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
              <SectionHead icon={FiImage} title="Banner Section" subtitle="The page heading and hero image shown at the top of the public Library page." />
              <PathField data={data} setData={setData} path={["BannerSection", "title"]} label="Title" />
              <ImageControl label="Banner image" value={BAN.image || ""} onChange={(url) => set(["BannerSection", "image"], url)} />
            </Panel>
          )}

          {/* ---------------- ABOUT & VISION ---------------- */}
          {tab === "about" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead icon={FiInfo} title="About & Vision" subtitle="The intro heading, paragraphs and the vision & mission statements." />
              <Row className="g-4">
                <Col lg={6}>
                  <PathField data={data} setData={setData} path={["AboutVisionMissionSections", "AboutSection", "title"]} label="Title" />
                  <PathField
                    data={data}
                    setData={setData}
                    path={["AboutVisionMissionSections", "AboutSection", "descriptions"]}
                    label="Descriptions (one per line)"
                    type="textarea"
                    rows={10}
                    hint="Each line becomes a separate paragraph."
                  />
                </Col>
                <Col lg={6}>
                  <PathField data={data} setData={setData} path={["AboutVisionMissionSections", "VisionMission", "title"]} label="Section title" />
                  {(VM.VMSections || []).map((sec, i) => (
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
                          {sec.title || (i === 0 ? "Vision" : "Mission")}
                        </span>
                        <span style={{ flex: 1 }} />
                        <ItemAction icon={FiTrash2} danger title="Remove" onClick={() => removeItem(["AboutVisionMissionSections", "VisionMission", "VMSections"], i)} />
                      </div>
                      <PathField data={data} setData={setData} path={["AboutVisionMissionSections", "VisionMission", "VMSections", i, "title"]} label="Section title" />
                      <PathField
                        data={data}
                        setData={setData}
                        path={["AboutVisionMissionSections", "VisionMission", "VMSections", i, "description"]}
                        label="Description"
                        type="textarea"
                        rows={2}
                      />
                      <PathField
                        data={data}
                        setData={setData}
                        path={["AboutVisionMissionSections", "VisionMission", "VMSections", i, "ListPoints"]}
                        label="Points (one per line)"
                        type="textarea"
                        rows={3}
                      />
                    </Panel>
                  ))}
                  {(!VM.VMSections || VM.VMSections.length === 0) && (
                    <EmptyState icon={FiTarget} title="No vision / mission sections yet" hint="Add your first statement card." />
                  )}
                  <AddBtn onClick={() => addItem(["AboutVisionMissionSections", "VisionMission", "VMSections"], { title: "", description: "", ListPoints: [] })}>
                    Add section
                  </AddBtn>
                </Col>
              </Row>
            </Panel>
          )}

          {/* ---------------- OBJECTIVES & RULES ---------------- */}
          {tab === "accordion" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead
                icon={FiList}
                title="Objectives & Rules"
                subtitle="Accordion blocks (Objectives, General Instructions, ...) shown on the public page."
                right={
                  <Button
                    type="button"
                    onClick={() => addItem(["AboutVisionMissionSections", "AccordionSections"], { title: "", points: [] })}
                    style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
                  >
                    <FiPlus size={15} /> Add Section
                  </Button>
                }
              />
              <div style={{ marginTop: "1.2rem" }}>
                {ACC.length === 0 && (
                  <EmptyState icon={FiList} title="No accordion sections yet" hint="Add your first objectives & rules block." />
                )}
                {ACC.map((sec, i) => (
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
                        {sec.title || `Section ${i + 1}`}
                      </span>
                      <span style={{ flex: 1 }} />
                      <ItemAction icon={FiTrash2} danger title="Remove" onClick={() => removeItem(["AboutVisionMissionSections", "AccordionSections"], i)} />
                    </div>
                    <Row className="g-3">
                      <Col md={5}>
                        <PathField data={data} setData={setData} path={["AboutVisionMissionSections", "AccordionSections", i, "title"]} label="Section title" />
                      </Col>
                      <Col md={7}>
                        <PathField
                          data={data}
                          setData={setData}
                          path={["AboutVisionMissionSections", "AccordionSections", i, "points"]}
                          label="Points (one per line)"
                          type="textarea"
                          rows={6}
                        />
                      </Col>
                    </Row>
                  </Panel>
                ))}
                {ACC.length > 0 && (
                  <AddBtn onClick={() => addItem(["AboutVisionMissionSections", "AccordionSections"], { title: "", points: [] })}>
                    Add section
                  </AddBtn>
                )}
              </div>
            </Panel>
          )}

          {/* ---------------- GALLERY ---------------- */}
          {tab === "gallery" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead
                icon={FiGrid}
                title="Gallery"
                subtitle="The library photo gallery shown at the bottom of the public page."
                right={
                  <Button
                    type="button"
                    onClick={() => addItem(["Our_Gallery", "images"], "")}
                    style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
                  >
                    <FiPlus size={15} /> Add Image
                  </Button>
                }
              />
              <PathField data={data} setData={setData} path={["Our_Gallery", "title"]} label="Section title" />
              <div style={{ marginTop: "1.2rem" }}>
                {(!GAL.images || GAL.images.length === 0) && (
                  <EmptyState icon={FiGrid} title="No gallery images yet" hint="Add your first library photo." />
                )}
                {(GAL.images || []).map((img, i) => (
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
                      <ItemAction icon={FiArrowUp} title="Move up" onClick={() => { /* move */ }} disabled />
                      <ItemAction icon={FiArrowDown} title="Move down" onClick={() => { /* move */ }} disabled />
                      <ItemAction icon={FiTrash2} danger title="Remove" onClick={() => removeItem(["Our_Gallery", "images"], i)} />
                    </div>
                    <ImageControl label="Image" value={img || ""} onChange={(v) => updateItem(["Our_Gallery", "images"], i, v)} />
                  </Panel>
                ))}
                {(GAL.images || []).length > 0 && (
                  <AddBtn onClick={() => addItem(["Our_Gallery", "images"], "")}>Add image</AddBtn>
                )}
              </div>
            </Panel>
          )}

          {/* ---------------- POLICIES & COMPOSITION ---------------- */}
          {tab === "policies" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead icon={FiShield} title="Policies & Composition" subtitle="Section intro, image and the two downloadable documents." />
              <Row className="g-4">
                <Col lg={5}>
                  <PathField data={data} setData={setData} path={["Policies_And_Composition", "title"]} label="Section title" />
                  <PathField data={data} setData={setData} path={["Policies_And_Composition", "description"]} label="Description" type="textarea" rows={2} />
                  <ImageControl label="Section image" value={POL.image || ""} onChange={(url) => set(["Policies_And_Composition", "image"], url)} />
                </Col>
                <Col lg={7}>
                  {[
                    { label: "Policy", titleKey: "DocumentTitle1", pdfKey: "Document1" },
                    { label: "Composition", titleKey: "DocumentTitle2", pdfKey: "Document2" },
                  ].map((doc, i) => (
                    <Panel
                      key={i}
                      style={{
                        padding: "1rem 1.1rem",
                        marginBottom: ".9rem",
                        boxShadow: T.shadowSoft,
                      }}
                    >
                      <span style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: T.muted }}>
                        {doc.label} Document
                      </span>
                      <div className="mt-2">
                        <PathField
                          data={data}
                          setData={setData}
                          path={["Policies_And_Composition", doc.titleKey]}
                          label="Button label"
                          placeholder={`e.g. View ${doc.label}`}
                        />
                        <FileControl
                          label="PDF document"
                          value={POL[doc.pdfKey] || ""}
                          onChange={(url) => set(["Policies_And_Composition", doc.pdfKey], url)}
                        />
                      </div>
                    </Panel>
                  ))}
                </Col>
              </Row>
            </Panel>
          )}

          {/* ---------------- TIMINGS & SERVICES ---------------- */}
          {tab === "overview" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead
                icon={FiClock}
                title="Timings & Services"
                subtitle="Overview blocks (Timings, Library Service, Electronic Surveillance, ...) with sub-sections and bullet points."
                right={
                  <Button
                    type="button"
                    onClick={() => addItem(["Library_OverView", "OverViewContent"], { title: "", Sections: [] })}
                    style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
                  >
                    <FiPlus size={15} /> Add Block
                  </Button>
                }
              />
              <PathField data={data} setData={setData} path={["Library_OverView", "title"]} label="Section title" />
              <div style={{ marginTop: "1.2rem" }}>
                {OVERVIEW.length === 0 && (
                  <EmptyState icon={FiClock} title="No overview blocks yet" hint="Add your first timings & services block." />
                )}
                {OVERVIEW.map((block, i) => (
                  <Panel
                    key={i}
                    style={{
                      padding: "1rem 1.1rem",
                      marginBottom: "1.2rem",
                      boxShadow: T.shadowSoft,
                    }}
                  >
                    <div className="d-flex align-items-center" style={{ gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: T.muted }}>
                        {block.title || `Block ${i + 1}`}
                      </span>
                      <span style={{ flex: 1 }} />
                      <ItemAction icon={FiTrash2} danger title="Remove" onClick={() => removeItem(["Library_OverView", "OverViewContent"], i)} />
                    </div>
                    <PathField data={data} setData={setData} path={["Library_OverView", "OverViewContent", i, "title"]} label="Block title" />

                    <div className="d-flex align-items-center justify-content-between mt-3 mb-2">
                      <span style={{ fontSize: ".8rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: T.muted }}>
                        Sections ({(block.Sections || []).length})
                      </span>
                      <Button
                        type="button"
                        onClick={() =>
                          updateItem(["Library_OverView", "OverViewContent"], i, {
                            ...block,
                            Sections: [...(block.Sections || []), { title: "", Points: [] }],
                          })
                        }
                        style={{ background: "transparent", color: T.ink, border: `1.5px dashed ${T.line}`, borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".8rem", padding: ".35rem .8rem", display: "inline-flex", alignItems: "center", gap: ".35rem" }}
                      >
                        <FiPlus size={14} /> Add Section
                      </Button>
                    </div>

                    {(block.Sections || []).map((sec, j) => (
                      <Panel
                        key={j}
                        style={{
                          padding: "1rem 1.1rem",
                          marginBottom: ".7rem",
                          background: "#fafbff",
                          boxShadow: "none",
                          border: `1px solid ${T.line}`,
                        }}
                      >
                        <div className="d-flex align-items-center" style={{ gap: 8, marginBottom: 12 }}>
                          <FiList size={14} style={{ color: T.muted }} />
                          <span style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: T.muted }}>
                            {sec.title || `Section ${j + 1}`}
                          </span>
                          <span style={{ flex: 1 }} />
                          <ItemAction
                            icon={FiTrash2}
                            danger
                            title="Remove section"
                            onClick={() =>
                              updateItem(["Library_OverView", "OverViewContent"], i, {
                                ...block,
                                Sections: (block.Sections || []).filter((_, x) => x !== j),
                              })
                            }
                          />
                        </div>
                        <Row className="g-3">
                          <Col md={5}>
                            <PathField data={data} setData={setData} path={["Library_OverView", "OverViewContent", i, "Sections", j, "title"]} label="Section title" />
                          </Col>
                          <Col md={7}>
                            <PathField
                              data={data}
                              setData={setData}
                              path={["Library_OverView", "OverViewContent", i, "Sections", j, "Points"]}
                              label="Points (one per line)"
                              type="textarea"
                              rows={5}
                            />
                          </Col>
                        </Row>
                      </Panel>
                    ))}
                    {(!block.Sections || block.Sections.length === 0) && (
                      <p style={{ color: T.muted, fontSize: ".82rem" }}>No sub-sections added yet.</p>
                    )}
                  </Panel>
                ))}
                {OVERVIEW.length > 0 && (
                  <AddBtn onClick={() => addItem(["Library_OverView", "OverViewContent"], { title: "", Sections: [] })}>
                    Add block
                  </AddBtn>
                )}
              </div>
            </Panel>
          )}

          {/* ---------------- COLLECTIONS ---------------- */}
          {tab === "collections" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead icon={FiTable} title="Collections" subtitle="The books / e-resources statistics table with its column headers." />
              <PathField data={data} setData={setData} path={["Library_OverView", "Collections", "title"]} label="Table title" />

              <div className="d-flex align-items-center justify-content-between mt-3 mb-2">
                <span style={{ fontSize: ".8rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: T.muted }}>
                  Columns ({collColumns.length})
                </span>
                <Button
                  type="button"
                  onClick={addCol}
                  style={{ background: "transparent", color: T.ink, border: `1.5px dashed ${T.line}`, borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".8rem", padding: ".35rem .8rem", display: "inline-flex", alignItems: "center", gap: ".35rem" }}
                >
                  <FiPlus size={14} /> Add Column
                </Button>
              </div>

              {collColumns.length > 0 ? (
                <div className="lib-table-wrap">
                  <table className="lib-table">
                    <thead>
                      <tr>
                        {collColumns.map((col, ci) => (
                          <th key={ci}>
                            <div className="lib-col-head">
                              <input
                                type="text"
                                value={col || ""}
                                placeholder={`Column ${ci + 1}`}
                                onChange={(e) => setCol(ci, e.target.value)}
                              />
                              <button type="button" className="lib-col-remove" title="Remove column" onClick={() => removeCol(ci)}>
                                <FiTrash2 size={12} />
                              </button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {collRows.map((row, ri) => (
                        <tr key={ri}>
                          {collColumns.map((_, ci) => (
                            <td key={ci}>
                              <input
                                type="text"
                                value={row[ci] == null ? "" : String(row[ci])}
                                onChange={(e) => setCell(ri, ci, e.target.value)}
                              />
                            </td>
                          ))}
                          <td className="lib-row-actions">
                            <button type="button" className="remove-btn" onClick={() => removeRow(ri)} style={{ fontSize: "0.7rem", padding: "0.22rem 0.5rem" }}>
                              <FiTrash2 size={11} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState icon={FiTable} title="No columns defined yet" hint="Add a column to start the table." />
              )}

              <div className="mt-3">
                <AddBtn onClick={addRow}>Add row</AddBtn>
              </div>
            </Panel>
          )}

          {/* ---------------- RAW JSON ---------------- */}
          {tab === "raw" && (
            <Panel style={{ padding: "1.75rem" }}>
              <SectionHead icon={FiCode} title="Advanced (Raw JSON)" subtitle="Full Library page content as JSON." />
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
        summary={canWrite ? `${stats[0].value} images · ${stats[1].value} blocks` : "You have read-only access to this page."}
      />
    </EditorPage>
  );
};

export default LibraryEditor;
