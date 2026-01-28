// ===== Telegram WebApp init =====
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// ===== Elements =====
const form = document.getElementById("calc-form");
const resultBlock = document.getElementById("result");

// ===== Utils =====
const daysBetween = (a, b) => {
  const ms = b.getTime() - a.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
};

const calcPeriod = (start, end, minusDays, rate) => {
  if (end < start) return {
    days: 0,
    effective: 0,
    months: 0,
    rest: 0,
    roundedMonths: 0,
    result: 0
  };

  const days = daysBetween(start, end);
  const effective = Math.max(days - minusDays, 0);

  const months = Math.floor(effective / 30);
  const rest = effective % 30;
  const roundedMonths = rest >= 15 ? months + 1 : months;
  const result = roundedMonths * rate;

  return {
    days,
    effective,
    months,
    rest,
    roundedMonths,
    result
  };
};

// ===== Submit =====
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // ===== Read inputs =====
  const d1 = new Date(document.getElementById("d1").value);
  const d2 = new Date(document.getElementById("d2").value);

  const usedWork = Number(document.getElementById("used_work").value || 0);
  const usedCal = Number(document.getElementById("used_cal").value || 0);

  const progOld = Number(document.getElementById("prog_old").value || 0);
  const progNew = Number(document.getElementById("prog_new").value || 0);

  const bsOld = Number(document.getElementById("bs_old").value || 0);
  const bsNew = Number(document.getElementById("bs_new").value || 0);

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    alert("Введите корректные даты");
    return;
  }

  // ===== Border date =====
  const border = new Date("2023-04-29");

  // ===== Old period =====
  const oldStart = d1;
  const oldEnd = d2 < border ? d2 : border;

  const oldCalc = calcPeriod(
    oldStart,
    oldEnd,
    progOld + bsOld,
    1.25
  );

  // ===== New period =====
  const newStart =
    d1 > border ? d1 : new Date(border.getTime() + 24 * 60 * 60 * 1000);
  const newEnd = d2;

  const newCalc = calcPeriod(
    newStart,
    newEnd,
    progNew + bsNew,
    1.75
  );

  // ===== Totals =====
  const accruedTotal = oldCalc.result + newCalc.result;
  const usedTotal = usedWork + usedCal;
  const remainder = accruedTotal - usedTotal;
  const finalCompensation = Math.ceil(remainder);

  // ===== Render result =====
  resultBlock.innerHTML = `
    <h3>📊 Результат расчёта</h3>

    <hr>

    <h4>🟤 Старый период</h4>
    <p>Календарные дни: ${oldCalc.days}</p>
    <p>Прогулы + БС: ${progOld + bsOld}</p>
    <p>Эффективные дни: ${oldCalc.effective}</p>
    <p>Месяцы: ${oldCalc.months}</p>
    <p>Остаток: ${oldCalc.rest}</p>
    <p><b>Начислено:</b> ${oldCalc.result.toFixed(1)} дней</p>

    <hr>

    <h4>🟢 Новый период</h4>
    <p>Календарные дни: ${newCalc.days}</p>
    <p>Прогулы + БС: ${progNew + bsNew}</p>
    <p>Эффективные дни: ${newCalc.effective}</p>
    <p>Месяцы: ${newCalc.months}</p>
    <p>Остаток: ${newCalc.rest}</p>
    <p><b>Начислено:</b> ${newCalc.result.toFixed(1)} дней</p>

    <hr>

    <h4>📊 Итог</h4>
    <p>Всего начислено: ${accruedTotal.toFixed(1)}</p>
    <p>Использовано: ${usedTotal}</p>

    <h2>✅ Компенсация: ${finalCompensation} дней</h2>

    <button id="sendToBot" style="margin-top:12px;">📤 Отправить в Telegram</button>
  `;

  resultBlock.style.display = "block";

  // ===== Send to bot =====
  document.getElementById("sendToBot").onclick = () => {
    tg.sendData(JSON.stringify({
      d1: d1.toISOString().slice(0, 10),
      d2: d2.toISOString().slice(0, 10),
      old: oldCalc,
      new: newCalc,
      used_total: usedTotal,
      final: finalCompensation
    }));
    tg.close();
  };
});
