const express = require("express");
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const app = express();
const databasePath = path.join(__dirname,"moviesData.db");

let database = null;

const initializeDbAndServer = await() => {
    try {
        database = await open ({
            filename:databasePath,
            driver:sqlite3.Database
        })

        app.listen(3000,() => {
            console.log("Server is running at http://localhost")
        })
    }

    catch (error) {
        console.log(`DB Error: ${error.message}`);
        process.exit(1);
    }
};

initializeDbAndServer();

const convertMovieToResponse = (eachItem) => {
    return {
        movieId : eachItem.movie_id,
        directorId : eachItem.director_id,
        movieName : eachItem.movie_name,
        leadActor : eachItem.lead_Actor
    }    
}

const convertDirectorToResponse = (eachItem) => {
    return {
        directorId : eachItem.director_id,
        directorName : eachItem.director_name
    }
}

// 1 ) Returns a list of all movie names in the movie table

app.get("/movies/" , async(request,response) => {
    const getMoviesQuery = `
        SELECT 
            movie_names
        FROM 
            movie;            
    `;

    const moviesArray = await database.all(getMoviesQuery);
    response.send(
        moviesArray.map((eachItem) => {
            return convertMovieToResponse(eachItem);
        })
    )
})

// 2 ) Return a movie based on movie ID 

app.get("/movies/:movieId" , async(request,response) => {
    const {movieId} = request.params;
    const getMovieQuery = `
        SELECT 
            * 
        FROM 
            movie
        WHERE 
            movie_id = ${movieId}                
    `;

    const movie = await database.get(getMovieQuery);
    response.send(convertMovieToResponse(movie))
})

// 3 ) Create a new movie in the movie table 

app.post("/movies" , async(request,response) => {
    const {directorId , movieName , leadActor } = request.body;
    const postMovieQuery = `
        INSERT INTO 
            movie (director_id , movie_name , lead_actor)
        VALUES 
            (
                ${directorId},
                "${movieName}",
                "${leadActor}"
            )
    `;

    await database.run(postMovieQuery);
    response.send("Movie Successfully Added")
});

// 4 ) Update the details of a movie in the movie table based on the movie ID 

app.put("/movies/:moviesId/" , async(request,response) => {
    const {directorId , movieName , leadActor} = request.body;
    const { movieId} = request.params;
    const updateMovieQuery = `
        UPDATE 
            movie
        SET 
            director_id = ${directorId},
            movie_movie = "${movieName}",
            lead_actor = "${leadActor}
        WHERE 
            movie_id = ${movieId}
    `;

    await database.run(updateMovieQuery);
    response.send("Movie Details Updated");
})

// 5 ) Deleta a movie from a movie table based on the movie ID

app.delete("/movies/:movieId/" , async(request,response) => {
    const {movieId} = request.params;
    const deleteMovieQuery = `
        DELETE FROM 
            movie
        WHERE 
            movie_id = ${movieId};
    `;

    await database.run(deleteMovieQuery);
    response.send("Movie Removed");
})

// 6 ) Returns a list of all directors in the director table 

app.get("/directors/" , async (request , response) => {
    const getDirectorsQuery = `
        SELECT 
            * 
        FROM 
            director
    `;

    const directorsArray = await database.all(getDirectorsQuery);
    response.send(
        directorsArray.map((eachItem) => {
            return convertDirectorToResponse(eachItem)
        })
    )    
})

// 7 ) Returns a list of all movie names directed by a specific director

app.get("/directors/:directorId/movies" , async(request,response) => {
    const {directorId} = request.params;
    const getDirectorMoviesQuery = `
        SELECT 
            movie_name
        FROM 
            movie
        WHERE 
            director_id = ${directorId};
    
    `;
    
    const moviesArray = await database.all(getDirectorMoviesQuery);
    response.send(
        moviesArray.map((eachItem) => {
            return movieName : eachItem.movie_name;
        })
    )
})

module.exports = app;
































