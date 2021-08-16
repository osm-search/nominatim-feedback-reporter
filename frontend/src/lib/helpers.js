module.exports.formatOSMTypeId = formatOSMTypeId;
module.exports.formatLabel = formatLabel;
module.exports.zoomLevels = zoomLevels;
module.exports.geocodingProperties = geocodingProperties;
module.exports.getSetBugData = getSetBugData;
module.exports.getBugData = getBugData;
module.exports.getSetObjectBugData = getSetObjectBugData;

// Returns OSMtype + OSM_id from OSM type and OSM id
function formatOSMTypeId(type, id) {
  if (type === 'node') return 'N' + id;
  if (type === 'way') return 'W' + id;
  if (type === 'relation') return 'R' + id;
  return '';
}

// format's aPlace to a string as label used in search results box
function formatLabel(aPlace) {
  // if (aPlace.label) return aPlace.label;

  function capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
  }

  if (aPlace.type && aPlace.type === 'yes' && aPlace.class) {
    return capitalize(aPlace.class.replace(/_/g, ' '));
  }
  if (aPlace.type) {
    return capitalize(aPlace.type.replace(/_/g, ' '));
  }
  return '';
}

// Returns array of strings with zoom levels based on its index
function zoomLevels() {
  const aZoomLevels = [
    /*  0 */ 'Continent / Sea',
    /*  1 */ '',
    /*  2 */ '',
    /*  3 */ 'Country',
    /*  4 */ '',
    /*  5 */ 'State',
    /*  6 */ 'Region',
    /*  7 */ '',
    /*  8 */ 'County',
    /*  9 */ '',
    /* 10 */ 'City',
    /* 11 */ '',
    /* 12 */ 'Town / Village',
    /* 13 */ '',
    /* 14 */ 'Suburb',
    /* 15 */ '',
    /* 16 */ 'Street',
    /* 17 */ '',
    /* 18 */ 'Building',
    /* 19 */ '',
    /* 20 */ '',
    /* 21 */ ''
  ];
  return aZoomLevels;
}

// Get's list of geocoding properties from GeoCodeJSON format
function geocodingProperties() {
  const properties = [
    'name',
    'housenumber',
    'street',
    'locality',
    'postcode',
    'city',
    'district',
    'county',
    'state',
    'country',
    'lat',
    'lon'
  ];
  return properties;
}

// Handles get set data to localStorage use key value pairs
function getSetBugData(key, value) {
  let bug_data = getBugData();
  bug_data[key] = value;

  localStorage.setItem('bug_data', JSON.stringify(bug_data));
  return JSON.parse(localStorage.getItem('bug_data'));
}

// Handles get set data to localStorage using objects
function getSetObjectBugData(data) {
  let bug_data = getBugData();
  bug_data = Object.assign(bug_data, data);

  localStorage.setItem('bug_data', JSON.stringify(bug_data));
  return JSON.parse(localStorage.getItem('bug_data'));
}

// Handles get data from localStorage
function getBugData() {
  if (localStorage.getItem('bug_data')) {
    return JSON.parse(localStorage.getItem('bug_data'));
  }

  return {};
}
