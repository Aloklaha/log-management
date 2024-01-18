const express = require('express');
const app = express();
const fs = require('fs');

const PORT = 4050;
app.use(express.json())

app.post("/create-logs", async(req, res) => {
    // This API will payload and log in the file

    if(reqValidator(req.body.data)){
        let date = new Date();
        let today = date.getFullYear()+"-"+date.getMonth()+1+"-"+date.getDate();
        let time = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
        const filePath = `/log/${today}|${req.body.data.orgCode}|${req.body.data.module}.log`;

        // Append new content to the file
        fs.appendFileSync(__dirname+filePath, `[${time}]: `+"'"+JSON.stringify(req.body.data)+"'"+'\n\n', 'utf8');

        return res.status(200).json({message: "Success", body: req.body.data})   
    }
    else
    return res.status(400).json({message: "Failed", body: req.body.data})   

});

app.get("/", (req, res)=>{
    return res.status(200).json({message: "Ec2 instance running"})
})

// Validate request parameters
const reqValidator = (body) => {
    return ((body.orgCode !== null && body.orgCode !== undefined && body.orgCode !== "") && (body.module !== null && body.module !== undefined && body.module !== "")) ? true : false;
}


app.listen(PORT || 3000, ()=>{
    console.log("EC2 server listening on port: ", PORT);
})