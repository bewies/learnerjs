const Express = require("express");
const Fs = require("fs/promises");
const App = Express();
const Port = 3000;

// TODO Get HTML, CSS, JavaScript from other PC
// TODO Populate static HTML with File data
// TODO Generate HTML, Javascript from JSON

App.get('/*', async (req, res) => {
    res.send(await parseJsonFile(req.url));
});

App.listen(Port, () => {
    console.log(`learnerjs listening on port ${Port}`);
});

/**
 * Parses JSON-Object from file
 * @param {string} path Relative Path to file, must start with "/"
 * @returns Parsed JSON or "File not found"
 */
async function parseJsonFile(path) {
    try {
        const jsonText = await Fs.readFile("pages"+path);
        return JSON.parse(jsonText.toString());
    } catch (e) {
        console.error("File pages/" + path + " not found!");
        return "File not Found";
    }
}