# NailShop Admin Dashboard

This repository contains the source code for the **Admin Dashboard** of the NailShop booking system. The dashboard is built using **React** and **Vite**, enabling salon administrators to manage bookings, staff schedules, and view customer feedback.

## 🛠 Tech Stack
- **React** with **Vite**
- **JavaScript**
- **SCSS** for styling
- **Axios** for API communication
- **React Router** for navigation

## 📦 Features
- View, add, and delete bookings
- Manage staff members and working schedules
- View customer feedback and contact details
- Clean and responsive admin interface

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)

### Installation
```bash
# Clone the repository
git clone https://github.com/tonybui981998/nailShop-DashBoard.git
cd nailShop-DashBoard

# Install dependencies
npm install
```

### Running the Development Server
```bash
npm run dev
```
Access the dashboard at: `http://localhost:5173`

## 🔗 API Configuration
Make sure the backend API is running. Set up the `.env` file as follows:
```env
VITE_API_URL=http://localhost:5000/api
```

## 📁 Project Structure
```
src/
├── components/         # Reusable components like modals, tables
├── pages/              # Dashboard views (bookings, staff, feedback)
├── services/           # Axios API functions
├── assets/             # Images and styling
├── App.jsx             # Main application logic
└── main.jsx            # Vite entry point
```

## 🐞 Troubleshooting
If issues occur:
- Verify the backend API is running and accessible
- Ensure correct environment variable configuration
- Check browser console for error logs

## 📄 License
This project is licensed for academic purposes only.

---
For other system components like the customer website and backend API, refer to the corresponding GitHub repositories.
