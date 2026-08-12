import React from "react";
import { FiInbox, FiTrash2, FiArrowUp, FiArrowDown } from "react-icons/fi";
import ImageControl from "./ImageControl";
import FileControl from "./FileControl";
import { Field, TextField, AddButton, EmptyState, SubtleCard, IconBtn } from "./editorKit";
import { humanize, isImageField, isPdfField, emptyLike } from "./fieldHeuristics";

// NCET-style icon buttons inside item cards: neutral tone + no confirm for
// reorder, danger tone for remove (confirm handled by IconBtn by default).
const MoveBtn = ({ icon, onClick, up }) => (
  <IconBtn
    icon={icon}
    tone="default"
    confirm={false}
    onClick={onClick}
    title={up ? "Move up" : "Move down"}
  />
);
const RemoveBtn = ({ onClick }) => (
  <IconBtn icon={FiTrash2} tone="danger" onClick={onClick} title="Remove" />
);

// Generic recursive JSON form. Renders any shape:
//   - strings -> text input (image/pdf keys get upload controls)
//   - numbers -> number input
//   - booleans -> checkbox
//   - arrays  -> repeatable item cards (with add/move/remove)
//   - objects -> nested field groups
// The `onChange` contract is always "call with the new full value".
const AutoForm = ({ value, onChange, level = 0 }) => {
  if (Array.isArray(value)) {
    return <ArrayField value={value} onChange={onChange} level={level} />;
  }
  if (value && typeof value === "object") {
    return <ObjectFields value={value} onChange={onChange} level={level} />;
  }
  return <PrimitiveField value={value} onChange={onChange} />;
};

const ObjectFields = ({ value, onChange, level }) => {
  const keys = Object.keys(value || {});
  if (keys.length === 0) {
    return <EmptyState icon={FiInbox} title="No fields yet" hint='Use "Advanced: Raw JSON" to seed the initial shape.' />;
  }

  const imageKeys = keys.filter((k) => isImageField(k, value[k]));
  const pdfKeys = keys.filter((k) => !imageKeys.includes(k) && isPdfField(k, value[k]));

  return (
    <div>
      {keys.map((key) => (
        <div
          key={key}
          style={{
            borderBottom: "1px solid #eef0f9",
            padding: level === 0 ? "1.15rem 1.4rem" : ".75rem .5rem",
          }}
        >
          {imageKeys.includes(key) && typeof value[key] !== "object" ? (
            <ImageControl label={humanize(key)} value={value[key] ?? ""} onChange={(url) => onChange({ ...value, [key]: url })} />
          ) : pdfKeys.includes(key) ? (
            <FileControl label={humanize(key)} value={value[key] ?? ""} onChange={(url) => onChange({ ...value, [key]: url })} />
          ) : (
            <Field label={humanize(key)}>
              <AutoForm value={value[key]} level={level + 1} onChange={(next) => onChange({ ...value, [key]: next })} />
            </Field>
          )}
        </div>
      ))}
    </div>
  );
};

const ArrayField = ({ value, onChange, level }) => {
  const sample = value[0];

  const update = (index, next) => onChange(value.map((item, i) => (i === index ? next : item)));
  const remove = (index) => onChange(value.filter((_, i) => i !== index));
  const move = (index, dir) => {
    const next = [...value];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };
  const add = () => onChange([...value, emptyLike(sample)]);

  if (value.length === 0) {
    return (
      <div className="d-flex align-items-center gap-2">
        <span className="text-muted font-size-13">No items yet.</span>
        <AddButton onClick={add} />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column" style={{ gap: 10 }}>
      {value.map((item, index) => (
        <SubtleCard key={index} style={{ padding: ".85rem 1rem" }}>
          <div className="d-flex align-items-center" style={{ gap: 8, marginBottom: 8 }}>
            <span className="font-size-12" style={{ fontWeight: 700, color: "#6b7192", letterSpacing: ".04em" }}>
              Item {index + 1}
            </span>
            <span style={{ flex: 1 }} />
            <MoveBtn icon={FiArrowUp} up onClick={() => move(index, -1)} />
            <MoveBtn icon={FiArrowDown} onClick={() => move(index, 1)} />
            <RemoveBtn onClick={() => remove(index)} />
          </div>
          <AutoForm value={item} level={level + 1} onChange={(next) => update(index, next)} />
        </SubtleCard>
      ))}
      <div>
        <AddButton onClick={add} />
      </div>
    </div>
  );
};

const PrimitiveField = ({ value, onChange }) => {
  if (typeof value === "boolean") {
    return (
      <div className="form-check">
        <input className="form-check-input" type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        <label className="form-check-label" style={{ fontSize: ".88rem", cursor: "pointer" }}>Yes</label>
      </div>
    );
  }
  if (typeof value === "number") {
    return (
      <TextField
        type="number"
        value={value ?? 0}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    );
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return null;
  }
  const asString = value == null ? "" : String(value);
  const isLong = asString.length > 120;
  return isLong ? (
    <TextField type="textarea" rows={Math.min(6, Math.ceil(asString.length / 100))} value={asString} onChange={(e) => onChange(e.target.value)} />
  ) : (
    <TextField value={asString} onChange={(e) => onChange(e.target.value)} />
  );
};

export default AutoForm;
