let ctx = document.getElementById("expenseChart").getContext("2d");

let chart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: ["Food", "Travel", "Bills"],
    datasets: [
      {
        data: [500, 200, 300],
      },
    ],
  },
  options: {
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  },
});
