fetch("https://api.github.com/repos/SatCom-TELMA/MA-DRL_Routing_Simulator")
  .then(response => { if (!response.ok) throw new Error("Repository unavailable"); return response.json(); })
  .then(repo => {
    if (Number.isInteger(repo.stargazers_count)) document.querySelector("#stars").textContent = `${repo.stargazers_count.toLocaleString()} stars`;
    if (Number.isInteger(repo.forks_count)) document.querySelector("#forks").textContent = `${repo.forks_count.toLocaleString()} forks`;
  })
  .catch(() => { /* Keep working repository links when counts are unavailable. */ });
