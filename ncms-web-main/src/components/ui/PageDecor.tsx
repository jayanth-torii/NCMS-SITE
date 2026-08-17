/* Fullscreen decorative background — soft shades + geometric shapes.
   Reuses the global dept-page-decor system (nispExplorer.scss) but ONLY
   non-circle shapes: triangle, diamonds, plus signs. Glows/dot-grid are
   the soft "shade" layer. Place as the first child of a <main> whose
   background is transparent. */
const PageDecor = () => (
  <div className="dept-page-decor" aria-hidden="true">
    <div className="dept-page-gradient"></div>
    <div className="dept-page-dots"></div>
    <div className="dept-pane-glow dept-pane-glow-orange"></div>
    <div className="dept-pane-glow dept-pane-glow-blue"></div>
    <div className="dept-pane-glow dept-pane-glow-navy"></div>
    <div className="dept-pane-shape dept-pane-triangle"></div>
    <div className="dept-pane-shape dept-pane-diamond"></div>
    <div className="dept-pane-shape dept-pane-diamond-blue"></div>
    <div className="dept-pane-shape dept-pane-plus"></div>
    <div className="dept-pane-shape dept-pane-plus-blue"></div>
  </div>
);

export default PageDecor;
