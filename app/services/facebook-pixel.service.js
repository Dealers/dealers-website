/**
 * Created by gullumbroso on 17/12/2016.
 */

angular.module('DealersApp')
    .service('FacebookPixel', function ($rootScope, $translate, tmhDynamicLocale) {
        'use strict';

        var service = {};

        service.viewContent = viewContent;
        service.purchase = purchase;
        service.initiateCheckout = initiateCheckout;
        service.completeRegistration = completeRegistration;
        service.addBankAccount = addBankAccount;

        return service;


        function viewContent(product) {
            fbq('track', 'ViewContent', {
                content_ids: [String(product.id)],
                content_type: 'product',
                content_title: product.title,
                value: product.price,
                currency: product.currency
            });
        }

        function purchase(product, purchase) {
            fbq('track', 'Purchase', {
                content_ids: [String(product.id)],
                content_type: 'product',
                content_title: product.title,
                value: purchase.price,
                currency: purchase.currency,
                quantity: purchase.quantity
            });
        }

        function initiateCheckout() {
            fbq('track', 'InitiateCheckout');
        }

        function completeRegistration() {
            fbq('track', 'CompleteRegistration');
        }

        function addBankAccount() {
            fbq('track', 'AddBankAccount');
        }

    });
