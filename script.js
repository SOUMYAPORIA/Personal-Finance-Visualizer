const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("transactionList");

let transactions = JSON.parse(localStorage.getItem("financeData")) || [];

// ===== Pie Chart Setup =====
const pieCtx = document.getElementById("pieChart");
let pieChart = new Chart(pieCtx, {
  type: "pie",
  data: {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [0, 0],
      },
    ],
  },
});

// ===== Bar Chart Setup =====
const barCtx = document.getElementById("barChart");
let barChart = new Chart(barCtx, {
  type: "bar",
  data: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Amount (₹)",
        data: Array(12).fill(0),
      },
    ],
  },
});

// ===== Render List =====
function renderList() {
  list.innerHTML = "";
  transactions.forEach((t, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${t.title} - ₹${t.amount} (${t.type})</span>
      <span class="delete" onclick="deleteItem(${index})">❌</span>`;
    list.appendChild(li);
  });
}

function deleteItem(index) {
  transactions.splice(index, 1);
  update();
}

// ===== Update Charts =====
function updateCharts() {
  let income = 0,
    expense = 0;
  let monthly = Array(12).fill(0);

  transactions.forEach((t) => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;

    monthly[new Date(t.date).getMonth()] +=
      t.amount * (t.type === "income" ? 1 : -1);
  });

  pieChart.data.datasets[0].data = [income, expense];
  pieChart.update();

  barChart.data.datasets[0].data = monthly;
  barChart.update();
}

// ===== Add Transaction =====
addBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);

  if (!title || !amount) return alert("Please fill all fields.");

  const transaction = {
    title,
    amount,
    type: typeInput.value,
    date: new Date(),
  };

  transactions.push(transaction);
  update();

  titleInput.value = "";
  amountInput.value = "";
});

// ===== Update Everything =====
function update() {
  localStorage.setItem("financeData", JSON.stringify(transactions));
  renderList();
  updateCharts();
}

// Initial load
update();

// DARK MODE TOGGLE
const toggleBtn = document.getElementById("darkToggle");

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    // change icon
    toggleBtn.textContent = 
        document.body.classList.contains("dark") ? "☀️" : "🌙";

    // save mode to local storage
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggleBtn.textContent = "☀️";
}


function exportPDF() {
  let doc = new jsPDF();
  doc.text("Expense Report", 10, 10);
  doc.save("expenses.pdf");
}

document
  .getElementById("filterCategory")
  .addEventListener("change", function () {
    let selected = this.value;
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    let filtered =
      selected === "all"
        ? expenses
        : expenses.filter((exp) => exp.category === selected);

    renderExpenses(filtered);
  });

  