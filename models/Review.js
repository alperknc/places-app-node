const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const reviewSchema = new mongoose.Schema({
    created: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'Bu alan boş bırakılamaz!'
    },
    store: {
        type: mongoose.Schema.ObjectId,
        ref: 'Store',
        required: 'Bu alan boş bırakılamaz!'
    },
    text: {
        type: String,
        required: 'Yorum alanı boş bırakılamaz!'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    isActive: {
        type: Boolean,
        default: false
    }
});

function autopopulate(next) {
    this.populate('author');
    next();
}

reviewSchema.pre('find', autopopulate);
reviewSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Review', reviewSchema);