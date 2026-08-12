import React from "react"
import PropTypes from "prop-types"

import { connect } from "react-redux"
import {
  changeLayoutWidth,
  changeSidebarTheme,
  changeSidebarType,
  changeTopbarTheme,
  showRightSidebarAction,
} from "../../store/actions"

//SimpleBar
import SimpleBar from "simplebar-react"

import { Link } from "react-router-dom"

const RightSidebar = (props) => {
  return (
    <React.Fragment>
      <div className="right-bar" id="right-bar">
        <SimpleBar style={{ height: "calc(100vh - 70px)" }}>
          <div data-simplebar className="h-100">
            <div className="rightbar-title px-3 py-4">
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault()
                  props.showRightSidebarAction(false)
                }}
                className="right-bar-toggle float-end"
              >
                <i className="mdi mdi-close noti-icon" />
              </Link>
              <h5 className="m-0">Settings</h5>
            </div>

            <hr className="my-0" />

            <div className="p-4">
              <h6 className="mb-3">Layout Width</h6>
              <div className="radio-toolbar">
                <input
                  type="radio"
                  id="radio-fluid"
                  name="layoutWidth"
                  checked={props.layoutWidth === "fluid"}
                  onChange={() => props.changeLayoutWidth("fluid")}
                />
                <label htmlFor="radio-fluid">Fluid</label>
                <input
                  type="radio"
                  id="radio-boxed"
                  name="layoutWidth"
                  checked={props.layoutWidth === "boxed"}
                  onChange={() => props.changeLayoutWidth("boxed")}
                />
                <label htmlFor="radio-boxed">Boxed</label>
              </div>

              <h6 className="mt-4 mb-3">Sidebar Theme</h6>
              <div className="radio-toolbar">
                <input
                  type="radio"
                  id="sidebar-dark"
                  name="sidebarTheme"
                  checked={props.leftSideBarTheme === "dark"}
                  onChange={() => props.changeSidebarTheme("dark")}
                />
                <label htmlFor="sidebar-dark">Dark</label>
                <input
                  type="radio"
                  id="sidebar-light"
                  name="sidebarTheme"
                  checked={props.leftSideBarTheme === "light"}
                  onChange={() => props.changeSidebarTheme("light")}
                />
                <label htmlFor="sidebar-light">Light</label>
              </div>

              <h6 className="mt-4 mb-3">Sidebar Type</h6>
              <div className="radio-toolbar">
                <input
                  type="radio"
                  id="sidebar-default"
                  name="sidebarType"
                  checked={props.leftSideBarType === "default"}
                  onChange={() => props.changeSidebarType("default")}
                />
                <label htmlFor="sidebar-default">Default</label>
                <input
                  type="radio"
                  id="sidebar-condensed"
                  name="sidebarType"
                  checked={props.leftSideBarType === "condensed"}
                  onChange={() => props.changeSidebarType("condensed")}
                />
                <label htmlFor="sidebar-condensed">Condensed</label>
              </div>

              <h6 className="mt-4 mb-3">Topbar Theme</h6>
              <div className="radio-toolbar">
                <input
                  type="radio"
                  id="topbar-light"
                  name="topbarTheme"
                  checked={props.topbarTheme === "light"}
                  onChange={() => props.changeTopbarTheme("light")}
                />
                <label htmlFor="topbar-light">Light</label>
                <input
                  type="radio"
                  id="topbar-dark"
                  name="topbarTheme"
                  checked={props.topbarTheme === "dark"}
                  onChange={() => props.changeTopbarTheme("dark")}
                />
                <label htmlFor="topbar-dark">Dark</label>
              </div>
            </div>
          </div>
        </SimpleBar>
      </div>
    </React.Fragment>
  )
}

RightSidebar.propTypes = {
  changeLayoutWidth: PropTypes.func,
  changeSidebarTheme: PropTypes.func,
  changeSidebarType: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  showRightSidebarAction: PropTypes.func,
}

const mapStateToProps = (state) => {
  return {
    layoutWidth: state.Layout.layoutWidth,
    leftSideBarTheme: state.Layout.leftSideBarTheme,
    leftSideBarType: state.Layout.leftSideBarType,
    topbarTheme: state.Layout.topbarTheme,
  }
}

export default connect(mapStateToProps, {
  changeLayoutWidth,
  changeSidebarTheme,
  changeSidebarType,
  changeTopbarTheme,
  showRightSidebarAction,
})(RightSidebar)
