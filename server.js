const http = require('http');
const url = require('url');
const utils = require('./modules/utils');
const messages = require('./lang/messages/en/user');
const PORT = 8080;

http.createServer(function (req, res){
    const parsedURL = url.parse(req.url, true);
    const pathname = parsedURL.pathname;
    const query = parsedURL.query;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    
    if(pathname === "/getDate" && query.name){
        const serverTime = utils.getDate();
        const responseMessage = `<p style="color:blue;">${messages.greetingMessage.replace("%1", query.name)} ${serverTime}</p>`;
        res.end(responseMessage);
    } else{
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end("<p style='color:red;'> 404 - Not Found</p>");
    }
}).listen(PORT);
console.log(`Server running and listening on port ${PORT}`);