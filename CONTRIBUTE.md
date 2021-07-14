# Developing Nominatim-Feedback-Reporter


## Background

Uses [Svelte](https://svelte.dev/) frontend framework,
[Leaflet](https://leafletjs.com/) for map interaction,
[Bootstrap](https://getbootstrap.com/) for layout styling,
[Falcon](https://falcon.readthedocs.io/) backend framework.

## Building the frontend

* Switch to frontend directory
  
  ```
  cd frontend/
  ```

* Install dependencies

   ```
   yarn install
   ```

* After you change files in `src` directory run

   ```
   yarn dev
   ```
   which will start a webserver on port 9080 and auto-reloads
   whenever you edit files. Configuration in `rollup.config.js`.

### Frontend Testing
</br>

The `test/` setup uses [Mocha](https://mochajs.org/) to run tests. Tests use [Puppeteer](https://pptr.dev/) to control a Google Chrome headless browser and evaluate with [Assert](https://nodejs.org/api/assert.html).


* Run integration test suite (configuration in `.mocharc.js`)

   ```
   yarn test
   API_ON_SAME_PORT=1 yarn test
   ```

   Setting API_ON_SAME_PORT simulates having both the API and UI on the same server
   port. That's a rare setup but something https://nominatim.openstreetmap.org/ does
   so worth testing.

   To run a single test file only

   ```
   yarn run rollup -c && yarn run mocha test/details.js
   ```

* Run syntax linter (configuration in `.eslint.js`)

   ```
   yarn lint
   ```

## Building the backend

* Switch to backend directory
  
  ```
  cd backend/
  ```

* Install dependencies

   ```
   pip install -r requirements.txt
   ```

* After you change files in `backend` directory run

   ```
   gunicorn run --reload
   ```
   which will start a webserver on port 8000 and auto-reloads
   whenever you edit files.

### Backend Testing
</br>

The `tests/` setup uses [pytest](https://docs.pytest.org/) to run tests.


* Run unit tests using

   ```
   pytest ./tests
   ```

