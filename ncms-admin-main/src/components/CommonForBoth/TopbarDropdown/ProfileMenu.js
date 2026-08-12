import React, { useState } from "react"
import PropTypes from "prop-types"
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap"

import { connect } from "react-redux"
import { Link } from "react-router-dom"
import withRouter from "components/Common/withRouter"
import Avatar3D from "../Avatar3D"
import Swal from "sweetalert2"

const ProfileMenu = (props) => {
  const [menu, setMenu] = useState(false)

  const handleLogout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your session.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0e2455",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out!"
    }).then((result) => {
      if (result.isConfirmed) {
        props.router.navigate("/logout");
      }
    });
  }
  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item waves-effect"
          id="page-header-user-dropdown"
          tag="button"
        >
          <span className="d-inline-flex align-items-center justify-content-center" title="Account">
            <Avatar3D size={38} />
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <Link to="/profile" className="dropdown-item">
            <i className="mdi mdi-account-circle font-size-17 text-muted align-middle me-1" />
            <span>My Profile</span>
          </Link>
          <div className="dropdown-divider" />
          <a href="#" onClick={handleLogout} className="dropdown-item text-danger">
            <i className="mdi mdi-power font-size-17 text-muted align-middle me-1 text-danger" />
            <span>Logout</span>
          </a>
          <Link to="/changepassword" className="dropdown-item text-success">
            <i className="mdi mdi-cog font-size-17 text-muted align-middle me-1" />
            <span>Change password</span>
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}

ProfileMenu.propTypes = {
  t: PropTypes.any,
}

export default withRouter(connect(null, {})(ProfileMenu))
