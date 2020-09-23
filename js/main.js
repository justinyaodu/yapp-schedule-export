"use strict";

async function main() {
  updateFormFromUrl();

  const yappId = getYappId();
  if (yappId === null) {
    return;
  } else if (yappId === "") {
    throw new Error("No Yapp ID or URL entered.");
  }
  
  const instancesOf = await getYappData(yappId);

  // TODO
  for (const [className, instanceList] of Object.entries(instancesOf)) {
    for (const obj of instanceList) {
      delete obj.data;
    }
  }
  document.getElementById("schedule").innerText = JSON.stringify(instancesOf);
}

// Run the main function and display any error messages.
main().catch((error) => {
  const p = document.createElement("p");
  p.classList.add("error");
  p.innerText = error.toString();
  document.getElementById("schedule").appendChild(p);
});
