# 🏥 MediPulse — Hospital Management System

A full-stack, enterprise-grade **Hospital Management System (HMS)** built with **React (Vite)**, **Tailwind CSS**, **Node.js/Express**, and **MongoDB (Mongoose)**.

Designed for hospital administrators, doctors, and intake receptionists to manage clinical operations, medical staff directories, patient admissions, diagnoses, and bed triage.

---

## 🌟 Features

- **Role-Based Access Control (RBAC)**:
  - 👑 **Admin**: Complete system control (manage staff, register users, admit/edit/delete patients, view operations analytics).
  - 🩺 **Doctor**: Read patient records, update clinical diagnoses, allergies, symptoms, medications, and authorize patient discharge.
  - 📋 **Receptionist**: Patient admission, bed assignment, demographics intake, and patient discharge.
- **Analytics Operations Dashboard**:
  - Live metric cards (total staff, patients, admitted, discharged, critical, doctors).
  - Interactive **Recharts Bar Chart** displaying patient census across departments.
  - Interactive **Recharts Pie Chart** breaking down care statuses (Admitted, Under Treatment, Discharged, Critical).
  - Real-time recent patient admissions table.
- **Staff Directory**:
  - Filterable by Role, Department, and Employment Status with instant search.
  - Form validation with all fields (DOB, salary, shift, specialization, qualifications).
  - Sequential auto-incrementing ID generation (`STF-0001`, `STF-0002`).
- **Patient Registry**:
  - Dynamic attending doctor assignment fetched live from active physicians.
  - Status badges with real-time indicators (Critical, Admitted, Under Treatment, Discharged).
  - Fast discharge action timestamping discharge date and clearing bed census.
  - Sequential auto-incrementing ID generation (`PAT-0001`, `PAT-0002`).
- **Clinical Details & Safety**:
  - Allergy alerts, current medications tracking, presenting symptoms, past medical history, and emergency contact details.
- **Responsive & Modern UI**:
  - Tailored clinical theme (Teal/Slate palette) with mobile collapsible sidebar and toast feedback.

---

## 🏗️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios, Recharts, Lucide React, react-hot-toast.
- **Backend**: Node.js, Express.js, Mongoose, JWT (`jsonwebtoken`), `bcryptjs`, `express-validator`, `cors`, `helmet`, `morgan`.
- **Database**: MongoDB (supports MongoDB Atlas connection string via `.env`, with automatic in-memory fallback for local development).

---

## 🔐 Default Demo Accounts

You can log in directly using one-click buttons on the login screen or with these credentials:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@hospital.com` | `Admin@123` | Full administrative & deletion access |
| **Doctor** | `doctor@hospital.com` | `Doctor@123` | Clinical notes, medications, discharge |
| **Receptionist** | `receptionist@hospital.com` | `Receptionist@123` | Patient intake, bed booking, discharge |

---

## 📁 Project Structure

```text
hospital-management/
  ├── client/                     # React Vite Frontend Application
  │   ├── src/
  │   │   ├── api/                # Axios instance & API service modules
  │   │   ├── components/         # DataTable, Modal, StatCard, FormInput, StatusBadge, etc.
  │   │   ├── context/            # Global AuthContext & session manager
  │   │   ├── pages/              # Dashboard, Staff & Patient CRUD, Login, Profile
  │   │   └── utils/              # Formatters (dates, currency, age)
  │   ├── tailwind.config.js      # Medical theme configuration
  │   └── vite.config.js          # Vite config & API reverse proxy
  │
  ├── server/                     # Express.js REST API Backend
  │   ├── config/                 # MongoDB connection & fallback handler
  │   ├── controllers/            # Auth, Staff, Patients, Dashboard controllers
  │   ├── middleware/             # JWT auth, roleCheck, express-validator, errorHandler
  │   ├── models/                 # User, Staff, Patient, Counter Mongoose schemas
  │   ├── routes/                 # Express API route endpoints
  │   ├── utils/                  # Sequential ID generator (STF-0001, PAT-0001)
  │   ├── seed.js                 # Seed script with 3 users, 8 staff, 12 patients
  │   └── server.js               # Server bootstrap & middleware
  │
  ├── .env.example                # Root environment variable documentation
  └── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher) & **npm**
