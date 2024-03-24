// Cache for fetched data
const cache = {
  shows: null,
  episodes: {},
  firstFetch: false,
};

let fetchedEpisodes = null;

// Fetch shows data
function fetchShows() {
  if (cache.shows) {
    populateShowDropdown(cache.shows);
  } else {
    fetch("https://api.tvmaze.com/shows")
      .then((response) => response.json())
      .then((data) => {
        cache.shows = data;
        populateShowDropdown(cache.shows);
        displayShows(cache.shows);
      })
      .catch((error) => console.error("Error fetching shows:", error));
  }
}
function displayShows(shows) {
  document.getElementById("root").innerHTML = "";
  shows.map((show) => {
    const imgShow = document.createElement("img");
    imgShow.src = show.image.medium ?? "";
    document.getElementById("root").append(imgShow);
  });
}

// Populate show dropdown
function populateShowDropdown(shows) {
  const showSelect = document.getElementById("show-select");

  shows.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );

  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelect.appendChild(option);
  });
  showSelect;
}

// Fetch episodes data
function fetchEpisodesData(showId) {
  if (cache.episodes[showId]) {
    displayEpisodes(cache.episodes[showId]);
    populateDropdown(cache.episodes[showId]);
  } else {
    fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
      .then((response) => response.json())
      .then((data) => {
        cache.episodes[showId] = data;
        fetchedEpisodes = data;
        displayEpisodes(cache.episodes[showId]);
        populateDropdown(data);
      })
      .catch((error) => console.error("Error fetching episodes:", error));
  }
}

// Generate episode code
function generateEpisodeCode(episode) {
  return `S${episode.season.toString().padStart(2, "0")}E${episode.number
    .toString()
    .padStart(2, "0")}`;
}

// Display episodes
function displayEpisodes(episodes) {
  const root = document.getElementById("root");
  root.innerHTML = "";

  episodes.forEach((episode) => {
    const template = document
      .getElementById("episode-template")
      .content.cloneNode(true);
    const episodeCode = generateEpisodeCode(episode);

    template.querySelector(
      ".episode-name"
    ).textContent = `${episode.name} - ${episodeCode}`;

    template.querySelector(".episode-image").src = episode.image
      ? episode.image.medium
      : "";
    template.querySelector(".episode-image").alt = episode.name;
    template.querySelector(".episode-summary").innerHTML = episode.summary;

    root.appendChild(template);
  });

  document.getElementById(
    "episode-count"
  ).textContent = `Total Episodes: ${episodes.length}`;
}

// Display page
function displayPage() {
  const root = document.getElementById("root");
  const searchContainer = document.createElement("div");
  searchContainer.id = "navbar";
  searchContainer.innerHTML = `
    <select id="show-select">
      <option value="default">Select a show</option>
    </select>
    <select id="episode-select">
      <option value="">Episodes</option>
    </select>
    <span id="episode-count"></span>
    <input type="text" id="search-input" placeholder="Search episodes...">
    
    
  `;
  document.body.insertBefore(searchContainer, root);

  displayEpisodes(fetchedEpisodes || []);

  // Add event listeners
  document
    .getElementById("search-input")
    .addEventListener("input", filterEpisodes);

  document.getElementById("search-input").addEventListener("focus", () => {
    document.getElementById("episode-select").value = "";
    displayEpisodes(fetchedEpisodes || []);
  });
  document.getElementById("show-select").addEventListener("change", (event) => {
    const dropdown = document.getElementById("episode-select");
    dropdown.value = "";
    document.getElementById("search-input").value = "";
    if (event.target.value === "default") {
      displayShows(cache.shows);
    } else {
      dropdown.setAttribute("placeholder", "Episodes");
      displayEpisodes(fetchedEpisodes || []);
    }
  });
  document.getElementById("episode-select").addEventListener("change", () => {
    const selectedValue = document.getElementById("episode-select").value;
    if (selectedValue === "") {
      displayEpisodes(fetchedEpisodes || []);
    } else {
      const selectedEpisode = fetchedEpisodes.find(
        (episode) => episode.id === parseInt(selectedValue)
      );
      displayEpisodes([selectedEpisode]);
    }
    document.getElementById("search-input").value = "";
  });
  document.getElementById("show-select").addEventListener("change", () => {
    const selectedShowId = document.getElementById("show-select").value;
    if (selectedShowId) {
      fetchEpisodesData(selectedShowId);
    } else {
      displayEpisodes([]);
    }
  });
}

// Populate episode dropdown
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

// Filter episodes
function filterEpisodes() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  const filteredEpisodes = fetchedEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(searchTerm) ||
      episode.summary.toLowerCase().includes(searchTerm)
  );
  displayEpisodes(filteredEpisodes);
}

// Function to add footer
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
fetchShows();
displayPage();
