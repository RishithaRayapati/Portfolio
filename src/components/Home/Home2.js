import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/avatar.png";
import Tilt from "react-parallax-tilt";

function Home2() {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              LET ME <span className="purple"> INTRODUCE </span> MYSELF
            </h1>
            <p className="home-about-body">
              I’m a Computer Science Engineering student passionate about building
              practical, innovative, and scalable software solutions. I enjoy turning
              ideas into real-world applications and continuously refining my
              problem-solving and development skills.
              <br />
              <br />
              I have a strong foundation in
              <i>
                <b className="purple"> Core Java, C, JavaScript, and Python </b>
              </i>
              — with a strong interest in full-stack web development and software engineering.
              <br />
              <br />
              I love working with technologies like
              <i>
                <b className="purple">
                  {" "}
                  React.js, Node.js, Express.js, and MySQL / PostgreSQL{" "}
                </b>
              </i>
              to build responsive, user-friendly web applications and efficient backend architectures.
              <br />
              <br />
              My key focus areas include
              <i>
                <b className="purple">
                  {" "}
                  Software Development, Full-Stack Web Development, Data Structures & Algorithms, and Problem Solving.{" "}
                </b>
              </i>
              I’m always eager to learn, collaborate, and take on challenging engineering problems!
            </p>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <img src={myImg} className="img-fluid" alt="avatar" />
            </Tilt>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default Home2;
