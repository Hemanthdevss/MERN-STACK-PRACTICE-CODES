const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "todoApplication.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.get("/players/", async (request, response) => {
  try {
    const getPlayerQuery = `
        SELECT 
            *
        FROM 
            player_details                    
    `;

    const playerArray = await database.all(getPlayerQuery);
    response.json(playerArray);
  } catch (error) {
    console.log(`Error fetching players: ${error.message}`);
    response.status(500).send("Internal Server Error");
  }
});

app.get("/players/:playerId", async (request, response) => {
  try {
    const { playerId } = request.params;
    const getPlayerQuery = `
        SELECT 
            * 
        FROM 
            player_details
        WHERE
            player_id = ?;
    `;

    const player = await database.get(getPlayerQuery, playerId);
    if (player) {
      response.json(player);
    } else {
      response.status(404).send("Player not found");
    }
  } catch (error) {
    console.log(`Error fetching player details: ${error.message}`);
    response.status(500).send("Internal Server Error");
  }
});

app.put("/players/:playerId/", async (request, response) => {
  try {
    const { playerId } = request.params;
    const { playerName } = request.body;
    const updatePlayerQuery = `
        UPDATE 
            player_details 
        SET 
            player_name = ?
        WHERE 
            player_id = ?;                
    `;

    await database.run(updatePlayerQuery, playerName, playerId);
    response.send("Player Details Updated");
  } catch (error) {
    console.log(`Error updating player details: ${error.message}`);
    response.status(500).send("Internal Server Error");
  }
});

app.get("/matches/:matchId/", async (request, response) => {
  try {
    const { matchId } = request.params;
    const getMatchDetailsQuery = `
        SELECT 
            *
        FROM 
            match_details
        WHERE 
            match_id = ?;                        
    `;

    const matchDetails = await database.get(getMatchDetailsQuery, matchId);
    if (matchDetails) {
      response.json(matchDetails);
    } else {
      response.status(404).send("Match not found");
    }
  } catch (error) {
    console.log(`Error fetching match details: ${error.message}`);
    response.status(500).send("Internal Server Error");
  }
});

app.get("/players/:playerId/matches/", async (request, response) => {
  try {
    const { playerId } = request.params;
    const getPlayerMatchesQuery = `
        SELECT 
            *
        FROM 
            player_match_score 
        WHERE
            player_id = ?;
    `;

    const playerMatches = await database.all(getPlayerMatchesQuery, playerId);
    response.json(playerMatches);
  } catch (error) {
    console.log(`Error fetching player matches: ${error.message}`);
    response.status(500).send("Internal Server Error");
  }
});

app.get("/matches/:matchId/players", async (request, response) => {
  try {
    const { matchId } = request.params;
    const getMatchPlayersQuery = `
        SELECT 
            *
        FROM 
            player_match_score 
        WHERE 
            match_id = ?;
    `;

    const matchPlayers = await database.all(getMatchPlayersQuery, matchId);
    response.json(matchPlayers);
  } catch (error) {
    console.log(`Error fetching match players: ${error.message}`);
    response.status(500).send("Internal Server Error");
  }
});

app.get("/players/:playerId/playerScores/", async (request, response) => {
  try {
    const { playerId } = request.params;
    const getPlayerScoresQuery = `
        SELECT 
            player_id AS playerId,
            player_name AS playerName,
            SUM(score) AS totalScore,
            SUM(fours) AS totalFours,
            SUM(sixes) AS totalSixes
        FROM
            player_match_score 
        INNER JOIN player_details ON player_match_score.player_id = player_details.player_id
        WHERE 
            player_match_score.player_id = ?
    `;

    const playerScores = await database.get(getPlayerScoresQuery, playerId);
    if (playerScores) {
      response.json(playerScores);
    } else {
      response.status(404).send("Player scores not found");
    }
  } catch (error) {
    console.log(`Error fetching player scores: ${error.message}`);
    response.status(500).send("Internal Server Error");
  }
});

module.exports = app;
