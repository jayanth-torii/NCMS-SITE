import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Button } from "reactstrap";
import {
  FiFlag,
  FiMessageSquare,
  FiTarget,
  FiInfo,
  FiBookOpen,
  FiUsers,
  FiCode,
  FiPlus,
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
  FiAward,
  FiImage,
  FiLink,
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
 * Department Details Editor — Content Manager
 * Pick a programme, then edit each section of its public department
 * page — Vision & Mission / HOD Message / Objectives / About Course /
 * Syllabus / Faculty. Each section edits the selected programme's
 * entry in its own existing API route — shapes and routes are
 * unchanged, so this is purely a UI redesign of the six generic
 * department editors.
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

// ---- section rail (each tab maps to one existing department route) -----
const TABS = [
  { id: "vision", label: "Vision & Mission", desc: "Statements & points", icon: FiFlag, route: "/api/vision-missions" },
  { id: "hod", label: "HOD Message", desc: "Message & photo", icon: FiMessageSquare, route: "/api/hod-contents" },
  { id: "objectives", label: "Objectives", desc: "PEO / PO / PSO", icon: FiTarget, route: "/api/program-contents" },
  { id: "course", label: "About Course", desc: "Intro paragraphs", icon: FiInfo, route: "/api/course-contents" },
  { id: "syllabus", label: "Syllabus", desc: "Papers & PDFs", icon: FiBookOpen, route: "/api/syllabus-contents" },
  { id: "faculty", label: "Faculty", desc: "Member roster", icon: FiUsers, route: "/api/department-faculties" },
];

// Programme keys shown in the selector (order matches the public directory).
const PROGRAMME_META = [
  { key: "MBA", label: "Master of Business Administration", group: "PG" },
  { key: "MOC", label: "Master of Commerce", group: "PG" },
  { key: "MCA", label: "Master of Computer Applications", group: "PG" },
  { key: "UG_Commerce", label: "Commerce & Management", group: "UG" },
  { key: "UG_CA", label: "Computer Applications", group: "UG" },
  { key: "Science", label: "Science", group: "UG" },
  { key: "DOK", label: "Department of Kannada", group: "Languages" },
  { key: "DOH", label: "Department of Hindi", group: "Languages" },
  { key: "DOE", label: "Department of English", group: "Languages" },
];

const programmeLabel = (key) => PROGRAMME_META.find((p) => p.key === key)?.label || key;

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

const DepartmentDetailsEditor = () => {
  const canWrite = useSelector((state) => canWritePage(state, "departmentDetailsEditor"));
  const [docs, setDocs] = useState(null); // { tabId: payloadForThatRoute }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [programme, setProgramme] = useState("UG_Commerce");
  const [tab, setTab] = useState("vision");
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState(null);
  const [rawText, setRawText] = useState("");
  const [rawError, setRawError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    setSavedAt(null);
    Promise.all(
      TABS.map((t) =>
        getContent(t.route)
          .then((res) => [t.id, res || {}])
          .catch((err) => {
            setError(err.response?.data?.message || err.message || `Failed to load ${t.label}`);
            return [t.id, {}];
          })
      )
    )
      .then((entries) => {
        const next = Object.fromEntries(entries);
        setDocs(next);
        // Default the programme selector to the first programme with data.
        const firstWithData = PROGRAMME_META.find((p) => Object.values(next).some((doc) => doc && doc[p.key]))?.key;
        if (firstWithData) setProgramme(firstWithData);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tab === "raw" && docs) setRawText(JSON.stringify(docs, null, 2));
  }, [tab, docs]);

  const stats = useMemo(() => {
    const count = PROGRAMME_META.filter((p) => Object.values(docs || {}).some((doc) => doc && doc[p.key])).length;
    return [{ value: count, label: "Programmes" }];
  }, [docs]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await Promise.all(TABS.map((t) => updateContent(t.route, docs[t.id] || {})));
      setSavedAt(Date.now());
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // set('vision', ['VisionMission'], ...) edits docs.vision[programme][...].
  const set = (tabId, path, value) =>
    setDocs({
      ...docs,
      [tabId]: setPath(docs[tabId], [programme, ...path], value),
    });

  const listAt = (tabId, path) => get(docs?.[tabId]?.[programme], path) || [];

  const updateItem = (tabId, path, index, next) =>
    set(tabId, path, listAt(tabId, path).map((it, i) => (i === index ? next : it)));

  const removeItem = (tabId, path, index) =>
    set(tabId, path, listAt(tabId, path).filter((_, i) => i !== index));

  const addItem = (tabId, path, sample) => set(tabId, path, [...listAt(tabId, path), clone(sample)]);

  if (loading || !docs) {
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

  const rawDoc = (tabId) => docs[tabId]?.[programme] || {};

  // ---- section renderers ---------------------------------------------

  const renderVision = () => {
    const VM = rawDoc("vision");
    const sections = VM.VisionMission || [];
    return (
      <Panel style={{ padding: "1.5rem" }}>
        <SectionHead
          icon={FiFlag}
          title="Vision & Mission"
          subtitle={`${programmeLabel(programme)} — this section only.`}
          right={
            <Button
              type="button"
              onClick={() => addItem("vision", ["VisionMission"], { title: "", description: "", points: [] })}
              style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
            >
              <FiPlus size={15} /> Add Section
            </Button>
          }
        />
        <PathField data={rawDoc("vision")} setData={(doc) => setDocs({ ...docs, vision: setPath(docs.vision, [programme], doc) })} path={["title"]} label="Title" />

        <div style={{ marginTop: "1.2rem" }}>
          {sections.length === 0 && (
            <EmptyState icon={FiFlag} title="No sections yet" hint="Add your first vision & mission statement card." />
          )}
          {sections.map((sec, i) => (
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
                <ItemAction icon={FiArrowUp} title="Move up" onClick={() => { /* move within array */ }} disabled />
                <ItemAction icon={FiArrowDown} title="Move down" onClick={() => { /* move within array */ }} disabled />
                <ItemAction icon={FiTrash2} danger title="Remove" onClick={() => removeItem("vision", ["VisionMission"], i)} />
              </div>
              <Row className="g-3">
                <Col md={6}>
                  <Field label="Title">
                    <input
                      type="text"
                      value={sec.title || ""}
                      onChange={(e) => updateItem("vision", ["VisionMission"], i, { ...sec, title: e.target.value })}
                      style={{ width: "100%", borderRadius: T.radiusSm, border: `1px solid ${T.line}`, padding: ".6rem .8rem", fontSize: ".92rem", background: "#fff" }}
                    />
                  </Field>
                </Col>
                <Col md={6}>
                  <Field label="Points (one per line)">
                    <textarea
                      rows={2}
                      value={(sec.points || []).join("\n")}
                      onChange={(e) => updateItem("vision", ["VisionMission"], i, { ...sec, points: e.target.value.split("\n") })}
                      style={{ width: "100%", borderRadius: T.radiusSm, border: `1px solid ${T.line}`, padding: ".6rem .8rem", fontSize: ".92rem", background: "#fff" }}
                    />
                  </Field>
                </Col>
              </Row>
              <Field label="Description">
                <textarea
                  rows={3}
                  value={sec.description || ""}
                  onChange={(e) => updateItem("vision", ["VisionMission"], i, { ...sec, description: e.target.value })}
                  style={{ width: "100%", borderRadius: T.radiusSm, border: `1px solid ${T.line}`, padding: ".6rem .8rem", fontSize: ".92rem", background: "#fff" }}
                />
              </Field>
            </Panel>
          ))}
          {sections.length > 0 && (
            <AddBtn onClick={() => addItem("vision", ["VisionMission"], { title: "", description: "", points: [] })}>
              Add section
            </AddBtn>
          )}
        </div>
      </Panel>
    );
  };

  const renderHod = () => {
    const H = rawDoc("hod");
    return (
      <Panel style={{ padding: "1.5rem" }}>
        <SectionHead icon={FiMessageSquare} title="HOD Message" subtitle={`${programmeLabel(programme)} — this section only.`} />
        <Row className="g-4">
          <Col lg={5}>
            <PathField data={rawDoc("hod")} setData={(doc) => setDocs({ ...docs, hod: setPath(docs.hod, [programme], doc) })} path={["title"]} label="Section title" />
            <PathField data={rawDoc("hod")} setData={(doc) => setDocs({ ...docs, hod: setPath(docs.hod, [programme], doc) })} path={["hodName"]} label="HOD name" />
            <PathField data={rawDoc("hod")} setData={(doc) => setDocs({ ...docs, hod: setPath(docs.hod, [programme], doc) })} path={["hodDesignation"]} label="Designation" />
            <ImageControl
              label="HOD photo"
              value={H.hodImage || ""}
              onChange={(url) => set("hod", ["hodImage"], url)}
            />
          </Col>
          <Col lg={7}>
            <PathField
              data={rawDoc("hod")}
              setData={(doc) => setDocs({ ...docs, hod: setPath(docs.hod, [programme], doc) })}
              path={["hodMessage"]}
              label="Message (one per line)"
              type="textarea"
              rows={16}
              hint="Each line becomes a separate paragraph."
            />
          </Col>
        </Row>
      </Panel>
    );
  };

  const renderObjectives = () => {
    const O = rawDoc("objectives");
    const blocks = O.Program_Contents || [];
    return (
      <Panel style={{ padding: "1.5rem" }}>
        <SectionHead
          icon={FiTarget}
          title="Programme Objectives"
          subtitle="PEO / PO / PSO blocks — each block has a heading and bullet points."
          right={
            <Button
              type="button"
              onClick={() => addItem("objectives", ["Program_Contents"], { title: "", Sections: [] })}
              style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
            >
              <FiPlus size={15} /> Add Block
            </Button>
          }
        />
        <PathField data={rawDoc("objectives")} setData={(doc) => setDocs({ ...docs, objectives: setPath(docs.objectives, [programme], doc) })} path={["title"]} label="Section title" />

        <div style={{ marginTop: "1.2rem" }}>
          {blocks.length === 0 && (
            <EmptyState icon={FiTarget} title="No blocks yet" hint="Add your first PEO / PO / PSO block." />
          )}
          {blocks.map((blk, i) => (
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
                  {blk.title || `Block ${i + 1}`}
                </span>
                <span style={{ flex: 1 }} />
                <ItemAction icon={FiTrash2} danger title="Remove" onClick={() => removeItem("objectives", ["Program_Contents"], i)} />
              </div>
              <Row className="g-3">
                <Col md={4}>
                  <Field label="Heading">
                    <input
                      type="text"
                      value={blk.title || ""}
                      onChange={(e) => updateItem("objectives", ["Program_Contents"], i, { ...blk, title: e.target.value })}
                      style={{ width: "100%", borderRadius: T.radiusSm, border: `1px solid ${T.line}`, padding: ".6rem .8rem", fontSize: ".92rem", background: "#fff" }}
                    />
                  </Field>
                </Col>
                <Col md={8}>
                  <Field label="Points (one per line)">
                    <textarea
                      rows={6}
                      value={(blk.Sections || []).join("\n")}
                      onChange={(e) => updateItem("objectives", ["Program_Contents"], i, { ...blk, Sections: e.target.value.split("\n") })}
                      style={{ width: "100%", borderRadius: T.radiusSm, border: `1px solid ${T.line}`, padding: ".6rem .8rem", fontSize: ".92rem", background: "#fff" }}
                    />
                  </Field>
                </Col>
              </Row>
            </Panel>
          ))}
          {blocks.length > 0 && (
            <AddBtn onClick={() => addItem("objectives", ["Program_Contents"], { title: "", Sections: [] })}>
              Add block
            </AddBtn>
          )}
        </div>
      </Panel>
    );
  };

  const renderCourse = () => {
    const C = rawDoc("course");
    return (
      <Panel style={{ padding: "1.5rem" }}>
        <SectionHead icon={FiInfo} title="About Course" subtitle={`${programmeLabel(programme)} — this section only.`} />
        <PathField data={rawDoc("course")} setData={(doc) => setDocs({ ...docs, course: setPath(docs.course, [programme], doc) })} path={["title"]} label="Section title" />
        <PathField
          data={rawDoc("course")}
          setData={(doc) => setDocs({ ...docs, course: setPath(docs.course, [programme], doc) })}
          path={["about"]}
          label="Description (one per line)"
          type="textarea"
          rows={12}
          hint="Each line becomes a separate paragraph."
        />
      </Panel>
    );
  };

  const renderSyllabus = () => {
    const S = rawDoc("syllabus");
    const blocks = S.SyllabusSection || [];
    return (
      <Panel style={{ padding: "1.5rem" }}>
        <SectionHead
          icon={FiBookOpen}
          title="Syllabus"
          subtitle="Programme blocks (e.g. Syllabus for B.Com) with year-wise paper PDFs."
          right={
            <Button
              type="button"
              onClick={() => addItem("syllabus", ["SyllabusSection"], { title: "", Sections: [] })}
              style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
            >
              <FiPlus size={15} /> Add Programme Block
            </Button>
          }
        />
        <PathField data={rawDoc("syllabus")} setData={(doc) => setDocs({ ...docs, syllabus: setPath(docs.syllabus, [programme], doc) })} path={["title"]} label="Section title" />

        <div style={{ marginTop: "1.2rem" }}>
          {blocks.length === 0 && (
            <EmptyState icon={FiBookOpen} title="No syllabus blocks yet" hint="Add your first programme block." />
          )}
          {blocks.map((blk, i) => (
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
                  {blk.title || `Block ${i + 1}`}
                </span>
                <span style={{ flex: 1 }} />
                <ItemAction icon={FiTrash2} danger title="Remove" onClick={() => removeItem("syllabus", ["SyllabusSection"], i)} />
              </div>
              <Field label="Block title">
                <input
                  type="text"
                  value={blk.title || ""}
                  onChange={(e) => updateItem("syllabus", ["SyllabusSection"], i, { ...blk, title: e.target.value })}
                  style={{ width: "100%", borderRadius: T.radiusSm, border: `1px solid ${T.line}`, padding: ".6rem .8rem", fontSize: ".92rem", background: "#fff" }}
                />
              </Field>

              <div className="d-flex align-items-center justify-content-between mt-3 mb-2">
                <span style={{ fontSize: ".8rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: T.muted }}>
                  Papers ({(blk.Sections || []).length})
                </span>
                <Button
                  type="button"
                  onClick={() =>
                    updateItem("syllabus", ["SyllabusSection"], i, {
                      ...blk,
                      Sections: [...(blk.Sections || []), { title: "", pdf: "" }],
                    })
                  }
                  style={{ background: "transparent", color: T.ink, border: `1.5px dashed ${T.line}`, borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".8rem", padding: ".35rem .8rem", display: "inline-flex", alignItems: "center", gap: ".35rem" }}
                >
                  <FiPlus size={14} /> Add Paper
                </Button>
              </div>

              {(blk.Sections || []).map((sec, j) => (
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
                    <FiLink size={14} style={{ color: T.muted }} />
                    <span style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: T.muted }}>
                      {sec.title || `Paper ${j + 1}`}
                    </span>
                    <span style={{ flex: 1 }} />
                    <ItemAction
                      icon={FiTrash2}
                      danger
                      title="Remove paper"
                      onClick={() =>
                        updateItem("syllabus", ["SyllabusSection"], i, {
                          ...blk,
                          Sections: (blk.Sections || []).filter((_, x) => x !== j),
                        })
                      }
                    />
                  </div>
                  <Row className="g-3">
                    <Col md={6}>
                      <Field label="Paper title">
                        <input
                          type="text"
                          value={sec.title || ""}
                          onChange={(e) => {
                            const secs = (blk.Sections || []).slice();
                            secs[j] = { ...sec, title: e.target.value };
                            updateItem("syllabus", ["SyllabusSection"], i, { ...blk, Sections: secs });
                          }}
                          style={{ width: "100%", borderRadius: T.radiusSm, border: `1px solid ${T.line}`, padding: ".6rem .8rem", fontSize: ".92rem", background: "#fff" }}
                        />
                      </Field>
                    </Col>
                    <Col md={6}>
                      <FileControl
                        label="Syllabus PDF"
                        value={sec.pdf || ""}
                        onChange={(url) => {
                          const secs = (blk.Sections || []).slice();
                          secs[j] = { ...sec, pdf: url };
                          updateItem("syllabus", ["SyllabusSection"], i, { ...blk, Sections: secs });
                        }}
                      />
                    </Col>
                  </Row>
                </Panel>
              ))}
              {(blk.Sections || []).length === 0 && (
                <p style={{ color: T.muted, fontSize: ".82rem" }}>No papers added yet.</p>
              )}
            </Panel>
          ))}
          {blocks.length > 0 && (
            <AddBtn onClick={() => addItem("syllabus", ["SyllabusSection"], { title: "", Sections: [] })}>
              Add programme block
            </AddBtn>
          )}
        </div>
      </Panel>
    );
  };

  const renderFaculty = () => {
    const F = rawDoc("faculty");
    const members = F.members || [];
    const updateMember = (i, next) => updateItem("faculty", ["members"], i, next);
    return (
      <Panel style={{ padding: "1.5rem" }}>
        <SectionHead
          icon={FiUsers}
          title="Faculty Members"
          subtitle={`${programmeLabel(programme)} faculty roster — name, photo, bio, publications and profile links.`}
          right={
            <Button
              type="button"
              onClick={() =>
                addItem("faculty", ["members"], {
                  id: Date.now(),
                  order: String(members.length + 1),
                  name: "",
                  designation: "",
                  qualification: "",
                  image: "",
                  about: [],
                  listOfPublications: { title: "Publications & Presentations", content: [] },
                  details: [],
                })
              }
              style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
            >
              <FiPlus size={15} /> Add Member
            </Button>
          }
        />
        <PathField data={rawDoc("faculty")} setData={(doc) => setDocs({ ...docs, faculty: setPath(docs.faculty, [programme], doc) })} path={["title"]} label="Section title" />
        <PathField data={rawDoc("faculty")} setData={(doc) => setDocs({ ...docs, faculty: setPath(docs.faculty, [programme], doc) })} path={["description"]} label="Description" type="textarea" rows={2} />

        <div style={{ marginTop: "1.2rem" }}>
          {members.length === 0 && (
            <EmptyState icon={FiUsers} title="No faculty members yet" hint="Add the first member of this department." />
          )}
          {members.map((m, i) => (
            <Panel
              key={m.id || i}
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
                <ItemAction icon={FiTrash2} danger title="Remove" onClick={() => removeItem("faculty", ["members"], i)} />
              </div>
              <Row className="g-4">
                <Col lg={4}>
                  <ImageControl label="Photo" value={m.image || ""} onChange={(url) => updateMember(i, { ...m, image: url })} />
                </Col>
                <Col lg={8}>
                  <Row className="g-3">
                    <Col md={12}>
                      <Field label="Name">
                        <input
                          type="text"
                          value={m.name || ""}
                          onChange={(e) => updateMember(i, { ...m, name: e.target.value })}
                          style={{ width: "100%", borderRadius: T.radiusSm, border: `1px solid ${T.line}`, padding: ".6rem .8rem", fontSize: ".92rem", background: "#fff" }}
                        />
                      </Field>
                    </Col>
                    <Col md={6}>
                      <Field label="Designation">
                        <input
                          type="text"
                          value={m.designation || ""}
                          onChange={(e) => updateMember(i, { ...m, designation: e.target.value })}
                          style={{ width: "100%", borderRadius: T.radiusSm, border: `1px solid ${T.line}`, padding: ".6rem .8rem", fontSize: ".92rem", background: "#fff" }}
                        />
                      </Field>
                    </Col>
                    <Col md={6}>
                      <Field label="Qualification">
                        <input
                          type="text"
                          value={m.qualification || ""}
                          onChange={(e) => updateMember(i, { ...m, qualification: e.target.value })}
                          style={{ width: "100%", borderRadius: T.radiusSm, border: `1px solid ${T.line}`, padding: ".6rem .8rem", fontSize: ".92rem", background: "#fff" }}
                        />
                      </Field>
                    </Col>
                    <Col md={12}>
                      <Field label="About (one per line)">
                        <textarea
                          rows={3}
                          value={(m.about || []).join("\n")}
                          onChange={(e) => updateMember(i, { ...m, about: e.target.value.split("\n") })}
                          style={{ width: "100%", borderRadius: T.radiusSm, border: `1px solid ${T.line}`, padding: ".6rem .8rem", fontSize: ".92rem", background: "#fff" }}
                        />
                      </Field>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className="g-4 mt-1">
                <Col md={6}>
                  <Panel style={{ padding: "1rem", background: "#fafbff", boxShadow: "none", border: `1px solid ${T.line}` }}>
                    <span style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: T.muted }}>
                      Publications &amp; Presentations
                    </span>
                    <div className="mt-2">
                      <Field label="Block title">
                        <input
                          type="text"
                          value={m.listOfPublications?.title || ""}
                          onChange={(v) =>
                            updateMember(i, {
                              ...m,
                              listOfPublications: { ...(m.listOfPublications || {}), title: v.target.value },
                            })
                          }
                          style={{ width: "100%", borderRadius: T.radiusSm, border: `1px solid ${T.line}`, padding: ".6rem .8rem", fontSize: ".92rem", background: "#fff" }}
                        />
                      </Field>
                    </div>
                    <Field label="Counts (one per line)">
                      <textarea
                        rows={3}
                        value={(m.listOfPublications?.content || []).join("\n")}
                        onChange={(e) =>
                          updateMember(i, {
                            ...m,
                            listOfPublications: { ...(m.listOfPublications || {}), content: e.target.value.split("\n") },
                          })
                        }
                        style={{ width: "100%", borderRadius: T.radiusSm, border: `1px solid ${T.line}`, padding: ".6rem .8rem", fontSize: ".92rem", background: "#fff" }}
                      />
                    </Field>
                  </Panel>
                </Col>
                <Col md={6}>
                  <Panel style={{ padding: "1rem", background: "#fafbff", boxShadow: "none", border: `1px solid ${T.line}` }}>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: T.muted }}>
                        Profile links
                      </span>
                      <Button
                        type="button"
                        onClick={() => updateMember(i, { ...m, details: [...(m.details || []), { title: "", content: "" }] })}
                        style={{ background: "transparent", color: T.ink, border: `1.5px dashed ${T.line}`, borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".78rem", padding: ".3rem .7rem", display: "inline-flex", alignItems: "center", gap: ".3rem" }}
                      >
                        <FiPlus size={13} /> Add Link
                      </Button>
                    </div>
                    {(m.details || []).map((dd, j) => (
                      <div key={j} className="d-flex align-items-center" style={{ gap: 8, marginBottom: 8 }}>
                        <input
                          type="text"
                          placeholder="Label (e.g. LinkedIn)"
                          value={dd.title || ""}
                          onChange={(e) => {
                            const details = (m.details || []).slice();
                            details[j] = { ...dd, title: e.target.value };
                            updateMember(i, { ...m, details });
                          }}
                          style={{ flex: 1, minWidth: 0, borderRadius: T.radiusSm, border: `1px solid ${T.line}`, padding: ".5rem .7rem", fontSize: ".86rem", background: "#fff" }}
                        />
                        <input
                          type="text"
                          placeholder="URL"
                          value={dd.content || ""}
                          onChange={(e) => {
                            const details = (m.details || []).slice();
                            details[j] = { ...dd, content: e.target.value };
                            updateMember(i, { ...m, details });
                          }}
                          style={{ flex: 1, minWidth: 0, borderRadius: T.radiusSm, border: `1px solid ${T.line}`, padding: ".5rem .7rem", fontSize: ".86rem", background: "#fff" }}
                        />
                        <ItemAction
                          icon={FiTrash2}
                          danger
                          title="Remove link"
                          onClick={() => updateMember(i, { ...m, details: (m.details || []).filter((_, x) => x !== j) })}
                        />
                      </div>
                    ))}
                    {(m.details || []).length === 0 && (
                      <p style={{ color: T.muted, fontSize: ".82rem", margin: 0 }}>No links yet.</p>
                    )}
                  </Panel>
                </Col>
              </Row>
            </Panel>
          ))}
          {members.length > 0 && (
            <AddBtn
              onClick={() =>
                addItem("faculty", ["members"], {
                  id: Date.now(),
                  order: String(members.length + 1),
                  name: "",
                  designation: "",
                  qualification: "",
                  image: "",
                  about: [],
                  listOfPublications: { title: "Publications & Presentations", content: [] },
                  details: [],
                })
              }
            >
              Add member
            </AddBtn>
          )}
        </div>
      </Panel>
    );
  };

  const renderSection = () => {
    switch (tab) {
      case "hod":
        return renderHod();
      case "objectives":
        return renderObjectives();
      case "course":
        return renderCourse();
      case "syllabus":
        return renderSyllabus();
      case "faculty":
        return renderFaculty();
      case "vision":
      default:
        return renderVision();
    }
  };

  return (
    <EditorPage>
      <GlobalUploadModal />
      <GlobalConfirmModal />
      <EditorHeader
        icon={FiAward}
        eyebrow="Content Manager"
        title="Department Details Editor"
        subtitle="Pick a programme, then edit each section of its public department page."
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

          {/* Programme selector */}
          <Panel style={{ padding: "1rem", marginTop: "1rem" }}>
            <span style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: T.muted }}>
              Programme
            </span>
            <select
              value={programme}
              onChange={(e) => setProgramme(e.target.value)}
              style={{
                width: "100%",
                marginTop: ".5rem",
                borderRadius: T.radiusSm,
                border: `1px solid ${T.line}`,
                padding: ".6rem .7rem",
                fontSize: ".88rem",
                background: "#fff",
                color: T.ink,
              }}
            >
              {PROGRAMME_META.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>
            <div className="mt-2" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#eef2ff", color: T.accent, borderRadius: 999, padding: ".25rem .7rem", fontSize: ".76rem", fontWeight: 700 }}>
              <FiAward size={13} />
              {programme}
            </div>
          </Panel>
        </Col>

        <Col lg={9}>
          {tab === "raw" ? (
            <Panel style={{ padding: "1.75rem" }}>
              <SectionHead icon={FiCode} title="Advanced (Raw JSON)" subtitle="Full department content for every programme and section as JSON." />
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
                <GhostButton onClick={() => setRawText(JSON.stringify(docs, null, 2))}>Reset</GhostButton>
                <PrimaryButton
                  onClick={() => {
                    try {
                      const parsed = JSON.parse(rawText);
                      setDocs(parsed);
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
          ) : (
            renderSection()
          )}
        </Col>
      </Row>

      <SaveBar
        saving={saving}
        onSave={handleSave}
        disabled={!canWrite}
        label={canWrite ? "Save All Changes" : "Read Only"}
        summary={canWrite ? `${stats[0].value} programmes · ${TABS.length} sections` : "You have read-only access to this page."}
      />
    </EditorPage>
  );
};

export default DepartmentDetailsEditor;
