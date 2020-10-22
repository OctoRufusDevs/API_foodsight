const tools = {};

tools.verifyTypeNumber = (...nums) => {
    const auxArr = nums.map(num => isNaN(parseInt(num)));
    return !auxArr.some(element => element === true);
}

module.exports = tools;