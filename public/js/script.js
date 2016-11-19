require([
        // "esri/Map",
        "esri/WebMap",
        "esri/views/MapView",
        "esri/geometry/Extent",
        "dojo/domReady!"
      ], function(WebMap, MapView, Extent) {
        // var map = new Map({
        //   basemap: "streets-vector"
        // });
        var webmap = new WebMap({
        portalItem: { // autocasts as new PortalItem()
            id: "46f3f1aa0e564775b32aa52842231e61"
          }
        });

        var view = new MapView({
          container: "viewDiv",  // Reference to the DOM node that will contain the view
          map: webmap               // References the map object created in step 3
        });

        // extent=-119.9709,32.4659,-114.2415,35.3018
        var ext = new Extent({
          xmax: -119.9709,
          ymax: 32.4659,
          xmin: -114.2415,
          ymin: 35.3018
        });

        view.extent = ext;

      });