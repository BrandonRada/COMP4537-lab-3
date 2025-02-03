const http = require('http');
const url = require('url');
const utils = require('./modules/utils');
const messages = require('./lang/messages/en/user');
const PORT = 8080;

const server = http.createServer((req, res) =>{
    const parsedURL = url.parse(req.url, true);
    const pathname = parsedURL.pathname;
    const query = parsedURL.query;

    
    
    if(pathname === "/getDate/" && query.name){
        const serverTime = utils.getDate();
        const responseMessage = `<p style="color:blue;">${messages.greetingMessage.replace("%1", query.name)} ${serverTime}</p>`;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(responseMessage);
    } else{
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end("404 - Not Found");
    }
});

server.listen(PORT, () =>{
    console.log(`Server running and listening on port ${PORT}`);
});
