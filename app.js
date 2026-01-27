const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

function num(id) {
  const v = document.getElementById(id).value;
  return v === "" ? 0 : Number(v);
}

// === ОСНОВНАЯ ЛОГИКА ===
document.getElementById("calcBtn").addEventListener("click", () => {
  const d1 = new Date(document.getElementById("d1").value);
  const d2 = new Date(document.getElementById("d2").value);

  if (isNaN(d1) || isNaN(d2)) {
    tg.showAlert("❌ Укажите корректные даты");
    return;
  }

  const usedWork = num("used_work");
  const usedCal = num("used_cal");
  const usedTotal = usedWork + usedCal;

  const progOld = num("prog_old");
  const progNew = num("prog_new");

  // 🔹 граница периодов
  const border = new Date("2023-04-29");

  // ===== СТАРЫЙ ПЕРИОД =====
  const oldStart = d1;
  const oldEnd = d2 < border ? d2 : border;

  let oldDays = Math.max(0, Math.floor((oldEnd - oldStart) / 86400000));
  oldDays -= progOld;

  let oldMonths = Math.floor(oldDays / 30);
  if (oldDays % 30 >= 15) oldMonths++;

  const oldResult = oldMonths * 1.25;

  // ===== НОВЫЙ ПЕРИОД =====
  const newStart = d1 > border ? d1 : new Date(border.getTime() + 86400000);
  const newEnd = d2;

  let newDays = Math.max(0, Math.floor((newEnd - newStart) / 86400000));
  newDays -= progNew;

  let newMonths = Math.floor(newDays / 30);
  if (newDays % 30 >= 15) newMonths++;

  const newResult = newMonths * 1.75;

  // ===== ИТОГ =====
  const totalAccrued = oldResult + newResult;
  const remaining = totalAccrued - usedTotal;
  const final = Math.ceil(remaining);

  // === ПОКАЗ В MINI APP ===
  const text = `
📅 Период: ${d1.toLocaleDateString()} — ${d2.toLocaleDateString()}

🟤 Старый период:
• Дней стажа: ${oldDays}
• Месяцев: ${oldMonths}
• Начислено: ${oldResult}

🟢 Новый период:
• Дней стажа: ${newDays}
• Месяцев: ${newMonths}
• Начислено: ${newResult}

➖ Использовано: ${usedTotal}

✅ ИТОГО: ${final} дней
`;

  document.getElementById("resultText").textContent = text;
  document.getElementById("result").style.display = "block";

  // === ОТПРАВКА В БОТА ===
  document.getElementById("sendToBotBtn").onclick = () => {
    tg.sendData(JSON.stringify({
      d1: document.getElementById("d1").value,
      d2: document.getElementById("d2").value,
      used_work: usedWork,
      used_cal: usedCal,
      prog_old: progOld,
      prog_new: progNew,
      old: oldResult,
      new: newResult,
      final: final
    }));
    tg.close();
  };
});
