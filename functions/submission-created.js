const request = require("request");
const { HUBSPOT_KEY, HUBSPOT_PORTAL_ID, HUBSPOT_FORM_ID} = process.env;
const URL = 'https://api.hsforms.com/submissions/v3/integration/submit/' + HUBSPOT_PORTAL_ID + '/' + HUBSPOT_FORM_ID;

exports.handler = function(event, context) {
    const body = JSON.parse(event.body).payload; 
    
    //first let's make sure that no hidden field we've set up is filled in
    let spamField = body.data['header-shameful'] || body.data['footer-shameful'] || body.data.shameful;
    if (spamField || body.data.email == 'email@email.co') {
        return;
    }
    //create our hubspot data
    let formData = {
        "submittedAt": Date.parse(body.created_at),
        "fields": [
            {
                "name": "email",
                "value": body.data.email,
            }
        ],
        "context": {
            "pageUri": body.data.referrer
        }
    };
    console.log("data....");
    console.log(formData);
    request.post({"url": URL,"json": formData}, function(err, httpResponse, body) {
        let msg;

        if (err) {
            msg = "Submission failed: " + err;
            console.log(msg);
        } else {
            msg = "submission succeeded";
            console.log(msg);
            console.log(body);
        }
        return console.log('Complete');
    });
}