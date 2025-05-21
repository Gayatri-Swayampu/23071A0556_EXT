const http = require('http');
const os = require('os');
const path = require('path');
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

myEmitter.on('userAccessed', (url) => {
    console.log(`🔔 Event: User accessed ${url}`);
});

const getSystemInfo = () => ({
    Hostname: os.hostname(),
    Platform: os.platform(),
    Architecture: os.arch(),
    CPU_Cores: os.cpus().length,
    Uptime: `${Math.round(os.uptime() / 60)} minutes`,
    Free_Memory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`,
    Total_Memory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
});

const getPathInfo = () => {
    const filePath = path.join(__dirname, 'server.js');
    return {
        Full_Path: filePath,
        File_Name: path.basename(filePath),
        Extension: path.extname(filePath),
    };
};

const toHTMLTable = (dataObj, title) => {
    const rows = Object.entries(dataObj)
        .map(([key, value]) => `<tr><td>${key}</td><td>${value}</td></tr>`)
        .join('\n');
    return `
    <html>
        <head>
            <title>${title}</title>
            <style> 
                body { 
                    font-family: Arial, sans-serif; 
                    padding: 20px; 
                    background: #f5f7fa;
                }
                h1 {
                    color: #2c3e50;
                }
                table { 
                    width: 60%;
                    border-collapse: collapse; 
                    margin-top: 20px;
                }
                td { 
                    border: 1px solid #ddd; 
                    padding: 10px; 
                }
                tr:nth-child(even) { 
                    background-color: #f2f2f2; 
                }
            </style>
        </head>
        <body>
            <h1>${title}</h1>
            <table>${rows}</table>
            <br><a href="/">⬅ Back to Home</a>
        </body>
    </html>
    `;
};

const getHomePage = () => `
<html>
    <head>
        <title>Node.js Server Home</title>
        <style>
            body {
                font-family: Arial, sans-serif; text-align: center;
                padding: 50px;
                background: linear-gradient(to right, #6dd5ed,rgb(33, 135, 176)); 
                color: white;
            }
            .links {
                margin-top: 30px;
            }
            a {
                display: inline-block; 
                margin: 10px; 
                padding: 12px 25px; 
                background: #ffffff; 
                color:rgb(59, 168, 196);
                border-radius: 6px; 
                text-decoration: none; 
                font-weight: bold;
                transition: background 0.3s;
            }
            a:hover {
                background: #eeeeee;
            }
        </style>
    </head>
    <body>
        <h1> Welcome to Your Custom Node.js Server</h1>
        <p>Explore system info, path details, and events using the links below.</p>
        <div class="links">
            <a href="/os">View OS Info</a>
            <a href="/path">View Path Info</a>
        </div>
    </body>
</html>
`;

const server = http.createServer((req, res) => {
    const url = req.url;
    myEmitter.emit('userAccessed', url);

    if (url === '/favicon.ico') {
        res.writeHead(204); 
        return res.end();
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });

    switch (url) {
        case '/':
            res.end(getHomePage());
            return;

        case '/os':
            res.end(toHTMLTable(getSystemInfo(), 'System Info'));
            return;

        case '/path':
            res.end(toHTMLTable(getPathInfo(), 'File Path Info'));
            return;

        default:
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(
                `<h1>404 - Page Not Found</h1>
                <p><a href="/">Go Home</a></p>`
            );
            return;
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
