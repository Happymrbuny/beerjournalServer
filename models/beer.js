const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    text: {
        type: String,
        requried: true
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const beerSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    style: {
        type: String,
        required: true,
    },
    featured: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    },

    comments: [commentSchema]
}, {
    timestamps: true
});

const Beer = mongoose.model('Beer', beerSchema);

module.exports = Beer;