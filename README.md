Student Management System
A complete, modern, responsive Student Management Web Application built with React 19, TypeScript, Tailwind CSS, Motion, and offline-first persistence.
🔗 Live Demo: https://ais-dev-xrsj5ow552mwbghrfwk75k-273530086375.asia-southeast1.run.app
🌐 Shared Preview: https://ais-pre-xrsj5ow552mwbghrfwk75k-273530086375.asia-southeast1.run.app
1. Technology Stack
Layer	Technology
Frontend	React.js (v19), TypeScript (v5.8), HTML5, CSS3 / Tailwind CSS v4
State & Storage	React Hooks (useState, useMemo, useEffect) & Browser localStorage
Icons & UI	Lucide React Icons & Motion Animations
Styling & Layout	Tailwind CSS v4 (Flexbox, CSS Grid, Responsive Dark/Light Modes)
Build & Dev Tool	Vite (v6) + @tailwindcss/vite
Type Checking	TypeScript Compiler (tsc --noEmit)
Version Control	Git & GitHub
2. Project Architecture
code
Text
student-management-system/
├── index.html                    # Application entry point & meta tags
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript compiler configuration
├── vite.config.ts                # Vite & Tailwind plugin setup
├── metadata.json                 # Applet metadata configuration
├── README.md                     # Comprehensive project documentation
└── src/
    ├── main.tsx                  # React 19 DOM root mounting
    ├── App.tsx                   # Main Dashboard state, filtering, modals & toast controller
    ├── index.css                 # Tailwind CSS v4 directives & font definitions
    ├── types.ts                  # Shared TypeScript interfaces, types & constants
    ├── components/
    │   ├── Navbar.tsx            # Header with branding, quick stats, theme toggle & add CTA
    │   ├── StatsCards.tsx        # 4 analytical metric overview cards (Total, Avg, Pass Rate, Top Dept)
    │   ├── StudentTable.tsx      # Interactive table with search, filters, sorting & pagination
    │   ├── StudentModal.tsx      # Slide-over drawer form for Add & Edit operations
    │   ├── ViewStudentModal.tsx  # Detailed profile inspection modal with academic progress
    │   ├── DeleteConfirmModal.tsx# Deletion confirmation dialog with rollback prevention
    │   └── Toast.tsx             # Animated toast alert notifications
    └── utils/
        └── storage.ts            # LocalStorage persistence manager & initial sample datasets
3. Student Data Model & Validation Rules
Field	Type	Rules & Constraints
id	string (UUID)	Primary Key, Auto-generated timestamp-based identifier
rollNumber	string	Required, Unique across all records, cannot be blank, uppercase formatted
fullName	string	Required, cannot be blank, minimum 2 characters
course	string	Required, selected from standard departments or custom entered
email	string	Required, unique valid email pattern (name@domain.ext)
phone	string	Required, valid phone number (between 7 and 15 digits)
marks	number	Required, numeric value strictly bounded between 0 and 100
grade	string	Auto-computed in real time (
, 
, 
, 
, 
, 
)
createdAt	string (ISO 8601)	Auto-generated creation timestamp
updatedAt	string (ISO 8601)	Auto-updated timestamp on modification
4. Student Data Payloads
Sample JSON Record (Create / Update)
code
JSON
{
  "fullName": "Sarah Connor",
  "rollNumber": "2024CS101",
  "course": "Computer Science & Engineering",
  "email": "sarah.connor@example.com",
  "phone": "9876543210",
  "marks": 94,
  "grade": "A+"
}
Full Student Object Structure
code
JSON
{
  "id": "std-1710600000000",
  "fullName": "Sarah Connor",
  "rollNumber": "2024CS101",
  "course": "Computer Science & Engineering",
  "email": "sarah.connor@example.com",
  "phone": "9876543210",
  "marks": 94,
  "grade": "A+",
  "createdAt": "2026-09-17T02:00:00.000Z",
  "updatedAt": "2026-09-17T02:00:00.000Z"
}
5. Getting Started & Setup Guide
Prerequisites
Node.js 18.0 or higher
npm 9.0 or higher
Git
Installation Steps
Clone the repository:
code
Bash
git clone https://github.com/arunmahesh7889/Student-Management-System.git
cd Student-Management-System
Install dependencies:
code
Bash
npm install
Verify type safety with TypeScript:
code
Bash
npm run lint
Start the development server:
code
Bash
npm run dev
Open the application:
Open your browser and navigate to http://localhost:3000/.
6. Key Features & Functionality
Create Student: Slide-over drawer form with instant field-level validation, roll number uniqueness checks, and real-time letter grade calculation preview.
Read & Search: Live case-insensitive search filtering across Name, Roll Number, Department, and Email.
Filtering & Sorting: Department and Grade dropdown filters with active filter counter badge, and click-to-sort column headers.
View Student Profile: Dedicated modal showing contact information, enrollment timestamps, and a visual marks progress bar.
Update Student: Seamless edit mode in slide-over drawer pre-populated with existing record data.
Delete Student: Protected deletion with a confirmation modal showing student details.
Analytics Cards: Live computation of Total Students, Cohort Average Score, Pass Rate (
), and Top Department.
CSV Export: One-click export button downloading the current filtered dataset into a spreadsheet-ready .csv file.
Dark / Light Mode: Theme toggle with persistent preference saved to localStorage.
7. Version Control with Git & GitHub
Initialize and publish the repository to GitHub:
code
Bash
# 1. Navigate to project root
cd student-management-system

# 2. Initialize Git repository
git init

# 3. Add all files
git add .

# 4. Commit changes
git commit -m "feat: complete student management system with React and TypeScript"

# 5. Connect to your GitHub repository
git remote add origin https://github.com/arunmahesh7889/Student-Management-System.git

# 6. Push to main branch
git branch -M main
git push -u origin main
