import React, { useEffect, useMemo, useState } from "react";
import { FiFileText, FiFolder, FiCode, FiRefreshCw, FiSave, FiLayers, FiBox, FiCpu, FiGrid, FiImage, FiList, FiSettings, FiDatabase } from "react-icons/fi";
import { useSelector } from "react-redux";
import { getContent, updateContent } from "../../services/data.service";
import { canWritePage } from "../../store/slices/authSlice";
import AutoForm from "../../components/AutoForm";
import {
  T,
  EditorPage,
  EditorHeader,
  EditorLayout,
  Panel,
  SectionHead,
  SaveBar,
  Callout,
  EmptyState,
  PrimaryButton,
  GhostButton,
  CountPill,
} from "../../components/editorLayout";
import { GlobalUploadModal } from "../../components/shared";
import { humanize, HIDDEN_KEYS } from "../../components/fieldHeuristics";

// Tab icons — one per top-level key so the rail always looks designed,
// even though tabs are auto-derived from the data.
const TAB_ICONS = [FiLayers, FiBox, FiCpu, FiGrid, FiImage, FiList, FiSettings, FiDatabase, FiFolder];
const tabIcon = (i) => TAB_ICONS[i % TAB_ICONS.length];

// Generic singleton-page editor — powers every content area (and Site
// Settings). Loads the payload from GET /api/<route>, renders one tab per
// top-level key (auto-derived from the data) in NCET's sticky left rail,
// and PUTs it back via the sticky save bar.
const ContentEditor = ({ title, route, pageKey }) => {
  const canWrite = useSelector((state) => canWritePage(state, pageKey));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState(null);
  const [tab, setTab] = useState(null);
  const [showRaw, setShowRaw] = useState(false);
  const [rawText, setRawText] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    setSavedAt(null);
    getContent(route)
      .then((res) => {
        setData(res || {});
        setTab(null);
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [route]); // eslint-disable-line react-hooks/exhaustive-deps

  const keys = useMemo(() => {
    if (!data || typeof data !== "object" || Array.isArray(data)) return [];
    return Object.keys(data).filter((k) => !HIDDEN_KEYS.has(k));
  }, [data]);

  useEffect(() => {
    if (keys.length > 0 && !keys.includes(tab)) setTab(keys[0]);
  }, [keys, tab]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateContent(route, data);
      setSavedAt(Date.now());
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleRawSave = async () => {
    setSaving(true);
    setError("");
    try {
      const parsed = JSON.parse(rawText);
      await updateContent(route, parsed);
      setData(parsed);
      setSavedAt(Date.now());
      setShowRaw(false);
    } catch (err) {
      setError(err.message?.includes("JSON") ? "Invalid JSON: " + err.message : err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const openRaw = () => {
    setRawText(JSON.stringify(data ?? {}, null, 2));
    setShowRaw(true);
  };

  return (
    <EditorPage>
      <GlobalUploadModal />
      <EditorHeader
        icon={FiFileText}
        eyebrow="Content Manager"
        title={title}
        subtitle="Edits save directly to the live database."
        stats={[{ value: keys.length, label: "Sections" }, { value: canWrite ? "Edit" : "View", label: "Access" }]}
        mode={canWrite ? "edit" : undefined}
      />

      {error && <Callout tone="error">{error}</Callout>}
      {savedAt && <Callout tone="blue">Saved successfully.</Callout>}

      {loading ? (
        <Panel style={{ padding: "3rem", textAlign: "center" }}>
          <div style={{ minHeight: "30vh", display: "grid", placeItems: "center" }}>
            <span style={{ color: T.accent, fontWeight: 600 }}>Loading content…</span>
          </div>
        </Panel>
      ) : showRaw ? (
        <Panel style={{ padding: "1.5rem" }}>
          <SectionHead icon={FiCode} title="Advanced — Raw JSON" subtitle="Paste the full content JSON. Be careful — this bypasses validation." />
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={24}
            style={{
              width: "100%",
              fontFamily: "monospace",
              fontSize: ".8rem",
              border: `1px solid ${T.line}`,
              borderRadius: T.radiusSm,
              padding: "1rem",
            }}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <PrimaryButton icon={FiSave} onClick={handleRawSave} saving={saving}>
              Save JSON
            </PrimaryButton>
            <GhostButton onClick={() => setShowRaw(false)}>Cancel</GhostButton>
          </div>
        </Panel>
      ) : keys.length === 0 ? (
        <Panel style={{ padding: "1.5rem" }}>
          <EmptyState icon={FiFolder} title="No content yet" hint="Use 'Raw JSON' to seed the initial shape, then edit field by field." />
          <div style={{ textAlign: "center", paddingBottom: "1.5rem" }}>
            <GhostButton onClick={openRaw}>Open Raw JSON</GhostButton>
          </div>
        </Panel>
      ) : (
        <>
          <div className="d-flex justify-content-end mb-3">
            <GhostButton icon={FiCode} onClick={openRaw}>
              Raw JSON
            </GhostButton>
            <span style={{ width: 10 }} />
            <GhostButton icon={FiRefreshCw} onClick={load}>
              Reload
            </GhostButton>
          </div>
          <EditorLayout
            tabs={keys.map((k, i) => ({
              id: k,
              label: humanize(k),
              desc: `${typeof data[k] === "object" ? (Array.isArray(data[k]) ? `${data[k].length} items` : "Object") : typeof data[k]}`,
              icon: tabIcon(i),
            }))}
            activeTab={tab}
            onTab={setTab}
          >
            <Panel style={{ padding: "1.5rem" }}>
              <div className="d-flex align-items-center justify-content-between mb-1">
                <SectionHead icon={tabIcon(Math.max(0, keys.indexOf(tab)))} title={humanize(tab)} subtitle="Edit this section of the page." />
                <CountPill tone="accent">{humanize(tab)}</CountPill>
              </div>
              {tab && (
                <AutoForm
                  value={data[tab]}
                  onChange={(next) => setData((prev) => ({ ...prev, [tab]: next }))}
                />
              )}
            </Panel>
          </EditorLayout>
          <SaveBar
            saving={saving}
            onSave={handleSave}
            disabled={!canWrite}
            label={canWrite ? "Save All Changes" : "Read Only"}
            summary={
              canWrite
                ? "Changes apply immediately to the live database."
                : "You have read-only access to this page."
            }
          />
        </>
      )}
    </EditorPage>
  );
};

export default ContentEditor;
