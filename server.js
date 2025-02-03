const http = require('http');
const url = require('url');
const utils = require('./modules/utils');
const messages = require('./lang/messages/en/user');
const fs = require('fs');
const PORT = 8080;
const FILE_PATH = path.join(__dirname, 'file.txt');

// const server = http.createServer((req, res) =>{
//     const parsedURL = url.parse(req.url, true);
//     const pathname = parsedURL.pathname;
//     const query = parsedURL.query;

    
    
//     if(pathname === "/getDate/" && query.name){
//         const serverTime = utils.getDate().toString();
//         const responseMessage = `<p style="color:blue;">${messages.greetingMessage.replace("%1", query.name)} ${serverTime}</p>`;
//         res.writeHead(200, { 'Content-Type': 'text/html' });
//         res.end(responseMessage);
//     } else{
//         res.writeHead(404, {'Content-Type': 'text/plain'});
//         res.end("404 - Not Found");
//     }
// });

// server.listen(PORT, () =>{
//     console.log(`Server running and listening on port ${PORT}`);
// });

// Class to handle file operations (reading and appending)
class FileHandler {
    static appendToFile(text, callback) {
        fs.appendFile(FILE_PATH, text + '\n', (err) => {
            callback(err);
        });
    }

    static readFile(callback) {
        fs.readFile(FILE_PATH, 'utf8', (err, data) => {
            callback(err, data);
        });
    }
}

// Class to handle incoming HTTP requests
class RequestHandler {
    static handleRequest(req, res) {
        const parsedURL = url.parse(req.url, true);
        const pathname = parsedURL.pathname;
        const query = parsedURL.query;

        if (pathname.startsWith('/COMP4537/labs/3/writeFile')) {
            if (query.text) {
                FileHandler.appendToFile(query.text, (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Error writing to file');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end('Text appended successfully');
                    }
                });
            } else {
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Missing text query parameter');
            }
        } 
        else if (pathname.startsWith('/COMP4537/labs/3/readFile')) {
            FileHandler.readFile((err, data) => {
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end(`404 - File not found: ${FILE_PATH}`);
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(data);
                }
            });
        } 
        else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 - Not Found');
        }
    }
}

// Main Server class to create and run the server
class Server {
    constructor(port) {
        this.port = port;
    }

    start() {
        const server = http.createServer(RequestHandler.handleRequest);
        server.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

// Start the server
const myServer = new Server(PORT);
myServer.start();
