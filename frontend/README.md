# Boarding House & Room Rental Management System - Frontend Web App

[![React](https://img.shields.io/badge/React-19.0-blue.svg?style=flat&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Material-UI](https://img.shields.io/badge/MUI-7.x-007FFF.svg?style=flat&logo=mui)](https://mui.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black.svg?style=flat&logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Responsive, modern React 19 web application for the Boarding House & Room Rental Management System. Provides intuitive dashboards for landlords and tenants to manage rooms, lease contracts, utility billing, online payments, real-time chat, and AI virtual support.

---

## 🔗 Repository Navigation
- ⚙️ **Backend Repository:** [github.com/Truongquocdat150605/quan-ly-phong-tro-backend](https://github.com/Truongquocdat150605/quan-ly-phong-tro-backend)
- 🚀 **Live Production Demo:** [quan-ly-phong-tro-frontend-6fx2h31g2.vercel.app](https://quan-ly-phong-tro-frontend-6fx2h31g2.vercel.app)

---

## ✨ Key Features

- **Role-Based Portals:**
  - **Landlord / Admin Dashboard:** Room inventory control, tenant management, contract approvals, revenue statistics charts.
  - **Tenant Portal:** Room search & booking requests, lease contract review, invoice payment, maintenance requests.
- **Financial Analytics & Invoicing:**
  - Interactive monthly revenue and occupancy rate charts powered by **Chart.js & Recharts**.
  - Dynamic PDF invoice download powered by **jsPDF & jsPDF-AutoTable**.
- **Real-Time Communication:**
  - Instant live chat widget connecting tenants with landlords using **SockJS & StompJS**.
- **AI Virtual Support Chatbot:**
  - Embedded AI assistant widget integrating Google Gemini AI for automated room recommendations and rental guidance.
- **Online Payment Gateways:**
  - Seamless checkout integration with **Stripe** and **PayOS** QR payments.

---

## 🛠 Tech Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | React 19.2 |
| **UI Components & Styling** | Material-UI (MUI v7), React-Bootstrap, Tailwind CSS, Framer Motion |
| **HTTP Client** | Axios 1.14 |
| **State & Navigation** | React Router DOM v6 |
| **Real-Time Messaging** | `@stomp/stompjs` 7.3, `sockjs-client` 1.6 |
| **Data Visualization** | Chart.js 4.5, Recharts 3.8, react-chartjs-2 |
| **Document Export** | jsPDF 4.2, jsPDF-AutoTable 5.0 |
| **Testing & Quality** | Playwright 1.60 (E2E), React Testing Library |
| **Deployment** | Vercel |

---

## 📋 Prerequisites

Ensure you have installed:
- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)

---

## ⚙️ Environment Variables

Create a `.env` file in the `frontend` root directory:

```env
# Backend API Base URL
REACT_APP_API_BASE_URL=http://localhost:8082

# Optional Google Gemini API Key
REACT_APP_GEMINI_API_KEY=[TODO: Optional Gemini API Key]
```

---

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Truongquocdat150605/quan-ly-phong-tro-frontend.git
   cd quan-ly-phong-tro-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   The frontend application will open at `http://localhost:3000`.

4. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 📂 Folder Structure

```
frontend/
├── public/                  # Favicon, index.html, static assets
├── src/
│   ├── components/          # Reusable UI components (Navbar, Footer, Modals, Chatbot)
│   ├── pages/               # Page views (Home, RoomDetail, Dashboard, Contracts, Invoices)
│   ├── services/            # Axios API service instances & WebSocket clients
│   ├── context/             # AuthContext, NotificationContext
│   ├── assets/              # Images, icons, custom CSS
│   ├── App.js               # Main routing component
│   └── index.js             # React DOM entry point
├── e2e/                     # Playwright End-to-End tests
├── .env.example
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 🖼 Screenshots / Demo

[TODO: Add Dashboard & UI Screenshots Here]

---

## 👤 Author & Contact

**Truong Quoc Dat**  
- **Email:** hungma668@gmail.com  
- **GitHub:** [github.com/Truongquocdat150605](https://github.com/Truongquocdat150605)  
- **Role:** Java Developer Intern
