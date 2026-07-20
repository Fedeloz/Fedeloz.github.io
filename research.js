async function refreshGitHubRepoStats() {
  const statsBlocks = document.querySelectorAll("[data-github-repo]");

  await Promise.all(
    [...statsBlocks].map(async (block) => {
      const repo = block.dataset.githubRepo;
      const starsEl = block.querySelector("[data-stars]");
      const forksEl = block.querySelector("[data-forks]");

      if (!repo || !starsEl || !forksEl) {
        return;
      }

      try {
        const response = await fetch(`https://api.github.com/repos/${repo}`);
        if (!response.ok) {
          throw new Error(`GitHub API returned ${response.status}`);
        }

        const data = await response.json();
        starsEl.textContent = data.stargazers_count.toLocaleString();
        forksEl.textContent = data.forks_count.toLocaleString();
      } catch {
        starsEl.textContent = "—";
        forksEl.textContent = "—";
      }
    }),
  );
}

refreshGitHubRepoStats();
window.setInterval(refreshGitHubRepoStats, 60000);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const autoplayVideos = document.querySelectorAll("[data-autoplay-video]");

function updateAutoplayVideos() {
  autoplayVideos.forEach((video) => {
    if (reducedMotion.matches) {
      video.pause();
      return;
    }

    video.play().catch(() => {
      // Native controls remain available if the browser blocks autoplay.
    });
  });
}

updateAutoplayVideos();
reducedMotion.addEventListener("change", updateAutoplayVideos);
