import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Button } from "reactstrap";
import {
  FiHome,
  FiImage,
  FiTrendingUp,
  FiInfo,
  FiAward,
  FiBookOpen,
  FiShield,
  FiVideo,
  FiFileText,
  FiGrid,
  FiBriefcase,
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
} from "../../components/editorLayout";
import { GlobalUploadModal, GlobalConfirmModal } from "../../components/shared";

/* ================================================================== *
 * Home Page Editor — NCET-style custom editor for the public homepage.
 * Mirrors the NCET reference admin: a gradient page header with live
 * stats, a sticky left tab rail (one tab per home section), hand-built
 * per-section forms, an Advanced (Raw JSON) tab and a sticky save bar.
 * Content shape and API are unchanged — this is a pure UI redesign.
 * ================================================================== */

// ---- helpers --------------------------------------------------------

const clone = (v) => (v == null ? {} : JSON.parse(JSON.stringify(v)));

const get = (obj, path) => path.reduce((acc, k) => (acc == null ? acc : acc[k]), obj);

// Immutably set a nested path on the top-level data object.
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

// ---- tab definitions (label + description + icon, NCET style) -------

const TABS = [
  { id: "hero", label: "Hero", desc: "Banner & slides", icon: FiImage },
  { id: "stats", label: "Stats", desc: "Highlight counts", icon: FiTrendingUp },
  { id: "about", label: "About", desc: "Intro & facts", icon: FiInfo },
  { id: "anniversary", label: "Anniversary", desc: "25 yrs badge & copy", icon: FiAward },
  { id: "accreditations", label: "Accreditations", desc: "Badges & logos", icon: FiShield },
  { id: "education", label: "Education", desc: "Programme highlights", icon: FiBookOpen },
  { id: "partners", label: "Placement Partners", desc: "Recruiter logos", icon: FiBriefcase },
  { id: "life", label: "Life at NCMS", desc: "Video showcase", icon: FiVideo },
  { id: "blogs", label: "Explore Blogs", desc: "Blog teaser", icon: FiFileText },
  { id: "glimpse", label: "Glimpse Gallery", desc: "Mosaic cards", icon: FiGrid },
  { id: "raw", label: "Advanced (Raw JSON)", desc: "Full content", icon: FiCode },
];

// ---- reusable pieces --------------------------------------------------

// Small icon action button for array item cards (move up / down / remove).
const ItemAction = ({ icon: Icon, danger, title, onClick }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
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
      cursor: "pointer",
    }}
  >
    <Icon size={14} />
  </button>
);

// Item card shell: header row (label + actions) then the form fields.
const ItemCard = ({ title, onMoveUp, onMoveDown, onRemove, children, canUp, canDown }) => (
  <Panel
    style={{
      padding: "1rem 1.1rem",
      marginBottom: ".9rem",
      boxShadow: T.shadowSoft,
    }}
  >
    <div className="d-flex align-items-center" style={{ gap: 8, marginBottom: 12 }}>
      <span style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: T.muted }}>
        {title}
      </span>
      <span style={{ flex: 1 }} />
      <ItemAction icon={FiArrowUp} title="Move up" onClick={onMoveUp} disabled={!canUp} />
      <ItemAction icon={FiArrowDown} title="Move down" onClick={onMoveDown} />
      <ItemAction icon={FiTrash2} danger title="Remove" onClick={onRemove} />
    </div>
    {children}
  </Panel>
);

// Dashed "add" button, matching the NCET add-item style.
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

