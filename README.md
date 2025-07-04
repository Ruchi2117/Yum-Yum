# 🍔 Yum Yum - Food Delivery App

**Yum Yum** is a beautifully designed food ordering app built with **React Native** and **Firebase**. It allows users to browse meals, add them to a cart, and place orders — all from their mobile device. Simple, elegant, and lightning-fast.

---

## ✨ Features

- 🍽️ **Menu Browsing** – Scroll through food items with images, descriptions, and prices
- 🛒 **Cart Management** – Add, remove, and modify item quantities
- 🧾 **Order Summary** – Review items and confirm order before checkout
- 📍 **Delivery Address** – Add or update your delivery location
- 💳 **Payment Method** – Choose from available payment options
- 📦 **Confirmation Screen** – Instantly see order confirmation
- 🔄 **Real-Time Firestore** – Live updates to menu & pricing
- 🎨 **Clean UI** – Responsive, mobile-optimized design

---

## 🎥 App Demo

Watch the app in action! The video below shows the complete user flow from browsing the menu to placing an order.

<div align="center">
  <video src="./assets/app9.mp4" width="300" controls autoplay loop>
    Your browser does not support the video tag.
  </video>
</div>

---

## 🏗️ Project Structure

```
YumYum/
├── App.js                     # Main navigation and root component
├── firebaseConfig.js          # Firebase initialization
├── theme.js                   # Global theme and colors
├── /assets                    # App images
├── /screens
│   ├── MenuScreen.js          # Food listing UI
│   ├── CartScreen.js          # Cart view
│   ├── OrderSummaryScreen.js  # Order confirmation screen
│   ├── EditAddressScreen.js   # Manage address
│   └── PaymentMethodsScreen.js# Choose payment type
├── /components
│   ├── FoodItemCard.js        # Individual food item
│   ├── CartItem.js            # Cart product row
│   ├── CategoryFilter.js      # Menu filters
│   └── Header.js              # Common header bar
└── /contexts
    └── CartContext.js         # Cart state management
```

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js (v14+)
- npm or yarn
- Expo CLI (or React Native CLI)
- Firebase project with Firestore and Auth

### 🛠️ Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/yum-yum.git
   cd yum-yum
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Firebase**
   - Create a project at [Firebase Console](https://console.firebase.google.com/)
   - Enable **Firestore** and **Email/Password Authentication**
   - Create a web app and copy your Firebase config
   - Add your config to `firebaseConfig.js`:

     ```js
     export const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
     };
     ```

4. **Start the app**
   ```bash
   npx expo start
   ```

---

## 📦 Sample Menu Data

Here’s how food items are stored in Firebase Firestore:

```json
{
  "name": "Cheese Pizza",
  "description": "Classic cheese pizza with our special sauce",
  "price": 12.99,
  "imageUrl": "https://example.com/pizza.jpg",
  "type": "Pizza"
}
```

---

## 🔧 Technologies Used

- **Frontend**: React Native, Expo
- **Backend**: Firebase (Firestore, Auth)
- **Navigation**: React Navigation
- **State**: React Context API
- **UI Libraries**: React Native Elements, Vector Icons

---

## 🤝 Contributing

Your contributions make this project better! To contribute:

1. Fork the repo  
2. Create a new branch: `git checkout -b feature/my-feature`  
3. Commit your changes  
4. Push and open a pull request  

---

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for full details.

---

## 👩‍💻 Author

**Ruchi Shaktawat**  
[GitHub Profile](https://github.com/Ruchi2117)

---

## 🙏 Acknowledgments

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Firebase](https://firebase.google.com/)
- [React Navigation](https://reactnavigation.org/)

---

<div align="center">
  Made with ❤️ by Ruchi Shaktawat
</div>
