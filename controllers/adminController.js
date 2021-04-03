const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const User = mongoose.model('User');
const Review = mongoose.model('Review');
const Business = mongoose.model('Business');

exports.getStores = async (req, res) => {
    //deleted
    if(req.route.path === "/admin/deleted") {
        const stores = await Store.find({ isDeleted: true });
        res.render('admin/index', { title: 'Mekânlar', button: 'Geri Dön', href: "/admin", value: "Geri Al", stores });
        return;
    }

    const page = req.params.page  || 1;
    const limit = 10;
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
        res.redirect(`/admin/page/${pages}`);
        return;
    }
    
    res.render('admin/index', { title: 'Mekânlar', button: 'Silinenlere Git →', href: "/admin/deleted", stores });
}

exports.getDeleted = async (req, res) => {
    
}

exports.deleteStore = async (req, res) => {
    const store = await Store.findById({ _id: req.params.id });
    const isDeleted = store.isDeleted ? 'false' : 'true';
    const update = await Store.updateOne({ _id: req.params.id }, { isDeleted },{
        new: true,
        runValidators: true
    }).exec();
    //req.flash('success', `<strong>${store.name}</strong> Başarıyla silindi.`);
    //res.redirect('/admin');
}

exports.getUsers = async (req, res) => {
    const page = req.params.page  || 1;
    const limit = 10;
    const skip = (page * limit) - limit;
    const usersPromise = await User
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ created: 'desc' });
    const countPromise = User.count();

    const [users, count] = await Promise.all([usersPromise, countPromise]);
    const pages = Math.ceil(count / limit);
    if(!users.length && skip) {
        req.flash('info', 'Böyle bir sayfa yok, o yüzden son sayfaya yönlendirildin!');
        res.redirect(`/admin/users/page/${pages}`);
        return;
    }

    res.render('admin/users', { title: 'Kullanıcılar', path: req.route.path, users });
}

exports.getReviews = async (req, res) => {
    const page = req.params.page  || 1;
    const limit = 10;
    const skip = (page * limit) - limit;
    const reviewPromise = await Review
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ created: 'desc' });
    const countPromise = Review.count();

    const [reviews, count] = await Promise.all([reviewPromise, countPromise]);
    const pages = Math.ceil(count / limit);
    if(!reviews.length && skip) {
        req.flash('info', 'Böyle bir sayfa yok, o yüzden son sayfaya yönlendirildin!');
        res.redirect(`/admin/users/page/${pages}`);
        return;
    }

    res.render('admin/reviews', { title: 'Yorumlar', reviews });
}

exports.getBusiness = async (req, res) => {
    const page = req.params.page  || 1;
    const limit = 6;
    const skip = (page * limit) - limit;
    const businessPromise = await Business
        .find({ isActive: false })
        .skip(skip)
        .limit(limit)
        .sort({ created: 'desc' });
    const countPromise = Business.count();

    const [businesses, count] = await Promise.all([businessPromise, countPromise]);
    const pages = Math.ceil(count / limit);
    if(!businesses.length && skip) {
        req.flash('info', 'Böyle bir sayfa yok, o yüzden son sayfaya yönlendirildin!');
        res.redirect(`/admin/business/page/${pages}`);
        return;
    }

    res.render('admin/business', { title: 'İşletme Hesabı Başvuruları', businesses, page, pages, count});
}

exports.confirmBusiness = async (req, res) => {
    const business = await Business.findByIdAndUpdate({ _id: req.params.id }, { isActive: true });
    const update = await User.updateOne({ _id: business.author }, { isBusiness: true },{
        new: true,
        runValidators: true
    }).exec();
}

exports.setBusiness = async (req, res) => {
    const user = await User.findById({ _id: req.params.id });
    const isBusiness = user.isBusiness ? 'false' : 'true';
    const userUpdate = await User.findByIdAndUpdate({ _id: req.params.id }, { isBusiness });
}

exports.setAdmin = async (req, res) => {
    const user = await User.findById({ _id: req.params.id });
    const isAdmin = user.isBusiness ? 'false' : 'true';
    const userUpdate = await User.findByIdAndUpdate({ _id: req.params.id }, { isAdmin });
}