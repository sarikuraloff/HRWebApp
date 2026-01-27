const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const form = document.getElementById("calc-form");
const resultDiv = document.getElementById("result");

function num(id) {
  return Number(document.getElementById(id).value || 0);
}

function daysBetween(d1, d2) {
  return Math.floor((new Date(d2) - new Date(d1)) / (1000 * 60 * 60 * 24));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const d1 = document.getElementById("d1").value;
  const d2 = document.getElementById("d2").value;

  if (!d1 || !d2) {
    tg.showAlert("❌ Укажите даты");
    return;
  }

  // граница периодов
  const border = "2023-04-29";

  // дни стажа
  const oldDays = Math.max(
    0,
    daysBetween(d1, Math.min(d2, border))
  );
  const newDays = Math.max(
    0,
    daysBetween(Math.max(d1, border), d2)
  );

  // прогулы
  const effOld = oldDays - num("prog_old");
  const effNew = newDays - num("prog_new");

  // месяцы
  const oldMonths = Math.ceil(effOld / 30);
  const newMonths = Math.floor(effNew / 30);

  // начисления
  const oldRes = oldMonths * 1.25;
  const newRes = newMonths * 1.75;

  const usedTotal = num("used_work") + num("used_cal");
  const total = oldRes + newRes;
  const final = Math.round(total - usedTotal);

  // показать результат
  resultDiv.style.display = "block";
  resultDiv.innerHTML = `
    <b>📊 Результат</b><br><br>

    🟤 Старый период: <b>${oldRes.toFixed(1)}</b><br>
    🟢 Новый период: <b>${newRes.toFixed(1)}</b><br>
    ➖ Использовано: <b>${usedTotal}</b><br>
    <hr>
    ✅ <b>Компенсация: ${final} дней</b><br><br>

    <button id="sendBtn">📤 Отправить в Telegram</button>
  `;

  // отправка в бот
  document.getElementById("sendBtn").onclick = () => {
    tg.sendData(JSON.stringify({
      d1, d2,
      oldRes, newRes,
      usedTotal,
      final
    }));
    tg.close();
  };
});
