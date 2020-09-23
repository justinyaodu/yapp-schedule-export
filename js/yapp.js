"use strict";

/**
 * Return a Promise which resolves to the data for a Yapp app.
 */
async function getRawYappData(yappId) {
  const url = "https://www.yapp.us/api/preview/v2/yapps/" + yappId;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not retrieve data for Yapp ID '${yappId}' `
      + `(${response.status} ${response.statusText}). `
      + "Please ensure that the Yapp ID or URL is entered correctly.");
  }

  return await response.json();
}

async function getYappData(yappId) {
  const data = await getRawYappData();
}
