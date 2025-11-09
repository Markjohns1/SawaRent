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

### Migration to Replit Environment
- ✅ Migrated from SQLite to PostgreSQL database
- ✅ Configured DATABASE_URL and SESSION_SECRET environment variables
- ✅ Updated backend config to use PostgreSQL with connection pooling
- ✅ Fixed backend to run on port 8000 (localhost)
- ✅ Frontend runs on port 5000 with Vite proxy to backend
- ✅ Installed all Python and Node.js dependencies
- ✅ Created unified startup script (start_all.sh)
- ✅ Configured deployment for Autoscale with Gunicorn

### UI Improvements
- ✅ **Added Professional Icons** (Font Awesome)
  - Replaced text-based logo with building icon
  - Professional icon-based design throughout
- ✅ **Enhanced Theme System** (Formal, Dark, Friendly)
  - Added Dark theme with navy blue background
  - Professional theme toggle button with icons (sun/moon/half-circle)
  - Three-way theme rotation: Formal → Dark → Friendly → Formal
  - Theme Context with localStorage persistence
  - All pages enhanced with theme-aware styling

### Backend Configuration
- ✅ M-Pesa integration configured (ready for API credentials)
- ✅ SMS/Twilio integration configured (ready for API credentials)
  - Note: User dismissed Replit Twilio integration, using manual configuration
  - Backend supports both Twilio and console-based SMS providers

## Project Architecture

### Backend (`/backend`)
- Framework: Flask 3.0.0
- Database: PostgreSQL (Neon - via DATABASE_URL)
- API Port: 8000 (localhost only)
- Models: Users, Tenants, Payments, Templates, SMSLogs, Alerts
- Security: RBAC with role-based decorators
- Session Secret: Managed via SESSION_SECRET environment variable

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

### Environment Variables
The following are automatically configured by Replit:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Flask session secret key
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` - PostgreSQL credentials

### Optional Configuration (Add as Replit Secrets when ready)
To enable M-Pesa payments, add these secrets:
```
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=your_callback_url
MPESA_ENVIRONMENT=sandbox
```

To enable SMS notifications (Twilio), add these secrets:
```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_phone_number
SMS_PROVIDER=twilio
```

Note: Without credentials, the system will work but M-Pesa and SMS features will be disabled.

## Key Features (MVP Complete)

1. **Dual Theme System** - Switch between Friendly (warm, rounded) and Formal (professional, sharp) themes
2. **Dashboard** - Real-time rent collection summary with color-coded status
3. **Tenant Management** - Complete CRUD with global search, enhanced card design
4. **Payment Processing** - Manual cash/M-PESA entry with auto-calculation, improved table UI
5. **M-PESA Integration** - Daraja API structure (sandbox ready)
6. **Messaging System** - SMS templates with placeholders, modern UI
7. **Alerts & Notifications** - Real-time payment and lease notifications
8. **Role-Based Access** - Super Admin, Caretaker, Tenant roles
9. **Mobile-First Design** - Fully responsive across all devices

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
