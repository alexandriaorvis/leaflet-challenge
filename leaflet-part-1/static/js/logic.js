// Name the url that contains the data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Call and store the data
d3.json(url).then(function(data){
    // Run createFeatures function with the data
    createFeatures(data.features)
});

// Create a popup for each earthquake data point that contains the place and time of the earthquake
function createFeatures(earthquakeData) {

    // Attach a pop up to each entry in the json file
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`)
        
        
    }; // onEachFeature function

    let earthquakes = L.geoJson(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            let depth = feature.geometry.coordinates[2];
            let fillColor = getColor(depth)

            return L.circleMarker(latlng, {
                fillOpacity: 0.75,
                color: 'black',
                weight: 1,
                fillColor: fillColor,
                radius: feature.properties.mag * 4
            });
        },
        onEachFeature: onEachFeature
    }); // end of earthquakes

    // Create a map with earthquakes layer
    createMap(earthquakes)

}; // createFeatures function

// Create a function to indicate the color of the circle marker depending on depth
function getColor(depth) {
    return depth < 10 ? '#A3F601' :
           depth < 30 ? '#DBF400' :
           depth < 50 ? '#F7DB10' :
           depth < 70 ? '#FDB62A' :
           depth < 90 ? '#FCA25D' :
                        '#FE5F65';
}; // getColor function

// createMap function
function createMap(earthquakes) {

    // Add a tile layer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    }); 

    // Add legend
    addLegend(myMap)

}; // createMap function

// Add a legend
function addLegend(map) {

    // Create legend control
    let legend = L.control({position: 'bottomright'});

    // Define legend content
    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend');
        let depthValues = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];
        let colors = ['#A3F601', '#DBF400', '#F7DB10', '#FDB62A', '#FCA25D', '#FE5F65']
        labels = [];


        for (let i = 0; i < depthValues.length; i++) {
            labels.push(
                '<i style="background:' + colors[i] + '"></i> ' +
                        depthValues[i]
            );
        }

        // Add legend labels to div
        div.innerHTML = labels.join('<br>');
        return div;

    }; 

    legend.addTo(map);

};// addLegend function
