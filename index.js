const express = require('express')
const axios = require('axios')
var parseString = require('xml2js').parseString;


const app = express()
const port = 3000

var businesses = [];

function getBusiness(id, cb) {
    axios.get(`https://storage.googleapis.com/coding-session-rest-api/${id}`)
        .then((response) => {
            if (cb) cb(response.data, null)
        })
        .catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                // console.log(error.response.headers);

                parseString(error.response.data, function (err, result) {
                    console.dir(result);
                    if (cb) cb(null, result)
                });
            } else {
                if (cb) cb(null, error)
            }

        });
}

// const businessIds = ['GXvPAor1ifNfpF0U5PTG0w','ohGSnJtMIC5nPfYRi_HTAg']


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/business/:businessId', (req, res) => {

    getBusiness(req.params.businessId, function (result, error) {
        if (error) {
            console.log(error)
            res.send(error)
            return;
        }
        const business = {
            name: result.displayed_what,
            address: result.displayed_where,
            opening_hours: result.opening_hours
        }
        res.send(business)
    })

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

