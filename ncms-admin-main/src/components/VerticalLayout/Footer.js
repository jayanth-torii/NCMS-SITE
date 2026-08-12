import React from "react"
import { Container, Row, Col } from "reactstrap"
import NCMS_LOGO from "../../assets/images/ncms-logo.png"

const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md={6}>
              <div className="d-flex align-items-center gap-2">
                <img
                  src={NCMS_LOGO}
                  alt="NCMS"
                  height="22"
                  style={{ objectFit: "contain" }}
                />
                <span>
                  © {year} <b>Nagarjuna College of Management Studies</b>. All Rights Reserved.
                </span>
              </div>
            </Col>
            <Col md={6} className="text-md-end">
              <span>
                Powered by <b>NCMS</b>
              </span>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer
