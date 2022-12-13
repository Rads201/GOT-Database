/*
# Citation for all the js and hbs files
# Date: 12/05/2022
# Adapted from: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

/*
    SETUP
*/
// We are using the express library for the web server
// We need to instantiate an express object to interact with the server in our code
// Set a port number at the top so it's easy to change in the future
let express = require('express');
let app = express();
PORT = 4269;

const { engine } = require('express-handlebars');
let exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({ extname: ".hbs" }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database
let db = require('./database/db-connector')

// app.js - SETUP section
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'));         // this is needed to allow for the form to use the ccs style sheet/javscript

/*
    ROUTES
*/
// This is the basic syntax for what is called a 'route'
// This function literally sends the string "The server is running!" to the computer requesting the web site.

app.get('/', function (req, res) {
    let query1 = "SELECT * FROM regions;";               // Define our query

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query

        res.render('regions', { data: rows });                  // Render the regions.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});

app.get('/regions', function (req, res) {
    let query1 = "SELECT * FROM regions;";               // Define our query

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query

        res.render('regions', { data: rows });                  // Render the regions.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});

app.get('/houses', function (req, res) {
    let query1 = "SELECT houseID, houseName, houseLord, armySize, wealth, regions.regionName FROM houses INNER JOIN regions ON regions.regionID = houses.regionID;";               // Define our query
    let query2 = "SELECT * FROM regions;";

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query
        let houses = rows;

        db.pool.query(query2, (error, rows, fields) => {
            let regions = rows;

            let regionmap = {}
            regions.map(region => {
                let id = parseInt(regions.regionID, 10);
                regionmap[id] = region["regionName"];
            })

            houses = houses.map(house => {
                return Object.assign(house, {region: regionmap[house.region]})
            })

            return res.render('houses', {data: houses, regions: regions});
        })
    })                                                    // an object where 'data' is equal to the 'rows' we
});

app.get('/subjects', function (req, res) {
    let query1 = "SELECT * FROM subjects;";               // Define our query
    let query2 = "SELECT * FROM houses;";

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query
        let subjects = rows;

        db.pool.query(query2, (error, rows, fields) => {
            let houses = rows;

            let housemap = {}
            houses.map(house => {
                let id = parseInt(houses.houseID, 10);
                housemap[id] = house["houseName"];
            })

            subjects = subjects.map(subject => {
                return Object.assign(subject, {house: housemap[subject.house]})
            })

            return res.render('subjects', {data: subjects, houses: houses});
        })
    })                                                    // an object where 'data' is equal to the 'rows' we
});

app.get('/battles', function (req, res) {
    let query1 = "SELECT battleID, battleName, regions.regionName, winners, losers FROM battles INNER JOIN regions ON regions.regionID = battles.regionID;";               // Define our query
    let query2 = "SELECT * FROM regions;";
    let query3 = "SELECT * FROM houses;";

    db.pool.query(query1, function (error, rows, fields) {    // Execute the query
        let battles = rows;

        db.pool.query(query2, (error, rows, fields) => {
            let regions = rows;

            let regionmap = {}
            regions.map(region => {
                let id = parseInt(regions.regionID, 10);
                regionmap[id] = region["regionName"];
            })

            db.pool.query(query3, (error, rows, fields) => {
                let houses = rows;

                let housemap = {}
                houses.map(house => {
                    let id = parseInt(houses.houseID, 10);
                    housemap[id] = house["houseName"];
                })

                battles = battles.map(battle => {
                    return Object.assign(battle, {region: regionmap[battle.region]})
                })
                return res.render('battles', {data: battles, regions: regions, houses: houses});
            })
        })
    })
});

app.get('/houses_battles', function (req, res) {
    let query1 = "SELECT houses.houseName, battles.battleName FROM houses_battles INNER JOIN houses ON houses.houseID = houses_battles.houseID INNER JOIN battles ON battles.battleID = houses_battles.battleID;";               // Define our query
    db.pool.query(query1, function (error, rows, fields) {    // Execute the query

        res.render('houses_battles', { data: rows });                  // Render the houses_battles.hbs file, and also send the renderer
    })
});

app.post('/add-region-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO regions (regionName) VALUES ('${data['input-regionName']}')`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM regions and
        // presents it on the screen
        else {
            res.redirect('/');
        }
    })
})

