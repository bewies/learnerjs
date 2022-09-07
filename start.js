const Express = require("express");
const Fs = require("fs/promises");
const fs = require("fs");
const path = require("path");
const App = Express();
const Port = 3000;
const Layout = JSON.parse(fs.readFileSync("layout.json"));

App.get('/*', async (req, res) => {
    const sysPath = "pages" + req.url;
    if (path.extname(sysPath) === ".json") {
        if (!fs.existsSync(sysPath)) {
            res.status("404").send("Not found!");
        }
        try {
            const jsonObject = JSON.parse((await Fs.readFile(sysPath)).toString());
            const htmlPage = populatePageWithJson(jsonObject);
            res.send(htmlPage);
        } catch (e) {
            console.error(e);
            res.send("JSON-Compilation failed");
        }
        return;
    }
    res.sendFile(sysPath, { "root": __dirname });
});

App.listen(Port, () => {
    console.log(`learnerjs listening on port ${Port}`);
});


function generateHTMLFromContentObject(content) {
    if (!(content["type"] in Layout.components)) {
        throw {
            "message": `Unknown type ${content.type}!`,
            "contentObj": content
        };
    }

    // Über alle Layout-Parts des Typs
    return Layout.components[content.type].map(
        (layoutPart) => generatePart(layoutPart, content)
    ).join("");
}

function generatePart(layoutPart, content) {
    // Strings will just be inserted
    if (typeof layoutPart === "string") return layoutPart;
    if (!(layoutPart instanceof Object)) {
        throw "Part must be an object, but was " + layoutPart;
    }
    
    // Arrays will be joined using the separator
    if (layoutPart.array) {
        return content[layoutPart.keyname].map(
            (newContent) => {
                return typeof newContent === "string"? newContent : generateHTMLFromContentObject(newContent);
            }
        ).join(layoutPart.separator);
    }
    const newContent = content[layoutPart.keyname];
    return typeof newContent === "string"? newContent : generateHTMLFromContentObject(newContent);
}

function populatePageWithJson(json) {
    const styles = Layout.styles.map(
        (styleObj) => {
            const media = styleObj.media? `media="${styleObj.media}"` : "";
            return `<link rel="stylesheet" href="${styleObj.src}" ${media}>`;
        }).join("");

    const scripts = Layout.scripts.map(
            (scriptObj) => {
                return `<script src="${scriptObj.src}"></script>`;
            }).join("");
    
    const head = `
    <script>const content = ${JSON.stringify(json)};</script>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="Benedict Wiesler">
    <meta name="description" content="${Layout.name}">

    <link href="${Layout.icon}" type="icon type" rel="icon">
    ${styles}
    ${scripts}

    <title>${json.page.title}</title>`;

    const contents = json.contents.map(
        (contentObj) => generateHTMLFromContentObject(contentObj)
    ).join("");

    
    return `<!DOCTYPE html>
            <html lang="en">
                <head>
                    ${head}
                </head>
                <body>
                    ${contents}
                </body>
            </html>`;
}