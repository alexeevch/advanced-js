/*
 Вывод в формате: 11 месяцев, 25 дней, 10 часов, 33 минуты и 8 секунд.

 Преимущества перед обычным таймером до Нового года:
 1. Можно использовать для любых дат;
 2. Нет ограничений в форматировании, можно получить объект
 getRemaining() и использовать данные по своему усмотрению;
 3. Настраиваемый вывод в нужный DOM узел;
 4. Используется интернализация списков и pluralize;
 5. Если дата наступила, не выведутся отрицательные значения.
  */

"use strict"

document.addEventListener("DOMContentLoaded", function () {
    const timer = new DateTimerView("01-01-2027 00:00:00", {
        selector: "#timer",
    });

    timer.start();
})

class DateTimerView {
    _diff = null;
    _element = null;
    _options = {};

    constructor(endDateString, options) {
        const defaultOptions = {
            selector: null,
            locale: "ru-RU",
            units: {
                year: ["год", "года", "лет"],
                month: ["месяц", "месяца", "месяцев"],
                day: ["день", "дня", "дней"],
                hour: ["час", "часа", "часов"],
                minute: ["минута", "минуты", "минут"],
                second: ["секунда", "секунды", "секунд"]
            }
        }

        this._options = {...defaultOptions, ...options};
        this._element = this.#findElement(this._options.selector);
        this._diff = new CalendarDiff(endDateString);
        this._pluralRules = new Intl.PluralRules(this._options.locale);
        this._listFormat = new Intl.ListFormat(this._options.locale, {type: "conjunction"});
    }

    start(interval = 1000) {
        this.#render();

        this.timer = setInterval(() => {
            const remaining = this._diff.getRemaining();
            if (Object.values(remaining).every(v => v === 0)) {
                clearInterval(this.timer);
            }
            this.#render();
        }, interval);
    }

    #render() {
        const remaining = this._diff.getRemaining();
        this._element.textContent = this.#format(remaining);
    }


    #format(data) {
        const entries = Object.entries(data);
        const firstNonZero = entries.findIndex(([, v]) => v > 0);
        const visible = firstNonZero === -1
            ? entries.slice(-1)
            : entries.slice(firstNonZero);

        const parts = visible.map(([unit, value]) =>
            `${value} ${this.#pluralize(value, this._options.units[unit])}`
        );

        return this._listFormat.format(parts);
    }

    #pluralize(value, forms) {
        const rule = this._pluralRules.select(value);
        return rule === "one" ? forms[0] : rule === "few" ? forms[1] : forms[2];
    }

    #findElement(selector) {
        const element = document.querySelector(selector);

        if (!element) {
            throw new Error(`Could not find element: ${selector}`);
        }

        return element;
    }
}

class CalendarDiff {
    _endDate = null;

    constructor(dateString) {
        this.#setEndDate(dateString);
    }

    getRemaining(from = new Date()) {
        const to = this._endDate;

        const diff = {
            year: 0,
            month: 0,
            day: 0,
            hour: 0,
            minute: 0,
            second: 0,
        };

        if (to <= from) {
            return diff;
        }

        let cursor = new Date(from);

        // years
        while (true) {
            const next = new Date(cursor);
            next.setFullYear(next.getFullYear() + 1);
            if (next <= to) {
                cursor = next;
                diff.year++;
            } else break;
        }

        // months
        while (true) {
            const next = new Date(cursor);
            next.setMonth(next.getMonth() + 1);
            if (next <= to) {
                cursor = next;
                diff.month++;
            } else break;
        }

        // days
        while (true) {
            const next = new Date(cursor);
            next.setDate(next.getDate() + 1);
            if (next <= to) {
                cursor = next;
                diff.day++;
            } else break;
        }

        let rest = to - cursor;

        diff.hour = Math.floor(rest / 3_600_000);
        rest %= 3_600_000;

        diff.minute = Math.floor(rest / 60_000);
        rest %= 60_000;

        diff.second = Math.floor(rest / 1_000);

        return diff;
    }

    #setEndDate(dateString) {
        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            throw new Error(`Invalid date: ${dateString}`);
        }

        this._endDate = date;
    }
}