app.post('/add-house-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let regionName = data['input-regionName'];

    // Capture NULL values
    let armySize = parseInt(data['input-armySize']);
    if (isNaN(armySize)) {
        armySize = 'NULL'
    }

    let wealth = parseInt(data['input-wealth']);
    if (isNaN(wealth)) {
        wealth = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO houses (houseName, houseLord, armySize, wealth, regionID) VALUES ('${data['input-houseName']}', '${data['input-houseLord']}', ${armySize}, ${wealth}, ${regionName})`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM houses and
        // presents it on the screen
        else {
            res.redirect('/houses');
        }
    })
})

app.post('/add-subject-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let houseName = data['input-houseName'];

    let occupation = data['input-occupation'];
    if (occupation === null) {
        occupation = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO subjects (subjectName, occupation, houseID) VALUES ('${data['input-subjectName']}', '${occupation}', ${houseName})`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM houses and
        // presents it on the screen
        else {
            res.redirect('/subjects');
        }
    })
})

app.post('/add-battle-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let regionName = data['input-regionName'];
    let battleName = data['input-battleName'];

    let winners = data['input-winners'];
    let losers = data['input-losers'];
    let win_string = ""
    let lose_string = ""
    let win_length = 1
    let lose_length = 1

    if (typeof winners === "object") {
        win_length = winners.length;
        win_string = winners.join(',');
    }
    else {
        win_string = winners;
    }

    if (typeof losers === "object") {
        lose_length = losers.length;
        lose_string = losers.join(',');
    }
    else {
        lose_string = losers
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO battles (battleName, regionID, winners, losers) VALUES ('${data['input-battleName']}', ${regionName}, '${win_string}', '${lose_string}')`;
    query2 = `INSERT INTO houses_battles (houseID, battleID) SELECT houseID, battleID FROM houses, battles WHERE houses.houseName = ? AND battles.battleName = ?`;
    db.pool.query(query1, function (error, rows, fields) {

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the queries
        else {
            if (typeof winners === "object") {
                for (let i = 0; i < win_length; i++) {
                    db.pool.query(query2, [winners[i], battleName], function(error, rows, fields) {})
                }
            }
            else {
                db.pool.query(query2, [winners, battleName], function(error, rows, fields) {})
            }

            if (typeof losers === "object") {
                for (let i = 0; i < lose_length; i++) {
                    db.pool.query(query2, [losers[i], battleName], function(error, rows, fields) {})
                }
            }
            else {
                db.pool.query(query2, [losers, battleName], function(error, rows, fields) {})
            }

            res.redirect('/battles');
        }
    })
})

app.delete('/delete-subject-ajax/', function(req,res,next){
    let data = req.body;
    let subjectID = parseInt(data.id);
    let deleteSubject = `DELETE FROM subjects WHERE subjectID = ?`;

    db.pool.query(deleteSubject, [subjectID], function(error, rows, fields) {

        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
    
});

app.delete('/delete-battle-ajax/', function(req,res,next){
    let data = req.body;
    let battleID = parseInt(data.id);
    let deleteBattle = `DELETE FROM battles WHERE battleID = ?`;
    let deleteHouseBattle = 'DELETE FROM houses_battles WHERE battleID = ?'

    db.pool.query(deleteBattle, [battleID], function(error, rows, fields) {})

    db.pool.query(deleteHouseBattle, [battleID], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    })
    
});

app.put('/put-subject-ajax', function(req,res,next){
    let data = req.body;

    let subjectName = data.subjectName;

    let occupation = data.occupation;
    if (occupation === null) {
        occupation = NULL
    }

    let houseName = data.house;
    if (houseName === "0") {
        houseName = null
    }
  
    let queryUpdate = `UPDATE subjects SET houseID = ?, occupation = ? WHERE subjects.subjectID = ?`;
    let selectHouse = `SELECT * FROM houses WHERE houseID = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdate, [houseName, occupation, subjectName], function(error, rows, fields){
              if (error) {
  
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                db.pool.query(selectHouse, [houseName], function(error, rows, fields) {
  
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
              }
  })
});

/*
    LISTENER
*/
// This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
app.listen(PORT, function () {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});