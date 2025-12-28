'use strict'

const DICE_TYPES = new Map([
    ["d4", 4],
    ["d6", 6],
    ["d8", 8],
    ["d10", 10],
    ["d12", 12],
    ["d16", 16],
    ["d20", 20],
]);

function rollDice(type) {
    const currentType = DICE_TYPES.get(type);
    if (!currentType) {
        return "Такого типа кубика не существует."
    }

    return Math.floor(Math.random() * currentType + 1);
}
