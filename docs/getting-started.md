# Getting Started

This project has two separate apps that must both be running:

| App | Directory | Port |
|---|---|---|
| Django REST API | `rare-api/` | 8000 |
| React client | `rare-client/` | 3000 |

---

## Prerequisites

- **Python 3** — the API uses Django 4.2
- **Pipenv** — manages the Python virtual environment (`pip install pipenv`)
- **Node.js + npm** — the client uses Create React App
- **Docker Desktop** — the database runs in a container

---

## 1. Start the database

The database is a PostgreSQL 16 container defined in `rare-api/docker-compose.yml`.

```bash
cd rare-api
docker compose up -d
```

This starts PostgreSQL on port 5432 with:

| Setting | Value |
|---|---|
| Database | `rare` |
| User | `rare_user` |
| Password | `rare_password` |

These credentials are hardcoded in `rareproject/settings.py`. No `.env` file is needed.

---

## 2. Set up and start the API

```bash
cd rare-api
pipenv install          # install Python dependencies
pipenv shell            # activate the virtual environment
python manage.py migrate          # create database tables
python manage.py loaddata rareapi/fixtures/initial_data.json  # seed sample data
python manage.py runserver        # starts on http://localhost:8000
```

Run all four commands in order on a fresh checkout. After that, only `pipenv shell` + `python manage.py runserver` are needed on subsequent starts.

---

## 3. Set up and start the client

Open a second terminal:

```bash
cd rare-client
npm install             # install JavaScript dependencies
npm start               # starts on http://localhost:3000
```

The client expects the API at `http://localhost:8000` (hardcoded in `src/managers/api.js`). Both servers must be running at the same time.

---

## 4. Login credentials

The fixture seeds 12 users. All share the same password: **`password`**

| Username | Role |
|---|---|
| `admin_sarah` | Admin (staff) |
| `admin_marcus` | Admin (staff) |
| `dev_diana` | Author |
| `wanderlust_joe` | Author |
| `chef_maya` | Author |
| `bookworm_alex` | Author |
| `fit_jordan` | Author |
| `gamer_priya` | Author |
| `eco_oliver` | Author |
| `music_luna` | Author |
| `startup_raj` | Author |
| `photo_emma` | Author |

Log in as `admin_sarah` or `admin_marcus` to access admin-only features (approving posts, managing users, viewing the demotion queue).

---

## How the two servers relate

```
React client :3000  →  REST/JSON  →  Django API :8000  →  PostgreSQL :5432
```

- The client makes all API calls to `localhost:8000`. Django's CORS config whitelists `localhost:3000` so the browser allows cross-origin requests.
- Auth tokens are issued at login and stored in `localStorage`. They are sent on every subsequent request as an `Authorization: Token <value>` header.
- Post approval is moderated: posts by regular users start as unapproved and must be approved by an admin before they appear publicly. Posts created by admin accounts are approved automatically.
