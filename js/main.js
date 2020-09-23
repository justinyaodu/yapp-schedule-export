"use strict";

async function main() {
  updateFormFromUrl();

  const yappId = getYappId();
  if (yappId === null) {
    return;
  } else if (yappId === "") {
    throw new Error("No Yapp ID or URL entered.");
  }
  
  const data = await getRawYappData(yappId);


  document.getElementById("schedule").innerText = JSON.stringify(data);
}

// Run the main function and display any error messages.
main().catch((error) => {
  const p = document.createElement("p");
  p.classList.add("error");
  p.innerText = error.toString();
  document.getElementById("schedule").appendChild(p);
});
