const video = document.querySelector("video");
const playButton = document.querySelector(".video-play");
let enteringFullscreen = false;

function isFullscreen() {
  return Boolean(document.fullscreenElement || document.webkitFullscreenElement || video.webkitDisplayingFullscreen);
}

function updateButton() {
  playButton.hidden = !video.paused || isFullscreen();
}

async function enterFullscreen() {
  if (enteringFullscreen || isFullscreen()) return;
  enteringFullscreen = true;
  try {
    if (video.requestFullscreen && document.fullscreenEnabled) {
      await video.requestFullscreen();
    } else if (video.webkitEnterFullscreen) {
      // iPhone Safari uses the native video player.
      video.webkitEnterFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    }
  } catch {
    // Keep the normal player usable when fullscreen is unavailable or declined.
  } finally {
    enteringFullscreen = false;
    updateButton();
  }
}

playButton.addEventListener("click", () => {
  // Both requests start within the tap/click so browsers retain user activation.
  const playback = video.play();
  enterFullscreen();
  playback.catch(updateButton);
});
video.addEventListener("play", () => {
  updateButton();
  enterFullscreen();
});
video.addEventListener("pause", updateButton);
video.addEventListener("ended", updateButton);
document.addEventListener("fullscreenchange", updateButton);
document.addEventListener("webkitfullscreenchange", updateButton);
video.addEventListener("webkitbeginfullscreen", updateButton);
video.addEventListener("webkitendfullscreen", updateButton);
updateButton();
