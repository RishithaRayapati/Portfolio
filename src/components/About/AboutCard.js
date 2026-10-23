import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi everyone! I’m <span className="purple">Rishitha Rayapati</span>{" "}
            from <span className="purple">Ongole, Andhra Pradesh, India</span>.
            <br />
            I’m an <span className="purple">Aspiring Software Engineer</span> and currently pursuing my{" "}
            <span className="purple">B.Tech in Computer Science and Engineering</span> at{" "}
            <span className="purple">QIS College of Engineering and Technology</span> (CGPA: 8.5).
            <br />
            <br />
            Apart from coding, here are a few things I'm passionate about:
          </p>

          <ul>
            <li className="about-activity">
              <ImPointRight /> Solving Algorithmic Puzzles (500+ problems solved on LeetCode, GFG & CodeChef) 🧩
            </li>
            <li className="about-activity">
              <ImPointRight /> Exploring New Web Frameworks & Modern Technologies 🌐
            </li>
            <li className="about-activity">
              <ImPointRight /> Participating in Hackathons & Building Innovative Projects 💡
            </li>
          </ul>

          <p style={{ color: "rgb(155 126 172)" }}>
            "Strive to build things that make a difference!"{" "}
          </p>
          <footer className="blockquote-footer">Rishitha Rayapati</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
