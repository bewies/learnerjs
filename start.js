const Express = require("express");
const Fs = require("fs/promises");
const fs = require("fs");
const path = require("path");
const App = Express();
const Port = 3000;

App.get('/*', async (req, res) => {
    const sysPath = "pages"+req.url;
    if (path.extname(sysPath) === ".json") {
        if (!fs.existsSync(sysPath)) {
            res.status("404").send("Not found!");
        }
        try {
            const jsonObject = JSON.parse(await (await Fs.readFile(sysPath)).toString());
            const htmlPage = populatePageWithJson(jsonObject);
            res.send(htmlPage);
        } catch (e) {
            console.error(e);
            res.send("JSON-Compilation failed");
        }
        return;
    }
    res.sendFile(sysPath, {"root": __dirname});
});

App.listen(Port, () => {
    console.log(`learnerjs listening on port ${Port}`);
});

/**
 * Populates an HTML-Page with the given Data
 * @param {Object} json Die aus der Datei gelesene Daten
 * @returns Populated HTML as a string
 */
function populatePageWithJson(json) {
    const header = `
    <div class="page-header">
        <div class="page-header-left">
            <div class="page-header-img">
                <img src="/assets/JS.png" alt="Logo">
            </div>
            <div class="page-iv-trigger" onclick="iv()">
                <div class="page-iv-trigger-box">
                    <i class="fas fa-bars"></i>
                </div>
            </div>
        </div>
        <div class="page-header-nav">
            <nav>
                <a href="./">Start</a>
            </nav>
        </div>
    </div>`;

    const iv = `
    <div class="iv">
        <div class="iv-close" onclick="iv('close')"><i class="fas fa-times"></i></div>
        <ul class="iv-folders">
            <li>
                <div class="iv-folder active">
                    <a href="">Lernpfad</a>
                    <i class="fas fa-caret-right iv-caret"></i>
                </div>
                <ul class="iv-files">
                    <li>
                        <div class="iv-file active">
                            <i class="fas fa-caret-right iv-caret"></i>
                            <a href="">Willkommen</a>
                        </div>
                        <ul class="iv-anchors">
                            <li><a href="">Selektoren</a></li>
                            <li><a href="">Variablen</a></li>
                            <li><a href="">Funktionen</a></li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li>
                <div class="iv-folder active">
                    <a href="">Erklärungen</a>
                    <i class="fas fa-caret-right iv-caret"></i>
                </div>
                <ul class="iv-files">
                    <li>
                        <div class="iv-file active">
                            <i class="fas fa-caret-right iv-caret"></i>
                            <a href="../../erklaerungen/0/">OOP</a>
                        </div>
                        <ul class="iv-anchors">
                            <li><a href="">Objekte</a></li>
                            <li><a href="">Klassen</a></li>
                            <li><a href="">Vererbung</a></li>
                        </ul>
                    </li>
                    <li>
                        <div class="iv-file active">
                            <i class="fas fa-caret-right iv-caret"></i>
                            <a href="">Datatypes</a>
                        </div>
                        <ul class="iv-anchors">
                            <li><a href="">Zahlen und Strings</a></li>
                            <li><a href="">Listen und Arrays</a></li>
                            <li><a href="">Funktionen</a></li>
                        </ul>
                    </li>
                    <li>
                        <div class="iv-file active">
                            <i class="fas fa-caret-right iv-caret"></i>
                            <a href="">Variablen</a>
                        </div>
                        <ul class="iv-anchors">
                            <li><a href="">Syntax</a></li>
                            <li><a href="">Scope (Kapselung)</a></li>
                        </ul>
                    </li>
                    <li>
                        <div class="iv-file active">
                            <i class="fas fa-caret-right iv-caret"></i>
                            <a href="">Basics</a>
                        </div>
                        <ul class="iv-anchors">
                            <li><a href="">Selektoren</a></li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
    </div>`;

    const scrollBar = `
    <div class="scroll-barcase">
        <div class="scroll-bar"></div>
    </div>`;

    const pageHead = `
    <div class="page-head">
        <div class="page-head-title">${json.head.title}</div>
        <div class="page-head-text">
            ${json.head.text}
        </div>
    </div>`;
    
    const pageFoot = `
    <div class="page-foot">
        <div class="direct-group">
            <div class="direct-left">
                <div class="back-btn btn" href="${json.page.prevPage}">Zurück</div>
            </div>
            <div class="direct-mid">
            </div>
            <div class="direct-right">
                <div class="fore-btn btn" href="${json.page.prevPage}">Weiter</div>
            </div>
        </div>
    </div>`;

    // Generate Chapters
    const chaptersHtml = json.body.map((chapterJson) => {
        // Generate Segments
        const chapterSegHtml = chapterJson.segments.map((segmentJson) => {
            const contentHtml = segmentJson.contents.map((contentJson) => {
                switch (contentJson.type) {
                    case "text": return `<div class="chaper-text-text">${contentJson.text}</div>`;
                    case "code": return `<div class="code"><code>${contentJson.text}</code></div>`;
                    case "imgH": return `
                    <div class="image-h">
                        <div class="image-caption">${contentJson.text}</div>
                        <img src="${contentJson.src}" alt="Fehlermeldung">
                    </div>`;
                    case "imgV": return `
                    <div class="image-v">
                        <div class="image-caption">${contentJson.text}</div>
                        <img src="${contentJson.src}" alt="Fehlermeldung">
                    </div>`;
                    default: return `<div class="chapter-text-error">Unknown Content-Type ${contentJson}</div>`;
                }
            }).join("");

            return `
            <div class="chapter-text ${segmentJson.type? "chapter-"+segmentJson.type : ""}">
                <div class="chapter-text-title">
                    ${segmentJson.title}
                </div>
                ${contentHtml}
            </div>`;
        }).join("");
        return `
        <div class="chapter-intro">
            <div class="chapter-title">
                ${chapterJson.intro.title}
            </div>
            <div class="chapter-descr">
                ${chapterJson.intro.text}
            </div>
        </div>
        ${chapterSegHtml}
        `;
    }).join(`<hr class="chapter-border">`);


    const pageBody = `
    <div class="page-body">
        ${chaptersHtml}
    </div>
    `;

    const head = `
    <script>const content = ${JSON.stringify(json)};</script>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="Benedict Wiesler">
    <meta name="keywords" content="JS Tutorial Einstieg">
    <meta name="description" content="Anfängerfreundliches Tutorial für JS in Bezug auf HTML-Manipulation">

    <link href="/assets/JS.png" type="icon type" rel="icon">
    <link rel="stylesheet" href="/styles/iv.css">
    <link rel="stylesheet" href="/styles/frame.css">
    <link rel="stylesheet" href="/styles/classes.css">
    <link rel="stylesheet" href="/styles/tablet.css" media="screen and (max-width: 950px)">
    <link rel="stylesheet" href="/styles/mobile.css" media="screen and (max-width: 750px)">

    <script src="/scripts/functions.js"></script>
    <script src="/scripts/iv.js"></script>
    <script src="/scripts/font-awesome.js"></script>
    <script src="sketch.js"></script>

    <title>${json.page.title}</title>`;

    const result =
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        ${head}
    </head>
    <body>
        ${header}
        ${iv}
        ${scrollBar}
        <div class="page-wrap">
            <div class="page">
                ${pageHead}
                ${pageFoot}
                ${pageBody}
                ${pageFoot}
            </div>
        </div>
    </body>
    </html>`;


    return result;
}