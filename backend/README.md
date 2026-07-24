# Vstay Backend

FastAPI backend for the Vstay PG Management Platform.

## Folder Structure

```
backend/
├── main.py               # FastAPI app entry point
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables (DATABASE_URL)
├── venv/                 # Python virtual environment
└── app/
    ├── database.py       # DB pool, query helpers, schema init & seed data
    └── routers/
        ├── auth.py           # POST /api/auth/login, /signup  GET /api/auth/me/{id}
        ├── workspaces.py     # GET /api/workspaces, /api/workspaces/{id}
        ├── rooms.py          # CRUD /api/rooms
        ├── tenants.py        # CRUD /api/tenants
        ├── staff.py          # CRUD /api/staff
        ├── complaints.py     # CRUD /api/complaints
        ├── invoices.py       # CRUD /api/invoices
        ├── announcements.py  # CRUD /api/announcements
        ├── vehicles.py       # CRUD /api/vehicles
        ├── documents.py      # CRUD /api/documents
        ├── laundry.py        # CRUD /api/laundry
        └── settings_store.py # GET/POST /api/settings (generic JSON store)
```

## Running the backend

```bash
cd backend
./venv/bin/uvicorn main:app --host 127.0.0.1 --port 5001 --reload
```

## API Docs

Once running, visit: http://localhost:5001/docs
