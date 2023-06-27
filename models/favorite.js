const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const myBeerSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    beers: [{
        type: Schema.Types.ObjectId,
        ref: 'Campsite'
    }]
});

const myBeer = mongoose.model('myBeer', myBeerSchema);

module.exports = myBeer;