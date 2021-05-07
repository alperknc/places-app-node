const { Store } = require('express-session');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Lütfen işletmenize bir isim giriniz!'
    },
    slug: String,
    description: {
        type: String,
        required: 'Lütfen açıklama giriniz!'
    },
    tags: [String],
    created: {
        type: Date,
        default: Date.Now
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [{
            type: Number,
            required: 'Kordinatları girmeniz gerek!'
        }],
        address: {
            type: String,
            required: 'Adres kısmı doldurulmadı!'
        }
    },
    photo: String,
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'Kullanıcı kısmı boş olamaz!'
      },
    created: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: false
    }
    }, {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
});

storeSchema.index({
    name: 'text',
    description: 'text'
});

storeSchema.index({ location: '2dsphere' })

storeSchema.pre('save', async function(next) {
    if(!this.isModified('name')) {
        next();
        return //stop this function
    }
    this.slug = slug(this.name);

    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
    if (storesWithSlug.length) {
        this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
    }

    next();
});

storeSchema.statics.getTagsList = function() {
    return this.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
}

storeSchema.statics.getTopStores = function() {
    return this.aggregate([
        { $lookup: {from: 'reviews', localField: '_id', foreignField: 'store', as: 'reviews'} },
        //filter 2 reviews or more
        { $match: { 'reviews.0': { $exists: true } } },
        //average reviews field
        { $project: {
            photo: '$$ROOT.photo',
            name: '$$ROOT.name',
            reviews: '$$ROOT.reviews',
            slug: '$$ROOT.slug',
            averageRating: { $avg: '$reviews.rating' } 
            } 
        },
        { $sort: { averageRating: -1 } },
        //limit 10
        { $limit: 10 }
    ]);
}

storeSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'store'
});

function autopopulate(next) {
    this.populate('reviews');
    next();
}

storeSchema.pre('find', autopopulate);
storeSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Store', storeSchema);