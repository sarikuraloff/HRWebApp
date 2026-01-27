// ================================
// Telegram Mini App init
// ================================
const tg = window.Telegram.WebApp;

// Сообщаем Telegram, что Mini App готов
tg.ready();

// (необязательно, но красиво)
tg.expand();

// ================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ================================

// Отправка данных в бота
function sendToBot(data) {
  tg.sendData(JSON.stringify(data));
}

// Получение значения input по id
function val(id) {
  return document.getElementById(id)?.value || "";
}

// ================================
// ОСНОВНАЯ ЛОГИКА
// ================================

// Кнопка "Рассчитать"
document.getElementById("calcBtn")?.addEventListener("click", () => {
  // Собираем данные из формы
  const payload = {
    type: "calc_request",

    d1: val("d1"),              // дата приёма
    d2: val("d2"),              // дата увольнения

    used_work: Number(val("used_work") || 0),
    used_cal: Number(val("used_cal") || 0),

    prog_old: Number(val("prog_old") || 0),
    prog_new: Number(val("prog_new") || 0),

    bs_old: Number(val("bs_old") || 0),
    bs_new: Number(val("bs_new") || 0),
  };

  // Простая проверка
  if (!payload.d1 || !payload.d2) {
    alert("Введите дату приёма и дату увольнения");
    return;
  }

  // Отправляем данные боту
  sendToBot(payload);

  // Можно закрыть Mini App
  tg.close();
});

// ================================
// ДЛЯ ОТЛАДКИ (необязательно)
// ================================
console.log("HRmini Mini App loaded");

