const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
const csvtojson = require('csvtojson');
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;
const urlencodedParser = bodyParser.urlencoded({ extended: false });



app.use(express.static("public"));
app.set("view engine", "pug");

app.set("views", path.join(__dirname, "views"));

app.listen(port, () => { console.log(`Server is listening on port: ${port}`); });


app.post('/savedata', urlencodedParser, (req, res) => {

    let date = moment().format('YYYY-MM-DD');

    let str = `"${req.body.name}","${req.body.progress}","${req.body.comm}","${date}"\n`;

    fs.appendFile(path.join(__dirname, 'data/books.csv'), str, function (err) {

        if (err) {

            console.error(err);

            return res.status(400).json({
                success: false,
                message: "An error occurred while saving the data"
            });
        }
    });
    res.redirect(301, '/');
});

app.get("/booklist", (req, res) => {

    csvtojson({ headers: ['name', 'progress', 'comm', 'date'] }).fromFile(path.join(__dirname,
        'data/books.csv'))
        .then(data => {

            console.log(data);

            res.render('index', { nadpis: "Booklist", books: data });
        })
        .catch(err => {

            console.log(err);

            res.render('error', { nadpis: "Application error", chyba: err });
        });
});
