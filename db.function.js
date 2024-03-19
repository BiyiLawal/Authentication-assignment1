const fs = require("fs");

function findUser(username, password) {
    const rawText = fs.readFileSync("./db.json", "utf8")
    // console.log("rawText", rawText)
    const users =JSON.parse(rawText)
    return users.find((user) => user.username === username && user.password === password);
}

module.exports = {
    findUser,
}