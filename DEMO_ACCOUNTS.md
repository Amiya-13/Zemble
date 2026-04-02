# 🎭 DEMO ACCOUNTS - LOGIN READY!

## ✅ No MongoDB Needed as providing the demo accounts , but also real time db changes have been integrated so user can register and use the platform through it !

The backend now works with **hardcoded mock data** - no database required!

---

## 👤 Demo Accounts

### Freelancer Account
```
Email: freelancer@demo.com
Password: demo123
Username: sarahdev
```

### Client Account  
```
Email: client@demo.com
Password: demo123
Username: techcorp
```

### Another Freelancer
```
Email: marcus@demo.com
Password: demo123
Username: marcusw
```

---

## 📦 Sample Data Included

**4 Projects Available:**
1. Build E-commerce Website ($2000-$5000)
2. Mobile App Development ($3000-$7000)
3. Logo Design & Branding ($500-$1500) - In Progress
4. API Development for SaaS Platform ($4000-$8000)

**Mock Reviews:** 3 sample reviews with AI verification

**Mock Proposals:** 2 freelancer proposals already submitted

---

## 🚀 How to Test

1. **Login as Freelancer:**
   - Go to http://localhost:5173/login
   - Use: `freelancer@demo.com` / `demo123`
   - Browse projects and submit proposals

2. **Login as Client:**
   - Use: `client@demo.com` / `demo123`
   - Post new projects
   - View proposals on your projects

3. **Try Features:**
   - Browse Projects: `/browse`
   - Post Project: `/post-project`
   - View Project Details: Click any project
   - Submit Proposals: Login as freelancer first
   - AI Review Demo: `/backend-demo`

---

## 🔄 Switching from Mock to Real Database

When ready to connect MongoDB:

1. Start MongoDB service
2. Replace `backend/server.js` with the original version
3. Update `backend/.env` with your MongoDB URI
4. Restart backend

The mock version saves NO data - everything resets on server restart!

---

**Backend:** http://localhost:5000
**Frontend:** http://localhost:5173

All set! Try logging in now! 🎉
