import express from "express";
import cors from "cors";
import http from "http";

const app = express();

app.use(cors())
app.use(express.json())

app.get("/", (_req, res) => {
    res.send("Dungeon Master API running.....")
})

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

server.on("error", (error) => {
    console.error("Failed to start server", error)
})

