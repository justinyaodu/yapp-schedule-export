"use strict";

/**
 * Represent a generic object deserialized from Yapp data.
 */
class YappObject {
  /**
   * Initialize attributes from the object data.
   */
  constructor(data) {
    this.data = data;
  }

  /**
   * Convert UUIDs to object references.
   */
  resolveReferences(uuidToObj) {
    // Overridden by subclasses.
  }
}

/**
 * Represent an event on the schedule.
 */
class ScheduleEvent extends YappObject {
  constructor(data) {
    super(data);

    this.name = data.attributes.title;
    this.location = data.attributes.location;

    // TODO Figure out the structure of the description attribute.
    try {
      this.description = data.attributes.description.sections[0][2][0][3];
    } catch (e) {
      // Do nothing.
    }
  }
}

/**
 * Represent a schedule track.
 */
class ScheduleTrack extends YappObject {
  constructor(data) {
    super(data);

    this.name = data.attributes.name;
  }

  resolveReferences(uuidToObj) {
    this.events = this.data.relationships["schedule-items"].data
      .map(eventData => uuidToObj[eventData.id]);
  }
}

/**
 * Information about this app.
 */
class AppInfo extends YappObject {
  constructor(data) {
    super(data);

    this.name = data.attributes.name;
  }
}

// Map a deserialized object's type attribute to the corresponding class.
const typeToClass = {
  "schedule-items": ScheduleEvent,
  "tracks": ScheduleTrack,
  "yapps": AppInfo,
};

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

/**
 * Return a dictionary which maps YappObject class names to lists of their
 * instances.
 */
async function getYappData(yappId) {
  const rawData = await getRawYappData(yappId);

  const uuidToObj = {};
  const classToInstances = {};

  for (const objData of [rawData.data, ...rawData.included]) {
    let objClass = typeToClass[objData.type];
    if (objClass === undefined) {
      objClass = YappObject;
    }

    const obj = new objClass(objData);
    uuidToObj[objData.id] = obj;

    const className = obj.constructor.name;
    if (classToInstances[className] === undefined) {
      classToInstances[className] = [];
    }
    classToInstances[obj.constructor.name].push(obj);
  }

  for (const [id, obj] of Object.entries(uuidToObj)) {
    obj.resolveReferences(uuidToObj);
  }

  return classToInstances;
}
