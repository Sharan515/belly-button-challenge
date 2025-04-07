// Load the data and initialize the dashboard
function init() {
  // Select the dropdown menu
  var dropdown = d3.select("#selDataset");

  // Read the data from the JSON file
  d3.json("samples.json").then(data => {
      // Populate the dropdown menu with ID options
      data.names.forEach(name => {
          dropdown.append("option").text(name).property("value", name);
      });

      // Display the initial plots and demographic info for the first ID
      const firstId = data.names[0];
      getPlots(firstId);
      getDemoInfo(firstId);
  });
}

// Update plots and demographic info when dropdown selection changes
function optionChanged(id) {
  getPlots(id);
  getDemoInfo(id);
}

// Function to create plots for the selected ID
function getPlots(id) {
  d3.json("samples.json").then(data => {
      const sample = data.samples.filter(s => s.id === id)[0];

      // Prepare data for the bar chart (Top 10 OTU)
      const barData = [{
          x: sample.sample_values.slice(0, 10).reverse(),
          y: sample.otu_ids.slice(0, 10).reverse().map(otu => `OTU ${otu}`),
          text: sample.otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
          
        }];

      // Layout for the bar chart
      const barLayout = {
          margin: { l: 100, r: 50, t: 50, b: 50 },
          title: "Top 10 Bacteria Cultures Found",
          xaxis: {title: "Number of Bacteria"},
      };

      // Render the bar chart
      Plotly.newPlot("bar", barData, barLayout);

      // Prepare data for the bubble chart
      const bubbleData = [{
          x: sample.otu_ids,
          y: sample.sample_values,
          text: sample.otu_labels,
          mode: "markers",
          marker: {
              size: sample.sample_values,
              color: sample.otu_ids,
              colorscale: "Earth"
          }
      }];

      // Layout for the bubble chart
      const bubbleLayout = {
          xaxis: { title: "OTU ID" },
          height: 600,
          width: 1000,
          title: "Bacteria Cultures Per Sample",
          yaxis: { title: "Number of Bacteria" },
              };

      // Render the bubble chart
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

// Function to display demographic info for the selected ID
function getDemoInfo(id) {
  d3.json("samples.json").then(data => {
      const metadata = data.metadata.filter(meta => meta.id.toString() === id)[0];
      const demographicInfo = d3.select("#sample-metadata");

      // Clear the existing demographic info
      demographicInfo.html("");

      // Display demographic info
      Object.entries(metadata).forEach(([key, value]) => {
          demographicInfo.append("h5").text(`${key.toUpperCase()}: ${value}`);
      });
  });
}

init(); // Initialize the dashboard