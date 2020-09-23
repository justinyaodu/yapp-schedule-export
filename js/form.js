"use strict";

/**
 * Return the URL query as a dictionary.
 */
function getQuery() {
  const split = window.location.href.split("?");
  if (split.length > 1) {
    return parseQueryString(split[1]);
  } else {
    return {};
  }
}

/**
 * Parse a query string into a dictionary.
 */
function parseQueryString(queryString) {
  const query = {};
  const pairs = queryString.split("&");
  for (const pair of pairs) {
    const splitPair = pair.split("=");
    const name = splitPair[0];
    const value = decodeURIComponent(splitPair[1]);
    query[name] = value;
  }
  return query;
}

/**
 * Return the requested Yapp ID, or null if it was not specified.
 */
function getYappID() {
  const urlOrId = getQuery().q;

  if (urlOrId === undefined) {
    return null;
  } else {
    // This works for both URLs and IDs.
    const split = urlOrId.split("/");
    return split[split.length - 1];
  }
}
