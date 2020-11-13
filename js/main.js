"use strict";

define(["./yapp", "./render", "./form"],
  function (yapp,    render,     form) {
    async function main() {
      form.updateFormFromUrl();

      displayAlert("info", "To view your schedule and export events to your calendar, enter your Yapp ID (e.g. <strong>DEMO</strong>) or Yapp URL (e.g. <strong>my.yapp.us/DEMO</strong>) above.");

      const yappId = form.getYappId();
      if (yappId === null) {
        return;
      } else if (yappId === "") {
        displayAlert("danger", "No Yapp ID or URL entered.");
        return;
      }

      const instancesOf = await yapp.getYappData(yappId);
      if (render.renderSchedule(instancesOf)) {
        clearAlerts();
      } else {
        clearAlerts();
        displayAlert("warning", "This app does not have a schedule page.");
      }
    }

    /**
     * Display an alert on the screen.
     */
    function displayAlert(type, contents) {
      const div = document.createElement("div");
      div.classList.add("alert", `alert-${type}`);
      div.role = "alert";
      div.innerHTML = contents;
      document.getElementById("alerts").appendChild(div);
    }

    /**
     * Clear all alerts from the screen.
     */
    function clearAlerts() {
      document.getElementById("alerts").innerText = "";
    }

    /**
     * Run the main function and display any error messages.
     */
    function run() {
      main().catch((error) => displayAlert("danger", error.toString()));
    }

    return {
      run: run
    };
  }
);
