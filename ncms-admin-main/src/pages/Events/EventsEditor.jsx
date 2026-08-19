import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Button } from "reactstrap";
import {
  FiCalendar,
  FiImage,
  FiMic,
  FiBriefcase,
  FiActivity,
  FiUsers,
  FiMusic,
  FiAward,
  FiFilm,
  FiCode,
  FiPlus,
  FiArrowUp,
  FiArrowDown,
  FiTrash2,
  FiYoutube,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { getContent, updateContent } from "../../services/data.service";
import { canWritePage } from "../../store/slices/authSlice";
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
  ImageControl,
  ImageListControl,
} from "../../components/editorLayout";
import { GlobalUploadModal, GlobalConfirmModal } from "../../components/shared";

/* ================================================================== *
 * Events Editor — Content Manager
 * Manages the public Events page: banner hero, five accordion sections
 * (Guest Lectures / Industrial Visit / Sports / NSS / Cultural
 * Events) where each event card holds a title, description paragraphs
 * and photos, plus the Conference and Utkarsh showcase sections.
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

// Five event sections share the same shape: { title, accordionItem[] }.
const ACCORDION_SECTIONS = [
  { id: "guest", label: "Guest Lectures", desc: "Lecture cards", icon: FiMic, key: "guestLecturesData", itemLabel: "Lecture" },
  { id: "visit", label: "Industrial Visit", desc: "Visit cards", icon: FiBriefcase, key: "industrialVisitData", itemLabel: "Visit" },
  { id: "sports", label: "Sports", desc: "Event cards", icon: FiActivity, key: "sportsData", itemLabel: "Event" },
  { id: "nss", label: "NSS", desc: "Event cards", icon: FiUsers, key: "NSSData", itemLabel: "Event" },
  { id: "cultural", label: "Cultural Events", desc: "Event cards", icon: FiMusic, key: "culturalEventsData", itemLabel: "Event" },
];

const TABS = [
  { id: "banner", label: "Banner", desc: "Hero banner & image", icon: FiImage },
  ...ACCORDION_SECTIONS,
  { id: "conference", label: "Conference", desc: "National conference & programmes", icon: FiAward },
  { id: "utkarsh", label: "Utkarsh", desc: "Annual fest showcase", icon: FiFilm },
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

// ---- one accordion dataset (Guest Lectures, Sports, ...) ---------------

const AccordeonSectionEditor = ({ section, data, setData, listAt, updateItem, removeItem, moveItem, addItem }) => {
  const block = get(data, [section.key]) || {};
  const items = block.accordionItem || [];
  return (
    <Panel style={{ padding: "1.5rem" }}>
      <SectionHead
        icon={section.icon}
        title={section.label}
        subtitle={`Heading and event cards — each card has a title, description paragraphs and photos.`}
        right={
          <Button
            type="button"
            onClick={() => addItem([section.key, "accordionItem"], { title: "", descriptions: [], images: [] })}
            style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
          >
            <FiPlus size={15} /> Add {section.itemLabel}
          </Button>
        }
      />
      <PathField data={data} setData={setData} path={[section.key, "title"]} label="Section title" />
      <div style={{ marginTop: "1.2rem" }}>
        {items.length === 0 && (
          <EmptyState icon={section.icon} title={`No ${section.label.toLowerCase()} yet`} hint={`Add your first ${section.itemLabel.toLowerCase()}.`} />
        )}
        {items.map((item, i) => (
          <ItemCard
            key={item.id ?? i}
            title={`${section.itemLabel} ${i + 1}`}
            canUp={i > 0}
            canDown={i < items.length - 1}
            onMoveUp={() => moveItem([section.key, "accordionItem"], i, -1)}
            onMoveDown={() => moveItem([section.key, "accordionItem"], i, 1)}
            onRemove={() => removeItem([section.key, "accordionItem"], i)}
          >
            <PathField data={data} setData={setData} path={[section.key, "accordionItem", i, "title"]} label="Title" />
            <PathField
              data={data}
              setData={setData}
              path={[section.key, "accordionItem", i, "descriptions"]}
              label="Description (one per line)"
              type="textarea"
              rows={6}
              hint="Each line becomes a separate paragraph."
            />
            <ImageListControl
              label="Photos"
              values={item.images || []}
              onChange={(imgs) => updateItem([section.key, "accordionItem"], i, { ...item, images: imgs })}
              addLabel="+ Add photo"
            />
          </ItemCard>
        ))}
        <AddBtn onClick={() => addItem([section.key, "accordionItem"], { title: "", descriptions: [], images: [] })}>
          Add {section.itemLabel.toLowerCase()}
        </AddBtn>
      </div>
    </Panel>
  );
};

// ---- editor ----------------------------------------------------------

const EventsEditor = () => {
  const canWrite = useSelector((state) => canWritePage(state, "event"));
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
    getContent("/api/events")
      .then((res) => setData(res || {}))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tab === "raw" && data) setRawText(JSON.stringify(data, null, 2));
  }, [tab, data]);

  const stats = useMemo(() => {
    const events = ACCORDION_SECTIONS.reduce(
      (sum, s) => sum + (get(data, [s.key, "accordionItem"]) || []).length,
      0
    );
    return [{ value: events, label: "Events" }];
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateContent("/api/events", data);
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
  const banner = d.BannerSection || {};
  const conference = d.conferenceSection || {};
  const national = conference.National_Conference || {};
  const nationalSections = national.Sections || [];
  const programBlocks = conference.Programs_Sections || [];
  const utkarsh = d.Utkarsh || {};

  return (
    <EditorPage>
      <GlobalUploadModal />
      <GlobalConfirmModal />
      <EditorHeader
        icon={FiCalendar}
        eyebrow="Content Manager"
        title="Events Editor"
        subtitle="Manage every section of the public Events page."
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
              <SectionHead icon={FiImage} title="Banner" subtitle="Top hero banner shown at the top of the Events page." />
              <PathField data={data} setData={setData} path={["BannerSection", "title"]} label="Title" />
              <ImageControl label="Banner image" value={banner.image || ""} onChange={(url) => setData(setPath(data, ["BannerSection", "image"], url))} />
            </Panel>
          )}

          {/* ---------------- ACCORDION SECTIONS ---------------- */}
          {ACCORDION_SECTIONS.map((s) =>
            tab === s.id ? (
              <AccordeonSectionEditor
                key={s.id}
                section={s}
                data={data}
                setData={setData}
                listAt={listAt}
                updateItem={updateItem}
                removeItem={removeItem}
                moveItem={moveItem}
                addItem={addItem}
              />
            ) : null
          )}

          {/* ---------------- CONFERENCE ---------------- */}
          {tab === "conference" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead icon={FiAward} title="Conference" subtitle="Section heading, intro copy, YouTube link, National Conference tabs and programme blocks." />
              <PathField data={data} setData={setData} path={["conferenceSection", "title"]} label="Title" />
              <PathField
                data={data}
                setData={setData}
                path={["conferenceSection", "UTube_Link"]}
                label="YouTube link (video ID)"
                placeholder="e.g. /jaGM4uPGIPQ"
              />
              <PathField
                data={data}
                setData={setData}
                path={["conferenceSection", "description"]}
                label="Description (one per line)"
                type="textarea"
                rows={4}
              />

              {/* National Conference */}
              <div style={{ marginTop: "1.4rem" }}>
                <SectionHead
                  icon={FiAward}
                  title="National Conference"
                  subtitle="Tabbed showcase — each tab has a name, description and photos."
                  right={
                    <Button
                      type="button"
                      onClick={() =>
                        setData(
                          setPath(data, ["conferenceSection", "National_Conference", "Sections"], [
                            ...nationalSections,
                            { TabName: "", description: "", images: [] },
                          ])
                        )
                      }
                      style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
                    >
                      <FiPlus size={15} /> Add Tab
                    </Button>
                  }
                />
                <PathField data={data} setData={setData} path={["conferenceSection", "National_Conference", "title"]} label="Title" />
                <div style={{ marginTop: "1.2rem" }}>
                  {nationalSections.length === 0 && (
                    <EmptyState icon={FiAward} title="No tabs yet" hint="Add your first National Conference tab." />
                  )}
                  {nationalSections.map((tabItem, i) => (
                    <ItemCard
                      key={tabItem.id ?? i}
                      title={`Tab ${i + 1}`}
                      canUp={i > 0}
                      canDown={i < nationalSections.length - 1}
                      onMoveUp={() =>
                        setData(
                          setPath(data, ["conferenceSection", "National_Conference", "Sections"], (() => {
                            const arr = nationalSections.slice();
                            const t = i - 1;
                            if (t < 0) return arr;
                            [arr[i], arr[t]] = [arr[t], arr[i]];
                            return arr;
                          })())
                        )
                      }
                      onMoveDown={() =>
                        setData(
                          setPath(data, ["conferenceSection", "National_Conference", "Sections"], (() => {
                            const arr = nationalSections.slice();
                            const t = i + 1;
                            if (t >= arr.length) return arr;
                            [arr[i], arr[t]] = [arr[t], arr[i]];
                            return arr;
                          })())
                        )
                      }
                      onRemove={() =>
                        setData(
                          setPath(data, ["conferenceSection", "National_Conference", "Sections"], nationalSections.filter((_, x) => x !== i))
                        )
                      }
                    >
                      <PathField data={data} setData={setData} path={["conferenceSection", "National_Conference", "Sections", i, "TabName"]} label="Tab name" />
                      <PathField data={data} setData={setData} path={["conferenceSection", "National_Conference", "Sections", i, "description"]} label="Description" type="textarea" rows={3} />
                      <ImageListControl
                        label="Photos"
                        values={tabItem.images || []}
                        onChange={(imgs) => {
                          const secs = nationalSections.slice();
                          secs[i] = { ...tabItem, images: imgs };
                          setData(setPath(data, ["conferenceSection", "National_Conference", "Sections"], secs));
                        }}
                        addLabel="+ Add photo"
                      />
                    </ItemCard>
                  ))}
                </div>
              </div>

              {/* Programmes */}
              <div style={{ marginTop: "1.4rem" }}>
                <SectionHead
                  icon={FiAward}
                  title={`Programmes (${programBlocks.length})`}
                  subtitle="Faculty Development Program, workshops, etc. — each with a title and description paragraphs."
                  right={
                    <Button
                      type="button"
                      onClick={() => addItem(["conferenceSection", "Programs_Sections"], { Program_title: "", descriptions: [] })}
                      style={{ background: T.ink, border: "none", borderRadius: T.radiusSm, fontWeight: 700, fontSize: ".84rem", padding: ".55rem 1rem", display: "inline-flex", alignItems: "center", gap: ".4rem", whiteSpace: "nowrap" }}
                    >
                      <FiPlus size={15} /> Add Programme
                    </Button>
                  }
                />
                <div style={{ marginTop: "1.2rem" }}>
                  {programBlocks.length === 0 && (
                    <EmptyState icon={FiAward} title="No programmes yet" hint="Add your first programme block." />
                  )}
                  {programBlocks.map((pb, i) => (
                    <ItemCard
                      key={pb.id ?? i}
                      title={`Programme ${i + 1}`}
                      canUp={i > 0}
                      canDown={i < programBlocks.length - 1}
                      onMoveUp={() => moveItem(["conferenceSection", "Programs_Sections"], i, -1)}
                      onMoveDown={() => moveItem(["conferenceSection", "Programs_Sections"], i, 1)}
                      onRemove={() => removeItem(["conferenceSection", "Programs_Sections"], i)}
                    >
                      <PathField data={data} setData={setData} path={["conferenceSection", "Programs_Sections", i, "Program_title"]} label="Programme title" />
                      <PathField
                        data={data}
                        setData={setData}
                        path={["conferenceSection", "Programs_Sections", i, "descriptions"]}
                        label="Description (one per line)"
                        type="textarea"
                        rows={5}
                      />
                    </ItemCard>
                  ))}
                  <AddBtn onClick={() => addItem(["conferenceSection", "Programs_Sections"], { Program_title: "", descriptions: [] })}>
                    Add programme
                  </AddBtn>
                </div>
              </div>
            </Panel>
          )}

          {/* ---------------- UTKARSH ---------------- */}
          {tab === "utkarsh" && (
            <Panel style={{ padding: "1.5rem" }}>
              <SectionHead icon={FiFilm} title="Utkarsh" subtitle="Annual intercollegiate fest showcase — heading, YouTube link and story paragraphs." />
              <PathField data={data} setData={setData} path={["Utkarsh", "title"]} label="Title" />
              <PathField
                data={data}
                setData={setData}
                path={["Utkarsh", "UTube_Link"]}
                label="YouTube link (video ID)"
                placeholder="e.g. IQxoAczv-8g"
              />
              <PathField
                data={data}
                setData={setData}
                path={["Utkarsh", "Content"]}
                label="Content (one per line)"
                type="textarea"
                rows={10}
                hint="Each line becomes a separate paragraph."
              />
            </Panel>
          )}

          {/* ---------------- RAW JSON ---------------- */}
          {tab === "raw" && (
            <Panel style={{ padding: "1.75rem" }}>
              <SectionHead icon={FiCode} title="Advanced (Raw JSON)" subtitle="Full Events page content as JSON." />
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
        summary={canWrite ? `${stats[0].value} events` : "You have read-only access to this page."}
      />
    </EditorPage>
  );
};

export default EventsEditor;
