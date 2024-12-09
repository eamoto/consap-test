
# Technical Assessment

Demo: https://phpstack-694833-5090665.cloudwaysapps.com/


## BACKEND

Ensure that nodemon is installed globally on the device. If not, run the following command:

```bash
  npm install -g nodemon
```
Then..

```bash
  cd backend
  npm install
  npm run start
```
## FRONTEND

```bash
  cd frontend
  npm install
  cp .env.example .env.development #Update the .env.development file and modify the VITE_API_URL variable if necessary to point to the appropriate backend.
  npm run dev 
```
