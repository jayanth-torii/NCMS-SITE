import React from "react";
import PropTypes from "prop-types";
import { FiUser } from "react-icons/fi";

/**
 * Glassy avatar orb used for the header profile icon and the profile page.
 * Mirrors NCET's Avatar3D visual (specular highlight + rim light + soft glow)
 * without the animation overhead.
 */
const Avatar3D = ({ size = 40, initials, glyphSize }) => {
  const gs = glyphSize || size * 0.46;
  const showOrbit = size >= 64;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "inline-block",
        lineHeight: 0,
        perspective: size * 8,
      }}
    >
      {/* ambient glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: -size * 0.16,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,.5) 0%, rgba(99,102,241,0) 68%)",
          filter: "blur(4px)",
          opacity: showOrbit ? undefined : 0.4,
          zIndex: 0,
        }}
      />

      {/* orbiting accent ring (only on larger sizes) */}
      {showOrbit && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: -size * 0.1,
            borderRadius: "50%",
            border: "1.5px solid rgba(165,180,252,.35)",
            zIndex: 1,
          }}
        />
      )}

      {/* the orb */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: size,
          height: size,
          borderRadius: "50%",
          background: "radial-gradient(circle at 32% 28%, rgba(255,255,255,.85) 0%, rgba(199,210,254,.55) 14%, rgba(99,102,241,.85) 42%, rgba(67,56,202,.98) 78%, rgba(49,46,129,1) 100%)",
          boxShadow: "inset -4px -6px 12px rgba(30,27,75,.45), inset 3px 4px 8px rgba(255,255,255,.45), 0 8px 18px rgba(30,27,75,.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {initials ? (
          <span
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: gs * 0.62,
              letterSpacing: ".02em",
              textShadow: "0 1px 3px rgba(30,27,75,.6)",
            }}
          >
            {initials}
          </span>
        ) : (
          <FiUser
            size={gs}
            style={{ color: "#fff", filter: "drop-shadow(0 1px 3px rgba(30,27,75,.5))" }}
          />
        )}
      </div>
    </div>
  );
};

Avatar3D.propTypes = {
  size: PropTypes.number,
  initials: PropTypes.string,
  glyphSize: PropTypes.number,
};

export default Avatar3D;
