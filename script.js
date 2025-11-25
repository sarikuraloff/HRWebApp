const tg = window.Telegram.WebApp;
tg.expand();

console.log("HRWebApp LOADED v1");

// отправка данных в бот
function sendData() {
    const payload = {
        d1: document.getElementById("d1").value.trim(),
        d2: document.getElementById("d2").value.trim(),
        used_work: Number(document.getElementById("used_work").value || 0),
        used_cal: Number(document.getElementById("used_cal").value || 0),
        prog: Number(document.getElementById("prog").value || 0)
    };

    console.log("SEND PAYLOAD:", payload);

    tg.sendData(JSON.stringify(payload));
}

// очистка формы
function clearForm(){
    document.getElementById("d1").value = "";
    document.getElementById("d2").value = "";
    document.getElementById("used_work").value = "";
    document.getElementById("used_cal").value = "";
    document.getElementById("prog").value = "";
}
