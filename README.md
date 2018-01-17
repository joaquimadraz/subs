# OpenSubs [![Build Status](https://travis-ci.org/joaquimadraz/opensubs.io.svg?branch=setup-travis-ci)](https://travis-ci.org/joaquimadraz/opensubs.io)
## Track recurring bills and subscriptions :money_with_wings:

I'm drafting some blog posts about the work done:
- [Deploying-an-Elixir-Phoenix-app-to-AWS-ECS](https://github.com/joaquimadraz/opensubs.io/wiki/Deploying-an-Elixir-Phoenix-app-to-AWS-ECS-(WIP))

### Stack
- Elixir backend
- React frontend
- PostgreSQL database

### How to run OpenSubs
1. `mix deps.get`, to install dependencies
2. `mix ecto.setup`, to create and migrate the database
3. `cd apps/subs_web/frontend && yarn install`, to install frontend dependencies
3. `mix phx.server`, to run the server, will also build the frontend

- `cd apps/subs_web/frontend && node_modules/.bin/webpack --config webpack.config.js`, to build the frontend manually

#### Running tests
- `brew install chromedriver`, to run acceptance tests
- `mix test`, to un all tests
- `mix test --only acceptance`, to run only acceptance tests

### MVP
#### Backend API
- [x] User signup/authentication
- [x] User password recovery
- [x] Services list
- [x] Subscriptions create
- [x] Subscriptions update
- [x] Subscriptions archive
- [x] Subscriptions list

#### Frontend
- [x] User signup/authentication
- [x] User password recovery
- [x] Create custom subscription
  - [x] Create from service service
- [x] List all subscriptions
- [x] Subscriptions dashboard
  - [x] Due this month
  - [x] Due next month
  - [x] Monthly payment
  - [x] Yearly payment

### Nice to have
- [ ] Categorization (personal, business, services)
- [x] Email notifications
- [ ] Web notifications

### Future
- [ ] Facebook bot

## License
MIT © [Joaquim Adraz](http://joaquimadraz.com)
