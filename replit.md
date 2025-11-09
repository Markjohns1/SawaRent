# Property Management System - Replit Setup

## Overview
A comprehensive property management system for landlords, caretakers, and tenants in Kenya. Built with Flask backend, React frontend, and SQLite database. Handles rent collection, tenant management, M-PESA payment integration, automated SMS notifications, and lease tracking.

## Current State
✅ **Replit Environment Setup Complete**
- Full-stack application running successfully
- Frontend: React + Vite on port 5000
- Backend: Flask API on port 8000 (localhost)
- Database initialized with sample data
- All dependencies installed
- Workflow configured and running

## Recent Changes (November 9, 2025)
- ✅ Configured for Replit environment
- ✅ Fixed backend to use localhost:8000
- ✅ Added `allowedHosts: true` to Vite config for proxy support
- ✅ Created unified startup script (start_all.sh)
- ✅ Installed all dependencies (Python + Node.js)
- ✅ Initialized database with sample tenants and templates
- ✅ Configured deployment settings
- ✅ Updated .gitignore to preserve Replit config files

## Project Architecture

### Backend (`/backend`)
- Framework: Flask 3.1.2
- Database: SQLite at `/database/property_management.db`
- API Port: 8000 (localhost only)
- Models: Users, Tenants, Payments, Templates, SMSLogs, Alerts
- Security: RBAC with role-based decorators

### Frontend (`/frontend`)
- Framework: React 18 + Vite 5
- Styling: Tailwind CSS 3
- Port: 5000 (0.0.0.0, proxies /api to backend:8000)
- Routing: React Router 6

## Login Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`
- Role: Super Admin (Property Owner)

**Caretaker Account:**
- Username: `caretaker`
- Password: `care123`
- Role: Caretaker

## Development Workflow

### Starting the Application
The workflow "Property Management System" auto-starts both servers:
- Frontend: http://localhost:5000 (visible in Replit webview)
- Backend API: http://localhost:8000 (internal)

### Reinitialize Database
```bash
cd backend
python init_data.py
```

### Manual Start (if needed)
```bash
bash start_all.sh
```

## Environment Configuration

### Required Environment Variables
Create a `.env` file in the backend directory:

```
FLASK_ENV=development
SECRET_KEY=dev-secret-key-change-in-production
TIMEZONE=Africa/Nairobi

# M-PESA Configuration (optional for MVP)
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=
MPESA_PASSKEY=
MPESA_CALLBACK_URL=
MPESA_ENVIRONMENT=sandbox

# SMS Configuration (optional for MVP)
SMS_PROVIDER=console
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

## Key Features (MVP Complete)

1. **Dashboard** - Real-time rent collection summary with color-coded status
2. **Tenant Management** - Complete CRUD with global search
3. **Payment Processing** - Manual cash/M-PESA entry with auto-calculation
4. **M-PESA Integration** - Daraja API structure (sandbox ready)
5. **Messaging System** - SMS templates with placeholders
6. **Alerts & Notifications** - Real-time payment and lease notifications
7. **Role-Based Access** - Super Admin, Caretaker, Tenant roles

## Technology Stack

- **Backend**: Flask, SQLAlchemy, Flask-Login, Flask-CORS
- **Frontend**: React, Vite, React Router, Axios
- **Styling**: Tailwind CSS
- **Database**: SQLite (development)
- **Payment**: M-PESA Daraja API (configured)
- **Messaging**: Twilio (configurable)
- **Timezone**: Africa/Nairobi (GMT+3)

## Deployment Notes

### Current Deployment Config
- Target: Autoscale (stateless)
- Build: Installs frontend dependencies and builds React app
- Run: Starts backend with Gunicorn

### Production Considerations
For production deployment, the Flask backend needs to be configured to serve the built frontend static files. This can be done by:
1. Adding static file serving to Flask app
2. Configuring Flask to serve React build from `/frontend/dist`
3. Ensuring all API routes are prefixed with `/api`

## Sample Data
- 5 sample tenants with varying rent amounts
- 6 message templates (receipt, reminder, follow_up themes)
- 2 user accounts (admin and caretaker)

## User Preferences
- Clean, modular, scalable architecture
- Production-ready code quality
- Comprehensive documentation
- Mobile-first responsive design
