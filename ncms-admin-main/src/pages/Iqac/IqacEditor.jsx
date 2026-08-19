import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Button } from "reactstrap";
import {
  FiTarget,
  FiUsers,
  FiShield,
  FiStar,
  FiFileText,
  FiCode,
  FiPlus,
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
  FiInfo,
  FiEye,
  FiFlag,
  FiLink,
  FiLayers,
  FiAward,
  FiBriefcase,
  FiUser,
  FiImage,
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
 * IQAC Editor — Content Manager
 * Manages the public IQAC page: banner & gallery, about + vision &
 * mission, members & governance, feedback details, policies &
 * initiatives and reports & accreditation. Content shape and API are
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

// ---- tab definitions -------------------------------------------------

const TABS = [
  { id: "banner", label: "Banner & Images", desc: "Hero & gallery", icon: FiImage },
  { id: "about", label: "About, Vision & Mission", desc: "Statements", icon: FiTarget },
  { id: "members", label: "Members & Governance", desc: "Council & policies", icon: FiUsers },
  { id: "reports", label: "Reports & Accreditation", desc: "PDF documents", icon: FiFileText },
  { id: "policies", label: "Policies & Initiatives", desc: "Docs & practices", icon: FiShield },
  { id: "feedback", label: "Feedback Details", desc: "Forms & analysis", icon: FiStar },
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

// PDF/file list inside a card — items are {title?, name?, pdf?, link?}.
const PdfList = ({ items, onTitle, onPdf, onRemove }) => (
  <div>
    {items.map((item, i) => (
      <Panel
        key={i}
        style={{
          padding: "1rem 1.1rem",
          marginBottom: ".7rem",
          background: "#fafbff",
          boxShadow: "none",
          border: `1px solid ${T.line}`,
        }}
      >
        <div className="d-flex align-items-center" style={{ gap: 8, marginBottom: 12 }}>
          <FiFileText size={14} style={{ color: T.muted }} />
          <span style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: T.muted }}>
            {item.title || item.name || `Item ${i + 1}`}
          </span>
          <span style={{ flex: 1 }} />
          <ItemAction icon={FiTrash2} danger title="Remove" onClick={() => onRemove(i)} />
        </div>
        <Row className="g-3">
          <Col md={7}>
            <Field label="Title">
              <input
                type="text"
                value={item.title ?? item.name ?? ""}
                placeholder="Document title"
                onChange={(e) => {
                  const next = { ...item, title: e.target.value };
                  if (item.name !== undefined) next.name = e.target.value;
                  onTitle(i, next);
                }}
                style={{ width: "100%", borderRadius: T.radiusSm, border: `1px solid ${T.line}`, padding: ".6rem .8rem", fontSize: ".92rem", background: "#fff" }}
              />
            </Field>
          </Col>
          <Col md={5}>
            <FileControl
              label="PDF"
              value={item.pdf ?? item.link ?? ""}
              onChange={(url) => {
                const next = { ...item, pdf: url };
                if (item.link !== undefined) next.link = url;
                onPdf(i, next);
              }}
            />
          </Col>
        </Row>
      </Panel>
    ))}
  </div>
);

// ---- editor ----------------------------------------------------------

