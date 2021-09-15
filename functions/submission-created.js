const request = require("request");

exports.handler = function(event, context) {
    const body = JSON.parse(event.body).payload; 
    console.log(body);  
};