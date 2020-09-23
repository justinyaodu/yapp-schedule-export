"use strict";

/**
 * Return a Promise which resolves to the data for a Yapp app.
 */
async function getRawYappData(yappID) {
  const url = "https://www.yapp.us/api/preview/v2/yapps/" + yappID;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not retrieve data for Yapp ID '${yappID}' `
      + `(${response.status} ${response.statusText}). `
      + "Please ensure that the Yapp ID or URL is entered correctly.");
  }

  return await response.json();
}

async function getYappData(yappID) {
  const data = await getRawYappData();
}
