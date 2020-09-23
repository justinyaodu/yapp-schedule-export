"use strict";

/**
 * Set the text in the ID/URL input field to the queried value.
 */
function updateInputFromUrl() {
  const value = getQuery().q;

  if (value !== undefined) {
    document.getElementById("yapp-id-input").value = value;
  }
}

async function main() {
  updateInputFromUrl();

  const yappID = getYappID();
  if (yappID === null) {
    return;
  } else if (yappID === "") {
    throw new Error("No Yapp ID or URL entered.");
  }
  
  const data = await getRawYappData(yappID);


  document.getElementById("schedule").innerText = JSON.stringify(data);
}

// Run the main function and display any error messages.
main().catch((error) => {
  const p = document.createElement("p");
  p.classList.add("error");
  p.innerText = error.toString();
  document.getElementById("schedule").appendChild(p);
});
