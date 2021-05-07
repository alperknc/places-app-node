const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const promisify = require('es6-promisify');
const User = mongoose.model('User');
const mail = require('../handlers/mail');

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Başarısız Giriş!',
    successRedirect: '/',
    successFlash: 'Giriş başarılı!'
})

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Başarıyla çıkış yapıldı!');
    res.redirect('/');
}

exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
        return;
    }
    req.flash('error', 'Mekân eklemek için giriş yapman gerek!');
    res.redirect('/login');
}

exports.forgot = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
        req.flash('success', 'Şifre yenileme linki gönderildi!');
        return res.redirect('/login');
    }

    user.resetPaswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

    const resetUrl = `http://${req.headers.host}/account/reset/${user.resetPaswordToken}`;
    await mail.send({
        user,
        subject: 'Şifre Yenileme',
        resetUrl,
        filename: 'password-reset'

    });
    
    req.flash('success', `Şifre yenileme linki gönderildi!`);

    res.redirect('/login');
}

exports.reset = async (req, res) => {
    const user = await User.findOne({
        resetPaswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if(!user) {
        req.flash('error', 'Şifre yenileme linki geçersiz ya da süresi dolmuş!');
        return res.redirect('/login');
    }

    res.render('reset', { title: 'Şifreni Yenile' })
}

exports.confirmedPasswords = (req, res, next) => {
    if(req.body.password === req.body['password-confirm']) {
        next();
        return;
    }
    req.flash('error', 'Şifreler eşleşmiyor!');
    res.redirect('back');
}

exports.update = async (req, res) => {
    const user = await User.findOne({
        resetPaswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if(!user) {
        req.flash('error', 'Şifre yenileme linki geçersiz ya da süresi dolmuş!');
        return res.redirect('/login');
    }

    const setPassword = promisify(user.setPassword, user);
    await setPassword(req.body.password);
    user.resetPaswordToken = undefined;
    user.resetPasswordExpires = undefined;
    const updatedUser = await user.save();
    await req.login(updatedUser);
    req.flash('success', 'Şifre başarıyla değiştirildi!');
    res.redirect('/');
}

exports.isAdmin = (req, res, next) => {
    if(req.user.isAdmin) {
        next();
        return;
    }
    req.flash('error', 'Yetki yetersiz!');
    res.redirect('/');
}

exports.isBusiness = (req, res, next) => {
    if(req.user.isBusiness) {
        next();
        return;
    }
    req.flash('error', 'Yetki yetersiz!');
    res.redirect('/');
}