# 🎯 QUICK START GUIDE

## 🚀 FASTEST WAY TO RUN

### Windows Users:
1. Double-click `start.bat`
2. Wait for both servers to start
3. Open browser: http://localhost:5173

### Mac/Linux Users:
```bash
chmod +x start.sh
./start.sh
```

---

## 📝 MANUAL START

### Step 1: Start Backend
```bash
cd backend
npm install
npm run dev
```

### Step 2: Start Frontend (New Terminal)
```bash
npm run dev
```

---

## ✅ VERIFY IT WORKS

1. Backend running: http://localhost:5000
2. Frontend running: http://localhost:5173
3. Visit: http://localhost:5173/opportunities-backend
4. Click "Add Opportunity"
5. Fill form and submit
6. See your opportunity appear!

---

## 🔧 REQUIREMENTS

- Node.js v16+
- MongoDB (local or Atlas)
- Internet connection

---

## 📚 FULL DOCUMENTATION

See `README_BACKEND.md` for complete guide with:
- Detailed setup instructions
- Code explanations
- Troubleshooting
- API documentation
- Deployment guide

---

## 🆘 HELP

### MongoDB Not Installed?
**Option 1 (Local):** https://www.mongodb.com/try/download/community
**Option 2 (Cloud):** https://www.mongodb.com/cloud/atlas (Free tier)

### Port Already in Use?
Change in `backend/.env`:
```
PORT=5001
```

Also update in `src/services/opportunityAPI.js`:
```js
const API_URL = 'http://localhost:5001/api/opportunities'
```

### Backend Not Starting?
```bash
cd backend
npm install
npm run dev
```

### Frontend Not Showing Data?
1. Check backend is running (visit http://localhost:5000)
2. Open browser console (F12) for errors
3. Check Network tab to see API calls

---

## 🎉 YOU'RE READY!

Your full-stack app is set up with:
✅ React Frontend
✅ Node.js Backend  
✅ MongoDB Database
✅ RESTful API

Happy coding! 🚀
