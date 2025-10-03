# Chatly

Chatly is a real-time chat application that allows users to communicate instantly with each other. It features user authentication, real-time messaging, online user indicators, profile management, a modern, responsive UI, and a "Chat with AI" assistant powered by OpenAI.

## Features

- **User Authentication**: Sign up and log in securely.
- **Real-Time Messaging**: Exchange messages instantly using Socket.IO.
- **Online Users**: See who is currently online.
- **User Profiles**: Each user has a profile with a picture and bio.
- **Modern UI**: Built with React and TailwindCSS for a sleek, responsive experience.
- **Image Sharing**: (Planned) Send and receive images in chat.
- **Chat with AI**: Talk to an AI assistant powered by OpenAI for help, conversation, or fun.

## Demo

Check out the live demo: [https://chatly-frontend-five.vercel.app/](https://chatly-frontend-five.vercel.app/)

## Tech Stack

- **Frontend:** React, React Router, TailwindCSS, Vite
- **Backend:** Node.js, Express, MongoDB, Socket.IO
- **Authentication:** Custom JWT-based authentication
- **Database:** MongoDB (using Mongoose ODM)
- **AI Integration:** OpenAI API

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm or yarn
- MongoDB instance

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/Shreya657/chatly.git
cd chatly
```

#### 2. Set up environment variables

Create a `.env` file in the `server/` directory with the following content:

```
MONGODB_URL=mongodb://localhost:27017
NODE_ENV=development
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_api_key
```

#### 3. Install dependencies

```bash
# In the root directory, install server dependencies
cd server
npm install

# In another terminal, install client dependencies
cd ../client
npm install
```

#### 4. Start the development servers

```bash
# Start the backend server
cd server
npm run dev

# Start the frontend (in a new terminal)
cd ../client
npm run dev
```

Navigate to `http://localhost:5173` to use the app.

## Project Structure

```
chatly/
├── client/        # React frontend
│   ├── src/
│   ├── public/
│   └── ...
├── server/        # Node.js backend
│   ├── models/
│   ├── routes/
│   ├── lib/
│   └── ...
└── README.md
```

## Usage

1. **Sign Up** with your name, email, password, and a short bio.
2. **Log In** to your account.
3. **Start Chatting** with other users who are online.
4. **Chat with AI** by opening a chat with the AI assistant.
5. **Manage your profile** and update your bio or picture.

## API Endpoints (Backend)

- `POST /api/auth/signup` – Register a new user
- `POST /api/auth/login` – Log in with email/password
- `GET /api/messages` – Fetch messages (authenticated)
- `POST /api/messages` – Send a new message
- `POST /api/ai` – (AI feature) Send a message to the AI assistant

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)

## Author

[Shreya657](https://github.com/Shreya657)
