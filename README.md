# TalentBridge

TalentBridge is a modern, AI-powered placement and recruitment platform designed to connect students with top recruiters. Built with a robust MERN stack and a sleek Tailwind CSS frontend, it streamlines the hiring process through intelligent candidate matching and automated resume analysis.

## 🌟 Core Features

### 🎓 For Students
- **Smart Profiles**: Maintain academic records, technical skills, and professional links.
- **AI Resume Analysis**: Upload PDF resumes to automatically extract skills and gauge placement readiness.
- **Job Board**: Discover and apply to curated job opportunities matching your profile.
- **Application Tracking**: Monitor the status of your applications in real-time.
- **Placement Readiness**: View an AI-generated score measuring resume quality, skill match, and project strength.

### 🏢 For Recruiters
- **Job Management**: Post, edit, and delete job listings with detailed requirements.
- **Applicant Tracking**: Review candidates systematically using a built-in Kanban-style pipeline.
- **AI Candidate Intelligence**: Generate deep, AI-powered insights on applicants to identify strengths, missing skills, and overall fit.
- **Smart Interview Prep**: Automatically generate dynamic, customized technical interview questions based on the candidate's profile and the job description.

### 👑 For Administrators
- **Comprehensive Dashboard**: View global analytics including total applications, placements, and AI insights.
- **Student & Recruiter Management**: Oversee all users on the platform.
- **Announcements**: Broadcast important updates to all students and recruiters.

## 🚀 Technology Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: React Hot Toast
- **Routing**: React Router DOM

### Backend
- **Framework**: Express.js (Node.js)
- **Database**: MongoDB & Mongoose
- **Authentication**: JSON Web Tokens (JWT) & bcrypt.js
- **File Uploads**: Multer
- **AI Integration**: Google Gemini API
- **PDF Parsing**: pdf-parse

## ⚙️ Architecture Overview

The system uses a standard client-server architecture with role-based access control (RBAC). 
- The **Frontend** consists of separated dashboards for Students, Recruiters, and Admins, protected by higher-order components.
- The **Backend** handles authentication, database interactions, file storage (for resumes), and communicates with the Gemini API to provide intelligent candidate summaries and matching scores.

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)
- Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/talentbridge.git
cd talentbridge
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file based on `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/talentbridge
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Create a `.env` file based on `.env.example`:
```env
VITE_API_URL=http://localhost:5000
```
Start the frontend development server:
```bash
npm run dev
```

### 4. Admin Account Creation
To access the Admin Dashboard, you need an admin account. Run the provided script:
```bash
cd backend
node scripts/createAdmin.js
```
*Note: Make sure your MongoDB is running and `MONGO_URI` is correctly configured.*

## 📸 Screenshots
*(Add screenshots of your application here)*

- **Student Dashboard**: `![Student Dashboard](placeholder)`
- **AI Candidate Intelligence**: `![AI Report](placeholder)`
- **Admin Analytics**: `![Admin Analytics](placeholder)`

## 🛡️ License
This project is licensed under the MIT License.
