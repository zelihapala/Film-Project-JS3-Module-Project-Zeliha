// Function to fetch episodes data
function fetchEpisodesData() {
  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((response) => response.json())
    .then((data) => displayPage(data));
}

fetchEpisodesData();
function generateEpisodeCode(episode) {
  return `S${episode.season.toString().padStart(2, "0")}E${episode.number
    .toString()
    .padStart(2, "0")}`;
}

let fetchedEpisodes = null;

function displayPage(episodes) {
  root.innerHTML = "<p>Loading episodes...</p>";

  function render(episodes) {
    fetchedEpisodes = episodes;
    populateDropdown(episodes);
    displayEpisodes(episodes);
  }

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

  const searchContainer = document.createElement("div");
  searchContainer.id = "navbar";
  searchContainer.innerHTML = `
  <input type="text" id="search-input" placeholder="Search episodes...">
  <span id="episode-count"></span>
  <select id="episode-select">
    <option value="">Episodes</option>
  </select>
`;
  document.body.insertBefore(searchContainer, root);
  render(episodes);

  document.getElementById("search-input").addEventListener("input", () => {
    const inputValue = document.getElementById("search-input").value.trim().toLowerCase();
    if (inputValue === "") {
      render(episodes);
    }
  });

  document.getElementById("search-input").addEventListener("focus", () => {
    document.getElementById("episode-select").value = "";

    render(episodes);
  });

  document.body.addEventListener("click", (event) => {
    const dropdown = document.getElementById("episode-select");
    if (
      !dropdown.contains(event.target) &&
      event.target !== document.getElementById("search-input")
    ) {
      dropdown.value = "";
      dropdown.setAttribute("placeholder", "Episodes");
      render(episodes);
    }
    document.getElementById("search-input").value = "";
  });

  document.getElementById("episode-select").addEventListener("change", () => {
    const dropdown = document.getElementById("episode-select");
    if (dropdown.value === "") {
      dropdown.setAttribute("placeholder", "Episodes");
    }
  });

  document.getElementById("episode-select").addEventListener("change", () => {
    const selectedValue = document.getElementById("episode-select").value;
    if (selectedValue === "") {
      displayEpisodes(fetchedEpisodes);
    } else {
      const selectedEpisode = fetchedEpisodes.find(
        (episode) => episode.id === parseInt(selectedValue)
      );
      displayEpisodes([selectedEpisode]);
    }
  });

  function filterEpisodes() {
    const searchTerm = document.getElementById("search-input").value.toLowerCase();
    const filteredEpisodes = fetchedEpisodes.filter(
      (episode) =>
        episode.name.toLowerCase().includes(searchTerm) ||
        episode.summary.toLowerCase().includes(searchTerm)
    );
    displayEpisodes(filteredEpisodes);
  }
  document.getElementById("search-input").addEventListener("input", filterEpisodes);

  // Function to display episodes
  function displayEpisodes(episodes) {
    root.innerHTML = "";
    episodes.forEach((episode) => {
      const template = document.getElementById("episode-template").content.cloneNode(true);
      template.querySelector(".episode-name").textContent = `${
        episode.name
      } - ${generateEpisodeCode(episode)}`;

      template.querySelector(".episode-image").src = episode.image.medium;
      template.querySelector(".episode-image").alt = episode.name;
      template.querySelector(".episode-summary").innerHTML = episode.summary;
      root.appendChild(template);
    });
    document.getElementById("episode-count").textContent = `Total Episodes: ${episodes.length}`;
  }

  // Add footer

  addFooter();
}
function addFooter() {
  const footer = document.querySelector("footer");
  const tvmazeLink = document.createElement("a");
  tvmazeLink.href = "https://www.tvmaze.com/";
  tvmazeLink.textContent = "TVMaze.com";
  tvmazeLink.target = "_blank";
  footer.appendChild(document.createTextNode("Data provided by "));
  footer.appendChild(tvmazeLink);
}
