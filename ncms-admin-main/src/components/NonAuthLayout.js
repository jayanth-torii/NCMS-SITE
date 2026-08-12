import PropTypes from "prop-types"
import React from "react"
import withRouter from "./Common/withRouter"

const NonAuthLayout = (props) => {
  return <React.Fragment>{props.children}</React.Fragment>
}

NonAuthLayout.propTypes = {
  children: PropTypes.any,
}

export default withRouter(NonAuthLayout)
