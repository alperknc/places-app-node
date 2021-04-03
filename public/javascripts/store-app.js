import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';
import makeMap from './modules/map';
import ajaxHeart from './modules/heart';
import { adminList, confirm } from './modules/adminList';
import { isAdmin, isBusiness } from './modules/adminUser';

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