- *(Optional)* **MongoDB** local instance or **MongoDB Atlas URI** (if not provided, an in-memory database will automatically initialize with sample data).

### 1. Installation

Install backend dependencies:
```bash
cd server
npm install
```

Install frontend dependencies:
```bash
cd ../client
npm install
```

### 2. Configure Environment Variables

**Backend (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/hospital_db
JWT_SECRET=supersecret_hospital_jwt_key_2026_secure
JWT_EXPIRE=24h
CLIENT_URL=http://localhost:5173
```
*(If using MongoDB Atlas, replace `MONGO_URI` with your connection string).*

**Frontend (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Database (Optional)
The database auto-seeds sample data on first launch if empty. To run it manually:
```bash
cd server
npm run seed
```

### 4. Run the Application

In one terminal, start the **Express backend**:
```bash
cd server
npm start
```
*Backend runs on `http://localhost:5000`*

In another terminal, start the **React frontend**:
```bash
cd client
npm run dev
```
*Frontend runs on `http://localhost:5173`*

Open `http://localhost:5173` in your browser and sign in using the demo buttons!

## Deployment

The repository includes deployment configuration for a split deployment:

- **Render** runs the Express API from `server/` using `render.yaml`.
- **Vercel** builds the React client from `client/`.

### Render API

1. In Render, choose **New > Blueprint** and select this GitHub repository.
2. Set `MONGO_URI` to a MongoDB Atlas connection string.
3. After the service is created, copy its public URL, for example `https://hospital-management-api.onrender.com`.
4. Set `CLIENT_URL` to the Vercel frontend URL.

`JWT_SECRET` is generated by Render from the Blueprint configuration.

### Vercel frontend

1. In Vercel, import this GitHub repository.
2. Set the Vercel **Root Directory** to `client`.
3. Add `VITE_API_URL` with the Render API URL followed by `/api`, for example:

```env
VITE_API_URL=https://hospital-management-api.onrender.com/api
```

Deploy the Vercel project, then update Render's `CLIENT_URL` with the final Vercel URL and redeploy the API.

---

## 📡 REST API Reference

### 🔑 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `POST` | `/api/auth/register` | Admin | Register new hospital system user |
| `GET` | `/api/auth/me` | Protected | Fetch current logged-in user profile |

### 🩺 Staff Management (`/api/staff`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/staff` | Protected | List staff with `search`, `role`, `department`, `status`, `page`, `limit` |
| `GET` | `/api/staff/doctors` | Protected | List active doctors for patient assignment dropdown |
| `GET` | `/api/staff/:id` | Protected | Get single staff profile |
| `POST` | `/api/staff` | Admin | Create new staff record (auto generates `STF-XXXX`) |
| `PUT` | `/api/staff/:id` | Admin | Update staff details |
| `DELETE` | `/api/staff/:id` | Admin | Delete staff record |

### 🏥 Patient Management (`/api/patients`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/patients` | Protected | List patients with `search`, `status`, `department`, `doctor`, `page`, `limit` |
| `GET` | `/api/patients/:id` | Protected | Get detailed patient clinical chart with attending doctor |
| `POST` | `/api/patients` | Admin, Receptionist | Admit new patient (auto generates `PAT-XXXX`) |
| `PUT` | `/api/patients/:id` | Admin, Receptionist, Doctor | Update patient details (doctors restricted to clinical fields) |
| `PATCH`| `/api/patients/:id/discharge` | Admin, Doctor, Receptionist | Fast discharge patient & stamp timestamp |
| `DELETE`| `/api/patients/:id` | Admin | Remove patient record |

### 📊 Dashboard Analytics (`/api/dashboard`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Protected | Aggregate KPI counts, department census, and care status distributions |

---

## 📄 License
MIT License. Open-source clinical management architecture.
