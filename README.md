# Laundry Project

The project root contains exactly two application folders:

- `frontend/` — React + Vite + Bootstrap UI
- `backend/` — Spring Boot REST API + PostgreSQL + Swagger UI

## Open in VS Code

Open the extracted `laundry-project` folder (the folder containing `frontend` and `backend`) using **File → Open Folder**.

## Run backend

1. Create the PostgreSQL database `laundrydb` if it does not exist.
2. Check `backend/src/main/resources/application.properties` and set the PostgreSQL username/password to match your local PostgreSQL installation. Prefer an environment variable for the password before pushing to GitHub.
3. In a terminal:

   ```powershell
   cd backend
   mvn spring-boot:run
   ```

Backend: `http://localhost:8080`
Swagger UI: `http://localhost:8080/swagger-ui/index.html`

## Run frontend

Open a second VS Code terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). The frontend calls the backend at `http://localhost:8080/api/laundry-services` by default.

## CRUD endpoints

- `POST /api/laundry-services/add`
- `GET /api/laundry-services/displayall`
- `GET /api/laundry-services/display/{id}`
- `PUT /api/laundry-services/update/{id}`
- `DELETE /api/laundry-services/delete/{id}`

The Add form does not ask for an ID; the backend generates it.
