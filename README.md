# Backend

## Project Description:

Streaks Backend for Streaks Application.

The backend for the streaks feature is built using NestJS and is designed specifically for tracking a user's streak. The system is responsible for recording the number of consecutive days a user has completed a specific activity. The backend provides endpoints to retrieve and track the current streak, ensuring it is accurately calculated based on the user's activity history. It handles edge cases like missed days, ensuring that streaks are maintained properly.

## Installation

```bash
$ npm install
```
### Env files

Create a .env file with the following information

```
NODE_ENV=localhost
PORT=3000
APP_URL=http://localhost:3001
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

