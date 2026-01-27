// ===== Telegram Mini App init =====
const tg = window.Telegram.WebApp;
tg.expand();

// ===== API URL =====
const API_URL = "https://YOUR_PYTHON_API_URL/calculate";

// ===== Elements =====
const form = document.getElementById("calcForm");
const resultDiv = document.getElementById("result");
const detailsDiv = document.getElementById("details");

// ===== Helpers =====
function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function toNumber(val) {
  if (!val) return 0;
  return Number(val.replace(",", "."));
}

function showError(text) {
  tg.showPopup({
    title: "Ошибка",
    message: text,
    buttons: [{ type: "close" }]
  });
}

// ===== Submit handler =====
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    d1: getValue("d1"),
    d2: getValue("d2"),
    used_work: toNumber(getValue("used_work")),
    used_cal: toNumber(getValue("used_cal")),
    prog_old: toNumber(getValue("prog_old")),
    prog_new: toNumber(getValue("prog_new")),
    bs_old: toNumber(getValue("bs_old")),
    bs_new: toNumber(getValue("bs_new"))
  };

  if (!payload.d1 || !payload.d2) {
    showError("Введите дату приёма и дату увольнения");
    return;
  }

  resultDiv.classList.add("hidden");
  detailsDiv.classList.add("hidden");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Ошибка сервера");
    }

    const data = await response.json();

    renderResult(data);
    renderDetails(data);

    tg.HapticFeedback.notificationOccurred("success");
  } catch (err) {
    console.error(err);
    showError("Не удалось выполнить расчёт. Попробуйте позже.");
    tg.HapticFeedback.notificationOccurred("error");
  }
});

// ===== Render result =====
function renderResult(data) {
  resultDiv.classList.remove("hidden");

  resultDiv.innerHTML = `
    <div class="result-main">
      <strong>КОМПЕНСАЦИЯ: ${data.final} дней</strong>
    </div>
    <div class="result-sub">
      Начислено: ${data.total_accrued} дней<br>
      Использовано: ${data.used_total} дней
    </div>
  `;
}

// ===== Render detailed breakdown =====
function renderDetails(data) {
  detailsDiv.classList.remove("hidden");

  detailsDiv.innerHTML = `
    <h3>🟤 Старый период</h3>
    ${data.old.start} – ${data.old.end}<br>
    Календарные дни: ${data.old.calendar_days}<br>
    Прогулы: ${data.old.prog}<br>
    Эффективные дни: ${data.old.effective_days}<br>
    Месяцы: ${data.old.months_raw} (остаток ${data.old.rest_days})<br>
    Округление: ${data.old.months_rounded}<br>
    Начисление: ${data.old.months_rounded} × ${data.old.rate}
    = <b>${data.old.result}</b>

    <div class="sep"></div>

    <h3>🟢 Новый период</h3>
    ${data.new.start} – ${data.new.end}<br>
    Календарные дни: ${data.new.calendar_days}<br>
    Прогулы: ${data.new.prog}<br>
    Эффективные дни: ${data.new.effective_days}<br>
    Месяцы: ${data.new.months_raw} (остаток ${data.new.rest_days})<br>
    Округление: ${data.new.months_rounded}<br>
    Начисление: ${data.new.months_rounded} × ${data.new.rate}
    = <b>${data.new.result}</b>

    <div class="sep"></div>

    <h3>📊 Итог</h3>
    ${data.old.result} + ${data.new.result} = ${data.total_accrued}<br>
    − использовано ${data.used_total}<br>
    → <b>${data.final} дней</b>
  `;
}