const IqacEditor = () => {
  const canWrite = useSelector((state) => canWritePage(state, "iqac"));
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
    getContent("/api/iqac")
      .then((res) => setData(res || {}))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tab === "raw" && data) setRawText(JSON.stringify(data, null, 2));
  }, [tab, data]);

  const stats = useMemo(() => {
    const members = data?.iqacMembersSection?.members?.length || 0;
    const policies = data?.policyDocuments?.sections?.length || 0;
    return [
      { value: members, label: "Members" },
      { value: policies, label: "Policies" },
    ];
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateContent("/api/iqac", data);
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
  const banner = d.bannerSection || {};
  const aboutVM = d.AboutVisionMissionSections || {};
  const gov = d.GovernancePolicies || {};
  const mem = d.iqacMembersSection || {};
  const feed = d.feedBackDetails || {};
  const pol = d.policyDocuments || {};
  const init = d.Initiatives_And_Best_Practices || {};
  const rep = d.Reports_And_Documentation || {};
  const acc = d.Accreditation_And_Evaluation || {};

  return (
    <EditorPage>
      <GlobalUploadModal />
      <GlobalConfirmModal />
      <EditorHeader
        icon={FiTarget}
        eyebrow="Content Manager"
        title="IQAC Editor"
        subtitle="Manage every section of the public IQAC page."
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
          {/* ---------------- BANNER & IMAGES ---------------- */}
          {tab === "banner" && (
            <>
              <Panel style={{ padding: "1.5rem", marginBottom: "1rem" }}>
                <SectionHead icon={FiImage} title="Banner Section" subtitle="Main IQAC banner text and image." />
                <PathField data={data} setData={setData} path={["bannerSection", "heading"]} label="Heading" />
                <PathField data={data} setData={setData} path={["bannerSection", "description"]} label="Description" type="textarea" rows={2} />
                <ImageControl label="Banner image" value={banner.bannerImage || ""} onChange={(url) => set(["bannerSection", "bannerImage"], url)} />
              </Panel>

              <Panel style={{ padding: "1.5rem" }}>
                <SectionHead
                  icon={FiImage}
                  title="IQAC Images"
                  subtitle="Gallery images for IQAC."
                  right={
                    <Button
                      type="button"
                      onClick={() => addItem(["iqacImages"], "")}
                      style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
                    >
                      <FiPlus size={15} /> Add Image
                    </Button>
                  }
                />
                <div style={{ marginTop: "1.2rem" }}>
                  {(!d.iqacImages || d.iqacImages.length === 0) && (
                    <EmptyState icon={FiImage} title="No images yet" hint="Add your first IQAC gallery image." />
                  )}
                  {(d.iqacImages || []).map((img, i) => (
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
                        <ItemAction icon={FiTrash2} danger title="Remove" onClick={() => removeItem(["iqacImages"], i)} />
                      </div>
                      <ImageControl label="Image" value={img || ""} onChange={(v) => updateItem(["iqacImages"], i, v)} />
                    </Panel>
                  ))}
                  {(d.iqacImages || []).length > 0 && (
                    <AddBtn onClick={() => addItem(["iqacImages"], "")}>Add image</AddBtn>
                  )}
                </div>
              </Panel>
            </>
          )}

          {/* ---------------- ABOUT, VISION & MISSION ---------------- */}
          {tab === "about" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead icon={FiTarget} title="About, Vision & Mission" subtitle="About intro and the vision & mission statement cards." />
              <Row className="g-4">
                <Col lg={6}>
                  <Panel style={{ padding: "1rem", background: "#fafbff", boxShadow: "none", border: `1px solid ${T.line}` }}>
                    <span style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: T.muted }}>
                      About IQAC
                    </span>
                    <div className="mt-2">
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
                    </div>
                  </Panel>
                </Col>
                <Col lg={6}>
                  <Panel style={{ padding: "1rem", background: "#fafbff", boxShadow: "none", border: `1px solid ${T.line}` }}>
                    <span style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: T.muted }}>
                      Vision & Mission
                    </span>
                    <div className="mt-2">
                      <PathField data={data} setData={setData} path={["AboutVisionMissionSections", "VisionMission", "title"]} label="Main title" />
                      {(aboutVM.VisionMission?.sections || []).map((sec, i) => (
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
                            <ItemAction icon={FiTrash2} danger title="Remove" onClick={() => removeItem(["AboutVisionMissionSections", "VisionMission", "sections"], i)} />
                          </div>
                          <PathField data={data} setData={setData} path={["AboutVisionMissionSections", "VisionMission", "sections", i, "title"]} label="Title" />
                          <PathField
                            data={data}
                            setData={setData}
                            path={["AboutVisionMissionSections", "VisionMission", "sections", i, "description"]}
                            label="Description"
                            type="textarea"
                            rows={2}
                          />
                          <PathField
                            data={data}
                            setData={setData}
                            path={["AboutVisionMissionSections", "VisionMission", "sections", i, "points"]}
                            label="Points (one per line)"
                            type="textarea"
                            rows={4}
                          />
                        </Panel>
                      ))}
                      <AddBtn onClick={() => addItem(["AboutVisionMissionSections", "VisionMission", "sections"], { title: "", description: "", points: [] })}>
                        Add section
                      </AddBtn>
                    </div>
                  </Panel>
                </Col>
              </Row>
            </Panel>
          )}

          {/* ---------------- MEMBERS & GOVERNANCE ---------------- */}
          {tab === "members" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead
                icon={FiUsers}
                title="Members of IQAC"
                subtitle="IQAC member roster."
                right={
                  <Button
                    type="button"
                    onClick={() => addItem(["iqacMembersSection", "members"], { name: "", designation: "", position: "", id: Date.now() })}
                    style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
                  >
                    <FiPlus size={15} /> Add Member
                  </Button>
                }
              />
              <PathField data={data} setData={setData} path={["iqacMembersSection", "title"]} label="Heading" />
              <div style={{ marginTop: "1.2rem" }}>
                {(!mem.members || mem.members.length === 0) && (
                  <EmptyState icon={FiUsers} title="No members yet" hint="Add the first IQAC member." />
                )}
                {(mem.members || []).map((m, i) => (
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
                        {m.name || `Member ${i + 1}`}
                      </span>
                      <span style={{ flex: 1 }} />
                      <ItemAction icon={FiArrowUp} title="Move up" onClick={() => { /* move */ }} disabled />
                      <ItemAction icon={FiArrowDown} title="Move down" onClick={() => { /* move */ }} disabled />
                      <ItemAction icon={FiTrash2} danger title="Remove" onClick={() => removeItem(["iqacMembersSection", "members"], i)} />
                    </div>
                    <Row className="g-3">
                      <Col md={6}>
                        <PathField data={data} setData={setData} path={["iqacMembersSection", "members", i, "name"]} label="Name" />
                      </Col>
                      <Col md={3}>
                        <PathField data={data} setData={setData} path={["iqacMembersSection", "members", i, "designation"]} label="Designation" />
                      </Col>
                      <Col md={3}>
                        <PathField data={data} setData={setData} path={["iqacMembersSection", "members", i, "position"]} label="Position" />
                      </Col>
                    </Row>
                  </Panel>
                ))}
                {(mem.members || []).length > 0 && (
                  <AddBtn onClick={() => addItem(["iqacMembersSection", "members"], { name: "", designation: "", position: "", id: Date.now() })}>
                    Add member
                  </AddBtn>
                )}
              </div>

              <div style={{ marginTop: "2rem" }}>
                <SectionHead
                  icon={FiShield}
                  title="Governance & Policies"
                  subtitle="Accordion sections shown on the public page."
                  right={
                    <Button
                      type="button"
                      onClick={() => addItem(["GovernancePolicies", "AccordionSections"], { title: "", points: [] })}
                      style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
                    >
                      <FiPlus size={15} /> Add Section
                    </Button>
                  }
                />
                <PathField data={data} setData={setData} path={["GovernancePolicies", "title"]} label="Title" />
                <div style={{ marginTop: "1.2rem" }}>
                  {(!gov.AccordionSections || gov.AccordionSections.length === 0) && (
                    <EmptyState icon={FiShield} title="No sections yet" hint="Add your first governance accordion section." />
                  )}
                  {(gov.AccordionSections || []).map((s, i) => (
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
                          {s.title || `Section ${i + 1}`}
                        </span>
                        <span style={{ flex: 1 }} />
                        <ItemAction icon={FiTrash2} danger title="Remove" onClick={() => removeItem(["GovernancePolicies", "AccordionSections"], i)} />
                      </div>
                      <Row className="g-3">
                        <Col md={5}>
                          <PathField data={data} setData={setData} path={["GovernancePolicies", "AccordionSections", i, "title"]} label="Section title" />
                        </Col>
                        <Col md={7}>
                          <PathField
                            data={data}
                            setData={setData}
                            path={["GovernancePolicies", "AccordionSections", i, "points"]}
                            label="Points (one per line)"
                            type="textarea"
                            rows={5}
                          />
                        </Col>
                      </Row>
                    </Panel>
                  ))}
                  {(gov.AccordionSections || []).length > 0 && (
                    <AddBtn onClick={() => addItem(["GovernancePolicies", "AccordionSections"], { title: "", points: [] })}>
                      Add section
                    </AddBtn>
                  )}
                </div>
              </div>
            </Panel>
          )}

          {/* ---------------- FEEDBACK DETAILS ---------------- */}
          {tab === "feedback" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead icon={FiStar} title="Feedback Details" subtitle="Edit feedback forms, analysis, and ATRs." />
              <div style={{ marginTop: "1.2rem" }}>
                {(!feed.tabs || feed.tabs.length === 0) && (
                  <EmptyState icon={FiStar} title="No feedback tabs" hint="Feedback tabs appear here once the page has data." />
                )}
                {(feed.tabs || []).map((t, i) => (
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
                        {t}
                      </span>
                      <span style={{ flex: 1 }} />
                      <Button
                        type="button"
                        onClick={() => addItem(["feedBackDetails", "feedbackData", t], { name: "", feedbacks: [] })}
                        style={{ background: "transparent", color: T.ink, border: `1.5px dashed ${T.line}`, borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".8rem", padding: ".35rem .8rem", display: "inline-flex", alignItems: "center", gap: ".35rem" }}
                      >
                        <FiPlus size={14} /> Add Row
                      </Button>
                    </div>
                    {(feed.feedbackData?.[t] || []).map((row, j) => (
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
                          <FiUser size={14} style={{ color: T.muted }} />
                          <span style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: T.muted }}>
                            {row.name || `Row ${j + 1}`}
                          </span>
                          <span style={{ flex: 1 }} />
                          <ItemAction icon={FiTrash2} danger title="Remove row" onClick={() => removeItem(["feedBackDetails", "feedbackData", t], j)} />
                        </div>
                        <Row className="g-3">
                          <Col md={4}>
                            <PathField data={data} setData={setData} path={["feedBackDetails", "feedbackData", t, j, "name"]} label="Label (Stakeholder/Year)" />
                          </Col>
                          <Col md={8}>
                            <PathField
                              data={data}
                              setData={setData}
                              path={["feedBackDetails", "feedbackData", t, j, "feedbacks"]}
                              label="Feedback PDFs (one URL per line)"
                              type="textarea"
                              rows={4}
                              hint="In chronological order."
                            />
                          </Col>
                        </Row>
                      </Panel>
                    ))}
                    {(feed.feedbackData?.[t] || []).length === 0 && (
                      <p style={{ color: T.muted, fontSize: ".82rem" }}>No rows added yet.</p>
                    )}
                  </Panel>
                ))}
              </div>
            </Panel>
          )}

          {/* ---------------- POLICIES & INITIATIVES ---------------- */}
          {tab === "policies" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead
                icon={FiShield}
                title="Policy Documents"
                subtitle="Policy PDFs shown on the public page."
                right={
                  <Button
                    type="button"
                    onClick={() => addItem(["policyDocuments", "sections"], { title: "", pdf: "" })}
                    style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
                  >
                    <FiPlus size={15} /> Add Policy
                  </Button>
                }
              />
              <PathField data={data} setData={setData} path={["policyDocuments", "title"]} label="Main title" />
              <div style={{ marginTop: "1.2rem" }}>
                {(!pol.sections || pol.sections.length === 0) && (
                  <EmptyState icon={FiShield} title="No policies yet" hint="Add your first policy document." />
                )}
                <PdfList
                  items={pol.sections || []}
                  onTitle={(i, next) => updateItem(["policyDocuments", "sections"], i, next)}
                  onPdf={(i, next) => updateItem(["policyDocuments", "sections"], i, next)}
                  onRemove={(i) => removeItem(["policyDocuments", "sections"], i)}
                />
                {(pol.sections || []).length > 0 && (
                  <AddBtn onClick={() => addItem(["policyDocuments", "sections"], { title: "", pdf: "" })}>
                    Add policy
                  </AddBtn>
                )}
              </div>

              <div style={{ marginTop: "2rem" }}>
                <SectionHead
                  icon={FiShield}
                  title="Initiatives & Best Practices"
                  subtitle="Initiative blocks with their link / PDF lists."
                  right={
                    <Button
                      type="button"
                      onClick={() => addItem(["Initiatives_And_Best_Practices", "Documents"], { title: "", Files: [] })}
                      style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
                    >
                      <FiPlus size={15} /> Add Initiative Block
                    </Button>
                  }
                />
                <div style={{ marginTop: "1.2rem" }}>
                  {(!init.Documents || init.Documents.length === 0) && (
                    <EmptyState icon={FiShield} title="No initiative blocks yet" hint="Add your first initiative block." />
                  )}
                  {(init.Documents || []).map((doc, i) => (
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
                          {doc.title || `Block ${i + 1}`}
                        </span>
                        <span style={{ flex: 1 }} />
                        <ItemAction icon={FiTrash2} danger title="Remove" onClick={() => removeItem(["Initiatives_And_Best_Practices", "Documents"], i)} />
                      </div>
                      <PathField data={data} setData={setData} path={["Initiatives_And_Best_Practices", "Documents", i, "title"]} label="Block title" />
                      <div className="d-flex align-items-center justify-content-between mt-3 mb-2">
                        <span style={{ fontSize: ".8rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: T.muted }}>
                          Links / PDFs
                        </span>
                        <Button
                          type="button"
                          onClick={() => {
                            const docFiles = doc.Files || [];
                            updateItem(["Initiatives_And_Best_Practices", "Documents"], i, { ...doc, Files: [...docFiles, { title: "", pdf: "" }] });
                          }}
                          style={{ background: "transparent", color: T.ink, border: `1.5px dashed ${T.line}`, borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".8rem", padding: ".35rem .8rem", display: "inline-flex", alignItems: "center", gap: ".35rem" }}
                        >
                          <FiPlus size={14} /> Add Link/PDF
                        </Button>
                      </div>
                      <PdfList
                        items={doc.Files || []}
                        onTitle={(j, next) => updateItem(["Initiatives_And_Best_Practices", "Documents", i, "Files"], j, next)}
                        onPdf={(j, next) => updateItem(["Initiatives_And_Best_Practices", "Documents", i, "Files"], j, next)}
                        onRemove={(j) => removeItem(["Initiatives_And_Best_Practices", "Documents", i, "Files"], j)}
                      />
                      {(doc.Files || []).length === 0 && (
                        <p style={{ color: T.muted, fontSize: ".82rem" }}>No links or PDFs added yet.</p>
                      )}
                    </Panel>
                  ))}
                  {(init.Documents || []).length > 0 && (
                    <AddBtn onClick={() => addItem(["Initiatives_And_Best_Practices", "Documents"], { title: "", Files: [] })}>
                      Add initiative block
                    </AddBtn>
                  )}
                </div>
              </div>
            </Panel>
          )}

          {/* ---------------- REPORTS & ACCREDITATION ---------------- */}
          {tab === "reports" && (
            <>
              <Panel style={{ padding: "1.5rem", marginBottom: "1rem" }}>
                <SectionHead
                  icon={FiFileText}
                  title="Reports & Documentation"
                  subtitle="Report folders with their file lists."
                  right={
                    <Button
                      type="button"
                      onClick={() => addItem(["Reports_And_Documentation", "folders"], { title: "", FilesSection: [] })}
                      style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
                    >
                      <FiPlus size={15} /> Add Folder
                    </Button>
                  }
                />
                <PathField data={data} setData={setData} path={["Reports_And_Documentation", "title"]} label="Title" />
                <div style={{ marginTop: "1.2rem" }}>
                  {(!rep.folders || rep.folders.length === 0) && (
                    <EmptyState icon={FiFileText} title="No folders yet" hint="Add your first report folder." />
                  )}
                  {(rep.folders || []).map((f, i) => (
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
                          {f.title || `Folder ${i + 1}`}
                        </span>
                        <span style={{ flex: 1 }} />
                        <ItemAction icon={FiTrash2} danger title="Remove folder" onClick={() => removeItem(["Reports_And_Documentation", "folders"], i)} />
                      </div>
                      <PathField data={data} setData={setData} path={["Reports_And_Documentation", "folders", i, "title"]} label="Folder name" />
                      <div className="d-flex align-items-center justify-content-between mt-3 mb-2">
                        <span style={{ fontSize: ".8rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: T.muted }}>
                          Files
                        </span>
                        <Button
                          type="button"
                          onClick={() => {
                            const files = f.FilesSection || [];
                            updateItem(["Reports_And_Documentation", "folders"], i, { ...f, FilesSection: [...files, { title: "", pdf: "" }] });
                          }}
                          style={{ background: "transparent", color: T.ink, border: `1.5px dashed ${T.line}`, borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".8rem", padding: ".35rem .8rem", display: "inline-flex", alignItems: "center", gap: ".35rem" }}
                        >
                          <FiPlus size={14} /> Add File
                        </Button>
                      </div>
                      <PdfList
                        items={f.FilesSection || []}
                        onTitle={(j, next) => updateItem(["Reports_And_Documentation", "folders", i, "FilesSection"], j, next)}
                        onPdf={(j, next) => updateItem(["Reports_And_Documentation", "folders", i, "FilesSection"], j, next)}
                        onRemove={(j) => removeItem(["Reports_And_Documentation", "folders", i, "FilesSection"], j)}
                      />
                      {(f.FilesSection || []).length === 0 && (
                        <p style={{ color: T.muted, fontSize: ".82rem" }}>No files added yet.</p>
                      )}
                    </Panel>
                  ))}
                  {(rep.folders || []).length > 0 && (
                    <AddBtn onClick={() => addItem(["Reports_And_Documentation", "folders"], { title: "", FilesSection: [] })}>
                      Add folder
                    </AddBtn>
                  )}
                </div>
              </Panel>

              <Panel style={{ padding: "1.5rem" }}>
                <SectionHead
                  icon={FiAward}
                  title="Accreditation & Evaluation"
                  subtitle="Accreditation sections with their file lists."
                  right={
                    <Button
                      type="button"
                      onClick={() => addItem(["Accreditation_And_Evaluation", "DocumentsSection"], { title: "", FilesSection: [] })}
                      style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
                    >
                      <FiPlus size={15} /> Add Section
                    </Button>
                  }
                />
                <PathField data={data} setData={setData} path={["Accreditation_And_Evaluation", "title"]} label="Title" />
                <div style={{ marginTop: "1.2rem" }}>
                  {(!acc.DocumentsSection || acc.DocumentsSection.length === 0) && (
                    <EmptyState icon={FiAward} title="No sections yet" hint="Add your first accreditation section." />
                  )}
                  {(acc.DocumentsSection || []).map((ds, i) => (
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
                          {ds.title || `Section ${i + 1}`}
                        </span>
                        <span style={{ flex: 1 }} />
                        <ItemAction icon={FiTrash2} danger title="Remove section" onClick={() => removeItem(["Accreditation_And_Evaluation", "DocumentsSection"], i)} />
                      </div>
                      <PathField data={data} setData={setData} path={["Accreditation_And_Evaluation", "DocumentsSection", i, "title"]} label="Section name" />
                      <div className="d-flex align-items-center justify-content-between mt-3 mb-2">
                        <span style={{ fontSize: ".8rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: T.muted }}>
                          Files
                        </span>
                        <Button
                          type="button"
                          onClick={() => {
                            const files = ds.FilesSection || [];
                            updateItem(["Accreditation_And_Evaluation", "DocumentsSection"], i, { ...ds, FilesSection: [...files, { title: "", pdf: "" }] });
                          }}
                          style={{ background: "transparent", color: T.ink, border: `1.5px dashed ${T.line}`, borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".8rem", padding: ".35rem .8rem", display: "inline-flex", alignItems: "center", gap: ".35rem" }}
                        >
                          <FiPlus size={14} /> Add File
                        </Button>
                      </div>
                      <PdfList
                        items={ds.FilesSection || []}
                        onTitle={(j, next) => updateItem(["Accreditation_And_Evaluation", "DocumentsSection", i, "FilesSection"], j, next)}
                        onPdf={(j, next) => updateItem(["Accreditation_And_Evaluation", "DocumentsSection", i, "FilesSection"], j, next)}
                        onRemove={(j) => removeItem(["Accreditation_And_Evaluation", "DocumentsSection", i, "FilesSection"], j)}
                      />
                      {(ds.FilesSection || []).length === 0 && (
                        <p style={{ color: T.muted, fontSize: ".82rem" }}>No files added yet.</p>
                      )}
                    </Panel>
                  ))}
                  {(acc.DocumentsSection || []).length > 0 && (
                    <AddBtn onClick={() => addItem(["Accreditation_And_Evaluation", "DocumentsSection"], { title: "", FilesSection: [] })}>
                      Add section
                    </AddBtn>
                  )}
                </div>
              </Panel>
            </>
          )}

          {/* ---------------- RAW JSON ---------------- */}
          {tab === "raw" && (
            <Panel style={{ padding: "1.75rem" }}>
              <SectionHead icon={FiCode} title="Advanced (Raw JSON)" subtitle="Full IQAC page content as JSON." />
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
        summary={canWrite ? `${stats[0].value} members · ${stats[1].value} policies` : "You have read-only access to this page."}
      />
    </EditorPage>
  );
};

export default IqacEditor;
