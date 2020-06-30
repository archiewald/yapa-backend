![Heroku](https://pyheroku-badge.herokuapp.com/?app=yapa-server&style=flat)

# 🍅 yapa backend

This [express](https://expressjs.com/) app serves as a backend for pomodoro app you can access on https://yapa.kozubek.dev/

## Environment

Make sure you have installed:

- [Node](https://nodejs.org/) (I use 12.16.1),
- [MongoDB](https://www.mongodb.com/) (I use 4.2.8).

## Start locally in watch mode

- `cp .env.template .env`
- run mongo service
- `npm install`
- `npm run start:watch`

## Deploy

- This app is deployable to Heroku.
- The easiest is via [Github Integration](https://devcenter.heroku.com/articles/github-integration)
