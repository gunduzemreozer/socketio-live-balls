const intToHex = number => {
    let hex = number.toString('16');
    return hex.length === 1 ? `0${hex}` : hex;
}

const getRandomColor = () => {
    const red = intToHex(Math.floor(Math.random() * 256));
    const green = intToHex(Math.floor(Math.random() * 256));
    const blue = intToHex(Math.floor(Math.random() * 256));

    return `#${red}${green}${blue}`
};

module.exports = getRandomColor;