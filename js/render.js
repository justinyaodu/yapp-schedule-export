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
  const trackContainer = document.createElement("div");

  trackContainer.appendChild(renderTrackHeading(track));

  const trackContents = document.createElement("div");
  trackContents.id = trackId(track);
  trackContents.classList.add("collapse");
  renderEventGroups(track).forEach((e) => trackContents.appendChild(e));
  trackContainer.appendChild(trackContents);

  return trackContainer;
}

/**
 * Return a summary element containing the heading for a track.
 */
function renderTrackHeading(track) {
  const div = document.createElement("div");
  div.classList.add("d-flex", "flex-row", "flex-nowrap", "mb-3");

  const id = trackId(track);

  const a = makeCollapseAnchor(id, false);
  div.appendChild(makeCollapseButton(trackId(track), false));

  const heading = document.createElement("h2");
  heading.innerText = track.name || "Unknown Schedule Track";
  a.appendChild(heading);
  div.appendChild(a);

  return div;
}

/**
 * Return an ID unique to a track.
 */
function trackId(track) {
  return "track-" + track.id;
}
/**
 * Return an array of elements representing groups of events by date.
 */
function renderEventGroups(track) {
  // TODO Reimplement this function after implementing date parsing.
  const groupedByDate = [];

  for (const schEvent of track.events) {
    if (groupedByDate.length == 0) {
      groupedByDate.push([]);
    } else {
      const lastEvent = groupedByDate[groupedByDate.length - 1][0];

      // Compare dates by their millisecond time value.
      const prevTime = (lastEvent.startDate ? lastEvent.startDate.getTime() : 0);
      const curTime = (schEvent.startDate ? schEvent.startDate.getTime() : 0);

      if (prevTime !== curTime) {
        groupedByDate.push([]);
      }
    }

    groupedByDate[groupedByDate.length - 1].push(schEvent);
  }

  const groupElements = [];
  for (const group of groupedByDate) {
    groupElements.push(renderEventGroup(group));
  }
  return groupElements;
}

/**
 * Return an element representing a group of events on the same date.
 */
function renderEventGroup(schEvents) {
  const card = document.createElement("div");
  card.classList.add("card", "mb-3");

  card.appendChild(renderEventGroupHeading(schEvents));
  card.appendChild(renderEventGroupList(schEvents));

  return card;
}

const eventGroupDateOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

/**
 * Return a heading for a group of events.
 */
function renderEventGroupHeading(schEvents) {
  const div = document.createElement("div");
  div.classList.add("card-header", "d-flex", "flex-row", "flex-nowrap");

  const id = eventGroupId(schEvents);

  div.appendChild(makeCollapseButton(id, true));
  const a = makeCollapseAnchor(id, true);

  const heading = document.createElement("h3");
  if (schEvents[0].startDate !== undefined) {
    heading.innerText = schEvents[0].startDate
      .toLocaleDateString(undefined, eventGroupDateOptions);
  } else {
    heading.innerText = "No Date Specified";
  }
  a.appendChild(heading);
  div.appendChild(a);

  return div;
}

/**
 * Make a button which controls a Bootstrap collapse element.
 */
function makeCollapseButton(id, initialExpanded) {
  // Enclose an empty span to allow CSS styling of button content.
  const button = wrap(document.createElement("span"), "button");

  button.type = "button";

  button.classList.add("collapse-toggle-button",
    "btn", "btn-outline-secondary", "mr-3");

  if (!initialExpanded) {
    button.classList.add("collapsed");
  }

  setCollapseControlAttributes(button);
  button.setAttribute("data-target", "#" + id);

  return button;
}

/**
 * Make an anchor which controls a Bootstrap collapse element.
 */
function makeCollapseAnchor(id, initialExpanded) {
  const a = document.createElement("a");

  a.classList.add("collapse-toggle-anchor");

  setCollapseControlAttributes(a, id, initialExpanded);
  a.href = "#" + id;

  return a;
}

/**
 * Set attributes used by collapse-controlling anchors and buttons.
 */
function setCollapseControlAttributes(element, id, initialExpanded) {
  element.setAttribute("data-toggle", "collapse");
  element.setAttribute("aria-expanded", initialExpanded);
  element.setAttribute("aria-controls", id);
}

/**
 * Return an element containing a list of events.
 */
function renderEventGroupList(schEvents) {
  const eventList = document.createElement("ul");
  eventList.classList.add("list-group", "list-group-flush", "collapse", "show");
  eventList.id = eventGroupId(schEvents);
  for (const schEvent of schEvents) {
    eventList.appendChild(renderEvent(schEvent));
  }
  return eventList;
}

/**
 * Return an ID unique to a group of events.
 */
function eventGroupId(schEvents) {
  return "group-of-" + schEvents[0].id;
}

/**
 * Return an element representing a schedule event.
 */
function renderEvent(schEvent) {
  const cardBody = document.createElement("li");
  cardBody.classList.add("list-group-item");

  cardBody.appendChild(renderEventHeading(schEvent));

  const locationElement = renderEventLocation(schEvent);
  if (locationElement !== null) {
    cardBody.appendChild(locationElement);
  }

  const descriptionElement = renderEventDescription(schEvent);
  if (descriptionElement !== null) {
    cardBody.appendChild(descriptionElement);
  }

  return cardBody;

//  const card = wrap(cardBody, "div");
//  card.classList.add("card");
//  return card;
}

/**
 * Return a heading for an event.
 */
function renderEventHeading(schEvent) {
  const heading = document.createElement("h4");
  heading.classList.add("card-title");
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
  locationText.classList.add("yapp-location");
  
  p = wrap(locationText, "p");
  p.classList.add("card-text");
  return p;
}

function renderEventDescription(schEvent) {
  if (schEvent.description === undefined) {
    return null;
  }

  const p = document.createElement("p");
  p.innerText = schEvent.description;
  p.classList.add("card-text");
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
