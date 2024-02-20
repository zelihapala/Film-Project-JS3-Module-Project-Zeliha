// Function to fetch episodes data
function fetchEpisodesData() {
  return fetch("https://api.tvmaze.com/shows/82/episodes").then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// Function to generate episode code
function generateEpisodeCode(episode) {
  return `S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
}

// Variable to store fetched episodes data
let fetchedEpisodes = null;

// Function to handle fetching and displaying episodes
function fetchAndDisplayEpisodes() {
  // Show loading message
  root.innerHTML = "<p>Loading episodes...</p>";

  // Fetch episodes data
  fetchEpisodesData()
    .then((episodes) => {
      // Store fetched episodes data
      fetchedEpisodes = episodes;
      // Populate dropdown with episode options
      populateDropdown(episodes);
      // Display episodes
      displayEpisodes(episodes);
    })
    .catch((error) => {
      // Notify user if an error occurs
      root.innerHTML = "<p>An error occurred while loading episodes. Please try again later.</p>";
      console.error("Error fetching episodes:", error);
    });
}

// Function to populate dropdown with episode options
function populateDropdown(episodes) {
  const selectElement = document.getElementById("episode-select");
  selectElement.innerHTML = `<option value="">Episodes</option>`;
  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${generateEpisodeCode(episode)} - ${episode.name}`;
    selectElement.appendChild(option);
  });
}

// Create search container
const searchContainer = document.createElement("div");
searchContainer.innerHTML = `
  <input type="text" id="search-input" placeholder="Search episodes...">
  <span id="episode-count"></span>
  <select id="episode-select">
    <option value="">Episodes</option>
  </select>
`;
document.body.insertBefore(searchContainer, root);

// Initialize
fetchAndDisplayEpisodes();

// Clear dropdown when search input is clicked
document.getElementById("search-input").addEventListener("click", () => {
  document.getElementById("episode-select").value = "";
  // Fetch and display all episodes
  fetchAndDisplayEpisodes();
});

// Clear dropdown when clicking anywhere else on the screen
document.body.addEventListener("click", (event) => {
  const dropdown = document.getElementById("episode-select");
  if (!dropdown.contains(event.target) && event.target !== document.getElementById("search-input")) {
    dropdown.value = "";
    dropdown.setAttribute("placeholder", "Episodes");
  }
});

// Clear dropdown when dropdown is closed
document.getElementById("episode-select").addEventListener("change", () => {
  const dropdown = document.getElementById("episode-select");
  if (dropdown.value === "") {
    dropdown.setAttribute("placeholder", "Episodes");
  }
});

// Show single episode or all episodes
document.getElementById("episode-select").addEventListener("change", () => {
  const selectedValue = document.getElementById("episode-select").value;
  if (selectedValue === "") {
    displayEpisodes(fetchedEpisodes);
  } else {
    const selectedEpisode = fetchedEpisodes.find((episode) => episode.id === parseInt(selectedValue));
    displayEpisodes([selectedEpisode]);
  }
});

// Filter episodes
function filterEpisodes() {
  const searchTerm = document.getElementById("search-input").value.toLowerCase();
  const filteredEpisodes = fetchedEpisodes.filter((episode) => episode.name.toLowerCase().includes(searchTerm) || episode.summary.toLowerCase().includes(searchTerm));
  displayEpisodes(filteredEpisodes);
}

// Add event listener for input on search
document.getElementById("search-input").addEventListener("input", filterEpisodes);

// Function to display episodes
function displayEpisodes(episodes) {
  root.innerHTML = "";
  episodes.forEach((episode) => {
    const template = document.getElementById("episode-template").content.cloneNode(true);
    template.querySelector(".episode-name").textContent = `${episode.name} - ${generateEpisodeCode(episode)}`;
    template.querySelector(".episode-image").src = episode.image.medium;
    template.querySelector(".episode-image").alt = episode.name;
    template.querySelector(".episode-summary").innerHTML = episode.summary;
    root.appendChild(template);
  });
  document.getElementById("episode-count").textContent = `Total Episodes: ${episodes.length}`;
}

// Add footer
function addFooter() {
  const footer = document.querySelector("footer");
  const tvmazeLink = document.createElement("a");
  tvmazeLink.href = "https://www.tvmaze.com/";
  tvmazeLink.textContent = "TVMaze.com";
  tvmazeLink.target = "_blank";
  footer.appendChild(document.createTextNode("Data provided by "));
  footer.appendChild(tvmazeLink);
}

addFooter();
