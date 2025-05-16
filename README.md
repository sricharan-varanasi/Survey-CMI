# Survey-CMI

This project is an interactive mental health survey platform tailored for research and administration. It includes:

- ✅ A **public-facing survey site** for users to take surveys
- ✅ An **admin dashboard** for configuring questions, subscales, and normalization tables
- ✅ A **backend API** with FastAPI + PostgreSQL
- ✅ Full deployment on **AWS EC2** (for backend) and **Vercel** (for frontend)

---

## 🌐 Live Links

- **Survey App** (User-facing): [https://survey-cmi.vercel.app](https://survey-cmi.vercel.app)
- **Admin Portal** (Admin-facing): [https://admin-portal-six-kappa.vercel.app](https://admin-portal-six-kappa.vercel.app)

---

## 📁 Project Structure

```
Survey-CMI/
├── backend/               # FastAPI backend with SQLAlchemy + PostgreSQL
│   ├── app/
│   │   ├── routers/       # API routes for questions, subscales, users, etc.
│   │   ├── models.py      # DB models
│   │   ├── schemas.py     # Pydantic schemas
│   │   ├── database.py    # DB engine and session
│   │   └── main.py        # FastAPI app entry
│   └── requirements.txt
├── survey-admin/          # Next.js 15 admin portal
│   └── src/app/admin/     # Admin screens: Questions, Subscales, Normalization
├── public/                # Shared assets
└── survey-frontend/       # (Optional: user-facing survey app)
```

---

## Features

### User Survey App

- Flashcard-style survey questions
- LocalStorage-based progress saving
- Multiple-choice questions with raw score assignment

### Admin Portal

- Add/edit/delete questions and raw scores
- Define subscales with scoring methods (sum/average)
- Upload normalization tables (.csv)
- View per-user answers with normalization results
- Switch between subscales for score comparison

### Backend API (FastAPI)

- User CRUD and survey submission endpoints
- Subscale config and normalization table upload
- SQLAlchemy ORM with PostgreSQL
- CORS enabled for Vercel frontend

---

## Deployment

### Frontend (Admin + User)

- Deployed on **Vercel**
- Auto-deploys on `main` branch push
- Uses `.env.local` for backend API base URL

### Backend (FastAPI)

#### 1. EC2 Setup

- Created an EC2 instance (Ubuntu)
- Installed Python, Node.js, Nginx, Uvicorn, Certbot
- Deployed backend with:

```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

#### 2. Reverse Proxy via NGINX

```nginx
server {
    server_name survey-cmi.site;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 3. SSL via Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d survey-cmi.site
```

#### 4. Systemd Service

```ini
[Unit]
Description=Survey CMI Backend
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/Survey-CMI/backend
ExecStart=/home/ubuntu/Survey-CMI/backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable survey-backend
sudo systemctl start survey-backend
```

---

## 🧪 How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Survey-CMI.git
cd Survey-CMI
```

### 2. Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# .env
DATABASE_URL=postgresql://user:password@host:port/dbname
```

Run backend:

```bash
uvicorn app.main:app --reload
```

### 3. Setup Admin Frontend

```bash
cd survey-admin
npm install
npm run dev
```

Update `.env.local`:

```
NEXT_PUBLIC_API_URL=https://survey-cmi.site
```

---

## 📊 Example Normalization Table (CSV Format)

| age | sex | raw_score | normalized_score |
| --- | --- | --------- | ---------------- |
| 24  | M   | 9         | 80               |
| 24  | F   | 9         | 88               |

Upload this CSV via the **Subscales tab** in the Admin Portal.

---

## Author

Built with ❤️ by [Sricharan Varanasi](https://github.com/sricharan-varanasi)

---
