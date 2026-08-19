import React, { useState } from "react";
import { Row, Col, Input, Button, Spinner } from "reactstrap";
import {
  FiUploadCloud,
  FiPlus,
  FiTrash2,
  FiSave,
  FiInbox,
} from "react-icons/fi";
import { triggerUpload, confirmAction, getPreviewUrl } from "./shared";

/* ================================================================== *
 * Shared editor UI kit — the NCMS design system (navy + orange)
 * ------------------------------------------------------------------
 * A single, cohesive design system for all admin content editors so
 * every page reads as one product: navy brand (#0e2455) with orange
 * accents (#F6872A), rounded 16px panels, a sticky left tab rail with
 * transitions, gradient page headers, and a sticky bottom save bar.
 * Purely presentational — no data logic lives here.
 * ================================================================== */

// ---- design tokens -------------------------------------------------
export const T = {
  ink: "#0e2455", // navy — brand
  ink2: "#1e3a8a",
  accent: "#F6872A", // orange
  accentSoft: "#fff1e6",
  line: "#e7e9f5",
  lineSoft: "#eef0f9",
  bg: "#f6f7fb",
  card: "#ffffff",
  muted: "#6b7192",
  mutedSoft: "#9aa0b4",
  danger: "#dc2626",
  dangerLine: "#fecaca",
  ok: "#059669",
  radius: 16,
  radiusSm: 10,
  shadow: "0 1px 2px rgba(14,36,85,.05), 0 8px 24px rgba(14,36,85,.07)",
  shadowSoft: "0 1px 2px rgba(14,36,85,.06)",
};

const inputStyle = {
  borderRadius: T.radiusSm,
  border: `1px solid ${T.line}`,
  padding: ".6rem .8rem",
  fontSize: ".92rem",
  background: "#fff",
  boxShadow: "none",
};

// ---- primitives ----------------------------------------------------

// Styled text input / textarea / select — drop-in for reactstrap Input.
export const TextField = (props) => (
  <Input {...props} style={{ ...inputStyle, ...(props.style || {}) }} />
);

// Labelled field wrapper with consistent spacing + typography.
export const Field = ({ label, hint, children, className, style }) => (
  <div className={className} style={{ marginBottom: "1.15rem", ...(style || {}) }}>
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
    {children}
    {hint && (
      <div style={{ fontSize: ".76rem", color: T.mutedSoft, marginTop: ".35rem" }}>
        {hint}
      </div>
    )}
  </div>
);

// Card surface used for every content region.
export const Panel = ({ children, style, className }) => (
  <div
    className={className}
    style={{
      background: T.card,
      border: `1px solid ${T.line}`,
      borderRadius: T.radius,
      boxShadow: T.shadow,
      ...style,
    }}
  >
    {children}
  </div>
);

// Amber rounded icon chip.
export const AccentIcon = ({ icon: Icon, size = 16, box = 34 }) => (
  <span
    style={{
      flex: "0 0 auto",
      width: box,
      height: box,
      borderRadius: box >= 44 ? 12 : 10,
      background: T.accentSoft,
      color: T.accent,
      display: "grid",
      placeItems: "center",
    }}
  >
    <Icon size={size} />
  </span>
);

