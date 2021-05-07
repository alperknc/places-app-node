const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const adminController = require('../controllers/adminController');

const { catchErrors } = require('../handlers/errorHandlers');

// Store Routes
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/page/:page', catchErrors(storeController.getStores));
router.get('/add', authController.isBusiness, storeController.addStore);
router.post('/add',
    storeController.upload, 
    catchErrors(storeController.resize),  
    catchErrors(storeController.createStore)
);
router.post('/add/:id', 
    storeController.upload, 
    catchErrors(storeController.resize),  
    catchErrors(storeController.updateStore)
);
router.get('/stores/:id/edit', catchErrors(storeController.editStore));

router.get('/store/:slug', catchErrors(storeController.getStoreBySlug))

router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

//User Routes
router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get('/register', userController.registerForm);
router.post('/register', 
    userController.validateRegister,
    userController.register,
    authController.login
);
router.get('/logout', authController.logout);

router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token', 
    authController.confirmedPasswords, 
    catchErrors(authController.update)
);

router.get('/map', storeController.mapPage);
router.get('/hearts', authController.isLoggedIn, catchErrors(storeController.getHearts));
router.post('/reviews/:id', authController.isLoggedIn, catchErrors(reviewController.addReview));

router.get('/top', catchErrors(storeController.getTopStores));

router.get('/business', authController.isLoggedIn, userController.getBusiness)
router.post('/business/:id', catchErrors(userController.addBusiness)
);

const fs = require('fs');
// ADMIN
router.get('/admin', authController.isAdmin, catchErrors(adminController.getStores));
router.get('/admin/deleted', authController.isAdmin, catchErrors(adminController.getStores));
router.get('/admin/users', authController.isAdmin, catchErrors(adminController.getUsers));
router.get('/admin/reviews', authController.isAdmin, catchErrors(adminController.getReviews));
router.get('/admin/:id/delete', authController.isAdmin, catchErrors(adminController.deleteStore));
router.get('/admin/business', authController.isAdmin, adminController.getBusiness)
router.get('/admin/:id/confirm', authController.isAdmin, catchErrors(adminController.confirmBusiness));
router.get('/admin/:id/setBusiness', authController.isAdmin, catchErrors(adminController.setBusiness));
router.get('/admin/:id/setAdmin', authController.isAdmin, catchErrors(adminController.setAdmin));
router.get('/admin/:id/setReview', authController.isAdmin, catchErrors(adminController.setReview));

//API
router.get('/api/search', catchErrors(storeController.searchStores));
router.get('/api/stores/near', catchErrors(storeController.mapStores));
router.post('/api/stores/:id/heart', catchErrors(storeController.heartStore));


module.exports = router;