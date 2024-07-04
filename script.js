'use strict';
const rowRange = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const $tickets = document.querySelector('.tickets');
let ticketsData = [];

document.getElementById('ticketCount').addEventListener('input', ({target}) => {
    target.setCustomValidity('');

    let count = Number(target.value);

    if (!count || !Number.isFinite(count) || count > 100) {
        target.setCustomValidity('Enter a value between 1 and 100');
        target.reportValidity();
        return;
    }

    const tickets = [];

    for (let i = 1; i <= count; ++i) {
        const div = document.createElement('div');
        div.classList.add('ticket');

        const title = document.createElement('h3');
        title.textContent = `Ticket Number: ${i}`;
        div.appendChild(title);

        div.appendChild(generateTicket(i));

        tickets.push(div);
    }

    $tickets.innerHTML = '';
    $tickets.append(...tickets);

    ticketsData = tickets;
});

document.getElementById('shuffleButton').addEventListener('click', () => {
    ticketsData.forEach((ticket, index) => {
        const tambola = ticket.querySelector('.tambola');
        tambola.innerHTML = '';
        const newTicket = generateTicket(index + 1);
        tambola.append(...newTicket.childNodes);
    });
});

document.getElementById('print-button').addEventListener('click', () => {
    window.print();
});

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function cell(content) {
    const el = document.createElement('div');
    el.classList.add('number');
    el.textContent = content;

    return el;
}

function generateShuffledColumn(columnNumber) {
    const range = Array.from({ length: columnNumber < 8 ? 9 : 10 }, (_, i) => (columnNumber * 10) + i + 1);
    const column = shuffle(range).slice(0, 3).sort();

    return column;
}

function generateTicket(ticketNumber) {
    const tambola = document.createElement('div');
    tambola.classList.add('tambola');
    const numbers = [];
    const rows = Array.from({ length: 3 }, _ => shuffle(rowRange.slice(0)).slice(0, 5)).map(r => r.sort());
    const columns = Array.from({ length: 9 }, (_, i) => generateShuffledColumn(i));

    let i = 0;
    const absentColumns = [];
    const allColumns = rows.slice(0, 2).flat();
    rowRange.forEach(c => {
        if (allColumns.includes(c) === false) {
            absentColumns.push(c);
        }
    });

    rows[2].unshift(...absentColumns);
    rows[2] = rows[2].filter((n, i) => rows[2].indexOf(n) === i).slice(0, 5).sort();

    for (let r = 0; r < 3; ++r) {
        for (let c = 1; c <= 9; ++c) {
            numbers[i] = rows[r].includes(c) ? cell(columns[c - 1].shift()) : cell('');
            ++i;
        }
    }
    tambola.append(...numbers);

    return tambola;
}

const event = new KeyboardEvent('input', {bubbles: true, cancelable: true});
document.getElementById('ticketCount').dispatchEvent(event);
