const video = document.querySelector("video");
const playButton = document.querySelector(".video-play");

function isFullscreen() {
  return Boolean(document.fullscreenElement || document.webkitFullscreenElement || video.webkitDisplayingFullscreen);
}

function updateButton() {
  playButton.hidden = !video.paused || isFullscreen();
}

playButton.addEventListener("click", () => {
  video.play().catch(updateButton);
});
video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);
video.addEventListener("ended", updateButton);
document.addEventListener("fullscreenchange", updateButton);
document.addEventListener("webkitfullscreenchange", updateButton);
video.addEventListener("webkitbeginfullscreen", updateButton);
video.addEventListener("webkitendfullscreen", updateButton);
updateButton();
