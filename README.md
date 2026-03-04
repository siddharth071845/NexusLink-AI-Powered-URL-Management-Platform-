# URL Shortener

A modern URL shortener web application featuring a premium SaaS UI, built with a React frontend, Spring Boot backend, and MySQL database.

## Features
- **Shorten Long URLs:** Easily convert lengthy, unwieldy links into clean, shareable short URLs.
- **Premium UI:** Designed with a modern, responsive, and minimalist interface inspired by leading SaaS products.
- **Analytics & Tracking (WIP):** Track clicks and traffic metrics for your customized links.
- **Secure Authentication:** Protect your shortlinks and manage campaigns efficiently with built-in security.
- **Redis Caching:** Fast lookups using distributed cache for horizontally scaled environments.

## Technologies Used
**Frontend:**
- React (Vite)
- TypeScript
- Tailwind CSS

**Backend:**
- Java 17
- Spring Boot 3
- Spring Security (JWT)
- Spring Data JPA
- MySQL
- Redis

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- Java SDK 17+
- MySQL Server
- Redis Server (local or dockerized)
- Maven

### 1. Database Setup
Ensure you have MySQL running locally and create the necessary database.
```sql
CREATE DATABASE IF NOT EXISTS url_shortener;
```

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create your local environment variables file:
   ```bash
   cp .env.example .env
   ```
3. Update the `.env` file with your actual database credentials:
   ```properties
   DB_URL=jdbc:mysql://localhost:3306/url_shortener?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
   DB_USERNAME=root
   DB_PASSWORD=your_actual_password_here
   ```
4. Run the Spring Boot application (ensure you export the `.env` variables or use your IDE to source them):
   ```bash
   # Unix/Linux
   set -a; source .env; set +a
   ./mvnw spring-boot:run
   
   # Windows PowerShell
   Get-Content .env | Foreach-Object {
       $var = $_.Split('=')
       [Environment]::SetEnvironmentVariable($var[0], $var[1])
   }
   ./mvnw spring-boot:run
   ```
   *Note: If your IDE supports it, simply add the `.env` file to your run configuration configuration.*

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Configure environment variables if your backend runs on a different port:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## Environment Variables Configuration

To keep secrets safe, this project uses `.env` files which are excluded from Git via `.gitignore`. 
Never commit your actual `.env` files. Always use the provided `.env.example` templates to set up new environments.

**Backend (`backend/.env`):**
- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

**Frontend (`frontend/.env`):**
- `VITE_API_BASE_URL`
- `VITE_APP_BASE_URL`

## License

MIT License. See `LICENSE` for more information.