// Text input bound to a nested data path. Array-of-strings values render as
// one item per line in textareas and are split back on newlines on change.
const PathField = ({ data, setData, path, label, hint, type, rows, placeholder }) => {
  const value = get(data, path);
  const isList = Array.isArray(value);
  const asString = value == null ? "" : isList ? value.join("\n") : String(value);
  const baseStyle = {
    width: "100%",
    borderRadius: T.radiusSm,
    border: `1px solid ${T.line}`,
    padding: ".6rem .8rem",
    fontSize: ".92rem",
    background: "#fff",
  };
  return (
    <div style={{ marginBottom: "1.05rem" }}>
      {label && (
        <label
          style={{
            display: "block",
            fontSize: ".72rem",
            fontWeight: 700,
            letterSpacing: ".04em",
            textTransform: "uppercase",
            color: T.muted,
            marginBottom: ".4rem",
          }}
        >
          {label}
        </label>
      )}
      {type === "textarea" ? (
        <textarea
          rows={rows || 3}
          value={asString}
          placeholder={placeholder}
          onChange={(e) =>
            setData(setPath(data, path, isList ? e.target.value.split("\n") : e.target.value))
          }
          style={baseStyle}
        />
      ) : (
        <input
          type={type || "text"}
          value={asString}
          placeholder={placeholder}
          onChange={(e) => setData(setPath(data, path, e.target.value))}
          style={baseStyle}
        />
      )}
      {hint && (
        <div style={{ fontSize: ".76rem", color: T.mutedSoft, marginTop: ".35rem" }}>{hint}</div>
      )}
    </div>
  );
};

// ---- Home Page editor -----------------------------------------------

