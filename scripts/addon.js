const fs = require("fs");

module.exports = {
	src: fs.readdirSync("./src/engine/addon/src").map(s => "src/engine/addon/src/" + s),
}
