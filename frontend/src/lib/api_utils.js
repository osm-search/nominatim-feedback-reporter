import { last_api_request_url_store, error_store, loader_count_store } from './stores.js';
import { getSetObjectBugData } from './helpers';


function api_request_progress(status) {

  if (status === 'start') {
    loader_count_store.update(n => n + 1);
  } else {
    loader_count_store.update(n => n - 1);
  }

}

export async function fetch_from_api(endpoint_name, params, callback) {
  var api_url = generate_nominatim_api_url(endpoint_name, params);

  api_request_progress('start');
  if (endpoint_name !== 'status') last_api_request_url_store.set(null);

  try {
    await fetch(api_url, { headers: Nominatim_Config.Nominatim_API_Endpoint_Headers || {} })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          error_store.set(data.error.message);
        }
        callback(data);
        api_request_progress('finish');
      });
  } catch (error) {
    error_store.set(`Error fetching data from ${api_url} (${error})`);
    api_request_progress('finish');
  }

  if (endpoint_name !== 'status') last_api_request_url_store.set(api_url);
}

var fetch_content_cache = {};
export async function fetch_content_into_element(url, dom_element) {
  if (!window.location.protocol.match(/^http/)) {
    dom_element.innerHTML = `Cannot display data from ${url} here. `
      + 'Browser security prevents loading content from file:// URLs.';
    return;
  }

  if (fetch_content_cache[url]) {
    dom_element.innerHTML = fetch_content_cache[url];
    return;
  }
  try {
    await fetch(url)
      .then(response => response.text())
      .then(html => {
        html = html.replace('Nominatim_API_Endpoint', Nominatim_Config.Nominatim_API_Endpoint);
        dom_element.innerHTML = html;
        fetch_content_cache[url] = html;
      });
  } catch (error) {
    dom_element.innerHTML = `Error fetching content from ${url} (${error})`;
  }
}

function generate_nominatim_api_url(endpoint_name, params) {
  extend_parameters(params, Nominatim_Config.Nominatim_API_Endpoint_Params);
  return Nominatim_Config.Nominatim_API_Endpoint + endpoint_name + '.php?'
         + Object.keys(clean_up_parameters(params)).map((k) => {
           return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
         }).join('&');
}

function extend_parameters(params, params2) {
  var param_names = Object.keys(params2);
  for (var i = 0; i < param_names.length; i += 1) {
    params[param_names[i]] = params2[param_names[i]];
  }
}

function clean_up_parameters(params) {
  // `&a=&b=&c=1` => '&c=1'
  var param_names = Object.keys(params);
  for (var i = 0; i < param_names.length; i += 1) {
    var val = params[param_names[i]];
    if (typeof (val) === 'undefined' || val === '' || val === null) {
      delete params[param_names[i]];
    }
  }
  return params;
}

export function update_html_title(title) {
  document.title = [title, Nominatim_Config.Page_Title]
    .filter((val) => val && val.length > 1)
    .join(' | ');
}

// Fetcges overpass data for given radius and coordinates from query
export async function fetch_from_overpass_api(radius, lat, lon, callback) {
  let query = generate_overpass_query(radius, lat, lon);
  let api_url = Nominatim_Config.Overpass_API_Endpoint + 'interpreter?data=' + query;
  api_request_progress('start');
  try {
    await fetch(api_url)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          error_store.set(data.error.message);
        }
        callback(data);
        api_request_progress('end');

      });
  } catch (error) {
    error_store.set(`Error fetching data from ${api_url} (${error})`);
    api_request_progress('end');

  }
}

// Generates overpass query for given radius and coordinates
function generate_overpass_query(radius, lat, lon) {
  let query = `
  [out:json];
  (
    node[~"name*"~"."](around:${radius},${lat},${lon});
    way[~"name*"~"."](around:${radius},${lat},${lon});
    relation[~"name*"~"."](around:${radius},${lat},${lon});
  );
  out ids;
  `;
  return query;
}

// Handles setting final bug data entry for sending report.
export async function setExtraBugData() {
  await fetch_from_api('status', { format: 'json' }, function (data) {
    let statusData = data;
    let newData = {
      nominatim_database_timestamp: statusData.data_updated,
      nominatim_database_version: statusData.database_version,
      nominatim_software_version: statusData.software_version,
      timestamp: new Date().toISOString()
    };
    getSetObjectBugData(newData);
  });
}