// Section intro shown at the top of a tab pane.
export const SectionHead = ({ icon, title, subtitle, right }) => (
  <div className="d-flex align-items-start justify-content-between gap-3 mb-4">
    <div className="d-flex align-items-start gap-3">
      <AccentIcon icon={icon} size={20} box={44} />
      <div>
        <h5 style={{ margin: 0, fontWeight: 800, color: T.ink, letterSpacing: "-.01em" }}>
          {title}
        </h5>
        {subtitle && (
          <p style={{ margin: ".2rem 0 0", color: T.muted, fontSize: ".88rem" }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
    {right && <div style={{ flex: "0 0 auto" }}>{right}</div>}
  </div>
);

// Rounded count / meta pill.
export const CountPill = ({ icon: Icon, children, tone = "muted" }) => {
  const tones = {
    muted: { bg: T.lineSoft, fg: T.muted },
    accent: { bg: T.accentSoft, fg: T.accent },
  };
  const c = tones[tone] || tones.muted;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: ".35rem",
        padding: ".4rem .7rem",
        borderRadius: 999,
        background: c.bg,
        color: c.fg,
        fontSize: ".76rem",
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {Icon && <Icon size={13} />} {children}
    </span>
  );
};

// Small square icon button (default / danger).
// Danger buttons (the default) gate their click behind a confirmation modal —
// pass confirm={false} to opt out, or confirmMessage="…" to customise the copy.
export const IconBtn = ({
  icon: Icon = FiTrash2,
  tone = "danger",
  size = 15,
  onClick,
  confirm,
  confirmMessage,
  ...rest
}) => {
  const tones = {
    danger: { color: T.danger, border: T.dangerLine },
    default: { color: T.ink, border: T.line },
  };
  const c = tones[tone] || tones.danger;
  // Confirm by default for danger buttons (they delete); opt out with confirm={false}.
  const needsConfirm = confirm === undefined ? tone === "danger" : confirm;
  const handleClick = async (e) => {
    if (!onClick) return;
    if (needsConfirm) {
      const ok = await confirmAction({
        message: confirmMessage || "Are you sure you want to delete this? This action cannot be undone.",
      });
      if (!ok) return;
    }
    onClick(e);
  };
  return (
    <Button
      type="button"
      {...rest}
      onClick={handleClick}
      style={{
        flex: "0 0 auto",
        background: "#fff",
        color: c.color,
        border: `1px solid ${c.border}`,
        borderRadius: T.radiusSm,
        padding: ".5rem .6rem",
        display: "inline-flex",
        alignItems: "center",
        gap: ".35rem",
        fontSize: ".82rem",
        fontWeight: 600,
        ...(rest.style || {}),
      }}
    >
      <Icon size={size} />
      {rest.children}
    </Button>
  );
};

// Primary or dashed "add" button.
export const AddButton = ({ children, dashed, block, icon: Icon = FiPlus, ...rest }) => (
  <Button
    type="button"
    {...rest}
    style={{
      background: dashed ? "transparent" : T.ink,
      color: dashed ? T.ink : "#fff",
      border: dashed ? `1px dashed ${T.line}` : "none",
      borderRadius: T.radiusSm,
      fontWeight: dashed ? 600 : 700,
      fontSize: ".84rem",
      padding: dashed ? ".55rem" : ".55rem 1rem",
      width: block ? "100%" : undefined,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: ".4rem",
      whiteSpace: "nowrap",
      ...(rest.style || {}),
    }}
  >
    <Icon size={15} /> {children}
  </Button>
);

// Dashed empty-state placeholder.
export const EmptyState = ({ icon: Icon = FiInbox, title, hint }) => (
  <div
    style={{
      border: `2px dashed ${T.line}`,
      borderRadius: T.radius,
      padding: "3rem 1rem",
      textAlign: "center",
      color: T.mutedSoft,
    }}
  >
    <Icon size={40} style={{ opacity: 0.5 }} />
    {title && (
      <p style={{ margin: ".8rem 0 0", fontWeight: 600, color: T.muted }}>{title}</p>
    )}
    {hint && <p style={{ margin: ".2rem 0 0", fontSize: ".85rem" }}>{hint}</p>}
  </div>
);

// Nested item card container (categories, years, members, …).
export const SubtleCard = ({ children, style, className }) => (
  <div
    className={className}
    style={{
      border: `1px solid ${T.line}`,
      borderRadius: T.radius,
      background: "#fcfcff",
      boxShadow: T.shadowSoft,
      marginBottom: "1.1rem",
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

// Header strip for a SubtleCard (icon chip + content + actions).
export const CardHeader = ({ children, style }) => (
  <div
    className="d-flex align-items-end gap-3"
    style={{
      padding: "1rem 1.1rem",
      background: "#fff",
      borderBottom: `1px solid ${T.lineSoft}`,
      ...style,
    }}
  >
    {children}
  </div>
);

// Light inner row (a file / link / member row inside a card body).
export const RowCard = ({ children, style, className }) => (
  <div
    className={className}
    style={{
      padding: ".7rem",
      borderRadius: T.radiusSm,
      background: "#fff",
      border: `1px solid ${T.lineSoft}`,
      marginBottom: ".6rem",
      ...style,
    }}
  >
    {children}
  </div>
);

// View + Upload for a PDF/file link. The raw URL is never shown — just a
// "View" button (opens the file in a new tab) and an Upload/Change button.
export const FileField = ({ value, onChange }) => {
  const btnStyle = {
    flex: "0 0 auto",
    background: "#fff",
    color: T.ink,
    border: `1px solid ${T.line}`,
    borderRadius: T.radiusSm,
    fontWeight: 600,
    fontSize: ".82rem",
    display: "inline-flex",
    alignItems: "center",
    gap: ".35rem",
    whiteSpace: "nowrap",
  };
  return (
    <div className="d-flex gap-2 align-items-center flex-wrap">
      {value ? (
        <button
          type="button"
          className="view-btn"
          onClick={() => window.open(getPreviewUrl(value), "_blank", "noopener,noreferrer")}
        >
          View
        </button>
      ) : (
        <span style={{ fontSize: ".82rem", color: T.mutedSoft }}>No file uploaded</span>
      )}
      <Button type="button" onClick={() => triggerUpload(onChange)} style={btnStyle}>
        <FiUploadCloud size={15} /> {value ? "Change" : "Upload"}
      </Button>
    </div>
  );
};

// Convert a YouTube/watch/share/embed URL into an embeddable URL; null if not YouTube.
const toYouTubeEmbed = (url) => {
  if (!url) return null;
  const s = String(url).trim();
  let m = s.match(/youtube\.com\/embed\/([\w-]{6,})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  m = s.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{6,})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  return null;
};

// Video preview + Upload/URL controls.
export const VideoField = ({ value, onChange, upload = true }) => {
  const [editing, setEditing] = useState(false);
  const embed = toYouTubeEmbed(value);
  const btnStyle = {
    flex: "0 0 auto",
    background: "#fff",
    color: T.ink,
    border: `1px solid ${T.line}`,
    borderRadius: T.radiusSm,
    fontWeight: 600,
    fontSize: ".82rem",
    display: "inline-flex",
    alignItems: "center",
    gap: ".35rem",
    whiteSpace: "nowrap",
  };
  return (
    <div>
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          aspectRatio: "16 / 9",
          borderRadius: T.radiusSm,
          overflow: "hidden",
          border: `1px solid ${T.line}`,
          background: "#0b1020",
          display: "grid",
          placeItems: "center",
        }}
      >
        {value ? (
          embed ? (
            <iframe
              title="Video preview"
              src={embed}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: "100%", height: "100%", border: 0, display: "block" }}
            />
          ) : (
            <video
              src={getPreviewUrl(value)}
              controls
              preload="metadata"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          )
        ) : (
          <span style={{ color: "rgba(255,255,255,.6)", fontSize: ".82rem", fontWeight: 600 }}>
            No video
          </span>
        )}
      </div>

      <div className="d-flex gap-2 mt-2 flex-wrap">
        {upload && (
          <Button type="button" onClick={() => triggerUpload(onChange)} style={btnStyle}>
            <FiUploadCloud size={15} /> {value ? "Change video" : "Upload video"}
          </Button>
        )}
        <Button type="button" onClick={() => setEditing((e) => !e)} style={btnStyle}>
          {editing ? "Done" : value ? "Edit URL" : "Set URL"}
        </Button>
        {value && (
          <Button
            type="button"
            onClick={() => onChange("")}
            style={{ ...btnStyle, color: T.danger, borderColor: T.dangerLine }}
          >
            <FiTrash2 size={15} /> Remove
          </Button>
        )}
      </div>

      {editing && (
        <TextField
          className="mt-2"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste a video URL or YouTube link"
        />
      )}
    </div>
  );
};

// ---- page-level composites ----------------------------------------

const Stat = ({ value, label }) => (
  <div
    style={{
      textAlign: "center",
      padding: ".5rem 1.1rem",
      borderRadius: 12,
      background: "rgba(255,255,255,.1)",
      border: "1px solid rgba(255,255,255,.15)",
      minWidth: 88,
    }}
  >
    <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
      {value}
    </div>
    <div
      style={{
        fontSize: ".66rem",
        textTransform: "uppercase",
        letterSpacing: ".06em",
        color: "rgba(255,255,255,.72)",
        marginTop: ".3rem",
      }}
    >
      {label}
    </div>
  </div>
);

// Gradient page header with icon, eyebrow, title, subtitle, stats, mode badge.
export const EditorHeader = ({
  icon: Icon,
  eyebrow = "Content Manager",
  title,
  subtitle,
  stats = [],
  mode, // "edit" | "create" | undefined
}) => (
  <Panel
    style={{
      background: `linear-gradient(120deg, ${T.ink} 0%, ${T.ink2} 60%, #274b8f 100%)`,
      border: "none",
      overflow: "hidden",
      position: "relative",
      marginBottom: "1.5rem",
    }}
  >
    <div
      style={{
        position: "absolute",
        right: -60,
        top: -60,
        width: 220,
        height: 220,
        borderRadius: "50%",
        background: "rgba(246,135,42,.22)",
        filter: "blur(8px)",
      }}
    />
    <div
      className="d-flex flex-wrap justify-content-between align-items-center gap-4"
      style={{ padding: "1.6rem 1.8rem", position: "relative" }}
    >
      <div className="d-flex align-items-center gap-3">
        {Icon && (
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "rgba(255,255,255,.12)",
              border: "1px solid rgba(255,255,255,.2)",
              display: "grid",
              placeItems: "center",
              color: "#F6872A",
            }}
          >
            <Icon size={28} />
          </div>
        )}
        <div>
          <div
            style={{
              fontSize: ".72rem",
              fontWeight: 700,
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,.65)",
            }}
          >
            {eyebrow}
          </div>
          <h4 style={{ margin: ".1rem 0 0", color: "#fff", fontWeight: 800 }}>{title}</h4>
          {subtitle && (
            <p style={{ margin: ".25rem 0 0", color: "rgba(255,255,255,.7)", fontSize: ".86rem" }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="d-flex align-items-center gap-2 flex-wrap">
        {stats.map((s, i) => (
          <Stat key={i} value={s.value} label={s.label} />
        ))}
        {mode && (
          <div
            style={{
              padding: ".5rem 1.1rem",
              borderRadius: 12,
              background: mode === "edit" ? "rgba(52,211,153,.18)" : "rgba(251,191,36,.2)",
              border: `1px solid ${
                mode === "edit" ? "rgba(52,211,153,.4)" : "rgba(251,191,36,.45)"
              }`,
              color: "#fff",
              fontWeight: 700,
              fontSize: ".78rem",
              whiteSpace: "nowrap",
            }}
          >
            {mode === "edit" ? "● Edit Mode" : "○ Create Mode"}
          </div>
        )}
      </div>
    </div>
  </Panel>
);

// Vertical tab rail (sticky sidebar) — tabs: [{id,label,desc,icon}].
export const TabRail = ({ tabs, activeTab, onTab }) => (
  <Panel style={{ padding: ".6rem", position: "sticky", top: "1rem" }}>
    {tabs.map((t) => {
      const active = activeTab === t.id;
      const Icon = t.icon;
      return (
        <button
          key={t.id}
          type="button"
          onClick={() => onTab(t.id)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: ".75rem",
            textAlign: "left",
            padding: ".7rem .8rem",
            marginBottom: ".25rem",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            background: active ? T.ink : "transparent",
            color: active ? "#fff" : T.ink,
            transition: "background .15s ease",
          }}
        >
          {Icon && (
            <span
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                display: "grid",
                placeItems: "center",
                flex: "0 0 auto",
                background: active ? "rgba(255,255,255,.15)" : T.lineSoft,
                color: active ? "#F6872A" : T.muted,
              }}
            >
              <Icon size={17} />
            </span>
          )}
          <span style={{ lineHeight: 1.2 }}>
            <span style={{ display: "block", fontWeight: 700, fontSize: ".9rem" }}>
              {t.label}
            </span>
            {t.desc && (
              <span
                style={{
                  fontSize: ".74rem",
                  color: active ? "rgba(255,255,255,.7)" : T.mutedSoft,
                }}
              >
                {t.desc}
              </span>
            )}
          </span>
        </button>
      );
    })}
  </Panel>
);

