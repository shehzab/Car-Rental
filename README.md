

# 🚗 Car Rental Web App

A full-stack car rental web application built with the **MERN** (MongoDB, Express, React, Node.js) stack. This platform supports user and admin authentication, car listings, booking management, and more.

---

## 🔧 Tech Stack

- **Frontend:** React.js, React Router, Axios, Tailwind CSS (or your preferred CSS framework)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT-based auth for users and admins


---

## ✨ Features

### 🧑‍💼 User Features
- User registration & login
- Search and filter cars (by brand, type, price, availability, etc.)
- View detailed car information
- Book available cars with confirmation
- View booking history
- cancel bookings 

### 🔐 Admin Features
- Admin login dashboard
- Add, edit, and remove cars
- Manage all bookings
- View users and booking statistics (optional)
- Access to booking calendar (if applicable)

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/shehzab/Car-Rental.git
cd Car-Rental
```

### 2. Set up the backend
```bash
cd backend
npm install
# Create a .env file and add your MongoDB URI and JWT secret
nodemon server.js
```

### 3. Set up the frontend
```bash
cd ../frontend
npm install
npm start
```

---

## 📁 Project Structure

```
Car-Rental/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.js
```

---

## 🌐 Environment Variables

Create a `.env` file in the backend folder:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

---

## 📦 Future Enhancements

- Payment gateway integration (Stripe, Razorpay, etc.)
- Review and ratings system
- Mobile responsiveness
- Notifications via email/SMS
- Admin analytics dashboard
- Progressive Web App (PWA) support

---

## 🧑‍💻 Author

Made with ❤️ by Shehzab

- GitHub: [@shehzab](https://github.com/shehzab)
---

## 📝 License

This project is licensed under the MIT License.
