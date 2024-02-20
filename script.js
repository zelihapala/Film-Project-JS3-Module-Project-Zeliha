//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

window.onload = setup;
// Function to generate episode code like  S01E01
function generateEpisodeCode(season, number) {
  return `S${season.toString().padStart(2, "0")}E${number.toString().padStart(2, "0")}`;
}

function renderAllEpisodes() {
  const episodes = getAllEpisodes();

  const root = document.getElementById("root");

  episodes.forEach((episode) => {
    const episodeTemplate = document.getElementById("episode-template").content.cloneNode(true);

    // episode details
    const episodeCode = `S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
    const episodeName = episodeTemplate.querySelector(".episode-name");
    episodeName.textContent = `${episode.name} ${episodeCode}`;

    const episodeImage = episodeTemplate.querySelector(".episode-image");
    episodeImage.src = episode.image.medium;
    episodeImage.alt = episode.name;

    const episodeSummary = episodeTemplate.querySelector(".episode-summary");
    episodeSummary.innerHTML = episode.summary;

    root.appendChild(episodeTemplate);
  });

  function addFooter() {
    const footer = document.createElement("footer");
    const attributionText = document.createTextNode("Data provided by ");
    const tvmazeLink = document.createElement("a");
    tvmazeLink.href = "https://www.tvmaze.com/";
    tvmazeLink.textContent = "TVMaze.com";
    tvmazeLink.target = "_blank";

    footer.appendChild(attributionText);
    footer.appendChild(tvmazeLink);
    document.body.appendChild(footer);
  }

  addFooter();
}

window.onload = renderAllEpisodes;
