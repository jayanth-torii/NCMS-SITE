import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Button } from "reactstrap";
import {
  FiTarget,
  FiStar,
  FiUsers,
  FiShield,
  FiGrid,
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
 * About NCMS Editor — Content Manager
 * Manages the public About page: about intro & vision, legacy
 * milestones, leadership, governing council, campuses and reports.
 * Content shape and API are unchanged — this is a UI redesign of the
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
  { id: "about", label: "About & Vision", desc: "Intro & statements", icon: FiTarget },
  { id: "milestones", label: "Legacy & Milestones", desc: "Timeline", icon: FiStar },
  { id: "leadership", label: "Leadership", desc: "Member cards", icon: FiUsers },
  { id: "governance", label: "Governance", desc: "Council members", icon: FiShield },
  { id: "campuses", label: "Campuses", desc: "Campus cards", icon: FiGrid },
  { id: "reports", label: "Reports & Docs", desc: "PDF documents", icon: FiFileText },
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

const AboutNcmsEditor = () => {
  const canWrite = useSelector((state) => canWritePage(state, "about"));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState(null);
  const [tab, setTab] = useState("about");
  const [rawText, setRawText] = useState("");
  const [rawError, setRawError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    setSavedAt(null);
    getContent("/api/about-ncms")
      .then((res) => setData(res || {}))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tab === "raw" && data) setRawText(JSON.stringify(data, null, 2));
  }, [tab, data]);

  const stats = useMemo(() => {
    const milestones = data?.milestone?.length || 0;
    const leaders = data?.Message_From_Leaders?.Leaders?.length || 0;
    return [
      { value: milestones, label: "Milestones" },
      { value: leaders, label: "Leaders" },
    ];
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateContent("/api/about-ncms", data);
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
  const A = d.AboutNGI || {};
  const VM = d.AboutVisionMission || {};
  const LDR = d.Message_From_Leaders || {};
  const CAMP = d.ourCampus || {};
  const REP = d.Reports_And_Documentations || {};

  return (
    <EditorPage>
      <GlobalUploadModal />
      <GlobalConfirmModal />
      <EditorHeader
        icon={FiInfo}
        eyebrow="Content Manager"
        title="About NCMS Editor"
        subtitle="Manage every section of the public About NCMS page."
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
          {/* ---------------- ABOUT & VISION ---------------- */}
          {tab === "about" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead icon={FiInfo} title="About & Vision" subtitle="About intro, imagery and the vision & mission statements." />
              <Row className="g-4">
                <Col lg={6}>
                  <PathField data={data} setData={setData} path={["AboutNGI", "title"]} label="Title" />
                  <PathField
                    data={data}
                    setData={setData}
                    path={["AboutNGI", "descriptions"]}
                    label="Descriptions (one per line)"
                    type="textarea"
                    rows={8}
                    hint="Each line becomes a separate paragraph."
                  />
                  <ImageControl
                    label="Hero image"
                    value={A.image || ""}
                    onChange={(url) => set(["AboutNGI", "image"], url)}
                  />
                </Col>
                <Col lg={6}>
                  <PathField data={data} setData={setData} path={["AboutVisionMission", "title"]} label="Section title" />
                  <PathField
                    data={data}
                    setData={setData}
                    path={["AboutVisionMission", "Aboutdescriptions"]}
                    label="Descriptions (one per line)"
                    type="textarea"
                    rows={3}
                  />
                  {(VM.Sections || []).map((sec, i) => (
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
                          {i === 0 ? "Vision" : "Mission"}
                        </span>
                        <span style={{ flex: 1 }} />
                        <ItemAction icon={FiTrash2} danger title="Remove" onClick={() => removeItem(["AboutVisionMission", "Sections"], i)} />
                      </div>
                      <PathField data={data} setData={setData} path={["AboutVisionMission", "Sections", i, "title"]} label="Section title" />
                      <PathField
                        data={data}
                        setData={setData}
                        path={["AboutVisionMission", "Sections", i, "description"]}
                        label="Section description"
                        type="textarea"
                        rows={3}
                      />
                    </Panel>
                  ))}
                  <AddBtn onClick={() => addItem(["AboutVisionMission", "Sections"], { title: "", description: "" })}>
                    Add section
                  </AddBtn>
                </Col>
              </Row>
            </Panel>
          )}

          {/* ---------------- LEGACY & MILESTONES ---------------- */}
          {tab === "milestones" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead
                icon={FiStar}
                title="Legacy & Milestones"
                subtitle="Timeline milestones shown on the public about page."
                right={
                  <Button
                    type="button"
                    onClick={() => addItem(["milestone"], { year: "", descriptions: [""] })}
                    style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
                  >
                    <FiPlus size={15} /> Add Milestone
                  </Button>
                }
              />
              <div style={{ marginTop: "1.2rem" }}>
                {(!d.milestone || d.milestone.length === 0) && (
                  <EmptyState icon={FiStar} title="No milestones yet" hint="Add your first timeline milestone." />
                )}
                {(d.milestone || []).map((m, i) => (
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
                        Milestone {i + 1}
                      </span>
                      <span style={{ flex: 1 }} />
                      <ItemAction icon={FiArrowUp} title="Move up" onClick={() => { /* move */ }} disabled />
                      <ItemAction icon={FiArrowDown} title="Move down" onClick={() => { /* move */ }} disabled />
                      <ItemAction icon={FiTrash2} danger title="Remove" onClick={() => removeItem(["milestone"], i)} />
                    </div>
                    <Row className="g-3">
                      <Col md={4}>
                        <PathField data={data} setData={setData} path={["milestone", i, "year"]} label="Year" />
                      </Col>
                      <Col md={8}>
                        <PathField
                          data={data}
                          setData={setData}
                          path={["milestone", i, "descriptions"]}
                          label="Descriptions (one per line)"
                          type="textarea"
                          rows={3}
                        />
                      </Col>
                    </Row>
                  </Panel>
                ))}
                {(d.milestone || []).length > 0 && (
                  <AddBtn onClick={() => addItem(["milestone"], { year: "", descriptions: [""] })}>
                    Add milestone
                  </AddBtn>
                )}
              </div>
            </Panel>
          )}

          {/* ---------------- LEADERSHIP ---------------- */}
          {tab === "leadership" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead
                icon={FiUsers}
                title="Leadership"
                subtitle="Management desk heading and leadership member cards."
                right={
                  <Button
                    type="button"
                    onClick={() =>
                      addItem(["Message_From_Leaders", "Leaders"], { name: "", designation: "", image: "", message: [""] })
                    }
                    style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
                  >
                    <FiPlus size={15} /> Add Member
                  </Button>
                }
              />
              <PathField data={data} setData={setData} path={["Message_From_Leaders", "title"]} label="Heading" />
              <div style={{ marginTop: "1.2rem" }}>
                {(!LDR.Leaders || LDR.Leaders.length === 0) && (
                  <EmptyState icon={FiUsers} title="No leaders yet" hint="Add the first leadership member." />
                )}
                {(LDR.Leaders || []).map((ld, i) => (
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
                        {ld.name || `Member ${i + 1}`}
                      </span>
                      <span style={{ flex: 1 }} />
                      <ItemAction icon={FiArrowUp} title="Move up" onClick={() => { /* move */ }} disabled />
                      <ItemAction icon={FiArrowDown} title="Move down" onClick={() => { /* move */ }} disabled />
                      <ItemAction icon={FiTrash2} danger title="Remove" onClick={() => removeItem(["Message_From_Leaders", "Leaders"], i)} />
                    </div>
                    <Row className="g-4">
                      <Col lg={4}>
                        <ImageControl
                          label="Photo"
                          value={ld.image || ""}
                          onChange={(url) => updateItem(["Message_From_Leaders", "Leaders"], i, { ...ld, image: url })}
                        />
                      </Col>
                      <Col lg={8}>
                        <Row className="g-3">
                          <Col md={6}>
                            <PathField data={data} setData={setData} path={["Message_From_Leaders", "Leaders", i, "name"]} label="Name" />
                          </Col>
                          <Col md={6}>
                            <PathField data={data} setData={setData} path={["Message_From_Leaders", "Leaders", i, "designation"]} label="Designation" />
                          </Col>
                          <Col md={12}>
                            <PathField
                              data={data}
                              setData={setData}
                              path={["Message_From_Leaders", "Leaders", i, "message"]}
                              label="Message (one per line)"
                              type="textarea"
                              rows={6}
                              hint="Each line becomes a separate paragraph."
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Panel>
                ))}
                {(LDR.Leaders || []).length > 0 && (
                  <AddBtn
                    onClick={() =>
                      addItem(["Message_From_Leaders", "Leaders"], { name: "", designation: "", image: "", message: [""] })
                    }
                  >
                    Add member
                  </AddBtn>
                )}
              </div>
            </Panel>
          )}

          {/* ---------------- GOVERNANCE ---------------- */}
          {tab === "governance" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead
                icon={FiShield}
                title="Governing Council"
                subtitle="Members of the governing council shown on the public page."
                right={
                  <Button
                    type="button"
                    onClick={() =>
                      addItem(["governingCouncil"], { slNo: (d.governingCouncil || []).length + 1, name: "", designation: "", role: "" })
                    }
                    style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
                  >
                    <FiPlus size={15} /> Add Member
                  </Button>
                }
              />
              <div style={{ marginTop: "1.2rem" }}>
                {(!d.governingCouncil || d.governingCouncil.length === 0) && (
                  <EmptyState icon={FiShield} title="No members yet" hint="Add the first governing council member." />
                )}
                {(d.governingCouncil || []).map((gc, i) => (
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
                        {gc.name || `Member ${i + 1}`}
                      </span>
                      <span style={{ flex: 1 }} />
                      <ItemAction icon={FiArrowUp} title="Move up" onClick={() => { /* move */ }} disabled />
                      <ItemAction icon={FiArrowDown} title="Move down" onClick={() => { /* move */ }} disabled />
                      <ItemAction icon={FiTrash2} danger title="Remove" onClick={() => removeItem(["governingCouncil"], i)} />
                    </div>
                    <Row className="g-3">
                      <Col md={2}>
                        <PathField data={data} setData={setData} path={["governingCouncil", i, "slNo"]} label="Sl No" />
                      </Col>
                      <Col md={10}>
                        <PathField data={data} setData={setData} path={["governingCouncil", i, "name"]} label="Name" />
                      </Col>
                      <Col md={8}>
                        <PathField data={data} setData={setData} path={["governingCouncil", i, "designation"]} label="Designation" />
                      </Col>
                      <Col md={4}>
                        <PathField data={data} setData={setData} path={["governingCouncil", i, "role"]} label="Role" />
                      </Col>
                    </Row>
                  </Panel>
                ))}
                {(d.governingCouncil || []).length > 0 && (
                  <AddBtn
                    onClick={() =>
                      addItem(["governingCouncil"], { slNo: (d.governingCouncil || []).length + 1, name: "", designation: "", role: "" })
                    }
                  >
                    Add member
                  </AddBtn>
                )}
              </div>
            </Panel>
          )}

          {/* ---------------- CAMPUSES ---------------- */}
          {tab === "campuses" && (
            <>
              <Panel style={{ padding: "1.5rem", marginBottom: "1rem" }}>
                <SectionHead icon={FiGrid} title="Campus Section Intro" subtitle='The heading and the "Explore Campuses" button shown beside the campus showcase.' />
                <Row className="g-3">
                  <Col md={6}>
                    <PathField data={data} setData={setData} path={["ourCampus", "title"]} label="Title" />
                  </Col>
                  <Col md={6}>
                    <PathField data={data} setData={setData} path={["ourCampus", "heading"]} label="Campus count label" />
                  </Col>
                </Row>
              </Panel>

              <Panel style={{ padding: "1.5rem" }}>
                <SectionHead
                  icon={FiGrid}
                  title="Campuses"
                  subtitle="Campus cards with image, location and description."
                  right={
                    <Button
                      type="button"
                      onClick={() => addItem(["ourCampus", "Campuses"], { collegeName: "", location: "", link: "", description: "", image: "" })}
                      style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
                    >
                      <FiPlus size={15} /> Add Campus
                    </Button>
                  }
                />
                <div style={{ marginTop: "1.2rem" }}>
                  {(!CAMP.Campuses || CAMP.Campuses.length === 0) && (
                    <EmptyState icon={FiGrid} title="No campuses yet" hint="Add the first campus card." />
                  )}
                  {(CAMP.Campuses || []).map((c, i) => (
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
                          {c.collegeName || `Campus ${i + 1}`}
                        </span>
                        <span style={{ flex: 1 }} />
                        <ItemAction icon={FiArrowUp} title="Move up" onClick={() => { /* move */ }} disabled />
                        <ItemAction icon={FiArrowDown} title="Move down" onClick={() => { /* move */ }} disabled />
                        <ItemAction icon={FiTrash2} danger title="Remove" onClick={() => removeItem(["ourCampus", "Campuses"], i)} />
                      </div>
                      <Row className="g-4">
                        <Col lg={4}>
                          <ImageControl
                            label="Campus image"
                            value={c.image || ""}
                            onChange={(url) => updateItem(["ourCampus", "Campuses"], i, { ...c, image: url })}
                          />
                        </Col>
                        <Col lg={8}>
                          <Row className="g-3">
                            <Col md={7}>
                              <PathField data={data} setData={setData} path={["ourCampus", "Campuses", i, "collegeName"]} label="College name" />
                            </Col>
                            <Col md={5}>
                              <PathField data={data} setData={setData} path={["ourCampus", "Campuses", i, "location"]} label="Location" />
                            </Col>
                            <Col md={12}>
                              <PathField data={data} setData={setData} path={["ourCampus", "Campuses", i, "link"]} label="Link" />
                            </Col>
                            <Col md={12}>
                              <PathField
                                data={data}
                                setData={setData}
                                path={["ourCampus", "Campuses", i, "description"]}
                                label="Description"
                                type="textarea"
                                rows={3}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Panel>
                  ))}
                  {(CAMP.Campuses || []).length > 0 && (
                    <AddBtn onClick={() => addItem(["ourCampus", "Campuses"], { collegeName: "", location: "", link: "", description: "", image: "" })}>
                      Add campus
                    </AddBtn>
                  )}
                </div>
              </Panel>
            </>
          )}

          {/* ---------------- REPORTS & DOCS ---------------- */}
          {tab === "reports" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead
                icon={FiFileText}
                title="Reports & Documents"
                subtitle="Document sections with attached PDF files."
                right={
                  <Button
                    type="button"
                    onClick={() => addItem(["Reports_And_Documentations", "sections"], { name: "", files: [{ year: "", pdf: "" }] })}
                    style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
                  >
                    <FiPlus size={15} /> Add Section
                  </Button>
                }
              />
              <div style={{ marginTop: "1.2rem" }}>
                {(!REP.sections || REP.sections.length === 0) && (
                  <EmptyState icon={FiFileText} title="No document sections yet" hint="Add your first report section." />
                )}
                {(REP.sections || []).map((sec, i) => (
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
                        {sec.name || `Section ${i + 1}`}
                      </span>
                      <span style={{ flex: 1 }} />
                      <ItemAction icon={FiTrash2} danger title="Remove" onClick={() => removeItem(["Reports_And_Documentations", "sections"], i)} />
                    </div>
                    <PathField data={data} setData={setData} path={["Reports_And_Documentations", "sections", i, "name"]} label="Section name" />

                    <div className="d-flex align-items-center justify-content-between mt-3 mb-2">
                      <span style={{ fontSize: ".8rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: T.muted }}>
                        Files ({(sec.files || []).length})
                      </span>
                      <Button
                        type="button"
                        onClick={() => {
                          const files = [...(sec.files || []), { year: "", pdf: "" }];
                          updateItem(["Reports_And_Documentations", "sections"], i, { ...sec, files });
                        }}
                        style={{ background: "transparent", color: T.ink, border: `1.5px dashed ${T.line}`, borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".8rem", padding: ".35rem .8rem", display: "inline-flex", alignItems: "center", gap: ".35rem" }}
                      >
                        <FiPlus size={14} /> Add File
                      </Button>
                    </div>

                    {(sec.files || []).map((f, j) => (
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
                          <FiFileText size={14} style={{ color: T.muted }} />
                          <span style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: T.muted }}>
                            {f.year || `File ${j + 1}`}
                          </span>
                          <span style={{ flex: 1 }} />
                          <ItemAction
                            icon={FiTrash2}
                            danger
                            title="Remove file"
                            onClick={() => {
                              const files = (sec.files || []).filter((_, x) => x !== j);
                              updateItem(["Reports_And_Documentations", "sections"], i, { ...sec, files });
                            }}
                          />
                        </div>
                        <Row className="g-3">
                          <Col md={6}>
                            <PathField
                              data={data}
                              setData={setData}
                              path={["Reports_And_Documentations", "sections", i, "files", j, "year"]}
                              label="Title / Year"
                            />
                          </Col>
                          <Col md={6}>
                            <FileControl
                              label="Document PDF"
                              value={f.pdf || ""}
                              onChange={(url) => {
                                const files = (sec.files || []).slice();
                                files[j] = { ...f, pdf: url };
                                updateItem(["Reports_And_Documentations", "sections"], i, { ...sec, files });
                              }}
                            />
                          </Col>
                        </Row>
                      </Panel>
                    ))}
                    {(sec.files || []).length === 0 && (
                      <p style={{ color: T.muted, fontSize: ".82rem" }}>No files added yet.</p>
                    )}
                  </Panel>
                ))}
                {(REP.sections || []).length > 0 && (
                  <AddBtn onClick={() => addItem(["Reports_And_Documentations", "sections"], { name: "", files: [{ year: "", pdf: "" }] })}>
                    Add section
                  </AddBtn>
                )}
              </div>
            </Panel>
          )}

          {/* ---------------- RAW JSON ---------------- */}
          {tab === "raw" && (
            <Panel style={{ padding: "1.75rem" }}>
              <SectionHead icon={FiCode} title="Advanced (Raw JSON)" subtitle="Full About NCMS page content as JSON." />
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
        summary={canWrite ? `${stats[0].value} milestones · ${stats[1].value} leaders` : "You have read-only access to this page."}
      />
    </EditorPage>
  );
};

export default AboutNcmsEditor;
