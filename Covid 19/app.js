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

const stateMovieToResponse = (eachItem) => {
    return {
        stateId : eachItem.state_id,
        stateName : eachItem.state_name,
        population : eachItem.population
    }    
}

const convertDistrictToResponse = (eachItem) => {
    return {
        districtId : eachItem.district_id,
        districtName : eachItem.district_name,
        stateId : eachItem.state_id,
        cases : eachItem.cases,
        cured : eachItem.cured,
        active : eachItem.active,
        deaths : eachItem.deaths,
    }
}

// 1 ) Returns a list of all states in the state table

app.get("/states/" , async(request,response) => {
    const getAllStatesQuery = `
        SELECT 
            *
        FROM 
            state;            
    `;

    const statesArray = await database.all(getAllStatesQuery);
    response.send(
        statesArray.map((eachItem) => {
            return stateMovieToResponse(eachItem);
        })
    )
})

// 2 ) Return a state based on state ID 

app.get("/states/:stateId" , async(request,response) => {
    const {stateId} = request.params;
    const getMovieQuery = `
        SELECT 
            * 
        FROM 
            state
        WHERE 
            stateId = ${stateId}                
    `;

    const state = await database.get(getMovieQuery);
    response.send(stateMovieToResponse(state))
})

// 3 ) Create a district in the district table and district_id is auto-incremented

app.post("/districts" , async(request,response) => {
    const {districtName , stateId , cases , cured , active , deaths  } = request.body;
    const postDistrictQuery = `
        INSERT INTO 
            district (district_name , state_id , cases , cured ,  active , deaths)
        VALUES 
            (
                "${districtName}",
                ${stateId},
                ${cases},
                ${cured},
                ${active},
                ${deaths}

            )
    `;

    await database.run(postDistrictQuery);
    response.send("District Successfully Added")
});

// 4 ) Returns a district based on the districtId

app.get("/districts/:districtId/" , async(request,response) => {
    const { districtId } = request.params;
    const getAllDistrictQuery = `
        SELECT 
            *
        FROM 
            district
        WHERE 
            district_id = ${districtId}                        
    `;

    const district = await database.get(getAllDistrictQuery);
    response.send(stateMovieToResponse(district))

    
})

// 6 ) Updates the details of a specific district based on the district ID

app.put("/district/:districtId/" , async(request,response) => {
     const {districtName , stateId , cases , cured , active , deaths  } = request.body;
    const { districtId } = request.params;
    const updateDistrictQuery = `
        UPDATE 
            movie
        SET 
            district_name = "${districtName}"
            state_id = ${stateId} 
            cases = ${cases}
            cured = ${cured}
            active = ${active}
            deaths =  ${deaths}           
        WHERE 
            district_id = ${districtId}
    `;

    await database.run(updateDistrictQuery);
    response.send("District Details Updated");
})

// 5 ) Deletes a district from the district table based on the district ID

app.delete("/district/:districtId/" , async(request,response) => {
    const {movieId} = request.params;
    const deleteDistrictQuery = `
        DELETE FROM 
            district
        WHERE 
            district_id = ${districtId};
    `;

    await database.run(deleteDistrictQuery);
    response.send("District Removed");
})

// 7 ) Returns the statistics of total cases,cured,active,deaths of a specific state based on state ID

app.get("/states/:stateId/states" , async (request , response) => {
    const {stateId} = request.params;
    const getDistrictQuery = `
        SELECT 
            SUM(cases) AS totalcases,
            SUM(cured) AS totalcured,
            SUM(active) AS totalactive,
            SUM(deaths) AS totaldeaths   
        FROM 
            district
        WHERE 
            state_id = ${stateId}
                             
    `;
    
    const district = await database.get(getDistrictQuery);
    response.send(district)
})

// 8 ) Returns an object containing the state name of a district based on the district ID 


app.get("/districts/:districtId/details/" , async(request,response) => {
    const {districtId} = request.params;
    const getDirectorMoviesQuery = `
        SELECT 
            state_name AS stateName
        FROM 
            district INNER 
            JOIN state ON district.state_id = state.state_id            
        WHERE 
            district_id = ${districtId};
    
    `;
    
    const stateName = await database.all(getDirectorMoviesQuery);
    response.send(stateName)
    
})

module.exports = app;
