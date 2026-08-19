import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Button } from "reactstrap";
import {
  FiMail,
  FiImage,
  FiInfo,
  FiFlag,
  FiChevronsDown,
  FiBookOpen,
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
  FileControl,
} from "../../components/editorLayout";
import { GlobalUploadModal, GlobalConfirmModal } from "../../components/shared";

/* ================================================================== *
 * News Letter Editor — Content Manager
 * Manages the public Newsletter page: banner hero, About ("Nudi
 * Chaitanya") + Vision & Mission blocks, optional accordion Q&As,
 * and the Volumes library (cover image + PDF per volume).
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
  { id: "about", label: "About", desc: "Intro & welcome", icon: FiInfo },
  { id: "vision", label: "Vision & Mission", desc: "Our Vision / Mission blocks", icon: FiFlag },
  { id: "accordion", label: "Accordion", desc: "Expandable Q&As", icon: FiChevronsDown },
  { id: "volumes", label: "Volumes", desc: "Newsletter library", icon: FiBookOpen },
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

const ItemCard = ({ title, onMoveUp, onMoveDown, onRemove, children, canUp, canDown }) => (
  <Panel style={{ padding: "1rem 1.1rem", marginBottom: ".9rem", boxShadow: T.shadowSoft }}>
    <div className="d-flex align-items-center" style={{ gap: 8, marginBottom: 12 }}>
      <span style={{ fontSize: ".78rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: T.muted }}>
        {title}
      </span>
      <span style={{ flex: 1 }} />
      <ItemAction icon={FiArrowUp} title="Move up" onClick={onMoveUp} disabled={!canUp} />
      <ItemAction icon={FiArrowDown} title="Move down" onClick={onMoveDown} disabled={!canDown} />
      <ItemAction icon={FiTrash2} danger title="Remove" onClick={onRemove} />
    </div>
    {children}
  </Panel>
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

const NewsLetterEditor = () => {
  const canWrite = useSelector((state) => canWritePage(state, "newsLetter"));
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
    getContent("/api/news-letter")
      .then((res) => setData(res || {}))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tab === "raw" && data) setRawText(JSON.stringify(data, null, 2));
  }, [tab, data]);

  const stats = useMemo(() => {
    const volumes = (data?.View_Volumes?.Volumes || []).length;
    return [{ value: volumes, label: "Volumes" }];
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateContent("/api/news-letter", data);
      setSavedAt(Date.now());
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // ---- array helpers ----
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

  const d = data || {};
  const banner = d.banner || {};
  const avm = d.AboutVisionMission || {};
  const vm = avm.VisionMission || {};
  const accordions = avm.AccordionSections || [];
  const volumes = d.View_Volumes || {};
  const volumeList = volumes.Volumes || [];
  const vmSections = vm.sections || [];

  return (
    <EditorPage>
      <GlobalUploadModal />
      <GlobalConfirmModal />
      <EditorHeader
        icon={FiMail}
        eyebrow="Content Manager"
        title="News Letter Editor"
        subtitle="Manage every section of the public News Letter page."
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
              <SectionHead icon={FiImage} title="Banner" subtitle="Top hero banner shown at the top of the News Letter page." />
              <PathField data={data} setData={setData} path={["banner", "title"]} label="Title" />
              <ImageControl label="Banner image" value={banner.image || ""} onChange={(url) => setData(setPath(data, ["banner", "image"], url))} />
            </Panel>
          )}

          {/* ---------------- ABOUT ---------------- */}
          {tab === "about" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead icon={FiInfo} title="About" subtitle="Intro heading and welcome message (e.g. Nudi Chaitanya)." />
              <PathField data={data} setData={setData} path={["AboutVisionMission", "AboutSection", "title"]} label="Title" />
              <PathField
                data={data}
                setData={setData}
                path={["AboutVisionMission", "AboutSection", "descriptions"]}
                label="Description (one per line)"
                type="textarea"
                rows={8}
                hint="Each line becomes a separate paragraph."
              />
            </Panel>
          )}

          {/* ---------------- VISION & MISSION ---------------- */}
          {tab === "vision" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead
                icon={FiFlag}
                title="Vision & Mission"
                subtitle="Our Vision / Our Mission blocks — each with a title, description and supporting points."
                right={
                  <Button
                    type="button"
                    onClick={() => addItem(["AboutVisionMission", "VisionMission", "sections"], { title: "", description: "", points: [] })}
                    style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
                  >
                    <FiPlus size={15} /> Add Block
                  </Button>
                }
              />
              <PathField data={data} setData={setData} path={["AboutVisionMission", "VisionMission", "title"]} label="Section title" />
              <div style={{ marginTop: "1.2rem" }}>
                {vmSections.length === 0 && (
                  <EmptyState icon={FiFlag} title="No blocks yet" hint="Add your first Vision / Mission block." />
                )}
                {vmSections.map((sec, i) => (
                  <ItemCard
                    key={i}
                    title={`Block ${i + 1}`}
                    canUp={i > 0}
                    canDown={i < vmSections.length - 1}
                    onMoveUp={() => moveItem(["AboutVisionMission", "VisionMission", "sections"], i, -1)}
                    onMoveDown={() => moveItem(["AboutVisionMission", "VisionMission", "sections"], i, 1)}
                    onRemove={() => removeItem(["AboutVisionMission", "VisionMission", "sections"], i)}
                  >
                    <PathField data={data} setData={setData} path={["AboutVisionMission", "VisionMission", "sections", i, "title"]} label="Title" />
                    <PathField data={data} setData={setData} path={["AboutVisionMission", "VisionMission", "sections", i, "description"]} label="Description" type="textarea" rows={2} />
                    <PathField
                      data={data}
                      setData={setData}
                      path={["AboutVisionMission", "VisionMission", "sections", i, "points"]}
                      label="Points (one per line)"
                      type="textarea"
                      rows={4}
                    />
                  </ItemCard>
                ))}
                <AddBtn onClick={() => addItem(["AboutVisionMission", "VisionMission", "sections"], { title: "", description: "", points: [] })}>
                  Add block
                </AddBtn>
              </div>
            </Panel>
          )}

          {/* ---------------- ACCORDION ---------------- */}
          {tab === "accordion" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead
                icon={FiChevronsDown}
                title="Accordion"
                subtitle="Expandable Q&A / info rows — each has a title and bullet points."
                right={
                  <Button
                    type="button"
                    onClick={() => addItem(["AboutVisionMission", "AccordionSections"], { title: "", points: [] })}
                    style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
                  >
                    <FiPlus size={15} /> Add Item
                  </Button>
                }
              />
              <div style={{ marginTop: "1.2rem" }}>
                {accordions.length === 0 && (
                  <EmptyState icon={FiChevronsDown} title="No accordion items yet" hint="Add your first expandable row." />
                )}
                {accordions.map((acc, i) => (
                  <ItemCard
                    key={i}
                    title={`Item ${i + 1}`}
                    canUp={i > 0}
                    canDown={i < accordions.length - 1}
                    onMoveUp={() => moveItem(["AboutVisionMission", "AccordionSections"], i, -1)}
                    onMoveDown={() => moveItem(["AboutVisionMission", "AccordionSections"], i, 1)}
                    onRemove={() => removeItem(["AboutVisionMission", "AccordionSections"], i)}
                  >
                    <PathField data={data} setData={setData} path={["AboutVisionMission", "AccordionSections", i, "title"]} label="Title" />
                    <PathField
                      data={data}
                      setData={setData}
                      path={["AboutVisionMission", "AccordionSections", i, "points"]}
                      label="Points (one per line)"
                      type="textarea"
                      rows={4}
                    />
                  </ItemCard>
                ))}
                <AddBtn onClick={() => addItem(["AboutVisionMission", "AccordionSections"], { title: "", points: [] })}>
                  Add item
                </AddBtn>
              </div>
            </Panel>
          )}

          {/* ---------------- VOLUMES ---------------- */}
          {tab === "volumes" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead
                icon={FiBookOpen}
                title="Volumes"
                subtitle="Section heading, intro copy and the newsletter volume cards (cover + PDF)."
                right={
                  <Button
                    type="button"
                    onClick={() => addItem(["View_Volumes", "Volumes"], { title: "", volume: "", image: "", pdf: "" })}
                    style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
                  >
                    <FiPlus size={15} /> Add Volume
                  </Button>
                }
              />
              <PathField data={data} setData={setData} path={["View_Volumes", "title"]} label="Title" />
              <PathField data={data} setData={setData} path={["View_Volumes", "description"]} label="Description" type="textarea" rows={3} />
              <div style={{ marginTop: "1.2rem" }}>
                {volumeList.length === 0 && (
                  <EmptyState icon={FiBookOpen} title="No volumes yet" hint="Add your first newsletter volume." />
                )}
                {volumeList.map((vol, i) => (
                  <ItemCard
                    key={vol.id ?? i}
                    title={`Volume ${i + 1}`}
                    canUp={i > 0}
                    canDown={i < volumeList.length - 1}
                    onMoveUp={() => moveItem(["View_Volumes", "Volumes"], i, -1)}
                    onMoveDown={() => moveItem(["View_Volumes", "Volumes"], i, 1)}
                    onRemove={() => removeItem(["View_Volumes", "Volumes"], i)}
                  >
                    <Row>
                      <Col md={7}>
                        <PathField data={data} setData={setData} path={["View_Volumes", "Volumes", i, "title"]} label="Title" />
                      </Col>
                      <Col md={5}>
                        <PathField data={data} setData={setData} path={["View_Volumes", "Volumes", i, "volume"]} label="Volume label" placeholder="e.g. Volume 4" />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <ImageControl
                          label="Cover image"
                          value={vol.image || ""}
                          onChange={(url) => updateItem(["View_Volumes", "Volumes"], i, { ...vol, image: url })}
                        />
                      </Col>
                      <Col md={6}>
                        <FileControl
                          label="Volume PDF"
                          value={vol.pdf || ""}
                          onChange={(url) => updateItem(["View_Volumes", "Volumes"], i, { ...vol, pdf: url })}
                        />
                      </Col>
                    </Row>
                  </ItemCard>
                ))}
                <AddBtn onClick={() => addItem(["View_Volumes", "Volumes"], { title: "", volume: "", image: "", pdf: "" })}>
                  Add volume
                </AddBtn>
              </div>
            </Panel>
          )}

          {/* ---------------- RAW JSON ---------------- */}
          {tab === "raw" && (
            <Panel style={{ padding: "1.75rem" }}>
              <SectionHead icon={FiCode} title="Advanced (Raw JSON)" subtitle="Full News Letter page content as JSON." />
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
        summary={canWrite ? `${stats[0].value} volumes` : "You have read-only access to this page."}
      />
    </EditorPage>
  );
};

export default NewsLetterEditor;
