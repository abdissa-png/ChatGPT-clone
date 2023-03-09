const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
dotenv.config();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration);
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", express.static(path.resolve(__dirname, "views")))
app.use("/style.css", express.static(path.resolve(__dirname, "style.css")))
app.use("/index.js", express.static(path.resolve(__dirname, "index.js")))
app.use("/public", express.static(path.resolve(__dirname, "public")));
app.use("/assets", express.static(path.resolve(__dirname, "assets")));
/*
app.get('/', async(req, res) => {
    res.status(200).send({
        message: "hello from the clone"
    })
});
*/
app.post('/', async(req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0.7,
            max_tokens: 4000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
            stop: ["\"\"\""],
        })
        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        //console.log(error);
        res.status(500).send(error.message)
    }
})

app.listen(5000, () => {
    console.log("server is running on http://localhost:5000");
})