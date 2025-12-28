'use strict';

const array = [
    {id: 1, name: "Вася"},
    {id: 2, name: "Петя"},
    {id: 1, name: "Вася"}
];
const result = []


const uniqIdsSet = new Set(array.map(({id}) => id))

uniqIdsSet.forEach((id) => result.push(array.find((obj) => id === obj.id)))
