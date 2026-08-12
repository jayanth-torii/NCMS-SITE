import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "reactstrap";
import { FiPlus, FiEdit2, FiTrash2, FiFileText, FiExternalLink } from "react-icons/fi";
import { toast } from "react-toastify";
import { getBlogs, deleteBlog } from "../../services/data.service";
import { EditorPage, EditorHeader, DataPanel, TableActionBtn, PrimaryButton } from "../../components/editorLayout";
import { getPreviewUrl } from "../../components/mediaUrl";

const BlogsList = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getBlogs()
      .then((r) => setBlogs(r?.data || []))
      .catch(() => toast.error("Failed to load blogs"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (b) => {
    if (!window.confirm(`Delete "${b.title}"?`)) return;
    try {
      await deleteBlog(b.blogId);
      toast.success("Blog deleted");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const active = blogs.filter((b) => b.isActive !== false).length;

  return (
    <EditorPage>
      <EditorHeader
        icon={FiFileText}
        eyebrow="Blog"
        title="Blog Posts"
        subtitle="Publish and manage articles on the public blog."
        stats={[{ value: blogs.length, label: "Total" }, { value: active, label: "Active" }]}
      />

      <div className="d-flex justify-content-end mb-3">
        <PrimaryButton icon={FiPlus} type="button" onClick={() => navigate("/blogs/new")}>
          New Post
        </PrimaryButton>
      </div>

      <DataPanel>
        <Table hover responsive className="mb-0">
          <thead>
            <tr>
              <th>Post</th>
              <th>Category</th>
              <th>Status</th>
              <th style={{ width: 150 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "#9aa0b4" }}>Loading…</td></tr>
            ) : blogs.length === 0 ? (
              <tr><td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "#9aa0b4" }}>No blog posts yet.</td></tr>
            ) : (
              blogs.map((b) => (
                <tr key={b.blogId}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {b.image && (
                        <img src={getPreviewUrl(b.image)} alt="" style={{ width: 44, height: 34, objectFit: "cover", borderRadius: 6 }} />
                      )}
                      <div>
                        <div style={{ fontWeight: 600, color: "#1e1b4b" }}>{b.title}</div>
                        <div style={{ fontSize: ".76rem", color: "#9aa0b4" }}>{b.blogId}</div>
                      </div>
                    </div>
                  </td>
                  <td>{b.category || "—"}</td>
                  <td>
                    <span
                      style={{
                        borderRadius: 999,
                        padding: ".2rem .7rem",
                        fontSize: ".74rem",
                        fontWeight: 700,
                        background: b.isActive === false ? "#eef0f9" : "#d1fae5",
                        color: b.isActive === false ? "#6b7192" : "#059669",
                      }}
                    >
                      {b.isActive === false ? "Hidden" : "Active"}
                    </span>
                  </td>
                  <td>
                    <TableActionBtn icon={FiEdit2} onClick={() => navigate(`/blogs/${b.blogId}`)} style={{ marginRight: 6 }}>
                      Edit
                    </TableActionBtn>
                    <TableActionBtn
                      icon={FiExternalLink}
                      onClick={() => window.open(`http://localhost:3100/blog/${b.blogId}`, "_blank", "noopener,noreferrer")}
                      style={{ marginRight: 6 }}
                    >
                      View
                    </TableActionBtn>
                    <TableActionBtn icon={FiTrash2} tone="danger" onClick={() => remove(b)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </DataPanel>
    </EditorPage>
  );
};

export default BlogsList;
