const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

let drawing = false;

canvas.addEventListener("mousedown", () => (drawing = true));
canvas.addEventListener("mouseup", () => {
  drawing = false;
  ctx.beginPath();
});
canvas.addEventListener("mouseout", () => (drawing = false));
canvas.addEventListener("mousemove", draw);

function draw(e) {
  if (!drawing) return;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#000";
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

document.getElementById("clearBtn").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById("analyzeBtn").addEventListener("click", async () => {
  const resultBox = document.getElementById("resultBox");
  resultBox.innerText = "Analyzing...";

  const imageData = canvas.toDataURL("image/png");

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imageData })
  });

  const { result } = await response.json();

  try {
    const parsed = JSON.parse(result);
    resultBox.innerHTML = `
      <strong>🧬 Type:</strong> ${parsed.type}<br/>
      <strong>📝 Description:</strong> ${parsed.description}<br/>
      <strong>💖 Personality:</strong> ${parsed.personality}
    `;
  } catch (e) {
    resultBox.innerText = "Oops! Couldn't parse response. Raw reply:\n" + result;
  }
});