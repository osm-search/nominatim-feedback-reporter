# nominatim-feedback-reporter

Feedback interface for [Nominatim-UI](https://github.com/osm-search/nominatim-ui/).

The frontend runs standalone as website and will request data
from a separate Nominatim API running on http://localhost:80/nominatim/ and Nominatim-feedback-reporter API running on  http://localhost:8000/api/ and overpass-API running on https://overpass-api.de/api/ (configurable, see below).


For technical background, how to develop and create a release see [CONTRIBUTE.md](CONTRIBUTE.md) file at [https://github.com/darkshredder/nominatim-feedback-reporter/](https://github.com/darkshredder/nominatim-feedback-reporter).


## Starting the frontend

You can either

* open the `frontend/dist` directory in your browser.

* if you have Python installed (part of the Nominatim API server installation):

   1. `cd frontend/dist`
   2. start webserver `python3 -m http.server 8765` 
   3. open [http://localhost:8765/]() in your browser

* start a webserver using ([Big list of http static server one-liners](https://gist.github.com/willurd/5720255)) or configure Apache, nginx or other webservers to serve the `dist` directory.

## Starting the backend
#### Install the dependencies and Start the server:
</br>

```
cd backend/
pip install -r requirements.txt
gunicorn run --reload
```

The server will be up and running on [http://localhost:8000/]().

## Configuration

You can customize your installation by creating and editing `frontend/dist/theme/config.theme.js` which allows you to override the default values provided by `frontend/dist/config.default.js`.

The following `config.theme.js` example file changes the location of the API endpoint:

```javascript
  Nominatim_Config.Nominatim_API_Endpoint = 'http://my-server:1234/';
  Overpass_API_Endpoint = 'https://overpass-api.de/api/';
  Nominatim_Feedback_Reporter_API_Endpoint = 'http://localhost:8000/api/';
```

The `frontend/dist/theme/` directory also contains files make it easy to set a different
logo image, colors, welcome and help text.
