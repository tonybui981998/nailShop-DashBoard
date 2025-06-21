# NailShop Frontend (Customer Website)

This repository contains the frontend source code for the NailShop booking application. Built using **React** and **Vite**, the customer-facing interface allows users to make bookings, purchase vouchers, and interact with the salon’s services in a responsive and user-friendly environment.

## 🛠 Tech Stack
- **React** with **Vite**
- **JavaScript**
- **SCSS** for styling
- **Axios** for API requests
- **React Router** for page navigation

## 📦 Features
- Browse available services
- Make a new booking
- Buy vouchers
- View booking confirmation
- Responsive layout for mobile and desktop

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)

### Installation
```bash
# Clone the repository
git clone https://github.com/tonybui981998/nailshop-fontend.git
cd nailshop-fontend

# Install dependencies
npm install
```

### Running the Development Server
```bash
npm run dev
```
Access the app at: `http://localhost:5173`

## 🔗 API Configuration
The frontend connects to the backend API, which must be running separately. Make sure the `.env` file is set up correctly:

```env
VITE_API_URL=http://localhost:5000/api
```

## 📁 Project Structure
```
src/
├── components/         # Reusable UI components
├── pages/              # Page components
├── services/           # Axios API functions
├── assets/             # Images and styling
├── App.jsx             # Main app entry point
└── main.jsx            # Vite entry file
```

## 🐞 Troubleshooting
If API requests are failing, ensure:
- Backend is running and accessible
- CORS is properly configured on the backend
- `VITE_API_URL` is correctly set

## 📄 License
This project is licensed for academic purposes only.

---
For the full system, including admin dashboard and backend API, see other repositories in this project.
