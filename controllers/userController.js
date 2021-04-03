const mongoose = require('mongoose');
const User = mongoose.model('User');
const Business = mongoose.model('Business');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Giriş' });
} 

exports.registerForm = async (req, res) => {
    res.render('register', { title: 'Kayıt' })
}

exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'İsim boş bırakılamaz!').notEmpty();
    req.checkBody('email', 'Email boş bırakılamaz!').isEmail();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password', 'Şifre boş bırakılamaz!').notEmpty();
    req.checkBody('password-confirm', 'Şifre doğrulama boş bırakılamaz!').notEmpty();
    req.checkBody('password-confirm', 'Şifreler birbiriyle uyuşmuyor!').equals(req.body.password);

    const errors = req.validationErrors();
    if(errors) {
        req.flash('error', errors.map(err => err.msg));
        res.render('register', { title: 'Kayıt', body: req.body, flashes: req.flash() });
        return;
    }
    next();
}

exports.register = async (req, res, next) => {
    const user = new User({ email: req.body.email, name: req.body.name });
    const register = promisify(User.register, User);
    await register(user, req.body.password);
    next();
}

exports.account = (req, res) => {
    res.render('account', { title: 'Profil Düzenle' })
}

exports.updateAccount = async (req, res) => {
    const updates = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: updates },
        { new: true, runValidators: true, context: 'query' }
    );
    req.flash('success', 'Profil Güncellendi!');
    res.redirect('back');
}

exports.getBusiness = (req, res) => {
    res.render('business', { title: 'İşletme hesabı başvuru' })
}

exports.addBusiness = async (req, res) => {
        req.body.author = req.user._id;
        const business =await (new Business(req.body)).save();
        req.flash('success', `${business.placesName} adlı işletme başvurusu başarıyla yapıldı!`)
        res.redirect(`/account`);
}