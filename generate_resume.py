import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch

pdf_path = r"c:\Users\DELL\Downloads\Portfolio-master\Portfolio-master\src\Assets\Soumyajit_Behera.pdf"
copy_path = r"c:\Users\DELL\Downloads\Portfolio-master\Portfolio-master\src\Assets\Rishitha_Rayapati_Resume.pdf"

doc = SimpleDocTemplate(
    pdf_path,
    pagesize=letter,
    leftMargin=36,
    rightMargin=36,
    topMargin=28,
    bottomMargin=28
)

styles = getSampleStyleSheet()

# Custom styles for clean, professional single-page resume
name_style = ParagraphStyle(
    'Name',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=18,
    leading=20,
    alignment=1, # Center
    textColor=colors.HexColor('#111827'),
    spaceAfter=3
)

contact_style = ParagraphStyle(
    'Contact',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8.5,
    leading=11,
    alignment=1, # Center
    textColor=colors.HexColor('#374151'),
    spaceAfter=8
)

section_heading = ParagraphStyle(
    'SectionHeading',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=10.5,
    leading=13,
    textColor=colors.HexColor('#111827'),
    spaceBefore=5,
    spaceAfter=2,
    keepWithNext=True
)

body_style = ParagraphStyle(
    'Body',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8.2,
    leading=10.5,
    textColor=colors.HexColor('#1f2937'),
    spaceAfter=2
)

bold_body = ParagraphStyle(
    'BoldBody',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=8.2,
    leading=10.5,
    textColor=colors.HexColor('#111827')
)

tech_style = ParagraphStyle(
    'TechSubtitle',
    parent=styles['Normal'],
    fontName='Helvetica-Oblique',
    fontSize=7.8,
    leading=9.5,
    textColor=colors.HexColor('#4b5563'),
    spaceAfter=2
)

bullet_style = ParagraphStyle(
    'Bullet',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=8.0,
    leading=10.0,
    textColor=colors.HexColor('#1f2937'),
    leftIndent=10,
    firstLineIndent=-10,
    spaceAfter=1.5
)

story = []

# Header
story.append(Paragraph("RAYAPATI RISHITHA", name_style))
story.append(Paragraph(
    "+91 9121624512 &nbsp;|&nbsp; rishitharayapati40@gmail.com &nbsp;|&nbsp; Portfolio &nbsp;|&nbsp; GitHub &nbsp;|&nbsp; LinkedIn",
    contact_style
))
story.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor('#d1d5db'), spaceBefore=0, spaceAfter=4))

# Professional Summary
story.append(Paragraph("Professional Summary", section_heading))
story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#9ca3af'), spaceBefore=0, spaceAfter=3))
story.append(Paragraph(
    "Computer Science Engineering student with a strong foundation in Java, SQL, Data Structures and Algorithms, and software development. Skilled in problem-solving, debugging, database management, and developing practical software solutions through academic and personal projects. Demonstrates analytical thinking, adaptability, and a strong commitment to continuous learning. Eager to contribute technical expertise, collaborate with cross-functional teams, and deliver efficient, reliable solutions as an Associate Engineer in a technology-driven environment.",
    body_style
))

# Education
story.append(Paragraph("Education", section_heading))
story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#9ca3af'), spaceBefore=0, spaceAfter=3))

edu_data = [
    [
        Paragraph("<b>QIS College of Engineering and Technology</b>, Ongole, Andhra Pradesh<br/>Bachelor of Technology in Computer Science", body_style),
        Paragraph("<div align='right'><b>2023 – 2027</b><br/>CGPA: <b>8.5</b></div>", body_style)
    ],
    [
        Paragraph("<b>Sri Chaitanya Jr College</b>, Ongole, Andhra Pradesh<br/>MPC", body_style),
        Paragraph("<div align='right'><b>2021 – 2023</b><br/><b>94.2%</b></div>", body_style)
    ],
    [
        Paragraph("<b>Sri Sai High School</b>, Ongole, Andhra Pradesh<br/>SSC", body_style),
        Paragraph("<div align='right'><b>2020 – 2021</b><br/><b>99.7%</b></div>", body_style)
    ]
]
edu_table = Table(edu_data, colWidths=[400, 140])
edu_table.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('BOTTOMPADDING', (0,0), (-1,-1), 1),
    ('TOPPADDING', (0,0), (-1,-1), 1),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
]))
story.append(edu_table)

# Technical Skills
story.append(Paragraph("Technical Skills", section_heading))
story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#9ca3af'), spaceBefore=0, spaceAfter=3))
skills = [
    ("Programming Languages:", "Core Java, JavaScript, C"),
    ("Frontend Technologies:", "HTML, CSS, React.js"),
    ("Backend Technologies:", "Java, REST APIs"),
    ("Databases:", "MySQL"),
    ("Developer Tools:", "Git, GitHub, VS Code, Supabase, Postman"),
    ("Automation & Workflow Tools:", "n8n"),
    ("Core Computer Science:", "Data Structures and Algorithms, OOP, DBMS, Operating Systems, Computer Networks"),
    ("Soft Skills:", "Communication, Problem Solving, Team Collaboration, Leadership")
]
for cat, items in skills:
    story.append(Paragraph(f"<b>{cat}</b> {items}", body_style))

