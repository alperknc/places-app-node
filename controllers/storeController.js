const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const User = mongoose.model('User');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter: (req, file, next) => {
        const isPhoto = file.mimetype.startsWith('image/')
        if(isPhoto) {
            next(null, true);
        } else {
            next({ message: 'Dosya türü kabul edilmedi!' }, false);
        }
    }
}

exports.addStore = (req, res) => {
    res.render('editStore', { title: 'Mekân Ekle' });
}

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
    if(!req.file) {
        next();
        return;
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;

    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);

    next();
}

exports.createStore = async (req, res) => {
    req.body.author = req.user._id;
    const store =await (new Store(req.body)).save();
    req.flash('success', `${store.name} adlı işletme başarıyla oluşturuldu!`)
    res.redirect(`/store/${store.slug}`);
}

exports.getStores = async (req, res) => {
    const page = req.params.page  || 1;
    const limit = 6;
    const skip = (page * limit) - limit;
    const storesPromise = await Store
        .find({ isDeleted: false })
        .skip(skip)
        .limit(limit)
        .sort({ created: 'desc' });
    const countPromise = Store.count();

    const [stores, count] = await Promise.all([storesPromise, countPromise]);
    const pages = Math.ceil(count / limit);
    if(!stores.length && skip) {
        req.flash('info', 'Böyle bir sayfa yok, o yüzden son sayfaya yönlendirildin!');
        res.redirect(`/stores/page/${pages}`);
        return;
    }

    res.render('stores', { title: 'Mekânlar', stores, page, pages, count});
}

const confirmOwner = (store, user) => {
    if(!store.author.equals(user._id)) {
        throw Error('Güncellemek için sahibi olman gerek!');
    }
}
exports.editStore = async (req, res) => {
    const store = await Store.findOne({ _id: req.params.id });
    
confirmOwner(store, req.user);

    res.render('editStore', { title: `Düzenlenen : ${store.name}`, store })
}

exports.updateStore = async (req, res) => {
    req.body.location.type = 'Point';

    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body,{
        new: true,
        runValidators: true
    }).exec();
    req.flash('success', `<strong>${store.name}</strong> Başarıyla güncellendi. <a href="/store/${store.slug}">İşletmeyi Gör</a>`);
    res.redirect(`/stores/${store._id}/edit`);
}

exports.getStoreBySlug = async (req, res, next) => {
    const store = await Store.findOne({ slug: req.params.slug }).populate('author reviews');
    if (!store) return next();
    res.render('store', { store, title: store.name });
  };

exports.getStoresByTag = async (req, res, next) => {
    const tag = req.params.tag;
    const tagQuery = tag || { $exists: true };

    const tagsPromise = Store.getTagsList();
    const storesPromise = Store.find({ tags: tagQuery });
    const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);
    
    res.render('tags', { tags, title: 'Etiketler', tag, stores })
}

exports.searchStores = async (req, res) => {
    const stores = await Store.find({
        $text: {
            $search: req.query.q,
        }
    }, {
        score: { $meta: 'textScore' }
    })
    .sort({
        score: { $meta: 'textScore' }
    })
    .limit(5);
    res.json(stores);
}

exports.mapStores = async (req, res) => {
    const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
    const q = {
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates
                },
                $maxDistance: 10000 //10km
            }
        }
    }

    const stores = await Store.find(q).select('slug name description location photo');
    res.json(stores)
}

exports.mapPage = (req, res) => {
    res.render('map', { title: 'Harita' });
}

exports.heartStore = async (req, res) => {
    const hearts = req.user.hearts.map(obj => obj.toString());
    const operator = hearts.includes(req.params.id) ? '$pull' : '$addToSet';
    const user = await User
    .findByIdAndUpdate(req.user._id, 
        { [operator]: { hearts: req.params.id } }, 
        { new: true }
    );
    res.json(user);
}

exports.getHearts = async (req, res) => {
    const stores = await Store.find({
        _id: { $in: req.user.hearts }
    });
    res.render('stores', { title: 'Favoriler', stores })
}

exports.getTopStores = async (req, res) => {
    const stores = await Store.getTopStores();
    res.render('topStores', { stores, title: 'En iyi Mekanlar!' });
}