// Two-column layout: sticky tab rail + content. `children` = active pane(s).
export const EditorLayout = ({ tabs, activeTab, onTab, children }) => (
  <Row className="g-4">
    <Col lg={3}>
      <TabRail tabs={tabs} activeTab={activeTab} onTab={onTab} />
    </Col>
    <Col lg={9}>{children}</Col>
  </Row>
);

// Sticky footer save bar with a submit button.
export const SaveBar = ({ summary, saving, label = "Save All Changes", onSave }) => (
  <div style={{ position: "sticky", bottom: 0, zIndex: 20, marginTop: "1.5rem" }}>
    <Panel
      className="d-flex flex-wrap justify-content-between align-items-center gap-3"
      style={{
        padding: "1rem 1.4rem",
        borderRadius: T.radius,
        boxShadow: "0 -4px 24px rgba(30,27,75,.08)",
      }}
    >
      <div style={{ color: T.muted, fontSize: ".86rem" }}>{summary}</div>
      <Button
        type="button"
        onClick={onSave}
        disabled={saving}
        style={{
          background: `linear-gradient(120deg, ${T.ink}, #1e3a8a)`,
          border: "none",
          borderRadius: T.radiusSm,
          fontWeight: 700,
          padding: ".65rem 1.6rem",
          display: "inline-flex",
          alignItems: "center",
          gap: ".5rem",
        }}
      >
        {saving ? (
          <>
            <Spinner size="sm" /> Saving…
          </>
        ) : (
          <>
            <FiSave size={17} /> {label}
          </>
        )}
      </Button>
    </Panel>
  </div>
);

