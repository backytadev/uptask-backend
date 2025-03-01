<p align="center">
  <a href="http://nodejs.org/" target="blank">
    <img src="https://nodejs.org/static/images/logo.svg" width="200" alt="Node.js Logo" />
  </a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nodejs/node/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nodejs/node

<p align="center">A powerful and efficient <a href="http://nodejs.org" target="_blank">Node.js</a> runtime for building scalable and high-performance applications.</p>

# UPTASK-BACKEND

In this project, the RESTful API and the backend for a project, task and member control application are developed, the following technologies are used:

- NodeJs
- Express
- Docker
- Mongoose
- MongoDB

## Installation and Run Locally

Install my-project with npm or pnpm

1. Clone the project
2. Install dependencies

```
npm i or pnpm i
```

3. Clone the `.env.template` and change it to `.env` and configure its environment variables.
4. Raise the DB development, executing the command

```
docker compose up -d
```

5. Raise the backend-server dev mode

```
npm run dev or pnpm run dev
```
