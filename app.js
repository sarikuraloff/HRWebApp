const tg = window.Telegram.WebApp;
tg.expand();

function sendData() {
  const payload = {
    d1: document.getElementById("d1").value,
    d2: document.getElementById("d2").value,
    used_work: Number(document.getElementById("used_work").value),
    used_cal: Number(document.getElementById("used_cal").value),
    prog_old: Number(document.getElementById("prog_old").value),
    prog_new: Number(document.getElementById("prog_new").value),
    bs_old: Number(document.getElementById("bs_old").value),
    bs_new: Number(document.getElementById("bs_new").value),
  };

  tg.sendData(JSON.stringify(payload));
  tg.close();
}
