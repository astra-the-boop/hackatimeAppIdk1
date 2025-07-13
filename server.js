const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");


dotenv.config();
const app = express();

app.set("view engine", "ejs");
app.use("views", path.join(__dirname), "views");

const getData = async () => {
    try{
        const res = await axios.get(
            "https://hackatime.hackclub.com/api/hackatime/v1",
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(process.env.APIKEY).toString("base64")}`,
                },
            }
        );
    }catch(err){
        console.error(err.message);
        return null;
    }
};

app.get("/", async(req, res) => {
    const data = await getData();
    if (!data) return res.status(500).send("Failed to load HackaTime data :(")
    res.render("index", {waka: data});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`app running on uhhhhhhhhhh localhost:${PORT}`));