require([
    'jquery',
    './modules/CompanyModel',
    './modules/CompanyCtrl',
    './modules/FormCtrl',
    './modules/GistoCtrl',
    './modules/ChartsCtrl',
    './modules/RecordsCtrl'
], function($, CompanyModel, CompanyCtrl, FormCtrl, GistoCtrl, ChartsCtrl, RecordsCtrl){

    var companyModel = new CompanyModel();

    var companyCtrl = new CompanyCtrl({
        element: $('#company'),
        template: $('#companyTmp'),
        model: companyModel
    });

    var formCtrl = new FormCtrl({
        element: $('#form'),
        template: $('#formTmp'),
        model: companyModel
    });

    var gistoCtrl = new GistoCtrl({
        element: $('#gisto'),
        template: $('#gistoTmp'),
        model: companyModel
    });

    var recordsCtrl = new RecordsCtrl({
        element: $('#records'),
        template: $('#recordsTmp'),
        model: companyModel
    });

    var chartsCtrl = new ChartsCtrl({
        element: $('#charts'),
        template: $('#chartsTmp'),
        model: companyModel
    });
});