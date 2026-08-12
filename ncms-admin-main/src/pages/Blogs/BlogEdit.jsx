import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "reactstrap";
import { FiFileText, FiSave } from "react-icons/fi";
import { toast } from "react-toastify";
import { getBlog, createBlog, updateBlog } from "../../services/data.service";
import { EditorPage, EditorHeader, Panel, Field, TextField, PrimaryButton, GhostButton } from "../../components/editorLayout";
import { GlobalUploadModal, ImageControl } from "../../components/shared";

const BlogEdit = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const isNew = postId === "new";
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    blogId: "",
    title: "",
    category: "",
    date: "",
    author: "",
    image: "",
    readTime: "",
    description: "",
    content: "",
    isActive: true,
  });

  useEffect(() => {
    if (isNew) return;
    getBlog(postId)
      .then((r) => {
        const b = r?.data || {};
        setForm({
          blogId: b.blogId || "",
          title: b.title || "",
          category: b.category || "",
          date: b.date || "",
          author: b.author || "",
          image: b.image || "",
          readTime: b.readTime || "",
          description: b.description || "",
          content: Array.isArray(b.content) ? b.content.join("\n\n") : b.content || "",
          isActive: b.isActive !== false,
        });
      })
      .catch(() => toast.error("Failed to load blog"))
      .finally(() => setLoading(false));
  }, [postId, isNew]);

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        content: form.content, // stored verbatim; public site renders paragraphs
        blogId: form.blogId || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60),
      };
      if (isNew) {
        await createBlog(payload);
        toast.success("Blog created");
      } else {
        await updateBlog(postId, payload);
        toast.success("Blog updated");
      }
      navigate("/blogs");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <EditorPage>
        <Panel style={{ padding: "3rem", textAlign: "center" }}>
          <Spinner color="warning" />
        </Panel>
      </EditorPage>
    );
  }

  return (
    <EditorPage>
      <GlobalUploadModal />
      <EditorHeader
        icon={FiFileText}
        eyebrow="Blog"
        title={isNew ? "New Post" : "Edit Post"}
        subtitle="Title, cover image and content."
        mode={isNew ? "create" : "edit"}
      />

      <Panel style={{ padding: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24 }}>
          <div>
            <ImageControl label="Cover Image" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
          </div>
          <div>
            <Field label="Title">
              <TextField value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Field label="Category">
                <TextField value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </Field>
              <Field label="Date">
                <TextField value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </Field>
              <Field label="Read Time">
                <TextField value={form.readTime} onChange={(e) => setForm({ ...form, readTime: e.target.value })} />
              </Field>
            </div>
            <Field label="Author">
              <TextField value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </Field>
          </div>
        </div>

        <Field label="Slug (blogId)" hint="Used in the URL: /blog/<slug>. Auto-generated from the title if left blank.">
          <TextField value={form.blogId} onChange={(e) => setForm({ ...form, blogId: e.target.value })} />
        </Field>

        <Field label="Description / Excerpt">
          <TextField type="textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>

        <Field label="Content" hint="Separate paragraphs with a blank line. Saved verbatim and rendered by the public blog page.">
          <TextField type="textarea" rows={12} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        </Field>

        <Field label="Active">
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: ".88rem" }}>
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Visible on the public site
          </label>
        </Field>

        <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
          <PrimaryButton icon={FiSave} type="button" onClick={save} saving={saving}>
            {isNew ? "Create Post" : "Save Changes"}
          </PrimaryButton>
          <GhostButton onClick={() => navigate("/blogs")}>Cancel</GhostButton>
        </div>
      </Panel>
    </EditorPage>
  );
};

export default BlogEdit;
