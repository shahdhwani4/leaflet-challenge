
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// Add a tile layer (the base map)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data &copy; OpenStreetMap contributors"
}).addTo(myMap);

// Function to get color based on depth
function getColor(depth) {
    return depth > 90 ? "#ea2c2c" :
           depth > 70 ? "#ea822c" :
           depth > 50 ? "#ee9c00" :
           depth > 30 ? "#eecc00" :
           depth > 10 ? "#d4ee00" :
                        "#98ee00";
}

// Function to get radius based on magnitude
function getRadius(magnitude) {
    return magnitude === 0 ? 1 : magnitude * 4;
}

// GeoJSON URL 
var earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Use D3 to pull in the data and visualize it
d3.json(earthquakeData).then(function(data) {
    
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: function(feature) {
            return {
                color: "#000",
                weight: 0.5,
                fillOpacity: 1,
                fillColor: getColor(feature.geometry.coordinates[2]),  // Depth is the third coordinate
                radius: getRadius(feature.properties.mag)  // Magnitude determines size
            };
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(
                "Magnitude: " + feature.properties.mag + "<br>" +
                "Location: " + feature.properties.place + "<br>" +
                "Depth: " + feature.geometry.coordinates[2] + " km"
            );
        }
    }).addTo(myMap);

    // Add the legend
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
            depths = [-10, 10, 30, 50, 70, 90],
            labels = [];

        // Loop through the depth intervals and generate a label with a colored square for each interval
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);
});
