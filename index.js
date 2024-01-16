const express = require('express');
const app = express();
const fs = require('fs');
const {v4} = require("uuid")

const PORT = 3000;
app.use(express.json())

app.post("/create-logs", async(req, res) => {
    // This API will accept the required parameter to create log files within a specific directory.
    // Directory structure will be date-> org_name -> module.log
    // file names will be date|org_name|module.log

    if(reqValidator(req.body)){
        let data = {
            "id": v4(),
            "type": req.body.type,
            "desc": "Collected $10 from Brian Debes for Kick Boxing from Card",
            "service": "payment_initiate",
            "module": req.body.module,
            "orgCode": req.body.orgCode,
            "createdBy": "brian",
            "data": {
              "request": {}, // Request body of the service
              "response": {} // Response from the service
            }
          }

        // Now we need to check wheather this file exists or not. If not then create or update the content
        let date = new Date();
        let today = date.getFullYear()+"-"+date.getMonth()+1+"-"+date.getDate();
        let time = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
        const filePath = `/log/${today}|${req.body.orgCode}|${req.body.module}.log`;

        // Append new content to the file
        fs.appendFileSync(__dirname+filePath, `[${time}]: `+"'"+JSON.stringify(data)+"'"+'\n\n', 'utf8');

        return res.status(200).json({message: "Success", body: req.body})   
    }
    else
    return res.status(400).json({message: "Failed", body: req.body})   

});

// Validate request parameters
const reqValidator = (body) => {
    return body !== null ? true : false;
}


app.listen(PORT || 3000, ()=>{
    console.log("EC2 server listening on port: ", PORT);
})