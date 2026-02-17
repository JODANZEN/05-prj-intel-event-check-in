// ===== SELECT ELEMENTS =====
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");

const attendeeCountSpan = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");

const waterCountSpan = document.getElementById("waterCount");
const zeroCountSpan = document.getElementById("zeroCount");
const powerCountSpan = document.getElementById("powerCount");

// ===== VARIABLES =====
const maxGoal = 50;

let totalAttendees = 0;
let teamCounts = {
  water: 0,
  zero: 0,
  power: 0,
};

let attendeesList = [];

// ===== LOAD SAVED DATA (LevelUp) =====
function loadFromStorage() {
  const savedTotal = localStorage.getItem("totalAttendees");
  const savedTeams = localStorage.getItem("teamCounts");
  const savedList = localStorage.getItem("attendeesList");

  if (savedTotal) totalAttendees = parseInt(savedTotal);
  if (savedTeams) teamCounts = JSON.parse(savedTeams);
  if (savedList) attendeesList = JSON.parse(savedList);

  updateUI();
  renderAttendeeList();
}

loadFromStorage();

// ===== SAVE DATA (LevelUp) =====
function saveToStorage() {
  localStorage.setItem("totalAttendees", totalAttendees);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendeesList", JSON.stringify(attendeesList));
}

// ===== UPDATE UI =====
function updateUI() {
  attendeeCountSpan.textContent = totalAttendees;

  waterCountSpan.textContent = teamCounts.water;
  zeroCountSpan.textContent = teamCounts.zero;
  powerCountSpan.textContent = teamCounts.power;

  const percent = (totalAttendees / maxGoal) * 100;
  progressBar.style.width = percent + "%";
}

// ===== RENDER ATTENDEE LIST (LevelUp) =====
function renderAttendeeList() {
  let listContainer = document.getElementById("attendeeList");

  if (!listContainer) {
    listContainer = document.createElement("div");
    listContainer.id = "attendeeList";
    listContainer.style.marginTop = "20px";
    document.querySelector(".team-stats").appendChild(listContainer);
  }

  listContainer.innerHTML = "<h3>Attendee List</h3>";

  attendeesList.forEach((attendee) => {
    const p = document.createElement("p");
    p.textContent = `${attendee.name} - ${attendee.teamLabel}`;
    listContainer.appendChild(p);
  });
}

// ===== CELEBRATION FEATURE (LevelUp) =====
function checkForWinner() {
  if (totalAttendees >= maxGoal) {
    let winningTeam = "";
    let highest = 0;

    for (let team in teamCounts) {
      if (teamCounts[team] > highest) {
        highest = teamCounts[team];
        winningTeam = team;
      }
    }

    let teamName = "";
    if (winningTeam === "water") teamName = "Team Water Wise";
    if (winningTeam === "zero") teamName = "Team Net Zero";
    if (winningTeam === "power") teamName = "Team Renewables";

    greeting.style.display = "block";
    greeting.classList.add("success-message");
    greeting.textContent = `🎉 Goal reached! ${teamName} wins with the highest turnout!`;
  }
}

// ===== FORM SUBMIT EVENT =====
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const teamValue = teamSelect.value;
  const teamLabel = teamSelect.options[teamSelect.selectedIndex].text;

  if (!name || !teamValue) return;

  // Increment totals
  totalAttendees++;
  teamCounts[teamValue]++;

  // Add to attendee list
  attendeesList.push({
    name: name,
    teamLabel: teamLabel,
  });

  // Show greeting
  greeting.style.display = "block";
  greeting.classList.add("success-message");
  greeting.textContent = `Welcome ${name}! You’ve joined ${teamLabel}.`;

  updateUI();
  renderAttendeeList();
  saveToStorage();
  checkForWinner();

  // Reset form
  form.reset();
});
