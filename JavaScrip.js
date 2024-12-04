document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("start-election");
    const closeButton = document.getElementById("close-election");
    const votePanel = document.getElementById("vote-panel");
    const resultsPanel = document.getElementById("results-panel");
    const candidatesList = document.getElementById("candidates-list");
    const resultsList = document.getElementById("results-list");
    const usernameInput = document.getElementById("username");
  
    let candidates = [];
    let votes = {};
    let electionStarted = false;
  
    // URLs de las APIs para obtener los candidatos y el administrador
    const candidatesUrl = "https://raw.githubusercontent.com/cesarmcuellar/Elecciones/refs/heads/main/candidatos.json";
    const adminUrl = "https://raw.githubusercontent.com/cesarmcuellar/Elecciones/refs/heads/main/administrador.json";
  
    // Función para cargar los candidatos desde la API
    async function loadCandidates() {
      const response = await fetch(candidatesUrl);
      candidates = await response.json();
      candidates.push({ name: "Blanco", program: "Sin Representante", photo: "", ficha: "" }); // Agregar candidato en blanco
  
      // Mostrar candidatos en la interfaz de votación
      displayCandidates();
    }
  
    // Función para mostrar los candidatos en el panel de votación
    function displayCandidates() {
      candidatesList.innerHTML = "";
      candidates.forEach(candidate => {
        const candidateDiv = document.createElement("div");
        candidateDiv.classList.add("candidate");
  
        const candidateInfo = `
          <div class="info">
            <img src="${candidate.photo || 'https://via.placeholder.com/100'}" alt="${candidate.name}">
            <div>
              <p><strong>${candidate.name}</strong></p>
              <p>${candidate.program}</p>
              <p>Aprendiz: ${candidate.ficha}</p>
            </div>
          </div>
        `;
        candidateDiv.innerHTML = candidateInfo;
  
        candidateDiv.onclick = () => confirmVote(candidate);
  
        candidatesList.appendChild(candidateDiv);
      });
    }
  
    // Función para confirmar el voto
    function confirmVote(candidate) {
      if (confirm(`¿Está seguro de votar por ${candidate.name}?`)) {
        if (!votes[candidate.name]) {
          votes[candidate.name] = 0;
        }
        votes[candidate.name]++;
      }
    }
  
    // Función para mostrar los resultados
    function showResults() {
      resultsPanel.style.display = "block";
      resultsList.innerHTML = "";
  
      candidates.forEach(candidate => {
        const resultItem = document.createElement("div");
        resultItem.classList.add("result-item");
        resultItem.innerHTML = `
          <strong>${candidate.name}</strong>: ${votes[candidate.name] || 0} votos
        `;
        resultsList.appendChild(resultItem);
      });
    }
  
    // Función para manejar el inicio de las elecciones
    async function startElection() {
      const response = await fetch(adminUrl);
      const adminData = await response.json();
  
      if (usernameInput.value === adminData.username) {
        electionStarted = true;
        loadCandidates();
        votePanel.style.display = "block";
        startButton.disabled = true;
        closeButton.disabled = false;
      } else {
        alert("Usuario no autorizado");
      }
    }
  
    // Función para manejar el cierre de las elecciones
    function closeElection() {
      electionStarted = false;
      showResults();
      votePanel.style.display = "none";
      closeButton.disabled = true;
    }
  
    // Eventos de los botones
    startButton.addEventListener("click", startElection);
    closeButton.addEventListener("click", closeElection);
  });