// Full-page centered loading state.
export const EditorLoading = ({ text = "Loading content…" }) => (
  <div className="page-content" style={{ background: T.bg, minHeight: "100vh" }}>
    <div style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
      <div className="text-center">
        <Spinner style={{ color: T.accent }} />
        <p className="mt-3 mb-0" style={{ color: T.muted, fontWeight: 600 }}>
          {text}
        </p>
      </div>
    </div>
  </div>
);

// Page shell: constrains width and adds bottom padding for the sticky save bar.
export const EditorPage = ({ children }) => (
  <div style={{ maxWidth: 1280, margin: "0 auto", paddingBottom: "6rem" }}>
    {children}
  </div>
);

/* ================================================================== *
 * List / CRUD page primitives (Blog, Users, …)
 * ================================================================== */

// Gradient primary button (defaults to submit) with optional spinner.
export const PrimaryButton = ({ children, saving, icon: Icon, type = "submit", ...rest }) => (
  <Button
    type={type}
    disabled={saving || rest.disabled}
    {...rest}
    style={{
      background: `linear-gradient(120deg, ${T.ink}, #1e3a8a)`,
      border: "none",
      borderRadius: T.radiusSm,
      fontWeight: 700,
      fontSize: ".9rem",
      padding: ".6rem 1.4rem",
      display: "inline-flex",
      alignItems: "center",
      gap: ".5rem",
      ...(rest.style || {}),
    }}
  >
    {saving ? <Spinner size="sm" /> : Icon ? <Icon size={16} /> : null}
    {children}
  </Button>
);

