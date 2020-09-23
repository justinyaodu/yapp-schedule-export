/**
 * Display the schedule data.
 */
function render(instancesOf) {
  instancesOf.ScheduleTrack.forEach((track) => 
    document.getElementById("schedule").appendChild(renderTrack(track)));
}

/**
 * Return an element representing a schedule track.
 */
function renderTrack(track) {
  const details = document.createElement("details");

  details.appendChild(renderTrackSummary(track));

  renderEventGroups(track).forEach((e) => details.appendChild(e));

  return details;
}

/**
 * Return a summary element containing the heading for a track.
 */
function renderTrackSummary(track) {
  const heading = document.createElement("h2");
  heading.innerText = track.name || "Unknown Schedule Track";
  return wrap(heading, "summary");
}

/**
 * Return an array of elements representing groups of events by date.
 */
function renderEventGroups(track) {
  // TODO Reimplement this function after implementing date parsing.
  const eventElements = [];
  for (const schEvent of track.events) {
    eventElements.push(renderEvent(schEvent));
  }
  return eventElements;
}

/**
 * Return an element representing a schedule event.
 */
function renderEvent(schEvent) {
  const div = document.createElement("div");
  div.classList.add("event");

  div.appendChild(renderEventHeading(schEvent));

  const locationElement = renderEventLocation(schEvent);
  if (locationElement !== null) {
    div.appendChild(locationElement);
  }

  return div;
}

/**
 * Return a heading for an event.
 */
function renderEventHeading(schEvent) {
  const heading = document.createElement("h4");
  heading.innerText = schEvent.name || "Unknown Event";
  return heading;
}

/**
 * Return an element representing an event location, or null if no location is
 * specified.
 */
function renderEventLocation(schEvent) {
  if (schEvent.location === undefined) {
    return null;
  }

  let locationText;

  // Create a link if a URL is detected in the location field.
  let urlRegex = /^https?:\/\/[^ ]+$/;
  if (urlRegex.test(schEvent.location)) {
    locationText = document.createElement("a");
    locationText.href = schEvent.location;
  } else {
    locationText = document.createElement("span");
  }

  locationText.innerText = schEvent.location;
  
  p = wrap(locationText, "p");
  p.classList.add("location");
  return p;
}

/**
 * Wrap the provided element in a new element with the specified tag name.
 */
function wrap(element, wrapTagName) {
  const wrapper = document.createElement(wrapTagName);
  wrapper.appendChild(element);
  return wrapper;
}
