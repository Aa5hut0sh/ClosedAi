# Aroha

Aroha is a student-focused self-help and mental wellbeing platform designed for individuals in higher education. It provides a safe, private, and supportive environment where students can reflect, seek guidance, connect with peers, and build healthy habits during academically and emotionally demanding phases of life.

The platform focuses on emotional support, self-reflection, and community-driven wellbeing rather than clinical diagnosis, making it approachable, ethical, and student-friendly.

---

## Table of Contents

- Overview  
- Motivation  
- Features  
- Architecture  
- Tech Stack  
- Environment Variables  
- Local Development  
- Deployment    
- Future Enhancements  
- Disclaimer  
- Author  

---

## Overview

Aroha combines journaling, conversational AI, community support, counselling access, and daily habit tracking into a single platform tailored for students. It aims to reduce mental overload by offering calm, structured, and private tools for emotional expression, peer connection, and professional guidance.

---

## Motivation

Students in higher education often experience academic pressure, uncertainty about the future, social isolation, and emotional burnout. Existing mental health tools are either too clinical, too generic, or lack meaningful personalization.

Aroha was built to bridge this gap by offering:
- A calm and non-judgmental space
- Intelligent conversational support
- Daily reflection through journaling
- Community-based peer interaction
- Easy access to counselling and emergency support
- A privacy-first and ethical experience

---

## Features

### AI Support Chat
- Conversational AI assistant for emotional support
- Context-aware and empathetic responses
- Chat history persisted per user
- Secure backend-based AI integration using Google Gemini

### Journaling System
- Private journal entries per user
- Supports both text-based and voice-based journaling
- Entries stored securely and retrievable anytime

### Speech-to-Text Journaling
- Real-time speech-to-text with instant visual feedback
- Browser-based dictation using Web Speech API
- No audio storage; only text is saved

### Daily Streak System
- Dynamic streak calculation based on daily activity
- Automatically increments on consecutive days
- Resets correctly when a day is missed

### Dashboard and Insights
- Personalized dashboard
- Mood trends visualization
- Recent activity overview

### SOS Emergency Support
- Dedicated SOS feature for immediate help
- Emergency helplines and support resources

### Counselling Session Booking
- Book counselling sessions with professionals
- View upcoming and past sessions

### Community Chat System
- Topic-based student communities
- Moderated peer-to-peer discussions

### Blogs and Resources
- Curated mental health blogs for students
- Stress, exams, sleep, and motivation topics

### Background Music System
- Optional calming background music
- Persistent user preferences

### Authentication and Security
- JWT-based authentication
- Protected routes and secure data handling

---

## Architecture

Frontend communicates with backend via REST APIs.  
AI requests and database operations are handled on the backend.

Frontend (React + Vite)
Backend (Node.js + Express)
MongoDB Atlas / Google Gemini

---

## Tech Stack

Frontend:
- React (Vite)
- Tailwind CSS
- Recharts
- Web Speech API

Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- Google Gemini API
- socket.io

Deployment:
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## Environment Variables

Frontend:
VITE_API_BASE_URL=https://your-backend-url/api/v1

Backend:
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key

---

## Local Development

Clone repository:
git clone [https://github.com/your-username/aroha](https://github.com/Aa5hut0sh/Aroha_HealthCareApp)

Frontend:
cd frontend
npm install
npm run dev

Backend:
cd backend
npm install
npm start

---

## Deployment

Frontend:
- Deploy using Vercel
- Add environment variables

Backend:
- Deploy using Railway
- Use MongoDB Atlas

---

## Future Enhancements

- AI-based mood classification
- Personalized coping strategies
- Calendar-based streak tracking
- Advanced community moderation
- Location-aware SOS services
- Mobile-first experience

---

## Disclaimer

Aroha is intended for emotional support and self-reflection only.
It does not provide medical advice or diagnosis.
Users experiencing severe distress should seek professional help.

---

## Author

Developed by Ashutosh Sharma
