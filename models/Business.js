const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    placesName: {
        type: String,
        trim: true,
        required: 'Lütfen işletmenize bir isim giriniz!'
    },
    placesNo: {
        type: String,
        required: 'Lütfen telefon giriniz!'
    },
    ownerName: {
        type: String,
        required: 'Lütfen isminizi giriniz!'
    },
    ownerSurname: {
        type: String,
        required: "Lütfen soyadınızı giriniz!"
    },
    ownerNo: {
        type: String,
        required: 'Lütfen telefon numaranızı giriniz!'
    },
    created: {
        type: Date,
        default: Date.Now
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'Kullanıcı kısmı boş olamaz!'
      },
      isActive: {
          type: Boolean,
          default: false
      }
    }
);

module.exports = mongoose.model('Business', businessSchema);