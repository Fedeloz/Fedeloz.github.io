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
        if (Number.isInteger(data.stargazers_count) && data.stargazers_count >= 0 &&
            Number.isInteger(data.forks_count) && data.forks_count >= 0) {
          starsEl.textContent = data.stargazers_count.toLocaleString();
          forksEl.textContent = data.forks_count.toLocaleString();
        }
      } catch {
        // Preserve the last known counts if GitHub is blocked or rate-limited.
      }
    }),
  );
}

refreshGitHubRepoStats();
window.setInterval(refreshGitHubRepoStats, 60000);
