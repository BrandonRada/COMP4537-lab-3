const http = require('http');
const url = require('url');
const path = require('path');
const utils = require('./modules/utils');
const messages = require('./lang/messages/en/user');
const fs = require('fs');
const PORT = 8080;
const FILE_PATH = path.join(__dirname, 'file.txt');

class DateService {
    static getDate() {
        return utils.getDate().toString();
    }
}

class FileService {
    static appendToFile(filePath, text, res) {
        fs.appendFile(filePath, text + '\n', (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error writing to file');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Text written successfully');
            }
        });
    }

    static readFile(filePath, res) {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error reading file');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(data);
            }
        });
    }
}

class Server {
    constructor(port) {
        this.port = port;
    }

    start() {
        const server = http.createServer((req, res) => this.handleRequest(req, res));
        server.listen(this.port, () => {
            console.log(`Server running on port :${this.port}`);
        });
    }

    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const { pathname, query } = parsedUrl;

        if (pathname.startsWith('/COMP4537/labs/3/readFile/')) {
            const fileName = pathname.split('/').pop(); // Extract the file name from URL
            this.handleReadFile(fileName, res);
        } else if (pathname === '/COMP4537/labs/3/writeFile' && query.text) {
            this.handleWriteFile(query.text, res);
        } else if (pathname === '/getDate/' && query.name) {
            this.handleGetDate(query.name, res);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    }

    handleGetDate(name, res) {
        const currentTime = DateService.getDate();
        const message = `<p style="color:blue">Hello ${name}, What a beautiful day! Server current date and time is ${currentTime}</p>`;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(message);
    }

    handleWriteFile(text, res) {
        FileService.appendToFile(FILE_PATH, text, res);
    }

    handleReadFile(fileName, res) {
        const filePath = path.join(__dirname, fileName);

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end(`404 Not Found: ${fileName}`);
            } else {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(data); // Return file content to display in the browser
            }
        });
    }
}

// Start the server
const app = new Server(PORT);
app.start();