const express = require('express');  
const app = express(); // This is middleware of express
const dotenv = require('dotenv');  // This is a package of .env file for the security
                                  // if user want to store values in other file like database details
var bodyParser = require("body-parser");
//this module is used for reading the data from the body

dotenv.config();
app.set("view engine", "ejs")   // this is for the template engine to rendering the data
const connection = require('./config/db')  //connecting database
app.use(express.static(__dirname + "/public")); //path of the file
app.use(express.static(__dirname + "/views")); // path of the file
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json)       // it refers type of data which coming from the body
app.get('/', (req, res) => {
    res.redirect("create.html")
})


//reading all data
app.get("/data", (req, res) => {
    connection.query("select* from youtube_table", (err, rows) => {
        if (err) { console.log(err) }
        else {
            res.render("read.ejs", { rows });
        }
    });
})

// deleting data
app.get('/delete-data', (req, res) => {
    const query = 'delete from youtube_table where id=?';
    connection.query(query, [req.query.id], (err, rows) => {
        if (err) {
            console.log(err)
        }
        else {

            res.redirect('/data');
        }
    })
})

// update data
app.get('/update-data', (req, res) => {
    const query = 'select * from youtube_table where id=?';

    connection.query(query, [req.query.id], (err, eachRow) => {
        if (err) {
            console.log(err)
        }
        else {
            const result = JSON.parse(JSON.stringify(eachRow[0]));

            console.log(result);
            res.render('edit.ejs', { result });
        }
    })
})

//create user
app.post("/create", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    try {
        connection.query("insert into youtube_table(name,email) values(?,?)", [name, email], (err, rows) => {
            if (err) {
                console.log(err)
            }

            else {
                res.redirect("/data")
            }
        })
    }
    catch (err) {
        console.log(err)
    }
})

//final update
app.post("/update", (req, res) => {
    const id_data = req.body.hidden_id;
    const name_data = req.body.name;
    const email_data = req.body.email;

    console.log("id...", req.body.name, id_data);

    const updateQuery = "update youtube_table set name=?, email=? where id=?";

    connection.query(
        updateQuery,
        [name_data, email_data, id_data],
        (err, rows) => {
            if (err) {
                res.send(err);
            } else {
                res.redirect("/data");
            }
        }
    );
});

app.listen(process.env.PORT, (err) => {
    if (err) throw err;
    else {
        console.log(`server is running on port ${process.env.PORT}`)
    }
})