// Neutral outline button (Cancel / secondary actions).
export const GhostButton = ({ children, icon: Icon, type = "button", ...rest }) => (
  <Button
    type={type}
    {...rest}
    style={{
      background: "#fff",
      color: T.muted,
      border: `1px solid ${T.line}`,
      borderRadius: T.radiusSm,
      fontWeight: 600,
      fontSize: ".9rem",
      padding: ".6rem 1.2rem",
      display: "inline-flex",
      alignItems: "center",
      gap: ".45rem",
      ...(rest.style || {}),
    }}
  >
    {Icon && <Icon size={15} />}
    {children}
  </Button>
);

// Colored callout box: tone = "info" (amber) | "error" | "blue".
export const Callout = ({ tone = "info", children, onClose, icon: Icon }) => {
  const tones = {
    info: { bg: T.accentSoft, border: "#fde68a", fg: "#92400e" },
    error: { bg: "#fef2f2", border: T.dangerLine, fg: T.danger },
    blue: { bg: "#eef2ff", border: "#c7d2fe", fg: T.ink2 },
  };
  const c = tones[tone] || tones.info;
  return (
    <div
      className="d-flex align-items-start gap-2"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.fg,
        borderRadius: T.radiusSm,
        padding: ".7rem .9rem",
        fontSize: ".85rem",
        marginBottom: "1rem",
      }}
    >
      {Icon && <Icon size={16} style={{ flex: "0 0 auto", marginTop: 2 }} />}
      <div style={{ flex: 1 }}>{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          style={{
            background: "transparent",
            border: "none",
            color: c.fg,
            fontWeight: 700,
            cursor: "pointer",
            lineHeight: 1,
            fontSize: "1.1rem",
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

// Panel that wraps a table and beautifies it — rounded, soft headers,
// hover rows, styled search + pagination.
export const DataPanel = ({ children, style }) => (
  <Panel className="kit-datatable" style={{ padding: "1.25rem 1.4rem", ...style }}>
    <style>{`
      .kit-datatable table { color: ${T.ink}; }
      .kit-datatable thead th {
        background: ${T.lineSoft};
        color: ${T.muted};
        text-transform: uppercase;
        font-size: .72rem;
        letter-spacing: .04em;
        font-weight: 700;
        border-bottom: 1px solid ${T.line} !important;
        border-top: none !important;
        padding: .75rem .85rem;
      }
      .kit-datatable tbody td {
        border-top: 1px solid ${T.lineSoft} !important;
        padding: .7rem .85rem;
        font-size: .88rem;
        vertical-align: middle;
      }
      .kit-datatable tbody tr:hover { background: ${T.bg}; }
    `}</style>
    {children}
  </Panel>
);

// Small table-row action button (Edit / Delete) for use inside table cells.
export const TableActionBtn = ({ icon: Icon, tone = "default", children, ...rest }) => {
  const tones = {
    default: { color: T.ink, border: T.line, bg: "#fff" },
    danger: { color: T.danger, border: T.dangerLine, bg: "#fff" },
  };
  const c = tones[tone] || tones.default;
  return (
    <Button
      type="button"
      size="sm"
      {...rest}
      style={{
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        borderRadius: 8,
        fontWeight: 600,
        fontSize: ".78rem",
        padding: ".3rem .6rem",
        display: "inline-flex",
        alignItems: "center",
        gap: ".3rem",
        ...(rest.style || {}),
      }}
    >
      {Icon && <Icon size={13} />}
      {children}
    </Button>
  );
};
