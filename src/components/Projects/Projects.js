import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import codeorbit from "../../Assets/Projects/codeorbit.jpg";
import rankboard from "../../Assets/Projects/rankboard.jpg";
import linora from "../../Assets/Projects/linora.jpg";
import trustpay from "../../Assets/Projects/trustpay.jpg";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={codeorbit}
              isBlog={false}
              title="CodeOrbit"
              description="An interactive DSA learning platform featuring 19 structured topics, immersive 3D visuals using Three.js and WebGL, and an engaging interface with an interactive 3D keyboard and topic exploration designed to make learning data structures and algorithms intuitive and enjoyable."
              ghLink="https://github.com/VenkataSudheerKalahasthi/CodeOrbit-1"
              demoLink="https://codeorbit-dsa.vercel.app/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={rankboard}
              isBlog={false}
              title="CollegeDSA RankBoard"
              description="A college-level competitive programming platform aggregating coding statistics across LeetCode, GeeksforGeeks, HackerRank, and CodeChef. Features a weighted scoring engine, real-time leaderboard updates using Supabase, Clerk authentication, student management, and shareable achievement showcases."
              ghLink="https://github.com/RishithaRayapati"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={linora}
              isBlog={false}
              title="Linora"
              description="A modern clothing e-commerce platform featuring an elegant design, stylish product displays, and a responsive interface. Delivers a seamless online fashion shopping experience through contemporary aesthetics, product categorization, and intuitive navigation."
              ghLink="https://github.com/RishithaRayapati"
              demoLink="https://linora-black.vercel.app/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={trustpay}
              isBlog={false}
              title="TrustPay"
              description="A full-stack client-worker escrow platform enabling safe collaboration through service requests, digital contracts, e-signatures, milestones, and secure transaction management using React.js, Node.js, Express.js, PostgreSQL, Supabase, JWT auth, and Socket.IO."
              ghLink="https://github.com/RishithaRayapati"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
