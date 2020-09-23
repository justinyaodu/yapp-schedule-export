"use strict";

async function main() {
  updateFormFromUrl();

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
