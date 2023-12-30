const express = require('express');
const mbs = require('./ke/mbs/mbs');
const nrk = require('./ke/nrk/nrk');
const nbo = require('./ke/nbo/nbo');
const app = express()

let cities = [nbo, mbs, nrk]
for (let i = 0; i < cities.length; i++) {
    const city = cities[i];

    city;

    app.all('/kfc', (req, res) => {
        res.send(nbo.product.concat( mbs.product ,nrk.product ))
    })


}

app.listen(process.env.PORT || 5000, () => console.log(`Listening on port!`))
