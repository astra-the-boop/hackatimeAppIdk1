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
let cachedKey = null;
const userDataDir = !!process.versions.electron ? require("electron").app.getPath("userData") : __dirname;
const keyPath = path.join(userDataDir, "key.txt");
function apiKeyBlegh(){
    if(cachedKey) return cachedKey;
    try{
        const key = fs.readFileSync(keyPath,"utf-8").trim();
        if(!key) throw new Error("gimme api key");
        cachedKey = key;
        return key;
    }catch(err){
        return null;
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

app.use(express.urlencoded({ extended: true }));
app.get("/enter-key", async (req, res) => {
    res.render("gimme");
});
app.post("/save-key", (req, res) => {
    const uneCléEstUnParamètreUtiliséEnEntreéd_uneOpérationCryptographique = req.body.gimme?.trim();
    if(!uneCléEstUnParamètreUtiliséEnEntreéd_uneOpérationCryptographique) return res.status(400).send("no api key");

    fs.writeFileSync(keyPath, uneCléEstUnParamètreUtiliséEnEntreéd_uneOpérationCryptographique, "utf-8");
    cachedKey = uneCléEstUnParamètreUtiliséEnEntreéd_uneOpérationCryptographique;
    res.redirect("/")
});

app.get("/", async(req, res) => {
    const key = apiKeyBlegh();
    if(!key) return res.redirect("/enter-key");
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