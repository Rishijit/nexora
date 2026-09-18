# Nexora

### Your Personal Productivity Workspace

Nexora is a modern, full-stack productivity and workspace application designed to help users organize notes, manage tasks, store files, and keep their important resources in one focused digital space.

This project is my first complete full-stack web application and was developed to strengthen my practical understanding of frontend development, backend engineering, database integration, authentication, file handling, and cloud deployment.

---

## Live Demo

🌐 **Live Application:** https://nexora-7f9j.vercel.app

> The live URL may change as the project continues to evolve.

---

## Features

### 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- Password hashing using bcrypt
- Protected application routes
- User-specific notes, files, and tasks

### 📝 Notes Management

- Create, edit, and delete notes
- Rich-text note editor
- Bold, italic, underline, and strikethrough formatting
- Headings and paragraphs
- Ordered and unordered lists
- Text alignment
- Text color and highlighting
- Blockquotes and code formatting
- Insert images into notes
- Upload images
- Embed YouTube videos
- Add dividers
- Pin important notes
- Search notes
- Add tags to notes
- Filter notes using tags
- Automatic note saving and recovery support

### 📁 File Management

- Upload files
- View uploaded files
- Download files
- Delete files
- Store personal resources in one place
- Cloudinary integration for image uploads

### ✅ Task Management

- Create tasks
- Edit tasks
- Delete tasks
- Mark tasks as completed
- Track pending tasks
- Track completed tasks
- Track overdue tasks
- Assign task priorities
- Assign task labels
- Add due dates
- Filter tasks by status
- View task completion statistics

### 📊 Productivity Dashboard

- Total notes overview
- Total files overview
- Pending task count
- Overdue task count
- Task completion rate
- Productivity analytics
- Recent activity overview
- Quick access to workspace features

### ☁️ Deployment

- Frontend deployed using Vercel
- Backend deployed using Render
- Database hosted using MongoDB Atlas
- Image uploads supported through Cloudinary
- Accessible from desktop and mobile browsers

---

## Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- Tiptap Rich Text Editor
- Lottie React

### Backend

- Node.js
- Express.js
- JavaScript
- REST APIs
- JWT
- bcryptjs
- Multer

### Database

- MongoDB
- Mongoose
- MongoDB Atlas

### Cloud and Deployment

- Vercel
- Render
- Cloudinary
- GitHub

---

## Project Architecture

```text
Nexora
│
├── client
│   ├── src
│   │   ├── components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Topbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── QuickActions.jsx
│   │   │   ├── RecentActivity.jsx
│   │   │   ├── NoteEditor.jsx
│   │   │   └── RichTextEditor.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── api.js
│   │   ├── NotesPage.jsx
│   │   ├── FilesPage.jsx
│   │   ├── TasksPage.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server
│   ├── models
│   │   ├── User.js
│   │   ├── Note.js
│   │   ├── File.js
│   │   └── Task.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── noteRoutes.js
│   │   ├── fileRoutes.js
│   │   └── taskRoutes.js
│   │
│   ├── middleware
│   │   └── authMiddleware.js
│   │
│   ├── uploads
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## Application Flow

```text
User
 │
 ▼
React Frontend
 │
 ▼
REST API Requests
 │
 ▼
Node.js + Express Backend
 │
 ├── JWT Authentication
 ├── Notes API
 ├── Files API
 └── Tasks API
 │
 ▼
MongoDB Atlas
```

For image uploads:

```text
User
 │
 ▼
React Frontend
 │
 ▼
Cloudinary
 │
 ▼
Image URL
 │
 ▼
Stored and displayed in Nexora
```

---

## Environment Variables

### Frontend

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
```

### Backend

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

> Never upload `.env` files or expose private credentials in a public repository.

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Rishijit/nexora.git
```

```bash
cd nexora
```

### 2. Set Up the Backend

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create the backend `.env` file and add the required environment variables.

Start the backend in development mode:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### 3. Set Up the Frontend

Open another terminal:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create the frontend `.env` file and add the required environment variables.

Start the frontend:

```bash
npm run dev
```

The frontend will run on a local Vite URL, usually:

```text
http://localhost:5173
```

---

## Available Scripts

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Creates a production build |
| `npm run preview` | Previews the production build |
| `npm run lint` | Checks code using ESLint |

### Backend

| Command | Description |
|---|---|
| `npm run dev` | Starts the backend using Nodemon |
| `npm start` | Starts the backend using Node.js |

---

## Security

Nexora includes several security-related practices:

- JWT-based authentication
- Password hashing with bcrypt
- Protected backend routes
- User-specific database queries
- Environment variables for sensitive configuration
- Authentication token validation
- Separation of frontend and backend services

---

## Future Improvements

The current version of Nexora provides the core productivity experience. The following features may be integrated in future versions:

- Calendar integration
- Task reminders
- Browser and push notifications
- Recurring tasks
- Real-time synchronization
- Collaborative notes
- Shared workspaces
- Team and organization support
- Advanced file folders
- Drag-and-drop file management
- File previews
- PDF and document preview
- Improved cloud file storage
- Offline support
- Progressive Web App support
- Android application using React Native
- Dark and light theme customization
- Advanced analytics
- Search across notes, files, and tasks
- AI-powered note summarization
- AI task suggestions
- Voice notes
- Multi-device synchronization

---

## Learning Outcomes

Through this project, I gained practical experience in:

- Building a full-stack application using the MERN stack
- Designing React components and application layouts
- Managing frontend state
- Creating REST APIs
- Connecting a backend to MongoDB
- Implementing JWT authentication
- Hashing passwords securely
- Handling file uploads
- Integrating third-party cloud services
- Managing environment variables
- Deploying frontend and backend applications
- Debugging production deployment issues
- Connecting multiple services into one application

---

## Screenshots

Screenshots of the application can be added here in the future.

```markdown
![Nexora Dashboard](./screenshots/dashboard.png)
![Nexora Notes](./screenshots/notes.png)
![Nexora Tasks](./screenshots/tasks.png)
```

---

## Contributing

Contributions, suggestions, and feedback are welcome.

To contribute:

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/your-feature
```

3. Make your changes.
4. Commit your changes.

```bash
git commit -m "Add your feature"
```

5. Push the branch.

```bash
git push origin feature/your-feature
```

6. Open a Pull Request.

---
## Contributing

Contributions, suggestions, bug reports, and feature requests are welcome.

If you would like to improve Nexora, please fork this repository, make your changes in a separate branch, and submit a pull request. All pull requests will be reviewed before being merged into the main project.

## License

This project is currently intended for educational and personal development purposes.

A formal open-source license may be added in a future version.

---

## Author

### Reshijit Dhar

B.Tech in Computer Science and Engineering  
Artificial Intelligence and Machine Learning

- GitHub: https://github.com/Rishijit
- Project: Nexora

---

## Acknowledgements

This project was developed as part of my journey toward learning full-stack software development and building practical, real-world applications.

---

**Nexora: Organize. Focus. Achieve.**
