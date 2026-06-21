# TalentBridge Project Context

## Project

TalentBridge - AI Powered Placement & Recruitment Management System

A production-quality MERN SaaS platform that replaces manual university placement workflows using a centralized recruitment system.

Goal:
Connect Students, Recruiters, and Placement Administrators.

======================
TECH STACK
======================

Frontend:
React.js + Vite
Tailwind CSS
React Router
Axios
lucide-react
recharts


Backend:
Node.js
Express.js
MongoDB Atlas
Mongoose

Authentication:
JWT
bcrypt.js


Architecture:

frontend/src/

components/
pages/
layouts/
services/
context/
utils/


backend/

controllers/
models/
routes/
middleware/
services/
config/


======================
COMPLETED
======================

PHASE 1 COMPLETE

Implemented:

- MERN folder structure
- React Vite setup
- Tailwind configured
- Express backend
- MongoDB connection
- Environment setup


PHASE 2 COMPLETE

Implemented:

Authentication system.

Working:

Register/Login
JWT Authentication
bcrypt password hashing
MongoDB User storage
Role based redirects


Roles:

STUDENT
RECRUITER
ADMIN


After registration:

Student ->
/student/dashboard

Recruiter ->
/recruiter/dashboard

Admin ->
/admin/dashboard



======================
DATABASE MODELS
======================


Collections:

Users
Jobs
Applications
Interviews
Notifications


User:

name
email
password
role

student fields:

college
branch
year
cgpa
skills[]
resume
github
linkedin
projects[]


Job:

company
title
description
requirements[]
ctc
location
deadline
createdBy


Application:

studentId
jobId
status
matchScore


PHASE 3:

Professional SaaS dashboard foundation

Create:

DashboardLayout
Sidebar
Navbar

Reusable:

Cards
Tables
Buttons
Inputs
Loading states


Dashboards:

StudentDashboard
RecruiterDashboard
AdminDashboard


PHASE 4:

Student module

Features:

Profile
View jobs
Apply jobs
Application tracking


PHASE 5:

Recruiter module

Features:

Create jobs
View applicants
Filter candidates
Shortlist/reject



======================
REMAINING PHASES
======================


PHASE 6:

Admin module

Features:

Analytics
Manage students
Manage companies


PHASE 7:

AI Resume Parser

Upload PDF resume.

Extract:

skills
education
projects
experience


PHASE 8:

AI Candidate Match Engine

Generate job match score.

Factors:

skills
CGPA
projects
experience


PHASE 9:

Notifications
Polish
Deployment
