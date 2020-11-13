requirejs.config({
  "baseUrl": "js",
  "paths": {
    "mobiledoc-dom-renderer": "https://cdn.jsdelivr.net/npm/mobiledoc-dom-renderer@0.7.0/dist/amd/mobiledoc-dom-renderer",
  }
});

requirejs(["./main"],
  function(   main) {
    main.run()
  }
);
