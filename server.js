const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");
const ejs = require("ejs");
const fs = require("fs");


dotenv.config();
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

function apiKeyBlegh(){
    const filePath = path.join(__dirname, "key.txt");
    try{
        const key = fs.readFileSync(filePath, "utf-8").trim();
        if(!key)throw new Error("no api key. gib key. (put in key.txt in same directory as app)");
        return key;
    }catch(err){
        console.error('couldnt read key.txt ; please create the file and paste your api key inside');
        process.exit(1);
    }
}

const getData = async () => {
    try{
        const res = await axios.get(
            `https://hackatime.hackclub.com/api/v1/users/my/stats?api_key=${apiKeyBlegh()}&features=projects`,
            {
                headers: {
                    Authorization: `Bearer ${apiKeyBlegh()}`,
                },
            }
        );

        return res.data;
    }catch(err){
        if (err.response){
            console.error("hackatime error ", err.message.status, err.response.data);
        }else{
            console.error("network/api error ", err.message);
        }
        return null;
    }
};

app.get("/", async(req, res) => {
    const data = await getData();
    console.log(data);
    if (!data) return res.status(500).send("Failed to load HackaTime data :(")
    res.render("index", {waka: data.data});
});

app.get("/api/data", async(req, res) => {
    const data = await getData();
    if (!data) return res.status(500).json({error: "failed to fetch the data :("});
    res.json(data.data);
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`app running on uhhhhhhhhhh localhost:${PORT}`));