const HomePageEditor = () => {
  const canWrite = useSelector((state) => canWritePage(state, "home"));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState(null);
  const [tab, setTab] = useState("hero");
  const [rawText, setRawText] = useState("");
  const [rawError, setRawError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    setSavedAt(null);
    getContent("/api/home")
      .then((res) => setData(res || {}))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-sync the raw textarea whenever the raw tab opens.
  useEffect(() => {
    if (tab === "raw" && data) setRawText(JSON.stringify(data, null, 2));
  }, [tab, data]);

  const stats = useMemo(() => {
    const slides = (data?.banner?.slides || []).length;
    const counts = (data?.Records || []).length;
    const partners = (data?.placementPartners || []).length;
    return [
      { value: slides, label: "Slides" },
      { value: counts, label: "Stats" },
      { value: partners, label: "Recruiters" },
    ];
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateContent("/api/home", data);
      setSavedAt(Date.now());
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // ---- array-item helpers (bound to current data) ----
  const listAt = (path) => get(data, path) || [];

  const updateItem = (path, index, next) => {
    const arr = listAt(path);
    setData(setPath(data, path, arr.map((it, i) => (i === index ? next : it))));
  };

  const removeItem = (path, index) => {
    setData(setPath(data, path, listAt(path).filter((_, i) => i !== index)));
  };

  const moveItem = (path, index, dir) => {
    const arr = listAt(path).slice();
    const target = index + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    setData(setPath(data, path, arr));
  };

  const addItem = (path, sample) => {
    setData(setPath(data, path, [...listAt(path), clone(sample)]));
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

  const sections = data || {};

  return (
    <EditorPage>
      <GlobalUploadModal />
      <GlobalConfirmModal />
      <EditorHeader
        icon={FiHome}
        eyebrow="Content Manager"
        title="Home Page Editor"
        subtitle="Manage every section of the public home page."
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
          {/* ---------------- HERO ---------------- */}
          {tab === "hero" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead
                icon={FiImage}
                title="Hero"
                subtitle="Banner section — map location and rotating slides shown on the home page."
              />
              <PathField
                data={data}
                setData={setData}
                path={["banner", "location"]}
                label="Map location (URL)"
              />
              <SectionHead
                icon={FiImage}
                title="Rotating Slides"
                subtitle="Shown on the home page banner."
              />
              {sections.banner?.slides?.length === 0 && (
                <EmptyState icon={FiImage} title="No slides yet" hint="Add your first slide." />
              )}
              {(sections.banner?.slides || []).map((slide, i) => (
                <ItemCard
                  key={i}
                  title={`Slide ${i + 1}`}
                  canUp={i > 0}
                  onMoveUp={() => moveItem(["banner", "slides"], i, -1)}
                  onMoveDown={() => moveItem(["banner", "slides"], i, 1)}
                  onRemove={() => removeItem(["banner", "slides"], i)}
                >
                  <PathField data={data} setData={setData} path={["banner", "slides", i, "heading"]} label="Heading" />
                  <PathField data={data} setData={setData} path={["banner", "slides", i, "description"]} label="Description" type="textarea" rows={2} />
                  <ImageControl
                    label="Slide image"
                    value={slide.bgImage || ""}
                    onChange={(url) => updateItem(["banner", "slides"], i, { ...slide, bgImage: url })}
                  />
                </ItemCard>
              ))}
              <AddBtn onClick={() => addItem(["banner", "slides"], { heading: "", description: "", bgImage: "" })}>
                Add slide
              </AddBtn>
            </Panel>
          )}

          {/* ---------------- STATS ---------------- */}
          {tab === "stats" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead
                icon={FiTrendingUp}
                title="Stats"
                subtitle="Highlight counters shown on the home page."
              />
              {(sections.Records || []).map((rec, i) => (
                <ItemCard
                  key={i}
                  title={`Stat ${i + 1}`}
                  canUp={i > 0}
                  onMoveUp={() => moveItem(["Records"], i, -1)}
                  onMoveDown={() => moveItem(["Records"], i, 1)}
                  onRemove={() => removeItem(["Records"], i)}
                >
                  <Row>
                    <Col md={6}>
                      <PathField data={data} setData={setData} path={["Records", i, "count"]} label="Count (e.g. 2000+)" />
                    </Col>
                    <Col md={6}>
                      <PathField data={data} setData={setData} path={["Records", i, "title"]} label="Title" />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <ImageControl
                        label="Background image"
                        value={rec.bgImage || ""}
                        onChange={(url) => updateItem(["Records"], i, { ...rec, bgImage: url })}
                      />
                    </Col>
                    <Col md={6}>
                      <ImageControl
                        label="Icon image"
                        value={rec.icon || ""}
                        onChange={(url) => updateItem(["Records"], i, { ...rec, icon: url })}
                      />
                    </Col>
                  </Row>
                </ItemCard>
              ))}
              <AddBtn onClick={() => addItem(["Records"], { count: "", title: "", bgImage: "", icon: "" })}>
                Add stat
              </AddBtn>
            </Panel>
          )}

          {/* ---------------- ABOUT ---------------- */}
          {tab === "about" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead icon={FiInfo} title="About" subtitle="Intro copy, imagery and CTA for the about teaser." />
              <PathField data={data} setData={setData} path={["aboutNcet", "title"]} label="Title" />
              <PathField
                data={data}
                setData={setData}
                path={["aboutNcet", "description"]}
                label="Paragraphs (one per line)"
                type="textarea"
                rows={4}
                hint="Each line becomes a separate paragraph."
              />
              <Row>
                <Col md={6}>
                  <PathField data={data} setData={setData} path={["aboutNcet", "buttonText"]} label="Button text" />
                </Col>
                <Col md={6}>
                  <PathField data={data} setData={setData} path={["aboutNcet", "link"]} label="Button link" />
                </Col>
              </Row>
              <ImageControl
                label="Main image"
                value={sections.aboutNcet?.image || ""}
                onChange={(url) => setData(setPath(data, ["aboutNcet", "image"], url))}
              />
            </Panel>
          )}

          {/* ---------------- ANNIVERSARY ---------------- */}
          {tab === "anniversary" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead icon={FiAward} title="Anniversary" subtitle="25 years of excellence — badge, heading and copy." />
              <PathField data={data} setData={setData} path={["yrs25Section", "heading"]} label="Heading" />
              <PathField
                data={data}
                setData={setData}
                path={["yrs25Section", "description"]}
                label="Description"
                type="textarea"
                rows={5}
              />
              <ImageControl
                label="Badge image"
                value={sections.yrs25Section?.image || ""}
                onChange={(url) => setData(setPath(data, ["yrs25Section", "image"], url))}
              />
            </Panel>
          )}

          {/* ---------------- EDUCATION ---------------- */}
          {tab === "education" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead icon={FiBookOpen} title="Education" subtitle="Programme highlights with CTA buttons." />
              <PathField data={data} setData={setData} path={["educationData", "heading"]} label="Heading" />
              <PathField
                data={data}
                setData={setData}
                path={["educationData", "description"]}
                label="Description"
                type="textarea"
                rows={4}
              />
              <PathField data={data} setData={setData} path={["educationData", "knowMoreText"]} label="Know more text" />
              <ImageControl
                label="Image"
                value={sections.educationData?.image || ""}
                onChange={(url) => setData(setPath(data, ["educationData", "image"], url))}
              />
              <SectionHead icon={FiBookOpen} title="Buttons" subtitle="CTA buttons for UG / PG programmes." />
              {(sections.educationData?.buttons || []).map((btn, i) => (
                <ItemCard
                  key={i}
                  title={`Button ${i + 1}`}
                  canUp={i > 0}
                  onMoveUp={() => moveItem(["educationData", "buttons"], i, -1)}
                  onMoveDown={() => moveItem(["educationData", "buttons"], i, 1)}
                  onRemove={() => removeItem(["educationData", "buttons"], i)}
                >
                  <Row>
                    <Col md={6}>
                      <PathField data={data} setData={setData} path={["educationData", "buttons", i, "text"]} label="Text" />
                    </Col>
                    <Col md={6}>
                      <PathField data={data} setData={setData} path={["educationData", "buttons", i, "link"]} label="Link" />
                    </Col>
                  </Row>
                </ItemCard>
              ))}
              <AddBtn onClick={() => addItem(["educationData", "buttons"], { text: "", link: "" })}>
                Add button
              </AddBtn>
            </Panel>
          )}

          {/* ---------------- ACCREDITATIONS ---------------- */}
          {tab === "accreditations" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead icon={FiShield} title="Accreditations" subtitle="Heading, titles and accreditation logos." />
              <PathField data={data} setData={setData} path={["accordination", "mainHead"]} label="Main heading" />
              <Row>
                <Col md={6}>
                  <PathField data={data} setData={setData} path={["accordination", "title1"]} label="Title 1" />
                </Col>
                <Col md={6}>
                  <PathField data={data} setData={setData} path={["accordination", "title2"]} label="Title 2" />
                </Col>
              </Row>
              <div style={{ marginBottom: ".5rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: ".72rem",
                    fontWeight: 700,
                    letterSpacing: ".04em",
                    textTransform: "uppercase",
                    color: T.muted,
                    marginBottom: ".4rem",
                  }}
                >
                  Accreditation logos
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {(sections.accordination?.images || []).map((src, i) => (
                    <div key={i} style={{ width: 180 }}>
                      <ImageControl
                        value={src}
                        onChange={(url) => {
                          const arr = (sections.accordination?.images || []).slice();
                          if (url === "" || url == null) arr.splice(i, 1);
                          else arr[i] = url;
                          setData(setPath(data, ["accordination", "images"], arr));
                        }}
                      />
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  size="sm"
                  outline
                  color="primary"
                  style={{ marginTop: 8 }}
                  onClick={() =>
                    setData(setPath(data, ["accordination", "images"], [...(sections.accordination?.images || []), ""]))
                  }
                >
                  + Add logo
                </Button>
              </div>
            </Panel>
          )}

          {/* ---------------- LIFE AT NCMS ---------------- */}
          {tab === "life" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead icon={FiVideo} title="Life at NCMS" subtitle="Video showcase — one YouTube video ID per line." />
              <PathField data={data} setData={setData} path={["lifeAtNCMSvideos", "title"]} label="Title" />
              <PathField
                data={data}
                setData={setData}
                path={["lifeAtNCMSvideos", "Videos"]}
                label="Video IDs (YouTube)"
                type="textarea"
                rows={6}
                hint="One video ID per line, e.g. zHxXFxqzeDU"
              />
            </Panel>
          )}

          {/* ---------------- EXPLORE BLOGS ---------------- */}
          {tab === "blogs" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead icon={FiFileText} title="Explore Blogs" subtitle="Blog teaser card on the home page." />
              <Row>
                <Col md={6}>
                  <PathField data={data} setData={setData} path={["exploreBlogs", "title"]} label="Title" />
                </Col>
                <Col md={6}>
                  <PathField data={data} setData={setData} path={["exploreBlogs", "link"]} label="Link" />
                </Col>
              </Row>
              <ImageControl
                label="Image"
                value={sections.exploreBlogs?.image || ""}
                onChange={(url) => setData(setPath(data, ["exploreBlogs", "image"], url))}
              />
            </Panel>
          )}

          {/* ---------------- GLIMPSE GALLERY ---------------- */}
          {tab === "glimpse" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead icon={FiGrid} title="Glimpse Gallery" subtitle="Mosaic cards — image plus accent colours." />
              {(sections.glimpse || []).map((card, i) => (
                <ItemCard
                  key={i}
                  title={`Card ${i + 1}`}
                  canUp={i > 0}
                  onMoveUp={() => moveItem(["glimpse"], i, -1)}
                  onMoveDown={() => moveItem(["glimpse"], i, 1)}
                  onRemove={() => removeItem(["glimpse"], i)}
                >
                  <Row>
                    <Col md={6}>
                      <PathField data={data} setData={setData} path={["glimpse", i, "bgColor"]} label="Background colour" placeholder="#0e2455" />
                    </Col>
                    <Col md={6}>
                      <PathField data={data} setData={setData} path={["glimpse", i, "textColor"]} label="Text colour" placeholder="#ffffff" />
                    </Col>
                  </Row>
                  <ImageControl
                    label="Image"
                    value={card.image || ""}
                    onChange={(url) => updateItem(["glimpse"], i, { ...card, image: url })}
                  />
                </ItemCard>
              ))}
              <AddBtn onClick={() => addItem(["glimpse"], { bgColor: "#0e2455", textColor: "#ffffff", image: "" })}>
                Add card
              </AddBtn>
            </Panel>
          )}

          {/* ---------------- PLACEMENT PARTNERS ---------------- */}
          {tab === "partners" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead icon={FiBriefcase} title="Placement Partners" subtitle="Recruiter logos shown on the home page." />
              {(sections.placementPartners || []).map((p, i) => (
                <ItemCard
                  key={i}
                  title={`Partner ${i + 1}`}
                  canUp={i > 0}
                  onMoveUp={() => moveItem(["placementPartners"], i, -1)}
                  onMoveDown={() => moveItem(["placementPartners"], i, 1)}
                  onRemove={() => removeItem(["placementPartners"], i)}
                >
                  <Row>
                    <Col md={5}>
                      <PathField data={data} setData={setData} path={["placementPartners", i, "name"]} label="Name" />
                    </Col>
                    <Col md={7}>
                      <ImageControl
                        label="Logo"
                        value={p.logo || ""}
                        onChange={(url) => updateItem(["placementPartners"], i, { ...p, logo: url })}
                      />
                    </Col>
                  </Row>
                </ItemCard>
              ))}
              <AddBtn onClick={() => addItem(["placementPartners"], { name: "", logo: "" })}>
                Add partner
              </AddBtn>
            </Panel>
          )}

          {/* ---------------- RAW JSON ---------------- */}
          {tab === "raw" && (
            <Panel style={{ padding: "1.75rem" }}>
              <SectionHead icon={FiCode} title="Advanced (Raw JSON)" subtitle="Full home-page content as JSON." />
              <p style={{ color: T.muted, fontSize: ".88rem" }}>
                Use this for the nested sections (slides, stats, gallery cards, partners). Edit, then{" "}
                <strong>Apply</strong>, then <strong>Save</strong>.
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
        summary={
          canWrite
            ? `${stats[0].value} slides · ${stats[1].value} stats · ${stats[2].value} recruiters`
            : "You have read-only access to this page."
        }
      />
    </EditorPage>
  );
};

export default HomePageEditor;
