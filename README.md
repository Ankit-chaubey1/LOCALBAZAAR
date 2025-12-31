# LOCALBAZAAR

# 🛒 LocalBazaar

**LocalBazaar** is a fully functional MERN stack-based web application where users can **sell**, **browse**, **filter**, and **purchase** products locally. It includes secure **authentication**, image uploading with **Cloudinary**, **session handling using localStorage**, and dynamic filtering based on **user location**.

---

## 🔧 Technologies Used

- **Frontend**: React.js, Axios, React Router DOM, CSS
- **Backend**: Node.js, Express.js   
- **Database**: MongoDB with Mongoose (Dynamic Schema)
- **Authentication**: JWT (JSON Web Token)
- **Storage**: localStorage (for session and token handling)
- **Image Uploads**: Cloudinary

---

## 🚀 Core Features

### 🔐 Authentication
- Login and Signup system with JWT
- Token stored securely in `localStorage`
- Session maintained across pages

### 🛍️ Product Posting & Selling
- Users can upload and sell products
- Product images hosted using Cloudinary
- Products linked to the user who posted them

### 🛒 Cart and Purchase System
- Add any product to cart
- View and manage cart items
- Simulate product purchase
- Purchases linked to original product owner

### 📍 Location-Based Product Filtering
- Auto-fetch user’s current location
- Filter and display products based on proximity
- Implemented using JavaScript `.map()` and dynamic filtering

### 🧭 Navigation
- Dynamic navigation bar (shows Login/Signup or Logout based on user session)
- Footer with direct links to **About** and **Contact** pages
- Fully functional routing using React Router

---

## ⚙️ How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/Ankit-chaubey1/LOCALBAZAAR.git
cd localbazaar
cd Frontend 
npm i 
npm run dev

cd ..
cd Backend
npm i npm start
setup ur .env in frontend and backend both 


🧠 Key Functionalities Recap
🔒 JWT-based login/signup with sessions in localStorage

🖼️ Upload and host product images using Cloudinary

📦 Post products, add to cart, and simulate purchases

📍 Filter products using real-time user location

🔁 Dynamic UI updates based on authentication state

📄 Navigate between Home, About, and Contact with responsive layout

📌 Final Notes
This project is suitable for local marketplace scenarios.

Designed with scalability and modularity in mind.

Secure handling of tokens and routes.

🙋‍♂️ Developer Info
Created by: Ankit Chaubey

live link:
https://localbazaar-rbz8.vercel.app/



future enhancements:
ai based chatbot;
payment integration feature;












