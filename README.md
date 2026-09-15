# Boarding House & Room Rental Management System (Full-Stack)

[![Java](https://img.shields.io/badge/Java-17_LTS-orange.svg?style=flat&logo=openjdk)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.0-brightgreen.svg?style=flat&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.0-blue.svg?style=flat&logo=react)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg?style=flat&logo=mysql)](https://www.mysql.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black.svg?style=flat&logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Full-stack enterprise application designed for landlords and tenants to streamline boarding house operations, room booking, electronic lease contracts, utility invoicing, online payments, real-time WebSocket communication, and AI virtual support.

---

## 🌐 Live Production Demo & Repositories

- 🚀 **Live Production Web Application:** [quan-ly-phong-tro-frontend-6fx2h31g2.vercel.app](https://quan-ly-phong-tro-frontend-6fx2h31g2.vercel.app)
- ⚙️ **Backend Repository:** [github.com/Truongquocdat150605/quan-ly-phong-tro-backend](https://github.com/Truongquocdat150605/quan-ly-phong-tro-backend)
- 📦 **Fullstack Repository:** [github.com/Truongquocdat150605/JAVATTTN](https://github.com/Truongquocdat150605/JAVATTTN)

---

## 🏛 System Architecture Overview

```
                          +-----------------------------------+
                          |      React 19 Frontend Web App    |
                          |  (Tailwind, MUI, Recharts, jsPDF) |
                          +-----------------+-----------------+
                                            |
                                  REST APIs | WebSockets (STOMP)
                                            v
                          +-----------------+-----------------+
                          |    Spring Boot 3.2 Backend API    |
                          |   (Java 17, Spring Security, JWT) |
                          +--------+--------+--------+--------+
                                   |        |        |
         +-------------------------+        |        +-------------------------+
         v                                  v                                  v
+------------------+              +------------------+              +--------------------+
|  MySQL 8.0 DB    |              |  Stripe & PayOS  |              |  Google Gemini AI  |
| (JPA / Hibernate)|              | (Payment Gateways|              | (RAG Context AI)   |
+------------------+              +------------------+              +--------------------+
```

---

## 📁 Repository Structure

- 📂 [**`quanliPT/quanliPT/`**](./quanliPT/quanliPT/README.md) - Spring Boot 3.2 Java 17 Backend Service API & OpenAPI Specs.
- 📂 [**`frontend/`**](./frontend/README.md) - React 19 Frontend Application & Dashboard.

---

## 🚀 Quick Local Setup

1. **Start Backend Service:**
   ```bash
   cd quanliPT/quanliPT
   ./mvnw spring-boot:run
   ```
   *Backend running at `http://localhost:8082` | Swagger UI at `http://localhost:8082/swagger-ui.html`*

2. **Start Frontend Application:**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   *Frontend running at `http://localhost:3000`*

---

## 👤 Author & Contact

**Truong Quoc Dat**  
- **Email:** hungma668@gmail.com  
- **GitHub:** [github.com/Truongquocdat150605](https://github.com/Truongquocdat150605)  
- **Role:** Java Developer Intern
