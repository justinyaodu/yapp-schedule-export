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
    this.id = data.id;
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
  /**
   * Parse a Yapp date/time string YYYYMMDD(HH)?(MM)?
   * and return an array [year, month, day, hour, minute],
   * with missing values set to null.
   */
  static parseDate(date) {
    const results = /(....)(..)(..)(..)?(..)?/.exec(date);
    return [
      parseInt(results[1]),
      parseInt(results[2]),
      parseInt(results[3]),
      results[4] ? parseInt(results[4]) : null,
      results[5] ? parseInt(results[5]) : null,
    ];
  }

  static compareByDate(a, b) {
    return (a.startDateTime || 0) - (b.startDateTime || 0);
  }

  /**
   * Return the text of an event description, by recursively finding strings
   * in this object and concatenating them.
   */
  static parseDescription(desc) {
    if (desc === undefined || desc === null) {
      return "";
    } else if (typeof desc === "string") {
      // Filter out what I assume are HTML p tags.
      return desc === "p" ? "" : desc;
    } else if (Array.isArray(desc)) {
      // Recurse on array elements.
      return desc.reduce((a, b) => a + ScheduleEvent.parseDescription(b), "");
    } else if (desc.sections !== undefined) {
      // Top-level description object.
      return ScheduleEvent.parseDescription(desc.sections);
    } else {
      return "";
    }
  }

  /**
   * Given a date string, set <prefix>Date to the date, <prefix>Time to
   * the time, and <prefix>DateTime to the sum of the date and time.
   * If no time is specified, <prefix>Time will not be set.
   */
  assignDate(dateString, attributePrefix) {
    const prefixDate = attributePrefix + "Date";
    const prefixTime = attributePrefix + "Time";
    const prefixDateTime = attributePrefix + "DateTime";

    const [year, month, day, hour, minute] =
      ScheduleEvent.parseDate(dateString);

    // JavaScript months are zero-indexed.
    this[prefixDate] = new Date(year, month - 1, day);

    if (hour !== null && minute !== null) {
      const timeInMillis = 1000 * 60 * (minute + 60 * hour);
      this[prefixTime] = new Date(timeInMillis);
      this[prefixDateTime] = new Date(this[prefixDate].getTime() + timeInMillis);
    } else {
      this[prefixDateTime] = this[prefixDate];
    }
  }

  constructor(data) {
    super(data);

    this.name = data.attributes.title;
    this.location = data.attributes.location;

    this.description = ScheduleEvent.parseDescription(
      data.attributes.description);

    const datesString = data.attributes["date-and-time"];
    if (datesString) {
      const split = datesString.split("-");
      this.assignDate(split[0], "start");
      if (split.length > 1) {
        this.assignDate(split[1], "end");
      }
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
    this.sortOrder = data.attributes["sort-order"];
  }

  static compareBySortOrder(a, b) {
    return (a.sortOrder || -1) - (b.sortOrder || -1);
  }

  resolveReferences(uuidToObj) {
    this.events = this.data.relationships["schedule-items"].data
      .map(eventData => uuidToObj[eventData.id]);
    this.events.sort(ScheduleEvent.compareByDate);
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

  // If no instances of a class exist, return an empty list instead of
  // undefined.
  return new Proxy(classToInstances, {
    get: function(target, property, receiver) {
      if (target[property] === undefined) {
        return [];
      } else {
        return target[property];
      }
    }
  });
}
