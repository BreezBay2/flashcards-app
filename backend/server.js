import express from "express";

const app = express();
const PORT = 8000;

app.use("/", async (req, res) => {
    res.send("Hello World");
});

app.listen(PORT, () => {
    console.log("Server up and running on ", PORT);
});
