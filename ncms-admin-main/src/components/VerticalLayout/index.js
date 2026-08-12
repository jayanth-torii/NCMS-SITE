import PropTypes from "prop-types"
import React, { useEffect } from "react"

import { connect } from "react-redux"
import { Container } from "reactstrap"
import withRouter from "components/Common/withRouter"
import {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  changeTopbarTheme,
  changeLayoutWidth,
  changeColor,
  showRightSidebarAction,
  changeMode,
  setBreadcrumbItems
} from "../../store/actions"

import { useSelector, useDispatch } from "react-redux"
import { createSelector } from "reselect"

// Layout Related Components
import Header from "./Header"
import Sidebar from "./Sidebar"
import Footer from "./Footer"
import Rightbar from "../CommonForBoth/Rightbar"
//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb"

const Layout = (props) => {
  const dispatch = useDispatch();

  const selectLayoutState = (state) => state.Layout;

  const selectLayoutProperties = createSelector(
    selectLayoutState,
    (layout) => ({
      leftSideBarTheme: layout.leftSideBarTheme,
      layoutWidth: layout.layoutWidth,
      leftSideBarType: layout.leftSideBarType,
      topbarTheme: layout.topbarTheme,
      layoutColor: layout.layoutColor,
      layoutMode: layout.layoutMode
    })
  );

  const {
    leftSideBarTheme,
    layoutWidth,
    leftSideBarType,
    topbarTheme,
    layoutColor,
    layoutMode
  } = useSelector(selectLayoutProperties);

  useEffect(() => {
    const hideRightbar = (event) => {
      var rightbar = document.getElementById("right-bar");
      //if clicked in inside right bar, then do nothing
      if (rightbar && rightbar.contains(event.target)) {
        return;
      } else {
        //if clicked in outside of rightbar then fire action for hide rightbar
        dispatch(showRightSidebarAction(false));
      }
    };

    //init body click event fot toggle rightbar
    document.body.addEventListener("click", hideRightbar, true);

    // Cleanup the event listener on component unmount
    return () => {
      document.body.removeEventListener("click", hideRightbar, true);
    };
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (props.router && props.router.location) {
      const path = props.router.location.pathname;
      if (path) {
        let titleName = path === "/" ? "Dashboard" : path.substring(1).replace(/-/g, " ");
        // Capitalize words
        titleName = titleName.replace(/\b\w/g, (l) => l.toUpperCase());
        dispatch(setBreadcrumbItems(titleName, [
          { title: "Dashboard", link: "/dashboard" },
          { title: titleName, link: path },
        ]));
      }
    }
  }, [props.router?.location?.pathname, dispatch]);

  useEffect(() => {
    dispatch(changeLayout("vertical"));
  }, [dispatch]);

  useEffect(() => {
    if (leftSideBarTheme) {
      dispatch(changeSidebarTheme(leftSideBarTheme));
    }
  }, [leftSideBarTheme, dispatch]);

  useEffect(() => {
    if (layoutWidth) {
      dispatch(changeLayoutWidth(layoutWidth));
    }
  }, [layoutWidth, dispatch]);

  useEffect(() => {
    if (layoutMode) {
      dispatch(changeMode(layoutMode));
    }
  }, [layoutMode, dispatch]);

  useEffect(() => {
    if (leftSideBarType) {
      dispatch(changeSidebarType(leftSideBarType));
    }
  }, [leftSideBarType, dispatch]);

  useEffect(() => {
    if (topbarTheme) {
      dispatch(changeTopbarTheme(topbarTheme));
    }
  }, [topbarTheme, dispatch]);

  useEffect(() => {
    if (layoutColor) {
      dispatch(changeColor(layoutColor));
    }
  }, [layoutColor, dispatch]);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const toggleMenuCallback = () => {
    if (leftSideBarType === "default") {
      dispatch(changeSidebarType("condensed", isMobile));
    } else if (leftSideBarType === "condensed") {
      dispatch(changeSidebarType("default", isMobile));
    }
  };

  return (
    <React.Fragment>
      <div id="layout-wrapper">
        <Header toggleMenuCallback={toggleMenuCallback} />
        <Sidebar
          theme={props.leftSideBarTheme}
          type={props.leftSideBarType}
          isMobile={props.isMobile}
        />
        <div className="main-content">
          <div className="page-content">
            <Container fluid>
              <Breadcrumb />
              {props.children}
            </Container>
          </div>
          <Footer />
        </div>
      </div>
      {props.showRightSidebar ? <Rightbar /> : null}
    </React.Fragment>
  )
}

Layout.propTypes = {
  children: PropTypes.object,
  layoutWidth: PropTypes.any,
  leftSideBarTheme: PropTypes.any,
  leftSideBarType: PropTypes.any,
  location: PropTypes.object,
  showRightSidebar: PropTypes.any,
  topbarTheme: PropTypes.any,
}

const mapStatetoProps = (state) => {
  return {
    ...state.Layout,
  }
}
export default connect(mapStatetoProps, {})(withRouter(Layout))
