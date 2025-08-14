# StrokeE Patient App

A Next.js-based mobile application designed for stroke patients to manage their health information, emergency contacts, and trigger emergency alerts when needed. This app is part of the larger StrokeE emergency response system.

## 🚨 Features

### Core Functionality

- **Emergency Alert System**: One-tap emergency button to alert medical responders
- **GPS Location Sharing**: Automatic location sharing during emergencies for faster response times
- **Emergency Contact Management**: Add, edit, and manage trusted emergency contacts
- **Patient Profile Management**: Store and update personal health information

### User Roles

- **Patient**: Primary users who can trigger emergency alerts and manage their profile
- **Emergency Contact**: Trusted individuals who can be notified during emergencies

## 🛠️ Tech Stack

- **Framework**: Next.js 15.1.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **State Management**: React Context API
- **Testing**: Jest with React Testing Library
- **Package Manager**: npm/yarn/pnpm


## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Firebase project setup

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd strokee/patient-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory with your Firebase configuration:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

Run the test suite using the following commands:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🏗️ Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🐳 Docker

The app includes Docker support for containerized deployment:

```bash
# Build Docker image
docker build -t strokee-patient-app .

# Run container
docker run -p 3000:3000 strokee-patient-app
```

## 📋 Key Features Explained

### Emergency Alert System

- Patients can trigger emergency alerts with a single tap
- Automatic GPS location sharing for faster emergency response
- Real-time status updates and notifications

### Emergency Contact Management

- Add trusted contacts with verification codes
- Manage contact information and relationships

### Patient Profile

- Store personal health information (medications, conditions, etc.)
- Update profile details and emergency information
- Secure data storage with Firebase

## 🔒 Security Features

- Firebase Authentication for secure user management
- Role-based access control
- Secure API endpoints with authentication
- Data encryption and privacy protection

## 📱 Mobile-First Design

- Responsive design optimized for mobile devices
- Touch-friendly interface
- Progressive Web App (PWA) capabilities
