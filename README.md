# 💬 Chat Application Using React JS

This project is a fully functional **Chat Application** built using **React JS** with a **mock backend using JSON Server**.  
It allows users to view chats, send/receive messages, and manage conversations in a clean and modern UI.

---

## 🚀 Features

- 🔐 **User Login Interface**
- 📜 **Chat List View**
- 💬 **One-to-One Messaging**
- ⚛️ **React Context API for Global State Management**
- 🔄 **Real-time UI Updates (without WebSockets)**
- 📡 **Axios API Integration**
- 🧩 **Modular Component Structure**
- 🗄️ **JSON Server as Mock Backend**
- 🎨 **Responsive & Clean UI**

---

## 🛠️ Tech Stack

### **Frontend**
- React JS  
- Context API  
- React Hooks (`useState`, `useEffect`, `useContext`)  
- Axios  
- CSS  

### **Backend (Mock API)**
- JSON Server  
- db.json (stores users, chats, messages)

### **Build Tool**
- Vite

## ⚙️ Installation & Setup

### **1. Install Dependencies**
- npm install
### **2. Start JSON Server**
- No need run the JSON Server because API is Live
### **3. Run the React Application**
- npm run dev

## 🔄 How the App Works
1. The user logs in using a simple login component.
2. A chat list appears on the left sidebar.
3. Clicking a chat updates the selected chat using Context API.
4. Messages for the selected chat load dynamically using Axios.
5.User types a message → message is sent to JSON server and UI updates instantly.

