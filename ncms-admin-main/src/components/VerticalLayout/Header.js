import PropTypes from "prop-types"
import React from "react"

import { connect } from "react-redux"

import { Link } from "react-router-dom"

import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu"

// NCMS logo (white variant for the dark sidebar brand box).
import NCMS_LOGO from "../../assets/images/ncms-logo.png"

// Redux Store
import {
  showRightSidebarAction,
} from "../../store/actions"

const Header = props => {
  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen()
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        )
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      }
    }
  }

  function tToggle() {
    var body = document.body;
    body.classList.toggle("vertical-collpsed");
    body.classList.toggle("sidebar-enable");
  }
  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box" style={{ padding: "0 0.5rem" }}>
              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src={NCMS_LOGO} alt="NCMS" height="34" style={{ maxWidth: "100%", objectFit: "contain" }} />
                </span>
                <span className="logo-lg">
                  <img src={NCMS_LOGO} alt="Nagarjuna College of Management Studies" height="56" style={{ maxWidth: "100%", width: "100%", objectFit: "contain" }} />
                </span>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => {
                tToggle()
              }}
              className="btn btn-sm px-3 font-size-24 header-item waves-effect vertical-menu-btn"
              id="vertical-menu-btn"
            >
              <i className="mdi mdi-menu"></i>
            </button>
            <div className="d-none d-sm-flex align-items-center ms-3 header-item">
              <h4 className="mb-0 font-size-18" style={{ fontWeight: "600", color: "#0e2455", letterSpacing: "0.3px" }}>NCMS Administration Panel</h4>
            </div>
          </div>
          <div className="d-flex">
            <div className="dropdown d-none d-lg-inline-block">
              <button
                type="button"
                onClick={() => {
                  toggleFullscreen()
                }}
                className="btn header-item noti-icon waves-effect"
                data-toggle="fullscreen"
              >
                <i className="mdi mdi-fullscreen font-size-24"></i>
              </button>
            </div>

            <ProfileMenu />
          </div>
        </div>
      </header>
    </React.Fragment>
  )
}

Header.propTypes = {
  showRightSidebarAction: PropTypes.func,
}

const mapStatetoProps = state => {
  const {
    layoutType,
    showRightSidebar,
    leftMenu,
    leftSideBarType,
  } = state.Layout
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType }
}

export default connect(mapStatetoProps, {
  showRightSidebarAction,
})(Header)
