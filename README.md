[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Getting Started

* Clone this repo and the [frontend repo](https://github.com/Ahmad-Alawneh99/task-app-next)
* Ensure that Docker is installed locally
* Pull Mongodb's docker image by running `docker pull mongodb/mongodb-community-server:latest`
* Prepare an image for this backend repo by opening a terminal in the directory of the repo, and running the following command: `docker build -t task_app_backend .`
* Do the same steps for the frontend repo
* Run `docker-compose up`, this will run the database, the backend and the frontend applications (can be done in either the frontend or backend repo, as docker-compose file exists in both)
* Access the backend application by going to `http://localhost:3030`

## Alternative way
To run the app without using Docker, do the following:

* Install and run mongodb locally
* Ensure node20 is installed
* Run `npm i`
* Create a `.env` file and put the following value in it: `DB_URL=mongodb://localhost:27017/tasks`
* Run `npm run dev`
* Access the backend application by going to `http://localhost:3030`
* Follow the steps in the frontend repo to run the frontend app

## Routes
* `/`: Home route
* `/users/sign-up`: Sign up
* `/users/sign-in`: Sign in
* `/users/profile`: User info
* `/tasks[/:id]`: CRUD operations for tasks
* `/tasks/summary`: Statistics
