
🎯 JobBoard Platform
A comprehensive, full-stack job board platform connecting employers with candidates. Built with modern technologies and featuring real-time notifications, responsive design, and powerful admin tools.
https://your-screenshot-url-here.png
✨ Features
👔 For Employers
Post & Manage Jobs - Create, edit, and delete job listings
Application Tracking - View and manage candidate applications
Status Updates - Shortlist, accept, or reject candidates
Real-time Notifications - Instant alerts for new applications
Dashboard Analytics - Track job performance and applicant stats
👨‍💼 For Candidates
Job Search & Filter - Browse and search available positions
One-Click Apply - Easy application with resume upload
Application Tracking - Monitor application status in real-time
Profile Management - Upload and manage resumes via Cloudinary
Dashboard Overview - Visual stats on application progress
🛡️ For Admins
Platform Overview - Complete system analytics and reports
User Management - View and manage all employers and candidates
Job Moderation - Monitor and manage all job postings
Status Analytics - Track application flow across the platform
🚀 Tech Stack
Frontend
Table
Copy
Technology	Purpose
React 18	UI library with hooks and functional components
Vite	Fast build tool and development server
React Router v6	Client-side routing with protected routes
Tailwind CSS	Utility-first CSS framework
Framer Motion	Smooth animations and transitions
Lucide React	Modern icon library
Socket.io Client	Real-time notifications
Backend
Table
Copy
Technology	Purpose
Node.js	Runtime environment
Express.js	Web framework
MongoDB	NoSQL database
Mongoose	ODM for MongoDB
JWT	Authentication tokens
Bcrypt	Password hashing
Cloudinary	Resume file storage
Socket.io	Real-time communication
📁 Project Structure
Copy
jobboard-frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── candidate/      # Candidate-specific components
│   │   ├── employer/       # Employer-specific components
│   │   ├── Navbar.jsx      # Navigation with mobile menu
│   │   ├── ProtectedRoute.jsx
│   │   └── ToastProvider.jsx
│   ├── context/            # React Context providers
│   │   ├── AuthContext.jsx # Authentication state
│   │   └── ToastContext.jsx# Notification system
│   ├── lib/
│   │   ├── api.js          # API endpoints
│   │   └── socket.js       # Socket.io configuration
│   ├── pages/              # Page components
│   │   ├── AuthPage.jsx    # Login/Register
│   │   ├── CandidateDashboard.jsx
│   │   ├── CandidateApplications.jsx
│   │   ├── ApplicationDetail.jsx
│   │   ├── EmployerDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── JobsPage.jsx
│   │   └── ...
│   ├── App.jsx             # Main app with routes
│   └── main.jsx            # Entry point
├── .env                    # Environment variables
├── package.json
└── README.md
🛠️ Installation & Setup
Prerequisites
Node.js 16+ and npm
MongoDB database (local or Atlas)
Cloudinary account (for file uploads)
1. Clone Repository
bash
Copy
git clone https://github.com/Lecksikerm/CodeAlpha_Job-Board-Platform
cd job-board-platform
2. Backend Setup
bash
Copy
cd backend
npm install

# Create .env file
cp .env.example .env

# Add your environment variables
echo "PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret" > .env

# Start server
npm run dev
3. Frontend Setup
bash
Copy
cd ../frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
4. Create Admin User
bash
Copy
# In MongoDB, set an employer as admin:
db.employers.updateOne(
  { email: "admin@example.com" },
  { $set: { isAdmin: true } }
)
🔑 Environment Variables
Frontend (.env)
Table
Copy
Variable	Description
VITE_API_URL	Backend API URL
Backend (.env)
Table
Copy
Variable	Description
PORT	Server port (default: 5000)
MONGODB_URI	MongoDB connection string
JWT_SECRET	Secret for JWT signing
CLOUDINARY_*	Cloudinary credentials
🎯 API Endpoints
Authentication
Table
Copy
Method	Endpoint	Description
POST	/api/auth/employer/register	Register employer
POST	/api/auth/employer/login	Login employer
POST	/api/auth/candidate/register	Register candidate
POST	/api/auth/candidate/login	Login candidate
Jobs
Table
Copy
Method	Endpoint	Description
GET	/api/jobs	Get all jobs
GET	/api/jobs/:id	Get single job
POST	/api/jobs	Create job (employer)
PUT	/api/jobs/:id	Update job (employer)
DELETE	/api/jobs/:id	Delete job (employer)
Applications
Table
Copy
Method	Endpoint	Description
POST	/api/applications	Apply to job
GET	/api/applications/my	Get my applications
GET	/api/applications/my/:id	Get application detail
PUT	/api/applications/:id/status	Update status (employer)
Admin
Table
Copy
Method	Endpoint	Description
GET	/api/admin/users	Get all users
GET	/api/admin/reports	Get platform stats
DELETE	/api/admin/users/:id	Delete user
🎨 Key Features Implementation
🔐 Authentication Flow
Copy
1. User registers/logs in
2. Backend validates credentials
3. JWT token generated (includes: id, role, isAdmin)
4. Token stored in localStorage
5. Protected routes check token validity
6. Auto-logout on token expiration
🔔 Real-time Notifications
Copy
Socket.io Connection Flow:
1. Client connects with user ID on login
2. Server joins user to their room
3. When application submitted → emit to employer room
4. Client receives and displays notification
5. Unread count badge updates in real-time
📱 Responsive Design
Table
Copy
Breakpoint	Layout
< 640px	Mobile: Stacked layout, hamburger menu
640px - 1024px	Tablet: 2-column grids
> 1024px	Desktop: Full sidebar, 5-column stats
🚀 Deployment
Frontend (Vercel)
bash
Copy
npm run build
# Deploy dist/ folder to Vercel
Backend (Render/Railway)
bash
Copy
# Set environment variables in dashboard
# Deploy via GitHub integration
🧪 Testing Checklist
Authentication
[ ] Employer registration
[ ] Candidate registration
[ ] Login with valid credentials
[ ] Login with invalid credentials (error toast)
[ ] Auto-redirect based on role
[ ] Admin detection and routing
Employer Features
[ ] Post new job
[ ] Edit existing job
[ ] Delete job with confirmation
[ ] View applications
[ ] Update application status
[ ] Receive real-time notifications
Candidate Features
[ ] Browse jobs
[ ] Apply with resume upload
[ ] View application status
[ ] Track application progress
[ ] View detailed application info
Admin Features
[ ] Access admin dashboard
[ ] View platform statistics
[ ] Manage employers/candidates
[ ] View application reports
🐛 Troubleshooting
Table
Copy
Issue	Solution
isAdmin not working	Check JWT includes isAdmin field
Socket.io not connecting	Verify server URL and CORS settings
Cloudinary upload fails	Check credentials and file size limits
Toast notifications not showing	Ensure ToastProvider wraps app
📸 Screenshots
Table
Copy
Page	Desktop	Mobile
Home	url	url
Employer Dashboard	url	url
Candidate Dashboard	url	url
Admin Dashboard	url	url
📝 License
MIT License - feel free to use for personal or commercial projects.
🙏 Acknowledgments
React
Tailwind CSS
