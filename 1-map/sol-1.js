'use strict';


/*
Пояснение:
map() и find() добавляют дополнительные избыточные итерации, что сильно скажется
на производительности.

Если бы было задание обязательно использовать map и find,
то решение его в файле sol-2.js
*/

const array = [
    {id: 1, name: "Вася"},
    {id: 2, name: "Петя"},
    {id: 1, name: "Вася"}
];
const result = []

const seenIds = new Set();
array.forEach((obj) => {
    if (seenIds.has(obj.id)) return;

    result.push(obj);
    seenIds.add(obj.id);
})
