/**
 * Created by gullumbroso on 18/10/2016.
 */

angular.module('DealersApp')
    .service('Translations', function ($rootScope, $translate, tmhDynamicLocale) {
        'use strict';
        
        var service = {
            general: {},
            home: {},
            viewDeal: {},
            productsGrid: {},
            productEdit: {}, // add product and edit product
            shippingMethods: {},
            purchaseDetails: {},
            signIn: {},
            dealerRegistration: {},
            checkout: {}
        };

        /**
         * Returns the translation of the received category.
         * @param category
         * @returns {*}
         */
        service.translateCategory = function (category) {
            if (category.length > 2) { // To ignore server keys
                var index = $rootScope.categoriesLocal.indexOf(category);
                return $rootScope.categories[index];
            }
        };

        loadTranslations();
        
        function loadTranslations() {
            // General
            service.general.cancel = $translate.instant("general.cancel");
            service.general.approve = $translate.instant("general.approve");
            service.general.confirmLeave = $translate.instant("general.unsaved-changes");
            service.general.removePhotoTitle = $translate.instant("general.remove-photo-title");
            service.general.removePhotoConfirm = $translate.instant("general.remove-photo-confirm");
            service.general.savingChanges = $translate.instant("general.saving-changes");
            service.general.gotIt = $translate.instant("general.got-it");
            service.general.ok = $translate.instant("general.ok");
            service.general.crop = $translate.instant("general.crop");

            // Home
            service.home.seeProducts = $translate.instant("translations-service.home.see-products");

            // View Deal
            service.viewDeal.deletionMessageTitle = $translate.instant("translations-service.view-deal.deletion-title");
            service.viewDeal.deletionMessageContent = $translate.instant("translations-service.view-deal.deletion-message");
            service.viewDeal.deletedMessage = $translate.instant("translations-service.view-deal.deleted");
            service.viewDeal.pleaseSelect = $translate.instant("translations-service.view-deal.please-select");
            service.viewDeal.blankComment = $translate.instant("translations-service.view-deal.blank-comment");
            service.viewDeal.downloadFailed = $translate.instant("translations-service.view-deal.download-failed");
            service.viewDeal.addComment = $translate.instant("translations-service.view-deal.add-comment");
            service.viewDeal.addFirstComment = $translate.instant("translations-service.view-deal.add-first-comment");
            service.viewDeal.deleteProductTitle = $translate.instant("translations-service.view-deal.delete-product-title");
            service.viewDeal.deleteProductContent = $translate.instant("translations-service.view-deal.delete-product-content");
            service.viewDeal.deleteProductConfirm = $translate.instant("translations-service.view-deal.delete-product-confirm");
            service.viewDeal.outOfStockTitle = $translate.instant("translations-service.view-deal.out-of-stock-title");
            service.viewDeal.outOfStockContent = $translate.instant("translations-service.view-deal.out-of-stock-content");
            service.viewDeal.notEnoughStockTitle = $translate.instant("translations-service.view-deal.not-enough-stock-title");
            service.viewDeal.notEnoughStockContent1 = $translate.instant("translations-service.view-deal.not-enough-stock-content-1");
            service.viewDeal.notEnoughStockContent2 = $translate.instant("translations-service.view-deal.not-enough-stock-content-2");
            service.viewDeal.validQuantity = $translate.instant("translations-service.view-deal.valid-quantity");
            service.viewDeal.maxQuantity = $translate.instant("translations-service.view-deal.max-quantity");

            // Products Grid
            service.productsGrid.noProducts = $translate.instant("translations-service.products-grid.no-products");
            service.productsGrid.didntFind = $translate.instant("translations-service.products-grid.didnt-find");
            service.productsGrid.currentlyNoProducts = $translate.instant("translations-service.products-grid.currently-no-products");
            service.productsGrid.noProductsInterests = $translate.instant("translations-service.products-grid.no-products-interests");

            // Add Product & Edit Product
            service.productEdit.addDiscount = $translate.instant("translations-service.product-edit.add-discount");
            service.productEdit.removeDiscount = $translate.instant("translations-service.product-edit.remove-discount");
            service.productEdit.submitTitleNext = $translate.instant("translations-service.product-edit.submit-title-next");
            service.productEdit.submitTitleDone = $translate.instant("translations-service.product-edit.submit-title-done");
            service.productEdit.uploadLoading = $translate.instant("translations-service.product-edit.upload-loading");
            service.productEdit.missingPhotosTitle = $translate.instant("translations-service.product-edit.missing-photos-title");
            service.productEdit.missingPhotosContent = $translate.instant("translations-service.product-edit.missing-photos-content");
            service.productEdit.blankTitle = $translate.instant("translations-service.product-edit.blank-title");
            service.productEdit.blankTitleContent = $translate.instant("translations-service.product-edit.blank-title-content");
            service.productEdit.blankPriceTitle = $translate.instant("translations-service.product-edit.blank-price-title");
            service.productEdit.blankPriceContent = $translate.instant("translations-service.product-edit.blank-price-content");
            service.productEdit.invalidPriceTitle = $translate.instant("translations-service.product-edit.invalid-price-title");
            service.productEdit.invalidPriceContent = $translate.instant("translations-service.product-edit.invalid-price-content");
            service.productEdit.invalidDiscountTitle = $translate.instant("translations-service.product-edit.invalid-discount-title");
            service.productEdit.invalidDiscountContent = $translate.instant("translations-service.product-edit.invalid-discount-content");
            service.productEdit.invalidDiscountContent100 = $translate.instant("translations-service.product-edit.invalid-discount-content-100");
            service.productEdit.invalidDiscountContentOP = $translate.instant("translations-service.product-edit.invalid-discount-content-op");
            service.productEdit.invalidMaxQuantityTitle = $translate.instant("translations-service.product-edit.invalid-max-quantity-title");
            service.productEdit.invalidMaxQuantityContent = $translate.instant("translations-service.product-edit.invalid-max-quantity-content");
            service.productEdit.blankCategoryTitle = $translate.instant("translations-service.product-edit.blank-category-title");
            service.productEdit.blankCategoryContent = $translate.instant("translations-service.product-edit.blank-category-content");
            service.productEdit.placeholderNames = [
                $translate.instant('translations-service.product-edit.variants-placeholder-names-1'),
                $translate.instant('translations-service.product-edit.variants-placeholder-names-2'),
                $translate.instant('translations-service.product-edit.variants-placeholder-names-3')
            ];
            service.productEdit.placeholderOptions = [
                $translate.instant('translations-service.product-edit.variants-placeholder-options-1'),
                $translate.instant('translations-service.product-edit.variants-placeholder-options-2'),
                $translate.instant('translations-service.product-edit.variants-placeholder-options-3')
            ];

            // Shipping Methods
            service.shippingMethods.blankTitle = $translate.instant("translations-service.shipping-methods.blank-title");
            service.shippingMethods.blankTitleContent = $translate.instant("translations-service.shipping-methods.blank-title-content");
            service.shippingMethods.invalidShippingPriceTitle = $translate.instant("translations-service.shipping-methods.invalid-shipping-price-title");
            service.shippingMethods.invalidShippingPriceContent = $translate.instant("translations-service.shipping-methods.invalid-shipping-price-content");
            service.shippingMethods.invalidETDTitle = $translate.instant("translations-service.shipping-methods.invalid-etd-title");
            service.shippingMethods.invalidETDContent = $translate.instant("translations-service.shipping-methods.invalid-etd-content");
            service.shippingMethods.noShippingMethodsTitle = $translate.instant("translations-service.shipping-methods.no-shipping-methods-title");
            service.shippingMethods.noShippingMethodsContent = $translate.instant("translations-service.shipping-methods.no-shipping-methods-content");

            // Purchase Details
            service.purchaseDetails.purchased = $translate.instant("translations-service.purchase-details.purchased");
            service.purchaseDetails.sent = $translate.instant("translations-service.purchase-details.sent");
            service.purchaseDetails.markSent = $translate.instant("translations-service.purchase-details.mark-sent");
            service.purchaseDetails.received = $translate.instant("translations-service.purchase-details.received");
            service.purchaseDetails.markReceived = $translate.instant("translations-service.purchase-details.mark-received");
            service.purchaseDetails.markReceivedConfirmTitle = $translate.instant("translations-service.purchase-details.mark-received-confirm-title");
            service.purchaseDetails.markReceivedConfirmContent = $translate.instant("translations-service.purchase-details.mark-received-confirm-content");
            service.purchaseDetails.markReceivedCancelTitle = $translate.instant("translations-service.purchase-details.mark-received-cancel-title");
            service.purchaseDetails.markReceivedCancelContent = $translate.instant("translations-service.purchase-details.mark-received-cancel-content");
            service.purchaseDetails.markReceivedCancelApprove = $translate.instant("translations-service.purchase-details.mark-received-cancel-approve");
            service.purchaseDetails.markSentConfirmTitle = $translate.instant("translations-service.purchase-details.mark-sent-confirm-title");
            service.purchaseDetails.markSentConfirmContent = $translate.instant("translations-service.purchase-details.mark-sent-confirm-content");
            service.purchaseDetails.markSentConfirmPlaceholder = $translate.instant("translations-service.purchase-details.mark-sent-confirm-placeholder");
            service.purchaseDetails.markSentConfirmApprove = $translate.instant("translations-service.purchase-details.mark-sent-confirm-approve");
            service.purchaseDetails.markSentCancelTitle = $translate.instant("translations-service.purchase-details.mark-sent-cancel-title");
            service.purchaseDetails.markSentCancelContent = $translate.instant("translations-service.purchase-details.mark-sent-cancel-content");
            service.purchaseDetails.markSentCancelApprove = $translate.instant("translations-service.purchase-details.mark-send-cancel-approve");
            service.purchaseDetails.blankETDTitle = $translate.instant("translations-service.purchase-details.blank-etd-title");
            service.purchaseDetails.blankETDContent = $translate.instant("translations-service.purchase-details.blank-etd-content");

            service.signIn.signUpButtonTitle = $translate.instant("translations-service.sign-in.sign-up-button-title");
            service.signIn.logInButtonTitle = $translate.instant("translations-service.sign-in.log-in-button-title");
            service.signIn.loading = $translate.instant("translations-service.sign-in.loading");
            service.signIn.invalidFields = $translate.instant("translations-service.sign-in.invalid-fields");
            service.signIn.blankEmail = $translate.instant("translations-service.sign-in.blank-email");
            service.signIn.invalidEmail = $translate.instant("translations-service.sign-in.invalid-email");
            service.signIn.blankPassword = $translate.instant("translations-service.sign-in.blank-password");
            service.signIn.generalProblem = $translate.instant("translations-service.sign-in.general-problem");

            service.dealerRegistration.next = $translate.instant("translations-service.dealer-registration.next");
            service.dealerRegistration.done = $translate.instant("translations-service.dealer-registration.done");
            service.dealerRegistration.addPhoto = $translate.instant("translations-service.dealer-registration.add-photo");
            service.dealerRegistration.changePhoto = $translate.instant("translations-service.dealer-registration.change-photo");
            service.dealerRegistration.uploading = $translate.instant("translations-service.dealer-registration.uploading");
            service.dealerRegistration.contentWillBeLost = $translate.instant("translations-service.dealer-registration.content-will-be-lost");
            service.dealerRegistration.contentWillBeLostFullMessage = $translate.instant("translations-service.dealer-registration.content-will-be-lost-full-message");
            service.dealerRegistration.missingPhotoTitle = $translate.instant("translations-service.dealer-registration.missing-photo-title");
            service.dealerRegistration.missingPhotoContent = $translate.instant("translations-service.dealer-registration.missing-photo-content");
            service.dealerRegistration.blankAboutTitle = $translate.instant("translations-service.dealer-registration.blank-about-title");
            service.dealerRegistration.blankLocationTitle = $translate.instant("translations-service.dealer-registration.blank-location-title");
            service.dealerRegistration.requiredField = $translate.instant("translations-service.dealer-registration.required-field");
            service.dealerRegistration.blankAccountNumberTitle = $translate.instant("translations-service.dealer-registration.blank-account-number-title");
            service.dealerRegistration.blankBranchNumberTitle = $translate.instant("translations-service.dealer-registration.blank-branch-number-title");
            service.dealerRegistration.blankBankTitle = $translate.instant("translations-service.dealer-registration.blank-bank-title");
            service.dealerRegistration.blankAccountHolderTitle = $translate.instant("translations-service.dealer-registration.blank-account-holder-title");
            service.dealerRegistration.accountNumberDuplicateTitle = $translate.instant("translations-service.dealer-registration.account-number-duplicate-title");
            service.dealerRegistration.accountNumberDuplicateContent = $translate.instant("translations-service.dealer-registration.account-number-duplicate-content");
            service.dealerRegistration.generalProblemTitle = $translate.instant("translations-service.dealer-registration.general-problem-title");
            service.dealerRegistration.generalProblemContent = $translate.instant("translations-service.dealer-registration.general-problem-content");

            service.checkout.invalidQuantityTitle = $translate.instant("translations-service.checkout.invalid-quantity-title");
            service.checkout.invalidQuantityContent = $translate.instant("translations-service.checkout.invalid-quantity-content");
            service.checkout.blankDelivery = $translate.instant("translations-service.checkout.blank-delivery");
            service.checkout.invalidShippingAddressTitle = $translate.instant("translations-service.checkout.invalid-shipping-address-title");
            service.checkout.invalidShippingAddressContent = $translate.instant("translations-service.checkout.invalid-shipping-address-content");
        }

        $rootScope.$on('$translateChangeSuccess', function () {
            loadTranslations();
        });
        
        return service;
    });