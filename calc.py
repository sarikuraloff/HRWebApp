from datetime import date, datetime, timedelta
import math

# ===== КОНСТАНТЫ =====
OLD_BORDER = date(2023, 4, 29)
OLD_RATE = 1.25
NEW_RATE = 1.75
MONTH_DAYS = 30


# ===== УТИЛИТА =====
def to_date(d):
    """Гарантирует datetime.date"""
    if isinstance(d, date):
        return d
    if isinstance(d, str):
        return datetime.strptime(d, "%d.%m.%Y").date()
    raise TypeError(f"Unsupported date type: {type(d)}")


def days_between(d1: date, d2: date) -> int:
    return (d2 - d1).days + 1


def calc_period(start: date, end: date, skip_days: int, rate: float):
    days_total = days_between(start, end)
    days_effective = max(0, days_total - skip_days)

    months_raw = days_effective // MONTH_DAYS
    days_rest = days_effective % MONTH_DAYS

    months_rounded = months_raw + (1 if days_rest >= 15 else 0)
    result = months_rounded * rate

    return {
        "period": f"{start.strftime('%d.%m.%Y')} – {end.strftime('%d.%m.%Y')}",
        "days_total": days_total,
        "days_effective": days_effective,
        "months_raw": months_raw,
        "days_rest": days_rest,
        "months_rounded": months_rounded,
        "rate": rate,
        "result": result,
    }


def calculate_compensation(
    d1,
    d2,
    used_old: float,
    used_new: float,
    prog_old: int,
    prog_new: int,
    bs_old: int,
    bs_new: int,
):
    # ✅ ПРИВОДИМ ДАТЫ
    d1 = to_date(d1)
    d2 = to_date(d2)

    border_date = OLD_BORDER

    # ===== СТАРЫЙ ПЕРИОД =====
    old_start = d1
    old_end = min(d2, border_date)

    if old_start <= old_end:
        old = calc_period(
            start=old_start,
            end=old_end,
            skip_days=prog_old + bs_old,
            rate=OLD_RATE,
        )
    else:
        old = {
            "period": "—",
            "days_total": 0,
            "days_effective": 0,
            "months_raw": 0,
            "days_rest": 0,
            "months_rounded": 0,
            "rate": OLD_RATE,
            "result": 0.0,
        }

    # ===== НОВЫЙ ПЕРИОД =====
    new_start = max(d1, border_date + timedelta(days=1))
    new_end = d2

    if new_start <= new_end:
        new = calc_period(
            start=new_start,
            end=new_end,
            skip_days=prog_new + bs_new,
            rate=NEW_RATE,
        )
    else:
        new = {
            "period": "—",
            "days_total": 0,
            "days_effective": 0,
            "months_raw": 0,
            "days_rest": 0,
            "months_rounded": 0,
            "rate": NEW_RATE,
            "result": 0.0,
        }

    # ===== ИТОГИ =====
    total_accrued = old["result"] + new["result"]
    used_total = used_old + used_new
    before_round = total_accrued - used_total
    final = math.ceil(before_round) if before_round > 0 else 0

    return {
        "border_date": border_date.strftime("%d.%m.%Y"),
        "old": old,
        "new": new,
        "total_accrued": total_accrued,
        "used_total": used_total,
        "before_round": before_round,
        "final": final,
    }
