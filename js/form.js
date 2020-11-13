define(function() {
  class Form {
    /**
     * Return the URL query as a dictionary.
     */
    static getQuery() {
      const split = window.location.href.split("?");
      if (split.length > 1) {
        return Form.parseQueryString(split[1]);
      } else {
        return {};
      }
    }

    /**
     * Parse a query string into a dictionary.
     */
    static parseQueryString(queryString) {
      const query = {};
      const pairs = queryString.split("&");
      for (const pair of pairs) {
        const splitPair = pair.split("=");
        const name = splitPair[0];
        const value = decodeURIComponent(splitPair[1]);
        query[name] = value;
      }
      return query;
    }

    /**
     * Return the requested Yapp ID, or null if it was not specified.
     */
    static getYappId() {
      const urlOrId = Form.getQuery().q;

      if (urlOrId === undefined) {
        return null;
      } else {
        // This returns IDs unchanged and extracts IDs from URLs.
        const split = urlOrId.split("/");
        return split[split.length - 1];
      }
    }

    /**
     * Set the text in the ID/URL input field to match the query string.
     */
    static updateFormFromUrl() {
      const value = Form.getQuery().q;

      if (value !== undefined) {
        document.getElementById("yapp-id-input").value = value;
      }
    }
  }

  return Form;
});
