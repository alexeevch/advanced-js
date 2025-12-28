'use strict'

function isAdult(dateString, adultAge = 14) {
    const personCurrentDate = new Date(dateString);
    if (Number.isNaN(personCurrentDate.getTime())) {
        throw new Error(`Invalid date: ${dateString}`);
    }

    const personAdultDate = new Date(
        personCurrentDate.getFullYear() + adultAge,
        personCurrentDate.getMonth(),
        personCurrentDate.getDate(),
    );

    return personAdultDate.getTime() <= Date.now();
}
