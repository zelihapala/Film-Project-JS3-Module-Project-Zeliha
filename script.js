// Generate episode code
function generateEpisodeCode(episode) {
  return `S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
}

const allEpisodes = getAllEpisodes();
const root = document.getElementById("root");

// Create search container
const searchContainer = document.createElement("div");
searchContainer.innerHTML = `
  <input type="text" id="search-input" placeholder="Search episodes...">
  <span id="episode-count"></span>
  <select id="episode-select">
    <option value="">Episodes</option>
    ${allEpisodes.map((episode) => `<option value="${episode.id}">${generateEpisodeCode(episode)} - ${episode.name}</option>`).join("")}
  </select>
`;
document.body.insertBefore(searchContainer, root);

// Clear dropdown when search input is clicked
document.getElementById("search-input").addEventListener("click", () => {
  document.getElementById("episode-select").value = "";
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
  const selectedEpisode = allEpisodes.find((episode) => episode.id === parseInt(selectedValue));
  displayEpisodes(selectedValue === "" ? allEpisodes : [selectedEpisode]);
});

// Filter episodes
function filterEpisodes() {
  const searchTerm = document.getElementById("search-input").value.toLowerCase();
  const filteredEpisodes = allEpisodes.filter((episode) => episode.name.toLowerCase().includes(searchTerm) || episode.summary.toLowerCase().includes(searchTerm));
  displayEpisodes(filteredEpisodes);
}

// Display episodes
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

// Initialize
displayEpisodes(allEpisodes);

// Add event listener for input on search
document.getElementById("search-input").addEventListener("input", filterEpisodes);