# Projects
story.append(Paragraph("Projects", section_heading))
story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#9ca3af'), spaceBefore=0, spaceAfter=3))

# TrustPay
story.append(Paragraph("<b>TrustPay – Client-Worker Escrow Platform</b>", bold_body))
story.append(Paragraph("<i>React.js, Node.js, Express.js, PostgreSQL, Prisma, Supabase, Socket.IO, JWT</i>", tech_style))
story.append(Paragraph("• Developed a full-stack escrow platform enabling client-worker collaboration through service requests, digital contracts, e-signatures, milestones, and transaction management using React.js, Node.js, Express.js, and PostgreSQL.", bullet_style))
story.append(Paragraph("• Implemented JWT authentication and Role-Based Access Control (RBAC) for Client, Worker, and Admin workflows, enforcing role-specific authorization across REST APIs.", bullet_style))
story.append(Paragraph("• Engineered real-time communication using Socket.IO for collaboration requests, chat messaging, contract updates, notifications, and transaction events.", bullet_style))
story.append(Paragraph("• Designed wallet and escrow workflows for milestone-based funding, secure fund release, transaction history, invoice generation, and completion certificates with persistent database management.", bullet_style))

# DSA RankBoard
story.append(Spacer(1, 2))
story.append(Paragraph("<b>DSA RankBoard – College Competitive Programming Platform</b>", bold_body))
story.append(Paragraph("<i>React.js, Node.js, Express.js, Supabase, Clerk, REST APIs, Web Scraping</i>", tech_style))
story.append(Paragraph("• Developed a college-level DSA leaderboard aggregating coding statistics from LeetCode, GeeksforGeeks, HackerRank, Codeforces, and CodeChef.", bullet_style))
story.append(Paragraph("• Implemented a weighted scoring and ranking engine to evaluate student performance and dynamically update leaderboard positions based on coding statistics.", bullet_style))
story.append(Paragraph("• Built separate Student and Admin portals with Clerk authentication, student management, bulk Excel import, profile auditing, platform synchronization, and real-time leaderboard updates using Supabase.", bullet_style))
story.append(Paragraph("• Developed a shareable achievement showcase displaying student rank, overall score, total problems solved, and platform-wise performance.", bullet_style))

# CodeOrbit
story.append(Spacer(1, 2))
story.append(Paragraph("<b>CodeOrbit – DSA Learning Platform [Live Demo]</b>", bold_body))
story.append(Paragraph("<i>HTML5, CSS3, JavaScript, React.js, Three.js, WebGL, Responsive Design, Git/GitHub</i>", tech_style))
story.append(Paragraph("• Developed a responsive DSA learning platform covering 19 structured topics with interactive navigation and immersive 3D visualizations using Three.js and WebGL.", bullet_style))
story.append(Paragraph("• Implemented interactive 3D keyboard and topic exploration with hover-based previews, click-based navigation, and Dark/Light theme support.", bullet_style))

# Certifications
story.append(Paragraph("Certifications", section_heading))
story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#9ca3af'), spaceBefore=0, spaceAfter=3))
story.append(Paragraph("• <b>Introduction to Data Science, Artificial Intelligence, and Natural Language Processing</b> – Infosys Springboard", bullet_style))
story.append(Paragraph("• <b>Generative AI and ChatGPT</b> – GeeksforGeeks", bullet_style))
story.append(Paragraph("• <b>Responsive Web Design</b> – freeCodeCamp", bullet_style))
story.append(Paragraph("• <b>Java</b> – CodeTantra", bullet_style))

# Achievements
story.append(Paragraph("Achievements", section_heading))
story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#9ca3af'), spaceBefore=0, spaceAfter=3))
story.append(Paragraph("• Solved <b>500+ coding problems</b> across LeetCode, HackerRank, GeeksforGeeks, and CodeChef.", bullet_style))
story.append(Paragraph("• Selected as <b>Student Ambassador</b> at Google Developer Student Clubs (GDSC).", bullet_style))
story.append(Paragraph("• Participated in multiple national-level online and offline hackathons, collaborating in teams to design, develop, and present software solutions under time constraints.", bullet_style))

# Declaration
story.append(Paragraph("Declaration", section_heading))
story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#9ca3af'), spaceBefore=0, spaceAfter=2))
story.append(Paragraph("I hereby declare that the information provided above is true and correct to the best of my knowledge and belief.", body_style))

doc.build(story)

# Also copy to Rishitha_Rayapati_Resume.pdf
import shutil
shutil.copyfile(pdf_path, copy_path)
print("Resume generated successfully at:", pdf_path, "and", copy_path)
