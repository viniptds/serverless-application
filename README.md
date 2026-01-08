# LiquidAI Developer Test

This is a full-stack application to list stocks from a third-party API and manage users.

The frontend was built using Next.js, ContextAPI and backend with FastAPI and JWT authentication served by the Serverless Framework.

## Demo

* Frontend: 
User: user@example.com
Password: 123456

* Backend: a

## Architecture

* /api (Python FastAPI service)
* /frontend (Next.js web app)

## Technologies

* Python 3.12
* Next.js 16.1
* Serverless Framework

## Installation

On localhost, follow these steps to proceed with installation:

1. clone repo and run ```cd api && cp .env.example .env && pip install -r requirements.txt```

2. run backend service ```uvicorn app.main:app --reload --port 3004```

3. on another terminal tab, run ```cd frontend && npm run dev```

4. (optional) for a complete usage, create an account on [stocks provider](https://www.alphavantage.co/support/#api-key) and copy the token to /api/.env using the `ALPHA_API_KEY` prop. warning: restart the backend service after each .env change

## Testing

To test the api, you can open a terminal on root directory and run ```cd api && pytest```
