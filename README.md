# S3-HouseHunters

Project for the 6th semester (Advanced Software) at Fontys.

## The idea

The idea behind the project in the 6th semester was to build a fully scalable enterprise software application. Since it's quite hard for a single person to do that in the span of 5 months, a proof of concept also serves great.

## Non-functional requirements
The main focus of this project was non-functional requirements like
- security
- scalability
- uninterrupted runtime
- GDPR compliance

Functional requirements include:
 - CRUD of listings
 - Placing bids on listings
 - Posting and deleting comments
 - Right to be forgotten and GDPR compliance (at least in The Netherlands)

## Project structure
[img](./Documentation/Images/C2S6.png)
- The project features a React + Vite frontend, with a microservice architecture backend + RabbitMQ as a message broker. Everything architecture related can be read about in the [Architecture document](./Documentation/Architecture%20document.pdf)
- Project is fully scalable, with it originally being uploaded to GCloud and being managed through a Kubernetes cluster.
- Project features a CI/CD Pipeline (which does not function here, it is meant for GitLab). You can see how it functions in the [CI/CD setup](./Documentation/CICD%20setup.pdf).
- **For more info you can check out the [Portfolio](./Documentation/portfolio/), which includes everything written to the last detail, which I used to pass the semester**

## How to run project
Thankfully this project is fully Dockerized, so all you need to do is have docker installed and run one command.

### Prerequisites
- Have Docker installed

#### Linux
- Since the frontend runs on host mode (for convenience purposes) if you run docker on Linux, host mode is supported, so the command `docker compose -f docker-compose-e2e.yml -f docker-compose-e2e-ci.yml up` starts containers of the whole application

#### Windows
- If your environment is on Windows, you need to start the frontend in dev mode.
- Run the command `docker compose -f docker-compose-e2e.yml`, which starts the microservices, RabbitMQ and MongoDB
- Go to `/frontend` and run `npm install`
- No env files needed, just run `npm start`

Now go to localhost:3000 to see the app live!
