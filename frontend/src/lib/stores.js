import { writable } from 'svelte/store';
// STORES act as a global registry for all the data that needs to be shared between components

// stores data for handling leaflet map
export const map_store = writable();

// stores data for handling the search results
export const results_store = writable();

// store data of last api requested
export const last_api_request_url_store = writable();

// stores error data and is displayed it as a toast in header
export const error_store = writable();

// stores the help text of our page for easy navigation
export const help_text_store = writable();

// stores data relalated to any major update or notification of website
export const updates_store = writable();

// Store page data for easy naviagation
export const page = writable();

// Stores the number of request being procesed by api
export const loader_count_store = writable(0);


/**
 * Update the global page state.
 *
 * When called without a parameter, then the current window.location is
 * parsed and the page state is set accordingly. Otherwise the page state
 * is set from the parameters. 'pagename' is the overall subpage (without
 * .html extension). 'params' must be an URLSearchParams object and contain
 * the requested query parameters. It may also be omitted completely for a
 * link without query parameters.
 */
const pagenames = [
  'selecttype',
  'search',
  'reverse',
  'details',
  'home',
  'thanks',
  'about',
  'wrongresult',
  'wronginfo',
  'wrongordersearch',
  'wronginfosearch',
  'wronginforeverse',
  'wrongresultsearch',
  'wrongresultreverse',
  'wrongresultdetails',
  'verifyedit',
  'bugdescription',
  'review',
  'thankyou'
];

// Hanle the page state for redirection
export function refresh_page(pagename, params) {
  if (typeof pagename === 'undefined') {
    pagename = window.location.pathname
      .replace('.html', '')
      .replace(/^.*\//, '');

    if (!pagenames.includes(pagename)) pagename = 'welcome';

    params = new URLSearchParams(window.location.search);
  } else {
    if (typeof params === 'undefined') {
      params = new URLSearchParams();
    }

    let param_str = params.toString();
    if (param_str) {
      param_str = '?' + param_str;
    }
    let new_url = pagename + '.html' + param_str;

    if (window.location.protocol.match(/^http/)) {
      window.history.pushState([], '', new_url);
    } else {
      window.location.href = new_url;
    }
  }

  page.set({ tab: pagename, params: params });
  error_store.set(null);
}
