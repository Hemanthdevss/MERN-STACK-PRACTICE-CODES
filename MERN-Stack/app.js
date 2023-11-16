const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());

let database = null;
const dbPath = path.join(__dirname, "cricketTeam.db");

const initializeDbAndServer = async () => {
    try {
        database = await open({
            filename: dbPath, 
            driver: sqlite3.Database,
        });

        app.listen(5000, () => {
            console.log("Server running at https://localhost");
        });
    } catch (error) {
        console.log(`DBaseError ${error.message}`);
        process.exit(1);
    }
};

initializeDbAndServer();

const resObject = (eachItem) => {
    return {
        playerId: eachItem.player_id,
        playerName: eachItem.player_name,
        jerseyNumber: eachItem.jersey_number,
        role: eachItem.role,
    };
};

app.get("/players/", async (request, response) => {
    try {
        const getPlayersQuery = `SELECT * FROM cricket_team;`;
        const playersArray = await database.all(getPlayersQuery);
        response.send(playersArray.map((eachItem) => resObject(eachItem)));
    } catch (error) {
        response.status(500).send("Internal Server Error");
    }
});

app.post("/players/", async (request, response) => {
    try {
        const { playerName, jerseyNumber, role } = request.body;
        const postPlayerArray = `INSERT INTO cricket_team (player_name,jersey_number,role) VALUES ("${playerName}", ${jerseyNumber}, "${role}")`;
        await database.run(postPlayerArray);
        response.send("Player Added to Team");
    } catch (error) {
        response.status(500).send("Internal Server Error");
    }
});

app.get("/players/:playerId/", async (request, response) => {
    try {
        const { playerId } = request.params;
        const player = `SELECT * FROM cricket_team WHERE player_id = ${playerId}`;
        const particularPlayer = await database.get(player);
        if (!particularPlayer) {
            response.status(404).send("Player not found");
            return;
        }
        response.send(resObject(particularPlayer));
    } catch (error) {
        response.status(500).send("Internal Server Error");
    }
});

app.put("/players/:playerId/", async (request, response) => {
    try {
        const { playerId } = request.params;
        const { playerName, jerseyNumber, role } = request.body;
        const updatePlayerDetails = `UPDATE cricket_team SET player_name = "${playerName}", jersey_number = ${jerseyNumber}, role = "${role}" WHERE player_id = ${playerId}`;
        await database.run(updatePlayerDetails);
        response.send("Player Details Updated");
    } catch (error) {
        response.status(500).send("Internal Server Error");
    }
});

app.delete("/players/:playerId", async (request, response) => {
    try {
        const { playerId } = request.params;
        const deleteAPlayer = `DELETE FROM cricket_team WHERE player_id = ${playerId}`;
        await database.run(deleteAPlayer);
        response.send("Player Removed");
    } catch (error) {
        response.status(500).send("Internal Server Error");
    
    }
});

module.exports = app; 
