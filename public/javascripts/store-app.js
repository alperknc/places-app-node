import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map';
import ajaxHeart from './modules/heart';
import { adminList, confirm, setActive } from './modules/adminList';
import { isAdmin, isBusiness } from './modules/adminUser';
import { loading } from './modules/loading';

autocomplete($('#address'), $('#lat'), $('#lng'));

typeAhead($('.search'));

makeMap($('#map'));

const heartForms = $$('form.heart');
heartForms.on('submit', ajaxHeart);

const adminDelete = $$('form.delete');
adminDelete.on('submit', adminList)

const businessConfirm = $$('form.business');
businessConfirm.on('submit', confirm)

const setBusiness = $$('form.isBusiness');
setBusiness.on('change', isBusiness)

const setAdmin = $$('form.isAdmin');
setAdmin.on('change', isAdmin)

const setReview = $$('form.isActive');
setReview.on('change', setActive)

const stores = $('.content');
const loadingCl = $('.loader');
stores.addEventListener("load", loading(stores, loadingCl));

//loading($('.content .inner'))