/**
 * @license AngularJS v1.5.8
 * (c) 2010-2016 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular) {'use strict';

/**
 * @ngdoc module
 * @name ngCookies
 * @description
 *
 * # ngCookies
 *
 * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
 *
 *
 * <div doc-module-components="ngCookies"></div>
 *
 * See {@link ngCookies.$cookies `$cookies`} for usage.
 */


angular.module('ngCookies', ['ng']).
  /**
   * @ngdoc provider
   * @name $cookiesProvider
   * @description
   * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
   * */
   provider('$cookies', [function $CookiesProvider() {
    /**
     * @ngdoc property
     * @name $cookiesProvider#defaults
     * @description
     *
     * Object containing default options to pass when setting cookies.
     *
     * The object may have following properties:
     *
     * - **path** - `{string}` - The cookie will be available only for this path and its
     *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
     * - **domain** - `{string}` - The cookie will be available only for this domain and
     *   its sub-domains. For security reasons the user agent will not accept the cookie
     *   if the current domain is not a sub-domain of this domain or equal to it.
     * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
     *   or a Date object indicating the exact date/time this cookie will expire.
     * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
     *   secured connection.
     *
     * Note: By default, the address that appears in your `<base>` tag will be used as the path.
     * This is important so that cookies will be visible for all routes when html5mode is enabled.
     *
     **/
    var defaults = this.defaults = {};

    function calcOptions(options) {
      return options ? angular.extend({}, defaults, options) : defaults;
    }

    /**
     * @ngdoc service
     * @name $cookies
     *
     * @description
     * Provides read/write access to browser's cookies.
     *
     * <div class="alert alert-info">
     * Up until Angular 1.3, `$cookies` exposed properties that represented the
     * current browser cookie values. In version 1.4, this behavior has changed, and
     * `$cookies` now provides a standard api of getters, setters etc.
     * </div>
     *
     * Requires the {@link ngCookies `ngCookies`} module to be installed.
     *
     * @example
     *
     * ```js
     * angular.module('cookiesExample', ['ngCookies'])
     *   .controller('ExampleController', ['$cookies', function($cookies) {
     *     // Retrieving a cookie
     *     var favoriteCookie = $cookies.get('myFavorite');
     *     // Setting a cookie
     *     $cookies.put('myFavorite', 'oatmeal');
     *   }]);
     * ```
     */
    this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
      return {
        /**
         * @ngdoc method
         * @name $cookies#get
         *
         * @description
         * Returns the value of given cookie key
         *
         * @param {string} key Id to use for lookup.
         * @returns {string} Raw cookie value.
         */
        get: function(key) {
          return $$cookieReader()[key];
        },

        /**
         * @ngdoc method
         * @name $cookies#getObject
         *
         * @description
         * Returns the deserialized value of given cookie key
         *
         * @param {string} key Id to use for lookup.
         * @returns {Object} Deserialized cookie value.
         */
        getObject: function(key) {
          var value = this.get(key);
          return value ? angular.fromJson(value) : value;
        },

        /**
         * @ngdoc method
         * @name $cookies#getAll
         *
         * @description
         * Returns a key value object with all the cookies
         *
         * @returns {Object} All cookies
         */
        getAll: function() {
          return $$cookieReader();
        },

        /**
         * @ngdoc method
         * @name $cookies#put
         *
         * @description
         * Sets a value for given cookie key
         *
         * @param {string} key Id for the `value`.
         * @param {string} value Raw value to be stored.
         * @param {Object=} options Options object.
         *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
         */
        put: function(key, value, options) {
          $$cookieWriter(key, value, calcOptions(options));
        },

        /**
         * @ngdoc method
         * @name $cookies#putObject
         *
         * @description
         * Serializes and sets a value for given cookie key
         *
         * @param {string} key Id for the `value`.
         * @param {Object} value Value to be stored.
         * @param {Object=} options Options object.
         *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
         */
        putObject: function(key, value, options) {
          this.put(key, angular.toJson(value), options);
        },

        /**
         * @ngdoc method
         * @name $cookies#remove
         *
         * @description
         * Remove given cookie
         *
         * @param {string} key Id of the key-value pair to delete.
         * @param {Object=} options Options object.
         *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
         */
        remove: function(key, options) {
          $$cookieWriter(key, undefined, calcOptions(options));
        }
      };
    }];
  }]);

angular.module('ngCookies').
/**
 * @ngdoc service
 * @name $cookieStore
 * @deprecated
 * @requires $cookies
 *
 * @description
 * Provides a key-value (string-object) storage, that is backed by session cookies.
 * Objects put or retrieved from this storage are automatically serialized or
 * deserialized by angular's toJson/fromJson.
 *
 * Requires the {@link ngCookies `ngCookies`} module to be installed.
 *
 * <div class="alert alert-danger">
 * **Note:** The $cookieStore service is **deprecated**.
 * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
 * </div>
 *
 * @example
 *
 * ```js
 * angular.module('cookieStoreExample', ['ngCookies'])
 *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
 *     // Put cookie
 *     $cookieStore.put('myFavorite','oatmeal');
 *     // Get cookie
 *     var favoriteCookie = $cookieStore.get('myFavorite');
 *     // Removing a cookie
 *     $cookieStore.remove('myFavorite');
 *   }]);
 * ```
 */
 factory('$cookieStore', ['$cookies', function($cookies) {

    return {
      /**
       * @ngdoc method
       * @name $cookieStore#get
       *
       * @description
       * Returns the value of given cookie key
       *
       * @param {string} key Id to use for lookup.
       * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
       */
      get: function(key) {
        return $cookies.getObject(key);
      },

      /**
       * @ngdoc method
       * @name $cookieStore#put
       *
       * @description
       * Sets a value for given cookie key
       *
       * @param {string} key Id for the `value`.
       * @param {Object} value Value to be stored.
       */
      put: function(key, value) {
        $cookies.putObject(key, value);
      },

      /**
       * @ngdoc method
       * @name $cookieStore#remove
       *
       * @description
       * Remove given cookie
       *
       * @param {string} key Id of the key-value pair to delete.
       */
      remove: function(key) {
        $cookies.remove(key);
      }
    };

  }]);

/**
 * @name $$cookieWriter
 * @requires $document
 *
 * @description
 * This is a private service for writing cookies
 *
 * @param {string} name Cookie name
 * @param {string=} value Cookie value (if undefined, cookie will be deleted)
 * @param {Object=} options Object with options that need to be stored for the cookie.
 */
function $$CookieWriter($document, $log, $browser) {
  var cookiePath = $browser.baseHref();
  var rawDocument = $document[0];

  function buildCookieString(name, value, options) {
    var path, expires;
    options = options || {};
    expires = options.expires;
    path = angular.isDefined(options.path) ? options.path : cookiePath;
    if (angular.isUndefined(value)) {
      expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
      value = '';
    }
    if (angular.isString(expires)) {
      expires = new Date(expires);
    }

    var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    str += path ? ';path=' + path : '';
    str += options.domain ? ';domain=' + options.domain : '';
    str += expires ? ';expires=' + expires.toUTCString() : '';
    str += options.secure ? ';secure' : '';

    // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
    // - 300 cookies
    // - 20 cookies per unique domain
    // - 4096 bytes per cookie
    var cookieLength = str.length + 1;
    if (cookieLength > 4096) {
      $log.warn("Cookie '" + name +
        "' possibly not set or overflowed because it was too large (" +
        cookieLength + " > 4096 bytes)!");
    }

    return str;
  }

  return function(name, value, options) {
    rawDocument.cookie = buildCookieString(name, value, options);
  };
}

$$CookieWriter.$inject = ['$document', '$log', '$browser'];

angular.module('ngCookies').provider('$$cookieWriter', function $$CookieWriterProvider() {
  this.$get = $$CookieWriter;
});


})(window, window.angular);

/*global angular document navigator*/
(function withAngular(angular, navigator) {

  'use strict';

  var A_DAY_IN_MILLISECONDS = 86400000
    , isMobile = (function isMobile() {

      if (navigator.userAgent &&
        (navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i))) {

        return true;
      }
    }())
    , generateMonthAndYearHeader = function generateMonthAndYearHeader(prevButton, nextButton) {

      if (isMobile) {

        return [
          '<div class="_720kb-datepicker-calendar-header">',
            '<div class="_720kb-datepicker-calendar-header-middle _720kb-datepicker-mobile-item _720kb-datepicker-calendar-month">',
              '<select ng-model="month" title="{{ dateMonthTitle }}" ng-change="selectedMonthHandle(month)">',
                '<option ng-repeat="item in months" ng-selected="item === month" ng-disabled=\'!isSelectableMaxDate(item + " " + day + ", " + year) || !isSelectableMinDate(item + " " + day + ", " + year)\' ng-value="$index + 1" value="$index + 1">',
                  '{{ item }}',
                '</option>',
              '</select>',
            '</div>',
          '</div>',
          '<div class="_720kb-datepicker-calendar-header">',
            '<div class="_720kb-datepicker-calendar-header-middle _720kb-datepicker-mobile-item _720kb-datepicker-calendar-month">',
              '<select ng-model="mobileYear" title="{{ dateYearTitle }}" ng-change="setNewYear(mobileYear)">',
                '<option ng-repeat="item in paginationYears track by $index" ng-selected="year === item" ng-disabled="!isSelectableMinYear(item) || !isSelectableMaxYear(item)" ng-value="item" value="item">',
                  '{{ item }}',
                '</option>',
              '</select>',
            '</div>',
          '</div>'
        ];
      }

      return [
        '<div class="_720kb-datepicker-calendar-header">',
          '<div class="_720kb-datepicker-calendar-header-left">',
            '<a class="_720kb-datepicker-calendar-month-button" href="javascript:void(0)" ng-class="{\'_720kb-datepicker-item-hidden\': !willPrevMonthBeSelectable()}" ng-click="prevMonth()" title="{{ buttonPrevTitle }}">',
              prevButton,
            '</a>',
          '</div>',
          '<div class="_720kb-datepicker-calendar-header-middle _720kb-datepicker-calendar-month">',
            '{{month}}&nbsp;',
            '<a href="javascript:void(0)" ng-click="paginateYears(year); showYearsPagination = !showYearsPagination;">',
              '<span>',
                '{{year}}',
                '<i ng-class="{\'_720kb-datepicker-calendar-header-closed-pagination\': !showYearsPagination, \'_720kb-datepicker-calendar-header-opened-pagination\': showYearsPagination}"></i>',
              '</span>',
            '</a>',
          '</div>',
          '<div class="_720kb-datepicker-calendar-header-right">',
          '<a class="_720kb-datepicker-calendar-month-button" ng-class="{\'_720kb-datepicker-item-hidden\': !willNextMonthBeSelectable()}" href="javascript:void(0)" ng-click="nextMonth()" title="{{ buttonNextTitle }}">',
            nextButton,
          '</a>',
          '</div>',
        '</div>'
      ];
    }
    , generateYearsPaginationHeader = function generateYearsPaginationHeader(prevButton, nextButton) {

      return [
        '<div class="_720kb-datepicker-calendar-header" ng-show="showYearsPagination">',
          '<div class="_720kb-datepicker-calendar-years-pagination">',
            '<a ng-class="{\'_720kb-datepicker-active\': y === year, \'_720kb-datepicker-disabled\': !isSelectableMaxYear(y) || !isSelectableMinYear(y)}" href="javascript:void(0)" ng-click="setNewYear(y)" ng-repeat="y in paginationYears track by $index">',
              '{{y}}',
            '</a>',
          '</div>',
          '<div class="_720kb-datepicker-calendar-years-pagination-pages">',
            '<a href="javascript:void(0)" ng-click="paginateYears(paginationYears[0])" ng-class="{\'_720kb-datepicker-item-hidden\': paginationYearsPrevDisabled}">',
              prevButton,
            '</a>',
            '<a href="javascript:void(0)" ng-click="paginateYears(paginationYears[paginationYears.length -1 ])" ng-class="{\'_720kb-datepicker-item-hidden\': paginationYearsNextDisabled}">',
              nextButton,
            '</a>',
          '</div>',
        '</div>'
      ];
    }
    , generateDaysColumns = function generateDaysColumns() {

      return [
      '<div class="_720kb-datepicker-calendar-days-header">',
        '<div ng-repeat="d in daysInString">',
          '{{d}}',
        '</div>',
      '</div>'
      ];
    }
    , generateDays = function generateDays() {

      return [
        '<div class="_720kb-datepicker-calendar-body">',
          '<a href="javascript:void(0)" ng-repeat="px in prevMonthDays" class="_720kb-datepicker-calendar-day _720kb-datepicker-disabled">',
            '{{px}}',
          '</a>',
          '<a href="javascript:void(0)" ng-repeat="item in days" ng-click="setDatepickerDay(item)" ng-class="{\'_720kb-datepicker-active\': day === item, \'_720kb-datepicker-disabled\': !isSelectableMinDate(year + \'/\' + monthNumber + \'/\' + item ) || !isSelectableMaxDate(year + \'/\' + monthNumber + \'/\' + item) || !isSelectableDate(monthNumber, year, item)}" class="_720kb-datepicker-calendar-day">',
            '{{item}}',
          '</a>',
          '<a href="javascript:void(0)" ng-repeat="nx in nextMonthDays" class="_720kb-datepicker-calendar-day _720kb-datepicker-disabled">',
            '{{nx}}',
          '</a>',
        '</div>'
      ];
    }
    , generateHtmlTemplate = function generateHtmlTemplate(prevButton, nextButton) {

      var toReturn = [
        '<div class="_720kb-datepicker-calendar {{datepickerClass}} {{datepickerID}}" ng-class="{\'_720kb-datepicker-forced-to-open\': checkVisibility()}" ng-blur="hideCalendar()">',
        '</div>'
      ]
      , monthAndYearHeader = generateMonthAndYearHeader(prevButton, nextButton)
      , yearsPaginationHeader = generateYearsPaginationHeader(prevButton, nextButton)
      , daysColumns = generateDaysColumns()
      , days = generateDays()
      , iterator = function iterator(aRow) {

        toReturn.splice(toReturn.length - 1, 0, aRow);
      };

      monthAndYearHeader.forEach(iterator);
      yearsPaginationHeader.forEach(iterator);
      daysColumns.forEach(iterator);
      days.forEach(iterator);

      return toReturn.join('');
    }
    , datepickerDirective = function datepickerDirective($window, $compile, $locale, $filter, $interpolate) {

      var linkingFunction = function linkingFunction($scope, element, attr) {

        //get child input
        var selector = attr.selector
          , thisInput = angular.element(selector ? element[0].querySelector('.' + selector) : element[0].children[0])
          , theCalendar
          , defaultPrevButton = '<b class="_720kb-datepicker-default-button">&lang;</b>'
          , defaultNextButton = '<b class="_720kb-datepicker-default-button">&rang;</b>'
          , prevButton = attr.buttonPrev || defaultPrevButton
          , nextButton = attr.buttonNext || defaultNextButton
          , dateFormat = attr.dateFormat
          //, dateMinLimit
          //, dateMaxLimit
          , dateDisabledDates = $scope.$eval($scope.dateDisabledDates)
          , date = new Date()
          , isMouseOn = false
          , isMouseOnInput = false
          , datetime = $locale.DATETIME_FORMATS
          , pageDatepickers
          , hours24h = 86400000
          , htmlTemplate = generateHtmlTemplate(prevButton, nextButton)
          , onClickOnWindow = function onClickOnWindow() {

            if (!isMouseOn &&
              !isMouseOnInput && theCalendar) {

              $scope.hideCalendar();
            }
          }
          , resetToMinDate = function resetToMinDate() {

            $scope.month = $filter('date')(new Date($scope.dateMinLimit), 'MMMM');
            $scope.monthNumber = Number($filter('date')(new Date($scope.dateMinLimit), 'MM'));
            $scope.day = Number($filter('date')(new Date($scope.dateMinLimit), 'dd'));
            $scope.year = Number($filter('date')(new Date($scope.dateMinLimit), 'yyyy'));
          }
          , resetToMaxDate = function resetToMaxDate() {

            $scope.month = $filter('date')(new Date($scope.dateMaxLimit), 'MMMM');
            $scope.monthNumber = Number($filter('date')(new Date($scope.dateMaxLimit), 'MM'));
            $scope.day = Number($filter('date')(new Date($scope.dateMaxLimit), 'dd'));
            $scope.year = Number($filter('date')(new Date($scope.dateMaxLimit), 'yyyy'));
          }
          , prevYear = function prevYear() {

            $scope.year = Number($scope.year) - 1;
          }
          , nextYear = function nextYear() {

            $scope.year = Number($scope.year) + 1;
          }
          , setInputValue = function setInputValue() {

            if ($scope.isSelectableMinDate($scope.year + '/' + $scope.monthNumber + '/' + $scope.day) &&
                $scope.isSelectableMaxDate($scope.year + '/' + $scope.monthNumber + '/' + $scope.day)) {

              var modelDate = new Date($scope.year + '/' + $scope.monthNumber + '/' + $scope.day);

              if (attr.dateFormat) {

                thisInput.val($filter('date')(modelDate, dateFormat));
              } else {

                thisInput.val(modelDate);
              }

              thisInput.triggerHandler('input');
              thisInput.triggerHandler('change');//just to be sure;
            } else {

              return false;
            }
          }
          , classHelper = {
            'add': function add(ele, klass) {
              var classes;

              if (ele.className.indexOf(klass) > -1) {

                return;
              }

              classes = ele.className.split(' ');
              classes.push(klass);
              ele.className = classes.join(' ');
            },
            'remove': function remove(ele, klass) {
              var i
                , classes;

              if (ele.className.indexOf(klass) === -1) {

                return;
              }

              classes = ele.className.split(' ');
              for (i = 0; i < classes.length; i += 1) {

                if (classes[i] === klass) {

                  classes = classes.slice(0, i).concat(classes.slice(i + 1));
                  break;
                }
              }
              ele.className = classes.join(' ');
            }
          }
          , showCalendar = function showCalendar() {
            //lets hide all the latest instances of datepicker
            pageDatepickers = $window.document.getElementsByClassName('_720kb-datepicker-calendar');

            angular.forEach(pageDatepickers, function forEachDatepickerPages(value, key) {
              if (pageDatepickers[key].classList) {

                pageDatepickers[key].classList.remove('_720kb-datepicker-open');
              } else {

                classHelper.remove(pageDatepickers[key], '_720kb-datepicker-open');
              }
            });

            if (theCalendar.classList) {

              theCalendar.classList.add('_720kb-datepicker-open');
            } else {

              classHelper.add(theCalendar, '_720kb-datepicker-open');
            }
          }
          , checkToggle = function checkToggle() {
            if (!$scope.datepickerToggle) {

              return true;
            }

            return $scope.$eval($scope.datepickerToggle);
          }
          , checkVisibility = function checkVisibility() {
            if (!$scope.datepickerShow) {

              return false;
            }
            return $scope.$eval($scope.datepickerShow);
          }
          , setDaysInMonth = function setDaysInMonth(month, year) {

            var i
              , limitDate = new Date(year, month, 0).getDate()
              , firstDayMonthNumber = new Date(year + '/' + month + '/' + 1).getDay()
              , lastDayMonthNumber = new Date(year + '/' + month + '/' + limitDate).getDay()
              , prevMonthDays = []
              , nextMonthDays = []
              , howManyNextDays
              , howManyPreviousDays
              , monthAlias;

            $scope.days = [];

            for (i = 1; i <= limitDate; i += 1) {

              $scope.days.push(i);
            }

            //get previous month days is first day in month is not Sunday
            if (firstDayMonthNumber === 0) {

              //no need for it
              $scope.prevMonthDays = [];
            } else {

              howManyPreviousDays = firstDayMonthNumber;
              //get previous month
              if (Number(month) === 1) {

                monthAlias = 12;
              } else {

                monthAlias = month - 1;
              }
              //return previous month days
              for (i = 1; i <= new Date(year, monthAlias, 0).getDate(); i += 1) {

                prevMonthDays.push(i);
              }
              //attach previous month days
              $scope.prevMonthDays = prevMonthDays.slice(-howManyPreviousDays);
            }

            //get next month days is first day in month is not Sunday
            if (lastDayMonthNumber < 6) {

              howManyNextDays = 6 - lastDayMonthNumber;
              //get previous month

              //return next month days
              for (i = 1; i <= howManyNextDays; i += 1) {

                nextMonthDays.push(i);
              }
              //attach previous month days
              $scope.nextMonthDays = nextMonthDays;
            } else {
              //no need for it
              $scope.nextMonthDays = [];
            }
          }
          , unregisterDataSetWatcher = $scope.$watch('dateSet', function dateSetWatcher(newValue) {

            if (newValue) {

              date = new Date(newValue);

              $scope.month = $filter('date')(date, 'MMMM');//december-November like
              $scope.monthNumber = Number($filter('date')(date, 'MM')); // 01-12 like
              $scope.day = Number($filter('date')(date, 'dd')); //01-31 like
              $scope.year = Number($filter('date')(date, 'yyyy'));//2014 like

              setDaysInMonth($scope.monthNumber, $scope.year);

              if ($scope.dateSetHidden !== 'true') {

                setInputValue();
              }
            }
          });

        $scope.nextMonth = function nextMonth() {

          if ($scope.monthNumber === 12) {

            $scope.monthNumber = 1;
            //its happy new year
            nextYear();
          } else {

            $scope.monthNumber += 1;
          }

          //check if max date is ok
          if ($scope.dateMaxLimit) {

            if (!$scope.isSelectableMaxDate($scope.year + '/' + $scope.monthNumber + '/' + $scope.days[0])) {

              resetToMaxDate();
            }
          }

          //set next month
          $scope.month = $filter('date')(new Date($scope.year, $scope.monthNumber - 1), 'MMMM');
          //reinit days
          setDaysInMonth($scope.monthNumber, $scope.year);
          //deactivate selected day
          $scope.day = undefined;
        };

        $scope.willPrevMonthBeSelectable = function willPrevMonthBeSelectable() {
          var monthNumber = $scope.monthNumber
            , year = $scope.year
            , prevDay = $filter('date')(new Date(new Date(year + '/' + monthNumber + '/01').getTime() - hours24h), 'dd'); //get last day in previous month

          if (monthNumber === 1) {

            monthNumber = 12;
            year = year - 1;
          } else {

            monthNumber -= 1;
          }

          if ($scope.dateMinLimit) {
            if (!$scope.isSelectableMinDate(year + '/' + monthNumber + '/' + prevDay)) {

              return false;
            }
          }

          return true;
        };

        $scope.willNextMonthBeSelectable = function willNextMonthBeSelectable() {
          var monthNumber = $scope.monthNumber
            , year = $scope.year;

          if (monthNumber === 12) {

            monthNumber = 1;
            year += 1;
          } else {

            monthNumber += 1;
          }

          if ($scope.dateMaxLimit) {
            if (!$scope.isSelectableMaxDate(year + '/' + monthNumber + '/01')) {

              return false;
            }
          }

          return true;
        };

        $scope.prevMonth = function managePrevMonth() {

          if ($scope.monthNumber === 1) {

            $scope.monthNumber = 12;
            //its happy new year
            prevYear();
          } else {

            $scope.monthNumber -= 1;
          }
          //check if min date is ok
          if ($scope.dateMinLimit) {

            if (!$scope.isSelectableMinDate($scope.year + '/' + $scope.monthNumber + '/' + $scope.days[$scope.days.length - 1])) {

              resetToMinDate();
            }
          }
          //set next month
          $scope.month = $filter('date')(new Date($scope.year, $scope.monthNumber - 1), 'MMMM');
          //reinit days
          setDaysInMonth($scope.monthNumber, $scope.year);
          //deactivate selected day
          $scope.day = undefined;
        };

        $scope.selectedMonthHandle = function manageSelectedMonthHandle(selectedMonthNumber) {

          $scope.monthNumber = Number($filter('date')(new Date(selectedMonthNumber + '/01/2000'), 'MM'));
          setDaysInMonth($scope.monthNumber, $scope.year);
          setInputValue();
        };

        $scope.setNewYear = function setNewYear(year) {

          //deactivate selected day
          if (!isMobile) {
            $scope.day = undefined;
          }

          if ($scope.dateMaxLimit &&
            $scope.year < Number(year)) {

            if (!$scope.isSelectableMaxYear(year)) {

              return;
            }
          } else if ($scope.dateMinLimit &&
            $scope.year > Number(year)) {

            if (!$scope.isSelectableMinYear(year)) {

              return;
            }
          }

          $scope.year = Number(year);
          setDaysInMonth($scope.monthNumber, $scope.year);
          $scope.paginateYears(year);
          $scope.showYearsPagination = false;
        };

        $scope.hideCalendar = function hideCalendar() {
          if (theCalendar.classList){
            theCalendar.classList.remove('_720kb-datepicker-open');
          } else {

            classHelper.remove(theCalendar, '_720kb-datepicker-open');
          }
        };

        $scope.setDatepickerDay = function setDatepickerDay(day) {

          if ($scope.isSelectableDate($scope.monthNumber, $scope.year, day) &&
              $scope.isSelectableMaxDate($scope.year + '/' + $scope.monthNumber + '/' + day) &&
              $scope.isSelectableMinDate($scope.year + '/' + $scope.monthNumber + '/' + day)) {

            $scope.day = Number(day);
            setInputValue();

            if (attr.hasOwnProperty('dateRefocus')) {
              thisInput[0].focus();
            }

            $scope.hideCalendar();
          }
        };

        $scope.paginateYears = function paginateYears(startingYear) {
          var i
           , theNewYears = []
           , daysToPrepend = 10
           , daysToAppend = 10;

          $scope.paginationYears = [];
          if (isMobile) {

            daysToPrepend = 50;
            daysToAppend = 50;
            if ( $scope.dateMinLimit && $scope.dateMaxLimit) {

              startingYear = new Date($scope.dateMaxLimit).getFullYear();
              daysToPrepend = startingYear - new Date($scope.dateMinLimit).getFullYear();
              daysToAppend = 1;
            }
          }

          for (i = daysToPrepend; i > 0; i -= 1) {

            theNewYears.push(Number(startingYear) - i);
          }

          for (i = 0; i < daysToAppend; i += 1) {

            theNewYears.push(Number(startingYear) + i);
          }
          //date typing in input date-typer
          if ($scope.dateTyper === 'true') {

            thisInput.on('keyup blur', function onTyping() {

              if (thisInput[0].value &&
                thisInput[0].value.length &&
                thisInput[0].value.length > 0) {

                try {

                  date = new Date(thisInput[0].value.toString());

                  if (date.getFullYear() &&
                   !isNaN(date.getDay()) &&
                   !isNaN(date.getMonth()) &&
                   $scope.isSelectableDate(date) &&
                   $scope.isSelectableMaxDate(date) &&
                   $scope.isSelectableMinDate(date)) {

                    $scope.$apply(function applyTyping() {

                      $scope.month = $filter('date')(date, 'MMMM');//december-November like
                      $scope.monthNumber = Number($filter('date')(date, 'MM')); // 01-12 like
                      $scope.day = Number($filter('date')(date, 'dd')); //01-31 like

                      if (date.getFullYear().toString().length === 4) {
                        $scope.year = Number($filter('date')(date, 'yyyy'));//2014 like
                      }
                      setDaysInMonth($scope.monthNumber, $scope.year);
                    });
                  }
                } catch (e) {

                  return e;
                }
              }
            });
          }
          //check range dates
          if ($scope.dateMaxLimit &&
            theNewYears &&
            theNewYears.length &&
            !$scope.isSelectableMaxYear(Number(theNewYears[theNewYears.length - 1]) + 1)) {

            $scope.paginationYearsNextDisabled = true;
          } else {

            $scope.paginationYearsNextDisabled = false;
          }

          if ($scope.dateMinLimit &&
            theNewYears &&
            theNewYears.length &&
            !$scope.isSelectableMinYear(Number(theNewYears[0]) - 1)) {

            $scope.paginationYearsPrevDisabled = true;
          } else {

            $scope.paginationYearsPrevDisabled = false;
          }

          $scope.paginationYears = theNewYears;
        };

        $scope.isSelectableDate = function isSelectableDate(monthNumber, year, day) {
          var i = 0;

          if (dateDisabledDates &&
            dateDisabledDates.length > 0) {

            for (i; i <= dateDisabledDates.length; i += 1) {

              if (new Date(dateDisabledDates[i]).getTime() === new Date(monthNumber + '/' + day + '/' + year).getTime()) {

                return false;
              }
            }
          }
          return true;
        };

        $scope.isSelectableMinDate = function isSelectableMinDate(aDate) {
          //if current date
          if (!!$scope.dateMinLimit &&
             !!new Date($scope.dateMinLimit) &&
             new Date(aDate).getTime() < new Date($scope.dateMinLimit).getTime()) {

            return false;
          }

          return true;
        };

        $scope.isSelectableMaxDate = function isSelectableMaxDate(aDate) {
          //if current date
          if (!!$scope.dateMaxLimit &&
             !!new Date($scope.dateMaxLimit) &&
             new Date(aDate).getTime() > new Date($scope.dateMaxLimit).getTime()) {

            return false;
          }

          return true;
        };

        $scope.isSelectableMaxYear = function isSelectableMaxYear(year) {
          if (!!$scope.dateMaxLimit &&
            year > new Date($scope.dateMaxLimit).getFullYear()) {

            return false;
          }

          return true;
        };

        $scope.isSelectableMinYear = function isSelectableMinYear(year) {
          if (!!$scope.dateMinLimit &&
            year < new Date($scope.dateMinLimit).getFullYear()) {

            return false;
          }

          return true;
        };

        // respect previously configured interpolation symbols.
        htmlTemplate = htmlTemplate.replace(/{{/g, $interpolate.startSymbol()).replace(/}}/g, $interpolate.endSymbol());
        $scope.dateMonthTitle = $scope.dateMonthTitle || 'Select month';
        $scope.dateYearTitle = $scope.dateYearTitle || 'Select year';
        $scope.buttonNextTitle = $scope.buttonNextTitle || 'Next';
        $scope.buttonPrevTitle = $scope.buttonPrevTitle || 'Prev';
        $scope.month = $filter('date')(date, 'MMMM');//december-November like
        $scope.monthNumber = Number($filter('date')(date, 'MM')); // 01-12 like
        $scope.day = Number($filter('date')(date, 'dd')); //01-31 like

        if ($scope.dateMaxLimit) {

          $scope.year = Number($filter('date')(new Date($scope.dateMaxLimit), 'yyyy'));//2014 like
        } else {

          $scope.year = Number($filter('date')(date, 'yyyy'));//2014 like
        }
        $scope.months = datetime.MONTH;
        $scope.daysInString = ['0', '1', '2', '3', '4', '5', '6'].map(function mappingFunc(el) {

          return $filter('date')(new Date(new Date('06/08/2014').valueOf() + A_DAY_IN_MILLISECONDS * el), 'EEE');
        });

        //create the calendar holder and append where needed
        if ($scope.datepickerAppendTo &&
          $scope.datepickerAppendTo.indexOf('.') !== -1) {

          $scope.datepickerID = 'datepicker-id-' + new Date().getTime() + (Math.floor(Math.random() * 6) + 8);
          angular.element(document.getElementsByClassName($scope.datepickerAppendTo.replace('.', ''))[0]).append($compile(angular.element(htmlTemplate))($scope, function afterCompile(el) {

            theCalendar = angular.element(el)[0];
          }));
        } else if ($scope.datepickerAppendTo &&
          $scope.datepickerAppendTo.indexOf('#') !== -1) {

          $scope.datepickerID = 'datepicker-id-' + new Date().getTime() + (Math.floor(Math.random() * 6) + 8);
          angular.element(document.getElementById($scope.datepickerAppendTo.replace('#', ''))).append($compile(angular.element(htmlTemplate))($scope, function afterCompile(el) {

            theCalendar = angular.element(el)[0];
          }));
        } else if ($scope.datepickerAppendTo &&
          $scope.datepickerAppendTo === 'body') {
          $scope.datepickerID = 'datepicker-id-' + (new Date().getTime() + (Math.floor(Math.random() * 6) + 8));
          angular.element(document).find('body').append($compile(angular.element(htmlTemplate))($scope, function afterCompile(el) {

            theCalendar = angular.element(el)[0];
          }));
        } else {

          thisInput.after($compile(angular.element(htmlTemplate))($scope));
          //get the calendar as element
          theCalendar = element[0].querySelector('._720kb-datepicker-calendar');
        }
        //if datepicker-toggle="" is not present or true by default
        if (checkToggle()) {

          thisInput.on('focus click focusin', function onFocusAndClick() {

            isMouseOnInput = true;

            if (!isMouseOn &&
            !isMouseOnInput && theCalendar) {

              $scope.hideCalendar();
            } else {

              showCalendar();
            }
          });
        }

        thisInput.on('focusout blur', function onBlurAndFocusOut() {

          isMouseOnInput = false;
        });
        //some tricky dirty events to fire if click is outside of the calendar and show/hide calendar when needed
        angular.element(theCalendar).on('mouseenter', function onMouseEnter() {

          isMouseOn = true;
        });

        angular.element(theCalendar).on('mouseleave', function onMouseLeave() {

          isMouseOn = false;
        });

        angular.element(theCalendar).on('focusin', function onCalendarFocus() {

          isMouseOn = true;
        });

        angular.element($window).on('click focus focusin', onClickOnWindow);

        //check always if given range of dates is ok
        if ($scope.dateMinLimit &&
          !$scope.isSelectableMinYear($scope.year) ||
          !$scope.isSelectableMinDate($scope.year + '/' + $scope.monthNumber + '/' + $scope.day)) {

          resetToMinDate();
        }

        if ($scope.dateMaxLimit &&
          !$scope.isSelectableMaxYear($scope.year) ||
          !$scope.isSelectableMaxDate($scope.year + '/' + $scope.monthNumber + '/' + $scope.day)) {

          resetToMaxDate();
        }

        //datepicker boot start
        $scope.paginateYears($scope.year);

        setDaysInMonth($scope.monthNumber, $scope.year);
        $scope.checkVisibility = checkVisibility;

        $scope.$on('$destroy', function unregisterListener() {

          unregisterDataSetWatcher();
          thisInput.off('focus click focusout blur');
          angular.element(theCalendar).off('mouseenter mouseleave focusin');
          angular.element($window).off('click focus focusin', onClickOnWindow);
        });
      };

      return {
        'restrict': 'AEC',
        'scope': {
          'dateSet': '@',
          'dateMinLimit': '@',
          'dateMaxLimit': '@',
          'dateMonthTitle': '@',
          'dateYearTitle': '@',
          'buttonNextTitle': '@',
          'buttonPrevTitle': '@',
          'dateDisabledDates': '@',
          'dateSetHidden': '@',
          'dateTyper': '@',
          'datepickerAppendTo': '@',
          'datepickerToggle': '@',
          'datepickerClass': '@',
          'datepickerShow': '@'
        },
        'link': linkingFunction
      };
    };

  angular.module('720kb.datepicker', [])
               .directive('datepicker', ['$window', '$compile', '$locale', '$filter', '$interpolate', datepickerDirective]);
}(angular, navigator));

/**
 * Angular Google Analytics - Easy tracking for your AngularJS application
 * @version v1.1.7 - 2016-03-25
 * @link http://github.com/revolunet/angular-google-analytics
 * @author Julien Bouquillon <julien@revolunet.com> (https://github.com/revolunet)
 * @contributors Julien Bouquillon (https://github.com/revolunet),Justin Saunders (https://github.com/justinsa),Chris Esplin (https://github.com/deltaepsilon),Adam Misiorny (https://github.com/adam187)
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
/* globals define */
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['angular'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('angular'));
  } else {
    factory(root.angular);
  }
}(this, function (angular, undefined) {
  'use strict';
  angular.module('angular-google-analytics', [])
    .provider('Analytics', function () {
      var accounts,
          analyticsJS = true,
          cookieConfig = 'auto', // DEPRECATED
          created = false,
          crossDomainLinker = false,
          crossLinkDomains,
          currency = 'USD',
          debugMode = false,
          delayScriptTag = false,
          displayFeatures = false,
          disableAnalytics = false,
          domainName,
          ecommerce = false,
          enhancedEcommerce = false,
          enhancedLinkAttribution = false,
          experimentId,
          ignoreFirstPageLoad = false,
          logAllCalls = false,
          hybridMobileSupport = false,
          offlineMode = false,
          pageEvent = '$routeChangeSuccess',
          readFromRoute = false,
          removeRegExp,
          testMode = false,
          traceDebuggingMode = false,
          trackPrefix = '',
          trackRoutes = true,
          trackUrlParams = false;

      this.log = [];
      this.offlineQueue = [];

      /**
       * Configuration Methods
       **/

      this.setAccount = function (tracker) {
        if (angular.isUndefined(tracker) || tracker === false) {
          accounts = undefined;
        } else if (angular.isArray(tracker)) {
          accounts = tracker;
        } else if (angular.isObject(tracker)) {
          accounts = [tracker];
        } else {
          // In order to preserve an existing behavior with how the _trackEvent function works,
          // the trackEvent property must be set to true when there is only a single tracker.
          accounts = [{ tracker: tracker, trackEvent: true }];
        }
        return this;
      };

      this.trackPages = function (val) {
        trackRoutes = !!val;
        return this;
      };

      this.trackPrefix = function (prefix) {
        trackPrefix = prefix;
        return this;
      };

      this.setDomainName = function (domain) {
        domainName = domain;
        return this;
      };

      this.useDisplayFeatures = function (val) {
        displayFeatures = !!val;
        return this;
      };

      this.useAnalytics = function (val) {
        analyticsJS = !!val;
        return this;
      };

      this.useEnhancedLinkAttribution = function (val) {
        enhancedLinkAttribution = !!val;
        return this;
      };

      this.useCrossDomainLinker = function (val) {
        crossDomainLinker = !!val;
        return this;
      };

      this.setCrossLinkDomains = function (domains) {
        crossLinkDomains = domains;
        return this;
      };

      this.setPageEvent = function (name) {
        pageEvent = name;
        return this;
      };

      /* DEPRECATED */
      this.setCookieConfig = function (config) {
        cookieConfig = config;
        return this;
      };

      this.useECommerce = function (val, enhanced) {
        ecommerce = !!val;
        enhancedEcommerce = !!enhanced;
        return this;
      };

      this.setCurrency = function (currencyCode) {
        currency = currencyCode;
        return this;
      };

      this.setRemoveRegExp = function (regex) {
        if (regex instanceof RegExp) {
          removeRegExp = regex;
        }
        return this;
      };

      this.setExperimentId = function (id) {
        experimentId = id;
        return this;
      };

      this.ignoreFirstPageLoad = function (val) {
        ignoreFirstPageLoad = !!val;
        return this;
      };

      this.trackUrlParams = function (val) {
        trackUrlParams = !!val;
        return this;
      };

      this.disableAnalytics = function (val) {
        disableAnalytics = !!val;
        return this;
      };

      this.setHybridMobileSupport = function (val) {
        hybridMobileSupport = !!val;
        return this;
      };

      this.startOffline = function (val) {
        offlineMode = !!val;
        if (offlineMode === true) {
          this.delayScriptTag(true);
        }
        return this;
      };

      this.delayScriptTag = function (val) {
        delayScriptTag = !!val;
        return this;
      };

      this.logAllCalls = function (val) {
        logAllCalls = !!val;
        return this;
      };

      this.enterTestMode = function () {
        testMode = true;
        return this;
      };

      this.enterDebugMode = function (enableTraceDebugging) {
        debugMode = true;
        traceDebuggingMode = !!enableTraceDebugging;
        return this;
      };
      
      // Enable reading page url from route object
      this.readFromRoute = function(val) {
        readFromRoute = !!val;
        return this;
      };

      /**
       * Public Service
       */
      this.$get = ['$document', // To read title 
                   '$location', // 
                   '$log',      //
                   '$rootScope',// 
                   '$window',   //
                   '$injector', // To access ngRoute module without declaring a fixed dependency
                   function ($document, $location, $log, $rootScope, $window, $injector) {
        var that = this;

        /**
         * Side-effect Free Helper Methods
         **/

        var isPropertyDefined = function (key, config) {
          return angular.isObject(config) && angular.isDefined(config[key]);
        };

        var isPropertySetTo = function (key, config, value) {
          return isPropertyDefined(key, config) && config[key] === value;
        };

        var generateCommandName = function (commandName, config) {
          if (angular.isString(config)) {
            return config + '.' + commandName;
          }
          return isPropertyDefined('name', config) ? (config.name + '.' + commandName) : commandName;
        };
        
        // Try to read route configuration and log warning if not possible
        var $route = {};
        if (readFromRoute) {
          if (!$injector.has('$route')) {
            $log.warn('$route service is not available. Make sure you have included ng-route in your application dependencies.');
          } else {
            $route = $injector.get('$route');
          }
        }

        // Get url for current page 
        var getUrl = function () {
          // Using ngRoute provided tracking urls
          if (readFromRoute && $route.current && ('pageTrack' in $route.current)) {
            return $route.current.pageTrack;
          }
           
          // Otherwise go the old way
          var url = trackUrlParams ? $location.url() : $location.path(); 
          return removeRegExp ? url.replace(removeRegExp, '') : url;
        };

        var getUtmParams = function () {
          var utmToCampaignVar = {
            utm_source: 'campaignSource',
            utm_medium: 'campaignMedium',
            utm_term: 'campaignTerm',
            utm_content: 'campaignContent',
            utm_campaign: 'campaignName'
          };
          var object = {};

          angular.forEach($location.search(), function (value, key) {
            var campaignVar = utmToCampaignVar[key];

            if (angular.isDefined(campaignVar)) {
              object[campaignVar] = value;
            }
          });

          return object;
        };

        /**
         * get ActionFieldObject
         * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#action-data
         * @param id
         * @param affliation
         * @param revenue
         * @param tax
         * @param shipping
         * @param coupon
         * @param list
         * @param step
         * @param option
         */
        var getActionFieldObject = function (id, affiliation, revenue, tax, shipping, coupon, list, step, option) {
          var obj = {};
          if (id) { obj.id = id; }
          if (affiliation) { obj.affiliation = affiliation; }
          if (revenue) { obj.revenue = revenue; }
          if (tax) { obj.tax = tax; }
          if (shipping) { obj.shipping = shipping; }
          if (coupon) { obj.coupon = coupon; }
          if (list) { obj.list = list; }
          if (step) { obj.step = step; }
          if (option) { obj.option = option; }
          return obj;
        };

        /**
         * Private Methods
         */

        var _gaJs = function (fn) {
          if (!analyticsJS && $window._gaq && typeof fn === 'function') {
            fn();
          }
        };

        var _gaq = function () {
          var args = Array.prototype.slice.call(arguments);
          if (offlineMode === true) {
            that.offlineQueue.push([_gaq, args]);
            return;
          }
          if (!$window._gaq) {
            $window._gaq = [];
          }
          if (logAllCalls === true) {
            that._log.apply(that, args);
          }
          $window._gaq.push(args);
        };

        var _analyticsJs = function (fn) {
          if (analyticsJS && $window.ga && typeof fn === 'function') {
            fn();
          }
        };

        var _ga = function () {
          var args = Array.prototype.slice.call(arguments);
          if (offlineMode === true) {
            that.offlineQueue.push([_ga, args]);
            return;
          }
          if (typeof $window.ga !== 'function') {
            that._log('warn', 'ga function not set on window');
            return;
          }
          if (logAllCalls === true) {
            that._log.apply(that, args);
          }
          $window.ga.apply(null, args);
        };

        var _gaMultipleTrackers = function (includeFn) {
          // Drop the includeFn from the arguments and preserve the original command name
          var args = Array.prototype.slice.call(arguments, 1),
              commandName = args[0],
              trackers = [];
          if (typeof includeFn === 'function') {
            accounts.forEach(function (account) {
              if (includeFn(account)) {
                trackers.push(account);
              }
            });
          } else {
            // No include function indicates that all accounts are to be used
            trackers = accounts;
          }

          // To preserve backwards compatibility fallback to _ga method if no account
          // matches the specified includeFn. This preserves existing behaviors by
          // performing the single tracker operation.
          if (trackers.length === 0) {
            _ga.apply(that, args);
            return;
          }

          trackers.forEach(function (tracker) {
            // Check tracker 'select' function, if it exists, for whether the tracker should be used with the current command.
            // If the 'select' function returns false then the tracker will not be used with the current command.
            if (isPropertyDefined('select', tracker) && typeof tracker.select === 'function' && !tracker.select(args)) {
              return;
            }
            args[0] = generateCommandName(commandName, tracker);
            _ga.apply(that, args);
          });
        };

        this._log = function () {
          var args = Array.prototype.slice.call(arguments);
          if (args.length > 0) {
            if (args.length > 1) {
              switch (args[0]) {
                case 'debug':
                case 'error':
                case 'info':
                case 'log':
                case 'warn':
                  $log[args[0]](args.slice(1));
                  break;
              }
            }
            that.log.push(args);
          }
        };

        this._createScriptTag = function () {
          if (!accounts || accounts.length < 1) {
            that._log('warn', 'No account id set to create script tag');
            return;
          }
          if (accounts.length > 1) {
            that._log('warn', 'Multiple trackers are not supported with ga.js. Using first tracker only');
            accounts = accounts.slice(0, 1);
          }

          if (created === true) {
            that._log('warn', 'ga.js or analytics.js script tag already created');
            return;
          }

          if (disableAnalytics === true) {
            that._log('info', 'Analytics disabled: ' + accounts[0].tracker);
            $window['ga-disable-' + accounts[0].tracker] = true;
          }

          _gaq('_setAccount', accounts[0].tracker);
          if(domainName) {
            _gaq('_setDomainName', domainName);
          }
          if (enhancedLinkAttribution) {
            _gaq('_require', 'inpage_linkid', '//www.google-analytics.com/plugins/ga/inpage_linkid.js');
          }
          if (trackRoutes && !ignoreFirstPageLoad) {
            if (removeRegExp) {
              _gaq('_trackPageview', getUrl());
            } else {
              _gaq('_trackPageview');
            }
          }

          var document = $document[0];
          var scriptSource;
          if (displayFeatures === true) {
            scriptSource = ('https:' === document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
          } else {
            scriptSource = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
          }

          if (testMode !== true) {
            // If not in test mode inject the Google Analytics tag
            (function () {
              var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
              ga.src = scriptSource;
              var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
            })();
          } else {
            // Log the source location for validation
            that._log('inject', scriptSource);
          }

          created = true;
          return true;
        };

        this._createAnalyticsScriptTag = function () {
          if (!accounts) {
            that._log('warn', 'No account id set to create analytics script tag');
            return;
          }

          if (created === true) {
            that._log('warn', 'ga.js or analytics.js script tag already created');
            return;
          }

          if (disableAnalytics === true) {
            accounts.forEach(function (trackerObj) {
              that._log('info', 'Analytics disabled: ' + trackerObj.tracker);
              $window['ga-disable-' + trackerObj.tracker] = true;
            });
          }

          var document = $document[0];
          var protocol = hybridMobileSupport === true ? 'https:' : '';
          var scriptSource = protocol + '//www.google-analytics.com/' + (debugMode ? 'analytics_debug.js' : 'analytics.js');
          if (testMode !== true) {
            // If not in test mode inject the Google Analytics tag
            (function (i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function (){
              (i[r].q=i[r].q||[]).push(arguments);},i[r].l=1*new Date();a=s.createElement(o),
              m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
            })(window,document,'script',scriptSource,'ga');
          } else {
            if (typeof $window.ga !== 'function') {
              // In test mode create a ga function if none exists that is a noop sink.
              $window.ga = function () {};
            }
            // Log script injection.
            that._log('inject', scriptSource);
          }

          if (traceDebuggingMode) {
            $window.ga_debug = { trace: true };
          }

          accounts.forEach(function (trackerObj) {
            trackerObj.crossDomainLinker = isPropertyDefined('crossDomainLinker', trackerObj) ? trackerObj.crossDomainLinker : crossDomainLinker;
            trackerObj.crossLinkDomains = isPropertyDefined('crossLinkDomains', trackerObj) ? trackerObj.crossLinkDomains : crossLinkDomains;
            trackerObj.displayFeatures = isPropertyDefined('displayFeatures', trackerObj) ? trackerObj.displayFeatures : displayFeatures;
            trackerObj.enhancedLinkAttribution = isPropertyDefined('enhancedLinkAttribution', trackerObj) ? trackerObj.enhancedLinkAttribution : enhancedLinkAttribution;
            trackerObj.set = isPropertyDefined('set', trackerObj) ? trackerObj.set : {};
            trackerObj.trackEcommerce = isPropertyDefined('trackEcommerce', trackerObj) ? trackerObj.trackEcommerce : ecommerce;
            trackerObj.trackEvent = isPropertyDefined('trackEvent', trackerObj) ? trackerObj.trackEvent : false;

            // Logic to choose the account fields to be used.
            // cookieConfig is being deprecated for a tracker specific property: fields.
            var fields = {};
            if (isPropertyDefined('fields', trackerObj)) {
              fields = trackerObj.fields;
            } else if (isPropertyDefined('cookieConfig', trackerObj)) {
              if (angular.isString(trackerObj.cookieConfig)) {
                fields.cookieDomain = trackerObj.cookieConfig;
              } else {
                fields = trackerObj.cookieConfig;
              }
            } else if (angular.isString(cookieConfig)) {
              fields.cookieDomain = cookieConfig;
            } else if (cookieConfig) {
              fields = cookieConfig;
            }
            if (trackerObj.crossDomainLinker === true) {
              fields.allowLinker = true;
            }
            if (isPropertyDefined('name', trackerObj)) {
              fields.name = trackerObj.name;
            }
            trackerObj.fields = fields;

            _ga('create', trackerObj.tracker, trackerObj.fields);

            // Hybrid mobile application support
            // https://developers.google.com/analytics/devguides/collection/analyticsjs/tasks
            if (hybridMobileSupport === true) {
              _ga(generateCommandName('set', trackerObj), 'checkProtocolTask', null);
            }

            // Send all custom set commands from the trackerObj.set property
            for (var key in trackerObj.set) {
              if (trackerObj.set.hasOwnProperty(key)) {
                _ga(generateCommandName('set', trackerObj), key, trackerObj.set[key]);
              }
            }

            if (trackerObj.crossDomainLinker === true) {
              _ga(generateCommandName('require', trackerObj), 'linker');
              if (angular.isDefined(trackerObj.crossLinkDomains)) {
                _ga(generateCommandName('linker:autoLink', trackerObj), trackerObj.crossLinkDomains);
              }
            }

            if (trackerObj.displayFeatures) {
              _ga(generateCommandName('require', trackerObj), 'displayfeatures');
            }

            if (trackerObj.trackEcommerce) {
              if (!enhancedEcommerce) {
                _ga(generateCommandName('require', trackerObj), 'ecommerce');
              } else {
                _ga(generateCommandName('require', trackerObj), 'ec');
                _ga(generateCommandName('set', trackerObj), '&cu', currency);
              }
            }

            if (trackerObj.enhancedLinkAttribution) {
              _ga(generateCommandName('require', trackerObj), 'linkid');
            }

            if (trackRoutes && !ignoreFirstPageLoad) {
              _ga(generateCommandName('send', trackerObj), 'pageview', trackPrefix + getUrl());
            }
          });

          if (experimentId) {
            var expScript = document.createElement('script'),
                s = document.getElementsByTagName('script')[0];
            expScript.src = protocol + '//www.google-analytics.com/cx/api.js?experiment=' + experimentId;
            s.parentNode.insertBefore(expScript, s);
          }

          created = true;
          return true;
        };

        this._ecommerceEnabled = function (warn, command) {
          var result = ecommerce && !enhancedEcommerce;
          if (warn === true && result === false) {
            if (ecommerce && enhancedEcommerce) {
              that._log('warn', command + ' is not available when Enhanced Ecommerce is enabled with analytics.js');
            } else {
              that._log('warn', 'Ecommerce must be enabled to use ' + command + ' with analytics.js');
            }
          }
          return result;
        };

        this._enhancedEcommerceEnabled = function (warn, command) {
          var result = ecommerce && enhancedEcommerce;
          if (warn === true && result === false) {
            that._log('warn', 'Enhanced Ecommerce must be enabled to use ' + command + ' with analytics.js');
          }
          return result;
        };

        /**
         * Track page
         https://developers.google.com/analytics/devguides/collection/gajs/
         https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
         * @param url
         * @param title
         * @param custom
         * @private
         */
        this._trackPage = function (url, title, custom) {
          url = url ? url : getUrl();
          title = title ? title : $document[0].title;
          _gaJs(function () {
            // http://stackoverflow.com/questions/7322288/how-can-i-set-a-page-title-with-google-analytics
            _gaq('_set', 'title', title);
            _gaq('_trackPageview', (trackPrefix + url));
          });
          _analyticsJs(function () {
            var opt_fieldObject = {
              'page': trackPrefix + url,
              'title': title
            };
            angular.extend(opt_fieldObject, getUtmParams());
            if (angular.isObject(custom)) {
              angular.extend(opt_fieldObject, custom);
            }
            _gaMultipleTrackers(undefined, 'send', 'pageview', opt_fieldObject);
          });
        };

        /**
         * Track event
         https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
         https://developers.google.com/analytics/devguides/collection/analyticsjs/events
         * @param category
         * @param action
         * @param label
         * @param value
         * @param noninteraction
         * @param custom
         * @private
         */
        this._trackEvent = function (category, action, label, value, noninteraction, custom) {
          _gaJs(function () {
            _gaq('_trackEvent', category, action, label, value, !!noninteraction);
          });
          _analyticsJs(function () {
            var opt_fieldObject = {};
            var includeFn = function (trackerObj) {
              return isPropertySetTo('trackEvent', trackerObj, true);
            };

            if (angular.isDefined(noninteraction)) {
              opt_fieldObject.nonInteraction = !!noninteraction;
            }
            if (angular.isObject(custom)) {
              angular.extend(opt_fieldObject, custom);
            }
            if (!angular.isDefined(opt_fieldObject.page)) {
              opt_fieldObject.page = getUrl();
            }
            _gaMultipleTrackers(includeFn, 'send', 'event', category, action, label, value, opt_fieldObject);
          });
        };

        /**
         * Add transaction
         * https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiEcommerce#_gat.GA_Tracker_._addTrans
         * https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#addTrans
         * @param transactionId
         * @param affiliation
         * @param total
         * @param tax
         * @param shipping
         * @param city
         * @param state
         * @param country
         * @private
         */
        this._addTrans = function (transactionId, affiliation, total, tax, shipping, city, state, country, currency) {
          _gaJs(function () {
            _gaq('_addTrans', transactionId, affiliation, total, tax, shipping, city, state, country);
          });
          _analyticsJs(function () {
            if (that._ecommerceEnabled(true, 'addTrans')) {
              var includeFn = function (trackerObj) {
                return isPropertySetTo('trackEcommerce', trackerObj, true);
              };

              _gaMultipleTrackers(
                includeFn,
                'ecommerce:addTransaction',
                {
                  id: transactionId,
                  affiliation: affiliation,
                  revenue: total,
                  tax: tax,
                  shipping: shipping,
                  currency: currency || 'USD'
                });
            }
          });
        };

        /**
         * Add item to transaction
         * https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiEcommerce#_gat.GA_Tracker_._addItem
         * https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#addItem
         * @param transactionId
         * @param sku
         * @param name
         * @param category
         * @param price
         * @param quantity
         * @private
         */
        this._addItem = function (transactionId, sku, name, category, price, quantity) {
          _gaJs(function () {
            _gaq('_addItem', transactionId, sku, name, category, price, quantity);
          });
          _analyticsJs(function () {
            if (that._ecommerceEnabled(true, 'addItem')) {
              var includeFn = function (trackerObj) {
                return isPropertySetTo('trackEcommerce', trackerObj, true);
              };

              _gaMultipleTrackers(
                includeFn,
                'ecommerce:addItem',
                {
                  id: transactionId,
                  name: name,
                  sku: sku,
                  category: category,
                  price: price,
                  quantity: quantity
                });
            }
          });
        };

        /**
         * Track transaction
         * https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiEcommerce#_gat.GA_Tracker_._trackTrans
         * https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#sendingData
         * @private
         */
        this._trackTrans = function () {
          _gaJs(function () {
            _gaq('_trackTrans');
          });
          _analyticsJs(function () {
            if (that._ecommerceEnabled(true, 'trackTrans')) {
              var includeFn = function (trackerObj) {
                return isPropertySetTo('trackEcommerce', trackerObj, true);
              };

              _gaMultipleTrackers(includeFn, 'ecommerce:send');
            }
          });
        };

        /**
         * Clear transaction
         * https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#clearingData
         * @private
         */
        this._clearTrans = function () {
          _analyticsJs(function () {
            if (that._ecommerceEnabled(true, 'clearTrans')) {
              var includeFn = function (trackerObj) {
                return isPropertySetTo('trackEcommerce', trackerObj, true);
              };

              _gaMultipleTrackers(includeFn, 'ecommerce:clear');
            }
          });
        };

        /**
         * Enhanced Ecommerce
         */

        /**
         * Add Product
         * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#product-data
         * @param productId
         * @param name
         * @param category
         * @param brand
         * @param variant
         * @param price
         * @param quantity
         * @param coupon
         * @param position
         * @param custom
         * @private
         */
        this._addProduct = function (productId, name, category, brand, variant, price, quantity, coupon, position, custom) {
          _gaJs(function () {
            _gaq('_addProduct', productId, name, category, brand, variant, price, quantity, coupon, position);
          });
          _analyticsJs(function () {
            if (that._enhancedEcommerceEnabled(true, 'addProduct')) {
              var includeFn = function (trackerObj) {
                return isPropertySetTo('trackEcommerce', trackerObj, true);
              };
              var details = {
                id: productId,
                name: name,
                category: category,
                brand: brand,
                variant: variant,
                price: price,
                quantity: quantity,
                coupon: coupon,
                position: position
              };
              if (angular.isObject(custom)) {
                angular.extend(details, custom);
              }
              _gaMultipleTrackers(includeFn, 'ec:addProduct', details);
            }
          });
        };

        /**
         * Add Impression
         * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#impression-data
         * @param id
         * @param name
         * @param list
         * @param brand
         * @param category
         * @param variant
         * @param position
         * @param price
         * @private
         */
        this._addImpression = function (id, name, list, brand, category, variant, position, price){
          _gaJs(function () {
            _gaq('_addImpression', id, name, list, brand, category, variant, position, price);
          });
          _analyticsJs(function () {
            if (that._enhancedEcommerceEnabled(true, 'addImpression')) {
              var includeFn = function (trackerObj) {
                return isPropertySetTo('trackEcommerce', trackerObj, true);
              };

              _gaMultipleTrackers(
                includeFn,
                'ec:addImpression',
                {
                  id: id,
                  name: name,
                  category: category,
                  brand: brand,
                  variant: variant,
                  list: list,
                  position: position,
                  price: price
                });
            }
          });
        };

        /**
         * Add Promo
         * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce
         * @param productId
         * @param name
         * @param creative
         * @param position
         * @private
         */
        this._addPromo = function (productId, name, creative, position) {
          _gaJs(function () {
            _gaq('_addPromo', productId, name, creative, position);
          });
          _analyticsJs(function () {
            if (that._enhancedEcommerceEnabled(true, 'addPromo')) {
              var includeFn = function (trackerObj) {
                return isPropertySetTo('trackEcommerce', trackerObj, true);
              };

              _gaMultipleTrackers(
                includeFn,
                'ec:addPromo',
                {
                  id: productId,
                  name: name,
                  creative: creative,
                  position: position
                });
            }
          });
        };

        /**
         * Set Action
         * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#measuring-actions
         * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#action-types
         * @param action
         * @param obj
         * @private
         */
        this._setAction = function (action, obj){
          _gaJs(function () {
            _gaq('_setAction', action, obj);
          });
          _analyticsJs(function () {
            if (that._enhancedEcommerceEnabled(true, 'setAction')) {
              var includeFn = function (trackerObj) {
                return isPropertySetTo('trackEcommerce', trackerObj, true);
              };

              _gaMultipleTrackers(includeFn, 'ec:setAction', action, obj);
            }
          });
        };

        /**
         * Track Transaction
         * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#measuring-transactions
         * @param transactionId
         * @param affiliation
         * @param revenue
         * @param tax
         * @param shipping
         * @param coupon
         * @param list
         * @param step
         * @param option
         * @private
         */
        this._trackTransaction = function (transactionId, affiliation, revenue, tax, shipping, coupon, list, step, option) {
          this._setAction('purchase', getActionFieldObject(transactionId, affiliation, revenue, tax, shipping, coupon, list, step, option));
        };

        /**
         * Track Refund
         * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#measuring-refunds
         * @param transactionId
         * @private
         */
        this._trackRefund = function (transactionId) {
          this._setAction('refund', getActionFieldObject(transactionId));
        };

        /**
         * Track Checkout
         * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#measuring-checkout
         * @param step
         * @param option
         * @private
         */
        this._trackCheckOut = function (step, option) {
          this._setAction('checkout', getActionFieldObject(null, null, null, null, null, null, null, step, option));
        };

        /**
         * Track detail
         * @private
         */
        this._trackDetail = function () {
          this._setAction('detail');
          this._pageView();
        };

        /**
         * Track add/remove to cart
         * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#add-remove-cart
         * @param action
         * @param list
         * @private
         */
        this._trackCart = function (action, listName) {
          if (['add', 'remove'].indexOf(action) !== -1) {
            this._setAction(action, { list: listName });
            this._trackEvent('UX', 'click', action + (action === 'add' ? ' to cart' : ' from cart'));
          }
        };

        /**
         * Track promo click
         * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#measuring-promo-clicks
         * @param promotionName
         * @private
         */
        this._promoClick = function (promotionName) {
          this._setAction('promo_click');
          this._trackEvent('Internal Promotions', 'click', promotionName);
        };

        /**
         * Track product click
         * https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#measuring-promo-clicks
         * @param promotionName
         * @private
         */
        this._productClick = function (listName) {
          this._setAction('click', getActionFieldObject(null, null, null, null, null, null, listName, null, null));
          this._trackEvent('UX', 'click', listName);
        };

        /**
         * Send page view
         * @param trackerName
         * @private
         */
        this._pageView = function (trackerName) {
          _analyticsJs(function () {
            _ga(generateCommandName('send', trackerName), 'pageview');
          });
        };

        /**
         * Send custom events
         * https://developers.google.com/analytics/devguides/collection/analyticsjs/user-timings#implementation
         * https://developers.google.com/analytics/devguides/collection/analyticsjs/social-interactions#implementation
         * @private
         */
        this._send = function () {
          var args = Array.prototype.slice.call(arguments);
          args.unshift('send');
          _analyticsJs(function () {
            _ga.apply(that, args);
          });
        };

        /**
         * Set custom dimensions, metrics or experiment
         * https://developers.google.com/analytics/devguides/collection/analyticsjs/custom-dims-mets
         * https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#customs
         * @param name (Required)
         * @param value (Required)
         * @param trackerName (Optional)
         * @private
         */
        this._set = function (name, value, trackerName) {
          _analyticsJs(function () {
            _ga(generateCommandName('set', trackerName), name, value);
          });
        };

        /**
         * Track user timings
         * @param timingCategory (Required): A string for categorizing all user timing variables into logical groups(e.g jQuery).
         * @param timingVar (Required): A string to identify the variable being recorded(e.g. JavaScript Load).
         * @param timingValue (Required): The number of milliseconds in elapsed time to report to Google Analytics(e.g. 20).
         * @param timingLabel (Optional): A string that can be used to add flexibility in visualizing user timings in the reports(e.g. Google CDN).
         * @private
         */
        this._trackTimings = function (timingCategory, timingVar, timingValue, timingLabel) {
          _analyticsJs(function () {
            _gaMultipleTrackers(undefined, 'send', 'timing', timingCategory, timingVar, timingValue, timingLabel);
          });
        };

        /**
         * Exception tracking
         * https://developers.google.com/analytics/devguides/collection/analyticsjs/exceptions
         * @param description (Optional): A description of the exception.
         * @param isFatal (Optional): true if the exception was fatal, false otherwise.
         * @private
         */
        this._trackException = function (description, isFatal) {
          _analyticsJs(function () {
            _gaMultipleTrackers(undefined, 'send', 'exception', { exDescription: description, exFatal: !!isFatal});
          });
        };

        // creates the Google Analytics tracker
        if (!delayScriptTag) {
          if (analyticsJS) {
            this._createAnalyticsScriptTag();
          } else {
            this._createScriptTag();
          }
        }

        // activates page tracking
        if (trackRoutes) {
          $rootScope.$on(pageEvent, function () {
            // Apply $route based filtering if configured
            if (readFromRoute) {
              // Avoid tracking undefined routes, routes without template (e.g. redirect routes)
              // and those explicitly marked as 'do not track'
              if (!$route.current || !$route.current.templateUrl || $route.current.doNotTrack) {
                return;
              }
            }
            
            that._trackPage();
          });
        }

        return {
          log: that.log,
          offlineQueue: that.offlineQueue,
          configuration: {
            accounts: accounts,
            universalAnalytics: analyticsJS,
            crossDomainLinker: crossDomainLinker,
            crossLinkDomains: crossLinkDomains,
            currency: currency,
            debugMode: debugMode,
            delayScriptTag: delayScriptTag,
            disableAnalytics: disableAnalytics,
            displayFeatures: displayFeatures,
            domainName: domainName,
            ecommerce: that._ecommerceEnabled(),
            enhancedEcommerce: that._enhancedEcommerceEnabled(),
            enhancedLinkAttribution: enhancedLinkAttribution,
            experimentId: experimentId,
            hybridMobileSupport: hybridMobileSupport,
            ignoreFirstPageLoad: ignoreFirstPageLoad,
            logAllCalls: logAllCalls,
            pageEvent: pageEvent,
            readFromRoute: readFromRoute,
            removeRegExp: removeRegExp,
            testMode: testMode,
            traceDebuggingMode: traceDebuggingMode,
            trackPrefix: trackPrefix,
            trackRoutes: trackRoutes,
            trackUrlParams: trackUrlParams
          },
          getUrl: getUrl,
          /* DEPRECATED */
          setCookieConfig: that._setCookieConfig,
          /* DEPRECATED */
          getCookieConfig: function () {
            return cookieConfig;
          },
          createAnalyticsScriptTag: function (config) {
            if (config) {
              cookieConfig = config;
            }
            return that._createAnalyticsScriptTag();
          },
          createScriptTag: function () {
            return that._createScriptTag();
          },
          offline: function (mode) {
            if (mode === true && offlineMode === false) {
              // Go to offline mode
              offlineMode = true;
            }
            if (mode === false && offlineMode === true) {
              // Go to online mode and process the offline queue
              offlineMode = false;
              while (that.offlineQueue.length > 0) {
                var obj = that.offlineQueue.shift();
                obj[0].apply(that, obj[1]);
              }
            }
            return offlineMode;
          },
          trackPage: function (url, title, custom) {
            that._trackPage.apply(that, arguments);
          },
          trackEvent: function (category, action, label, value, noninteraction, custom) {
            that._trackEvent.apply(that, arguments);
          },
          addTrans: function (transactionId, affiliation, total, tax, shipping, city, state, country, currency) {
            that._addTrans.apply(that, arguments);
          },
          addItem: function (transactionId, sku, name, category, price, quantity) {
            that._addItem.apply(that, arguments);
          },
          trackTrans: function () {
            that._trackTrans.apply(that, arguments);
          },
          clearTrans: function () {
            that._clearTrans.apply(that, arguments);
          },
          addProduct: function (productId, name, category, brand, variant, price, quantity, coupon, position, custom) {
            that._addProduct.apply(that, arguments);
          },
          addPromo: function (productId, name, creative, position) {
            that._addPromo.apply(that, arguments);
          },
          addImpression: function (productId, name, list, brand, category, variant, position, price) {
            that._addImpression.apply(that, arguments);
          },
          productClick: function (listName) {
            that._productClick.apply(that, arguments);
          },
          promoClick : function (promotionName) {
            that._promoClick.apply(that, arguments);
          },
          trackDetail: function () {
            that._trackDetail.apply(that, arguments);
          },
          trackCart: function (action, list) {
            that._trackCart.apply(that, arguments);
          },
          trackCheckout: function (step, option) {
            that._trackCheckOut.apply(that, arguments);
          },
          trackTimings: function (timingCategory, timingVar, timingValue, timingLabel) {
            that._trackTimings.apply(that, arguments);
          },
          trackTransaction: function (transactionId, affiliation, revenue, tax, shipping, coupon, list, step, option) {
            that._trackTransaction.apply(that, arguments);
          },
          trackException: function (description, isFatal) {
            that._trackException.apply(that, arguments);
          },
          setAction: function (action, obj) {
            that._setAction.apply(that, arguments);
          },
          pageView: function () {
            that._pageView.apply(that, arguments);
          },
          send: function (obj) {
            that._send.apply(that, arguments);
          },
          set: function (name, value, trackerName) {
            that._set.apply(that, arguments);
          }
        };
      }];
    })

    .directive('gaTrackEvent', ['Analytics', '$parse', function (Analytics, $parse) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var options = $parse(attrs.gaTrackEvent);
          element.bind('click', function () {
            if(attrs.gaTrackEventIf){
              if(!scope.$eval(attrs.gaTrackEventIf)){
                return; // Cancel this event if we don't pass the ga-track-event-if condition
              }
            }
            if (options.length > 1) {
              Analytics.trackEvent.apply(Analytics, options(scope));
            }
          });
        }
      };
    }]);
  return angular.module('angular-google-analytics');
}));

/**
 * @license AngularJS v1.5.8
 * (c) 2010-2016 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular) {'use strict';

/* global shallowCopy: true */

/**
 * Creates a shallow copy of an object, an array or a primitive.
 *
 * Assumes that there are no proto properties for objects.
 */
function shallowCopy(src, dst) {
  if (isArray(src)) {
    dst = dst || [];

    for (var i = 0, ii = src.length; i < ii; i++) {
      dst[i] = src[i];
    }
  } else if (isObject(src)) {
    dst = dst || {};

    for (var key in src) {
      if (!(key.charAt(0) === '$' && key.charAt(1) === '$')) {
        dst[key] = src[key];
      }
    }
  }

  return dst || src;
}

/* global shallowCopy: false */

// There are necessary for `shallowCopy()` (included via `src/shallowCopy.js`).
// They are initialized inside the `$RouteProvider`, to ensure `window.angular` is available.
var isArray;
var isObject;

/**
 * @ngdoc module
 * @name ngRoute
 * @description
 *
 * # ngRoute
 *
 * The `ngRoute` module provides routing and deeplinking services and directives for angular apps.
 *
 * ## Example
 * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
 *
 *
 * <div doc-module-components="ngRoute"></div>
 */
 /* global -ngRouteModule */
var ngRouteModule = angular.module('ngRoute', ['ng']).
                        provider('$route', $RouteProvider),
    $routeMinErr = angular.$$minErr('ngRoute');

/**
 * @ngdoc provider
 * @name $routeProvider
 *
 * @description
 *
 * Used for configuring routes.
 *
 * ## Example
 * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
 *
 * ## Dependencies
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 */
function $RouteProvider() {
  isArray = angular.isArray;
  isObject = angular.isObject;

  function inherit(parent, extra) {
    return angular.extend(Object.create(parent), extra);
  }

  var routes = {};

  /**
   * @ngdoc method
   * @name $routeProvider#when
   *
   * @param {string} path Route path (matched against `$location.path`). If `$location.path`
   *    contains redundant trailing slash or is missing one, the route will still match and the
   *    `$location.path` will be updated to add or drop the trailing slash to exactly match the
   *    route definition.
   *
   *    * `path` can contain named groups starting with a colon: e.g. `:name`. All characters up
   *        to the next slash are matched and stored in `$routeParams` under the given `name`
   *        when the route matches.
   *    * `path` can contain named groups starting with a colon and ending with a star:
   *        e.g.`:name*`. All characters are eagerly stored in `$routeParams` under the given `name`
   *        when the route matches.
   *    * `path` can contain optional named groups with a question mark: e.g.`:name?`.
   *
   *    For example, routes like `/color/:color/largecode/:largecode*\/edit` will match
   *    `/color/brown/largecode/code/with/slashes/edit` and extract:
   *
   *    * `color: brown`
   *    * `largecode: code/with/slashes`.
   *
   *
   * @param {Object} route Mapping information to be assigned to `$route.current` on route
   *    match.
   *
   *    Object properties:
   *
   *    - `controller` – `{(string|function()=}` – Controller fn that should be associated with
   *      newly created scope or the name of a {@link angular.Module#controller registered
   *      controller} if passed as a string.
   *    - `controllerAs` – `{string=}` – An identifier name for a reference to the controller.
   *      If present, the controller will be published to scope under the `controllerAs` name.
   *    - `template` – `{string=|function()=}` – html template as a string or a function that
   *      returns an html template as a string which should be used by {@link
   *      ngRoute.directive:ngView ngView} or {@link ng.directive:ngInclude ngInclude} directives.
   *      This property takes precedence over `templateUrl`.
   *
   *      If `template` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route
   *
   *    - `templateUrl` – `{string=|function()=}` – path or function that returns a path to an html
   *      template that should be used by {@link ngRoute.directive:ngView ngView}.
   *
   *      If `templateUrl` is a function, it will be called with the following parameters:
   *
   *      - `{Array.<Object>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route
   *
   *    - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
   *      be injected into the controller. If any of these dependencies are promises, the router
   *      will wait for them all to be resolved or one to be rejected before the controller is
   *      instantiated.
   *      If all the promises are resolved successfully, the values of the resolved promises are
   *      injected and {@link ngRoute.$route#$routeChangeSuccess $routeChangeSuccess} event is
   *      fired. If any of the promises are rejected the
   *      {@link ngRoute.$route#$routeChangeError $routeChangeError} event is fired.
   *      For easier access to the resolved dependencies from the template, the `resolve` map will
   *      be available on the scope of the route, under `$resolve` (by default) or a custom name
   *      specified by the `resolveAs` property (see below). This can be particularly useful, when
   *      working with {@link angular.Module#component components} as route templates.<br />
   *      <div class="alert alert-warning">
   *        **Note:** If your scope already contains a property with this name, it will be hidden
   *        or overwritten. Make sure, you specify an appropriate name for this property, that
   *        does not collide with other properties on the scope.
   *      </div>
   *      The map object is:
   *
   *      - `key` – `{string}`: a name of a dependency to be injected into the controller.
   *      - `factory` - `{string|function}`: If `string` then it is an alias for a service.
   *        Otherwise if function, then it is {@link auto.$injector#invoke injected}
   *        and the return value is treated as the dependency. If the result is a promise, it is
   *        resolved before its value is injected into the controller. Be aware that
   *        `ngRoute.$routeParams` will still refer to the previous route within these resolve
   *        functions.  Use `$route.current.params` to access the new route parameters, instead.
   *
   *    - `resolveAs` - `{string=}` - The name under which the `resolve` map will be available on
   *      the scope of the route. If omitted, defaults to `$resolve`.
   *
   *    - `redirectTo` – `{(string|function())=}` – value to update
   *      {@link ng.$location $location} path with and trigger route redirection.
   *
   *      If `redirectTo` is a function, it will be called with the following parameters:
   *
   *      - `{Object.<string>}` - route parameters extracted from the current
   *        `$location.path()` by applying the current route templateUrl.
   *      - `{string}` - current `$location.path()`
   *      - `{Object}` - current `$location.search()`
   *
   *      The custom `redirectTo` function is expected to return a string which will be used
   *      to update `$location.path()` and `$location.search()`.
   *
   *    - `[reloadOnSearch=true]` - `{boolean=}` - reload route when only `$location.search()`
   *      or `$location.hash()` changes.
   *
   *      If the option is set to `false` and url in the browser changes, then
   *      `$routeUpdate` event is broadcasted on the root scope.
   *
   *    - `[caseInsensitiveMatch=false]` - `{boolean=}` - match routes without being case sensitive
   *
   *      If the option is set to `true`, then the particular route can be matched without being
   *      case sensitive
   *
   * @returns {Object} self
   *
   * @description
   * Adds a new route definition to the `$route` service.
   */
  this.when = function(path, route) {
    //copy original route object to preserve params inherited from proto chain
    var routeCopy = shallowCopy(route);
    if (angular.isUndefined(routeCopy.reloadOnSearch)) {
      routeCopy.reloadOnSearch = true;
    }
    if (angular.isUndefined(routeCopy.caseInsensitiveMatch)) {
      routeCopy.caseInsensitiveMatch = this.caseInsensitiveMatch;
    }
    routes[path] = angular.extend(
      routeCopy,
      path && pathRegExp(path, routeCopy)
    );

    // create redirection for trailing slashes
    if (path) {
      var redirectPath = (path[path.length - 1] == '/')
            ? path.substr(0, path.length - 1)
            : path + '/';

      routes[redirectPath] = angular.extend(
        {redirectTo: path},
        pathRegExp(redirectPath, routeCopy)
      );
    }

    return this;
  };

  /**
   * @ngdoc property
   * @name $routeProvider#caseInsensitiveMatch
   * @description
   *
   * A boolean property indicating if routes defined
   * using this provider should be matched using a case insensitive
   * algorithm. Defaults to `false`.
   */
  this.caseInsensitiveMatch = false;

   /**
    * @param path {string} path
    * @param opts {Object} options
    * @return {?Object}
    *
    * @description
    * Normalizes the given path, returning a regular expression
    * and the original path.
    *
    * Inspired by pathRexp in visionmedia/express/lib/utils.js.
    */
  function pathRegExp(path, opts) {
    var insensitive = opts.caseInsensitiveMatch,
        ret = {
          originalPath: path,
          regexp: path
        },
        keys = ret.keys = [];

    path = path
      .replace(/([().])/g, '\\$1')
      .replace(/(\/)?:(\w+)(\*\?|[\?\*])?/g, function(_, slash, key, option) {
        var optional = (option === '?' || option === '*?') ? '?' : null;
        var star = (option === '*' || option === '*?') ? '*' : null;
        keys.push({ name: key, optional: !!optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (star && '(.+?)' || '([^/]+)')
          + (optional || '')
          + ')'
          + (optional || '');
      })
      .replace(/([\/$\*])/g, '\\$1');

    ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
    return ret;
  }

  /**
   * @ngdoc method
   * @name $routeProvider#otherwise
   *
   * @description
   * Sets route definition that will be used on route change when no other route definition
   * is matched.
   *
   * @param {Object|string} params Mapping information to be assigned to `$route.current`.
   * If called with a string, the value maps to `redirectTo`.
   * @returns {Object} self
   */
  this.otherwise = function(params) {
    if (typeof params === 'string') {
      params = {redirectTo: params};
    }
    this.when(null, params);
    return this;
  };


  this.$get = ['$rootScope',
               '$location',
               '$routeParams',
               '$q',
               '$injector',
               '$templateRequest',
               '$sce',
      function($rootScope, $location, $routeParams, $q, $injector, $templateRequest, $sce) {

    /**
     * @ngdoc service
     * @name $route
     * @requires $location
     * @requires $routeParams
     *
     * @property {Object} current Reference to the current route definition.
     * The route definition contains:
     *
     *   - `controller`: The controller constructor as defined in the route definition.
     *   - `locals`: A map of locals which is used by {@link ng.$controller $controller} service for
     *     controller instantiation. The `locals` contain
     *     the resolved values of the `resolve` map. Additionally the `locals` also contain:
     *
     *     - `$scope` - The current route scope.
     *     - `$template` - The current route template HTML.
     *
     *     The `locals` will be assigned to the route scope's `$resolve` property. You can override
     *     the property name, using `resolveAs` in the route definition. See
     *     {@link ngRoute.$routeProvider $routeProvider} for more info.
     *
     * @property {Object} routes Object with all route configuration Objects as its properties.
     *
     * @description
     * `$route` is used for deep-linking URLs to controllers and views (HTML partials).
     * It watches `$location.url()` and tries to map the path to an existing route definition.
     *
     * Requires the {@link ngRoute `ngRoute`} module to be installed.
     *
     * You can define routes through {@link ngRoute.$routeProvider $routeProvider}'s API.
     *
     * The `$route` service is typically used in conjunction with the
     * {@link ngRoute.directive:ngView `ngView`} directive and the
     * {@link ngRoute.$routeParams `$routeParams`} service.
     *
     * @example
     * This example shows how changing the URL hash causes the `$route` to match a route against the
     * URL, and the `ngView` pulls in the partial.
     *
     * <example name="$route-service" module="ngRouteExample"
     *          deps="angular-route.js" fixBase="true">
     *   <file name="index.html">
     *     <div ng-controller="MainController">
     *       Choose:
     *       <a href="Book/Moby">Moby</a> |
     *       <a href="Book/Moby/ch/1">Moby: Ch1</a> |
     *       <a href="Book/Gatsby">Gatsby</a> |
     *       <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
     *       <a href="Book/Scarlet">Scarlet Letter</a><br/>
     *
     *       <div ng-view></div>
     *
     *       <hr />
     *
     *       <pre>$location.path() = {{$location.path()}}</pre>
     *       <pre>$route.current.templateUrl = {{$route.current.templateUrl}}</pre>
     *       <pre>$route.current.params = {{$route.current.params}}</pre>
     *       <pre>$route.current.scope.name = {{$route.current.scope.name}}</pre>
     *       <pre>$routeParams = {{$routeParams}}</pre>
     *     </div>
     *   </file>
     *
     *   <file name="book.html">
     *     controller: {{name}}<br />
     *     Book Id: {{params.bookId}}<br />
     *   </file>
     *
     *   <file name="chapter.html">
     *     controller: {{name}}<br />
     *     Book Id: {{params.bookId}}<br />
     *     Chapter Id: {{params.chapterId}}
     *   </file>
     *
     *   <file name="script.js">
     *     angular.module('ngRouteExample', ['ngRoute'])
     *
     *      .controller('MainController', function($scope, $route, $routeParams, $location) {
     *          $scope.$route = $route;
     *          $scope.$location = $location;
     *          $scope.$routeParams = $routeParams;
     *      })
     *
     *      .controller('BookController', function($scope, $routeParams) {
     *          $scope.name = "BookController";
     *          $scope.params = $routeParams;
     *      })
     *
     *      .controller('ChapterController', function($scope, $routeParams) {
     *          $scope.name = "ChapterController";
     *          $scope.params = $routeParams;
     *      })
     *
     *     .config(function($routeProvider, $locationProvider) {
     *       $routeProvider
     *        .when('/Book/:bookId', {
     *         templateUrl: 'book.html',
     *         controller: 'BookController',
     *         resolve: {
     *           // I will cause a 1 second delay
     *           delay: function($q, $timeout) {
     *             var delay = $q.defer();
     *             $timeout(delay.resolve, 1000);
     *             return delay.promise;
     *           }
     *         }
     *       })
     *       .when('/Book/:bookId/ch/:chapterId', {
     *         templateUrl: 'chapter.html',
     *         controller: 'ChapterController'
     *       });
     *
     *       // configure html5 to get links working on jsfiddle
     *       $locationProvider.html5Mode(true);
     *     });
     *
     *   </file>
     *
     *   <file name="protractor.js" type="protractor">
     *     it('should load and compile correct template', function() {
     *       element(by.linkText('Moby: Ch1')).click();
     *       var content = element(by.css('[ng-view]')).getText();
     *       expect(content).toMatch(/controller\: ChapterController/);
     *       expect(content).toMatch(/Book Id\: Moby/);
     *       expect(content).toMatch(/Chapter Id\: 1/);
     *
     *       element(by.partialLinkText('Scarlet')).click();
     *
     *       content = element(by.css('[ng-view]')).getText();
     *       expect(content).toMatch(/controller\: BookController/);
     *       expect(content).toMatch(/Book Id\: Scarlet/);
     *     });
     *   </file>
     * </example>
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeStart
     * @eventType broadcast on root scope
     * @description
     * Broadcasted before a route change. At this  point the route services starts
     * resolving all of the dependencies needed for the route change to occur.
     * Typically this involves fetching the view template as well as any dependencies
     * defined in `resolve` route property. Once  all of the dependencies are resolved
     * `$routeChangeSuccess` is fired.
     *
     * The route change (and the `$location` change that triggered it) can be prevented
     * by calling `preventDefault` method of the event. See {@link ng.$rootScope.Scope#$on}
     * for more details about event object.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} next Future route information.
     * @param {Route} current Current route information.
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeSuccess
     * @eventType broadcast on root scope
     * @description
     * Broadcasted after a route change has happened successfully.
     * The `resolve` dependencies are now available in the `current.locals` property.
     *
     * {@link ngRoute.directive:ngView ngView} listens for the directive
     * to instantiate the controller and render the view.
     *
     * @param {Object} angularEvent Synthetic event object.
     * @param {Route} current Current route information.
     * @param {Route|Undefined} previous Previous route information, or undefined if current is
     * first route entered.
     */

    /**
     * @ngdoc event
     * @name $route#$routeChangeError
     * @eventType broadcast on root scope
     * @description
     * Broadcasted if any of the resolve promises are rejected.
     *
     * @param {Object} angularEvent Synthetic event object
     * @param {Route} current Current route information.
     * @param {Route} previous Previous route information.
     * @param {Route} rejection Rejection of the promise. Usually the error of the failed promise.
     */

    /**
     * @ngdoc event
     * @name $route#$routeUpdate
     * @eventType broadcast on root scope
     * @description
     * The `reloadOnSearch` property has been set to false, and we are reusing the same
     * instance of the Controller.
     *
     * @param {Object} angularEvent Synthetic event object
     * @param {Route} current Current/previous route information.
     */

    var forceReload = false,
        preparedRoute,
        preparedRouteIsUpdateOnly,
        $route = {
          routes: routes,

          /**
           * @ngdoc method
           * @name $route#reload
           *
           * @description
           * Causes `$route` service to reload the current route even if
           * {@link ng.$location $location} hasn't changed.
           *
           * As a result of that, {@link ngRoute.directive:ngView ngView}
           * creates new scope and reinstantiates the controller.
           */
          reload: function() {
            forceReload = true;

            var fakeLocationEvent = {
              defaultPrevented: false,
              preventDefault: function fakePreventDefault() {
                this.defaultPrevented = true;
                forceReload = false;
              }
            };

            $rootScope.$evalAsync(function() {
              prepareRoute(fakeLocationEvent);
              if (!fakeLocationEvent.defaultPrevented) commitRoute();
            });
          },

          /**
           * @ngdoc method
           * @name $route#updateParams
           *
           * @description
           * Causes `$route` service to update the current URL, replacing
           * current route parameters with those specified in `newParams`.
           * Provided property names that match the route's path segment
           * definitions will be interpolated into the location's path, while
           * remaining properties will be treated as query params.
           *
           * @param {!Object<string, string>} newParams mapping of URL parameter names to values
           */
          updateParams: function(newParams) {
            if (this.current && this.current.$$route) {
              newParams = angular.extend({}, this.current.params, newParams);
              $location.path(interpolate(this.current.$$route.originalPath, newParams));
              // interpolate modifies newParams, only query params are left
              $location.search(newParams);
            } else {
              throw $routeMinErr('norout', 'Tried updating route when with no current route');
            }
          }
        };

    $rootScope.$on('$locationChangeStart', prepareRoute);
    $rootScope.$on('$locationChangeSuccess', commitRoute);

    return $route;

    /////////////////////////////////////////////////////

    /**
     * @param on {string} current url
     * @param route {Object} route regexp to match the url against
     * @return {?Object}
     *
     * @description
     * Check if the route matches the current url.
     *
     * Inspired by match in
     * visionmedia/express/lib/router/router.js.
     */
    function switchRouteMatcher(on, route) {
      var keys = route.keys,
          params = {};

      if (!route.regexp) return null;

      var m = route.regexp.exec(on);
      if (!m) return null;

      for (var i = 1, len = m.length; i < len; ++i) {
        var key = keys[i - 1];

        var val = m[i];

        if (key && val) {
          params[key.name] = val;
        }
      }
      return params;
    }

    function prepareRoute($locationEvent) {
      var lastRoute = $route.current;

      preparedRoute = parseRoute();
      preparedRouteIsUpdateOnly = preparedRoute && lastRoute && preparedRoute.$$route === lastRoute.$$route
          && angular.equals(preparedRoute.pathParams, lastRoute.pathParams)
          && !preparedRoute.reloadOnSearch && !forceReload;

      if (!preparedRouteIsUpdateOnly && (lastRoute || preparedRoute)) {
        if ($rootScope.$broadcast('$routeChangeStart', preparedRoute, lastRoute).defaultPrevented) {
          if ($locationEvent) {
            $locationEvent.preventDefault();
          }
        }
      }
    }

    function commitRoute() {
      var lastRoute = $route.current;
      var nextRoute = preparedRoute;

      if (preparedRouteIsUpdateOnly) {
        lastRoute.params = nextRoute.params;
        angular.copy(lastRoute.params, $routeParams);
        $rootScope.$broadcast('$routeUpdate', lastRoute);
      } else if (nextRoute || lastRoute) {
        forceReload = false;
        $route.current = nextRoute;
        if (nextRoute) {
          if (nextRoute.redirectTo) {
            if (angular.isString(nextRoute.redirectTo)) {
              $location.path(interpolate(nextRoute.redirectTo, nextRoute.params)).search(nextRoute.params)
                       .replace();
            } else {
              $location.url(nextRoute.redirectTo(nextRoute.pathParams, $location.path(), $location.search()))
                       .replace();
            }
          }
        }

        $q.when(nextRoute).
          then(resolveLocals).
          then(function(locals) {
            // after route change
            if (nextRoute == $route.current) {
              if (nextRoute) {
                nextRoute.locals = locals;
                angular.copy(nextRoute.params, $routeParams);
              }
              $rootScope.$broadcast('$routeChangeSuccess', nextRoute, lastRoute);
            }
          }, function(error) {
            if (nextRoute == $route.current) {
              $rootScope.$broadcast('$routeChangeError', nextRoute, lastRoute, error);
            }
          });
      }
    }

    function resolveLocals(route) {
      if (route) {
        var locals = angular.extend({}, route.resolve);
        angular.forEach(locals, function(value, key) {
          locals[key] = angular.isString(value) ?
              $injector.get(value) :
              $injector.invoke(value, null, null, key);
        });
        var template = getTemplateFor(route);
        if (angular.isDefined(template)) {
          locals['$template'] = template;
        }
        return $q.all(locals);
      }
    }


    function getTemplateFor(route) {
      var template, templateUrl;
      if (angular.isDefined(template = route.template)) {
        if (angular.isFunction(template)) {
          template = template(route.params);
        }
      } else if (angular.isDefined(templateUrl = route.templateUrl)) {
        if (angular.isFunction(templateUrl)) {
          templateUrl = templateUrl(route.params);
        }
        if (angular.isDefined(templateUrl)) {
          route.loadedTemplateUrl = $sce.valueOf(templateUrl);
          template = $templateRequest(templateUrl);
        }
      }
      return template;
    }


    /**
     * @returns {Object} the current active route, by matching it against the URL
     */
    function parseRoute() {
      // Match a route
      var params, match;
      angular.forEach(routes, function(route, path) {
        if (!match && (params = switchRouteMatcher($location.path(), route))) {
          match = inherit(route, {
            params: angular.extend({}, $location.search(), params),
            pathParams: params});
          match.$$route = route;
        }
      });
      // No route matched; fallback to "otherwise" route
      return match || routes[null] && inherit(routes[null], {params: {}, pathParams:{}});
    }

    /**
     * @returns {string} interpolation of the redirect path with the parameters
     */
    function interpolate(string, params) {
      var result = [];
      angular.forEach((string || '').split(':'), function(segment, i) {
        if (i === 0) {
          result.push(segment);
        } else {
          var segmentMatch = segment.match(/(\w+)(?:[?*])?(.*)/);
          var key = segmentMatch[1];
          result.push(params[key]);
          result.push(segmentMatch[2] || '');
          delete params[key];
        }
      });
      return result.join('');
    }
  }];
}

ngRouteModule.provider('$routeParams', $RouteParamsProvider);


/**
 * @ngdoc service
 * @name $routeParams
 * @requires $route
 *
 * @description
 * The `$routeParams` service allows you to retrieve the current set of route parameters.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * The route parameters are a combination of {@link ng.$location `$location`}'s
 * {@link ng.$location#search `search()`} and {@link ng.$location#path `path()`}.
 * The `path` parameters are extracted when the {@link ngRoute.$route `$route`} path is matched.
 *
 * In case of parameter name collision, `path` params take precedence over `search` params.
 *
 * The service guarantees that the identity of the `$routeParams` object will remain unchanged
 * (but its properties will likely change) even when a route change occurs.
 *
 * Note that the `$routeParams` are only updated *after* a route change completes successfully.
 * This means that you cannot rely on `$routeParams` being correct in route resolve functions.
 * Instead you can use `$route.current.params` to access the new route's parameters.
 *
 * @example
 * ```js
 *  // Given:
 *  // URL: http://server.com/index.html#/Chapter/1/Section/2?search=moby
 *  // Route: /Chapter/:chapterId/Section/:sectionId
 *  //
 *  // Then
 *  $routeParams ==> {chapterId:'1', sectionId:'2', search:'moby'}
 * ```
 */
function $RouteParamsProvider() {
  this.$get = function() { return {}; };
}

ngRouteModule.directive('ngView', ngViewFactory);
ngRouteModule.directive('ngView', ngViewFillContentFactory);


/**
 * @ngdoc directive
 * @name ngView
 * @restrict ECA
 *
 * @description
 * # Overview
 * `ngView` is a directive that complements the {@link ngRoute.$route $route} service by
 * including the rendered template of the current route into the main layout (`index.html`) file.
 * Every time the current route changes, the included view changes with it according to the
 * configuration of the `$route` service.
 *
 * Requires the {@link ngRoute `ngRoute`} module to be installed.
 *
 * @animations
 * | Animation                        | Occurs                              |
 * |----------------------------------|-------------------------------------|
 * | {@link ng.$animate#enter enter}  | when the new element is inserted to the DOM |
 * | {@link ng.$animate#leave leave}  | when the old element is removed from to the DOM  |
 *
 * The enter and leave animation occur concurrently.
 *
 * @knownIssue If `ngView` is contained in an asynchronously loaded template (e.g. in another
 *             directive's templateUrl or in a template loaded using `ngInclude`), then you need to
 *             make sure that `$route` is instantiated in time to capture the initial
 *             `$locationChangeStart` event and load the appropriate view. One way to achieve this
 *             is to have it as a dependency in a `.run` block:
 *             `myModule.run(['$route', function() {}]);`
 *
 * @scope
 * @priority 400
 * @param {string=} onload Expression to evaluate whenever the view updates.
 *
 * @param {string=} autoscroll Whether `ngView` should call {@link ng.$anchorScroll
 *                  $anchorScroll} to scroll the viewport after the view is updated.
 *
 *                  - If the attribute is not set, disable scrolling.
 *                  - If the attribute is set without value, enable scrolling.
 *                  - Otherwise enable scrolling only if the `autoscroll` attribute value evaluated
 *                    as an expression yields a truthy value.
 * @example
    <example name="ngView-directive" module="ngViewExample"
             deps="angular-route.js;angular-animate.js"
             animations="true" fixBase="true">
      <file name="index.html">
        <div ng-controller="MainCtrl as main">
          Choose:
          <a href="Book/Moby">Moby</a> |
          <a href="Book/Moby/ch/1">Moby: Ch1</a> |
          <a href="Book/Gatsby">Gatsby</a> |
          <a href="Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a> |
          <a href="Book/Scarlet">Scarlet Letter</a><br/>

          <div class="view-animate-container">
            <div ng-view class="view-animate"></div>
          </div>
          <hr />

          <pre>$location.path() = {{main.$location.path()}}</pre>
          <pre>$route.current.templateUrl = {{main.$route.current.templateUrl}}</pre>
          <pre>$route.current.params = {{main.$route.current.params}}</pre>
          <pre>$routeParams = {{main.$routeParams}}</pre>
        </div>
      </file>

      <file name="book.html">
        <div>
          controller: {{book.name}}<br />
          Book Id: {{book.params.bookId}}<br />
        </div>
      </file>

      <file name="chapter.html">
        <div>
          controller: {{chapter.name}}<br />
          Book Id: {{chapter.params.bookId}}<br />
          Chapter Id: {{chapter.params.chapterId}}
        </div>
      </file>

      <file name="animations.css">
        .view-animate-container {
          position:relative;
          height:100px!important;
          background:white;
          border:1px solid black;
          height:40px;
          overflow:hidden;
        }

        .view-animate {
          padding:10px;
        }

        .view-animate.ng-enter, .view-animate.ng-leave {
          transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 1.5s;

          display:block;
          width:100%;
          border-left:1px solid black;

          position:absolute;
          top:0;
          left:0;
          right:0;
          bottom:0;
          padding:10px;
        }

        .view-animate.ng-enter {
          left:100%;
        }
        .view-animate.ng-enter.ng-enter-active {
          left:0;
        }
        .view-animate.ng-leave.ng-leave-active {
          left:-100%;
        }
      </file>

      <file name="script.js">
        angular.module('ngViewExample', ['ngRoute', 'ngAnimate'])
          .config(['$routeProvider', '$locationProvider',
            function($routeProvider, $locationProvider) {
              $routeProvider
                .when('/Book/:bookId', {
                  templateUrl: 'book.html',
                  controller: 'BookCtrl',
                  controllerAs: 'book'
                })
                .when('/Book/:bookId/ch/:chapterId', {
                  templateUrl: 'chapter.html',
                  controller: 'ChapterCtrl',
                  controllerAs: 'chapter'
                });

              $locationProvider.html5Mode(true);
          }])
          .controller('MainCtrl', ['$route', '$routeParams', '$location',
            function($route, $routeParams, $location) {
              this.$route = $route;
              this.$location = $location;
              this.$routeParams = $routeParams;
          }])
          .controller('BookCtrl', ['$routeParams', function($routeParams) {
            this.name = "BookCtrl";
            this.params = $routeParams;
          }])
          .controller('ChapterCtrl', ['$routeParams', function($routeParams) {
            this.name = "ChapterCtrl";
            this.params = $routeParams;
          }]);

      </file>

      <file name="protractor.js" type="protractor">
        it('should load and compile correct template', function() {
          element(by.linkText('Moby: Ch1')).click();
          var content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller\: ChapterCtrl/);
          expect(content).toMatch(/Book Id\: Moby/);
          expect(content).toMatch(/Chapter Id\: 1/);

          element(by.partialLinkText('Scarlet')).click();

          content = element(by.css('[ng-view]')).getText();
          expect(content).toMatch(/controller\: BookCtrl/);
          expect(content).toMatch(/Book Id\: Scarlet/);
        });
      </file>
    </example>
 */


/**
 * @ngdoc event
 * @name ngView#$viewContentLoaded
 * @eventType emit on the current ngView scope
 * @description
 * Emitted every time the ngView content is reloaded.
 */
ngViewFactory.$inject = ['$route', '$anchorScroll', '$animate'];
function ngViewFactory($route, $anchorScroll, $animate) {
  return {
    restrict: 'ECA',
    terminal: true,
    priority: 400,
    transclude: 'element',
    link: function(scope, $element, attr, ctrl, $transclude) {
        var currentScope,
            currentElement,
            previousLeaveAnimation,
            autoScrollExp = attr.autoscroll,
            onloadExp = attr.onload || '';

        scope.$on('$routeChangeSuccess', update);
        update();

        function cleanupLastView() {
          if (previousLeaveAnimation) {
            $animate.cancel(previousLeaveAnimation);
            previousLeaveAnimation = null;
          }

          if (currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }
          if (currentElement) {
            previousLeaveAnimation = $animate.leave(currentElement);
            previousLeaveAnimation.then(function() {
              previousLeaveAnimation = null;
            });
            currentElement = null;
          }
        }

        function update() {
          var locals = $route.current && $route.current.locals,
              template = locals && locals.$template;

          if (angular.isDefined(template)) {
            var newScope = scope.$new();
            var current = $route.current;

            // Note: This will also link all children of ng-view that were contained in the original
            // html. If that content contains controllers, ... they could pollute/change the scope.
            // However, using ng-view on an element with additional content does not make sense...
            // Note: We can't remove them in the cloneAttchFn of $transclude as that
            // function is called before linking the content, which would apply child
            // directives to non existing elements.
            var clone = $transclude(newScope, function(clone) {
              $animate.enter(clone, null, currentElement || $element).then(function onNgViewEnter() {
                if (angular.isDefined(autoScrollExp)
                  && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                  $anchorScroll();
                }
              });
              cleanupLastView();
            });

            currentElement = clone;
            currentScope = current.scope = newScope;
            currentScope.$emit('$viewContentLoaded');
            currentScope.$eval(onloadExp);
          } else {
            cleanupLastView();
          }
        }
    }
  };
}

// This directive is called during the $transclude call of the first `ngView` directive.
// It will replace and compile the content of the element with the loaded template.
// We need this directive so that the element content is already filled when
// the link function of another directive on the same element as ngView
// is called.
ngViewFillContentFactory.$inject = ['$compile', '$controller', '$route'];
function ngViewFillContentFactory($compile, $controller, $route) {
  return {
    restrict: 'ECA',
    priority: -400,
    link: function(scope, $element) {
      var current = $route.current,
          locals = current.locals;

      $element.html(locals.$template);

      var link = $compile($element.contents());

      if (current.controller) {
        locals.$scope = scope;
        var controller = $controller(current.controller, locals);
        if (current.controllerAs) {
          scope[current.controllerAs] = controller;
        }
        $element.data('$ngControllerController', controller);
        $element.children().data('$ngControllerController', controller);
      }
      scope[current.resolveAs || '$resolve'] = locals;

      link(scope);
    }
  };
}


})(window, window.angular);

/**
 * cbpAnimatedHeader.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
var cbpAnimatedHeader = (function() {

	var docElem = document.documentElement,
		header = document.querySelector( '.navbar-default' ),
		didScroll = false,
		changeHeaderOn = 300;

	function init() {
		window.addEventListener( 'scroll', function( event ) {
			if( !didScroll ) {
				didScroll = true;
				setTimeout( scrollPage, 250 );
			}
		}, false );
	}

	function scrollPage() {
		var sy = scrollY();
		if ( sy >= changeHeaderOn ) {
			classie.add( header, 'navbar-shrink' );
		}
		else {
			classie.remove( header, 'navbar-shrink' );
		}
		didScroll = false;
	}

	function scrollY() {
		return window.pageYOffset || docElem.scrollTop;
	}

	init();

})();
/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else {
  // browser global
  window.classie = classie;
}

})( window );

(function() {

    var debug = false;

    var root = this;

    var EXIF = function(obj) {
        if (obj instanceof EXIF) return obj;
        if (!(this instanceof EXIF)) return new EXIF(obj);
        this.EXIFwrapped = obj;
    };

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = EXIF;
        }
        exports.EXIF = EXIF;
    } else {
        root.EXIF = EXIF;
    }

    var ExifTags = EXIF.Tags = {

        // version tags
        0x9000 : "ExifVersion",             // EXIF version
        0xA000 : "FlashpixVersion",         // Flashpix format version

        // colorspace tags
        0xA001 : "ColorSpace",              // Color space information tag

        // image configuration
        0xA002 : "PixelXDimension",         // Valid width of meaningful image
        0xA003 : "PixelYDimension",         // Valid height of meaningful image
        0x9101 : "ComponentsConfiguration", // Information about channels
        0x9102 : "CompressedBitsPerPixel",  // Compressed bits per pixel

        // user information
        0x927C : "MakerNote",               // Any desired information written by the manufacturer
        0x9286 : "UserComment",             // Comments by user

        // related file
        0xA004 : "RelatedSoundFile",        // Name of related sound file

        // date and time
        0x9003 : "DateTimeOriginal",        // Date and time when the original image was generated
        0x9004 : "DateTimeDigitized",       // Date and time when the image was stored digitally
        0x9290 : "SubsecTime",              // Fractions of seconds for DateTime
        0x9291 : "SubsecTimeOriginal",      // Fractions of seconds for DateTimeOriginal
        0x9292 : "SubsecTimeDigitized",     // Fractions of seconds for DateTimeDigitized

        // picture-taking conditions
        0x829A : "ExposureTime",            // Exposure time (in seconds)
        0x829D : "FNumber",                 // F number
        0x8822 : "ExposureProgram",         // Exposure program
        0x8824 : "SpectralSensitivity",     // Spectral sensitivity
        0x8827 : "ISOSpeedRatings",         // ISO speed rating
        0x8828 : "OECF",                    // Optoelectric conversion factor
        0x9201 : "ShutterSpeedValue",       // Shutter speed
        0x9202 : "ApertureValue",           // Lens aperture
        0x9203 : "BrightnessValue",         // Value of brightness
        0x9204 : "ExposureBias",            // Exposure bias
        0x9205 : "MaxApertureValue",        // Smallest F number of lens
        0x9206 : "SubjectDistance",         // Distance to subject in meters
        0x9207 : "MeteringMode",            // Metering mode
        0x9208 : "LightSource",             // Kind of light source
        0x9209 : "Flash",                   // Flash status
        0x9214 : "SubjectArea",             // Location and area of main subject
        0x920A : "FocalLength",             // Focal length of the lens in mm
        0xA20B : "FlashEnergy",             // Strobe energy in BCPS
        0xA20C : "SpatialFrequencyResponse",    //
        0xA20E : "FocalPlaneXResolution",   // Number of pixels in width direction per FocalPlaneResolutionUnit
        0xA20F : "FocalPlaneYResolution",   // Number of pixels in height direction per FocalPlaneResolutionUnit
        0xA210 : "FocalPlaneResolutionUnit",    // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
        0xA214 : "SubjectLocation",         // Location of subject in image
        0xA215 : "ExposureIndex",           // Exposure index selected on camera
        0xA217 : "SensingMethod",           // Image sensor type
        0xA300 : "FileSource",              // Image source (3 == DSC)
        0xA301 : "SceneType",               // Scene type (1 == directly photographed)
        0xA302 : "CFAPattern",              // Color filter array geometric pattern
        0xA401 : "CustomRendered",          // Special processing
        0xA402 : "ExposureMode",            // Exposure mode
        0xA403 : "WhiteBalance",            // 1 = auto white balance, 2 = manual
        0xA404 : "DigitalZoomRation",       // Digital zoom ratio
        0xA405 : "FocalLengthIn35mmFilm",   // Equivalent foacl length assuming 35mm film camera (in mm)
        0xA406 : "SceneCaptureType",        // Type of scene
        0xA407 : "GainControl",             // Degree of overall image gain adjustment
        0xA408 : "Contrast",                // Direction of contrast processing applied by camera
        0xA409 : "Saturation",              // Direction of saturation processing applied by camera
        0xA40A : "Sharpness",               // Direction of sharpness processing applied by camera
        0xA40B : "DeviceSettingDescription",    //
        0xA40C : "SubjectDistanceRange",    // Distance to subject

        // other tags
        0xA005 : "InteroperabilityIFDPointer",
        0xA420 : "ImageUniqueID"            // Identifier assigned uniquely to each image
    };

    var TiffTags = EXIF.TiffTags = {
        0x0100 : "ImageWidth",
        0x0101 : "ImageHeight",
        0x8769 : "ExifIFDPointer",
        0x8825 : "GPSInfoIFDPointer",
        0xA005 : "InteroperabilityIFDPointer",
        0x0102 : "BitsPerSample",
        0x0103 : "Compression",
        0x0106 : "PhotometricInterpretation",
        0x0112 : "Orientation",
        0x0115 : "SamplesPerPixel",
        0x011C : "PlanarConfiguration",
        0x0212 : "YCbCrSubSampling",
        0x0213 : "YCbCrPositioning",
        0x011A : "XResolution",
        0x011B : "YResolution",
        0x0128 : "ResolutionUnit",
        0x0111 : "StripOffsets",
        0x0116 : "RowsPerStrip",
        0x0117 : "StripByteCounts",
        0x0201 : "JPEGInterchangeFormat",
        0x0202 : "JPEGInterchangeFormatLength",
        0x012D : "TransferFunction",
        0x013E : "WhitePoint",
        0x013F : "PrimaryChromaticities",
        0x0211 : "YCbCrCoefficients",
        0x0214 : "ReferenceBlackWhite",
        0x0132 : "DateTime",
        0x010E : "ImageDescription",
        0x010F : "Make",
        0x0110 : "Model",
        0x0131 : "Software",
        0x013B : "Artist",
        0x8298 : "Copyright"
    };

    var GPSTags = EXIF.GPSTags = {
        0x0000 : "GPSVersionID",
        0x0001 : "GPSLatitudeRef",
        0x0002 : "GPSLatitude",
        0x0003 : "GPSLongitudeRef",
        0x0004 : "GPSLongitude",
        0x0005 : "GPSAltitudeRef",
        0x0006 : "GPSAltitude",
        0x0007 : "GPSTimeStamp",
        0x0008 : "GPSSatellites",
        0x0009 : "GPSStatus",
        0x000A : "GPSMeasureMode",
        0x000B : "GPSDOP",
        0x000C : "GPSSpeedRef",
        0x000D : "GPSSpeed",
        0x000E : "GPSTrackRef",
        0x000F : "GPSTrack",
        0x0010 : "GPSImgDirectionRef",
        0x0011 : "GPSImgDirection",
        0x0012 : "GPSMapDatum",
        0x0013 : "GPSDestLatitudeRef",
        0x0014 : "GPSDestLatitude",
        0x0015 : "GPSDestLongitudeRef",
        0x0016 : "GPSDestLongitude",
        0x0017 : "GPSDestBearingRef",
        0x0018 : "GPSDestBearing",
        0x0019 : "GPSDestDistanceRef",
        0x001A : "GPSDestDistance",
        0x001B : "GPSProcessingMethod",
        0x001C : "GPSAreaInformation",
        0x001D : "GPSDateStamp",
        0x001E : "GPSDifferential"
    };

    var StringValues = EXIF.StringValues = {
        ExposureProgram : {
            0 : "Not defined",
            1 : "Manual",
            2 : "Normal program",
            3 : "Aperture priority",
            4 : "Shutter priority",
            5 : "Creative program",
            6 : "Action program",
            7 : "Portrait mode",
            8 : "Landscape mode"
        },
        MeteringMode : {
            0 : "Unknown",
            1 : "Average",
            2 : "CenterWeightedAverage",
            3 : "Spot",
            4 : "MultiSpot",
            5 : "Pattern",
            6 : "Partial",
            255 : "Other"
        },
        LightSource : {
            0 : "Unknown",
            1 : "Daylight",
            2 : "Fluorescent",
            3 : "Tungsten (incandescent light)",
            4 : "Flash",
            9 : "Fine weather",
            10 : "Cloudy weather",
            11 : "Shade",
            12 : "Daylight fluorescent (D 5700 - 7100K)",
            13 : "Day white fluorescent (N 4600 - 5400K)",
            14 : "Cool white fluorescent (W 3900 - 4500K)",
            15 : "White fluorescent (WW 3200 - 3700K)",
            17 : "Standard light A",
            18 : "Standard light B",
            19 : "Standard light C",
            20 : "D55",
            21 : "D65",
            22 : "D75",
            23 : "D50",
            24 : "ISO studio tungsten",
            255 : "Other"
        },
        Flash : {
            0x0000 : "Flash did not fire",
            0x0001 : "Flash fired",
            0x0005 : "Strobe return light not detected",
            0x0007 : "Strobe return light detected",
            0x0009 : "Flash fired, compulsory flash mode",
            0x000D : "Flash fired, compulsory flash mode, return light not detected",
            0x000F : "Flash fired, compulsory flash mode, return light detected",
            0x0010 : "Flash did not fire, compulsory flash mode",
            0x0018 : "Flash did not fire, auto mode",
            0x0019 : "Flash fired, auto mode",
            0x001D : "Flash fired, auto mode, return light not detected",
            0x001F : "Flash fired, auto mode, return light detected",
            0x0020 : "No flash function",
            0x0041 : "Flash fired, red-eye reduction mode",
            0x0045 : "Flash fired, red-eye reduction mode, return light not detected",
            0x0047 : "Flash fired, red-eye reduction mode, return light detected",
            0x0049 : "Flash fired, compulsory flash mode, red-eye reduction mode",
            0x004D : "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
            0x004F : "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
            0x0059 : "Flash fired, auto mode, red-eye reduction mode",
            0x005D : "Flash fired, auto mode, return light not detected, red-eye reduction mode",
            0x005F : "Flash fired, auto mode, return light detected, red-eye reduction mode"
        },
        SensingMethod : {
            1 : "Not defined",
            2 : "One-chip color area sensor",
            3 : "Two-chip color area sensor",
            4 : "Three-chip color area sensor",
            5 : "Color sequential area sensor",
            7 : "Trilinear sensor",
            8 : "Color sequential linear sensor"
        },
        SceneCaptureType : {
            0 : "Standard",
            1 : "Landscape",
            2 : "Portrait",
            3 : "Night scene"
        },
        SceneType : {
            1 : "Directly photographed"
        },
        CustomRendered : {
            0 : "Normal process",
            1 : "Custom process"
        },
        WhiteBalance : {
            0 : "Auto white balance",
            1 : "Manual white balance"
        },
        GainControl : {
            0 : "None",
            1 : "Low gain up",
            2 : "High gain up",
            3 : "Low gain down",
            4 : "High gain down"
        },
        Contrast : {
            0 : "Normal",
            1 : "Soft",
            2 : "Hard"
        },
        Saturation : {
            0 : "Normal",
            1 : "Low saturation",
            2 : "High saturation"
        },
        Sharpness : {
            0 : "Normal",
            1 : "Soft",
            2 : "Hard"
        },
        SubjectDistanceRange : {
            0 : "Unknown",
            1 : "Macro",
            2 : "Close view",
            3 : "Distant view"
        },
        FileSource : {
            3 : "DSC"
        },

        Components : {
            0 : "",
            1 : "Y",
            2 : "Cb",
            3 : "Cr",
            4 : "R",
            5 : "G",
            6 : "B"
        }
    };

    function addEvent(element, event, handler) {
        if (element.addEventListener) {
            element.addEventListener(event, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + event, handler);
        }
    }

    function imageHasData(img) {
        return !!(img.exifdata);
    }


    function base64ToArrayBuffer(base64, contentType) {
        contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || ''; // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
        base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
        var binary = atob(base64);
        var len = binary.length;
        var buffer = new ArrayBuffer(len);
        var view = new Uint8Array(buffer);
        for (var i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
        }
        return buffer;
    }

    function objectURLToBlob(url, callback) {
        var http = new XMLHttpRequest();
        http.open("GET", url, true);
        http.responseType = "blob";
        http.onload = function(e) {
            if (this.status == 200 || this.status === 0) {
                callback(this.response);
            }
        };
        http.send();
    }

    function getImageData(img, callback) {
        function handleBinaryFile(binFile) {
            var data = findEXIFinJPEG(binFile);
            var iptcdata = findIPTCinJPEG(binFile);
            img.exifdata = data || {};
            img.iptcdata = iptcdata || {};
            if (callback) {
                callback.call(img);
            }
        }

        if (img.src) {
            if (/^data\:/i.test(img.src)) { // Data URI
                var arrayBuffer = base64ToArrayBuffer(img.src);
                handleBinaryFile(arrayBuffer);

            } else if (/^blob\:/i.test(img.src)) { // Object URL
                var fileReader = new FileReader();
                fileReader.onload = function(e) {
                    handleBinaryFile(e.target.result);
                };
                objectURLToBlob(img.src, function (blob) {
                    fileReader.readAsArrayBuffer(blob);
                });
            } else {
                var http = new XMLHttpRequest();
                http.onload = function() {
                    if (this.status == 200 || this.status === 0) {
                        handleBinaryFile(http.response);
                    } else {
                        throw "Could not load image";
                    }
                    http = null;
                };
                http.open("GET", img.src, true);
                http.responseType = "arraybuffer";
                http.send(null);
            }
        } else if (window.FileReader && (img instanceof window.Blob || img instanceof window.File)) {
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                if (debug) console.log("Got file of length " + e.target.result.byteLength);
                handleBinaryFile(e.target.result);
            };

            fileReader.readAsArrayBuffer(img);
        }
    }

    function findEXIFinJPEG(file) {
        var dataView = new DataView(file);

        if (debug) console.log("Got file of length " + file.byteLength);
        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
            if (debug) console.log("Not a valid JPEG");
            return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength,
            marker;

        while (offset < length) {
            if (dataView.getUint8(offset) != 0xFF) {
                if (debug) console.log("Not a valid marker at offset " + offset + ", found: " + dataView.getUint8(offset));
                return false; // not a valid marker, something is wrong
            }

            marker = dataView.getUint8(offset + 1);
            if (debug) console.log(marker);

            // we could implement handling for other markers here,
            // but we're only looking for 0xFFE1 for EXIF data

            if (marker == 225) {
                if (debug) console.log("Found 0xFFE1 marker");

                return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);

                // offset += 2 + file.getShortAt(offset+2, true);

            } else {
                offset += 2 + dataView.getUint16(offset+2);
            }

        }

    }

    function findIPTCinJPEG(file) {
        var dataView = new DataView(file);

        if (debug) console.log("Got file of length " + file.byteLength);
        if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
            if (debug) console.log("Not a valid JPEG");
            return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength;


        var isFieldSegmentStart = function(dataView, offset){
            return (
                dataView.getUint8(offset) === 0x38 &&
                dataView.getUint8(offset+1) === 0x42 &&
                dataView.getUint8(offset+2) === 0x49 &&
                dataView.getUint8(offset+3) === 0x4D &&
                dataView.getUint8(offset+4) === 0x04 &&
                dataView.getUint8(offset+5) === 0x04
            );
        };

        while (offset < length) {

            if ( isFieldSegmentStart(dataView, offset )){

                // Get the length of the name header (which is padded to an even number of bytes)
                var nameHeaderLength = dataView.getUint8(offset+7);
                if(nameHeaderLength % 2 !== 0) nameHeaderLength += 1;
                // Check for pre photoshop 6 format
                if(nameHeaderLength === 0) {
                    // Always 4
                    nameHeaderLength = 4;
                }

                var startOffset = offset + 8 + nameHeaderLength;
                var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);

                return readIPTCData(file, startOffset, sectionLength);

                break;

            }


            // Not the marker, continue searching
            offset++;

        }

    }
    var IptcFieldMap = {
        0x78 : 'caption',
        0x6E : 'credit',
        0x19 : 'keywords',
        0x37 : 'dateCreated',
        0x50 : 'byline',
        0x55 : 'bylineTitle',
        0x7A : 'captionWriter',
        0x69 : 'headline',
        0x74 : 'copyright',
        0x0F : 'category'
    };
    function readIPTCData(file, startOffset, sectionLength){
        var dataView = new DataView(file);
        var data = {};
        var fieldValue, fieldName, dataSize, segmentType, segmentSize;
        var segmentStartPos = startOffset;
        while(segmentStartPos < startOffset+sectionLength) {
            if(dataView.getUint8(segmentStartPos) === 0x1C && dataView.getUint8(segmentStartPos+1) === 0x02){
                segmentType = dataView.getUint8(segmentStartPos+2);
                if(segmentType in IptcFieldMap) {
                    dataSize = dataView.getInt16(segmentStartPos+3);
                    segmentSize = dataSize + 5;
                    fieldName = IptcFieldMap[segmentType];
                    fieldValue = getStringFromDB(dataView, segmentStartPos+5, dataSize);
                    // Check if we already stored a value with this name
                    if(data.hasOwnProperty(fieldName)) {
                        // Value already stored with this name, create multivalue field
                        if(data[fieldName] instanceof Array) {
                            data[fieldName].push(fieldValue);
                        }
                        else {
                            data[fieldName] = [data[fieldName], fieldValue];
                        }
                    }
                    else {
                        data[fieldName] = fieldValue;
                    }
                }

            }
            segmentStartPos++;
        }
        return data;
    }



    function readTags(file, tiffStart, dirStart, strings, bigEnd) {
        var entries = file.getUint16(dirStart, !bigEnd),
            tags = {},
            entryOffset, tag,
            i;

        for (i=0;i<entries;i++) {
            entryOffset = dirStart + i*12 + 2;
            tag = strings[file.getUint16(entryOffset, !bigEnd)];
            if (!tag && debug) console.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
            tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
        }
        return tags;
    }


    function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
        var type = file.getUint16(entryOffset+2, !bigEnd),
            numValues = file.getUint32(entryOffset+4, !bigEnd),
            valueOffset = file.getUint32(entryOffset+8, !bigEnd) + tiffStart,
            offset,
            vals, val, n,
            numerator, denominator;

        switch (type) {
            case 1: // byte, 8-bit unsigned int
            case 7: // undefined, 8-bit byte, value depending on field
                if (numValues == 1) {
                    return file.getUint8(entryOffset + 8, !bigEnd);
                } else {
                    offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getUint8(offset + n);
                    }
                    return vals;
                }

            case 2: // ascii, 8-bit byte
                offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                return getStringFromDB(file, offset, numValues-1);

            case 3: // short, 16 bit int
                if (numValues == 1) {
                    return file.getUint16(entryOffset + 8, !bigEnd);
                } else {
                    offset = numValues > 2 ? valueOffset : (entryOffset + 8);
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getUint16(offset + 2*n, !bigEnd);
                    }
                    return vals;
                }

            case 4: // long, 32 bit int
                if (numValues == 1) {
                    return file.getUint32(entryOffset + 8, !bigEnd);
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getUint32(valueOffset + 4*n, !bigEnd);
                    }
                    return vals;
                }

            case 5:    // rational = two long values, first is numerator, second is denominator
                if (numValues == 1) {
                    numerator = file.getUint32(valueOffset, !bigEnd);
                    denominator = file.getUint32(valueOffset+4, !bigEnd);
                    val = new Number(numerator / denominator);
                    val.numerator = numerator;
                    val.denominator = denominator;
                    return val;
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        numerator = file.getUint32(valueOffset + 8*n, !bigEnd);
                        denominator = file.getUint32(valueOffset+4 + 8*n, !bigEnd);
                        vals[n] = new Number(numerator / denominator);
                        vals[n].numerator = numerator;
                        vals[n].denominator = denominator;
                    }
                    return vals;
                }

            case 9: // slong, 32 bit signed int
                if (numValues == 1) {
                    return file.getInt32(entryOffset + 8, !bigEnd);
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getInt32(valueOffset + 4*n, !bigEnd);
                    }
                    return vals;
                }

            case 10: // signed rational, two slongs, first is numerator, second is denominator
                if (numValues == 1) {
                    return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset+4, !bigEnd);
                } else {
                    vals = [];
                    for (n=0;n<numValues;n++) {
                        vals[n] = file.getInt32(valueOffset + 8*n, !bigEnd) / file.getInt32(valueOffset+4 + 8*n, !bigEnd);
                    }
                    return vals;
                }
        }
    }

    function getStringFromDB(buffer, start, length) {
        var outstr = "";
        for (n = start; n < start+length; n++) {
            outstr += String.fromCharCode(buffer.getUint8(n));
        }
        return outstr;
    }

    function readEXIFData(file, start) {
        if (getStringFromDB(file, start, 4) != "Exif") {
            if (debug) console.log("Not valid EXIF data! " + getStringFromDB(file, start, 4));
            return false;
        }

        var bigEnd,
            tags, tag,
            exifData, gpsData,
            tiffOffset = start + 6;

        // test for TIFF validity and endianness
        if (file.getUint16(tiffOffset) == 0x4949) {
            bigEnd = false;
        } else if (file.getUint16(tiffOffset) == 0x4D4D) {
            bigEnd = true;
        } else {
            if (debug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
            return false;
        }

        if (file.getUint16(tiffOffset+2, !bigEnd) != 0x002A) {
            if (debug) console.log("Not valid TIFF data! (no 0x002A)");
            return false;
        }

        var firstIFDOffset = file.getUint32(tiffOffset+4, !bigEnd);

        if (firstIFDOffset < 0x00000008) {
            if (debug) console.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset+4, !bigEnd));
            return false;
        }

        tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);

        if (tags.ExifIFDPointer) {
            exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
            for (tag in exifData) {
                switch (tag) {
                    case "LightSource" :
                    case "Flash" :
                    case "MeteringMode" :
                    case "ExposureProgram" :
                    case "SensingMethod" :
                    case "SceneCaptureType" :
                    case "SceneType" :
                    case "CustomRendered" :
                    case "WhiteBalance" :
                    case "GainControl" :
                    case "Contrast" :
                    case "Saturation" :
                    case "Sharpness" :
                    case "SubjectDistanceRange" :
                    case "FileSource" :
                        exifData[tag] = StringValues[tag][exifData[tag]];
                        break;

                    case "ExifVersion" :
                    case "FlashpixVersion" :
                        exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
                        break;

                    case "ComponentsConfiguration" :
                        exifData[tag] =
                            StringValues.Components[exifData[tag][0]] +
                            StringValues.Components[exifData[tag][1]] +
                            StringValues.Components[exifData[tag][2]] +
                            StringValues.Components[exifData[tag][3]];
                        break;
                }
                tags[tag] = exifData[tag];
            }
        }

        if (tags.GPSInfoIFDPointer) {
            gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
            for (tag in gpsData) {
                switch (tag) {
                    case "GPSVersionID" :
                        gpsData[tag] = gpsData[tag][0] +
                            "." + gpsData[tag][1] +
                            "." + gpsData[tag][2] +
                            "." + gpsData[tag][3];
                        break;
                }
                tags[tag] = gpsData[tag];
            }
        }

        return tags;
    }

    EXIF.getData = function(img, callback) {
        if ((img instanceof Image || img instanceof HTMLImageElement) && !img.complete) return false;

        if (!imageHasData(img)) {
            getImageData(img, callback);
        } else {
            if (callback) {
                callback.call(img);
            }
        }
        return true;
    }

    EXIF.getTag = function(img, tag) {
        if (!imageHasData(img)) return;
        return img.exifdata[tag];
    }

    EXIF.getAllTags = function(img) {
        if (!imageHasData(img)) return {};
        var a,
            data = img.exifdata,
            tags = {};
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                tags[a] = data[a];
            }
        }
        return tags;
    }

    EXIF.pretty = function(img) {
        if (!imageHasData(img)) return "";
        var a,
            data = img.exifdata,
            strPretty = "";
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                if (typeof data[a] == "object") {
                    if (data[a] instanceof Number) {
                        strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
                    } else {
                        strPretty += a + " : [" + data[a].length + " values]\r\n";
                    }
                } else {
                    strPretty += a + " : " + data[a] + "\r\n";
                }
            }
        }
        return strPretty;
    }

    EXIF.readFromBinaryFile = function(file) {
        return findEXIFinJPEG(file);
    }

    if (typeof define === 'function' && define.amd) {
        define('exif-js', [], function() {
            return EXIF;
        });
    }
}.call(this));


/*global jQuery */
/*!
* FitText.js 1.2
*
* Copyright 2011, Dave Rupert http://daverupert.com
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
*
* Date: Thu May 05 14:23:00 2011 -0600
*/

(function( $ ){

  $.fn.fitText = function( kompressor, options ) {

    // Setup options
    var compressor = kompressor || 1,
        settings = $.extend({
          'minFontSize' : Number.NEGATIVE_INFINITY,
          'maxFontSize' : Number.POSITIVE_INFINITY
        }, options);

    return this.each(function(){

      // Store the object
      var $this = $(this);

      // Resizer() resizes items based on the object width divided by the compressor * 10
      var resizer = function () {
        $this.css('font-size', Math.max(Math.min($this.width() / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
      };

      // Call once to set.
      resizer();

      // Call on resize. Opera debounces their resize by default.
      $(window).on('resize.fittext orientationchange.fittext', resizer);

    });

  };

})( jQuery );

/*!
 * ngImgCrop v0.3.2
 * https://github.com/alexk111/ngImgCrop
 *
 * Copyright (c) 2014 Alex Kaul
 * License: MIT
 *
 * Generated at Wednesday, December 3rd, 2014, 3:54:12 PM
 */
(function() {
'use strict';

var crop = angular.module('ngImgCrop', []);

crop.factory('cropAreaCircle', ['cropArea', function(CropArea) {
  var CropAreaCircle = function() {
    CropArea.apply(this, arguments);

    this._boxResizeBaseSize = 20;
    this._boxResizeNormalRatio = 0.9;
    this._boxResizeHoverRatio = 1.2;
    this._iconMoveNormalRatio = 0.9;
    this._iconMoveHoverRatio = 1.2;

    this._boxResizeNormalSize = this._boxResizeBaseSize*this._boxResizeNormalRatio;
    this._boxResizeHoverSize = this._boxResizeBaseSize*this._boxResizeHoverRatio;

    this._posDragStartX=0;
    this._posDragStartY=0;
    this._posResizeStartX=0;
    this._posResizeStartY=0;
    this._posResizeStartSize=0;

    this._boxResizeIsHover = false;
    this._areaIsHover = false;
    this._boxResizeIsDragging = false;
    this._areaIsDragging = false;
  };

  CropAreaCircle.prototype = new CropArea();

  CropAreaCircle.prototype._calcCirclePerimeterCoords=function(angleDegrees) {
    var hSize=this._size/2;
    var angleRadians=angleDegrees * (Math.PI / 180),
        circlePerimeterX=this._x + hSize * Math.cos(angleRadians),
        circlePerimeterY=this._y + hSize * Math.sin(angleRadians);
    return [circlePerimeterX, circlePerimeterY];
  };

  CropAreaCircle.prototype._calcResizeIconCenterCoords=function() {
    return this._calcCirclePerimeterCoords(-45);
  };

  CropAreaCircle.prototype._isCoordWithinArea=function(coord) {
    return Math.sqrt((coord[0]-this._x)*(coord[0]-this._x) + (coord[1]-this._y)*(coord[1]-this._y)) < this._size/2;
  };
  CropAreaCircle.prototype._isCoordWithinBoxResize=function(coord) {
    var resizeIconCenterCoords=this._calcResizeIconCenterCoords();
    var hSize=this._boxResizeHoverSize/2;
    return(coord[0] > resizeIconCenterCoords[0] - hSize && coord[0] < resizeIconCenterCoords[0] + hSize &&
           coord[1] > resizeIconCenterCoords[1] - hSize && coord[1] < resizeIconCenterCoords[1] + hSize);
  };

  CropAreaCircle.prototype._drawArea=function(ctx,centerCoords,size){
    ctx.arc(centerCoords[0],centerCoords[1],size/2,0,2*Math.PI);
  };

  CropAreaCircle.prototype.draw=function() {
    CropArea.prototype.draw.apply(this, arguments);

    // draw move icon
    this._cropCanvas.drawIconMove([this._x,this._y], this._areaIsHover?this._iconMoveHoverRatio:this._iconMoveNormalRatio);

    // draw resize cubes
    this._cropCanvas.drawIconResizeBoxNESW(this._calcResizeIconCenterCoords(), this._boxResizeBaseSize, this._boxResizeIsHover?this._boxResizeHoverRatio:this._boxResizeNormalRatio);
  };

  CropAreaCircle.prototype.processMouseMove=function(mouseCurX, mouseCurY) {
    var cursor='default';
    var res=false;

    this._boxResizeIsHover = false;
    this._areaIsHover = false;

    if (this._areaIsDragging) {
      this._x = mouseCurX - this._posDragStartX;
      this._y = mouseCurY - this._posDragStartY;
      this._areaIsHover = true;
      cursor='move';
      res=true;
      this._events.trigger('area-move');
    } else if (this._boxResizeIsDragging) {
        cursor = 'nesw-resize';
        var iFR, iFX, iFY;
        iFX = mouseCurX - this._posResizeStartX;
        iFY = this._posResizeStartY - mouseCurY;
        if(iFX>iFY) {
          iFR = this._posResizeStartSize + iFY*2;
        } else {
          iFR = this._posResizeStartSize + iFX*2;
        }

        this._size = Math.max(this._minSize, iFR);
        this._boxResizeIsHover = true;
        res=true;
        this._events.trigger('area-resize');
    } else if (this._isCoordWithinBoxResize([mouseCurX,mouseCurY])) {
        cursor = 'nesw-resize';
        this._areaIsHover = false;
        this._boxResizeIsHover = true;
        res=true;
    } else if(this._isCoordWithinArea([mouseCurX,mouseCurY])) {
        cursor = 'move';
        this._areaIsHover = true;
        res=true;
    }

    this._dontDragOutside();
    angular.element(this._ctx.canvas).css({'cursor': cursor});

    return res;
  };

  CropAreaCircle.prototype.processMouseDown=function(mouseDownX, mouseDownY) {
    if (this._isCoordWithinBoxResize([mouseDownX,mouseDownY])) {
      this._areaIsDragging = false;
      this._areaIsHover = false;
      this._boxResizeIsDragging = true;
      this._boxResizeIsHover = true;
      this._posResizeStartX=mouseDownX;
      this._posResizeStartY=mouseDownY;
      this._posResizeStartSize = this._size;
      this._events.trigger('area-resize-start');
    } else if (this._isCoordWithinArea([mouseDownX,mouseDownY])) {
      this._areaIsDragging = true;
      this._areaIsHover = true;
      this._boxResizeIsDragging = false;
      this._boxResizeIsHover = false;
      this._posDragStartX = mouseDownX - this._x;
      this._posDragStartY = mouseDownY - this._y;
      this._events.trigger('area-move-start');
    }
  };

  CropAreaCircle.prototype.processMouseUp=function(/*mouseUpX, mouseUpY*/) {
    if(this._areaIsDragging) {
      this._areaIsDragging = false;
      this._events.trigger('area-move-end');
    }
    if(this._boxResizeIsDragging) {
      this._boxResizeIsDragging = false;
      this._events.trigger('area-resize-end');
    }
    this._areaIsHover = false;
    this._boxResizeIsHover = false;

    this._posDragStartX = 0;
    this._posDragStartY = 0;
  };

  return CropAreaCircle;
}]);



crop.factory('cropAreaSquare', ['cropArea', function(CropArea) {
  var CropAreaSquare = function() {
    CropArea.apply(this, arguments);

    this._resizeCtrlBaseRadius = 10;
    this._resizeCtrlNormalRatio = 0.75;
    this._resizeCtrlHoverRatio = 1;
    this._iconMoveNormalRatio = 0.9;
    this._iconMoveHoverRatio = 1.2;

    this._resizeCtrlNormalRadius = this._resizeCtrlBaseRadius*this._resizeCtrlNormalRatio;
    this._resizeCtrlHoverRadius = this._resizeCtrlBaseRadius*this._resizeCtrlHoverRatio;

    this._posDragStartX=0;
    this._posDragStartY=0;
    this._posResizeStartX=0;
    this._posResizeStartY=0;
    this._posResizeStartSize=0;

    this._resizeCtrlIsHover = -1;
    this._areaIsHover = false;
    this._resizeCtrlIsDragging = -1;
    this._areaIsDragging = false;
  };

  CropAreaSquare.prototype = new CropArea();

  CropAreaSquare.prototype._calcSquareCorners=function() {
    var hSize=this._size/2;
    return [
      [this._x-hSize, this._y-hSize],
      [this._x+hSize, this._y-hSize],
      [this._x-hSize, this._y+hSize],
      [this._x+hSize, this._y+hSize]
    ];
  };

  CropAreaSquare.prototype._calcSquareDimensions=function() {
    var hSize=this._size/2;
    return {
      left: this._x-hSize,
      top: this._y-hSize,
      right: this._x+hSize,
      bottom: this._y+hSize
    };
  };

  CropAreaSquare.prototype._isCoordWithinArea=function(coord) {
    var squareDimensions=this._calcSquareDimensions();
    return (coord[0]>=squareDimensions.left&&coord[0]<=squareDimensions.right&&coord[1]>=squareDimensions.top&&coord[1]<=squareDimensions.bottom);
  };

  CropAreaSquare.prototype._isCoordWithinResizeCtrl=function(coord) {
    var resizeIconsCenterCoords=this._calcSquareCorners();
    var res=-1;
    for(var i=0,len=resizeIconsCenterCoords.length;i<len;i++) {
      var resizeIconCenterCoords=resizeIconsCenterCoords[i];
      if(coord[0] > resizeIconCenterCoords[0] - this._resizeCtrlHoverRadius && coord[0] < resizeIconCenterCoords[0] + this._resizeCtrlHoverRadius &&
         coord[1] > resizeIconCenterCoords[1] - this._resizeCtrlHoverRadius && coord[1] < resizeIconCenterCoords[1] + this._resizeCtrlHoverRadius) {
        res=i;
        break;
      }
    }
    return res;
  };

  CropAreaSquare.prototype._drawArea=function(ctx,centerCoords,size){
    var hSize=size/2;
    ctx.rect(centerCoords[0]-hSize,centerCoords[1]-hSize,size,size);
  };

  CropAreaSquare.prototype.draw=function() {
    CropArea.prototype.draw.apply(this, arguments);

    // draw move icon
    this._cropCanvas.drawIconMove([this._x,this._y], this._areaIsHover?this._iconMoveHoverRatio:this._iconMoveNormalRatio);

    // draw resize cubes
    var resizeIconsCenterCoords=this._calcSquareCorners();
    for(var i=0,len=resizeIconsCenterCoords.length;i<len;i++) {
      var resizeIconCenterCoords=resizeIconsCenterCoords[i];
      this._cropCanvas.drawIconResizeCircle(resizeIconCenterCoords, this._resizeCtrlBaseRadius, this._resizeCtrlIsHover===i?this._resizeCtrlHoverRatio:this._resizeCtrlNormalRatio);
    }
  };

  CropAreaSquare.prototype.processMouseMove=function(mouseCurX, mouseCurY) {
    var cursor='default';
    var res=false;

    this._resizeCtrlIsHover = -1;
    this._areaIsHover = false;

    if (this._areaIsDragging) {
      this._x = mouseCurX - this._posDragStartX;
      this._y = mouseCurY - this._posDragStartY;
      this._areaIsHover = true;
      cursor='move';
      res=true;
      this._events.trigger('area-move');
    } else if (this._resizeCtrlIsDragging>-1) {
      var xMulti, yMulti;
      switch(this._resizeCtrlIsDragging) {
        case 0: // Top Left
          xMulti=-1;
          yMulti=-1;
          cursor = 'nwse-resize';
          break;
        case 1: // Top Right
          xMulti=1;
          yMulti=-1;
          cursor = 'nesw-resize';
          break;
        case 2: // Bottom Left
          xMulti=-1;
          yMulti=1;
          cursor = 'nesw-resize';
          break;
        case 3: // Bottom Right
          xMulti=1;
          yMulti=1;
          cursor = 'nwse-resize';
          break;
      }
      var iFX = (mouseCurX - this._posResizeStartX)*xMulti;
      var iFY = (mouseCurY - this._posResizeStartY)*yMulti;
      var iFR;
      if(iFX>iFY) {
        iFR = this._posResizeStartSize + iFY;
      } else {
        iFR = this._posResizeStartSize + iFX;
      }
      var wasSize=this._size;
      this._size = Math.max(this._minSize, iFR);
      var posModifier=(this._size-wasSize)/2;
      this._x+=posModifier*xMulti;
      this._y+=posModifier*yMulti;
      this._resizeCtrlIsHover = this._resizeCtrlIsDragging;
      res=true;
      this._events.trigger('area-resize');
    } else {
      var hoveredResizeBox=this._isCoordWithinResizeCtrl([mouseCurX,mouseCurY]);
      if (hoveredResizeBox>-1) {
        switch(hoveredResizeBox) {
          case 0:
            cursor = 'nwse-resize';
            break;
          case 1:
            cursor = 'nesw-resize';
            break;
          case 2:
            cursor = 'nesw-resize';
            break;
          case 3:
            cursor = 'nwse-resize';
            break;
        }
        this._areaIsHover = false;
        this._resizeCtrlIsHover = hoveredResizeBox;
        res=true;
      } else if(this._isCoordWithinArea([mouseCurX,mouseCurY])) {
        cursor = 'move';
        this._areaIsHover = true;
        res=true;
      }
    }

    this._dontDragOutside();
    angular.element(this._ctx.canvas).css({'cursor': cursor});

    return res;
  };

  CropAreaSquare.prototype.processMouseDown=function(mouseDownX, mouseDownY) {
    var isWithinResizeCtrl=this._isCoordWithinResizeCtrl([mouseDownX,mouseDownY]);
    if (isWithinResizeCtrl>-1) {
      this._areaIsDragging = false;
      this._areaIsHover = false;
      this._resizeCtrlIsDragging = isWithinResizeCtrl;
      this._resizeCtrlIsHover = isWithinResizeCtrl;
      this._posResizeStartX=mouseDownX;
      this._posResizeStartY=mouseDownY;
      this._posResizeStartSize = this._size;
      this._events.trigger('area-resize-start');
    } else if (this._isCoordWithinArea([mouseDownX,mouseDownY])) {
      this._areaIsDragging = true;
      this._areaIsHover = true;
      this._resizeCtrlIsDragging = -1;
      this._resizeCtrlIsHover = -1;
      this._posDragStartX = mouseDownX - this._x;
      this._posDragStartY = mouseDownY - this._y;
      this._events.trigger('area-move-start');
    }
  };

  CropAreaSquare.prototype.processMouseUp=function(/*mouseUpX, mouseUpY*/) {
    if(this._areaIsDragging) {
      this._areaIsDragging = false;
      this._events.trigger('area-move-end');
    }
    if(this._resizeCtrlIsDragging>-1) {
      this._resizeCtrlIsDragging = -1;
      this._events.trigger('area-resize-end');
    }
    this._areaIsHover = false;
    this._resizeCtrlIsHover = -1;

    this._posDragStartX = 0;
    this._posDragStartY = 0;
  };

  return CropAreaSquare;
}]);

crop.factory('cropArea', ['cropCanvas', function(CropCanvas) {
  var CropArea = function(ctx, events) {
    this._ctx=ctx;
    this._events=events;

    this._minSize=80;

    this._cropCanvas=new CropCanvas(ctx);

    this._image=new Image();
    this._x = 0;
    this._y = 0;
    this._size = 200;
  };

  /* GETTERS/SETTERS */

  CropArea.prototype.getImage = function () {
    return this._image;
  };
  CropArea.prototype.setImage = function (image) {
    this._image = image;
  };

  CropArea.prototype.getX = function () {
    return this._x;
  };
  CropArea.prototype.setX = function (x) {
    this._x = x;
    this._dontDragOutside();
  };

  CropArea.prototype.getY = function () {
    return this._y;
  };
  CropArea.prototype.setY = function (y) {
    this._y = y;
    this._dontDragOutside();
  };

  CropArea.prototype.getSize = function () {
    return this._size;
  };
  CropArea.prototype.setSize = function (size) {
    this._size = Math.max(this._minSize, size);
    this._dontDragOutside();
  };

  CropArea.prototype.getMinSize = function () {
    return this._minSize;
  };
  CropArea.prototype.setMinSize = function (size) {
    this._minSize = size;
    this._size = Math.max(this._minSize, this._size);
    this._dontDragOutside();
  };

  /* FUNCTIONS */
  CropArea.prototype._dontDragOutside=function() {
    var h=this._ctx.canvas.height,
        w=this._ctx.canvas.width;
    if(this._size>w) { this._size=w; }
    if(this._size>h) { this._size=h; }
    if(this._x<this._size/2) { this._x=this._size/2; }
    if(this._x>w-this._size/2) { this._x=w-this._size/2; }
    if(this._y<this._size/2) { this._y=this._size/2; }
    if(this._y>h-this._size/2) { this._y=h-this._size/2; }
  };

  CropArea.prototype._drawArea=function() {};

  CropArea.prototype.draw=function() {
    // draw crop area
    this._cropCanvas.drawCropArea(this._image,[this._x,this._y],this._size,this._drawArea);
  };

  CropArea.prototype.processMouseMove=function() {};

  CropArea.prototype.processMouseDown=function() {};

  CropArea.prototype.processMouseUp=function() {};

  return CropArea;
}]);

crop.factory('cropCanvas', [function() {
  // Shape = Array of [x,y]; [0, 0] - center
  var shapeArrowNW=[[-0.5,-2],[-3,-4.5],[-0.5,-7],[-7,-7],[-7,-0.5],[-4.5,-3],[-2,-0.5]];
  var shapeArrowNE=[[0.5,-2],[3,-4.5],[0.5,-7],[7,-7],[7,-0.5],[4.5,-3],[2,-0.5]];
  var shapeArrowSW=[[-0.5,2],[-3,4.5],[-0.5,7],[-7,7],[-7,0.5],[-4.5,3],[-2,0.5]];
  var shapeArrowSE=[[0.5,2],[3,4.5],[0.5,7],[7,7],[7,0.5],[4.5,3],[2,0.5]];
  var shapeArrowN=[[-1.5,-2.5],[-1.5,-6],[-5,-6],[0,-11],[5,-6],[1.5,-6],[1.5,-2.5]];
  var shapeArrowW=[[-2.5,-1.5],[-6,-1.5],[-6,-5],[-11,0],[-6,5],[-6,1.5],[-2.5,1.5]];
  var shapeArrowS=[[-1.5,2.5],[-1.5,6],[-5,6],[0,11],[5,6],[1.5,6],[1.5,2.5]];
  var shapeArrowE=[[2.5,-1.5],[6,-1.5],[6,-5],[11,0],[6,5],[6,1.5],[2.5,1.5]];

  // Colors
  var colors={
    areaOutline: '#fff',
    resizeBoxStroke: '#fff',
    resizeBoxFill: '#444',
    resizeBoxArrowFill: '#fff',
    resizeCircleStroke: '#fff',
    resizeCircleFill: '#444',
    moveIconFill: '#fff'
  };

  return function(ctx){

    /* Base functions */

    // Calculate Point
    var calcPoint=function(point,offset,scale) {
        return [scale*point[0]+offset[0], scale*point[1]+offset[1]];
    };

    // Draw Filled Polygon
    var drawFilledPolygon=function(shape,fillStyle,centerCoords,scale) {
        ctx.save();
        ctx.fillStyle = fillStyle;
        ctx.beginPath();
        var pc, pc0=calcPoint(shape[0],centerCoords,scale);
        ctx.moveTo(pc0[0],pc0[1]);

        for(var p in shape) {
            if (p > 0) {
                pc=calcPoint(shape[p],centerCoords,scale);
                ctx.lineTo(pc[0],pc[1]);
            }
        }

        ctx.lineTo(pc0[0],pc0[1]);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    };

    /* Icons */

    this.drawIconMove=function(centerCoords, scale) {
      drawFilledPolygon(shapeArrowN, colors.moveIconFill, centerCoords, scale);
      drawFilledPolygon(shapeArrowW, colors.moveIconFill, centerCoords, scale);
      drawFilledPolygon(shapeArrowS, colors.moveIconFill, centerCoords, scale);
      drawFilledPolygon(shapeArrowE, colors.moveIconFill, centerCoords, scale);
    };

    this.drawIconResizeCircle=function(centerCoords, circleRadius, scale) {
      var scaledCircleRadius=circleRadius*scale;
      ctx.save();
      ctx.strokeStyle = colors.resizeCircleStroke;
      ctx.lineWidth = 2;
      ctx.fillStyle = colors.resizeCircleFill;
      ctx.beginPath();
      ctx.arc(centerCoords[0],centerCoords[1],scaledCircleRadius,0,2*Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    };

    this.drawIconResizeBoxBase=function(centerCoords, boxSize, scale) {
      var scaledBoxSize=boxSize*scale;
      ctx.save();
      ctx.strokeStyle = colors.resizeBoxStroke;
      ctx.lineWidth = 2;
      ctx.fillStyle = colors.resizeBoxFill;
      ctx.fillRect(centerCoords[0] - scaledBoxSize/2, centerCoords[1] - scaledBoxSize/2, scaledBoxSize, scaledBoxSize);
      ctx.strokeRect(centerCoords[0] - scaledBoxSize/2, centerCoords[1] - scaledBoxSize/2, scaledBoxSize, scaledBoxSize);
      ctx.restore();
    };
    this.drawIconResizeBoxNESW=function(centerCoords, boxSize, scale) {
      this.drawIconResizeBoxBase(centerCoords, boxSize, scale);
      drawFilledPolygon(shapeArrowNE, colors.resizeBoxArrowFill, centerCoords, scale);
      drawFilledPolygon(shapeArrowSW, colors.resizeBoxArrowFill, centerCoords, scale);
    };
    this.drawIconResizeBoxNWSE=function(centerCoords, boxSize, scale) {
      this.drawIconResizeBoxBase(centerCoords, boxSize, scale);
      drawFilledPolygon(shapeArrowNW, colors.resizeBoxArrowFill, centerCoords, scale);
      drawFilledPolygon(shapeArrowSE, colors.resizeBoxArrowFill, centerCoords, scale);
    };

    /* Crop Area */

    this.drawCropArea=function(image, centerCoords, size, fnDrawClipPath) {
      var xRatio=image.width/ctx.canvas.width,
          yRatio=image.height/ctx.canvas.height,
          xLeft=centerCoords[0]-size/2,
          yTop=centerCoords[1]-size/2;

      ctx.save();
      ctx.strokeStyle = colors.areaOutline;
      ctx.lineWidth = 2;
      ctx.beginPath();
      fnDrawClipPath(ctx, centerCoords, size);
      ctx.stroke();
      ctx.clip();

      // draw part of original image
      if (size > 0) {
          ctx.drawImage(image, xLeft*xRatio, yTop*yRatio, size*xRatio, size*yRatio, xLeft, yTop, size, size);
      }

      ctx.beginPath();
      fnDrawClipPath(ctx, centerCoords, size);
      ctx.stroke();
      ctx.clip();

      ctx.restore();
    };

  };
}]);

/**
 * EXIF service is based on the exif-js library (https://github.com/jseidelin/exif-js)
 */

crop.service('cropEXIF', [function() {
  var debug = false;

  var ExifTags = this.Tags = {

      // version tags
      0x9000 : "ExifVersion",             // EXIF version
      0xA000 : "FlashpixVersion",         // Flashpix format version

      // colorspace tags
      0xA001 : "ColorSpace",              // Color space information tag

      // image configuration
      0xA002 : "PixelXDimension",         // Valid width of meaningful image
      0xA003 : "PixelYDimension",         // Valid height of meaningful image
      0x9101 : "ComponentsConfiguration", // Information about channels
      0x9102 : "CompressedBitsPerPixel",  // Compressed bits per pixel

      // user information
      0x927C : "MakerNote",               // Any desired information written by the manufacturer
      0x9286 : "UserComment",             // Comments by user

      // related file
      0xA004 : "RelatedSoundFile",        // Name of related sound file

      // date and time
      0x9003 : "DateTimeOriginal",        // Date and time when the original image was generated
      0x9004 : "DateTimeDigitized",       // Date and time when the image was stored digitally
      0x9290 : "SubsecTime",              // Fractions of seconds for DateTime
      0x9291 : "SubsecTimeOriginal",      // Fractions of seconds for DateTimeOriginal
      0x9292 : "SubsecTimeDigitized",     // Fractions of seconds for DateTimeDigitized

      // picture-taking conditions
      0x829A : "ExposureTime",            // Exposure time (in seconds)
      0x829D : "FNumber",                 // F number
      0x8822 : "ExposureProgram",         // Exposure program
      0x8824 : "SpectralSensitivity",     // Spectral sensitivity
      0x8827 : "ISOSpeedRatings",         // ISO speed rating
      0x8828 : "OECF",                    // Optoelectric conversion factor
      0x9201 : "ShutterSpeedValue",       // Shutter speed
      0x9202 : "ApertureValue",           // Lens aperture
      0x9203 : "BrightnessValue",         // Value of brightness
      0x9204 : "ExposureBias",            // Exposure bias
      0x9205 : "MaxApertureValue",        // Smallest F number of lens
      0x9206 : "SubjectDistance",         // Distance to subject in meters
      0x9207 : "MeteringMode",            // Metering mode
      0x9208 : "LightSource",             // Kind of light source
      0x9209 : "Flash",                   // Flash status
      0x9214 : "SubjectArea",             // Location and area of main subject
      0x920A : "FocalLength",             // Focal length of the lens in mm
      0xA20B : "FlashEnergy",             // Strobe energy in BCPS
      0xA20C : "SpatialFrequencyResponse",    //
      0xA20E : "FocalPlaneXResolution",   // Number of pixels in width direction per FocalPlaneResolutionUnit
      0xA20F : "FocalPlaneYResolution",   // Number of pixels in height direction per FocalPlaneResolutionUnit
      0xA210 : "FocalPlaneResolutionUnit",    // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
      0xA214 : "SubjectLocation",         // Location of subject in image
      0xA215 : "ExposureIndex",           // Exposure index selected on camera
      0xA217 : "SensingMethod",           // Image sensor type
      0xA300 : "FileSource",              // Image source (3 == DSC)
      0xA301 : "SceneType",               // Scene type (1 == directly photographed)
      0xA302 : "CFAPattern",              // Color filter array geometric pattern
      0xA401 : "CustomRendered",          // Special processing
      0xA402 : "ExposureMode",            // Exposure mode
      0xA403 : "WhiteBalance",            // 1 = auto white balance, 2 = manual
      0xA404 : "DigitalZoomRation",       // Digital zoom ratio
      0xA405 : "FocalLengthIn35mmFilm",   // Equivalent foacl length assuming 35mm film camera (in mm)
      0xA406 : "SceneCaptureType",        // Type of scene
      0xA407 : "GainControl",             // Degree of overall image gain adjustment
      0xA408 : "Contrast",                // Direction of contrast processing applied by camera
      0xA409 : "Saturation",              // Direction of saturation processing applied by camera
      0xA40A : "Sharpness",               // Direction of sharpness processing applied by camera
      0xA40B : "DeviceSettingDescription",    //
      0xA40C : "SubjectDistanceRange",    // Distance to subject

      // other tags
      0xA005 : "InteroperabilityIFDPointer",
      0xA420 : "ImageUniqueID"            // Identifier assigned uniquely to each image
  };

  var TiffTags = this.TiffTags = {
      0x0100 : "ImageWidth",
      0x0101 : "ImageHeight",
      0x8769 : "ExifIFDPointer",
      0x8825 : "GPSInfoIFDPointer",
      0xA005 : "InteroperabilityIFDPointer",
      0x0102 : "BitsPerSample",
      0x0103 : "Compression",
      0x0106 : "PhotometricInterpretation",
      0x0112 : "Orientation",
      0x0115 : "SamplesPerPixel",
      0x011C : "PlanarConfiguration",
      0x0212 : "YCbCrSubSampling",
      0x0213 : "YCbCrPositioning",
      0x011A : "XResolution",
      0x011B : "YResolution",
      0x0128 : "ResolutionUnit",
      0x0111 : "StripOffsets",
      0x0116 : "RowsPerStrip",
      0x0117 : "StripByteCounts",
      0x0201 : "JPEGInterchangeFormat",
      0x0202 : "JPEGInterchangeFormatLength",
      0x012D : "TransferFunction",
      0x013E : "WhitePoint",
      0x013F : "PrimaryChromaticities",
      0x0211 : "YCbCrCoefficients",
      0x0214 : "ReferenceBlackWhite",
      0x0132 : "DateTime",
      0x010E : "ImageDescription",
      0x010F : "Make",
      0x0110 : "Model",
      0x0131 : "Software",
      0x013B : "Artist",
      0x8298 : "Copyright"
  };

  var GPSTags = this.GPSTags = {
      0x0000 : "GPSVersionID",
      0x0001 : "GPSLatitudeRef",
      0x0002 : "GPSLatitude",
      0x0003 : "GPSLongitudeRef",
      0x0004 : "GPSLongitude",
      0x0005 : "GPSAltitudeRef",
      0x0006 : "GPSAltitude",
      0x0007 : "GPSTimeStamp",
      0x0008 : "GPSSatellites",
      0x0009 : "GPSStatus",
      0x000A : "GPSMeasureMode",
      0x000B : "GPSDOP",
      0x000C : "GPSSpeedRef",
      0x000D : "GPSSpeed",
      0x000E : "GPSTrackRef",
      0x000F : "GPSTrack",
      0x0010 : "GPSImgDirectionRef",
      0x0011 : "GPSImgDirection",
      0x0012 : "GPSMapDatum",
      0x0013 : "GPSDestLatitudeRef",
      0x0014 : "GPSDestLatitude",
      0x0015 : "GPSDestLongitudeRef",
      0x0016 : "GPSDestLongitude",
      0x0017 : "GPSDestBearingRef",
      0x0018 : "GPSDestBearing",
      0x0019 : "GPSDestDistanceRef",
      0x001A : "GPSDestDistance",
      0x001B : "GPSProcessingMethod",
      0x001C : "GPSAreaInformation",
      0x001D : "GPSDateStamp",
      0x001E : "GPSDifferential"
  };

  var StringValues = this.StringValues = {
      ExposureProgram : {
          0 : "Not defined",
          1 : "Manual",
          2 : "Normal program",
          3 : "Aperture priority",
          4 : "Shutter priority",
          5 : "Creative program",
          6 : "Action program",
          7 : "Portrait mode",
          8 : "Landscape mode"
      },
      MeteringMode : {
          0 : "Unknown",
          1 : "Average",
          2 : "CenterWeightedAverage",
          3 : "Spot",
          4 : "MultiSpot",
          5 : "Pattern",
          6 : "Partial",
          255 : "Other"
      },
      LightSource : {
          0 : "Unknown",
          1 : "Daylight",
          2 : "Fluorescent",
          3 : "Tungsten (incandescent light)",
          4 : "Flash",
          9 : "Fine weather",
          10 : "Cloudy weather",
          11 : "Shade",
          12 : "Daylight fluorescent (D 5700 - 7100K)",
          13 : "Day white fluorescent (N 4600 - 5400K)",
          14 : "Cool white fluorescent (W 3900 - 4500K)",
          15 : "White fluorescent (WW 3200 - 3700K)",
          17 : "Standard light A",
          18 : "Standard light B",
          19 : "Standard light C",
          20 : "D55",
          21 : "D65",
          22 : "D75",
          23 : "D50",
          24 : "ISO studio tungsten",
          255 : "Other"
      },
      Flash : {
          0x0000 : "Flash did not fire",
          0x0001 : "Flash fired",
          0x0005 : "Strobe return light not detected",
          0x0007 : "Strobe return light detected",
          0x0009 : "Flash fired, compulsory flash mode",
          0x000D : "Flash fired, compulsory flash mode, return light not detected",
          0x000F : "Flash fired, compulsory flash mode, return light detected",
          0x0010 : "Flash did not fire, compulsory flash mode",
          0x0018 : "Flash did not fire, auto mode",
          0x0019 : "Flash fired, auto mode",
          0x001D : "Flash fired, auto mode, return light not detected",
          0x001F : "Flash fired, auto mode, return light detected",
          0x0020 : "No flash function",
          0x0041 : "Flash fired, red-eye reduction mode",
          0x0045 : "Flash fired, red-eye reduction mode, return light not detected",
          0x0047 : "Flash fired, red-eye reduction mode, return light detected",
          0x0049 : "Flash fired, compulsory flash mode, red-eye reduction mode",
          0x004D : "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
          0x004F : "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
          0x0059 : "Flash fired, auto mode, red-eye reduction mode",
          0x005D : "Flash fired, auto mode, return light not detected, red-eye reduction mode",
          0x005F : "Flash fired, auto mode, return light detected, red-eye reduction mode"
      },
      SensingMethod : {
          1 : "Not defined",
          2 : "One-chip color area sensor",
          3 : "Two-chip color area sensor",
          4 : "Three-chip color area sensor",
          5 : "Color sequential area sensor",
          7 : "Trilinear sensor",
          8 : "Color sequential linear sensor"
      },
      SceneCaptureType : {
          0 : "Standard",
          1 : "Landscape",
          2 : "Portrait",
          3 : "Night scene"
      },
      SceneType : {
          1 : "Directly photographed"
      },
      CustomRendered : {
          0 : "Normal process",
          1 : "Custom process"
      },
      WhiteBalance : {
          0 : "Auto white balance",
          1 : "Manual white balance"
      },
      GainControl : {
          0 : "None",
          1 : "Low gain up",
          2 : "High gain up",
          3 : "Low gain down",
          4 : "High gain down"
      },
      Contrast : {
          0 : "Normal",
          1 : "Soft",
          2 : "Hard"
      },
      Saturation : {
          0 : "Normal",
          1 : "Low saturation",
          2 : "High saturation"
      },
      Sharpness : {
          0 : "Normal",
          1 : "Soft",
          2 : "Hard"
      },
      SubjectDistanceRange : {
          0 : "Unknown",
          1 : "Macro",
          2 : "Close view",
          3 : "Distant view"
      },
      FileSource : {
          3 : "DSC"
      },

      Components : {
          0 : "",
          1 : "Y",
          2 : "Cb",
          3 : "Cr",
          4 : "R",
          5 : "G",
          6 : "B"
      }
  };

  function addEvent(element, event, handler) {
      if (element.addEventListener) {
          element.addEventListener(event, handler, false);
      } else if (element.attachEvent) {
          element.attachEvent("on" + event, handler);
      }
  }

  function imageHasData(img) {
      return !!(img.exifdata);
  }

  function base64ToArrayBuffer(base64, contentType) {
      contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || ''; // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
      base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
      var binary = atob(base64);
      var len = binary.length;
      var buffer = new ArrayBuffer(len);
      var view = new Uint8Array(buffer);
      for (var i = 0; i < len; i++) {
          view[i] = binary.charCodeAt(i);
      }
      return buffer;
  }

  function objectURLToBlob(url, callback) {
      var http = new XMLHttpRequest();
      http.open("GET", url, true);
      http.responseType = "blob";
      http.onload = function(e) {
          if (this.status == 200 || this.status === 0) {
              callback(this.response);
          }
      };
      http.send();
  }

  function getImageData(img, callback) {
      function handleBinaryFile(binFile) {
          var data = findEXIFinJPEG(binFile);
          var iptcdata = findIPTCinJPEG(binFile);
          img.exifdata = data || {};
          img.iptcdata = iptcdata || {};
          if (callback) {
              callback.call(img);
          }
      }

      if (img.src) {
          if (/^data\:/i.test(img.src)) { // Data URI
              var arrayBuffer = base64ToArrayBuffer(img.src);
              handleBinaryFile(arrayBuffer);

          } else if (/^blob\:/i.test(img.src)) { // Object URL
              var fileReader = new FileReader();
              fileReader.onload = function(e) {
                  handleBinaryFile(e.target.result);
              };
              objectURLToBlob(img.src, function (blob) {
                  fileReader.readAsArrayBuffer(blob);
              });
          } else {
              var http = new XMLHttpRequest();
              http.onload = function() {
                  if (this.status == 200 || this.status === 0) {
                      handleBinaryFile(http.response);
                  } else {
                      throw "Could not load image";
                  }
                  http = null;
              };
              http.open("GET", img.src, true);
              http.responseType = "arraybuffer";
              http.send(null);
          }
      } else if (window.FileReader && (img instanceof window.Blob || img instanceof window.File)) {
          var fileReader = new FileReader();
          fileReader.onload = function(e) {
              if (debug) console.log("Got file of length " + e.target.result.byteLength);
              handleBinaryFile(e.target.result);
          };

          fileReader.readAsArrayBuffer(img);
      }
  }

  function findEXIFinJPEG(file) {
      var dataView = new DataView(file);

      if (debug) console.log("Got file of length " + file.byteLength);
      if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
          if (debug) console.log("Not a valid JPEG");
          return false; // not a valid jpeg
      }

      var offset = 2,
          length = file.byteLength,
          marker;

      while (offset < length) {
          if (dataView.getUint8(offset) != 0xFF) {
              if (debug) console.log("Not a valid marker at offset " + offset + ", found: " + dataView.getUint8(offset));
              return false; // not a valid marker, something is wrong
          }

          marker = dataView.getUint8(offset + 1);
          if (debug) console.log(marker);

          // we could implement handling for other markers here,
          // but we're only looking for 0xFFE1 for EXIF data

          if (marker == 225) {
              if (debug) console.log("Found 0xFFE1 marker");

              return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);

              // offset += 2 + file.getShortAt(offset+2, true);

          } else {
              offset += 2 + dataView.getUint16(offset+2);
          }

      }

  }

  function findIPTCinJPEG(file) {
      var dataView = new DataView(file);

      if (debug) console.log("Got file of length " + file.byteLength);
      if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
          if (debug) console.log("Not a valid JPEG");
          return false; // not a valid jpeg
      }

      var offset = 2,
          length = file.byteLength;

      var isFieldSegmentStart = function(dataView, offset){
          return (
              dataView.getUint8(offset) === 0x38 &&
              dataView.getUint8(offset+1) === 0x42 &&
              dataView.getUint8(offset+2) === 0x49 &&
              dataView.getUint8(offset+3) === 0x4D &&
              dataView.getUint8(offset+4) === 0x04 &&
              dataView.getUint8(offset+5) === 0x04
          );
      };

      while (offset < length) {

          if ( isFieldSegmentStart(dataView, offset )){

              // Get the length of the name header (which is padded to an even number of bytes)
              var nameHeaderLength = dataView.getUint8(offset+7);
              if(nameHeaderLength % 2 !== 0) nameHeaderLength += 1;
              // Check for pre photoshop 6 format
              if(nameHeaderLength === 0) {
                  // Always 4
                  nameHeaderLength = 4;
              }

              var startOffset = offset + 8 + nameHeaderLength;
              var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);

              return readIPTCData(file, startOffset, sectionLength);

              break;

          }

          // Not the marker, continue searching
          offset++;

      }

  }
  var IptcFieldMap = {
      0x78 : 'caption',
      0x6E : 'credit',
      0x19 : 'keywords',
      0x37 : 'dateCreated',
      0x50 : 'byline',
      0x55 : 'bylineTitle',
      0x7A : 'captionWriter',
      0x69 : 'headline',
      0x74 : 'copyright',
      0x0F : 'category'
  };
  function readIPTCData(file, startOffset, sectionLength){
      var dataView = new DataView(file);
      var data = {};
      var fieldValue, fieldName, dataSize, segmentType, segmentSize;
      var segmentStartPos = startOffset;
      while(segmentStartPos < startOffset+sectionLength) {
          if(dataView.getUint8(segmentStartPos) === 0x1C && dataView.getUint8(segmentStartPos+1) === 0x02){
              segmentType = dataView.getUint8(segmentStartPos+2);
              if(segmentType in IptcFieldMap) {
                  dataSize = dataView.getInt16(segmentStartPos+3);
                  segmentSize = dataSize + 5;
                  fieldName = IptcFieldMap[segmentType];
                  fieldValue = getStringFromDB(dataView, segmentStartPos+5, dataSize);
                  // Check if we already stored a value with this name
                  if(data.hasOwnProperty(fieldName)) {
                      // Value already stored with this name, create multivalue field
                      if(data[fieldName] instanceof Array) {
                          data[fieldName].push(fieldValue);
                      }
                      else {
                          data[fieldName] = [data[fieldName], fieldValue];
                      }
                  }
                  else {
                      data[fieldName] = fieldValue;
                  }
              }

          }
          segmentStartPos++;
      }
      return data;
  }

  function readTags(file, tiffStart, dirStart, strings, bigEnd) {
      var entries = file.getUint16(dirStart, !bigEnd),
          tags = {},
          entryOffset, tag,
          i;

      for (i=0;i<entries;i++) {
          entryOffset = dirStart + i*12 + 2;
          tag = strings[file.getUint16(entryOffset, !bigEnd)];
          if (!tag && debug) console.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
          tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
      }
      return tags;
  }

  function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
      var type = file.getUint16(entryOffset+2, !bigEnd),
          numValues = file.getUint32(entryOffset+4, !bigEnd),
          valueOffset = file.getUint32(entryOffset+8, !bigEnd) + tiffStart,
          offset,
          vals, val, n,
          numerator, denominator;

      switch (type) {
          case 1: // byte, 8-bit unsigned int
          case 7: // undefined, 8-bit byte, value depending on field
              if (numValues == 1) {
                  return file.getUint8(entryOffset + 8, !bigEnd);
              } else {
                  offset = numValues > 4 ? valueOffset : (entryOffset + 8);
                  vals = [];
                  for (n=0;n<numValues;n++) {
                      vals[n] = file.getUint8(offset + n);
                  }
                  return vals;
              }

          case 2: // ascii, 8-bit byte
              offset = numValues > 4 ? valueOffset : (entryOffset + 8);
              return getStringFromDB(file, offset, numValues-1);

          case 3: // short, 16 bit int
              if (numValues == 1) {
                  return file.getUint16(entryOffset + 8, !bigEnd);
              } else {
                  offset = numValues > 2 ? valueOffset : (entryOffset + 8);
                  vals = [];
                  for (n=0;n<numValues;n++) {
                      vals[n] = file.getUint16(offset + 2*n, !bigEnd);
                  }
                  return vals;
              }

          case 4: // long, 32 bit int
              if (numValues == 1) {
                  return file.getUint32(entryOffset + 8, !bigEnd);
              } else {
                  vals = [];
                  for (n=0;n<numValues;n++) {
                      vals[n] = file.getUint32(valueOffset + 4*n, !bigEnd);
                  }
                  return vals;
              }

          case 5:    // rational = two long values, first is numerator, second is denominator
              if (numValues == 1) {
                  numerator = file.getUint32(valueOffset, !bigEnd);
                  denominator = file.getUint32(valueOffset+4, !bigEnd);
                  val = new Number(numerator / denominator);
                  val.numerator = numerator;
                  val.denominator = denominator;
                  return val;
              } else {
                  vals = [];
                  for (n=0;n<numValues;n++) {
                      numerator = file.getUint32(valueOffset + 8*n, !bigEnd);
                      denominator = file.getUint32(valueOffset+4 + 8*n, !bigEnd);
                      vals[n] = new Number(numerator / denominator);
                      vals[n].numerator = numerator;
                      vals[n].denominator = denominator;
                  }
                  return vals;
              }

          case 9: // slong, 32 bit signed int
              if (numValues == 1) {
                  return file.getInt32(entryOffset + 8, !bigEnd);
              } else {
                  vals = [];
                  for (n=0;n<numValues;n++) {
                      vals[n] = file.getInt32(valueOffset + 4*n, !bigEnd);
                  }
                  return vals;
              }

          case 10: // signed rational, two slongs, first is numerator, second is denominator
              if (numValues == 1) {
                  return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset+4, !bigEnd);
              } else {
                  vals = [];
                  for (n=0;n<numValues;n++) {
                      vals[n] = file.getInt32(valueOffset + 8*n, !bigEnd) / file.getInt32(valueOffset+4 + 8*n, !bigEnd);
                  }
                  return vals;
              }
      }
  }

  function getStringFromDB(buffer, start, length) {
      var outstr = "";
      for (var n = start; n < start+length; n++) {
          outstr += String.fromCharCode(buffer.getUint8(n));
      }
      return outstr;
  }

  function readEXIFData(file, start) {
      if (getStringFromDB(file, start, 4) != "Exif") {
          if (debug) console.log("Not valid EXIF data! " + getStringFromDB(file, start, 4));
          return false;
      }

      var bigEnd,
          tags, tag,
          exifData, gpsData,
          tiffOffset = start + 6;

      // test for TIFF validity and endianness
      if (file.getUint16(tiffOffset) == 0x4949) {
          bigEnd = false;
      } else if (file.getUint16(tiffOffset) == 0x4D4D) {
          bigEnd = true;
      } else {
          if (debug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
          return false;
      }

      if (file.getUint16(tiffOffset+2, !bigEnd) != 0x002A) {
          if (debug) console.log("Not valid TIFF data! (no 0x002A)");
          return false;
      }

      var firstIFDOffset = file.getUint32(tiffOffset+4, !bigEnd);

      if (firstIFDOffset < 0x00000008) {
          if (debug) console.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset+4, !bigEnd));
          return false;
      }

      tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);

      if (tags.ExifIFDPointer) {
          exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
          for (tag in exifData) {
              switch (tag) {
                  case "LightSource" :
                  case "Flash" :
                  case "MeteringMode" :
                  case "ExposureProgram" :
                  case "SensingMethod" :
                  case "SceneCaptureType" :
                  case "SceneType" :
                  case "CustomRendered" :
                  case "WhiteBalance" :
                  case "GainControl" :
                  case "Contrast" :
                  case "Saturation" :
                  case "Sharpness" :
                  case "SubjectDistanceRange" :
                  case "FileSource" :
                      exifData[tag] = StringValues[tag][exifData[tag]];
                      break;

                  case "ExifVersion" :
                  case "FlashpixVersion" :
                      exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
                      break;

                  case "ComponentsConfiguration" :
                      exifData[tag] =
                          StringValues.Components[exifData[tag][0]] +
                          StringValues.Components[exifData[tag][1]] +
                          StringValues.Components[exifData[tag][2]] +
                          StringValues.Components[exifData[tag][3]];
                      break;
              }
              tags[tag] = exifData[tag];
          }
      }

      if (tags.GPSInfoIFDPointer) {
          gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
          for (tag in gpsData) {
              switch (tag) {
                  case "GPSVersionID" :
                      gpsData[tag] = gpsData[tag][0] +
                          "." + gpsData[tag][1] +
                          "." + gpsData[tag][2] +
                          "." + gpsData[tag][3];
                      break;
              }
              tags[tag] = gpsData[tag];
          }
      }

      return tags;
  }

  this.getData = function(img, callback) {
      if ((img instanceof Image || img instanceof HTMLImageElement) && !img.complete) return false;

      if (!imageHasData(img)) {
          getImageData(img, callback);
      } else {
          if (callback) {
              callback.call(img);
          }
      }
      return true;
  }

  this.getTag = function(img, tag) {
      if (!imageHasData(img)) return;
      return img.exifdata[tag];
  }

  this.getAllTags = function(img) {
      if (!imageHasData(img)) return {};
      var a,
          data = img.exifdata,
          tags = {};
      for (a in data) {
          if (data.hasOwnProperty(a)) {
              tags[a] = data[a];
          }
      }
      return tags;
  }

  this.pretty = function(img) {
      if (!imageHasData(img)) return "";
      var a,
          data = img.exifdata,
          strPretty = "";
      for (a in data) {
          if (data.hasOwnProperty(a)) {
              if (typeof data[a] == "object") {
                  if (data[a] instanceof Number) {
                      strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
                  } else {
                      strPretty += a + " : [" + data[a].length + " values]\r\n";
                  }
              } else {
                  strPretty += a + " : " + data[a] + "\r\n";
              }
          }
      }
      return strPretty;
  }

  this.readFromBinaryFile = function(file) {
      return findEXIFinJPEG(file);
  }
}]);

crop.factory('cropHost', ['$document', 'cropAreaCircle', 'cropAreaSquare', 'cropEXIF', function($document, CropAreaCircle, CropAreaSquare, cropEXIF) {
  /* STATIC FUNCTIONS */

  // Get Element's Offset
  var getElementOffset=function(elem) {
      var box = elem.getBoundingClientRect();

      var body = document.body;
      var docElem = document.documentElement;

      var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
      var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

      var clientTop = docElem.clientTop || body.clientTop || 0;
      var clientLeft = docElem.clientLeft || body.clientLeft || 0;

      var top  = box.top +  scrollTop - clientTop;
      var left = box.left + scrollLeft - clientLeft;

      return { top: Math.round(top), left: Math.round(left) };
  };

  return function(elCanvas, opts, events){
    /* PRIVATE VARIABLES */

    // Object Pointers
    var ctx=null,
        image=null,
        theArea=null;

    // Dimensions
    var minCanvasDims=[100,100],
        maxCanvasDims=[300,300];

    // Result Image size
    var resImgSize=200;

    // Result Image type
    var resImgFormat='image/png';

    // Result Image quality
    var resImgQuality=null;

    /* PRIVATE FUNCTIONS */

    // Draw Scene
    function drawScene() {
      // clear canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      if(image!==null) {
        // draw source image
        ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.save();

        // and make it darker
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.restore();

        // draw Area
        theArea.draw();
      }
    }

    // Resets CropHost
    var resetCropHost=function() {
      if(image!==null) {
        theArea.setImage(image);
        var imageDims=[image.width, image.height],
            imageRatio=image.width/image.height,
            canvasDims=imageDims;

        if(canvasDims[0]>maxCanvasDims[0]) {
          canvasDims[0]=maxCanvasDims[0];
          canvasDims[1]=canvasDims[0]/imageRatio;
        } else if(canvasDims[0]<minCanvasDims[0]) {
          canvasDims[0]=minCanvasDims[0];
          canvasDims[1]=canvasDims[0]/imageRatio;
        }
        if(canvasDims[1]>maxCanvasDims[1]) {
          canvasDims[1]=maxCanvasDims[1];
          canvasDims[0]=canvasDims[1]*imageRatio;
        } else if(canvasDims[1]<minCanvasDims[1]) {
          canvasDims[1]=minCanvasDims[1];
          canvasDims[0]=canvasDims[1]*imageRatio;
        }
        elCanvas.prop('width',canvasDims[0]).prop('height',canvasDims[1]).css({'margin-left': -canvasDims[0]/2+'px', 'margin-top': -canvasDims[1]/2+'px'});

        theArea.setX(ctx.canvas.width/2);
        theArea.setY(ctx.canvas.height/2);
        theArea.setSize(Math.min(200, ctx.canvas.width/2, ctx.canvas.height/2));
      } else {
        elCanvas.prop('width',0).prop('height',0).css({'margin-top': 0});
      }

      drawScene();
    };

    /**
     * Returns event.changedTouches directly if event is a TouchEvent.
     * If event is a jQuery event, return changedTouches of event.originalEvent
     */
    var getChangedTouches=function(event){
      if(angular.isDefined(event.changedTouches)){
        return event.changedTouches;
      }else{
        return event.originalEvent.changedTouches;
      }
    };

    var onMouseMove=function(e) {
      if(image!==null) {
        var offset=getElementOffset(ctx.canvas),
            pageX, pageY;
        if(e.type === 'touchmove') {
          pageX=getChangedTouches(e)[0].pageX;
          pageY=getChangedTouches(e)[0].pageY;
        } else {
          pageX=e.pageX;
          pageY=e.pageY;
        }
        theArea.processMouseMove(pageX-offset.left, pageY-offset.top);
        drawScene();
      }
    };

    var onMouseDown=function(e) {
      e.preventDefault();
      e.stopPropagation();
      if(image!==null) {
        var offset=getElementOffset(ctx.canvas),
            pageX, pageY;
        if(e.type === 'touchstart') {
          pageX=getChangedTouches(e)[0].pageX;
          pageY=getChangedTouches(e)[0].pageY;
        } else {
          pageX=e.pageX;
          pageY=e.pageY;
        }
        theArea.processMouseDown(pageX-offset.left, pageY-offset.top);
        drawScene();
      }
    };

    var onMouseUp=function(e) {
      if(image!==null) {
        var offset=getElementOffset(ctx.canvas),
            pageX, pageY;
        if(e.type === 'touchend') {
          pageX=getChangedTouches(e)[0].pageX;
          pageY=getChangedTouches(e)[0].pageY;
        } else {
          pageX=e.pageX;
          pageY=e.pageY;
        }
        theArea.processMouseUp(pageX-offset.left, pageY-offset.top);
        drawScene();
      }
    };

    this.getResultImageDataURI=function() {
      var temp_ctx, temp_canvas;
      temp_canvas = angular.element('<canvas></canvas>')[0];
      temp_ctx = temp_canvas.getContext('2d');
      temp_canvas.width = resImgSize;
      temp_canvas.height = resImgSize;
      if(image!==null){
        temp_ctx.drawImage(image, (theArea.getX()-theArea.getSize()/2)*(image.width/ctx.canvas.width), (theArea.getY()-theArea.getSize()/2)*(image.height/ctx.canvas.height), theArea.getSize()*(image.width/ctx.canvas.width), theArea.getSize()*(image.height/ctx.canvas.height), 0, 0, resImgSize, resImgSize);
      }
      if (resImgQuality!==null ){
        return temp_canvas.toDataURL(resImgFormat, resImgQuality);
      }
      return temp_canvas.toDataURL(resImgFormat);
    };

    this.setNewImageSource = function (imageSource) {
      image = null;
      resetCropHost();
      events.trigger('image-updated');
      if (!!imageSource) {
        var newImage = new Image();
        if (imageSource.substring(0, 4).toLowerCase() === 'http') {
          newImage.crossOrigin = 'anonymous';
        }

        newImage.onload = function () {
          events.trigger('load-done');

          cropEXIF.getData(newImage, function () {

            var orientation = cropEXIF.getTag(newImage, 'Orientation');

            if ([3, 6, 8].indexOf(orientation) > -1) {
              var canvas = document.createElement("canvas"),
                  ctx = canvas.getContext("2d"),
                  cw = newImage.width, ch = newImage.height, cx = 0, cy = 0, deg = 0, rw = 0, rh = 0;
              rw = cw;
              rh = ch;
              switch (orientation) {
                case 3:
                  cx = -newImage.width;
                  cy = -newImage.height;
                  deg = 180;
                  break;
                case 6:
                  cw = newImage.height;
                  ch = newImage.width;
                  cy = -newImage.height;
                  rw = ch;
                  rh = cw;
                  deg = 90;
                  break;
                case 8:
                  cw = newImage.height;
                  ch = newImage.width;
                  cx = -newImage.width;
                  rw = ch;
                  rh = cw;
                  deg = 270;
                  break;
              }

              //// canvas.toDataURL will only work if the canvas isn't too large. Resize to 1000px.
              var maxWorH = 1000;
              if (cw > maxWorH || ch > maxWorH) {
                var p = 0;
                if (cw > maxWorH) {
                  p = (maxWorH) / cw;
                  cw = maxWorH;
                  ch = p * ch;
                } else if (ch > maxWorH) {
                  p = (maxWorH) / ch;
                  ch = maxWorH;
                  cw = p * cw;
                }

                cy = p * cy;
                cx = p * cx;
                rw = p * rw;
                rh = p * rh;
              }

              canvas.width = cw;
              canvas.height = ch;
              ctx.rotate(deg * Math.PI / 180);
              ctx.drawImage(newImage, cx, cy, rw, rh);

              image = new Image();
              image.onload = function () {
                resetCropHost();
                events.trigger('image-updated');
              };

              image.src = canvas.toDataURL("image/png");

            } else {
              image = newImage;
            }

            resetCropHost();
            events.trigger('image-updated');
          });
        };
        newImage.onerror = function () {
          events.trigger('load-error');
        };
        events.trigger('load-start');
        newImage.src = imageSource;
      }
    };

    this.setMaxDimensions=function(width, height) {
      maxCanvasDims=[width,height];

      if(image!==null) {
        var curWidth=ctx.canvas.width,
            curHeight=ctx.canvas.height;

        var imageDims=[image.width, image.height],
            imageRatio=image.width/image.height,
            canvasDims=imageDims;

        if(canvasDims[0]>maxCanvasDims[0]) {
          canvasDims[0]=maxCanvasDims[0];
          canvasDims[1]=canvasDims[0]/imageRatio;
        } else if(canvasDims[0]<minCanvasDims[0]) {
          canvasDims[0]=minCanvasDims[0];
          canvasDims[1]=canvasDims[0]/imageRatio;
        }
        if(canvasDims[1]>maxCanvasDims[1]) {
          canvasDims[1]=maxCanvasDims[1];
          canvasDims[0]=canvasDims[1]*imageRatio;
        } else if(canvasDims[1]<minCanvasDims[1]) {
          canvasDims[1]=minCanvasDims[1];
          canvasDims[0]=canvasDims[1]*imageRatio;
        }
        elCanvas.prop('width',canvasDims[0]).prop('height',canvasDims[1]).css({'margin-left': -canvasDims[0]/2+'px', 'margin-top': -canvasDims[1]/2+'px'});

        var ratioNewCurWidth=ctx.canvas.width/curWidth,
            ratioNewCurHeight=ctx.canvas.height/curHeight,
            ratioMin=Math.min(ratioNewCurWidth, ratioNewCurHeight);

        theArea.setX(theArea.getX()*ratioNewCurWidth);
        theArea.setY(theArea.getY()*ratioNewCurHeight);
        theArea.setSize(theArea.getSize()*ratioMin);
      } else {
        elCanvas.prop('width',0).prop('height',0).css({'margin-top': 0});
      }

      drawScene();

    };

    this.setAreaMinSize=function(size) {
      size=parseInt(size,10);
      if(!isNaN(size)) {
        theArea.setMinSize(size);
        drawScene();
      }
    };

    this.setResultImageSize=function(size) {
      size=parseInt(size,10);
      if(!isNaN(size)) {
        resImgSize=size;
      }
    };

    this.setResultImageFormat=function(format) {
      resImgFormat = format;
    };

    this.setResultImageQuality=function(quality){
      quality = parseFloat(quality);
      if (!isNaN(quality) && quality>=0 && quality<=1){
        resImgQuality = quality;
      }
    };

    this.setAreaType=function(type) {
      var curSize=theArea.getSize(),
          curMinSize=theArea.getMinSize(),
          curX=theArea.getX(),
          curY=theArea.getY();

      var AreaClass=CropAreaCircle;
      if(type==='square') {
        AreaClass=CropAreaSquare;
      }
      theArea = new AreaClass(ctx, events);
      theArea.setMinSize(curMinSize);
      theArea.setSize(curSize);
      theArea.setX(curX);
      theArea.setY(curY);

      // resetCropHost();
      if(image!==null) {
        theArea.setImage(image);
      }

      drawScene();
    };

    /* Life Cycle begins */

    // Init Context var
    ctx = elCanvas[0].getContext('2d');

    // Init CropArea
    theArea = new CropAreaCircle(ctx, events);

    // Init Mouse Event Listeners
    $document.on('mousemove',onMouseMove);
    elCanvas.on('mousedown',onMouseDown);
    $document.on('mouseup',onMouseUp);

    // Init Touch Event Listeners
    $document.on('touchmove',onMouseMove);
    elCanvas.on('touchstart',onMouseDown);
    $document.on('touchend',onMouseUp);

    // CropHost Destructor
    this.destroy=function() {
      $document.off('mousemove',onMouseMove);
      elCanvas.off('mousedown',onMouseDown);
      $document.off('mouseup',onMouseMove);

      $document.off('touchmove',onMouseMove);
      elCanvas.off('touchstart',onMouseDown);
      $document.off('touchend',onMouseMove);

      elCanvas.remove();
    };
  };

}]);


crop.factory('cropPubSub', [function() {
  return function() {
    var events = {};
    // Subscribe
    this.on = function(names, handler) {
      names.split(' ').forEach(function(name) {
        if (!events[name]) {
          events[name] = [];
        }
        events[name].push(handler);
      });
      return this;
    };
    // Publish
    this.trigger = function(name, args) {
      angular.forEach(events[name], function(handler) {
        handler.call(null, args);
      });
      return this;
    };
  };
}]);

crop.directive('imgCrop', ['$timeout', 'cropHost', 'cropPubSub', function($timeout, CropHost, CropPubSub) {
  return {
    restrict: 'E',
    scope: {
      image: '=',
      resultImage: '=',

      changeOnFly: '=',
      areaType: '@',
      areaMinSize: '=',
      resultImageSize: '=',
      resultImageFormat: '@',
      resultImageQuality: '=',

      onChange: '&',
      onLoadBegin: '&',
      onLoadDone: '&',
      onLoadError: '&'
    },
    template: '<canvas></canvas>',
    controller: ['$scope', function($scope) {
      $scope.events = new CropPubSub();
    }],
    link: function(scope, element/*, attrs*/) {
      // Init Events Manager
      var events = scope.events;

      // Init Crop Host
      var cropHost=new CropHost(element.find('canvas'), {}, events);

      // Store Result Image to check if it's changed
      var storedResultImage;

      var updateResultImage=function(scope) {
        var resultImage=cropHost.getResultImageDataURI();
        if(storedResultImage!==resultImage) {
          storedResultImage=resultImage;
          if(angular.isDefined(scope.resultImage)) {
            scope.resultImage=resultImage;
          }
          scope.onChange({$dataURI: scope.resultImage});
        }
      };

      // Wrapper to safely exec functions within $apply on a running $digest cycle
      var fnSafeApply=function(fn) {
        return function(){
          $timeout(function(){
            scope.$apply(function(scope){
              fn(scope);
            });
          });
        };
      };

      // Setup CropHost Event Handlers
      events
        .on('load-start', fnSafeApply(function(scope){
          scope.onLoadBegin({});
        }))
        .on('load-done', fnSafeApply(function(scope){
          scope.onLoadDone({});
        }))
        .on('load-error', fnSafeApply(function(scope){
          scope.onLoadError({});
        }))
        .on('area-move area-resize', fnSafeApply(function(scope){
          if(!!scope.changeOnFly) {
            updateResultImage(scope);
          }
        }))
        .on('area-move-end area-resize-end image-updated', fnSafeApply(function(scope){
          updateResultImage(scope);
        }));

      // Sync CropHost with Directive's options
      scope.$watch('image',function(){
        cropHost.setNewImageSource(scope.image);
      });
      scope.$watch('areaType',function(){
        cropHost.setAreaType(scope.areaType);
        updateResultImage(scope);
      });
      scope.$watch('areaMinSize',function(){
        cropHost.setAreaMinSize(scope.areaMinSize);
        updateResultImage(scope);
      });
      scope.$watch('resultImageSize',function(){
        cropHost.setResultImageSize(scope.resultImageSize);
        updateResultImage(scope);
      });
      scope.$watch('resultImageFormat',function(){
        cropHost.setResultImageFormat(scope.resultImageFormat);
        updateResultImage(scope);
      });
      scope.$watch('resultImageQuality',function(){
        cropHost.setResultImageQuality(scope.resultImageQuality);
        updateResultImage(scope);
      });

      // Update CropHost dimensions when the directive element is resized
      scope.$watch(
        function () {
          return [element[0].clientWidth, element[0].clientHeight];
        },
        function (value) {
          cropHost.setMaxDimensions(value[0],value[1]);
          updateResultImage(scope);
        },
        true
      );

      // Destroy CropHost Instance when the directive is destroying
      scope.$on('$destroy', function(){
          cropHost.destroy();
      });
    }
  };
}]);
}());
/**
 * Copyright (c) 2011-2014 Felix Gnass
 * Licensed under the MIT license
 * http://spin.js.org/
 *
 * Example:
 var opts = {
      lines: 12             // The number of lines to draw
    , length: 7             // The length of each line
    , width: 5              // The line thickness
    , radius: 10            // The radius of the inner circle
    , scale: 1.0            // Scales overall size of the spinner
    , corners: 1            // Roundness (0..1)
    , color: '#000'         // #rgb or #rrggbb
    , opacity: 1/4          // Opacity of the lines
    , rotate: 0             // Rotation offset
    , direction: 1          // 1: clockwise, -1: counterclockwise
    , speed: 1              // Rounds per second
    , trail: 100            // Afterglow percentage
    , fps: 20               // Frames per second when using setTimeout()
    , zIndex: 2e9           // Use a high z-index by default
    , className: 'spinner'  // CSS class to assign to the element
    , top: '50%'            // center vertically
    , left: '50%'           // center horizontally
    , shadow: false         // Whether to render a shadow
    , hwaccel: false        // Whether to use hardware acceleration (might be buggy)
    , position: 'absolute'  // Element positioning
    }
 var target = document.getElementById('foo')
 var spinner = new Spinner(opts).spin(target)
 */
;(function (root, factory) {

    /* CommonJS */
    if (typeof module == 'object' && module.exports) module.exports = factory()

    /* AMD module */
    else if (typeof define == 'function' && define.amd) define(factory)

    /* Browser global */
    else root.Spinner = factory()
}(this, function () {
    "use strict"

    var prefixes = ['webkit', 'Moz', 'ms', 'O'] /* Vendor prefixes */
        , animations = {} /* Animation rules keyed by their name */
        , useCssAnimations /* Whether to use CSS animations or setTimeout */
        , sheet /* A stylesheet to hold the @keyframe or VML rules. */

    /**
     * Utility function to create elements. If no tag name is given,
     * a DIV is created. Optionally properties can be passed.
     */
    function createEl (tag, prop) {
        var el = document.createElement(tag || 'div')
            , n

        for (n in prop) el[n] = prop[n]
        return el
    }

    /**
     * Appends children and returns the parent.
     */
    function ins (parent /* child1, child2, ...*/) {
        for (var i = 1, n = arguments.length; i < n; i++) {
            parent.appendChild(arguments[i])
        }

        return parent
    }

    /**
     * Creates an opacity keyframe animation rule and returns its name.
     * Since most mobile Webkits have timing issues with animation-delay,
     * we create separate rules for each line/segment.
     */
    function addAnimation (alpha, trail, i, lines) {
        var name = ['opacity', trail, ~~(alpha * 100), i, lines].join('-')
            , start = 0.01 + i/lines * 100
            , z = Math.max(1 - (1-alpha) / trail * (100-start), alpha)
            , prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase()
            , pre = prefix && '-' + prefix + '-' || ''

        if (!animations[name]) {
            sheet.insertRule(
                '@' + pre + 'keyframes ' + name + '{' +
                '0%{opacity:' + z + '}' +
                start + '%{opacity:' + alpha + '}' +
                (start+0.01) + '%{opacity:1}' +
                (start+trail) % 100 + '%{opacity:' + alpha + '}' +
                '100%{opacity:' + z + '}' +
                '}', sheet.cssRules.length)

            animations[name] = 1
        }

        return name
    }

    /**
     * Tries various vendor prefixes and returns the first supported property.
     */
    function vendor (el, prop) {
        var s = el.style
            , pp
            , i

        prop = prop.charAt(0).toUpperCase() + prop.slice(1)
        if (s[prop] !== undefined) return prop
        for (i = 0; i < prefixes.length; i++) {
            pp = prefixes[i]+prop
            if (s[pp] !== undefined) return pp
        }
    }

    /**
     * Sets multiple style properties at once.
     */
    function css (el, prop) {
        for (var n in prop) {
            el.style[vendor(el, n) || n] = prop[n]
        }

        return el
    }

    /**
     * Fills in default values.
     */
    function merge (obj) {
        for (var i = 1; i < arguments.length; i++) {
            var def = arguments[i]
            for (var n in def) {
                if (obj[n] === undefined) obj[n] = def[n]
            }
        }
        return obj
    }

    /**
     * Returns the line color from the given string or array.
     */
    function getColor (color, idx) {
        return typeof color == 'string' ? color : color[idx % color.length]
    }

    // Built-in defaults

    var defaults = {
        lines: 12             // The number of lines to draw
        , length: 7             // The length of each line
        , width: 5              // The line thickness
        , radius: 10            // The radius of the inner circle
        , scale: 1.0            // Scales overall size of the spinner
        , corners: 1            // Roundness (0..1)
        , color: '#000'         // #rgb or #rrggbb
        , opacity: 1/4          // Opacity of the lines
        , rotate: 0             // Rotation offset
        , direction: 1          // 1: clockwise, -1: counterclockwise
        , speed: 1              // Rounds per second
        , trail: 100            // Afterglow percentage
        , fps: 20               // Frames per second when using setTimeout()
        , zIndex: 2e9           // Use a high z-index by default
        , className: 'spinner'  // CSS class to assign to the element
        , top: '50%'            // center vertically
        , left: '50%'           // center horizontally
        , shadow: false         // Whether to render a shadow
        , hwaccel: false        // Whether to use hardware acceleration (might be buggy)
        , position: 'absolute'  // Element positioning
    }

    /** The constructor */
    function Spinner (o) {
        this.opts = merge(o || {}, Spinner.defaults, defaults)
    }

    // Global defaults that override the built-ins:
    Spinner.defaults = {}

    merge(Spinner.prototype, {
        /**
         * Adds the spinner to the given target element. If this instance is already
         * spinning, it is automatically removed from its previous target b calling
         * stop() internally.
         */
        spin: function (target) {
            this.stop()

            var self = this
                , o = self.opts
                , el = self.el = createEl(null, {className: o.className})

            css(el, {
                position: o.position
                , width: 0
                , zIndex: o.zIndex
                , left: o.left
                , top: o.top
            })

            if (target) {
                target.insertBefore(el, target.firstChild || null)
            }

            el.setAttribute('role', 'progressbar')
            self.lines(el, self.opts)

            if (!useCssAnimations) {
                // No CSS animation support, use setTimeout() instead
                var i = 0
                    , start = (o.lines - 1) * (1 - o.direction) / 2
                    , alpha
                    , fps = o.fps
                    , f = fps / o.speed
                    , ostep = (1 - o.opacity) / (f * o.trail / 100)
                    , astep = f / o.lines

                    ;(function anim () {
                    i++
                    for (var j = 0; j < o.lines; j++) {
                        alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity)

                        self.opacity(el, j * o.direction + start, alpha, o)
                    }
                    self.timeout = self.el && setTimeout(anim, ~~(1000 / fps))
                })()
            }
            return self
        }

        /**
         * Stops and removes the Spinner.
         */
        , stop: function () {
            var el = this.el
            if (el) {
                clearTimeout(this.timeout)
                if (el.parentNode) el.parentNode.removeChild(el)
                this.el = undefined
            }
            return this
        }

        /**
         * Internal method that draws the individual lines. Will be overwritten
         * in VML fallback mode below.
         */
        , lines: function (el, o) {
            var i = 0
                , start = (o.lines - 1) * (1 - o.direction) / 2
                , seg

            function fill (color, shadow) {
                return css(createEl(), {
                    position: 'absolute'
                    , width: o.scale * (o.length + o.width) + 'px'
                    , height: o.scale * o.width + 'px'
                    , background: color
                    , boxShadow: shadow
                    , transformOrigin: 'left'
                    , transform: 'rotate(' + ~~(360/o.lines*i + o.rotate) + 'deg) translate(' + o.scale*o.radius + 'px' + ',0)'
                    , borderRadius: (o.corners * o.scale * o.width >> 1) + 'px'
                })
            }

            for (; i < o.lines; i++) {
                seg = css(createEl(), {
                    position: 'absolute'
                    , top: 1 + ~(o.scale * o.width / 2) + 'px'
                    , transform: o.hwaccel ? 'translate3d(0,0,0)' : ''
                    , opacity: o.opacity
                    , animation: useCssAnimations && addAnimation(o.opacity, o.trail, start + i * o.direction, o.lines) + ' ' + 1 / o.speed + 's linear infinite'
                })

                if (o.shadow) ins(seg, css(fill('#000', '0 0 4px #000'), {top: '2px'}))
                ins(el, ins(seg, fill(getColor(o.color, i), '0 0 1px rgba(0,0,0,.1)')))
            }
            return el
        }

        /**
         * Internal method that adjusts the opacity of a single line.
         * Will be overwritten in VML fallback mode below.
         */
        , opacity: function (el, i, val) {
            if (i < el.childNodes.length) el.childNodes[i].style.opacity = val
        }

    })


    function initVML () {

        /* Utility function to create a VML tag */
        function vml (tag, attr) {
            return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr)
        }

        // No CSS transforms but VML support, add a CSS rule for VML elements:
        sheet.addRule('.spin-vml', 'behavior:url(#default#VML)')

        Spinner.prototype.lines = function (el, o) {
            var r = o.scale * (o.length + o.width)
                , s = o.scale * 2 * r

            function grp () {
                return css(
                    vml('group', {
                        coordsize: s + ' ' + s
                        , coordorigin: -r + ' ' + -r
                    })
                    , { width: s, height: s }
                )
            }

            var margin = -(o.width + o.length) * o.scale * 2 + 'px'
                , g = css(grp(), {position: 'absolute', top: margin, left: margin})
                , i

            function seg (i, dx, filter) {
                ins(
                    g
                    , ins(
                        css(grp(), {rotation: 360 / o.lines * i + 'deg', left: ~~dx})
                        , ins(
                            css(
                                vml('roundrect', {arcsize: o.corners})
                                , { width: r
                                    , height: o.scale * o.width
                                    , left: o.scale * o.radius
                                    , top: -o.scale * o.width >> 1
                                    , filter: filter
                                }
                            )
                            , vml('fill', {color: getColor(o.color, i), opacity: o.opacity})
                            , vml('stroke', {opacity: 0}) // transparent stroke to fix color bleeding upon opacity change
                        )
                    )
                )
            }

            if (o.shadow)
                for (i = 1; i <= o.lines; i++) {
                    seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)')
                }

            for (i = 1; i <= o.lines; i++) seg(i)
            return ins(el, g)
        }

        Spinner.prototype.opacity = function (el, i, val, o) {
            var c = el.firstChild
            o = o.shadow && o.lines || 0
            if (c && i + o < c.childNodes.length) {
                c = c.childNodes[i + o]; c = c && c.firstChild; c = c && c.firstChild
                if (c) c.opacity = val
            }
        }
    }

    if (typeof document !== 'undefined') {
        sheet = (function () {
            var el = createEl('style', {type : 'text/css'})
            ins(document.getElementsByTagName('head')[0], el)
            return el.sheet || el.styleSheet
        }())

        var probe = css(createEl('group'), {behavior: 'url(#default#VML)'})

        if (!vendor(probe, 'transform') && probe.adj) initVML()
        else useCssAnimations = vendor(probe, 'animation')
    }

    return Spinner

}));
/**
 * Angular Dynamic Locale - 0.1.32
 * https://github.com/lgalfaso/angular-dynamic-locale
 * License: MIT
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function () {
      return (factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    factory();
  }
}(this, function () {
'use strict';
angular.module('tmh.dynamicLocale', []).config(['$provide', function($provide) {
  function makeStateful($delegate) {
    $delegate.$stateful = true;
    return $delegate;
  }

  $provide.decorator('dateFilter', ['$delegate', makeStateful]);
  $provide.decorator('numberFilter', ['$delegate', makeStateful]);
  $provide.decorator('currencyFilter', ['$delegate', makeStateful]);

}])
.constant('tmhDynamicLocale.STORAGE_KEY', 'tmhDynamicLocale.locale')
.provider('tmhDynamicLocale', ['tmhDynamicLocale.STORAGE_KEY', function(STORAGE_KEY) {

  var defaultLocale,
    localeLocationPattern = 'angular/i18n/angular-locale_{{locale}}.js',
    nodeToAppend,
    storageFactory = 'tmhDynamicLocaleStorageCache',
    storage,
    storageKey = STORAGE_KEY,
    promiseCache = {},
    activeLocale,
    extraProperties = {};

  /**
   * Loads a script asynchronously
   *
   * @param {string} url The url for the script
   @ @param {function} callback A function to be called once the script is loaded
   */
  function loadScript(url, callback, errorCallback, $timeout) {
    var script = document.createElement('script'),
      element = nodeToAppend ? nodeToAppend : document.getElementsByTagName("body")[0],
      removed = false;

    script.type = 'text/javascript';
    if (script.readyState) { // IE
      script.onreadystatechange = function () {
        if (script.readyState === 'complete' ||
            script.readyState === 'loaded') {
          script.onreadystatechange = null;
          $timeout(
            function () {
              if (removed) return;
              removed = true;
              element.removeChild(script);
              callback();
            }, 30, false);
        }
      };
    } else { // Others
      script.onload = function () {
        if (removed) return;
        removed = true;
        element.removeChild(script);
        callback();
      };
      script.onerror = function () {
        if (removed) return;
        removed = true;
        element.removeChild(script);
        errorCallback();
      };
    }
    script.src = url;
    script.async = true;
    element.appendChild(script);
  }

  /**
   * Loads a locale and replaces the properties from the current locale with the new locale information
   *
   * @param {string} localeUrl The path to the new locale
   * @param {Object} $locale The locale at the curent scope
   * @param {string} localeId The locale id to load
   * @param {Object} $rootScope The application $rootScope
   * @param {Object} $q The application $q
   * @param {Object} localeCache The current locale cache
   * @param {Object} $timeout The application $timeout
   */
  function loadLocale(localeUrl, $locale, localeId, $rootScope, $q, localeCache, $timeout) {

    function overrideValues(oldObject, newObject) {
      if (activeLocale !== localeId) {
        return;
      }
      angular.forEach(oldObject, function(value, key) {
        if (!newObject[key]) {
          delete oldObject[key];
        } else if (angular.isArray(newObject[key])) {
          oldObject[key].length = newObject[key].length;
        }
      });
      angular.forEach(newObject, function(value, key) {
        if (angular.isArray(newObject[key]) || angular.isObject(newObject[key])) {
          if (!oldObject[key]) {
            oldObject[key] = angular.isArray(newObject[key]) ? [] : {};
          }
          overrideValues(oldObject[key], newObject[key]);
        } else {
          oldObject[key] = newObject[key];
        }
      });
    }


    if (promiseCache[localeId]) {
      activeLocale = localeId;
      return promiseCache[localeId];
    }

    var cachedLocale,
      deferred = $q.defer();
    if (localeId === activeLocale) {
      deferred.resolve($locale);
    } else if ((cachedLocale = localeCache.get(localeId))) {
      activeLocale = localeId;
      $rootScope.$evalAsync(function() {
        overrideValues($locale, cachedLocale);
        storage.put(storageKey, localeId);
        $rootScope.$broadcast('$localeChangeSuccess', localeId, $locale);
        deferred.resolve($locale);
      });
    } else {
      activeLocale = localeId;
      promiseCache[localeId] = deferred.promise;
      loadScript(localeUrl, function() {
        // Create a new injector with the new locale
        var localInjector = angular.injector(['ngLocale']),
          externalLocale = localInjector.get('$locale');

        overrideValues($locale, externalLocale);
        localeCache.put(localeId, externalLocale);
        delete promiseCache[localeId];

        $rootScope.$applyAsync(function() {
          storage.put(storageKey, localeId);
          $rootScope.$broadcast('$localeChangeSuccess', localeId, $locale);
          deferred.resolve($locale);
        });
      }, function() {
        delete promiseCache[localeId];

        $rootScope.$applyAsync(function() {
          if (activeLocale === localeId) {
            activeLocale = $locale.id;
          }
          $rootScope.$broadcast('$localeChangeError', localeId);
          deferred.reject(localeId);
        });
      }, $timeout);
    }
    return deferred.promise;
  }

  this.localeLocationPattern = function(value) {
    if (value) {
      localeLocationPattern = value;
      return this;
    } else {
      return localeLocationPattern;
    }
  };

  this.appendScriptTo = function(nodeElement) {
    nodeToAppend = nodeElement;
  };

  this.useStorage = function(storageName) {
    storageFactory = storageName;
  };

  this.useCookieStorage = function() {
    this.useStorage('$cookieStore');
  };

  this.defaultLocale = function(value) {
    defaultLocale = value;
  };

  this.storageKey = function(value) {
    if (value) {
      storageKey = value;
      return this;
    } else {
      return storageKey;
    }
  };

  this.addLocalePatternValue = function(key, value) {
    extraProperties[key] = value;
  };

  this.$get = ['$rootScope', '$injector', '$interpolate', '$locale', '$q', 'tmhDynamicLocaleCache', '$timeout', function($rootScope, $injector, interpolate, locale, $q, tmhDynamicLocaleCache, $timeout) {
    var localeLocation = interpolate(localeLocationPattern);

    storage = $injector.get(storageFactory);
    $rootScope.$evalAsync(function() {
      var initialLocale;
      if ((initialLocale = (storage.get(storageKey) || defaultLocale))) {
        loadLocaleFn(initialLocale);
      }
    });
    return {
      /**
       * @ngdoc method
       * @description
       * @param {string} value Sets the locale to the new locale. Changing the locale will trigger
       *    a background task that will retrieve the new locale and configure the current $locale
       *    instance with the information from the new locale
       */
      set: loadLocaleFn,
      /**
       * @ngdoc method
       * @description Returns the configured locale
       */
      get: function() {
        return activeLocale;
      }
    };

    function loadLocaleFn(localeId) {
      var baseProperties = {locale: localeId, angularVersion: angular.version.full};
      return loadLocale(localeLocation(angular.extend({}, extraProperties, baseProperties)), locale, localeId, $rootScope, $q, tmhDynamicLocaleCache, $timeout);
    }
  }];
}]).provider('tmhDynamicLocaleCache', function() {
  this.$get = ['$cacheFactory', function($cacheFactory) {
    return $cacheFactory('tmh.dynamicLocales');
  }];
}).provider('tmhDynamicLocaleStorageCache', function() {
  this.$get = ['$cacheFactory', function($cacheFactory) {
    return $cacheFactory('tmh.dynamicLocales.store');
  }];
}).run(['tmhDynamicLocale', angular.noop]);

return 'tmh.dynamicLocale';

}));

/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 2.1.4 - 2016-09-23
 * License: MIT
 */angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.collapse","ui.bootstrap.tabindex","ui.bootstrap.accordion","ui.bootstrap.alert","ui.bootstrap.buttons","ui.bootstrap.carousel","ui.bootstrap.dateparser","ui.bootstrap.isClass","ui.bootstrap.datepicker","ui.bootstrap.position","ui.bootstrap.datepickerPopup","ui.bootstrap.debounce","ui.bootstrap.dropdown","ui.bootstrap.stackedMap","ui.bootstrap.modal","ui.bootstrap.paging","ui.bootstrap.pager","ui.bootstrap.pagination","ui.bootstrap.tooltip","ui.bootstrap.popover","ui.bootstrap.progressbar","ui.bootstrap.rating","ui.bootstrap.tabs","ui.bootstrap.timepicker","ui.bootstrap.typeahead"]);
angular.module("ui.bootstrap.tpls", ["uib/template/accordion/accordion-group.html","uib/template/accordion/accordion.html","uib/template/alert/alert.html","uib/template/carousel/carousel.html","uib/template/carousel/slide.html","uib/template/datepicker/datepicker.html","uib/template/datepicker/day.html","uib/template/datepicker/month.html","uib/template/datepicker/year.html","uib/template/datepickerPopup/popup.html","uib/template/modal/window.html","uib/template/pager/pager.html","uib/template/pagination/pagination.html","uib/template/tooltip/tooltip-html-popup.html","uib/template/tooltip/tooltip-popup.html","uib/template/tooltip/tooltip-template-popup.html","uib/template/popover/popover-html.html","uib/template/popover/popover-template.html","uib/template/popover/popover.html","uib/template/progressbar/bar.html","uib/template/progressbar/progress.html","uib/template/progressbar/progressbar.html","uib/template/rating/rating.html","uib/template/tabs/tab.html","uib/template/tabs/tabset.html","uib/template/timepicker/timepicker.html","uib/template/typeahead/typeahead-match.html","uib/template/typeahead/typeahead-popup.html"]);
angular.module('ui.bootstrap.collapse', [])

  .directive('uibCollapse', ['$animate', '$q', '$parse', '$injector', function($animate, $q, $parse, $injector) {
    var $animateCss = $injector.has('$animateCss') ? $injector.get('$animateCss') : null;
    return {
      link: function(scope, element, attrs) {
        var expandingExpr = $parse(attrs.expanding),
          expandedExpr = $parse(attrs.expanded),
          collapsingExpr = $parse(attrs.collapsing),
          collapsedExpr = $parse(attrs.collapsed),
          horizontal = false,
          css = {},
          cssTo = {};

        init();

        function init() {
          horizontal = !!('horizontal' in attrs);
          if (horizontal) {
            css = {
              width: ''
            };
            cssTo = {width: '0'};
          } else {
            css = {
              height: ''
            };
            cssTo = {height: '0'};
          }
          if (!scope.$eval(attrs.uibCollapse)) {
            element.addClass('in')
              .addClass('collapse')
              .attr('aria-expanded', true)
              .attr('aria-hidden', false)
              .css(css);
          }
        }

        function getScrollFromElement(element) {
          if (horizontal) {
            return {width: element.scrollWidth + 'px'};
          }
          return {height: element.scrollHeight + 'px'};
        }

        function expand() {
          if (element.hasClass('collapse') && element.hasClass('in')) {
            return;
          }

          $q.resolve(expandingExpr(scope))
            .then(function() {
              element.removeClass('collapse')
                .addClass('collapsing')
                .attr('aria-expanded', true)
                .attr('aria-hidden', false);

              if ($animateCss) {
                $animateCss(element, {
                  addClass: 'in',
                  easing: 'ease',
                  css: {
                    overflow: 'hidden'
                  },
                  to: getScrollFromElement(element[0])
                }).start()['finally'](expandDone);
              } else {
                $animate.addClass(element, 'in', {
                  css: {
                    overflow: 'hidden'
                  },
                  to: getScrollFromElement(element[0])
                }).then(expandDone);
              }
            });
        }

        function expandDone() {
          element.removeClass('collapsing')
            .addClass('collapse')
            .css(css);
          expandedExpr(scope);
        }

        function collapse() {
          if (!element.hasClass('collapse') && !element.hasClass('in')) {
            return collapseDone();
          }

          $q.resolve(collapsingExpr(scope))
            .then(function() {
              element
              // IMPORTANT: The width must be set before adding "collapsing" class.
              // Otherwise, the browser attempts to animate from width 0 (in
              // collapsing class) to the given width here.
                .css(getScrollFromElement(element[0]))
                // initially all panel collapse have the collapse class, this removal
                // prevents the animation from jumping to collapsed state
                .removeClass('collapse')
                .addClass('collapsing')
                .attr('aria-expanded', false)
                .attr('aria-hidden', true);

              if ($animateCss) {
                $animateCss(element, {
                  removeClass: 'in',
                  to: cssTo
                }).start()['finally'](collapseDone);
              } else {
                $animate.removeClass(element, 'in', {
                  to: cssTo
                }).then(collapseDone);
              }
            });
        }

        function collapseDone() {
          element.css(cssTo); // Required so that collapse works when animation is disabled
          element.removeClass('collapsing')
            .addClass('collapse');
          collapsedExpr(scope);
        }

        scope.$watch(attrs.uibCollapse, function(shouldCollapse) {
          if (shouldCollapse) {
            collapse();
          } else {
            expand();
          }
        });
      }
    };
  }]);

angular.module('ui.bootstrap.tabindex', [])

.directive('uibTabindexToggle', function() {
  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {
      attrs.$observe('disabled', function(disabled) {
        attrs.$set('tabindex', disabled ? -1 : null);
      });
    }
  };
});

angular.module('ui.bootstrap.accordion', ['ui.bootstrap.collapse', 'ui.bootstrap.tabindex'])

.constant('uibAccordionConfig', {
  closeOthers: true
})

.controller('UibAccordionController', ['$scope', '$attrs', 'uibAccordionConfig', function($scope, $attrs, accordionConfig) {
  // This array keeps track of the accordion groups
  this.groups = [];

  // Ensure that all the groups in this accordion are closed, unless close-others explicitly says not to
  this.closeOthers = function(openGroup) {
    var closeOthers = angular.isDefined($attrs.closeOthers) ?
      $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
    if (closeOthers) {
      angular.forEach(this.groups, function(group) {
        if (group !== openGroup) {
          group.isOpen = false;
        }
      });
    }
  };

  // This is called from the accordion-group directive to add itself to the accordion
  this.addGroup = function(groupScope) {
    var that = this;
    this.groups.push(groupScope);

    groupScope.$on('$destroy', function(event) {
      that.removeGroup(groupScope);
    });
  };

  // This is called from the accordion-group directive when to remove itself
  this.removeGroup = function(group) {
    var index = this.groups.indexOf(group);
    if (index !== -1) {
      this.groups.splice(index, 1);
    }
  };
}])

// The accordion directive simply sets up the directive controller
// and adds an accordion CSS class to itself element.
.directive('uibAccordion', function() {
  return {
    controller: 'UibAccordionController',
    controllerAs: 'accordion',
    transclude: true,
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/accordion/accordion.html';
    }
  };
})

// The accordion-group directive indicates a block of html that will expand and collapse in an accordion
.directive('uibAccordionGroup', function() {
  return {
    require: '^uibAccordion',         // We need this directive to be inside an accordion
    transclude: true,              // It transcludes the contents of the directive into the template
    restrict: 'A',
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/accordion/accordion-group.html';
    },
    scope: {
      heading: '@',               // Interpolate the heading attribute onto this scope
      panelClass: '@?',           // Ditto with panelClass
      isOpen: '=?',
      isDisabled: '=?'
    },
    controller: function() {
      this.setHeading = function(element) {
        this.heading = element;
      };
    },
    link: function(scope, element, attrs, accordionCtrl) {
      element.addClass('panel');
      accordionCtrl.addGroup(scope);

      scope.openClass = attrs.openClass || 'panel-open';
      scope.panelClass = attrs.panelClass || 'panel-default';
      scope.$watch('isOpen', function(value) {
        element.toggleClass(scope.openClass, !!value);
        if (value) {
          accordionCtrl.closeOthers(scope);
        }
      });

      scope.toggleOpen = function($event) {
        if (!scope.isDisabled) {
          if (!$event || $event.which === 32) {
            scope.isOpen = !scope.isOpen;
          }
        }
      };

      var id = 'accordiongroup-' + scope.$id + '-' + Math.floor(Math.random() * 10000);
      scope.headingId = id + '-tab';
      scope.panelId = id + '-panel';
    }
  };
})

// Use accordion-heading below an accordion-group to provide a heading containing HTML
.directive('uibAccordionHeading', function() {
  return {
    transclude: true,   // Grab the contents to be used as the heading
    template: '',       // In effect remove this element!
    replace: true,
    require: '^uibAccordionGroup',
    link: function(scope, element, attrs, accordionGroupCtrl, transclude) {
      // Pass the heading to the accordion-group controller
      // so that it can be transcluded into the right place in the template
      // [The second parameter to transclude causes the elements to be cloned so that they work in ng-repeat]
      accordionGroupCtrl.setHeading(transclude(scope, angular.noop));
    }
  };
})

// Use in the accordion-group template to indicate where you want the heading to be transcluded
// You must provide the property on the accordion-group controller that will hold the transcluded element
.directive('uibAccordionTransclude', function() {
  return {
    require: '^uibAccordionGroup',
    link: function(scope, element, attrs, controller) {
      scope.$watch(function() { return controller[attrs.uibAccordionTransclude]; }, function(heading) {
        if (heading) {
          var elem = angular.element(element[0].querySelector(getHeaderSelectors()));
          elem.html('');
          elem.append(heading);
        }
      });
    }
  };

  function getHeaderSelectors() {
      return 'uib-accordion-header,' +
          'data-uib-accordion-header,' +
          'x-uib-accordion-header,' +
          'uib\\:accordion-header,' +
          '[uib-accordion-header],' +
          '[data-uib-accordion-header],' +
          '[x-uib-accordion-header]';
  }
});

angular.module('ui.bootstrap.alert', [])

.controller('UibAlertController', ['$scope', '$element', '$attrs', '$interpolate', '$timeout', function($scope, $element, $attrs, $interpolate, $timeout) {
  $scope.closeable = !!$attrs.close;
  $element.addClass('alert');
  $attrs.$set('role', 'alert');
  if ($scope.closeable) {
    $element.addClass('alert-dismissible');
  }

  var dismissOnTimeout = angular.isDefined($attrs.dismissOnTimeout) ?
    $interpolate($attrs.dismissOnTimeout)($scope.$parent) : null;

  if (dismissOnTimeout) {
    $timeout(function() {
      $scope.close();
    }, parseInt(dismissOnTimeout, 10));
  }
}])

.directive('uibAlert', function() {
  return {
    controller: 'UibAlertController',
    controllerAs: 'alert',
    restrict: 'A',
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/alert/alert.html';
    },
    transclude: true,
    scope: {
      close: '&'
    }
  };
});

angular.module('ui.bootstrap.buttons', [])

.constant('uibButtonConfig', {
  activeClass: 'active',
  toggleEvent: 'click'
})

.controller('UibButtonsController', ['uibButtonConfig', function(buttonConfig) {
  this.activeClass = buttonConfig.activeClass || 'active';
  this.toggleEvent = buttonConfig.toggleEvent || 'click';
}])

.directive('uibBtnRadio', ['$parse', function($parse) {
  return {
    require: ['uibBtnRadio', 'ngModel'],
    controller: 'UibButtonsController',
    controllerAs: 'buttons',
    link: function(scope, element, attrs, ctrls) {
      var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];
      var uncheckableExpr = $parse(attrs.uibUncheckable);

      element.find('input').css({display: 'none'});

      //model -> UI
      ngModelCtrl.$render = function() {
        element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, scope.$eval(attrs.uibBtnRadio)));
      };

      //ui->model
      element.on(buttonsCtrl.toggleEvent, function() {
        if (attrs.disabled) {
          return;
        }

        var isActive = element.hasClass(buttonsCtrl.activeClass);

        if (!isActive || angular.isDefined(attrs.uncheckable)) {
          scope.$apply(function() {
            ngModelCtrl.$setViewValue(isActive ? null : scope.$eval(attrs.uibBtnRadio));
            ngModelCtrl.$render();
          });
        }
      });

      if (attrs.uibUncheckable) {
        scope.$watch(uncheckableExpr, function(uncheckable) {
          attrs.$set('uncheckable', uncheckable ? '' : undefined);
        });
      }
    }
  };
}])

.directive('uibBtnCheckbox', function() {
  return {
    require: ['uibBtnCheckbox', 'ngModel'],
    controller: 'UibButtonsController',
    controllerAs: 'button',
    link: function(scope, element, attrs, ctrls) {
      var buttonsCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      element.find('input').css({display: 'none'});

      function getTrueValue() {
        return getCheckboxValue(attrs.btnCheckboxTrue, true);
      }

      function getFalseValue() {
        return getCheckboxValue(attrs.btnCheckboxFalse, false);
      }

      function getCheckboxValue(attribute, defaultValue) {
        return angular.isDefined(attribute) ? scope.$eval(attribute) : defaultValue;
      }

      //model -> UI
      ngModelCtrl.$render = function() {
        element.toggleClass(buttonsCtrl.activeClass, angular.equals(ngModelCtrl.$modelValue, getTrueValue()));
      };

      //ui->model
      element.on(buttonsCtrl.toggleEvent, function() {
        if (attrs.disabled) {
          return;
        }

        scope.$apply(function() {
          ngModelCtrl.$setViewValue(element.hasClass(buttonsCtrl.activeClass) ? getFalseValue() : getTrueValue());
          ngModelCtrl.$render();
        });
      });
    }
  };
});

angular.module('ui.bootstrap.carousel', [])

.controller('UibCarouselController', ['$scope', '$element', '$interval', '$timeout', '$animate', function($scope, $element, $interval, $timeout, $animate) {
  var self = this,
    slides = self.slides = $scope.slides = [],
    SLIDE_DIRECTION = 'uib-slideDirection',
    currentIndex = $scope.active,
    currentInterval, isPlaying, bufferedTransitions = [];

  var destroyed = false;
  $element.addClass('carousel');

  self.addSlide = function(slide, element) {
    slides.push({
      slide: slide,
      element: element
    });
    slides.sort(function(a, b) {
      return +a.slide.index - +b.slide.index;
    });
    //if this is the first slide or the slide is set to active, select it
    if (slide.index === $scope.active || slides.length === 1 && !angular.isNumber($scope.active)) {
      if ($scope.$currentTransition) {
        $scope.$currentTransition = null;
      }

      currentIndex = slide.index;
      $scope.active = slide.index;
      setActive(currentIndex);
      self.select(slides[findSlideIndex(slide)]);
      if (slides.length === 1) {
        $scope.play();
      }
    }
  };

  self.getCurrentIndex = function() {
    for (var i = 0; i < slides.length; i++) {
      if (slides[i].slide.index === currentIndex) {
        return i;
      }
    }
  };

  self.next = $scope.next = function() {
    var newIndex = (self.getCurrentIndex() + 1) % slides.length;

    if (newIndex === 0 && $scope.noWrap()) {
      $scope.pause();
      return;
    }

    return self.select(slides[newIndex], 'next');
  };

  self.prev = $scope.prev = function() {
    var newIndex = self.getCurrentIndex() - 1 < 0 ? slides.length - 1 : self.getCurrentIndex() - 1;

    if ($scope.noWrap() && newIndex === slides.length - 1) {
      $scope.pause();
      return;
    }

    return self.select(slides[newIndex], 'prev');
  };

  self.removeSlide = function(slide) {
    var index = findSlideIndex(slide);

    var bufferedIndex = bufferedTransitions.indexOf(slides[index]);
    if (bufferedIndex !== -1) {
      bufferedTransitions.splice(bufferedIndex, 1);
    }

    //get the index of the slide inside the carousel
    slides.splice(index, 1);
    if (slides.length > 0 && currentIndex === index) {
      if (index >= slides.length) {
        currentIndex = slides.length - 1;
        $scope.active = currentIndex;
        setActive(currentIndex);
        self.select(slides[slides.length - 1]);
      } else {
        currentIndex = index;
        $scope.active = currentIndex;
        setActive(currentIndex);
        self.select(slides[index]);
      }
    } else if (currentIndex > index) {
      currentIndex--;
      $scope.active = currentIndex;
    }

    //clean the active value when no more slide
    if (slides.length === 0) {
      currentIndex = null;
      $scope.active = null;
      clearBufferedTransitions();
    }
  };

  /* direction: "prev" or "next" */
  self.select = $scope.select = function(nextSlide, direction) {
    var nextIndex = findSlideIndex(nextSlide.slide);
    //Decide direction if it's not given
    if (direction === undefined) {
      direction = nextIndex > self.getCurrentIndex() ? 'next' : 'prev';
    }
    //Prevent this user-triggered transition from occurring if there is already one in progress
    if (nextSlide.slide.index !== currentIndex &&
      !$scope.$currentTransition) {
      goNext(nextSlide.slide, nextIndex, direction);
    } else if (nextSlide && nextSlide.slide.index !== currentIndex && $scope.$currentTransition) {
      bufferedTransitions.push(slides[nextIndex]);
    }
  };

  /* Allow outside people to call indexOf on slides array */
  $scope.indexOfSlide = function(slide) {
    return +slide.slide.index;
  };

  $scope.isActive = function(slide) {
    return $scope.active === slide.slide.index;
  };

  $scope.isPrevDisabled = function() {
    return $scope.active === 0 && $scope.noWrap();
  };

  $scope.isNextDisabled = function() {
    return $scope.active === slides.length - 1 && $scope.noWrap();
  };

  $scope.pause = function() {
    if (!$scope.noPause) {
      isPlaying = false;
      resetTimer();
    }
  };

  $scope.play = function() {
    if (!isPlaying) {
      isPlaying = true;
      restartTimer();
    }
  };

  $element.on('mouseenter', $scope.pause);
  $element.on('mouseleave', $scope.play);

  $scope.$on('$destroy', function() {
    destroyed = true;
    resetTimer();
  });

  $scope.$watch('noTransition', function(noTransition) {
    $animate.enabled($element, !noTransition);
  });

  $scope.$watch('interval', restartTimer);

  $scope.$watchCollection('slides', resetTransition);

  $scope.$watch('active', function(index) {
    if (angular.isNumber(index) && currentIndex !== index) {
      for (var i = 0; i < slides.length; i++) {
        if (slides[i].slide.index === index) {
          index = i;
          break;
        }
      }

      var slide = slides[index];
      if (slide) {
        setActive(index);
        self.select(slides[index]);
        currentIndex = index;
      }
    }
  });

  function clearBufferedTransitions() {
    while (bufferedTransitions.length) {
      bufferedTransitions.shift();
    }
  }

  function getSlideByIndex(index) {
    for (var i = 0, l = slides.length; i < l; ++i) {
      if (slides[i].index === index) {
        return slides[i];
      }
    }
  }

  function setActive(index) {
    for (var i = 0; i < slides.length; i++) {
      slides[i].slide.active = i === index;
    }
  }

  function goNext(slide, index, direction) {
    if (destroyed) {
      return;
    }

    angular.extend(slide, {direction: direction});
    angular.extend(slides[currentIndex].slide || {}, {direction: direction});
    if ($animate.enabled($element) && !$scope.$currentTransition &&
      slides[index].element && self.slides.length > 1) {
      slides[index].element.data(SLIDE_DIRECTION, slide.direction);
      var currentIdx = self.getCurrentIndex();

      if (angular.isNumber(currentIdx) && slides[currentIdx].element) {
        slides[currentIdx].element.data(SLIDE_DIRECTION, slide.direction);
      }

      $scope.$currentTransition = true;
      $animate.on('addClass', slides[index].element, function(element, phase) {
        if (phase === 'close') {
          $scope.$currentTransition = null;
          $animate.off('addClass', element);
          if (bufferedTransitions.length) {
            var nextSlide = bufferedTransitions.pop().slide;
            var nextIndex = nextSlide.index;
            var nextDirection = nextIndex > self.getCurrentIndex() ? 'next' : 'prev';
            clearBufferedTransitions();

            goNext(nextSlide, nextIndex, nextDirection);
          }
        }
      });
    }

    $scope.active = slide.index;
    currentIndex = slide.index;
    setActive(index);

    //every time you change slides, reset the timer
    restartTimer();
  }

  function findSlideIndex(slide) {
    for (var i = 0; i < slides.length; i++) {
      if (slides[i].slide === slide) {
        return i;
      }
    }
  }

  function resetTimer() {
    if (currentInterval) {
      $interval.cancel(currentInterval);
      currentInterval = null;
    }
  }

  function resetTransition(slides) {
    if (!slides.length) {
      $scope.$currentTransition = null;
      clearBufferedTransitions();
    }
  }

  function restartTimer() {
    resetTimer();
    var interval = +$scope.interval;
    if (!isNaN(interval) && interval > 0) {
      currentInterval = $interval(timerFn, interval);
    }
  }

  function timerFn() {
    var interval = +$scope.interval;
    if (isPlaying && !isNaN(interval) && interval > 0 && slides.length) {
      $scope.next();
    } else {
      $scope.pause();
    }
  }
}])

.directive('uibCarousel', function() {
  return {
    transclude: true,
    controller: 'UibCarouselController',
    controllerAs: 'carousel',
    restrict: 'A',
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/carousel/carousel.html';
    },
    scope: {
      active: '=',
      interval: '=',
      noTransition: '=',
      noPause: '=',
      noWrap: '&'
    }
  };
})

.directive('uibSlide', ['$animate', function($animate) {
  return {
    require: '^uibCarousel',
    restrict: 'A',
    transclude: true,
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/carousel/slide.html';
    },
    scope: {
      actual: '=?',
      index: '=?'
    },
    link: function (scope, element, attrs, carouselCtrl) {
      element.addClass('item');
      carouselCtrl.addSlide(scope, element);
      //when the scope is destroyed then remove the slide from the current slides array
      scope.$on('$destroy', function() {
        carouselCtrl.removeSlide(scope);
      });

      scope.$watch('active', function(active) {
        $animate[active ? 'addClass' : 'removeClass'](element, 'active');
      });
    }
  };
}])

.animation('.item', ['$animateCss',
function($animateCss) {
  var SLIDE_DIRECTION = 'uib-slideDirection';

  function removeClass(element, className, callback) {
    element.removeClass(className);
    if (callback) {
      callback();
    }
  }

  return {
    beforeAddClass: function(element, className, done) {
      if (className === 'active') {
        var stopped = false;
        var direction = element.data(SLIDE_DIRECTION);
        var directionClass = direction === 'next' ? 'left' : 'right';
        var removeClassFn = removeClass.bind(this, element,
          directionClass + ' ' + direction, done);
        element.addClass(direction);

        $animateCss(element, {addClass: directionClass})
          .start()
          .done(removeClassFn);

        return function() {
          stopped = true;
        };
      }
      done();
    },
    beforeRemoveClass: function (element, className, done) {
      if (className === 'active') {
        var stopped = false;
        var direction = element.data(SLIDE_DIRECTION);
        var directionClass = direction === 'next' ? 'left' : 'right';
        var removeClassFn = removeClass.bind(this, element, directionClass, done);

        $animateCss(element, {addClass: directionClass})
          .start()
          .done(removeClassFn);

        return function() {
          stopped = true;
        };
      }
      done();
    }
  };
}]);

angular.module('ui.bootstrap.dateparser', [])

.service('uibDateParser', ['$log', '$locale', 'dateFilter', 'orderByFilter', function($log, $locale, dateFilter, orderByFilter) {
  // Pulled from https://github.com/mbostock/d3/blob/master/src/format/requote.js
  var SPECIAL_CHARACTERS_REGEXP = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

  var localeId;
  var formatCodeToRegex;

  this.init = function() {
    localeId = $locale.id;

    this.parsers = {};
    this.formatters = {};

    formatCodeToRegex = [
      {
        key: 'yyyy',
        regex: '\\d{4}',
        apply: function(value) { this.year = +value; },
        formatter: function(date) {
          var _date = new Date();
          _date.setFullYear(Math.abs(date.getFullYear()));
          return dateFilter(_date, 'yyyy');
        }
      },
      {
        key: 'yy',
        regex: '\\d{2}',
        apply: function(value) { value = +value; this.year = value < 69 ? value + 2000 : value + 1900; },
        formatter: function(date) {
          var _date = new Date();
          _date.setFullYear(Math.abs(date.getFullYear()));
          return dateFilter(_date, 'yy');
        }
      },
      {
        key: 'y',
        regex: '\\d{1,4}',
        apply: function(value) { this.year = +value; },
        formatter: function(date) {
          var _date = new Date();
          _date.setFullYear(Math.abs(date.getFullYear()));
          return dateFilter(_date, 'y');
        }
      },
      {
        key: 'M!',
        regex: '0?[1-9]|1[0-2]',
        apply: function(value) { this.month = value - 1; },
        formatter: function(date) {
          var value = date.getMonth();
          if (/^[0-9]$/.test(value)) {
            return dateFilter(date, 'MM');
          }

          return dateFilter(date, 'M');
        }
      },
      {
        key: 'MMMM',
        regex: $locale.DATETIME_FORMATS.MONTH.join('|'),
        apply: function(value) { this.month = $locale.DATETIME_FORMATS.MONTH.indexOf(value); },
        formatter: function(date) { return dateFilter(date, 'MMMM'); }
      },
      {
        key: 'MMM',
        regex: $locale.DATETIME_FORMATS.SHORTMONTH.join('|'),
        apply: function(value) { this.month = $locale.DATETIME_FORMATS.SHORTMONTH.indexOf(value); },
        formatter: function(date) { return dateFilter(date, 'MMM'); }
      },
      {
        key: 'MM',
        regex: '0[1-9]|1[0-2]',
        apply: function(value) { this.month = value - 1; },
        formatter: function(date) { return dateFilter(date, 'MM'); }
      },
      {
        key: 'M',
        regex: '[1-9]|1[0-2]',
        apply: function(value) { this.month = value - 1; },
        formatter: function(date) { return dateFilter(date, 'M'); }
      },
      {
        key: 'd!',
        regex: '[0-2]?[0-9]{1}|3[0-1]{1}',
        apply: function(value) { this.date = +value; },
        formatter: function(date) {
          var value = date.getDate();
          if (/^[1-9]$/.test(value)) {
            return dateFilter(date, 'dd');
          }

          return dateFilter(date, 'd');
        }
      },
      {
        key: 'dd',
        regex: '[0-2][0-9]{1}|3[0-1]{1}',
        apply: function(value) { this.date = +value; },
        formatter: function(date) { return dateFilter(date, 'dd'); }
      },
      {
        key: 'd',
        regex: '[1-2]?[0-9]{1}|3[0-1]{1}',
        apply: function(value) { this.date = +value; },
        formatter: function(date) { return dateFilter(date, 'd'); }
      },
      {
        key: 'EEEE',
        regex: $locale.DATETIME_FORMATS.DAY.join('|'),
        formatter: function(date) { return dateFilter(date, 'EEEE'); }
      },
      {
        key: 'EEE',
        regex: $locale.DATETIME_FORMATS.SHORTDAY.join('|'),
        formatter: function(date) { return dateFilter(date, 'EEE'); }
      },
      {
        key: 'HH',
        regex: '(?:0|1)[0-9]|2[0-3]',
        apply: function(value) { this.hours = +value; },
        formatter: function(date) { return dateFilter(date, 'HH'); }
      },
      {
        key: 'hh',
        regex: '0[0-9]|1[0-2]',
        apply: function(value) { this.hours = +value; },
        formatter: function(date) { return dateFilter(date, 'hh'); }
      },
      {
        key: 'H',
        regex: '1?[0-9]|2[0-3]',
        apply: function(value) { this.hours = +value; },
        formatter: function(date) { return dateFilter(date, 'H'); }
      },
      {
        key: 'h',
        regex: '[0-9]|1[0-2]',
        apply: function(value) { this.hours = +value; },
        formatter: function(date) { return dateFilter(date, 'h'); }
      },
      {
        key: 'mm',
        regex: '[0-5][0-9]',
        apply: function(value) { this.minutes = +value; },
        formatter: function(date) { return dateFilter(date, 'mm'); }
      },
      {
        key: 'm',
        regex: '[0-9]|[1-5][0-9]',
        apply: function(value) { this.minutes = +value; },
        formatter: function(date) { return dateFilter(date, 'm'); }
      },
      {
        key: 'sss',
        regex: '[0-9][0-9][0-9]',
        apply: function(value) { this.milliseconds = +value; },
        formatter: function(date) { return dateFilter(date, 'sss'); }
      },
      {
        key: 'ss',
        regex: '[0-5][0-9]',
        apply: function(value) { this.seconds = +value; },
        formatter: function(date) { return dateFilter(date, 'ss'); }
      },
      {
        key: 's',
        regex: '[0-9]|[1-5][0-9]',
        apply: function(value) { this.seconds = +value; },
        formatter: function(date) { return dateFilter(date, 's'); }
      },
      {
        key: 'a',
        regex: $locale.DATETIME_FORMATS.AMPMS.join('|'),
        apply: function(value) {
          if (this.hours === 12) {
            this.hours = 0;
          }

          if (value === 'PM') {
            this.hours += 12;
          }
        },
        formatter: function(date) { return dateFilter(date, 'a'); }
      },
      {
        key: 'Z',
        regex: '[+-]\\d{4}',
        apply: function(value) {
          var matches = value.match(/([+-])(\d{2})(\d{2})/),
            sign = matches[1],
            hours = matches[2],
            minutes = matches[3];
          this.hours += toInt(sign + hours);
          this.minutes += toInt(sign + minutes);
        },
        formatter: function(date) {
          return dateFilter(date, 'Z');
        }
      },
      {
        key: 'ww',
        regex: '[0-4][0-9]|5[0-3]',
        formatter: function(date) { return dateFilter(date, 'ww'); }
      },
      {
        key: 'w',
        regex: '[0-9]|[1-4][0-9]|5[0-3]',
        formatter: function(date) { return dateFilter(date, 'w'); }
      },
      {
        key: 'GGGG',
        regex: $locale.DATETIME_FORMATS.ERANAMES.join('|').replace(/\s/g, '\\s'),
        formatter: function(date) { return dateFilter(date, 'GGGG'); }
      },
      {
        key: 'GGG',
        regex: $locale.DATETIME_FORMATS.ERAS.join('|'),
        formatter: function(date) { return dateFilter(date, 'GGG'); }
      },
      {
        key: 'GG',
        regex: $locale.DATETIME_FORMATS.ERAS.join('|'),
        formatter: function(date) { return dateFilter(date, 'GG'); }
      },
      {
        key: 'G',
        regex: $locale.DATETIME_FORMATS.ERAS.join('|'),
        formatter: function(date) { return dateFilter(date, 'G'); }
      }
    ];
  };

  this.init();

  function createParser(format) {
    var map = [], regex = format.split('');

    // check for literal values
    var quoteIndex = format.indexOf('\'');
    if (quoteIndex > -1) {
      var inLiteral = false;
      format = format.split('');
      for (var i = quoteIndex; i < format.length; i++) {
        if (inLiteral) {
          if (format[i] === '\'') {
            if (i + 1 < format.length && format[i+1] === '\'') { // escaped single quote
              format[i+1] = '$';
              regex[i+1] = '';
            } else { // end of literal
              regex[i] = '';
              inLiteral = false;
            }
          }
          format[i] = '$';
        } else {
          if (format[i] === '\'') { // start of literal
            format[i] = '$';
            regex[i] = '';
            inLiteral = true;
          }
        }
      }

      format = format.join('');
    }

    angular.forEach(formatCodeToRegex, function(data) {
      var index = format.indexOf(data.key);

      if (index > -1) {
        format = format.split('');

        regex[index] = '(' + data.regex + ')';
        format[index] = '$'; // Custom symbol to define consumed part of format
        for (var i = index + 1, n = index + data.key.length; i < n; i++) {
          regex[i] = '';
          format[i] = '$';
        }
        format = format.join('');

        map.push({
          index: index,
          key: data.key,
          apply: data.apply,
          matcher: data.regex
        });
      }
    });

    return {
      regex: new RegExp('^' + regex.join('') + '$'),
      map: orderByFilter(map, 'index')
    };
  }

  function createFormatter(format) {
    var formatters = [];
    var i = 0;
    var formatter, literalIdx;
    while (i < format.length) {
      if (angular.isNumber(literalIdx)) {
        if (format.charAt(i) === '\'') {
          if (i + 1 >= format.length || format.charAt(i + 1) !== '\'') {
            formatters.push(constructLiteralFormatter(format, literalIdx, i));
            literalIdx = null;
          }
        } else if (i === format.length) {
          while (literalIdx < format.length) {
            formatter = constructFormatterFromIdx(format, literalIdx);
            formatters.push(formatter);
            literalIdx = formatter.endIdx;
          }
        }

        i++;
        continue;
      }

      if (format.charAt(i) === '\'') {
        literalIdx = i;
        i++;
        continue;
      }

      formatter = constructFormatterFromIdx(format, i);

      formatters.push(formatter.parser);
      i = formatter.endIdx;
    }

    return formatters;
  }

  function constructLiteralFormatter(format, literalIdx, endIdx) {
    return function() {
      return format.substr(literalIdx + 1, endIdx - literalIdx - 1);
    };
  }

  function constructFormatterFromIdx(format, i) {
    var currentPosStr = format.substr(i);
    for (var j = 0; j < formatCodeToRegex.length; j++) {
      if (new RegExp('^' + formatCodeToRegex[j].key).test(currentPosStr)) {
        var data = formatCodeToRegex[j];
        return {
          endIdx: i + data.key.length,
          parser: data.formatter
        };
      }
    }

    return {
      endIdx: i + 1,
      parser: function() {
        return currentPosStr.charAt(0);
      }
    };
  }

  this.filter = function(date, format) {
    if (!angular.isDate(date) || isNaN(date) || !format) {
      return '';
    }

    format = $locale.DATETIME_FORMATS[format] || format;

    if ($locale.id !== localeId) {
      this.init();
    }

    if (!this.formatters[format]) {
      this.formatters[format] = createFormatter(format);
    }

    var formatters = this.formatters[format];

    return formatters.reduce(function(str, formatter) {
      return str + formatter(date);
    }, '');
  };

  this.parse = function(input, format, baseDate) {
    if (!angular.isString(input) || !format) {
      return input;
    }

    format = $locale.DATETIME_FORMATS[format] || format;
    format = format.replace(SPECIAL_CHARACTERS_REGEXP, '\\$&');

    if ($locale.id !== localeId) {
      this.init();
    }

    if (!this.parsers[format]) {
      this.parsers[format] = createParser(format, 'apply');
    }

    var parser = this.parsers[format],
        regex = parser.regex,
        map = parser.map,
        results = input.match(regex),
        tzOffset = false;
    if (results && results.length) {
      var fields, dt;
      if (angular.isDate(baseDate) && !isNaN(baseDate.getTime())) {
        fields = {
          year: baseDate.getFullYear(),
          month: baseDate.getMonth(),
          date: baseDate.getDate(),
          hours: baseDate.getHours(),
          minutes: baseDate.getMinutes(),
          seconds: baseDate.getSeconds(),
          milliseconds: baseDate.getMilliseconds()
        };
      } else {
        if (baseDate) {
          $log.warn('dateparser:', 'baseDate is not a valid date');
        }
        fields = { year: 1900, month: 0, date: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
      }

      for (var i = 1, n = results.length; i < n; i++) {
        var mapper = map[i - 1];
        if (mapper.matcher === 'Z') {
          tzOffset = true;
        }

        if (mapper.apply) {
          mapper.apply.call(fields, results[i]);
        }
      }

      var datesetter = tzOffset ? Date.prototype.setUTCFullYear :
        Date.prototype.setFullYear;
      var timesetter = tzOffset ? Date.prototype.setUTCHours :
        Date.prototype.setHours;

      if (isValid(fields.year, fields.month, fields.date)) {
        if (angular.isDate(baseDate) && !isNaN(baseDate.getTime()) && !tzOffset) {
          dt = new Date(baseDate);
          datesetter.call(dt, fields.year, fields.month, fields.date);
          timesetter.call(dt, fields.hours, fields.minutes,
            fields.seconds, fields.milliseconds);
        } else {
          dt = new Date(0);
          datesetter.call(dt, fields.year, fields.month, fields.date);
          timesetter.call(dt, fields.hours || 0, fields.minutes || 0,
            fields.seconds || 0, fields.milliseconds || 0);
        }
      }

      return dt;
    }
  };

  // Check if date is valid for specific month (and year for February).
  // Month: 0 = Jan, 1 = Feb, etc
  function isValid(year, month, date) {
    if (date < 1) {
      return false;
    }

    if (month === 1 && date > 28) {
      return date === 29 && (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0);
    }

    if (month === 3 || month === 5 || month === 8 || month === 10) {
      return date < 31;
    }

    return true;
  }

  function toInt(str) {
    return parseInt(str, 10);
  }

  this.toTimezone = toTimezone;
  this.fromTimezone = fromTimezone;
  this.timezoneToOffset = timezoneToOffset;
  this.addDateMinutes = addDateMinutes;
  this.convertTimezoneToLocal = convertTimezoneToLocal;

  function toTimezone(date, timezone) {
    return date && timezone ? convertTimezoneToLocal(date, timezone) : date;
  }

  function fromTimezone(date, timezone) {
    return date && timezone ? convertTimezoneToLocal(date, timezone, true) : date;
  }

  //https://github.com/angular/angular.js/blob/622c42169699ec07fc6daaa19fe6d224e5d2f70e/src/Angular.js#L1207
  function timezoneToOffset(timezone, fallback) {
    timezone = timezone.replace(/:/g, '');
    var requestedTimezoneOffset = Date.parse('Jan 01, 1970 00:00:00 ' + timezone) / 60000;
    return isNaN(requestedTimezoneOffset) ? fallback : requestedTimezoneOffset;
  }

  function addDateMinutes(date, minutes) {
    date = new Date(date.getTime());
    date.setMinutes(date.getMinutes() + minutes);
    return date;
  }

  function convertTimezoneToLocal(date, timezone, reverse) {
    reverse = reverse ? -1 : 1;
    var dateTimezoneOffset = date.getTimezoneOffset();
    var timezoneOffset = timezoneToOffset(timezone, dateTimezoneOffset);
    return addDateMinutes(date, reverse * (timezoneOffset - dateTimezoneOffset));
  }
}]);

// Avoiding use of ng-class as it creates a lot of watchers when a class is to be applied to
// at most one element.
angular.module('ui.bootstrap.isClass', [])
.directive('uibIsClass', [
         '$animate',
function ($animate) {
  //                    11111111          22222222
  var ON_REGEXP = /^\s*([\s\S]+?)\s+on\s+([\s\S]+?)\s*$/;
  //                    11111111           22222222
  var IS_REGEXP = /^\s*([\s\S]+?)\s+for\s+([\s\S]+?)\s*$/;

  var dataPerTracked = {};

  return {
    restrict: 'A',
    compile: function(tElement, tAttrs) {
      var linkedScopes = [];
      var instances = [];
      var expToData = {};
      var lastActivated = null;
      var onExpMatches = tAttrs.uibIsClass.match(ON_REGEXP);
      var onExp = onExpMatches[2];
      var expsStr = onExpMatches[1];
      var exps = expsStr.split(',');

      return linkFn;

      function linkFn(scope, element, attrs) {
        linkedScopes.push(scope);
        instances.push({
          scope: scope,
          element: element
        });

        exps.forEach(function(exp, k) {
          addForExp(exp, scope);
        });

        scope.$on('$destroy', removeScope);
      }

      function addForExp(exp, scope) {
        var matches = exp.match(IS_REGEXP);
        var clazz = scope.$eval(matches[1]);
        var compareWithExp = matches[2];
        var data = expToData[exp];
        if (!data) {
          var watchFn = function(compareWithVal) {
            var newActivated = null;
            instances.some(function(instance) {
              var thisVal = instance.scope.$eval(onExp);
              if (thisVal === compareWithVal) {
                newActivated = instance;
                return true;
              }
            });
            if (data.lastActivated !== newActivated) {
              if (data.lastActivated) {
                $animate.removeClass(data.lastActivated.element, clazz);
              }
              if (newActivated) {
                $animate.addClass(newActivated.element, clazz);
              }
              data.lastActivated = newActivated;
            }
          };
          expToData[exp] = data = {
            lastActivated: null,
            scope: scope,
            watchFn: watchFn,
            compareWithExp: compareWithExp,
            watcher: scope.$watch(compareWithExp, watchFn)
          };
        }
        data.watchFn(scope.$eval(compareWithExp));
      }

      function removeScope(e) {
        var removedScope = e.targetScope;
        var index = linkedScopes.indexOf(removedScope);
        linkedScopes.splice(index, 1);
        instances.splice(index, 1);
        if (linkedScopes.length) {
          var newWatchScope = linkedScopes[0];
          angular.forEach(expToData, function(data) {
            if (data.scope === removedScope) {
              data.watcher = newWatchScope.$watch(data.compareWithExp, data.watchFn);
              data.scope = newWatchScope;
            }
          });
        } else {
          expToData = {};
        }
      }
    }
  };
}]);
angular.module('ui.bootstrap.datepicker', ['ui.bootstrap.dateparser', 'ui.bootstrap.isClass'])

.value('$datepickerSuppressError', false)

.value('$datepickerLiteralWarning', true)

.constant('uibDatepickerConfig', {
  datepickerMode: 'day',
  formatDay: 'dd',
  formatMonth: 'MMMM',
  formatYear: 'yyyy',
  formatDayHeader: 'EEE',
  formatDayTitle: 'MMMM yyyy',
  formatMonthTitle: 'yyyy',
  maxDate: null,
  maxMode: 'year',
  minDate: null,
  minMode: 'day',
  monthColumns: 3,
  ngModelOptions: {},
  shortcutPropagation: false,
  showWeeks: true,
  yearColumns: 5,
  yearRows: 4
})

.controller('UibDatepickerController', ['$scope', '$element', '$attrs', '$parse', '$interpolate', '$locale', '$log', 'dateFilter', 'uibDatepickerConfig', '$datepickerLiteralWarning', '$datepickerSuppressError', 'uibDateParser',
  function($scope, $element, $attrs, $parse, $interpolate, $locale, $log, dateFilter, datepickerConfig, $datepickerLiteralWarning, $datepickerSuppressError, dateParser) {
  var self = this,
      ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl;
      ngModelOptions = {},
      watchListeners = [];

  $element.addClass('uib-datepicker');
  $attrs.$set('role', 'application');

  if (!$scope.datepickerOptions) {
    $scope.datepickerOptions = {};
  }

  // Modes chain
  this.modes = ['day', 'month', 'year'];

  [
    'customClass',
    'dateDisabled',
    'datepickerMode',
    'formatDay',
    'formatDayHeader',
    'formatDayTitle',
    'formatMonth',
    'formatMonthTitle',
    'formatYear',
    'maxDate',
    'maxMode',
    'minDate',
    'minMode',
    'monthColumns',
    'showWeeks',
    'shortcutPropagation',
    'startingDay',
    'yearColumns',
    'yearRows'
  ].forEach(function(key) {
    switch (key) {
      case 'customClass':
      case 'dateDisabled':
        $scope[key] = $scope.datepickerOptions[key] || angular.noop;
        break;
      case 'datepickerMode':
        $scope.datepickerMode = angular.isDefined($scope.datepickerOptions.datepickerMode) ?
          $scope.datepickerOptions.datepickerMode : datepickerConfig.datepickerMode;
        break;
      case 'formatDay':
      case 'formatDayHeader':
      case 'formatDayTitle':
      case 'formatMonth':
      case 'formatMonthTitle':
      case 'formatYear':
        self[key] = angular.isDefined($scope.datepickerOptions[key]) ?
          $interpolate($scope.datepickerOptions[key])($scope.$parent) :
          datepickerConfig[key];
        break;
      case 'monthColumns':
      case 'showWeeks':
      case 'shortcutPropagation':
      case 'yearColumns':
      case 'yearRows':
        self[key] = angular.isDefined($scope.datepickerOptions[key]) ?
          $scope.datepickerOptions[key] : datepickerConfig[key];
        break;
      case 'startingDay':
        if (angular.isDefined($scope.datepickerOptions.startingDay)) {
          self.startingDay = $scope.datepickerOptions.startingDay;
        } else if (angular.isNumber(datepickerConfig.startingDay)) {
          self.startingDay = datepickerConfig.startingDay;
        } else {
          self.startingDay = ($locale.DATETIME_FORMATS.FIRSTDAYOFWEEK + 8) % 7;
        }

        break;
      case 'maxDate':
      case 'minDate':
        $scope.$watch('datepickerOptions.' + key, function(value) {
          if (value) {
            if (angular.isDate(value)) {
              self[key] = dateParser.fromTimezone(new Date(value), ngModelOptions.timezone);
            } else {
              if ($datepickerLiteralWarning) {
                $log.warn('Literal date support has been deprecated, please switch to date object usage');
              }

              self[key] = new Date(dateFilter(value, 'medium'));
            }
          } else {
            self[key] = datepickerConfig[key] ?
              dateParser.fromTimezone(new Date(datepickerConfig[key]), ngModelOptions.timezone) :
              null;
          }

          self.refreshView();
        });

        break;
      case 'maxMode':
      case 'minMode':
        if ($scope.datepickerOptions[key]) {
          $scope.$watch(function() { return $scope.datepickerOptions[key]; }, function(value) {
            self[key] = $scope[key] = angular.isDefined(value) ? value : $scope.datepickerOptions[key];
            if (key === 'minMode' && self.modes.indexOf($scope.datepickerOptions.datepickerMode) < self.modes.indexOf(self[key]) ||
              key === 'maxMode' && self.modes.indexOf($scope.datepickerOptions.datepickerMode) > self.modes.indexOf(self[key])) {
              $scope.datepickerMode = self[key];
              $scope.datepickerOptions.datepickerMode = self[key];
            }
          });
        } else {
          self[key] = $scope[key] = datepickerConfig[key] || null;
        }

        break;
    }
  });

  $scope.uniqueId = 'datepicker-' + $scope.$id + '-' + Math.floor(Math.random() * 10000);

  $scope.disabled = angular.isDefined($attrs.disabled) || false;
  if (angular.isDefined($attrs.ngDisabled)) {
    watchListeners.push($scope.$parent.$watch($attrs.ngDisabled, function(disabled) {
      $scope.disabled = disabled;
      self.refreshView();
    }));
  }

  $scope.isActive = function(dateObject) {
    if (self.compare(dateObject.date, self.activeDate) === 0) {
      $scope.activeDateId = dateObject.uid;
      return true;
    }
    return false;
  };

  this.init = function(ngModelCtrl_) {
    ngModelCtrl = ngModelCtrl_;
    ngModelOptions = ngModelCtrl_.$options ||
      $scope.datepickerOptions.ngModelOptions ||
      datepickerConfig.ngModelOptions;
    if ($scope.datepickerOptions.initDate) {
      self.activeDate = dateParser.fromTimezone($scope.datepickerOptions.initDate, ngModelOptions.timezone) || new Date();
      $scope.$watch('datepickerOptions.initDate', function(initDate) {
        if (initDate && (ngModelCtrl.$isEmpty(ngModelCtrl.$modelValue) || ngModelCtrl.$invalid)) {
          self.activeDate = dateParser.fromTimezone(initDate, ngModelOptions.timezone);
          self.refreshView();
        }
      });
    } else {
      self.activeDate = new Date();
    }

    var date = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : new Date();
    this.activeDate = !isNaN(date) ?
      dateParser.fromTimezone(date, ngModelOptions.timezone) :
      dateParser.fromTimezone(new Date(), ngModelOptions.timezone);

    ngModelCtrl.$render = function() {
      self.render();
    };
  };

  this.render = function() {
    if (ngModelCtrl.$viewValue) {
      var date = new Date(ngModelCtrl.$viewValue),
          isValid = !isNaN(date);

      if (isValid) {
        this.activeDate = dateParser.fromTimezone(date, ngModelOptions.timezone);
      } else if (!$datepickerSuppressError) {
        $log.error('Datepicker directive: "ng-model" value must be a Date object');
      }
    }
    this.refreshView();
  };

  this.refreshView = function() {
    if (this.element) {
      $scope.selectedDt = null;
      this._refreshView();
      if ($scope.activeDt) {
        $scope.activeDateId = $scope.activeDt.uid;
      }

      var date = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : null;
      date = dateParser.fromTimezone(date, ngModelOptions.timezone);
      ngModelCtrl.$setValidity('dateDisabled', !date ||
        this.element && !this.isDisabled(date));
    }
  };

  this.createDateObject = function(date, format) {
    var model = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : null;
    model = dateParser.fromTimezone(model, ngModelOptions.timezone);
    var today = new Date();
    today = dateParser.fromTimezone(today, ngModelOptions.timezone);
    var time = this.compare(date, today);
    var dt = {
      date: date,
      label: dateParser.filter(date, format),
      selected: model && this.compare(date, model) === 0,
      disabled: this.isDisabled(date),
      past: time < 0,
      current: time === 0,
      future: time > 0,
      customClass: this.customClass(date) || null
    };

    if (model && this.compare(date, model) === 0) {
      $scope.selectedDt = dt;
    }

    if (self.activeDate && this.compare(dt.date, self.activeDate) === 0) {
      $scope.activeDt = dt;
    }

    return dt;
  };

  this.isDisabled = function(date) {
    return $scope.disabled ||
      this.minDate && this.compare(date, this.minDate) < 0 ||
      this.maxDate && this.compare(date, this.maxDate) > 0 ||
      $scope.dateDisabled && $scope.dateDisabled({date: date, mode: $scope.datepickerMode});
  };

  this.customClass = function(date) {
    return $scope.customClass({date: date, mode: $scope.datepickerMode});
  };

  // Split array into smaller arrays
  this.split = function(arr, size) {
    var arrays = [];
    while (arr.length > 0) {
      arrays.push(arr.splice(0, size));
    }
    return arrays;
  };

  $scope.select = function(date) {
    if ($scope.datepickerMode === self.minMode) {
      var dt = ngModelCtrl.$viewValue ? dateParser.fromTimezone(new Date(ngModelCtrl.$viewValue), ngModelOptions.timezone) : new Date(0, 0, 0, 0, 0, 0, 0);
      dt.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      dt = dateParser.toTimezone(dt, ngModelOptions.timezone);
      ngModelCtrl.$setViewValue(dt);
      ngModelCtrl.$render();
    } else {
      self.activeDate = date;
      setMode(self.modes[self.modes.indexOf($scope.datepickerMode) - 1]);

      $scope.$emit('uib:datepicker.mode');
    }

    $scope.$broadcast('uib:datepicker.focus');
  };

  $scope.move = function(direction) {
    var year = self.activeDate.getFullYear() + direction * (self.step.years || 0),
        month = self.activeDate.getMonth() + direction * (self.step.months || 0);
    self.activeDate.setFullYear(year, month, 1);
    self.refreshView();
  };

  $scope.toggleMode = function(direction) {
    direction = direction || 1;

    if ($scope.datepickerMode === self.maxMode && direction === 1 ||
      $scope.datepickerMode === self.minMode && direction === -1) {
      return;
    }

    setMode(self.modes[self.modes.indexOf($scope.datepickerMode) + direction]);

    $scope.$emit('uib:datepicker.mode');
  };

  // Key event mapper
  $scope.keys = { 13: 'enter', 32: 'space', 33: 'pageup', 34: 'pagedown', 35: 'end', 36: 'home', 37: 'left', 38: 'up', 39: 'right', 40: 'down' };

  var focusElement = function() {
    self.element[0].focus();
  };

  // Listen for focus requests from popup directive
  $scope.$on('uib:datepicker.focus', focusElement);

  $scope.keydown = function(evt) {
    var key = $scope.keys[evt.which];

    if (!key || evt.shiftKey || evt.altKey || $scope.disabled) {
      return;
    }

    evt.preventDefault();
    if (!self.shortcutPropagation) {
      evt.stopPropagation();
    }

    if (key === 'enter' || key === 'space') {
      if (self.isDisabled(self.activeDate)) {
        return; // do nothing
      }
      $scope.select(self.activeDate);
    } else if (evt.ctrlKey && (key === 'up' || key === 'down')) {
      $scope.toggleMode(key === 'up' ? 1 : -1);
    } else {
      self.handleKeyDown(key, evt);
      self.refreshView();
    }
  };

  $element.on('keydown', function(evt) {
    $scope.$apply(function() {
      $scope.keydown(evt);
    });
  });

  $scope.$on('$destroy', function() {
    //Clear all watch listeners on destroy
    while (watchListeners.length) {
      watchListeners.shift()();
    }
  });

  function setMode(mode) {
    $scope.datepickerMode = mode;
    $scope.datepickerOptions.datepickerMode = mode;
  }
}])

.controller('UibDaypickerController', ['$scope', '$element', 'dateFilter', function(scope, $element, dateFilter) {
  var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  this.step = { months: 1 };
  this.element = $element;
  function getDaysInMonth(year, month) {
    return month === 1 && year % 4 === 0 &&
      (year % 100 !== 0 || year % 400 === 0) ? 29 : DAYS_IN_MONTH[month];
  }

  this.init = function(ctrl) {
    angular.extend(ctrl, this);
    scope.showWeeks = ctrl.showWeeks;
    ctrl.refreshView();
  };

  this.getDates = function(startDate, n) {
    var dates = new Array(n), current = new Date(startDate), i = 0, date;
    while (i < n) {
      date = new Date(current);
      dates[i++] = date;
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  this._refreshView = function() {
    var year = this.activeDate.getFullYear(),
      month = this.activeDate.getMonth(),
      firstDayOfMonth = new Date(this.activeDate);

    firstDayOfMonth.setFullYear(year, month, 1);

    var difference = this.startingDay - firstDayOfMonth.getDay(),
      numDisplayedFromPreviousMonth = difference > 0 ?
        7 - difference : - difference,
      firstDate = new Date(firstDayOfMonth);

    if (numDisplayedFromPreviousMonth > 0) {
      firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
    }

    // 42 is the number of days on a six-week calendar
    var days = this.getDates(firstDate, 42);
    for (var i = 0; i < 42; i ++) {
      days[i] = angular.extend(this.createDateObject(days[i], this.formatDay), {
        secondary: days[i].getMonth() !== month,
        uid: scope.uniqueId + '-' + i
      });
    }

    scope.labels = new Array(7);
    for (var j = 0; j < 7; j++) {
      scope.labels[j] = {
        abbr: dateFilter(days[j].date, this.formatDayHeader),
        full: dateFilter(days[j].date, 'EEEE')
      };
    }

    scope.title = dateFilter(this.activeDate, this.formatDayTitle);
    scope.rows = this.split(days, 7);

    if (scope.showWeeks) {
      scope.weekNumbers = [];
      var thursdayIndex = (4 + 7 - this.startingDay) % 7,
          numWeeks = scope.rows.length;
      for (var curWeek = 0; curWeek < numWeeks; curWeek++) {
        scope.weekNumbers.push(
          getISO8601WeekNumber(scope.rows[curWeek][thursdayIndex].date));
      }
    }
  };

  this.compare = function(date1, date2) {
    var _date1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    var _date2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    _date1.setFullYear(date1.getFullYear());
    _date2.setFullYear(date2.getFullYear());
    return _date1 - _date2;
  };

  function getISO8601WeekNumber(date) {
    var checkDate = new Date(date);
    checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7)); // Thursday
    var time = checkDate.getTime();
    checkDate.setMonth(0); // Compare with Jan 1
    checkDate.setDate(1);
    return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
  }

  this.handleKeyDown = function(key, evt) {
    var date = this.activeDate.getDate();

    if (key === 'left') {
      date = date - 1;
    } else if (key === 'up') {
      date = date - 7;
    } else if (key === 'right') {
      date = date + 1;
    } else if (key === 'down') {
      date = date + 7;
    } else if (key === 'pageup' || key === 'pagedown') {
      var month = this.activeDate.getMonth() + (key === 'pageup' ? - 1 : 1);
      this.activeDate.setMonth(month, 1);
      date = Math.min(getDaysInMonth(this.activeDate.getFullYear(), this.activeDate.getMonth()), date);
    } else if (key === 'home') {
      date = 1;
    } else if (key === 'end') {
      date = getDaysInMonth(this.activeDate.getFullYear(), this.activeDate.getMonth());
    }
    this.activeDate.setDate(date);
  };
}])

.controller('UibMonthpickerController', ['$scope', '$element', 'dateFilter', function(scope, $element, dateFilter) {
  this.step = { years: 1 };
  this.element = $element;

  this.init = function(ctrl) {
    angular.extend(ctrl, this);
    ctrl.refreshView();
  };

  this._refreshView = function() {
    var months = new Array(12),
        year = this.activeDate.getFullYear(),
        date;

    for (var i = 0; i < 12; i++) {
      date = new Date(this.activeDate);
      date.setFullYear(year, i, 1);
      months[i] = angular.extend(this.createDateObject(date, this.formatMonth), {
        uid: scope.uniqueId + '-' + i
      });
    }

    scope.title = dateFilter(this.activeDate, this.formatMonthTitle);
    scope.rows = this.split(months, this.monthColumns);
    scope.yearHeaderColspan = this.monthColumns > 3 ? this.monthColumns - 2 : 1;
  };

  this.compare = function(date1, date2) {
    var _date1 = new Date(date1.getFullYear(), date1.getMonth());
    var _date2 = new Date(date2.getFullYear(), date2.getMonth());
    _date1.setFullYear(date1.getFullYear());
    _date2.setFullYear(date2.getFullYear());
    return _date1 - _date2;
  };

  this.handleKeyDown = function(key, evt) {
    var date = this.activeDate.getMonth();

    if (key === 'left') {
      date = date - 1;
    } else if (key === 'up') {
      date = date - this.monthColumns;
    } else if (key === 'right') {
      date = date + 1;
    } else if (key === 'down') {
      date = date + this.monthColumns;
    } else if (key === 'pageup' || key === 'pagedown') {
      var year = this.activeDate.getFullYear() + (key === 'pageup' ? - 1 : 1);
      this.activeDate.setFullYear(year);
    } else if (key === 'home') {
      date = 0;
    } else if (key === 'end') {
      date = 11;
    }
    this.activeDate.setMonth(date);
  };
}])

.controller('UibYearpickerController', ['$scope', '$element', 'dateFilter', function(scope, $element, dateFilter) {
  var columns, range;
  this.element = $element;

  function getStartingYear(year) {
    return parseInt((year - 1) / range, 10) * range + 1;
  }

  this.yearpickerInit = function() {
    columns = this.yearColumns;
    range = this.yearRows * columns;
    this.step = { years: range };
  };

  this._refreshView = function() {
    var years = new Array(range), date;

    for (var i = 0, start = getStartingYear(this.activeDate.getFullYear()); i < range; i++) {
      date = new Date(this.activeDate);
      date.setFullYear(start + i, 0, 1);
      years[i] = angular.extend(this.createDateObject(date, this.formatYear), {
        uid: scope.uniqueId + '-' + i
      });
    }

    scope.title = [years[0].label, years[range - 1].label].join(' - ');
    scope.rows = this.split(years, columns);
    scope.columns = columns;
  };

  this.compare = function(date1, date2) {
    return date1.getFullYear() - date2.getFullYear();
  };

  this.handleKeyDown = function(key, evt) {
    var date = this.activeDate.getFullYear();

    if (key === 'left') {
      date = date - 1;
    } else if (key === 'up') {
      date = date - columns;
    } else if (key === 'right') {
      date = date + 1;
    } else if (key === 'down') {
      date = date + columns;
    } else if (key === 'pageup' || key === 'pagedown') {
      date += (key === 'pageup' ? - 1 : 1) * range;
    } else if (key === 'home') {
      date = getStartingYear(this.activeDate.getFullYear());
    } else if (key === 'end') {
      date = getStartingYear(this.activeDate.getFullYear()) + range - 1;
    }
    this.activeDate.setFullYear(date);
  };
}])

.directive('uibDatepicker', function() {
  return {
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/datepicker/datepicker.html';
    },
    scope: {
      datepickerOptions: '=?'
    },
    require: ['uibDatepicker', '^ngModel'],
    restrict: 'A',
    controller: 'UibDatepickerController',
    controllerAs: 'datepicker',
    link: function(scope, element, attrs, ctrls) {
      var datepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      datepickerCtrl.init(ngModelCtrl);
    }
  };
})

.directive('uibDaypicker', function() {
  return {
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/datepicker/day.html';
    },
    require: ['^uibDatepicker', 'uibDaypicker'],
    restrict: 'A',
    controller: 'UibDaypickerController',
    link: function(scope, element, attrs, ctrls) {
      var datepickerCtrl = ctrls[0],
        daypickerCtrl = ctrls[1];

      daypickerCtrl.init(datepickerCtrl);
    }
  };
})

.directive('uibMonthpicker', function() {
  return {
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/datepicker/month.html';
    },
    require: ['^uibDatepicker', 'uibMonthpicker'],
    restrict: 'A',
    controller: 'UibMonthpickerController',
    link: function(scope, element, attrs, ctrls) {
      var datepickerCtrl = ctrls[0],
        monthpickerCtrl = ctrls[1];

      monthpickerCtrl.init(datepickerCtrl);
    }
  };
})

.directive('uibYearpicker', function() {
  return {
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/datepicker/year.html';
    },
    require: ['^uibDatepicker', 'uibYearpicker'],
    restrict: 'A',
    controller: 'UibYearpickerController',
    link: function(scope, element, attrs, ctrls) {
      var ctrl = ctrls[0];
      angular.extend(ctrl, ctrls[1]);
      ctrl.yearpickerInit();

      ctrl.refreshView();
    }
  };
});

angular.module('ui.bootstrap.position', [])

/**
 * A set of utility methods for working with the DOM.
 * It is meant to be used where we need to absolute-position elements in
 * relation to another element (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */
  .factory('$uibPosition', ['$document', '$window', function($document, $window) {
    /**
     * Used by scrollbarWidth() function to cache scrollbar's width.
     * Do not access this variable directly, use scrollbarWidth() instead.
     */
    var SCROLLBAR_WIDTH;
    /**
     * scrollbar on body and html element in IE and Edge overlay
     * content and should be considered 0 width.
     */
    var BODY_SCROLLBAR_WIDTH;
    var OVERFLOW_REGEX = {
      normal: /(auto|scroll)/,
      hidden: /(auto|scroll|hidden)/
    };
    var PLACEMENT_REGEX = {
      auto: /\s?auto?\s?/i,
      primary: /^(top|bottom|left|right)$/,
      secondary: /^(top|bottom|left|right|center)$/,
      vertical: /^(top|bottom)$/
    };
    var BODY_REGEX = /(HTML|BODY)/;

    return {

      /**
       * Provides a raw DOM element from a jQuery/jQLite element.
       *
       * @param {element} elem - The element to convert.
       *
       * @returns {element} A HTML element.
       */
      getRawNode: function(elem) {
        return elem.nodeName ? elem : elem[0] || elem;
      },

      /**
       * Provides a parsed number for a style property.  Strips
       * units and casts invalid numbers to 0.
       *
       * @param {string} value - The style value to parse.
       *
       * @returns {number} A valid number.
       */
      parseStyle: function(value) {
        value = parseFloat(value);
        return isFinite(value) ? value : 0;
      },

      /**
       * Provides the closest positioned ancestor.
       *
       * @param {element} element - The element to get the offest parent for.
       *
       * @returns {element} The closest positioned ancestor.
       */
      offsetParent: function(elem) {
        elem = this.getRawNode(elem);

        var offsetParent = elem.offsetParent || $document[0].documentElement;

        function isStaticPositioned(el) {
          return ($window.getComputedStyle(el).position || 'static') === 'static';
        }

        while (offsetParent && offsetParent !== $document[0].documentElement && isStaticPositioned(offsetParent)) {
          offsetParent = offsetParent.offsetParent;
        }

        return offsetParent || $document[0].documentElement;
      },

      /**
       * Provides the scrollbar width, concept from TWBS measureScrollbar()
       * function in https://github.com/twbs/bootstrap/blob/master/js/modal.js
       * In IE and Edge, scollbar on body and html element overlay and should
       * return a width of 0.
       *
       * @returns {number} The width of the browser scollbar.
       */
      scrollbarWidth: function(isBody) {
        if (isBody) {
          if (angular.isUndefined(BODY_SCROLLBAR_WIDTH)) {
            var bodyElem = $document.find('body');
            bodyElem.addClass('uib-position-body-scrollbar-measure');
            BODY_SCROLLBAR_WIDTH = $window.innerWidth - bodyElem[0].clientWidth;
            BODY_SCROLLBAR_WIDTH = isFinite(BODY_SCROLLBAR_WIDTH) ? BODY_SCROLLBAR_WIDTH : 0;
            bodyElem.removeClass('uib-position-body-scrollbar-measure');
          }
          return BODY_SCROLLBAR_WIDTH;
        }

        if (angular.isUndefined(SCROLLBAR_WIDTH)) {
          var scrollElem = angular.element('<div class="uib-position-scrollbar-measure"></div>');
          $document.find('body').append(scrollElem);
          SCROLLBAR_WIDTH = scrollElem[0].offsetWidth - scrollElem[0].clientWidth;
          SCROLLBAR_WIDTH = isFinite(SCROLLBAR_WIDTH) ? SCROLLBAR_WIDTH : 0;
          scrollElem.remove();
        }

        return SCROLLBAR_WIDTH;
      },

      /**
       * Provides the padding required on an element to replace the scrollbar.
       *
       * @returns {object} An object with the following properties:
       *   <ul>
       *     <li>**scrollbarWidth**: the width of the scrollbar</li>
       *     <li>**widthOverflow**: whether the the width is overflowing</li>
       *     <li>**right**: the amount of right padding on the element needed to replace the scrollbar</li>
       *     <li>**rightOriginal**: the amount of right padding currently on the element</li>
       *     <li>**heightOverflow**: whether the the height is overflowing</li>
       *     <li>**bottom**: the amount of bottom padding on the element needed to replace the scrollbar</li>
       *     <li>**bottomOriginal**: the amount of bottom padding currently on the element</li>
       *   </ul>
       */
      scrollbarPadding: function(elem) {
        elem = this.getRawNode(elem);

        var elemStyle = $window.getComputedStyle(elem);
        var paddingRight = this.parseStyle(elemStyle.paddingRight);
        var paddingBottom = this.parseStyle(elemStyle.paddingBottom);
        var scrollParent = this.scrollParent(elem, false, true);
        var scrollbarWidth = this.scrollbarWidth(scrollParent, BODY_REGEX.test(scrollParent.tagName));

        return {
          scrollbarWidth: scrollbarWidth,
          widthOverflow: scrollParent.scrollWidth > scrollParent.clientWidth,
          right: paddingRight + scrollbarWidth,
          originalRight: paddingRight,
          heightOverflow: scrollParent.scrollHeight > scrollParent.clientHeight,
          bottom: paddingBottom + scrollbarWidth,
          originalBottom: paddingBottom
         };
      },

      /**
       * Checks to see if the element is scrollable.
       *
       * @param {element} elem - The element to check.
       * @param {boolean=} [includeHidden=false] - Should scroll style of 'hidden' be considered,
       *   default is false.
       *
       * @returns {boolean} Whether the element is scrollable.
       */
      isScrollable: function(elem, includeHidden) {
        elem = this.getRawNode(elem);

        var overflowRegex = includeHidden ? OVERFLOW_REGEX.hidden : OVERFLOW_REGEX.normal;
        var elemStyle = $window.getComputedStyle(elem);
        return overflowRegex.test(elemStyle.overflow + elemStyle.overflowY + elemStyle.overflowX);
      },

      /**
       * Provides the closest scrollable ancestor.
       * A port of the jQuery UI scrollParent method:
       * https://github.com/jquery/jquery-ui/blob/master/ui/scroll-parent.js
       *
       * @param {element} elem - The element to find the scroll parent of.
       * @param {boolean=} [includeHidden=false] - Should scroll style of 'hidden' be considered,
       *   default is false.
       * @param {boolean=} [includeSelf=false] - Should the element being passed be
       * included in the scrollable llokup.
       *
       * @returns {element} A HTML element.
       */
      scrollParent: function(elem, includeHidden, includeSelf) {
        elem = this.getRawNode(elem);

        var overflowRegex = includeHidden ? OVERFLOW_REGEX.hidden : OVERFLOW_REGEX.normal;
        var documentEl = $document[0].documentElement;
        var elemStyle = $window.getComputedStyle(elem);
        if (includeSelf && overflowRegex.test(elemStyle.overflow + elemStyle.overflowY + elemStyle.overflowX)) {
          return elem;
        }
        var excludeStatic = elemStyle.position === 'absolute';
        var scrollParent = elem.parentElement || documentEl;

        if (scrollParent === documentEl || elemStyle.position === 'fixed') {
          return documentEl;
        }

        while (scrollParent.parentElement && scrollParent !== documentEl) {
          var spStyle = $window.getComputedStyle(scrollParent);
          if (excludeStatic && spStyle.position !== 'static') {
            excludeStatic = false;
          }

          if (!excludeStatic && overflowRegex.test(spStyle.overflow + spStyle.overflowY + spStyle.overflowX)) {
            break;
          }
          scrollParent = scrollParent.parentElement;
        }

        return scrollParent;
      },

      /**
       * Provides read-only equivalent of jQuery's position function:
       * http://api.jquery.com/position/ - distance to closest positioned
       * ancestor.  Does not account for margins by default like jQuery position.
       *
       * @param {element} elem - The element to caclulate the position on.
       * @param {boolean=} [includeMargins=false] - Should margins be accounted
       * for, default is false.
       *
       * @returns {object} An object with the following properties:
       *   <ul>
       *     <li>**width**: the width of the element</li>
       *     <li>**height**: the height of the element</li>
       *     <li>**top**: distance to top edge of offset parent</li>
       *     <li>**left**: distance to left edge of offset parent</li>
       *   </ul>
       */
      position: function(elem, includeMagins) {
        elem = this.getRawNode(elem);

        var elemOffset = this.offset(elem);
        if (includeMagins) {
          var elemStyle = $window.getComputedStyle(elem);
          elemOffset.top -= this.parseStyle(elemStyle.marginTop);
          elemOffset.left -= this.parseStyle(elemStyle.marginLeft);
        }
        var parent = this.offsetParent(elem);
        var parentOffset = {top: 0, left: 0};

        if (parent !== $document[0].documentElement) {
          parentOffset = this.offset(parent);
          parentOffset.top += parent.clientTop - parent.scrollTop;
          parentOffset.left += parent.clientLeft - parent.scrollLeft;
        }

        return {
          width: Math.round(angular.isNumber(elemOffset.width) ? elemOffset.width : elem.offsetWidth),
          height: Math.round(angular.isNumber(elemOffset.height) ? elemOffset.height : elem.offsetHeight),
          top: Math.round(elemOffset.top - parentOffset.top),
          left: Math.round(elemOffset.left - parentOffset.left)
        };
      },

      /**
       * Provides read-only equivalent of jQuery's offset function:
       * http://api.jquery.com/offset/ - distance to viewport.  Does
       * not account for borders, margins, or padding on the body
       * element.
       *
       * @param {element} elem - The element to calculate the offset on.
       *
       * @returns {object} An object with the following properties:
       *   <ul>
       *     <li>**width**: the width of the element</li>
       *     <li>**height**: the height of the element</li>
       *     <li>**top**: distance to top edge of viewport</li>
       *     <li>**right**: distance to bottom edge of viewport</li>
       *   </ul>
       */
      offset: function(elem) {
        elem = this.getRawNode(elem);

        var elemBCR = elem.getBoundingClientRect();
        return {
          width: Math.round(angular.isNumber(elemBCR.width) ? elemBCR.width : elem.offsetWidth),
          height: Math.round(angular.isNumber(elemBCR.height) ? elemBCR.height : elem.offsetHeight),
          top: Math.round(elemBCR.top + ($window.pageYOffset || $document[0].documentElement.scrollTop)),
          left: Math.round(elemBCR.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft))
        };
      },

      /**
       * Provides offset distance to the closest scrollable ancestor
       * or viewport.  Accounts for border and scrollbar width.
       *
       * Right and bottom dimensions represent the distance to the
       * respective edge of the viewport element.  If the element
       * edge extends beyond the viewport, a negative value will be
       * reported.
       *
       * @param {element} elem - The element to get the viewport offset for.
       * @param {boolean=} [useDocument=false] - Should the viewport be the document element instead
       * of the first scrollable element, default is false.
       * @param {boolean=} [includePadding=true] - Should the padding on the offset parent element
       * be accounted for, default is true.
       *
       * @returns {object} An object with the following properties:
       *   <ul>
       *     <li>**top**: distance to the top content edge of viewport element</li>
       *     <li>**bottom**: distance to the bottom content edge of viewport element</li>
       *     <li>**left**: distance to the left content edge of viewport element</li>
       *     <li>**right**: distance to the right content edge of viewport element</li>
       *   </ul>
       */
      viewportOffset: function(elem, useDocument, includePadding) {
        elem = this.getRawNode(elem);
        includePadding = includePadding !== false ? true : false;

        var elemBCR = elem.getBoundingClientRect();
        var offsetBCR = {top: 0, left: 0, bottom: 0, right: 0};

        var offsetParent = useDocument ? $document[0].documentElement : this.scrollParent(elem);
        var offsetParentBCR = offsetParent.getBoundingClientRect();

        offsetBCR.top = offsetParentBCR.top + offsetParent.clientTop;
        offsetBCR.left = offsetParentBCR.left + offsetParent.clientLeft;
        if (offsetParent === $document[0].documentElement) {
          offsetBCR.top += $window.pageYOffset;
          offsetBCR.left += $window.pageXOffset;
        }
        offsetBCR.bottom = offsetBCR.top + offsetParent.clientHeight;
        offsetBCR.right = offsetBCR.left + offsetParent.clientWidth;

        if (includePadding) {
          var offsetParentStyle = $window.getComputedStyle(offsetParent);
          offsetBCR.top += this.parseStyle(offsetParentStyle.paddingTop);
          offsetBCR.bottom -= this.parseStyle(offsetParentStyle.paddingBottom);
          offsetBCR.left += this.parseStyle(offsetParentStyle.paddingLeft);
          offsetBCR.right -= this.parseStyle(offsetParentStyle.paddingRight);
        }

        return {
          top: Math.round(elemBCR.top - offsetBCR.top),
          bottom: Math.round(offsetBCR.bottom - elemBCR.bottom),
          left: Math.round(elemBCR.left - offsetBCR.left),
          right: Math.round(offsetBCR.right - elemBCR.right)
        };
      },

      /**
       * Provides an array of placement values parsed from a placement string.
       * Along with the 'auto' indicator, supported placement strings are:
       *   <ul>
       *     <li>top: element on top, horizontally centered on host element.</li>
       *     <li>top-left: element on top, left edge aligned with host element left edge.</li>
       *     <li>top-right: element on top, lerightft edge aligned with host element right edge.</li>
       *     <li>bottom: element on bottom, horizontally centered on host element.</li>
       *     <li>bottom-left: element on bottom, left edge aligned with host element left edge.</li>
       *     <li>bottom-right: element on bottom, right edge aligned with host element right edge.</li>
       *     <li>left: element on left, vertically centered on host element.</li>
       *     <li>left-top: element on left, top edge aligned with host element top edge.</li>
       *     <li>left-bottom: element on left, bottom edge aligned with host element bottom edge.</li>
       *     <li>right: element on right, vertically centered on host element.</li>
       *     <li>right-top: element on right, top edge aligned with host element top edge.</li>
       *     <li>right-bottom: element on right, bottom edge aligned with host element bottom edge.</li>
       *   </ul>
       * A placement string with an 'auto' indicator is expected to be
       * space separated from the placement, i.e: 'auto bottom-left'  If
       * the primary and secondary placement values do not match 'top,
       * bottom, left, right' then 'top' will be the primary placement and
       * 'center' will be the secondary placement.  If 'auto' is passed, true
       * will be returned as the 3rd value of the array.
       *
       * @param {string} placement - The placement string to parse.
       *
       * @returns {array} An array with the following values
       * <ul>
       *   <li>**[0]**: The primary placement.</li>
       *   <li>**[1]**: The secondary placement.</li>
       *   <li>**[2]**: If auto is passed: true, else undefined.</li>
       * </ul>
       */
      parsePlacement: function(placement) {
        var autoPlace = PLACEMENT_REGEX.auto.test(placement);
        if (autoPlace) {
          placement = placement.replace(PLACEMENT_REGEX.auto, '');
        }

        placement = placement.split('-');

        placement[0] = placement[0] || 'top';
        if (!PLACEMENT_REGEX.primary.test(placement[0])) {
          placement[0] = 'top';
        }

        placement[1] = placement[1] || 'center';
        if (!PLACEMENT_REGEX.secondary.test(placement[1])) {
          placement[1] = 'center';
        }

        if (autoPlace) {
          placement[2] = true;
        } else {
          placement[2] = false;
        }

        return placement;
      },

      /**
       * Provides coordinates for an element to be positioned relative to
       * another element.  Passing 'auto' as part of the placement parameter
       * will enable smart placement - where the element fits. i.e:
       * 'auto left-top' will check to see if there is enough space to the left
       * of the hostElem to fit the targetElem, if not place right (same for secondary
       * top placement).  Available space is calculated using the viewportOffset
       * function.
       *
       * @param {element} hostElem - The element to position against.
       * @param {element} targetElem - The element to position.
       * @param {string=} [placement=top] - The placement for the targetElem,
       *   default is 'top'. 'center' is assumed as secondary placement for
       *   'top', 'left', 'right', and 'bottom' placements.  Available placements are:
       *   <ul>
       *     <li>top</li>
       *     <li>top-right</li>
       *     <li>top-left</li>
       *     <li>bottom</li>
       *     <li>bottom-left</li>
       *     <li>bottom-right</li>
       *     <li>left</li>
       *     <li>left-top</li>
       *     <li>left-bottom</li>
       *     <li>right</li>
       *     <li>right-top</li>
       *     <li>right-bottom</li>
       *   </ul>
       * @param {boolean=} [appendToBody=false] - Should the top and left values returned
       *   be calculated from the body element, default is false.
       *
       * @returns {object} An object with the following properties:
       *   <ul>
       *     <li>**top**: Value for targetElem top.</li>
       *     <li>**left**: Value for targetElem left.</li>
       *     <li>**placement**: The resolved placement.</li>
       *   </ul>
       */
      positionElements: function(hostElem, targetElem, placement, appendToBody) {
        hostElem = this.getRawNode(hostElem);
        targetElem = this.getRawNode(targetElem);

        // need to read from prop to support tests.
        var targetWidth = angular.isDefined(targetElem.offsetWidth) ? targetElem.offsetWidth : targetElem.prop('offsetWidth');
        var targetHeight = angular.isDefined(targetElem.offsetHeight) ? targetElem.offsetHeight : targetElem.prop('offsetHeight');

        placement = this.parsePlacement(placement);

        var hostElemPos = appendToBody ? this.offset(hostElem) : this.position(hostElem);
        var targetElemPos = {top: 0, left: 0, placement: ''};

        if (placement[2]) {
          var viewportOffset = this.viewportOffset(hostElem, appendToBody);

          var targetElemStyle = $window.getComputedStyle(targetElem);
          var adjustedSize = {
            width: targetWidth + Math.round(Math.abs(this.parseStyle(targetElemStyle.marginLeft) + this.parseStyle(targetElemStyle.marginRight))),
            height: targetHeight + Math.round(Math.abs(this.parseStyle(targetElemStyle.marginTop) + this.parseStyle(targetElemStyle.marginBottom)))
          };

          placement[0] = placement[0] === 'top' && adjustedSize.height > viewportOffset.top && adjustedSize.height <= viewportOffset.bottom ? 'bottom' :
                         placement[0] === 'bottom' && adjustedSize.height > viewportOffset.bottom && adjustedSize.height <= viewportOffset.top ? 'top' :
                         placement[0] === 'left' && adjustedSize.width > viewportOffset.left && adjustedSize.width <= viewportOffset.right ? 'right' :
                         placement[0] === 'right' && adjustedSize.width > viewportOffset.right && adjustedSize.width <= viewportOffset.left ? 'left' :
                         placement[0];

          placement[1] = placement[1] === 'top' && adjustedSize.height - hostElemPos.height > viewportOffset.bottom && adjustedSize.height - hostElemPos.height <= viewportOffset.top ? 'bottom' :
                         placement[1] === 'bottom' && adjustedSize.height - hostElemPos.height > viewportOffset.top && adjustedSize.height - hostElemPos.height <= viewportOffset.bottom ? 'top' :
                         placement[1] === 'left' && adjustedSize.width - hostElemPos.width > viewportOffset.right && adjustedSize.width - hostElemPos.width <= viewportOffset.left ? 'right' :
                         placement[1] === 'right' && adjustedSize.width - hostElemPos.width > viewportOffset.left && adjustedSize.width - hostElemPos.width <= viewportOffset.right ? 'left' :
                         placement[1];

          if (placement[1] === 'center') {
            if (PLACEMENT_REGEX.vertical.test(placement[0])) {
              var xOverflow = hostElemPos.width / 2 - targetWidth / 2;
              if (viewportOffset.left + xOverflow < 0 && adjustedSize.width - hostElemPos.width <= viewportOffset.right) {
                placement[1] = 'left';
              } else if (viewportOffset.right + xOverflow < 0 && adjustedSize.width - hostElemPos.width <= viewportOffset.left) {
                placement[1] = 'right';
              }
            } else {
              var yOverflow = hostElemPos.height / 2 - adjustedSize.height / 2;
              if (viewportOffset.top + yOverflow < 0 && adjustedSize.height - hostElemPos.height <= viewportOffset.bottom) {
                placement[1] = 'top';
              } else if (viewportOffset.bottom + yOverflow < 0 && adjustedSize.height - hostElemPos.height <= viewportOffset.top) {
                placement[1] = 'bottom';
              }
            }
          }
        }

        switch (placement[0]) {
          case 'top':
            targetElemPos.top = hostElemPos.top - targetHeight;
            break;
          case 'bottom':
            targetElemPos.top = hostElemPos.top + hostElemPos.height;
            break;
          case 'left':
            targetElemPos.left = hostElemPos.left - targetWidth;
            break;
          case 'right':
            targetElemPos.left = hostElemPos.left + hostElemPos.width;
            break;
        }

        switch (placement[1]) {
          case 'top':
            targetElemPos.top = hostElemPos.top;
            break;
          case 'bottom':
            targetElemPos.top = hostElemPos.top + hostElemPos.height - targetHeight;
            break;
          case 'left':
            targetElemPos.left = hostElemPos.left;
            break;
          case 'right':
            targetElemPos.left = hostElemPos.left + hostElemPos.width - targetWidth;
            break;
          case 'center':
            if (PLACEMENT_REGEX.vertical.test(placement[0])) {
              targetElemPos.left = hostElemPos.left + hostElemPos.width / 2 - targetWidth / 2;
            } else {
              targetElemPos.top = hostElemPos.top + hostElemPos.height / 2 - targetHeight / 2;
            }
            break;
        }

        targetElemPos.top = Math.round(targetElemPos.top);
        targetElemPos.left = Math.round(targetElemPos.left);
        targetElemPos.placement = placement[1] === 'center' ? placement[0] : placement[0] + '-' + placement[1];

        return targetElemPos;
      },

      /**
       * Provides a way to adjust the top positioning after first
       * render to correctly align element to top after content
       * rendering causes resized element height
       *
       * @param {array} placementClasses - The array of strings of classes
       * element should have.
       * @param {object} containerPosition - The object with container
       * position information
       * @param {number} initialHeight - The initial height for the elem.
       * @param {number} currentHeight - The current height for the elem.
       */
      adjustTop: function(placementClasses, containerPosition, initialHeight, currentHeight) {
        if (placementClasses.indexOf('top') !== -1 && initialHeight !== currentHeight) {
          return {
            top: containerPosition.top - currentHeight + 'px'
          };
        }
      },

      /**
       * Provides a way for positioning tooltip & dropdown
       * arrows when using placement options beyond the standard
       * left, right, top, or bottom.
       *
       * @param {element} elem - The tooltip/dropdown element.
       * @param {string} placement - The placement for the elem.
       */
      positionArrow: function(elem, placement) {
        elem = this.getRawNode(elem);

        var innerElem = elem.querySelector('.tooltip-inner, .popover-inner');
        if (!innerElem) {
          return;
        }

        var isTooltip = angular.element(innerElem).hasClass('tooltip-inner');

        var arrowElem = isTooltip ? elem.querySelector('.tooltip-arrow') : elem.querySelector('.arrow');
        if (!arrowElem) {
          return;
        }

        var arrowCss = {
          top: '',
          bottom: '',
          left: '',
          right: ''
        };

        placement = this.parsePlacement(placement);
        if (placement[1] === 'center') {
          // no adjustment necessary - just reset styles
          angular.element(arrowElem).css(arrowCss);
          return;
        }

        var borderProp = 'border-' + placement[0] + '-width';
        var borderWidth = $window.getComputedStyle(arrowElem)[borderProp];

        var borderRadiusProp = 'border-';
        if (PLACEMENT_REGEX.vertical.test(placement[0])) {
          borderRadiusProp += placement[0] + '-' + placement[1];
        } else {
          borderRadiusProp += placement[1] + '-' + placement[0];
        }
        borderRadiusProp += '-radius';
        var borderRadius = $window.getComputedStyle(isTooltip ? innerElem : elem)[borderRadiusProp];

        switch (placement[0]) {
          case 'top':
            arrowCss.bottom = isTooltip ? '0' : '-' + borderWidth;
            break;
          case 'bottom':
            arrowCss.top = isTooltip ? '0' : '-' + borderWidth;
            break;
          case 'left':
            arrowCss.right = isTooltip ? '0' : '-' + borderWidth;
            break;
          case 'right':
            arrowCss.left = isTooltip ? '0' : '-' + borderWidth;
            break;
        }

        arrowCss[placement[1]] = borderRadius;

        angular.element(arrowElem).css(arrowCss);
      }
    };
  }]);

angular.module('ui.bootstrap.datepickerPopup', ['ui.bootstrap.datepicker', 'ui.bootstrap.position'])

.value('$datepickerPopupLiteralWarning', true)

.constant('uibDatepickerPopupConfig', {
  altInputFormats: [],
  appendToBody: false,
  clearText: 'Clear',
  closeOnDateSelection: true,
  closeText: 'Done',
  currentText: 'Today',
  datepickerPopup: 'yyyy-MM-dd',
  datepickerPopupTemplateUrl: 'uib/template/datepickerPopup/popup.html',
  datepickerTemplateUrl: 'uib/template/datepicker/datepicker.html',
  html5Types: {
    date: 'yyyy-MM-dd',
    'datetime-local': 'yyyy-MM-ddTHH:mm:ss.sss',
    'month': 'yyyy-MM'
  },
  onOpenFocus: true,
  showButtonBar: true,
  placement: 'auto bottom-left'
})

.controller('UibDatepickerPopupController', ['$scope', '$element', '$attrs', '$compile', '$log', '$parse', '$window', '$document', '$rootScope', '$uibPosition', 'dateFilter', 'uibDateParser', 'uibDatepickerPopupConfig', '$timeout', 'uibDatepickerConfig', '$datepickerPopupLiteralWarning',
function($scope, $element, $attrs, $compile, $log, $parse, $window, $document, $rootScope, $position, dateFilter, dateParser, datepickerPopupConfig, $timeout, datepickerConfig, $datepickerPopupLiteralWarning) {
  var cache = {},
    isHtml5DateInput = false;
  var dateFormat, closeOnDateSelection, appendToBody, onOpenFocus,
    datepickerPopupTemplateUrl, datepickerTemplateUrl, popupEl, datepickerEl, scrollParentEl,
    ngModel, ngModelOptions, $popup, altInputFormats, watchListeners = [];

  this.init = function(_ngModel_) {
    ngModel = _ngModel_;
    ngModelOptions = angular.isObject(_ngModel_.$options) ?
      _ngModel_.$options :
      {
        timezone: null
      };
    closeOnDateSelection = angular.isDefined($attrs.closeOnDateSelection) ?
      $scope.$parent.$eval($attrs.closeOnDateSelection) :
      datepickerPopupConfig.closeOnDateSelection;
    appendToBody = angular.isDefined($attrs.datepickerAppendToBody) ?
      $scope.$parent.$eval($attrs.datepickerAppendToBody) :
      datepickerPopupConfig.appendToBody;
    onOpenFocus = angular.isDefined($attrs.onOpenFocus) ?
      $scope.$parent.$eval($attrs.onOpenFocus) : datepickerPopupConfig.onOpenFocus;
    datepickerPopupTemplateUrl = angular.isDefined($attrs.datepickerPopupTemplateUrl) ?
      $attrs.datepickerPopupTemplateUrl :
      datepickerPopupConfig.datepickerPopupTemplateUrl;
    datepickerTemplateUrl = angular.isDefined($attrs.datepickerTemplateUrl) ?
      $attrs.datepickerTemplateUrl : datepickerPopupConfig.datepickerTemplateUrl;
    altInputFormats = angular.isDefined($attrs.altInputFormats) ?
      $scope.$parent.$eval($attrs.altInputFormats) :
      datepickerPopupConfig.altInputFormats;

    $scope.showButtonBar = angular.isDefined($attrs.showButtonBar) ?
      $scope.$parent.$eval($attrs.showButtonBar) :
      datepickerPopupConfig.showButtonBar;

    if (datepickerPopupConfig.html5Types[$attrs.type]) {
      dateFormat = datepickerPopupConfig.html5Types[$attrs.type];
      isHtml5DateInput = true;
    } else {
      dateFormat = $attrs.uibDatepickerPopup || datepickerPopupConfig.datepickerPopup;
      $attrs.$observe('uibDatepickerPopup', function(value, oldValue) {
        var newDateFormat = value || datepickerPopupConfig.datepickerPopup;
        // Invalidate the $modelValue to ensure that formatters re-run
        // FIXME: Refactor when PR is merged: https://github.com/angular/angular.js/pull/10764
        if (newDateFormat !== dateFormat) {
          dateFormat = newDateFormat;
          ngModel.$modelValue = null;

          if (!dateFormat) {
            throw new Error('uibDatepickerPopup must have a date format specified.');
          }
        }
      });
    }

    if (!dateFormat) {
      throw new Error('uibDatepickerPopup must have a date format specified.');
    }

    if (isHtml5DateInput && $attrs.uibDatepickerPopup) {
      throw new Error('HTML5 date input types do not support custom formats.');
    }

    // popup element used to display calendar
    popupEl = angular.element('<div uib-datepicker-popup-wrap><div uib-datepicker></div></div>');

    popupEl.attr({
      'ng-model': 'date',
      'ng-change': 'dateSelection(date)',
      'template-url': datepickerPopupTemplateUrl
    });

    // datepicker element
    datepickerEl = angular.element(popupEl.children()[0]);
    datepickerEl.attr('template-url', datepickerTemplateUrl);

    if (!$scope.datepickerOptions) {
      $scope.datepickerOptions = {};
    }

    if (isHtml5DateInput) {
      if ($attrs.type === 'month') {
        $scope.datepickerOptions.datepickerMode = 'month';
        $scope.datepickerOptions.minMode = 'month';
      }
    }

    datepickerEl.attr('datepicker-options', 'datepickerOptions');

    if (!isHtml5DateInput) {
      // Internal API to maintain the correct ng-invalid-[key] class
      ngModel.$$parserName = 'date';
      ngModel.$validators.date = validator;
      ngModel.$parsers.unshift(parseDate);
      ngModel.$formatters.push(function(value) {
        if (ngModel.$isEmpty(value)) {
          $scope.date = value;
          return value;
        }

        if (angular.isNumber(value)) {
          value = new Date(value);
        }

        $scope.date = dateParser.fromTimezone(value, ngModelOptions.timezone);

        return dateParser.filter($scope.date, dateFormat);
      });
    } else {
      ngModel.$formatters.push(function(value) {
        $scope.date = dateParser.fromTimezone(value, ngModelOptions.timezone);
        return value;
      });
    }

    // Detect changes in the view from the text box
    ngModel.$viewChangeListeners.push(function() {
      $scope.date = parseDateString(ngModel.$viewValue);
    });

    $element.on('keydown', inputKeydownBind);

    $popup = $compile(popupEl)($scope);
    // Prevent jQuery cache memory leak (template is now redundant after linking)
    popupEl.remove();

    if (appendToBody) {
      $document.find('body').append($popup);
    } else {
      $element.after($popup);
    }

    $scope.$on('$destroy', function() {
      if ($scope.isOpen === true) {
        if (!$rootScope.$$phase) {
          $scope.$apply(function() {
            $scope.isOpen = false;
          });
        }
      }

      $popup.remove();
      $element.off('keydown', inputKeydownBind);
      $document.off('click', documentClickBind);
      if (scrollParentEl) {
        scrollParentEl.off('scroll', positionPopup);
      }
      angular.element($window).off('resize', positionPopup);

      //Clear all watch listeners on destroy
      while (watchListeners.length) {
        watchListeners.shift()();
      }
    });
  };

  $scope.getText = function(key) {
    return $scope[key + 'Text'] || datepickerPopupConfig[key + 'Text'];
  };

  $scope.isDisabled = function(date) {
    if (date === 'today') {
      date = dateParser.fromTimezone(new Date(), ngModelOptions.timezone);
    }

    var dates = {};
    angular.forEach(['minDate', 'maxDate'], function(key) {
      if (!$scope.datepickerOptions[key]) {
        dates[key] = null;
      } else if (angular.isDate($scope.datepickerOptions[key])) {
        dates[key] = new Date($scope.datepickerOptions[key]);
      } else {
        if ($datepickerPopupLiteralWarning) {
          $log.warn('Literal date support has been deprecated, please switch to date object usage');
        }

        dates[key] = new Date(dateFilter($scope.datepickerOptions[key], 'medium'));
      }
    });

    return $scope.datepickerOptions &&
      dates.minDate && $scope.compare(date, dates.minDate) < 0 ||
      dates.maxDate && $scope.compare(date, dates.maxDate) > 0;
  };

  $scope.compare = function(date1, date2) {
    return new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  };

  // Inner change
  $scope.dateSelection = function(dt) {
    $scope.date = dt;
    var date = $scope.date ? dateParser.filter($scope.date, dateFormat) : null; // Setting to NULL is necessary for form validators to function
    $element.val(date);
    ngModel.$setViewValue(date);

    if (closeOnDateSelection) {
      $scope.isOpen = false;
      $element[0].focus();
    }
  };

  $scope.keydown = function(evt) {
    if (evt.which === 27) {
      evt.stopPropagation();
      $scope.isOpen = false;
      $element[0].focus();
    }
  };

  $scope.select = function(date, evt) {
    evt.stopPropagation();

    if (date === 'today') {
      var today = new Date();
      if (angular.isDate($scope.date)) {
        date = new Date($scope.date);
        date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
      } else {
        date = dateParser.fromTimezone(today, ngModelOptions.timezone);
        date.setHours(0, 0, 0, 0);
      }
    }
    $scope.dateSelection(date);
  };

  $scope.close = function(evt) {
    evt.stopPropagation();

    $scope.isOpen = false;
    $element[0].focus();
  };

  $scope.disabled = angular.isDefined($attrs.disabled) || false;
  if ($attrs.ngDisabled) {
    watchListeners.push($scope.$parent.$watch($parse($attrs.ngDisabled), function(disabled) {
      $scope.disabled = disabled;
    }));
  }

  $scope.$watch('isOpen', function(value) {
    if (value) {
      if (!$scope.disabled) {
        $timeout(function() {
          positionPopup();

          if (onOpenFocus) {
            $scope.$broadcast('uib:datepicker.focus');
          }

          $document.on('click', documentClickBind);

          var placement = $attrs.popupPlacement ? $attrs.popupPlacement : datepickerPopupConfig.placement;
          if (appendToBody || $position.parsePlacement(placement)[2]) {
            scrollParentEl = scrollParentEl || angular.element($position.scrollParent($element));
            if (scrollParentEl) {
              scrollParentEl.on('scroll', positionPopup);
            }
          } else {
            scrollParentEl = null;
          }

          angular.element($window).on('resize', positionPopup);
        }, 0, false);
      } else {
        $scope.isOpen = false;
      }
    } else {
      $document.off('click', documentClickBind);
      if (scrollParentEl) {
        scrollParentEl.off('scroll', positionPopup);
      }
      angular.element($window).off('resize', positionPopup);
    }
  });

  function cameltoDash(string) {
    return string.replace(/([A-Z])/g, function($1) { return '-' + $1.toLowerCase(); });
  }

  function parseDateString(viewValue) {
    var date = dateParser.parse(viewValue, dateFormat, $scope.date);
    if (isNaN(date)) {
      for (var i = 0; i < altInputFormats.length; i++) {
        date = dateParser.parse(viewValue, altInputFormats[i], $scope.date);
        if (!isNaN(date)) {
          return date;
        }
      }
    }
    return date;
  }

  function parseDate(viewValue) {
    if (angular.isNumber(viewValue)) {
      // presumably timestamp to date object
      viewValue = new Date(viewValue);
    }

    if (!viewValue) {
      return null;
    }

    if (angular.isDate(viewValue) && !isNaN(viewValue)) {
      return viewValue;
    }

    if (angular.isString(viewValue)) {
      var date = parseDateString(viewValue);
      if (!isNaN(date)) {
        return dateParser.fromTimezone(date, ngModelOptions.timezone);
      }
    }

    return ngModel.$options && ngModel.$options.allowInvalid ? viewValue : undefined;
  }

  function validator(modelValue, viewValue) {
    var value = modelValue || viewValue;

    if (!$attrs.ngRequired && !value) {
      return true;
    }

    if (angular.isNumber(value)) {
      value = new Date(value);
    }

    if (!value) {
      return true;
    }

    if (angular.isDate(value) && !isNaN(value)) {
      return true;
    }

    if (angular.isString(value)) {
      return !isNaN(parseDateString(value));
    }

    return false;
  }

  function documentClickBind(event) {
    if (!$scope.isOpen && $scope.disabled) {
      return;
    }

    var popup = $popup[0];
    var dpContainsTarget = $element[0].contains(event.target);
    // The popup node may not be an element node
    // In some browsers (IE) only element nodes have the 'contains' function
    var popupContainsTarget = popup.contains !== undefined && popup.contains(event.target);
    if ($scope.isOpen && !(dpContainsTarget || popupContainsTarget)) {
      $scope.$apply(function() {
        $scope.isOpen = false;
      });
    }
  }

  function inputKeydownBind(evt) {
    if (evt.which === 27 && $scope.isOpen) {
      evt.preventDefault();
      evt.stopPropagation();
      $scope.$apply(function() {
        $scope.isOpen = false;
      });
      $element[0].focus();
    } else if (evt.which === 40 && !$scope.isOpen) {
      evt.preventDefault();
      evt.stopPropagation();
      $scope.$apply(function() {
        $scope.isOpen = true;
      });
    }
  }

  function positionPopup() {
    if ($scope.isOpen) {
      var dpElement = angular.element($popup[0].querySelector('.uib-datepicker-popup'));
      var placement = $attrs.popupPlacement ? $attrs.popupPlacement : datepickerPopupConfig.placement;
      var position = $position.positionElements($element, dpElement, placement, appendToBody);
      dpElement.css({top: position.top + 'px', left: position.left + 'px'});
      if (dpElement.hasClass('uib-position-measure')) {
        dpElement.removeClass('uib-position-measure');
      }
    }
  }

  $scope.$on('uib:datepicker.mode', function() {
    $timeout(positionPopup, 0, false);
  });
}])

.directive('uibDatepickerPopup', function() {
  return {
    require: ['ngModel', 'uibDatepickerPopup'],
    controller: 'UibDatepickerPopupController',
    scope: {
      datepickerOptions: '=?',
      isOpen: '=?',
      currentText: '@',
      clearText: '@',
      closeText: '@'
    },
    link: function(scope, element, attrs, ctrls) {
      var ngModel = ctrls[0],
        ctrl = ctrls[1];

      ctrl.init(ngModel);
    }
  };
})

.directive('uibDatepickerPopupWrap', function() {
  return {
    restrict: 'A',
    transclude: true,
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/datepickerPopup/popup.html';
    }
  };
});

angular.module('ui.bootstrap.debounce', [])
/**
 * A helper, internal service that debounces a function
 */
  .factory('$$debounce', ['$timeout', function($timeout) {
    return function(callback, debounceTime) {
      var timeoutPromise;

      return function() {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        if (timeoutPromise) {
          $timeout.cancel(timeoutPromise);
        }

        timeoutPromise = $timeout(function() {
          callback.apply(self, args);
        }, debounceTime);
      };
    };
  }]);

angular.module('ui.bootstrap.dropdown', ['ui.bootstrap.position'])

.constant('uibDropdownConfig', {
  appendToOpenClass: 'uib-dropdown-open',
  openClass: 'open'
})

.service('uibDropdownService', ['$document', '$rootScope', function($document, $rootScope) {
  var openScope = null;

  this.open = function(dropdownScope, element) {
    if (!openScope) {
      $document.on('click', closeDropdown);
    }

    if (openScope && openScope !== dropdownScope) {
      openScope.isOpen = false;
    }

    openScope = dropdownScope;
  };

  this.close = function(dropdownScope, element) {
    if (openScope === dropdownScope) {
      openScope = null;
      $document.off('click', closeDropdown);
      $document.off('keydown', this.keybindFilter);
    }
  };

  var closeDropdown = function(evt) {
    // This method may still be called during the same mouse event that
    // unbound this event handler. So check openScope before proceeding.
    if (!openScope) { return; }

    if (evt && openScope.getAutoClose() === 'disabled') { return; }

    if (evt && evt.which === 3) { return; }

    var toggleElement = openScope.getToggleElement();
    if (evt && toggleElement && toggleElement[0].contains(evt.target)) {
      return;
    }

    var dropdownElement = openScope.getDropdownElement();
    if (evt && openScope.getAutoClose() === 'outsideClick' &&
      dropdownElement && dropdownElement[0].contains(evt.target)) {
      return;
    }

    openScope.focusToggleElement();
    openScope.isOpen = false;

    if (!$rootScope.$$phase) {
      openScope.$apply();
    }
  };

  this.keybindFilter = function(evt) {
    var dropdownElement = openScope.getDropdownElement();
    var toggleElement = openScope.getToggleElement();
    var dropdownElementTargeted = dropdownElement && dropdownElement[0].contains(evt.target);
    var toggleElementTargeted = toggleElement && toggleElement[0].contains(evt.target);
    if (evt.which === 27) {
      evt.stopPropagation();
      openScope.focusToggleElement();
      closeDropdown();
    } else if (openScope.isKeynavEnabled() && [38, 40].indexOf(evt.which) !== -1 && openScope.isOpen && (dropdownElementTargeted || toggleElementTargeted)) {
      evt.preventDefault();
      evt.stopPropagation();
      openScope.focusDropdownEntry(evt.which);
    }
  };
}])

.controller('UibDropdownController', ['$scope', '$element', '$attrs', '$parse', 'uibDropdownConfig', 'uibDropdownService', '$animate', '$uibPosition', '$document', '$compile', '$templateRequest', function($scope, $element, $attrs, $parse, dropdownConfig, uibDropdownService, $animate, $position, $document, $compile, $templateRequest) {
  var self = this,
    scope = $scope.$new(), // create a child scope so we are not polluting original one
    templateScope,
    appendToOpenClass = dropdownConfig.appendToOpenClass,
    openClass = dropdownConfig.openClass,
    getIsOpen,
    setIsOpen = angular.noop,
    toggleInvoker = $attrs.onToggle ? $parse($attrs.onToggle) : angular.noop,
    appendToBody = false,
    appendTo = null,
    keynavEnabled = false,
    selectedOption = null,
    body = $document.find('body');

  $element.addClass('dropdown');

  this.init = function() {
    if ($attrs.isOpen) {
      getIsOpen = $parse($attrs.isOpen);
      setIsOpen = getIsOpen.assign;

      $scope.$watch(getIsOpen, function(value) {
        scope.isOpen = !!value;
      });
    }

    if (angular.isDefined($attrs.dropdownAppendTo)) {
      var appendToEl = $parse($attrs.dropdownAppendTo)(scope);
      if (appendToEl) {
        appendTo = angular.element(appendToEl);
      }
    }

    appendToBody = angular.isDefined($attrs.dropdownAppendToBody);
    keynavEnabled = angular.isDefined($attrs.keyboardNav);

    if (appendToBody && !appendTo) {
      appendTo = body;
    }

    if (appendTo && self.dropdownMenu) {
      appendTo.append(self.dropdownMenu);
      $element.on('$destroy', function handleDestroyEvent() {
        self.dropdownMenu.remove();
      });
    }
  };

  this.toggle = function(open) {
    scope.isOpen = arguments.length ? !!open : !scope.isOpen;
    if (angular.isFunction(setIsOpen)) {
      setIsOpen(scope, scope.isOpen);
    }

    return scope.isOpen;
  };

  // Allow other directives to watch status
  this.isOpen = function() {
    return scope.isOpen;
  };

  scope.getToggleElement = function() {
    return self.toggleElement;
  };

  scope.getAutoClose = function() {
    return $attrs.autoClose || 'always'; //or 'outsideClick' or 'disabled'
  };

  scope.getElement = function() {
    return $element;
  };

  scope.isKeynavEnabled = function() {
    return keynavEnabled;
  };

  scope.focusDropdownEntry = function(keyCode) {
    var elems = self.dropdownMenu ? //If append to body is used.
      angular.element(self.dropdownMenu).find('a') :
      $element.find('ul').eq(0).find('a');

    switch (keyCode) {
      case 40: {
        if (!angular.isNumber(self.selectedOption)) {
          self.selectedOption = 0;
        } else {
          self.selectedOption = self.selectedOption === elems.length - 1 ?
            self.selectedOption :
            self.selectedOption + 1;
        }
        break;
      }
      case 38: {
        if (!angular.isNumber(self.selectedOption)) {
          self.selectedOption = elems.length - 1;
        } else {
          self.selectedOption = self.selectedOption === 0 ?
            0 : self.selectedOption - 1;
        }
        break;
      }
    }
    elems[self.selectedOption].focus();
  };

  scope.getDropdownElement = function() {
    return self.dropdownMenu;
  };

  scope.focusToggleElement = function() {
    if (self.toggleElement) {
      self.toggleElement[0].focus();
    }
  };

  scope.$watch('isOpen', function(isOpen, wasOpen) {
    if (appendTo && self.dropdownMenu) {
      var pos = $position.positionElements($element, self.dropdownMenu, 'bottom-left', true),
        css,
        rightalign,
        scrollbarPadding,
        scrollbarWidth = 0;

      css = {
        top: pos.top + 'px',
        display: isOpen ? 'block' : 'none'
      };

      rightalign = self.dropdownMenu.hasClass('dropdown-menu-right');
      if (!rightalign) {
        css.left = pos.left + 'px';
        css.right = 'auto';
      } else {
        css.left = 'auto';
        scrollbarPadding = $position.scrollbarPadding(appendTo);

        if (scrollbarPadding.heightOverflow && scrollbarPadding.scrollbarWidth) {
          scrollbarWidth = scrollbarPadding.scrollbarWidth;
        }

        css.right = window.innerWidth - scrollbarWidth -
          (pos.left + $element.prop('offsetWidth')) + 'px';
      }

      // Need to adjust our positioning to be relative to the appendTo container
      // if it's not the body element
      if (!appendToBody) {
        var appendOffset = $position.offset(appendTo);

        css.top = pos.top - appendOffset.top + 'px';

        if (!rightalign) {
          css.left = pos.left - appendOffset.left + 'px';
        } else {
          css.right = window.innerWidth -
            (pos.left - appendOffset.left + $element.prop('offsetWidth')) + 'px';
        }
      }

      self.dropdownMenu.css(css);
    }

    var openContainer = appendTo ? appendTo : $element;
    var hasOpenClass = openContainer.hasClass(appendTo ? appendToOpenClass : openClass);

    if (hasOpenClass === !isOpen) {
      $animate[isOpen ? 'addClass' : 'removeClass'](openContainer, appendTo ? appendToOpenClass : openClass).then(function() {
        if (angular.isDefined(isOpen) && isOpen !== wasOpen) {
          toggleInvoker($scope, { open: !!isOpen });
        }
      });
    }

    if (isOpen) {
      if (self.dropdownMenuTemplateUrl) {
        $templateRequest(self.dropdownMenuTemplateUrl).then(function(tplContent) {
          templateScope = scope.$new();
          $compile(tplContent.trim())(templateScope, function(dropdownElement) {
            var newEl = dropdownElement;
            self.dropdownMenu.replaceWith(newEl);
            self.dropdownMenu = newEl;
            $document.on('keydown', uibDropdownService.keybindFilter);
          });
        });
      } else {
        $document.on('keydown', uibDropdownService.keybindFilter);
      }

      scope.focusToggleElement();
      uibDropdownService.open(scope, $element);
    } else {
      uibDropdownService.close(scope, $element);
      if (self.dropdownMenuTemplateUrl) {
        if (templateScope) {
          templateScope.$destroy();
        }
        var newEl = angular.element('<ul class="dropdown-menu"></ul>');
        self.dropdownMenu.replaceWith(newEl);
        self.dropdownMenu = newEl;
      }

      self.selectedOption = null;
    }

    if (angular.isFunction(setIsOpen)) {
      setIsOpen($scope, isOpen);
    }
  });
}])

.directive('uibDropdown', function() {
  return {
    controller: 'UibDropdownController',
    link: function(scope, element, attrs, dropdownCtrl) {
      dropdownCtrl.init();
    }
  };
})

.directive('uibDropdownMenu', function() {
  return {
    restrict: 'A',
    require: '?^uibDropdown',
    link: function(scope, element, attrs, dropdownCtrl) {
      if (!dropdownCtrl || angular.isDefined(attrs.dropdownNested)) {
        return;
      }

      element.addClass('dropdown-menu');

      var tplUrl = attrs.templateUrl;
      if (tplUrl) {
        dropdownCtrl.dropdownMenuTemplateUrl = tplUrl;
      }

      if (!dropdownCtrl.dropdownMenu) {
        dropdownCtrl.dropdownMenu = element;
      }
    }
  };
})

.directive('uibDropdownToggle', function() {
  return {
    require: '?^uibDropdown',
    link: function(scope, element, attrs, dropdownCtrl) {
      if (!dropdownCtrl) {
        return;
      }

      element.addClass('dropdown-toggle');

      dropdownCtrl.toggleElement = element;

      var toggleDropdown = function(event) {
        event.preventDefault();

        if (!element.hasClass('disabled') && !attrs.disabled) {
          scope.$apply(function() {
            dropdownCtrl.toggle();
          });
        }
      };

      element.bind('click', toggleDropdown);

      // WAI-ARIA
      element.attr({ 'aria-haspopup': true, 'aria-expanded': false });
      scope.$watch(dropdownCtrl.isOpen, function(isOpen) {
        element.attr('aria-expanded', !!isOpen);
      });

      scope.$on('$destroy', function() {
        element.unbind('click', toggleDropdown);
      });
    }
  };
});

angular.module('ui.bootstrap.stackedMap', [])
/**
 * A helper, internal data structure that acts as a map but also allows getting / removing
 * elements in the LIFO order
 */
  .factory('$$stackedMap', function() {
    return {
      createNew: function() {
        var stack = [];

        return {
          add: function(key, value) {
            stack.push({
              key: key,
              value: value
            });
          },
          get: function(key) {
            for (var i = 0; i < stack.length; i++) {
              if (key === stack[i].key) {
                return stack[i];
              }
            }
          },
          keys: function() {
            var keys = [];
            for (var i = 0; i < stack.length; i++) {
              keys.push(stack[i].key);
            }
            return keys;
          },
          top: function() {
            return stack[stack.length - 1];
          },
          remove: function(key) {
            var idx = -1;
            for (var i = 0; i < stack.length; i++) {
              if (key === stack[i].key) {
                idx = i;
                break;
              }
            }
            return stack.splice(idx, 1)[0];
          },
          removeTop: function() {
            return stack.pop();
          },
          length: function() {
            return stack.length;
          }
        };
      }
    };
  });
angular.module('ui.bootstrap.modal', ['ui.bootstrap.stackedMap', 'ui.bootstrap.position'])
/**
 * A helper, internal data structure that stores all references attached to key
 */
  .factory('$$multiMap', function() {
    return {
      createNew: function() {
        var map = {};

        return {
          entries: function() {
            return Object.keys(map).map(function(key) {
              return {
                key: key,
                value: map[key]
              };
            });
          },
          get: function(key) {
            return map[key];
          },
          hasKey: function(key) {
            return !!map[key];
          },
          keys: function() {
            return Object.keys(map);
          },
          put: function(key, value) {
            if (!map[key]) {
              map[key] = [];
            }

            map[key].push(value);
          },
          remove: function(key, value) {
            var values = map[key];

            if (!values) {
              return;
            }

            var idx = values.indexOf(value);

            if (idx !== -1) {
              values.splice(idx, 1);
            }

            if (!values.length) {
              delete map[key];
            }
          }
        };
      }
    };
  })

/**
 * Pluggable resolve mechanism for the modal resolve resolution
 * Supports UI Router's $resolve service
 */
  .provider('$uibResolve', function() {
    var resolve = this;
    this.resolver = null;

    this.setResolver = function(resolver) {
      this.resolver = resolver;
    };

    this.$get = ['$injector', '$q', function($injector, $q) {
      var resolver = resolve.resolver ? $injector.get(resolve.resolver) : null;
      return {
        resolve: function(invocables, locals, parent, self) {
          if (resolver) {
            return resolver.resolve(invocables, locals, parent, self);
          }

          var promises = [];

          angular.forEach(invocables, function(value) {
            if (angular.isFunction(value) || angular.isArray(value)) {
              promises.push($q.resolve($injector.invoke(value)));
            } else if (angular.isString(value)) {
              promises.push($q.resolve($injector.get(value)));
            } else {
              promises.push($q.resolve(value));
            }
          });

          return $q.all(promises).then(function(resolves) {
            var resolveObj = {};
            var resolveIter = 0;
            angular.forEach(invocables, function(value, key) {
              resolveObj[key] = resolves[resolveIter++];
            });

            return resolveObj;
          });
        }
      };
    }];
  })

/**
 * A helper directive for the $modal service. It creates a backdrop element.
 */
  .directive('uibModalBackdrop', ['$animate', '$injector', '$uibModalStack',
  function($animate, $injector, $modalStack) {
    return {
      restrict: 'A',
      compile: function(tElement, tAttrs) {
        tElement.addClass(tAttrs.backdropClass);
        return linkFn;
      }
    };

    function linkFn(scope, element, attrs) {
      if (attrs.modalInClass) {
        $animate.addClass(element, attrs.modalInClass);

        scope.$on($modalStack.NOW_CLOSING_EVENT, function(e, setIsAsync) {
          var done = setIsAsync();
          if (scope.modalOptions.animation) {
            $animate.removeClass(element, attrs.modalInClass).then(done);
          } else {
            done();
          }
        });
      }
    }
  }])

  .directive('uibModalWindow', ['$uibModalStack', '$q', '$animateCss', '$document',
  function($modalStack, $q, $animateCss, $document) {
    return {
      scope: {
        index: '@'
      },
      restrict: 'A',
      transclude: true,
      templateUrl: function(tElement, tAttrs) {
        return tAttrs.templateUrl || 'uib/template/modal/window.html';
      },
      link: function(scope, element, attrs) {
        element.addClass(attrs.windowTopClass || '');
        scope.size = attrs.size;

        scope.close = function(evt) {
          var modal = $modalStack.getTop();
          if (modal && modal.value.backdrop &&
            modal.value.backdrop !== 'static' &&
            evt.target === evt.currentTarget) {
            evt.preventDefault();
            evt.stopPropagation();
            $modalStack.dismiss(modal.key, 'backdrop click');
          }
        };

        // moved from template to fix issue #2280
        element.on('click', scope.close);

        // This property is only added to the scope for the purpose of detecting when this directive is rendered.
        // We can detect that by using this property in the template associated with this directive and then use
        // {@link Attribute#$observe} on it. For more details please see {@link TableColumnResize}.
        scope.$isRendered = true;

        // Deferred object that will be resolved when this modal is render.
        var modalRenderDeferObj = $q.defer();
        // Resolve render promise post-digest
        scope.$$postDigest(function() {
          modalRenderDeferObj.resolve();
        });

        modalRenderDeferObj.promise.then(function() {
          var animationPromise = null;

          if (attrs.modalInClass) {
            animationPromise = $animateCss(element, {
              addClass: attrs.modalInClass
            }).start();

            scope.$on($modalStack.NOW_CLOSING_EVENT, function(e, setIsAsync) {
              var done = setIsAsync();
              $animateCss(element, {
                removeClass: attrs.modalInClass
              }).start().then(done);
            });
          }


          $q.when(animationPromise).then(function() {
            // Notify {@link $modalStack} that modal is rendered.
            var modal = $modalStack.getTop();
            if (modal) {
              $modalStack.modalRendered(modal.key);
            }

            /**
             * If something within the freshly-opened modal already has focus (perhaps via a
             * directive that causes focus). then no need to try and focus anything.
             */
            if (!($document[0].activeElement && element[0].contains($document[0].activeElement))) {
              var inputWithAutofocus = element[0].querySelector('[autofocus]');
              /**
               * Auto-focusing of a freshly-opened modal element causes any child elements
               * with the autofocus attribute to lose focus. This is an issue on touch
               * based devices which will show and then hide the onscreen keyboard.
               * Attempts to refocus the autofocus element via JavaScript will not reopen
               * the onscreen keyboard. Fixed by updated the focusing logic to only autofocus
               * the modal element if the modal does not contain an autofocus element.
               */
              if (inputWithAutofocus) {
                inputWithAutofocus.focus();
              } else {
                element[0].focus();
              }
            }
          });
        });
      }
    };
  }])

  .directive('uibModalAnimationClass', function() {
    return {
      compile: function(tElement, tAttrs) {
        if (tAttrs.modalAnimation) {
          tElement.addClass(tAttrs.uibModalAnimationClass);
        }
      }
    };
  })

  .directive('uibModalTransclude', ['$animate', function($animate) {
    return {
      link: function(scope, element, attrs, controller, transclude) {
        transclude(scope.$parent, function(clone) {
          element.empty();
          $animate.enter(clone, element);
        });
      }
    };
  }])

  .factory('$uibModalStack', ['$animate', '$animateCss', '$document',
    '$compile', '$rootScope', '$q', '$$multiMap', '$$stackedMap', '$uibPosition',
    function($animate, $animateCss, $document, $compile, $rootScope, $q, $$multiMap, $$stackedMap, $uibPosition) {
      var OPENED_MODAL_CLASS = 'modal-open';

      var backdropDomEl, backdropScope;
      var openedWindows = $$stackedMap.createNew();
      var openedClasses = $$multiMap.createNew();
      var $modalStack = {
        NOW_CLOSING_EVENT: 'modal.stack.now-closing'
      };
      var topModalIndex = 0;
      var previousTopOpenedModal = null;

      //Modal focus behavior
      var tabbableSelector = 'a[href], area[href], input:not([disabled]):not([tabindex=\'-1\']), ' +
        'button:not([disabled]):not([tabindex=\'-1\']),select:not([disabled]):not([tabindex=\'-1\']), textarea:not([disabled]):not([tabindex=\'-1\']), ' +
        'iframe, object, embed, *[tabindex]:not([tabindex=\'-1\']), *[contenteditable=true]';
      var scrollbarPadding;
      var SNAKE_CASE_REGEXP = /[A-Z]/g;

      // TODO: extract into common dependency with tooltip
      function snake_case(name) {
        var separator = '-';
        return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
          return (pos ? separator : '') + letter.toLowerCase();
        });
      }

      function isVisible(element) {
        return !!(element.offsetWidth ||
          element.offsetHeight ||
          element.getClientRects().length);
      }

      function backdropIndex() {
        var topBackdropIndex = -1;
        var opened = openedWindows.keys();
        for (var i = 0; i < opened.length; i++) {
          if (openedWindows.get(opened[i]).value.backdrop) {
            topBackdropIndex = i;
          }
        }

        // If any backdrop exist, ensure that it's index is always
        // right below the top modal
        if (topBackdropIndex > -1 && topBackdropIndex < topModalIndex) {
          topBackdropIndex = topModalIndex;
        }
        return topBackdropIndex;
      }

      $rootScope.$watch(backdropIndex, function(newBackdropIndex) {
        if (backdropScope) {
          backdropScope.index = newBackdropIndex;
        }
      });

      function removeModalWindow(modalInstance, elementToReceiveFocus) {
        var modalWindow = openedWindows.get(modalInstance).value;
        var appendToElement = modalWindow.appendTo;

        //clean up the stack
        openedWindows.remove(modalInstance);
        previousTopOpenedModal = openedWindows.top();
        if (previousTopOpenedModal) {
          topModalIndex = parseInt(previousTopOpenedModal.value.modalDomEl.attr('index'), 10);
        }

        removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, function() {
          var modalBodyClass = modalWindow.openedClass || OPENED_MODAL_CLASS;
          openedClasses.remove(modalBodyClass, modalInstance);
          var areAnyOpen = openedClasses.hasKey(modalBodyClass);
          appendToElement.toggleClass(modalBodyClass, areAnyOpen);
          if (!areAnyOpen && scrollbarPadding && scrollbarPadding.heightOverflow && scrollbarPadding.scrollbarWidth) {
            if (scrollbarPadding.originalRight) {
              appendToElement.css({paddingRight: scrollbarPadding.originalRight + 'px'});
            } else {
              appendToElement.css({paddingRight: ''});
            }
            scrollbarPadding = null;
          }
          toggleTopWindowClass(true);
        }, modalWindow.closedDeferred);
        checkRemoveBackdrop();

        //move focus to specified element if available, or else to body
        if (elementToReceiveFocus && elementToReceiveFocus.focus) {
          elementToReceiveFocus.focus();
        } else if (appendToElement.focus) {
          appendToElement.focus();
        }
      }

      // Add or remove "windowTopClass" from the top window in the stack
      function toggleTopWindowClass(toggleSwitch) {
        var modalWindow;

        if (openedWindows.length() > 0) {
          modalWindow = openedWindows.top().value;
          modalWindow.modalDomEl.toggleClass(modalWindow.windowTopClass || '', toggleSwitch);
        }
      }

      function checkRemoveBackdrop() {
        //remove backdrop if no longer needed
        if (backdropDomEl && backdropIndex() === -1) {
          var backdropScopeRef = backdropScope;
          removeAfterAnimate(backdropDomEl, backdropScope, function() {
            backdropScopeRef = null;
          });
          backdropDomEl = undefined;
          backdropScope = undefined;
        }
      }

      function removeAfterAnimate(domEl, scope, done, closedDeferred) {
        var asyncDeferred;
        var asyncPromise = null;
        var setIsAsync = function() {
          if (!asyncDeferred) {
            asyncDeferred = $q.defer();
            asyncPromise = asyncDeferred.promise;
          }

          return function asyncDone() {
            asyncDeferred.resolve();
          };
        };
        scope.$broadcast($modalStack.NOW_CLOSING_EVENT, setIsAsync);

        // Note that it's intentional that asyncPromise might be null.
        // That's when setIsAsync has not been called during the
        // NOW_CLOSING_EVENT broadcast.
        return $q.when(asyncPromise).then(afterAnimating);

        function afterAnimating() {
          if (afterAnimating.done) {
            return;
          }
          afterAnimating.done = true;

          $animate.leave(domEl).then(function() {
            if (done) {
              done();
            }

            domEl.remove();
            if (closedDeferred) {
              closedDeferred.resolve();
            }
          });

          scope.$destroy();
        }
      }

      $document.on('keydown', keydownListener);

      $rootScope.$on('$destroy', function() {
        $document.off('keydown', keydownListener);
      });

      function keydownListener(evt) {
        if (evt.isDefaultPrevented()) {
          return evt;
        }

        var modal = openedWindows.top();
        if (modal) {
          switch (evt.which) {
            case 27: {
              if (modal.value.keyboard) {
                evt.preventDefault();
                $rootScope.$apply(function() {
                  $modalStack.dismiss(modal.key, 'escape key press');
                });
              }
              break;
            }
            case 9: {
              var list = $modalStack.loadFocusElementList(modal);
              var focusChanged = false;
              if (evt.shiftKey) {
                if ($modalStack.isFocusInFirstItem(evt, list) || $modalStack.isModalFocused(evt, modal)) {
                  focusChanged = $modalStack.focusLastFocusableElement(list);
                }
              } else {
                if ($modalStack.isFocusInLastItem(evt, list)) {
                  focusChanged = $modalStack.focusFirstFocusableElement(list);
                }
              }

              if (focusChanged) {
                evt.preventDefault();
                evt.stopPropagation();
              }

              break;
            }
          }
        }
      }

      $modalStack.open = function(modalInstance, modal) {
        var modalOpener = $document[0].activeElement,
          modalBodyClass = modal.openedClass || OPENED_MODAL_CLASS;

        toggleTopWindowClass(false);

        // Store the current top first, to determine what index we ought to use
        // for the current top modal
        previousTopOpenedModal = openedWindows.top();

        openedWindows.add(modalInstance, {
          deferred: modal.deferred,
          renderDeferred: modal.renderDeferred,
          closedDeferred: modal.closedDeferred,
          modalScope: modal.scope,
          backdrop: modal.backdrop,
          keyboard: modal.keyboard,
          openedClass: modal.openedClass,
          windowTopClass: modal.windowTopClass,
          animation: modal.animation,
          appendTo: modal.appendTo
        });

        openedClasses.put(modalBodyClass, modalInstance);

        var appendToElement = modal.appendTo,
            currBackdropIndex = backdropIndex();

        if (!appendToElement.length) {
          throw new Error('appendTo element not found. Make sure that the element passed is in DOM.');
        }

        if (currBackdropIndex >= 0 && !backdropDomEl) {
          backdropScope = $rootScope.$new(true);
          backdropScope.modalOptions = modal;
          backdropScope.index = currBackdropIndex;
          backdropDomEl = angular.element('<div uib-modal-backdrop="modal-backdrop"></div>');
          backdropDomEl.attr({
            'class': 'modal-backdrop',
            'ng-style': '{\'z-index\': 1040 + (index && 1 || 0) + index*10}',
            'uib-modal-animation-class': 'fade',
            'modal-in-class': 'in'
          });
          if (modal.backdropClass) {
            backdropDomEl.addClass(modal.backdropClass);
          }

          if (modal.animation) {
            backdropDomEl.attr('modal-animation', 'true');
          }
          $compile(backdropDomEl)(backdropScope);
          $animate.enter(backdropDomEl, appendToElement);
          if ($uibPosition.isScrollable(appendToElement)) {
            scrollbarPadding = $uibPosition.scrollbarPadding(appendToElement);
            if (scrollbarPadding.heightOverflow && scrollbarPadding.scrollbarWidth) {
              appendToElement.css({paddingRight: scrollbarPadding.right + 'px'});
            }
          }
        }

        var content;
        if (modal.component) {
          content = document.createElement(snake_case(modal.component.name));
          content = angular.element(content);
          content.attr({
            resolve: '$resolve',
            'modal-instance': '$uibModalInstance',
            close: '$close($value)',
            dismiss: '$dismiss($value)'
          });
        } else {
          content = modal.content;
        }

        // Set the top modal index based on the index of the previous top modal
        topModalIndex = previousTopOpenedModal ? parseInt(previousTopOpenedModal.value.modalDomEl.attr('index'), 10) + 1 : 0;
        var angularDomEl = angular.element('<div uib-modal-window="modal-window"></div>');
        angularDomEl.attr({
          'class': 'modal',
          'template-url': modal.windowTemplateUrl,
          'window-top-class': modal.windowTopClass,
          'role': 'dialog',
          'aria-labelledby': modal.ariaLabelledBy,
          'aria-describedby': modal.ariaDescribedBy,
          'size': modal.size,
          'index': topModalIndex,
          'animate': 'animate',
          'ng-style': '{\'z-index\': 1050 + $$topModalIndex*10, display: \'block\'}',
          'tabindex': -1,
          'uib-modal-animation-class': 'fade',
          'modal-in-class': 'in'
        }).append(content);
        if (modal.windowClass) {
          angularDomEl.addClass(modal.windowClass);
        }

        if (modal.animation) {
          angularDomEl.attr('modal-animation', 'true');
        }

        appendToElement.addClass(modalBodyClass);
        if (modal.scope) {
          // we need to explicitly add the modal index to the modal scope
          // because it is needed by ngStyle to compute the zIndex property.
          modal.scope.$$topModalIndex = topModalIndex;
        }
        $animate.enter($compile(angularDomEl)(modal.scope), appendToElement);

        openedWindows.top().value.modalDomEl = angularDomEl;
        openedWindows.top().value.modalOpener = modalOpener;
      };

      function broadcastClosing(modalWindow, resultOrReason, closing) {
        return !modalWindow.value.modalScope.$broadcast('modal.closing', resultOrReason, closing).defaultPrevented;
      }

      $modalStack.close = function(modalInstance, result) {
        var modalWindow = openedWindows.get(modalInstance);
        if (modalWindow && broadcastClosing(modalWindow, result, true)) {
          modalWindow.value.modalScope.$$uibDestructionScheduled = true;
          modalWindow.value.deferred.resolve(result);
          removeModalWindow(modalInstance, modalWindow.value.modalOpener);
          return true;
        }
        return !modalWindow;
      };

      $modalStack.dismiss = function(modalInstance, reason) {
        var modalWindow = openedWindows.get(modalInstance);
        if (modalWindow && broadcastClosing(modalWindow, reason, false)) {
          modalWindow.value.modalScope.$$uibDestructionScheduled = true;
          modalWindow.value.deferred.reject(reason);
          removeModalWindow(modalInstance, modalWindow.value.modalOpener);
          return true;
        }
        return !modalWindow;
      };

      $modalStack.dismissAll = function(reason) {
        var topModal = this.getTop();
        while (topModal && this.dismiss(topModal.key, reason)) {
          topModal = this.getTop();
        }
      };

      $modalStack.getTop = function() {
        return openedWindows.top();
      };

      $modalStack.modalRendered = function(modalInstance) {
        var modalWindow = openedWindows.get(modalInstance);
        if (modalWindow) {
          modalWindow.value.renderDeferred.resolve();
        }
      };

      $modalStack.focusFirstFocusableElement = function(list) {
        if (list.length > 0) {
          list[0].focus();
          return true;
        }
        return false;
      };

      $modalStack.focusLastFocusableElement = function(list) {
        if (list.length > 0) {
          list[list.length - 1].focus();
          return true;
        }
        return false;
      };

      $modalStack.isModalFocused = function(evt, modalWindow) {
        if (evt && modalWindow) {
          var modalDomEl = modalWindow.value.modalDomEl;
          if (modalDomEl && modalDomEl.length) {
            return (evt.target || evt.srcElement) === modalDomEl[0];
          }
        }
        return false;
      };

      $modalStack.isFocusInFirstItem = function(evt, list) {
        if (list.length > 0) {
          return (evt.target || evt.srcElement) === list[0];
        }
        return false;
      };

      $modalStack.isFocusInLastItem = function(evt, list) {
        if (list.length > 0) {
          return (evt.target || evt.srcElement) === list[list.length - 1];
        }
        return false;
      };

      $modalStack.loadFocusElementList = function(modalWindow) {
        if (modalWindow) {
          var modalDomE1 = modalWindow.value.modalDomEl;
          if (modalDomE1 && modalDomE1.length) {
            var elements = modalDomE1[0].querySelectorAll(tabbableSelector);
            return elements ?
              Array.prototype.filter.call(elements, function(element) {
                return isVisible(element);
              }) : elements;
          }
        }
      };

      return $modalStack;
    }])

  .provider('$uibModal', function() {
    var $modalProvider = {
      options: {
        animation: true,
        backdrop: true, //can also be false or 'static'
        keyboard: true
      },
      $get: ['$rootScope', '$q', '$document', '$templateRequest', '$controller', '$uibResolve', '$uibModalStack',
        function ($rootScope, $q, $document, $templateRequest, $controller, $uibResolve, $modalStack) {
          var $modal = {};

          function getTemplatePromise(options) {
            return options.template ? $q.when(options.template) :
              $templateRequest(angular.isFunction(options.templateUrl) ?
                options.templateUrl() : options.templateUrl);
          }

          var promiseChain = null;
          $modal.getPromiseChain = function() {
            return promiseChain;
          };

          $modal.open = function(modalOptions) {
            var modalResultDeferred = $q.defer();
            var modalOpenedDeferred = $q.defer();
            var modalClosedDeferred = $q.defer();
            var modalRenderDeferred = $q.defer();

            //prepare an instance of a modal to be injected into controllers and returned to a caller
            var modalInstance = {
              result: modalResultDeferred.promise,
              opened: modalOpenedDeferred.promise,
              closed: modalClosedDeferred.promise,
              rendered: modalRenderDeferred.promise,
              close: function (result) {
                return $modalStack.close(modalInstance, result);
              },
              dismiss: function (reason) {
                return $modalStack.dismiss(modalInstance, reason);
              }
            };

            //merge and clean up options
            modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
            modalOptions.resolve = modalOptions.resolve || {};
            modalOptions.appendTo = modalOptions.appendTo || $document.find('body').eq(0);

            //verify options
            if (!modalOptions.component && !modalOptions.template && !modalOptions.templateUrl) {
              throw new Error('One of component or template or templateUrl options is required.');
            }

            var templateAndResolvePromise;
            if (modalOptions.component) {
              templateAndResolvePromise = $q.when($uibResolve.resolve(modalOptions.resolve, {}, null, null));
            } else {
              templateAndResolvePromise =
                $q.all([getTemplatePromise(modalOptions), $uibResolve.resolve(modalOptions.resolve, {}, null, null)]);
            }

            function resolveWithTemplate() {
              return templateAndResolvePromise;
            }

            // Wait for the resolution of the existing promise chain.
            // Then switch to our own combined promise dependency (regardless of how the previous modal fared).
            // Then add to $modalStack and resolve opened.
            // Finally clean up the chain variable if no subsequent modal has overwritten it.
            var samePromise;
            samePromise = promiseChain = $q.all([promiseChain])
              .then(resolveWithTemplate, resolveWithTemplate)
              .then(function resolveSuccess(tplAndVars) {
                var providedScope = modalOptions.scope || $rootScope;

                var modalScope = providedScope.$new();
                modalScope.$close = modalInstance.close;
                modalScope.$dismiss = modalInstance.dismiss;

                modalScope.$on('$destroy', function() {
                  if (!modalScope.$$uibDestructionScheduled) {
                    modalScope.$dismiss('$uibUnscheduledDestruction');
                  }
                });

                var modal = {
                  scope: modalScope,
                  deferred: modalResultDeferred,
                  renderDeferred: modalRenderDeferred,
                  closedDeferred: modalClosedDeferred,
                  animation: modalOptions.animation,
                  backdrop: modalOptions.backdrop,
                  keyboard: modalOptions.keyboard,
                  backdropClass: modalOptions.backdropClass,
                  windowTopClass: modalOptions.windowTopClass,
                  windowClass: modalOptions.windowClass,
                  windowTemplateUrl: modalOptions.windowTemplateUrl,
                  ariaLabelledBy: modalOptions.ariaLabelledBy,
                  ariaDescribedBy: modalOptions.ariaDescribedBy,
                  size: modalOptions.size,
                  openedClass: modalOptions.openedClass,
                  appendTo: modalOptions.appendTo
                };

                var component = {};
                var ctrlInstance, ctrlInstantiate, ctrlLocals = {};

                if (modalOptions.component) {
                  constructLocals(component, false, true, false);
                  component.name = modalOptions.component;
                  modal.component = component;
                } else if (modalOptions.controller) {
                  constructLocals(ctrlLocals, true, false, true);

                  // the third param will make the controller instantiate later,private api
                  // @see https://github.com/angular/angular.js/blob/master/src/ng/controller.js#L126
                  ctrlInstantiate = $controller(modalOptions.controller, ctrlLocals, true, modalOptions.controllerAs);
                  if (modalOptions.controllerAs && modalOptions.bindToController) {
                    ctrlInstance = ctrlInstantiate.instance;
                    ctrlInstance.$close = modalScope.$close;
                    ctrlInstance.$dismiss = modalScope.$dismiss;
                    angular.extend(ctrlInstance, {
                      $resolve: ctrlLocals.$scope.$resolve
                    }, providedScope);
                  }

                  ctrlInstance = ctrlInstantiate();

                  if (angular.isFunction(ctrlInstance.$onInit)) {
                    ctrlInstance.$onInit();
                  }
                }

                if (!modalOptions.component) {
                  modal.content = tplAndVars[0];
                }

                $modalStack.open(modalInstance, modal);
                modalOpenedDeferred.resolve(true);

                function constructLocals(obj, template, instanceOnScope, injectable) {
                  obj.$scope = modalScope;
                  obj.$scope.$resolve = {};
                  if (instanceOnScope) {
                    obj.$scope.$uibModalInstance = modalInstance;
                  } else {
                    obj.$uibModalInstance = modalInstance;
                  }

                  var resolves = template ? tplAndVars[1] : tplAndVars;
                  angular.forEach(resolves, function(value, key) {
                    if (injectable) {
                      obj[key] = value;
                    }

                    obj.$scope.$resolve[key] = value;
                  });
                }
            }, function resolveError(reason) {
              modalOpenedDeferred.reject(reason);
              modalResultDeferred.reject(reason);
            })['finally'](function() {
              if (promiseChain === samePromise) {
                promiseChain = null;
              }
            });

            return modalInstance;
          };

          return $modal;
        }
      ]
    };

    return $modalProvider;
  });

angular.module('ui.bootstrap.paging', [])
/**
 * Helper internal service for generating common controller code between the
 * pager and pagination components
 */
.factory('uibPaging', ['$parse', function($parse) {
  return {
    create: function(ctrl, $scope, $attrs) {
      ctrl.setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;
      ctrl.ngModelCtrl = { $setViewValue: angular.noop }; // nullModelCtrl
      ctrl._watchers = [];

      ctrl.init = function(ngModelCtrl, config) {
        ctrl.ngModelCtrl = ngModelCtrl;
        ctrl.config = config;

        ngModelCtrl.$render = function() {
          ctrl.render();
        };

        if ($attrs.itemsPerPage) {
          ctrl._watchers.push($scope.$parent.$watch($attrs.itemsPerPage, function(value) {
            ctrl.itemsPerPage = parseInt(value, 10);
            $scope.totalPages = ctrl.calculateTotalPages();
            ctrl.updatePage();
          }));
        } else {
          ctrl.itemsPerPage = config.itemsPerPage;
        }

        $scope.$watch('totalItems', function(newTotal, oldTotal) {
          if (angular.isDefined(newTotal) || newTotal !== oldTotal) {
            $scope.totalPages = ctrl.calculateTotalPages();
            ctrl.updatePage();
          }
        });
      };

      ctrl.calculateTotalPages = function() {
        var totalPages = ctrl.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / ctrl.itemsPerPage);
        return Math.max(totalPages || 0, 1);
      };

      ctrl.render = function() {
        $scope.page = parseInt(ctrl.ngModelCtrl.$viewValue, 10) || 1;
      };

      $scope.selectPage = function(page, evt) {
        if (evt) {
          evt.preventDefault();
        }

        var clickAllowed = !$scope.ngDisabled || !evt;
        if (clickAllowed && $scope.page !== page && page > 0 && page <= $scope.totalPages) {
          if (evt && evt.target) {
            evt.target.blur();
          }
          ctrl.ngModelCtrl.$setViewValue(page);
          ctrl.ngModelCtrl.$render();
        }
      };

      $scope.getText = function(key) {
        return $scope[key + 'Text'] || ctrl.config[key + 'Text'];
      };

      $scope.noPrevious = function() {
        return $scope.page === 1;
      };

      $scope.noNext = function() {
        return $scope.page === $scope.totalPages;
      };

      ctrl.updatePage = function() {
        ctrl.setNumPages($scope.$parent, $scope.totalPages); // Readonly variable

        if ($scope.page > $scope.totalPages) {
          $scope.selectPage($scope.totalPages);
        } else {
          ctrl.ngModelCtrl.$render();
        }
      };

      $scope.$on('$destroy', function() {
        while (ctrl._watchers.length) {
          ctrl._watchers.shift()();
        }
      });
    }
  };
}]);

angular.module('ui.bootstrap.pager', ['ui.bootstrap.paging', 'ui.bootstrap.tabindex'])

.controller('UibPagerController', ['$scope', '$attrs', 'uibPaging', 'uibPagerConfig', function($scope, $attrs, uibPaging, uibPagerConfig) {
  $scope.align = angular.isDefined($attrs.align) ? $scope.$parent.$eval($attrs.align) : uibPagerConfig.align;

  uibPaging.create(this, $scope, $attrs);
}])

.constant('uibPagerConfig', {
  itemsPerPage: 10,
  previousText: '« Previous',
  nextText: 'Next »',
  align: true
})

.directive('uibPager', ['uibPagerConfig', function(uibPagerConfig) {
  return {
    scope: {
      totalItems: '=',
      previousText: '@',
      nextText: '@',
      ngDisabled: '='
    },
    require: ['uibPager', '?ngModel'],
    restrict: 'A',
    controller: 'UibPagerController',
    controllerAs: 'pager',
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/pager/pager.html';
    },
    link: function(scope, element, attrs, ctrls) {
      element.addClass('pager');
      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (!ngModelCtrl) {
        return; // do nothing if no ng-model
      }

      paginationCtrl.init(ngModelCtrl, uibPagerConfig);
    }
  };
}]);

angular.module('ui.bootstrap.pagination', ['ui.bootstrap.paging', 'ui.bootstrap.tabindex'])
.controller('UibPaginationController', ['$scope', '$attrs', '$parse', 'uibPaging', 'uibPaginationConfig', function($scope, $attrs, $parse, uibPaging, uibPaginationConfig) {
  var ctrl = this;
  // Setup configuration parameters
  var maxSize = angular.isDefined($attrs.maxSize) ? $scope.$parent.$eval($attrs.maxSize) : uibPaginationConfig.maxSize,
    rotate = angular.isDefined($attrs.rotate) ? $scope.$parent.$eval($attrs.rotate) : uibPaginationConfig.rotate,
    forceEllipses = angular.isDefined($attrs.forceEllipses) ? $scope.$parent.$eval($attrs.forceEllipses) : uibPaginationConfig.forceEllipses,
    boundaryLinkNumbers = angular.isDefined($attrs.boundaryLinkNumbers) ? $scope.$parent.$eval($attrs.boundaryLinkNumbers) : uibPaginationConfig.boundaryLinkNumbers,
    pageLabel = angular.isDefined($attrs.pageLabel) ? function(idx) { return $scope.$parent.$eval($attrs.pageLabel, {$page: idx}); } : angular.identity;
  $scope.boundaryLinks = angular.isDefined($attrs.boundaryLinks) ? $scope.$parent.$eval($attrs.boundaryLinks) : uibPaginationConfig.boundaryLinks;
  $scope.directionLinks = angular.isDefined($attrs.directionLinks) ? $scope.$parent.$eval($attrs.directionLinks) : uibPaginationConfig.directionLinks;

  uibPaging.create(this, $scope, $attrs);

  if ($attrs.maxSize) {
    ctrl._watchers.push($scope.$parent.$watch($parse($attrs.maxSize), function(value) {
      maxSize = parseInt(value, 10);
      ctrl.render();
    }));
  }

  // Create page object used in template
  function makePage(number, text, isActive) {
    return {
      number: number,
      text: text,
      active: isActive
    };
  }

  function getPages(currentPage, totalPages) {
    var pages = [];

    // Default page limits
    var startPage = 1, endPage = totalPages;
    var isMaxSized = angular.isDefined(maxSize) && maxSize < totalPages;

    // recompute if maxSize
    if (isMaxSized) {
      if (rotate) {
        // Current page is displayed in the middle of the visible ones
        startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1);
        endPage = startPage + maxSize - 1;

        // Adjust if limit is exceeded
        if (endPage > totalPages) {
          endPage = totalPages;
          startPage = endPage - maxSize + 1;
        }
      } else {
        // Visible pages are paginated with maxSize
        startPage = (Math.ceil(currentPage / maxSize) - 1) * maxSize + 1;

        // Adjust last page if limit is exceeded
        endPage = Math.min(startPage + maxSize - 1, totalPages);
      }
    }

    // Add page number links
    for (var number = startPage; number <= endPage; number++) {
      var page = makePage(number, pageLabel(number), number === currentPage);
      pages.push(page);
    }

    // Add links to move between page sets
    if (isMaxSized && maxSize > 0 && (!rotate || forceEllipses || boundaryLinkNumbers)) {
      if (startPage > 1) {
        if (!boundaryLinkNumbers || startPage > 3) { //need ellipsis for all options unless range is too close to beginning
        var previousPageSet = makePage(startPage - 1, '...', false);
        pages.unshift(previousPageSet);
      }
        if (boundaryLinkNumbers) {
          if (startPage === 3) { //need to replace ellipsis when the buttons would be sequential
            var secondPageLink = makePage(2, '2', false);
            pages.unshift(secondPageLink);
          }
          //add the first page
          var firstPageLink = makePage(1, '1', false);
          pages.unshift(firstPageLink);
        }
      }

      if (endPage < totalPages) {
        if (!boundaryLinkNumbers || endPage < totalPages - 2) { //need ellipsis for all options unless range is too close to end
        var nextPageSet = makePage(endPage + 1, '...', false);
        pages.push(nextPageSet);
      }
        if (boundaryLinkNumbers) {
          if (endPage === totalPages - 2) { //need to replace ellipsis when the buttons would be sequential
            var secondToLastPageLink = makePage(totalPages - 1, totalPages - 1, false);
            pages.push(secondToLastPageLink);
          }
          //add the last page
          var lastPageLink = makePage(totalPages, totalPages, false);
          pages.push(lastPageLink);
        }
      }
    }
    return pages;
  }

  var originalRender = this.render;
  this.render = function() {
    originalRender();
    if ($scope.page > 0 && $scope.page <= $scope.totalPages) {
      $scope.pages = getPages($scope.page, $scope.totalPages);
    }
  };
}])

.constant('uibPaginationConfig', {
  itemsPerPage: 10,
  boundaryLinks: false,
  boundaryLinkNumbers: false,
  directionLinks: true,
  firstText: 'First',
  previousText: 'Previous',
  nextText: 'Next',
  lastText: 'Last',
  rotate: true,
  forceEllipses: false
})

.directive('uibPagination', ['$parse', 'uibPaginationConfig', function($parse, uibPaginationConfig) {
  return {
    scope: {
      totalItems: '=',
      firstText: '@',
      previousText: '@',
      nextText: '@',
      lastText: '@',
      ngDisabled:'='
    },
    require: ['uibPagination', '?ngModel'],
    restrict: 'A',
    controller: 'UibPaginationController',
    controllerAs: 'pagination',
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/pagination/pagination.html';
    },
    link: function(scope, element, attrs, ctrls) {
      element.addClass('pagination');
      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (!ngModelCtrl) {
         return; // do nothing if no ng-model
      }

      paginationCtrl.init(ngModelCtrl, uibPaginationConfig);
    }
  };
}]);

/**
 * The following features are still outstanding: animation as a
 * function, placement as a function, inside, support for more triggers than
 * just mouse enter/leave, html tooltips, and selector delegation.
 */
angular.module('ui.bootstrap.tooltip', ['ui.bootstrap.position', 'ui.bootstrap.stackedMap'])

/**
 * The $tooltip service creates tooltip- and popover-like directives as well as
 * houses global options for them.
 */
.provider('$uibTooltip', function() {
  // The default options tooltip and popover.
  var defaultOptions = {
    placement: 'top',
    placementClassPrefix: '',
    animation: true,
    popupDelay: 0,
    popupCloseDelay: 0,
    useContentExp: false
  };

  // Default hide triggers for each show trigger
  var triggerMap = {
    'mouseenter': 'mouseleave',
    'click': 'click',
    'outsideClick': 'outsideClick',
    'focus': 'blur',
    'none': ''
  };

  // The options specified to the provider globally.
  var globalOptions = {};

  /**
   * `options({})` allows global configuration of all tooltips in the
   * application.
   *
   *   var app = angular.module( 'App', ['ui.bootstrap.tooltip'], function( $tooltipProvider ) {
   *     // place tooltips left instead of top by default
   *     $tooltipProvider.options( { placement: 'left' } );
   *   });
   */
	this.options = function(value) {
		angular.extend(globalOptions, value);
	};

  /**
   * This allows you to extend the set of trigger mappings available. E.g.:
   *
   *   $tooltipProvider.setTriggers( { 'openTrigger': 'closeTrigger' } );
   */
  this.setTriggers = function setTriggers(triggers) {
    angular.extend(triggerMap, triggers);
  };

  /**
   * This is a helper function for translating camel-case to snake_case.
   */
  function snake_case(name) {
    var regexp = /[A-Z]/g;
    var separator = '-';
    return name.replace(regexp, function(letter, pos) {
      return (pos ? separator : '') + letter.toLowerCase();
    });
  }

  /**
   * Returns the actual instance of the $tooltip service.
   * TODO support multiple triggers
   */
  this.$get = ['$window', '$compile', '$timeout', '$document', '$uibPosition', '$interpolate', '$rootScope', '$parse', '$$stackedMap', function($window, $compile, $timeout, $document, $position, $interpolate, $rootScope, $parse, $$stackedMap) {
    var openedTooltips = $$stackedMap.createNew();
    $document.on('keyup', keypressListener);

    $rootScope.$on('$destroy', function() {
      $document.off('keyup', keypressListener);
    });

    function keypressListener(e) {
      if (e.which === 27) {
        var last = openedTooltips.top();
        if (last) {
          last.value.close();
          last = null;
        }
      }
    }

    return function $tooltip(ttType, prefix, defaultTriggerShow, options) {
      options = angular.extend({}, defaultOptions, globalOptions, options);

      /**
       * Returns an object of show and hide triggers.
       *
       * If a trigger is supplied,
       * it is used to show the tooltip; otherwise, it will use the `trigger`
       * option passed to the `$tooltipProvider.options` method; else it will
       * default to the trigger supplied to this directive factory.
       *
       * The hide trigger is based on the show trigger. If the `trigger` option
       * was passed to the `$tooltipProvider.options` method, it will use the
       * mapped trigger from `triggerMap` or the passed trigger if the map is
       * undefined; otherwise, it uses the `triggerMap` value of the show
       * trigger; else it will just use the show trigger.
       */
      function getTriggers(trigger) {
        var show = (trigger || options.trigger || defaultTriggerShow).split(' ');
        var hide = show.map(function(trigger) {
          return triggerMap[trigger] || trigger;
        });
        return {
          show: show,
          hide: hide
        };
      }

      var directiveName = snake_case(ttType);

      var startSym = $interpolate.startSymbol();
      var endSym = $interpolate.endSymbol();
      var template =
        '<div '+ directiveName + '-popup ' +
          'uib-title="' + startSym + 'title' + endSym + '" ' +
          (options.useContentExp ?
            'content-exp="contentExp()" ' :
            'content="' + startSym + 'content' + endSym + '" ') +
          'origin-scope="origScope" ' +
          'class="uib-position-measure ' + prefix + '" ' +
          'tooltip-animation-class="fade"' +
          'uib-tooltip-classes ' +
          'ng-class="{ in: isOpen }" ' +
          '>' +
        '</div>';

      return {
        compile: function(tElem, tAttrs) {
          var tooltipLinker = $compile(template);

          return function link(scope, element, attrs, tooltipCtrl) {
            var tooltip;
            var tooltipLinkedScope;
            var transitionTimeout;
            var showTimeout;
            var hideTimeout;
            var positionTimeout;
            var appendToBody = angular.isDefined(options.appendToBody) ? options.appendToBody : false;
            var triggers = getTriggers(undefined);
            var hasEnableExp = angular.isDefined(attrs[prefix + 'Enable']);
            var ttScope = scope.$new(true);
            var repositionScheduled = false;
            var isOpenParse = angular.isDefined(attrs[prefix + 'IsOpen']) ? $parse(attrs[prefix + 'IsOpen']) : false;
            var contentParse = options.useContentExp ? $parse(attrs[ttType]) : false;
            var observers = [];
            var lastPlacement;

            var positionTooltip = function() {
              // check if tooltip exists and is not empty
              if (!tooltip || !tooltip.html()) { return; }

              if (!positionTimeout) {
                positionTimeout = $timeout(function() {
                  var ttPosition = $position.positionElements(element, tooltip, ttScope.placement, appendToBody);
                  var initialHeight = angular.isDefined(tooltip.offsetHeight) ? tooltip.offsetHeight : tooltip.prop('offsetHeight');
                  var elementPos = appendToBody ? $position.offset(element) : $position.position(element);
                  tooltip.css({ top: ttPosition.top + 'px', left: ttPosition.left + 'px' });
                  var placementClasses = ttPosition.placement.split('-');

                  if (!tooltip.hasClass(placementClasses[0])) {
                    tooltip.removeClass(lastPlacement.split('-')[0]);
                    tooltip.addClass(placementClasses[0]);
                  }

                  if (!tooltip.hasClass(options.placementClassPrefix + ttPosition.placement)) {
                    tooltip.removeClass(options.placementClassPrefix + lastPlacement);
                    tooltip.addClass(options.placementClassPrefix + ttPosition.placement);
                  }

                  $timeout(function() {
                    var currentHeight = angular.isDefined(tooltip.offsetHeight) ? tooltip.offsetHeight : tooltip.prop('offsetHeight');
                    var adjustment = $position.adjustTop(placementClasses, elementPos, initialHeight, currentHeight);
                    if (adjustment) {
                      tooltip.css(adjustment);
                    }
                  }, 0, false);

                  // first time through tt element will have the
                  // uib-position-measure class or if the placement
                  // has changed we need to position the arrow.
                  if (tooltip.hasClass('uib-position-measure')) {
                    $position.positionArrow(tooltip, ttPosition.placement);
                    tooltip.removeClass('uib-position-measure');
                  } else if (lastPlacement !== ttPosition.placement) {
                    $position.positionArrow(tooltip, ttPosition.placement);
                  }
                  lastPlacement = ttPosition.placement;

                  positionTimeout = null;
                }, 0, false);
              }
            };

            // Set up the correct scope to allow transclusion later
            ttScope.origScope = scope;

            // By default, the tooltip is not open.
            // TODO add ability to start tooltip opened
            ttScope.isOpen = false;

            function toggleTooltipBind() {
              if (!ttScope.isOpen) {
                showTooltipBind();
              } else {
                hideTooltipBind();
              }
            }

            // Show the tooltip with delay if specified, otherwise show it immediately
            function showTooltipBind() {
              if (hasEnableExp && !scope.$eval(attrs[prefix + 'Enable'])) {
                return;
              }

              cancelHide();
              prepareTooltip();

              if (ttScope.popupDelay) {
                // Do nothing if the tooltip was already scheduled to pop-up.
                // This happens if show is triggered multiple times before any hide is triggered.
                if (!showTimeout) {
                  showTimeout = $timeout(show, ttScope.popupDelay, false);
                }
              } else {
                show();
              }
            }

            function hideTooltipBind() {
              cancelShow();

              if (ttScope.popupCloseDelay) {
                if (!hideTimeout) {
                  hideTimeout = $timeout(hide, ttScope.popupCloseDelay, false);
                }
              } else {
                hide();
              }
            }

            // Show the tooltip popup element.
            function show() {
              cancelShow();
              cancelHide();

              // Don't show empty tooltips.
              if (!ttScope.content) {
                return angular.noop;
              }

              createTooltip();

              // And show the tooltip.
              ttScope.$evalAsync(function() {
                ttScope.isOpen = true;
                assignIsOpen(true);
                positionTooltip();
              });
            }

            function cancelShow() {
              if (showTimeout) {
                $timeout.cancel(showTimeout);
                showTimeout = null;
              }

              if (positionTimeout) {
                $timeout.cancel(positionTimeout);
                positionTimeout = null;
              }
            }

            // Hide the tooltip popup element.
            function hide() {
              if (!ttScope) {
                return;
              }

              // First things first: we don't show it anymore.
              ttScope.$evalAsync(function() {
                if (ttScope) {
                  ttScope.isOpen = false;
                  assignIsOpen(false);
                  // And now we remove it from the DOM. However, if we have animation, we
                  // need to wait for it to expire beforehand.
                  // FIXME: this is a placeholder for a port of the transitions library.
                  // The fade transition in TWBS is 150ms.
                  if (ttScope.animation) {
                    if (!transitionTimeout) {
                      transitionTimeout = $timeout(removeTooltip, 150, false);
                    }
                  } else {
                    removeTooltip();
                  }
                }
              });
            }

            function cancelHide() {
              if (hideTimeout) {
                $timeout.cancel(hideTimeout);
                hideTimeout = null;
              }

              if (transitionTimeout) {
                $timeout.cancel(transitionTimeout);
                transitionTimeout = null;
              }
            }

            function createTooltip() {
              // There can only be one tooltip element per directive shown at once.
              if (tooltip) {
                return;
              }

              tooltipLinkedScope = ttScope.$new();
              tooltip = tooltipLinker(tooltipLinkedScope, function(tooltip) {
                if (appendToBody) {
                  $document.find('body').append(tooltip);
                } else {
                  element.after(tooltip);
                }
              });

              openedTooltips.add(ttScope, {
                close: hide
              });

              prepObservers();
            }

            function removeTooltip() {
              cancelShow();
              cancelHide();
              unregisterObservers();

              if (tooltip) {
                tooltip.remove();
                tooltip = null;
              }

              openedTooltips.remove(ttScope);
              
              if (tooltipLinkedScope) {
                tooltipLinkedScope.$destroy();
                tooltipLinkedScope = null;
              }
            }

            /**
             * Set the initial scope values. Once
             * the tooltip is created, the observers
             * will be added to keep things in sync.
             */
            function prepareTooltip() {
              ttScope.title = attrs[prefix + 'Title'];
              if (contentParse) {
                ttScope.content = contentParse(scope);
              } else {
                ttScope.content = attrs[ttType];
              }

              ttScope.popupClass = attrs[prefix + 'Class'];
              ttScope.placement = angular.isDefined(attrs[prefix + 'Placement']) ? attrs[prefix + 'Placement'] : options.placement;
              var placement = $position.parsePlacement(ttScope.placement);
              lastPlacement = placement[1] ? placement[0] + '-' + placement[1] : placement[0];

              var delay = parseInt(attrs[prefix + 'PopupDelay'], 10);
              var closeDelay = parseInt(attrs[prefix + 'PopupCloseDelay'], 10);
              ttScope.popupDelay = !isNaN(delay) ? delay : options.popupDelay;
              ttScope.popupCloseDelay = !isNaN(closeDelay) ? closeDelay : options.popupCloseDelay;
            }

            function assignIsOpen(isOpen) {
              if (isOpenParse && angular.isFunction(isOpenParse.assign)) {
                isOpenParse.assign(scope, isOpen);
              }
            }

            ttScope.contentExp = function() {
              return ttScope.content;
            };

            /**
             * Observe the relevant attributes.
             */
            attrs.$observe('disabled', function(val) {
              if (val) {
                cancelShow();
              }

              if (val && ttScope.isOpen) {
                hide();
              }
            });

            if (isOpenParse) {
              scope.$watch(isOpenParse, function(val) {
                if (ttScope && !val === ttScope.isOpen) {
                  toggleTooltipBind();
                }
              });
            }

            function prepObservers() {
              observers.length = 0;

              if (contentParse) {
                observers.push(
                  scope.$watch(contentParse, function(val) {
                    ttScope.content = val;
                    if (!val && ttScope.isOpen) {
                      hide();
                    }
                  })
                );

                observers.push(
                  tooltipLinkedScope.$watch(function() {
                    if (!repositionScheduled) {
                      repositionScheduled = true;
                      tooltipLinkedScope.$$postDigest(function() {
                        repositionScheduled = false;
                        if (ttScope && ttScope.isOpen) {
                          positionTooltip();
                        }
                      });
                    }
                  })
                );
              } else {
                observers.push(
                  attrs.$observe(ttType, function(val) {
                    ttScope.content = val;
                    if (!val && ttScope.isOpen) {
                      hide();
                    } else {
                      positionTooltip();
                    }
                  })
                );
              }

              observers.push(
                attrs.$observe(prefix + 'Title', function(val) {
                  ttScope.title = val;
                  if (ttScope.isOpen) {
                    positionTooltip();
                  }
                })
              );

              observers.push(
                attrs.$observe(prefix + 'Placement', function(val) {
                  ttScope.placement = val ? val : options.placement;
                  if (ttScope.isOpen) {
                    positionTooltip();
                  }
                })
              );
            }

            function unregisterObservers() {
              if (observers.length) {
                angular.forEach(observers, function(observer) {
                  observer();
                });
                observers.length = 0;
              }
            }

            // hide tooltips/popovers for outsideClick trigger
            function bodyHideTooltipBind(e) {
              if (!ttScope || !ttScope.isOpen || !tooltip) {
                return;
              }
              // make sure the tooltip/popover link or tool tooltip/popover itself were not clicked
              if (!element[0].contains(e.target) && !tooltip[0].contains(e.target)) {
                hideTooltipBind();
              }
            }

            var unregisterTriggers = function() {
              triggers.show.forEach(function(trigger) {
                if (trigger === 'outsideClick') {
                  element.off('click', toggleTooltipBind);
                } else {
                  element.off(trigger, showTooltipBind);
                  element.off(trigger, toggleTooltipBind);
                }
              });
              triggers.hide.forEach(function(trigger) {
                if (trigger === 'outsideClick') {
                  $document.off('click', bodyHideTooltipBind);
                } else {
                  element.off(trigger, hideTooltipBind);
                }
              });
            };

            function prepTriggers() {
              var showTriggers = [], hideTriggers = [];
              var val = scope.$eval(attrs[prefix + 'Trigger']);
              unregisterTriggers();

              if (angular.isObject(val)) {
                Object.keys(val).forEach(function(key) {
                  showTriggers.push(key);
                  hideTriggers.push(val[key]);
                });
                triggers = {
                  show: showTriggers,
                  hide: hideTriggers
                };
              } else {
                triggers = getTriggers(val);
              }

              if (triggers.show !== 'none') {
                triggers.show.forEach(function(trigger, idx) {
                  if (trigger === 'outsideClick') {
                    element.on('click', toggleTooltipBind);
                    $document.on('click', bodyHideTooltipBind);
                  } else if (trigger === triggers.hide[idx]) {
                    element.on(trigger, toggleTooltipBind);
                  } else if (trigger) {
                    element.on(trigger, showTooltipBind);
                    element.on(triggers.hide[idx], hideTooltipBind);
                  }

                  element.on('keypress', function(e) {
                    if (e.which === 27) {
                      hideTooltipBind();
                    }
                  });
                });
              }
            }

            prepTriggers();

            var animation = scope.$eval(attrs[prefix + 'Animation']);
            ttScope.animation = angular.isDefined(animation) ? !!animation : options.animation;

            var appendToBodyVal;
            var appendKey = prefix + 'AppendToBody';
            if (appendKey in attrs && attrs[appendKey] === undefined) {
              appendToBodyVal = true;
            } else {
              appendToBodyVal = scope.$eval(attrs[appendKey]);
            }

            appendToBody = angular.isDefined(appendToBodyVal) ? appendToBodyVal : appendToBody;

            // Make sure tooltip is destroyed and removed.
            scope.$on('$destroy', function onDestroyTooltip() {
              unregisterTriggers();
              removeTooltip();
              ttScope = null;
            });
          };
        }
      };
    };
  }];
})

// This is mostly ngInclude code but with a custom scope
.directive('uibTooltipTemplateTransclude', [
         '$animate', '$sce', '$compile', '$templateRequest',
function ($animate, $sce, $compile, $templateRequest) {
  return {
    link: function(scope, elem, attrs) {
      var origScope = scope.$eval(attrs.tooltipTemplateTranscludeScope);

      var changeCounter = 0,
        currentScope,
        previousElement,
        currentElement;

      var cleanupLastIncludeContent = function() {
        if (previousElement) {
          previousElement.remove();
          previousElement = null;
        }

        if (currentScope) {
          currentScope.$destroy();
          currentScope = null;
        }

        if (currentElement) {
          $animate.leave(currentElement).then(function() {
            previousElement = null;
          });
          previousElement = currentElement;
          currentElement = null;
        }
      };

      scope.$watch($sce.parseAsResourceUrl(attrs.uibTooltipTemplateTransclude), function(src) {
        var thisChangeId = ++changeCounter;

        if (src) {
          //set the 2nd param to true to ignore the template request error so that the inner
          //contents and scope can be cleaned up.
          $templateRequest(src, true).then(function(response) {
            if (thisChangeId !== changeCounter) { return; }
            var newScope = origScope.$new();
            var template = response;

            var clone = $compile(template)(newScope, function(clone) {
              cleanupLastIncludeContent();
              $animate.enter(clone, elem);
            });

            currentScope = newScope;
            currentElement = clone;

            currentScope.$emit('$includeContentLoaded', src);
          }, function() {
            if (thisChangeId === changeCounter) {
              cleanupLastIncludeContent();
              scope.$emit('$includeContentError', src);
            }
          });
          scope.$emit('$includeContentRequested', src);
        } else {
          cleanupLastIncludeContent();
        }
      });

      scope.$on('$destroy', cleanupLastIncludeContent);
    }
  };
}])

/**
 * Note that it's intentional that these classes are *not* applied through $animate.
 * They must not be animated as they're expected to be present on the tooltip on
 * initialization.
 */
.directive('uibTooltipClasses', ['$uibPosition', function($uibPosition) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      // need to set the primary position so the
      // arrow has space during position measure.
      // tooltip.positionTooltip()
      if (scope.placement) {
        // // There are no top-left etc... classes
        // // in TWBS, so we need the primary position.
        var position = $uibPosition.parsePlacement(scope.placement);
        element.addClass(position[0]);
      }

      if (scope.popupClass) {
        element.addClass(scope.popupClass);
      }

      if (scope.animation) {
        element.addClass(attrs.tooltipAnimationClass);
      }
    }
  };
}])

.directive('uibTooltipPopup', function() {
  return {
    restrict: 'A',
    scope: { content: '@' },
    templateUrl: 'uib/template/tooltip/tooltip-popup.html'
  };
})

.directive('uibTooltip', [ '$uibTooltip', function($uibTooltip) {
  return $uibTooltip('uibTooltip', 'tooltip', 'mouseenter');
}])

.directive('uibTooltipTemplatePopup', function() {
  return {
    restrict: 'A',
    scope: { contentExp: '&', originScope: '&' },
    templateUrl: 'uib/template/tooltip/tooltip-template-popup.html'
  };
})

.directive('uibTooltipTemplate', ['$uibTooltip', function($uibTooltip) {
  return $uibTooltip('uibTooltipTemplate', 'tooltip', 'mouseenter', {
    useContentExp: true
  });
}])

.directive('uibTooltipHtmlPopup', function() {
  return {
    restrict: 'A',
    scope: { contentExp: '&' },
    templateUrl: 'uib/template/tooltip/tooltip-html-popup.html'
  };
})

.directive('uibTooltipHtml', ['$uibTooltip', function($uibTooltip) {
  return $uibTooltip('uibTooltipHtml', 'tooltip', 'mouseenter', {
    useContentExp: true
  });
}]);

/**
 * The following features are still outstanding: popup delay, animation as a
 * function, placement as a function, inside, support for more triggers than
 * just mouse enter/leave, and selector delegatation.
 */
angular.module('ui.bootstrap.popover', ['ui.bootstrap.tooltip'])

.directive('uibPopoverTemplatePopup', function() {
  return {
    restrict: 'A',
    scope: { uibTitle: '@', contentExp: '&', originScope: '&' },
    templateUrl: 'uib/template/popover/popover-template.html'
  };
})

.directive('uibPopoverTemplate', ['$uibTooltip', function($uibTooltip) {
  return $uibTooltip('uibPopoverTemplate', 'popover', 'click', {
    useContentExp: true
  });
}])

.directive('uibPopoverHtmlPopup', function() {
  return {
    restrict: 'A',
    scope: { contentExp: '&', uibTitle: '@' },
    templateUrl: 'uib/template/popover/popover-html.html'
  };
})

.directive('uibPopoverHtml', ['$uibTooltip', function($uibTooltip) {
  return $uibTooltip('uibPopoverHtml', 'popover', 'click', {
    useContentExp: true
  });
}])

.directive('uibPopoverPopup', function() {
  return {
    restrict: 'A',
    scope: { uibTitle: '@', content: '@' },
    templateUrl: 'uib/template/popover/popover.html'
  };
})

.directive('uibPopover', ['$uibTooltip', function($uibTooltip) {
  return $uibTooltip('uibPopover', 'popover', 'click');
}]);

angular.module('ui.bootstrap.progressbar', [])

.constant('uibProgressConfig', {
  animate: true,
  max: 100
})

.controller('UibProgressController', ['$scope', '$attrs', 'uibProgressConfig', function($scope, $attrs, progressConfig) {
  var self = this,
      animate = angular.isDefined($attrs.animate) ? $scope.$parent.$eval($attrs.animate) : progressConfig.animate;

  this.bars = [];
  $scope.max = getMaxOrDefault();

  this.addBar = function(bar, element, attrs) {
    if (!animate) {
      element.css({'transition': 'none'});
    }

    this.bars.push(bar);

    bar.max = getMaxOrDefault();
    bar.title = attrs && angular.isDefined(attrs.title) ? attrs.title : 'progressbar';

    bar.$watch('value', function(value) {
      bar.recalculatePercentage();
    });

    bar.recalculatePercentage = function() {
      var totalPercentage = self.bars.reduce(function(total, bar) {
        bar.percent = +(100 * bar.value / bar.max).toFixed(2);
        return total + bar.percent;
      }, 0);

      if (totalPercentage > 100) {
        bar.percent -= totalPercentage - 100;
      }
    };

    bar.$on('$destroy', function() {
      element = null;
      self.removeBar(bar);
    });
  };

  this.removeBar = function(bar) {
    this.bars.splice(this.bars.indexOf(bar), 1);
    this.bars.forEach(function (bar) {
      bar.recalculatePercentage();
    });
  };

  //$attrs.$observe('maxParam', function(maxParam) {
  $scope.$watch('maxParam', function(maxParam) {
    self.bars.forEach(function(bar) {
      bar.max = getMaxOrDefault();
      bar.recalculatePercentage();
    });
  });

  function getMaxOrDefault () {
    return angular.isDefined($scope.maxParam) ? $scope.maxParam : progressConfig.max;
  }
}])

.directive('uibProgress', function() {
  return {
    replace: true,
    transclude: true,
    controller: 'UibProgressController',
    require: 'uibProgress',
    scope: {
      maxParam: '=?max'
    },
    templateUrl: 'uib/template/progressbar/progress.html'
  };
})

.directive('uibBar', function() {
  return {
    replace: true,
    transclude: true,
    require: '^uibProgress',
    scope: {
      value: '=',
      type: '@'
    },
    templateUrl: 'uib/template/progressbar/bar.html',
    link: function(scope, element, attrs, progressCtrl) {
      progressCtrl.addBar(scope, element, attrs);
    }
  };
})

.directive('uibProgressbar', function() {
  return {
    replace: true,
    transclude: true,
    controller: 'UibProgressController',
    scope: {
      value: '=',
      maxParam: '=?max',
      type: '@'
    },
    templateUrl: 'uib/template/progressbar/progressbar.html',
    link: function(scope, element, attrs, progressCtrl) {
      progressCtrl.addBar(scope, angular.element(element.children()[0]), {title: attrs.title});
    }
  };
});

angular.module('ui.bootstrap.rating', [])

.constant('uibRatingConfig', {
  max: 5,
  stateOn: null,
  stateOff: null,
  enableReset: true,
  titles: ['one', 'two', 'three', 'four', 'five']
})

.controller('UibRatingController', ['$scope', '$attrs', 'uibRatingConfig', function($scope, $attrs, ratingConfig) {
  var ngModelCtrl = { $setViewValue: angular.noop },
    self = this;

  this.init = function(ngModelCtrl_) {
    ngModelCtrl = ngModelCtrl_;
    ngModelCtrl.$render = this.render;

    ngModelCtrl.$formatters.push(function(value) {
      if (angular.isNumber(value) && value << 0 !== value) {
        value = Math.round(value);
      }

      return value;
    });

    this.stateOn = angular.isDefined($attrs.stateOn) ? $scope.$parent.$eval($attrs.stateOn) : ratingConfig.stateOn;
    this.stateOff = angular.isDefined($attrs.stateOff) ? $scope.$parent.$eval($attrs.stateOff) : ratingConfig.stateOff;
    this.enableReset = angular.isDefined($attrs.enableReset) ?
      $scope.$parent.$eval($attrs.enableReset) : ratingConfig.enableReset;
    var tmpTitles = angular.isDefined($attrs.titles) ? $scope.$parent.$eval($attrs.titles) : ratingConfig.titles;
    this.titles = angular.isArray(tmpTitles) && tmpTitles.length > 0 ?
      tmpTitles : ratingConfig.titles;

    var ratingStates = angular.isDefined($attrs.ratingStates) ?
      $scope.$parent.$eval($attrs.ratingStates) :
      new Array(angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : ratingConfig.max);
    $scope.range = this.buildTemplateObjects(ratingStates);
  };

  this.buildTemplateObjects = function(states) {
    for (var i = 0, n = states.length; i < n; i++) {
      states[i] = angular.extend({ index: i }, { stateOn: this.stateOn, stateOff: this.stateOff, title: this.getTitle(i) }, states[i]);
    }
    return states;
  };

  this.getTitle = function(index) {
    if (index >= this.titles.length) {
      return index + 1;
    }

    return this.titles[index];
  };

  $scope.rate = function(value) {
    if (!$scope.readonly && value >= 0 && value <= $scope.range.length) {
      var newViewValue = self.enableReset && ngModelCtrl.$viewValue === value ? 0 : value;
      ngModelCtrl.$setViewValue(newViewValue);
      ngModelCtrl.$render();
    }
  };

  $scope.enter = function(value) {
    if (!$scope.readonly) {
      $scope.value = value;
    }
    $scope.onHover({value: value});
  };

  $scope.reset = function() {
    $scope.value = ngModelCtrl.$viewValue;
    $scope.onLeave();
  };

  $scope.onKeydown = function(evt) {
    if (/(37|38|39|40)/.test(evt.which)) {
      evt.preventDefault();
      evt.stopPropagation();
      $scope.rate($scope.value + (evt.which === 38 || evt.which === 39 ? 1 : -1));
    }
  };

  this.render = function() {
    $scope.value = ngModelCtrl.$viewValue;
    $scope.title = self.getTitle($scope.value - 1);
  };
}])

.directive('uibRating', function() {
  return {
    require: ['uibRating', 'ngModel'],
    restrict: 'A',
    scope: {
      readonly: '=?readOnly',
      onHover: '&',
      onLeave: '&'
    },
    controller: 'UibRatingController',
    templateUrl: 'uib/template/rating/rating.html',
    link: function(scope, element, attrs, ctrls) {
      var ratingCtrl = ctrls[0], ngModelCtrl = ctrls[1];
      ratingCtrl.init(ngModelCtrl);
    }
  };
});

angular.module('ui.bootstrap.tabs', [])

.controller('UibTabsetController', ['$scope', function ($scope) {
  var ctrl = this,
    oldIndex;
  ctrl.tabs = [];

  ctrl.select = function(index, evt) {
    if (!destroyed) {
      var previousIndex = findTabIndex(oldIndex);
      var previousSelected = ctrl.tabs[previousIndex];
      if (previousSelected) {
        previousSelected.tab.onDeselect({
          $event: evt,
          $selectedIndex: index
        });
        if (evt && evt.isDefaultPrevented()) {
          return;
        }
        previousSelected.tab.active = false;
      }

      var selected = ctrl.tabs[index];
      if (selected) {
        selected.tab.onSelect({
          $event: evt
        });
        selected.tab.active = true;
        ctrl.active = selected.index;
        oldIndex = selected.index;
      } else if (!selected && angular.isDefined(oldIndex)) {
        ctrl.active = null;
        oldIndex = null;
      }
    }
  };

  ctrl.addTab = function addTab(tab) {
    ctrl.tabs.push({
      tab: tab,
      index: tab.index
    });
    ctrl.tabs.sort(function(t1, t2) {
      if (t1.index > t2.index) {
        return 1;
      }

      if (t1.index < t2.index) {
        return -1;
      }

      return 0;
    });

    if (tab.index === ctrl.active || !angular.isDefined(ctrl.active) && ctrl.tabs.length === 1) {
      var newActiveIndex = findTabIndex(tab.index);
      ctrl.select(newActiveIndex);
    }
  };

  ctrl.removeTab = function removeTab(tab) {
    var index;
    for (var i = 0; i < ctrl.tabs.length; i++) {
      if (ctrl.tabs[i].tab === tab) {
        index = i;
        break;
      }
    }

    if (ctrl.tabs[index].index === ctrl.active) {
      var newActiveTabIndex = index === ctrl.tabs.length - 1 ?
        index - 1 : index + 1 % ctrl.tabs.length;
      ctrl.select(newActiveTabIndex);
    }

    ctrl.tabs.splice(index, 1);
  };

  $scope.$watch('tabset.active', function(val) {
    if (angular.isDefined(val) && val !== oldIndex) {
      ctrl.select(findTabIndex(val));
    }
  });

  var destroyed;
  $scope.$on('$destroy', function() {
    destroyed = true;
  });

  function findTabIndex(index) {
    for (var i = 0; i < ctrl.tabs.length; i++) {
      if (ctrl.tabs[i].index === index) {
        return i;
      }
    }
  }
}])

.directive('uibTabset', function() {
  return {
    transclude: true,
    replace: true,
    scope: {},
    bindToController: {
      active: '=?',
      type: '@'
    },
    controller: 'UibTabsetController',
    controllerAs: 'tabset',
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/tabs/tabset.html';
    },
    link: function(scope, element, attrs) {
      scope.vertical = angular.isDefined(attrs.vertical) ?
        scope.$parent.$eval(attrs.vertical) : false;
      scope.justified = angular.isDefined(attrs.justified) ?
        scope.$parent.$eval(attrs.justified) : false;
    }
  };
})

.directive('uibTab', ['$parse', function($parse) {
  return {
    require: '^uibTabset',
    replace: true,
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'uib/template/tabs/tab.html';
    },
    transclude: true,
    scope: {
      heading: '@',
      index: '=?',
      classes: '@?',
      onSelect: '&select', //This callback is called in contentHeadingTransclude
                          //once it inserts the tab's content into the dom
      onDeselect: '&deselect'
    },
    controller: function() {
      //Empty controller so other directives can require being 'under' a tab
    },
    controllerAs: 'tab',
    link: function(scope, elm, attrs, tabsetCtrl, transclude) {
      scope.disabled = false;
      if (attrs.disable) {
        scope.$parent.$watch($parse(attrs.disable), function(value) {
          scope.disabled = !! value;
        });
      }

      if (angular.isUndefined(attrs.index)) {
        if (tabsetCtrl.tabs && tabsetCtrl.tabs.length) {
          scope.index = Math.max.apply(null, tabsetCtrl.tabs.map(function(t) { return t.index; })) + 1;
        } else {
          scope.index = 0;
        }
      }

      if (angular.isUndefined(attrs.classes)) {
        scope.classes = '';
      }

      scope.select = function(evt) {
        if (!scope.disabled) {
          var index;
          for (var i = 0; i < tabsetCtrl.tabs.length; i++) {
            if (tabsetCtrl.tabs[i].tab === scope) {
              index = i;
              break;
            }
          }

          tabsetCtrl.select(index, evt);
        }
      };

      tabsetCtrl.addTab(scope);
      scope.$on('$destroy', function() {
        tabsetCtrl.removeTab(scope);
      });

      //We need to transclude later, once the content container is ready.
      //when this link happens, we're inside a tab heading.
      scope.$transcludeFn = transclude;
    }
  };
}])

.directive('uibTabHeadingTransclude', function() {
  return {
    restrict: 'A',
    require: '^uibTab',
    link: function(scope, elm) {
      scope.$watch('headingElement', function updateHeadingElement(heading) {
        if (heading) {
          elm.html('');
          elm.append(heading);
        }
      });
    }
  };
})

.directive('uibTabContentTransclude', function() {
  return {
    restrict: 'A',
    require: '^uibTabset',
    link: function(scope, elm, attrs) {
      var tab = scope.$eval(attrs.uibTabContentTransclude).tab;

      //Now our tab is ready to be transcluded: both the tab heading area
      //and the tab content area are loaded.  Transclude 'em both.
      tab.$transcludeFn(tab.$parent, function(contents) {
        angular.forEach(contents, function(node) {
          if (isTabHeading(node)) {
            //Let tabHeadingTransclude know.
            tab.headingElement = node;
          } else {
            elm.append(node);
          }
        });
      });
    }
  };

  function isTabHeading(node) {
    return node.tagName && (
      node.hasAttribute('uib-tab-heading') ||
      node.hasAttribute('data-uib-tab-heading') ||
      node.hasAttribute('x-uib-tab-heading') ||
      node.tagName.toLowerCase() === 'uib-tab-heading' ||
      node.tagName.toLowerCase() === 'data-uib-tab-heading' ||
      node.tagName.toLowerCase() === 'x-uib-tab-heading' ||
      node.tagName.toLowerCase() === 'uib:tab-heading'
    );
  }
});

angular.module('ui.bootstrap.timepicker', [])

.constant('uibTimepickerConfig', {
  hourStep: 1,
  minuteStep: 1,
  secondStep: 1,
  showMeridian: true,
  showSeconds: false,
  meridians: null,
  readonlyInput: false,
  mousewheel: true,
  arrowkeys: true,
  showSpinners: true,
  templateUrl: 'uib/template/timepicker/timepicker.html'
})

.controller('UibTimepickerController', ['$scope', '$element', '$attrs', '$parse', '$log', '$locale', 'uibTimepickerConfig', function($scope, $element, $attrs, $parse, $log, $locale, timepickerConfig) {
  var selected = new Date(),
    watchers = [],
    ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
    meridians = angular.isDefined($attrs.meridians) ? $scope.$parent.$eval($attrs.meridians) : timepickerConfig.meridians || $locale.DATETIME_FORMATS.AMPMS,
    padHours = angular.isDefined($attrs.padHours) ? $scope.$parent.$eval($attrs.padHours) : true;

  $scope.tabindex = angular.isDefined($attrs.tabindex) ? $attrs.tabindex : 0;
  $element.removeAttr('tabindex');

  this.init = function(ngModelCtrl_, inputs) {
    ngModelCtrl = ngModelCtrl_;
    ngModelCtrl.$render = this.render;

    ngModelCtrl.$formatters.unshift(function(modelValue) {
      return modelValue ? new Date(modelValue) : null;
    });

    var hoursInputEl = inputs.eq(0),
        minutesInputEl = inputs.eq(1),
        secondsInputEl = inputs.eq(2);

    var mousewheel = angular.isDefined($attrs.mousewheel) ? $scope.$parent.$eval($attrs.mousewheel) : timepickerConfig.mousewheel;

    if (mousewheel) {
      this.setupMousewheelEvents(hoursInputEl, minutesInputEl, secondsInputEl);
    }

    var arrowkeys = angular.isDefined($attrs.arrowkeys) ? $scope.$parent.$eval($attrs.arrowkeys) : timepickerConfig.arrowkeys;
    if (arrowkeys) {
      this.setupArrowkeyEvents(hoursInputEl, minutesInputEl, secondsInputEl);
    }

    $scope.readonlyInput = angular.isDefined($attrs.readonlyInput) ? $scope.$parent.$eval($attrs.readonlyInput) : timepickerConfig.readonlyInput;
    this.setupInputEvents(hoursInputEl, minutesInputEl, secondsInputEl);
  };

  var hourStep = timepickerConfig.hourStep;
  if ($attrs.hourStep) {
    watchers.push($scope.$parent.$watch($parse($attrs.hourStep), function(value) {
      hourStep = +value;
    }));
  }

  var minuteStep = timepickerConfig.minuteStep;
  if ($attrs.minuteStep) {
    watchers.push($scope.$parent.$watch($parse($attrs.minuteStep), function(value) {
      minuteStep = +value;
    }));
  }

  var min;
  watchers.push($scope.$parent.$watch($parse($attrs.min), function(value) {
    var dt = new Date(value);
    min = isNaN(dt) ? undefined : dt;
  }));

  var max;
  watchers.push($scope.$parent.$watch($parse($attrs.max), function(value) {
    var dt = new Date(value);
    max = isNaN(dt) ? undefined : dt;
  }));

  var disabled = false;
  if ($attrs.ngDisabled) {
    watchers.push($scope.$parent.$watch($parse($attrs.ngDisabled), function(value) {
      disabled = value;
    }));
  }

  $scope.noIncrementHours = function() {
    var incrementedSelected = addMinutes(selected, hourStep * 60);
    return disabled || incrementedSelected > max ||
      incrementedSelected < selected && incrementedSelected < min;
  };

  $scope.noDecrementHours = function() {
    var decrementedSelected = addMinutes(selected, -hourStep * 60);
    return disabled || decrementedSelected < min ||
      decrementedSelected > selected && decrementedSelected > max;
  };

  $scope.noIncrementMinutes = function() {
    var incrementedSelected = addMinutes(selected, minuteStep);
    return disabled || incrementedSelected > max ||
      incrementedSelected < selected && incrementedSelected < min;
  };

  $scope.noDecrementMinutes = function() {
    var decrementedSelected = addMinutes(selected, -minuteStep);
    return disabled || decrementedSelected < min ||
      decrementedSelected > selected && decrementedSelected > max;
  };

  $scope.noIncrementSeconds = function() {
    var incrementedSelected = addSeconds(selected, secondStep);
    return disabled || incrementedSelected > max ||
      incrementedSelected < selected && incrementedSelected < min;
  };

  $scope.noDecrementSeconds = function() {
    var decrementedSelected = addSeconds(selected, -secondStep);
    return disabled || decrementedSelected < min ||
      decrementedSelected > selected && decrementedSelected > max;
  };

  $scope.noToggleMeridian = function() {
    if (selected.getHours() < 12) {
      return disabled || addMinutes(selected, 12 * 60) > max;
    }

    return disabled || addMinutes(selected, -12 * 60) < min;
  };

  var secondStep = timepickerConfig.secondStep;
  if ($attrs.secondStep) {
    watchers.push($scope.$parent.$watch($parse($attrs.secondStep), function(value) {
      secondStep = +value;
    }));
  }

  $scope.showSeconds = timepickerConfig.showSeconds;
  if ($attrs.showSeconds) {
    watchers.push($scope.$parent.$watch($parse($attrs.showSeconds), function(value) {
      $scope.showSeconds = !!value;
    }));
  }

  // 12H / 24H mode
  $scope.showMeridian = timepickerConfig.showMeridian;
  if ($attrs.showMeridian) {
    watchers.push($scope.$parent.$watch($parse($attrs.showMeridian), function(value) {
      $scope.showMeridian = !!value;

      if (ngModelCtrl.$error.time) {
        // Evaluate from template
        var hours = getHoursFromTemplate(), minutes = getMinutesFromTemplate();
        if (angular.isDefined(hours) && angular.isDefined(minutes)) {
          selected.setHours(hours);
          refresh();
        }
      } else {
        updateTemplate();
      }
    }));
  }

  // Get $scope.hours in 24H mode if valid
  function getHoursFromTemplate() {
    var hours = +$scope.hours;
    var valid = $scope.showMeridian ? hours > 0 && hours < 13 :
      hours >= 0 && hours < 24;
    if (!valid || $scope.hours === '') {
      return undefined;
    }

    if ($scope.showMeridian) {
      if (hours === 12) {
        hours = 0;
      }
      if ($scope.meridian === meridians[1]) {
        hours = hours + 12;
      }
    }
    return hours;
  }

  function getMinutesFromTemplate() {
    var minutes = +$scope.minutes;
    var valid = minutes >= 0 && minutes < 60;
    if (!valid || $scope.minutes === '') {
      return undefined;
    }
    return minutes;
  }

  function getSecondsFromTemplate() {
    var seconds = +$scope.seconds;
    return seconds >= 0 && seconds < 60 ? seconds : undefined;
  }

  function pad(value, noPad) {
    if (value === null) {
      return '';
    }

    return angular.isDefined(value) && value.toString().length < 2 && !noPad ?
      '0' + value : value.toString();
  }

  // Respond on mousewheel spin
  this.setupMousewheelEvents = function(hoursInputEl, minutesInputEl, secondsInputEl) {
    var isScrollingUp = function(e) {
      if (e.originalEvent) {
        e = e.originalEvent;
      }
      //pick correct delta variable depending on event
      var delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;
      return e.detail || delta > 0;
    };

    hoursInputEl.bind('mousewheel wheel', function(e) {
      if (!disabled) {
        $scope.$apply(isScrollingUp(e) ? $scope.incrementHours() : $scope.decrementHours());
      }
      e.preventDefault();
    });

    minutesInputEl.bind('mousewheel wheel', function(e) {
      if (!disabled) {
        $scope.$apply(isScrollingUp(e) ? $scope.incrementMinutes() : $scope.decrementMinutes());
      }
      e.preventDefault();
    });

     secondsInputEl.bind('mousewheel wheel', function(e) {
      if (!disabled) {
        $scope.$apply(isScrollingUp(e) ? $scope.incrementSeconds() : $scope.decrementSeconds());
      }
      e.preventDefault();
    });
  };

  // Respond on up/down arrowkeys
  this.setupArrowkeyEvents = function(hoursInputEl, minutesInputEl, secondsInputEl) {
    hoursInputEl.bind('keydown', function(e) {
      if (!disabled) {
        if (e.which === 38) { // up
          e.preventDefault();
          $scope.incrementHours();
          $scope.$apply();
        } else if (e.which === 40) { // down
          e.preventDefault();
          $scope.decrementHours();
          $scope.$apply();
        }
      }
    });

    minutesInputEl.bind('keydown', function(e) {
      if (!disabled) {
        if (e.which === 38) { // up
          e.preventDefault();
          $scope.incrementMinutes();
          $scope.$apply();
        } else if (e.which === 40) { // down
          e.preventDefault();
          $scope.decrementMinutes();
          $scope.$apply();
        }
      }
    });

    secondsInputEl.bind('keydown', function(e) {
      if (!disabled) {
        if (e.which === 38) { // up
          e.preventDefault();
          $scope.incrementSeconds();
          $scope.$apply();
        } else if (e.which === 40) { // down
          e.preventDefault();
          $scope.decrementSeconds();
          $scope.$apply();
        }
      }
    });
  };

  this.setupInputEvents = function(hoursInputEl, minutesInputEl, secondsInputEl) {
    if ($scope.readonlyInput) {
      $scope.updateHours = angular.noop;
      $scope.updateMinutes = angular.noop;
      $scope.updateSeconds = angular.noop;
      return;
    }

    var invalidate = function(invalidHours, invalidMinutes, invalidSeconds) {
      ngModelCtrl.$setViewValue(null);
      ngModelCtrl.$setValidity('time', false);
      if (angular.isDefined(invalidHours)) {
        $scope.invalidHours = invalidHours;
      }

      if (angular.isDefined(invalidMinutes)) {
        $scope.invalidMinutes = invalidMinutes;
      }

      if (angular.isDefined(invalidSeconds)) {
        $scope.invalidSeconds = invalidSeconds;
      }
    };

    $scope.updateHours = function() {
      var hours = getHoursFromTemplate(),
        minutes = getMinutesFromTemplate();

      ngModelCtrl.$setDirty();

      if (angular.isDefined(hours) && angular.isDefined(minutes)) {
        selected.setHours(hours);
        selected.setMinutes(minutes);
        if (selected < min || selected > max) {
          invalidate(true);
        } else {
          refresh('h');
        }
      } else {
        invalidate(true);
      }
    };

    hoursInputEl.bind('blur', function(e) {
      ngModelCtrl.$setTouched();
      if (modelIsEmpty()) {
        makeValid();
      } else if ($scope.hours === null || $scope.hours === '') {
        invalidate(true);
      } else if (!$scope.invalidHours && $scope.hours < 10) {
        $scope.$apply(function() {
          $scope.hours = pad($scope.hours, !padHours);
        });
      }
    });

    $scope.updateMinutes = function() {
      var minutes = getMinutesFromTemplate(),
        hours = getHoursFromTemplate();

      ngModelCtrl.$setDirty();

      if (angular.isDefined(minutes) && angular.isDefined(hours)) {
        selected.setHours(hours);
        selected.setMinutes(minutes);
        if (selected < min || selected > max) {
          invalidate(undefined, true);
        } else {
          refresh('m');
        }
      } else {
        invalidate(undefined, true);
      }
    };

    minutesInputEl.bind('blur', function(e) {
      ngModelCtrl.$setTouched();
      if (modelIsEmpty()) {
        makeValid();
      } else if ($scope.minutes === null) {
        invalidate(undefined, true);
      } else if (!$scope.invalidMinutes && $scope.minutes < 10) {
        $scope.$apply(function() {
          $scope.minutes = pad($scope.minutes);
        });
      }
    });

    $scope.updateSeconds = function() {
      var seconds = getSecondsFromTemplate();

      ngModelCtrl.$setDirty();

      if (angular.isDefined(seconds)) {
        selected.setSeconds(seconds);
        refresh('s');
      } else {
        invalidate(undefined, undefined, true);
      }
    };

    secondsInputEl.bind('blur', function(e) {
      if (modelIsEmpty()) {
        makeValid();
      } else if (!$scope.invalidSeconds && $scope.seconds < 10) {
        $scope.$apply( function() {
          $scope.seconds = pad($scope.seconds);
        });
      }
    });

  };

  this.render = function() {
    var date = ngModelCtrl.$viewValue;

    if (isNaN(date)) {
      ngModelCtrl.$setValidity('time', false);
      $log.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
    } else {
      if (date) {
        selected = date;
      }

      if (selected < min || selected > max) {
        ngModelCtrl.$setValidity('time', false);
        $scope.invalidHours = true;
        $scope.invalidMinutes = true;
      } else {
        makeValid();
      }
      updateTemplate();
    }
  };

  // Call internally when we know that model is valid.
  function refresh(keyboardChange) {
    makeValid();
    ngModelCtrl.$setViewValue(new Date(selected));
    updateTemplate(keyboardChange);
  }

  function makeValid() {
    ngModelCtrl.$setValidity('time', true);
    $scope.invalidHours = false;
    $scope.invalidMinutes = false;
    $scope.invalidSeconds = false;
  }

  function updateTemplate(keyboardChange) {
    if (!ngModelCtrl.$modelValue) {
      $scope.hours = null;
      $scope.minutes = null;
      $scope.seconds = null;
      $scope.meridian = meridians[0];
    } else {
      var hours = selected.getHours(),
        minutes = selected.getMinutes(),
        seconds = selected.getSeconds();

      if ($scope.showMeridian) {
        hours = hours === 0 || hours === 12 ? 12 : hours % 12; // Convert 24 to 12 hour system
      }

      $scope.hours = keyboardChange === 'h' ? hours : pad(hours, !padHours);
      if (keyboardChange !== 'm') {
        $scope.minutes = pad(minutes);
      }
      $scope.meridian = selected.getHours() < 12 ? meridians[0] : meridians[1];

      if (keyboardChange !== 's') {
        $scope.seconds = pad(seconds);
      }
      $scope.meridian = selected.getHours() < 12 ? meridians[0] : meridians[1];
    }
  }

  function addSecondsToSelected(seconds) {
    selected = addSeconds(selected, seconds);
    refresh();
  }

  function addMinutes(selected, minutes) {
    return addSeconds(selected, minutes*60);
  }

  function addSeconds(date, seconds) {
    var dt = new Date(date.getTime() + seconds * 1000);
    var newDate = new Date(date);
    newDate.setHours(dt.getHours(), dt.getMinutes(), dt.getSeconds());
    return newDate;
  }

  function modelIsEmpty() {
    return ($scope.hours === null || $scope.hours === '') &&
      ($scope.minutes === null || $scope.minutes === '') &&
      (!$scope.showSeconds || $scope.showSeconds && ($scope.seconds === null || $scope.seconds === ''));
  }

  $scope.showSpinners = angular.isDefined($attrs.showSpinners) ?
    $scope.$parent.$eval($attrs.showSpinners) : timepickerConfig.showSpinners;

  $scope.incrementHours = function() {
    if (!$scope.noIncrementHours()) {
      addSecondsToSelected(hourStep * 60 * 60);
    }
  };

  $scope.decrementHours = function() {
    if (!$scope.noDecrementHours()) {
      addSecondsToSelected(-hourStep * 60 * 60);
    }
  };

  $scope.incrementMinutes = function() {
    if (!$scope.noIncrementMinutes()) {
      addSecondsToSelected(minuteStep * 60);
    }
  };

  $scope.decrementMinutes = function() {
    if (!$scope.noDecrementMinutes()) {
      addSecondsToSelected(-minuteStep * 60);
    }
  };

  $scope.incrementSeconds = function() {
    if (!$scope.noIncrementSeconds()) {
      addSecondsToSelected(secondStep);
    }
  };

  $scope.decrementSeconds = function() {
    if (!$scope.noDecrementSeconds()) {
      addSecondsToSelected(-secondStep);
    }
  };

  $scope.toggleMeridian = function() {
    var minutes = getMinutesFromTemplate(),
        hours = getHoursFromTemplate();

    if (!$scope.noToggleMeridian()) {
      if (angular.isDefined(minutes) && angular.isDefined(hours)) {
        addSecondsToSelected(12 * 60 * (selected.getHours() < 12 ? 60 : -60));
      } else {
        $scope.meridian = $scope.meridian === meridians[0] ? meridians[1] : meridians[0];
      }
    }
  };

  $scope.blur = function() {
    ngModelCtrl.$setTouched();
  };

  $scope.$on('$destroy', function() {
    while (watchers.length) {
      watchers.shift()();
    }
  });
}])

.directive('uibTimepicker', ['uibTimepickerConfig', function(uibTimepickerConfig) {
  return {
    require: ['uibTimepicker', '?^ngModel'],
    restrict: 'A',
    controller: 'UibTimepickerController',
    controllerAs: 'timepicker',
    scope: {},
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || uibTimepickerConfig.templateUrl;
    },
    link: function(scope, element, attrs, ctrls) {
      var timepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (ngModelCtrl) {
        timepickerCtrl.init(ngModelCtrl, element.find('input'));
      }
    }
  };
}]);

angular.module('ui.bootstrap.typeahead', ['ui.bootstrap.debounce', 'ui.bootstrap.position'])

/**
 * A helper service that can parse typeahead's syntax (string provided by users)
 * Extracted to a separate service for ease of unit testing
 */
  .factory('uibTypeaheadParser', ['$parse', function($parse) {
    //                      000001111111100000000000002222222200000000000000003333333333333330000000000044444444000
    var TYPEAHEAD_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;
    return {
      parse: function(input) {
        var match = input.match(TYPEAHEAD_REGEXP);
        if (!match) {
          throw new Error(
            'Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_"' +
              ' but got "' + input + '".');
        }

        return {
          itemName: match[3],
          source: $parse(match[4]),
          viewMapper: $parse(match[2] || match[1]),
          modelMapper: $parse(match[1])
        };
      }
    };
  }])

  .controller('UibTypeaheadController', ['$scope', '$element', '$attrs', '$compile', '$parse', '$q', '$timeout', '$document', '$window', '$rootScope', '$$debounce', '$uibPosition', 'uibTypeaheadParser',
    function(originalScope, element, attrs, $compile, $parse, $q, $timeout, $document, $window, $rootScope, $$debounce, $position, typeaheadParser) {
    var HOT_KEYS = [9, 13, 27, 38, 40];
    var eventDebounceTime = 200;
    var modelCtrl, ngModelOptions;
    //SUPPORTED ATTRIBUTES (OPTIONS)

    //minimal no of characters that needs to be entered before typeahead kicks-in
    var minLength = originalScope.$eval(attrs.typeaheadMinLength);
    if (!minLength && minLength !== 0) {
      minLength = 1;
    }

    originalScope.$watch(attrs.typeaheadMinLength, function (newVal) {
        minLength = !newVal && newVal !== 0 ? 1 : newVal;
    });

    //minimal wait time after last character typed before typeahead kicks-in
    var waitTime = originalScope.$eval(attrs.typeaheadWaitMs) || 0;

    //should it restrict model values to the ones selected from the popup only?
    var isEditable = originalScope.$eval(attrs.typeaheadEditable) !== false;
    originalScope.$watch(attrs.typeaheadEditable, function (newVal) {
      isEditable = newVal !== false;
    });

    //binding to a variable that indicates if matches are being retrieved asynchronously
    var isLoadingSetter = $parse(attrs.typeaheadLoading).assign || angular.noop;

    //a function to determine if an event should cause selection
    var isSelectEvent = attrs.typeaheadShouldSelect ? $parse(attrs.typeaheadShouldSelect) : function(scope, vals) {
      var evt = vals.$event;
      return evt.which === 13 || evt.which === 9;
    };

    //a callback executed when a match is selected
    var onSelectCallback = $parse(attrs.typeaheadOnSelect);

    //should it select highlighted popup value when losing focus?
    var isSelectOnBlur = angular.isDefined(attrs.typeaheadSelectOnBlur) ? originalScope.$eval(attrs.typeaheadSelectOnBlur) : false;

    //binding to a variable that indicates if there were no results after the query is completed
    var isNoResultsSetter = $parse(attrs.typeaheadNoResults).assign || angular.noop;

    var inputFormatter = attrs.typeaheadInputFormatter ? $parse(attrs.typeaheadInputFormatter) : undefined;

    var appendToBody = attrs.typeaheadAppendToBody ? originalScope.$eval(attrs.typeaheadAppendToBody) : false;

    var appendTo = attrs.typeaheadAppendTo ?
      originalScope.$eval(attrs.typeaheadAppendTo) : null;

    var focusFirst = originalScope.$eval(attrs.typeaheadFocusFirst) !== false;

    //If input matches an item of the list exactly, select it automatically
    var selectOnExact = attrs.typeaheadSelectOnExact ? originalScope.$eval(attrs.typeaheadSelectOnExact) : false;

    //binding to a variable that indicates if dropdown is open
    var isOpenSetter = $parse(attrs.typeaheadIsOpen).assign || angular.noop;

    var showHint = originalScope.$eval(attrs.typeaheadShowHint) || false;

    //INTERNAL VARIABLES

    //model setter executed upon match selection
    var parsedModel = $parse(attrs.ngModel);
    var invokeModelSetter = $parse(attrs.ngModel + '($$$p)');
    var $setModelValue = function(scope, newValue) {
      if (angular.isFunction(parsedModel(originalScope)) &&
        ngModelOptions && ngModelOptions.$options && ngModelOptions.$options.getterSetter) {
        return invokeModelSetter(scope, {$$$p: newValue});
      }

      return parsedModel.assign(scope, newValue);
    };

    //expressions used by typeahead
    var parserResult = typeaheadParser.parse(attrs.uibTypeahead);

    var hasFocus;

    //Used to avoid bug in iOS webview where iOS keyboard does not fire
    //mousedown & mouseup events
    //Issue #3699
    var selected;

    //create a child scope for the typeahead directive so we are not polluting original scope
    //with typeahead-specific data (matches, query etc.)
    var scope = originalScope.$new();
    var offDestroy = originalScope.$on('$destroy', function() {
      scope.$destroy();
    });
    scope.$on('$destroy', offDestroy);

    // WAI-ARIA
    var popupId = 'typeahead-' + scope.$id + '-' + Math.floor(Math.random() * 10000);
    element.attr({
      'aria-autocomplete': 'list',
      'aria-expanded': false,
      'aria-owns': popupId
    });

    var inputsContainer, hintInputElem;
    //add read-only input to show hint
    if (showHint) {
      inputsContainer = angular.element('<div></div>');
      inputsContainer.css('position', 'relative');
      element.after(inputsContainer);
      hintInputElem = element.clone();
      hintInputElem.attr('placeholder', '');
      hintInputElem.attr('tabindex', '-1');
      hintInputElem.val('');
      hintInputElem.css({
        'position': 'absolute',
        'top': '0px',
        'left': '0px',
        'border-color': 'transparent',
        'box-shadow': 'none',
        'opacity': 1,
        'background': 'none 0% 0% / auto repeat scroll padding-box border-box rgb(255, 255, 255)',
        'color': '#999'
      });
      element.css({
        'position': 'relative',
        'vertical-align': 'top',
        'background-color': 'transparent'
      });

      if (hintInputElem.attr('id')) {
        hintInputElem.removeAttr('id'); // remove duplicate id if present.
      }
      inputsContainer.append(hintInputElem);
      hintInputElem.after(element);
    }

    //pop-up element used to display matches
    var popUpEl = angular.element('<div uib-typeahead-popup></div>');
    popUpEl.attr({
      id: popupId,
      matches: 'matches',
      active: 'activeIdx',
      select: 'select(activeIdx, evt)',
      'move-in-progress': 'moveInProgress',
      query: 'query',
      position: 'position',
      'assign-is-open': 'assignIsOpen(isOpen)',
      debounce: 'debounceUpdate'
    });
    //custom item template
    if (angular.isDefined(attrs.typeaheadTemplateUrl)) {
      popUpEl.attr('template-url', attrs.typeaheadTemplateUrl);
    }

    if (angular.isDefined(attrs.typeaheadPopupTemplateUrl)) {
      popUpEl.attr('popup-template-url', attrs.typeaheadPopupTemplateUrl);
    }

    var resetHint = function() {
      if (showHint) {
        hintInputElem.val('');
      }
    };

    var resetMatches = function() {
      scope.matches = [];
      scope.activeIdx = -1;
      element.attr('aria-expanded', false);
      resetHint();
    };

    var getMatchId = function(index) {
      return popupId + '-option-' + index;
    };

    // Indicate that the specified match is the active (pre-selected) item in the list owned by this typeahead.
    // This attribute is added or removed automatically when the `activeIdx` changes.
    scope.$watch('activeIdx', function(index) {
      if (index < 0) {
        element.removeAttr('aria-activedescendant');
      } else {
        element.attr('aria-activedescendant', getMatchId(index));
      }
    });

    var inputIsExactMatch = function(inputValue, index) {
      if (scope.matches.length > index && inputValue) {
        return inputValue.toUpperCase() === scope.matches[index].label.toUpperCase();
      }

      return false;
    };

    var getMatchesAsync = function(inputValue, evt) {
      var locals = {$viewValue: inputValue};
      isLoadingSetter(originalScope, true);
      isNoResultsSetter(originalScope, false);
      $q.when(parserResult.source(originalScope, locals)).then(function(matches) {
        //it might happen that several async queries were in progress if a user were typing fast
        //but we are interested only in responses that correspond to the current view value
        var onCurrentRequest = inputValue === modelCtrl.$viewValue;
        if (onCurrentRequest && hasFocus) {
          if (matches && matches.length > 0) {
            scope.activeIdx = focusFirst ? 0 : -1;
            isNoResultsSetter(originalScope, false);
            scope.matches.length = 0;

            //transform labels
            for (var i = 0; i < matches.length; i++) {
              locals[parserResult.itemName] = matches[i];
              scope.matches.push({
                id: getMatchId(i),
                label: parserResult.viewMapper(scope, locals),
                model: matches[i]
              });
            }

            scope.query = inputValue;
            //position pop-up with matches - we need to re-calculate its position each time we are opening a window
            //with matches as a pop-up might be absolute-positioned and position of an input might have changed on a page
            //due to other elements being rendered
            recalculatePosition();

            element.attr('aria-expanded', true);

            //Select the single remaining option if user input matches
            if (selectOnExact && scope.matches.length === 1 && inputIsExactMatch(inputValue, 0)) {
              if (angular.isNumber(scope.debounceUpdate) || angular.isObject(scope.debounceUpdate)) {
                $$debounce(function() {
                  scope.select(0, evt);
                }, angular.isNumber(scope.debounceUpdate) ? scope.debounceUpdate : scope.debounceUpdate['default']);
              } else {
                scope.select(0, evt);
              }
            }

            if (showHint) {
              var firstLabel = scope.matches[0].label;
              if (angular.isString(inputValue) &&
                inputValue.length > 0 &&
                firstLabel.slice(0, inputValue.length).toUpperCase() === inputValue.toUpperCase()) {
                hintInputElem.val(inputValue + firstLabel.slice(inputValue.length));
              } else {
                hintInputElem.val('');
              }
            }
          } else {
            resetMatches();
            isNoResultsSetter(originalScope, true);
          }
        }
        if (onCurrentRequest) {
          isLoadingSetter(originalScope, false);
        }
      }, function() {
        resetMatches();
        isLoadingSetter(originalScope, false);
        isNoResultsSetter(originalScope, true);
      });
    };

    // bind events only if appendToBody params exist - performance feature
    if (appendToBody) {
      angular.element($window).on('resize', fireRecalculating);
      $document.find('body').on('scroll', fireRecalculating);
    }

    // Declare the debounced function outside recalculating for
    // proper debouncing
    var debouncedRecalculate = $$debounce(function() {
      // if popup is visible
      if (scope.matches.length) {
        recalculatePosition();
      }

      scope.moveInProgress = false;
    }, eventDebounceTime);

    // Default progress type
    scope.moveInProgress = false;

    function fireRecalculating() {
      if (!scope.moveInProgress) {
        scope.moveInProgress = true;
        scope.$digest();
      }

      debouncedRecalculate();
    }

    // recalculate actual position and set new values to scope
    // after digest loop is popup in right position
    function recalculatePosition() {
      scope.position = appendToBody ? $position.offset(element) : $position.position(element);
      scope.position.top += element.prop('offsetHeight');
    }

    //we need to propagate user's query so we can higlight matches
    scope.query = undefined;

    //Declare the timeout promise var outside the function scope so that stacked calls can be cancelled later
    var timeoutPromise;

    var scheduleSearchWithTimeout = function(inputValue) {
      timeoutPromise = $timeout(function() {
        getMatchesAsync(inputValue);
      }, waitTime);
    };

    var cancelPreviousTimeout = function() {
      if (timeoutPromise) {
        $timeout.cancel(timeoutPromise);
      }
    };

    resetMatches();

    scope.assignIsOpen = function (isOpen) {
      isOpenSetter(originalScope, isOpen);
    };

    scope.select = function(activeIdx, evt) {
      //called from within the $digest() cycle
      var locals = {};
      var model, item;

      selected = true;
      locals[parserResult.itemName] = item = scope.matches[activeIdx].model;
      model = parserResult.modelMapper(originalScope, locals);
      $setModelValue(originalScope, model);
      modelCtrl.$setValidity('editable', true);
      modelCtrl.$setValidity('parse', true);

      onSelectCallback(originalScope, {
        $item: item,
        $model: model,
        $label: parserResult.viewMapper(originalScope, locals),
        $event: evt
      });

      resetMatches();

      //return focus to the input element if a match was selected via a mouse click event
      // use timeout to avoid $rootScope:inprog error
      if (scope.$eval(attrs.typeaheadFocusOnSelect) !== false) {
        $timeout(function() { element[0].focus(); }, 0, false);
      }
    };

    //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(27)
    element.on('keydown', function(evt) {
      //typeahead is open and an "interesting" key was pressed
      if (scope.matches.length === 0 || HOT_KEYS.indexOf(evt.which) === -1) {
        return;
      }

      var shouldSelect = isSelectEvent(originalScope, {$event: evt});

      /**
       * if there's nothing selected (i.e. focusFirst) and enter or tab is hit
       * or
       * shift + tab is pressed to bring focus to the previous element
       * then clear the results
       */
      if (scope.activeIdx === -1 && shouldSelect || evt.which === 9 && !!evt.shiftKey) {
        resetMatches();
        scope.$digest();
        return;
      }

      evt.preventDefault();
      var target;
      switch (evt.which) {
        case 27: // escape
          evt.stopPropagation();

          resetMatches();
          originalScope.$digest();
          break;
        case 38: // up arrow
          scope.activeIdx = (scope.activeIdx > 0 ? scope.activeIdx : scope.matches.length) - 1;
          scope.$digest();
          target = popUpEl[0].querySelectorAll('.uib-typeahead-match')[scope.activeIdx];
          target.parentNode.scrollTop = target.offsetTop;
          break;
        case 40: // down arrow
          scope.activeIdx = (scope.activeIdx + 1) % scope.matches.length;
          scope.$digest();
          target = popUpEl[0].querySelectorAll('.uib-typeahead-match')[scope.activeIdx];
          target.parentNode.scrollTop = target.offsetTop;
          break;
        default:
          if (shouldSelect) {
            scope.$apply(function() {
              if (angular.isNumber(scope.debounceUpdate) || angular.isObject(scope.debounceUpdate)) {
                $$debounce(function() {
                  scope.select(scope.activeIdx, evt);
                }, angular.isNumber(scope.debounceUpdate) ? scope.debounceUpdate : scope.debounceUpdate['default']);
              } else {
                scope.select(scope.activeIdx, evt);
              }
            });
          }
      }
    });

    element.bind('focus', function (evt) {
      hasFocus = true;
      if (minLength === 0 && !modelCtrl.$viewValue) {
        $timeout(function() {
          getMatchesAsync(modelCtrl.$viewValue, evt);
        }, 0);
      }
    });

    element.bind('blur', function(evt) {
      if (isSelectOnBlur && scope.matches.length && scope.activeIdx !== -1 && !selected) {
        selected = true;
        scope.$apply(function() {
          if (angular.isObject(scope.debounceUpdate) && angular.isNumber(scope.debounceUpdate.blur)) {
            $$debounce(function() {
              scope.select(scope.activeIdx, evt);
            }, scope.debounceUpdate.blur);
          } else {
            scope.select(scope.activeIdx, evt);
          }
        });
      }
      if (!isEditable && modelCtrl.$error.editable) {
        modelCtrl.$setViewValue();
        scope.$apply(function() {
          // Reset validity as we are clearing
          modelCtrl.$setValidity('editable', true);
          modelCtrl.$setValidity('parse', true);
        });
        element.val('');
      }
      hasFocus = false;
      selected = false;
    });

    // Keep reference to click handler to unbind it.
    var dismissClickHandler = function(evt) {
      // Issue #3973
      // Firefox treats right click as a click on document
      if (element[0] !== evt.target && evt.which !== 3 && scope.matches.length !== 0) {
        resetMatches();
        if (!$rootScope.$$phase) {
          originalScope.$digest();
        }
      }
    };

    $document.on('click', dismissClickHandler);

    originalScope.$on('$destroy', function() {
      $document.off('click', dismissClickHandler);
      if (appendToBody || appendTo) {
        $popup.remove();
      }

      if (appendToBody) {
        angular.element($window).off('resize', fireRecalculating);
        $document.find('body').off('scroll', fireRecalculating);
      }
      // Prevent jQuery cache memory leak
      popUpEl.remove();

      if (showHint) {
          inputsContainer.remove();
      }
    });

    var $popup = $compile(popUpEl)(scope);

    if (appendToBody) {
      $document.find('body').append($popup);
    } else if (appendTo) {
      angular.element(appendTo).eq(0).append($popup);
    } else {
      element.after($popup);
    }

    this.init = function(_modelCtrl, _ngModelOptions) {
      modelCtrl = _modelCtrl;
      ngModelOptions = _ngModelOptions;

      scope.debounceUpdate = modelCtrl.$options && $parse(modelCtrl.$options.debounce)(originalScope);

      //plug into $parsers pipeline to open a typeahead on view changes initiated from DOM
      //$parsers kick-in on all the changes coming from the view as well as manually triggered by $setViewValue
      modelCtrl.$parsers.unshift(function(inputValue) {
        hasFocus = true;

        if (minLength === 0 || inputValue && inputValue.length >= minLength) {
          if (waitTime > 0) {
            cancelPreviousTimeout();
            scheduleSearchWithTimeout(inputValue);
          } else {
            getMatchesAsync(inputValue);
          }
        } else {
          isLoadingSetter(originalScope, false);
          cancelPreviousTimeout();
          resetMatches();
        }

        if (isEditable) {
          return inputValue;
        }

        if (!inputValue) {
          // Reset in case user had typed something previously.
          modelCtrl.$setValidity('editable', true);
          return null;
        }

        modelCtrl.$setValidity('editable', false);
        return undefined;
      });

      modelCtrl.$formatters.push(function(modelValue) {
        var candidateViewValue, emptyViewValue;
        var locals = {};

        // The validity may be set to false via $parsers (see above) if
        // the model is restricted to selected values. If the model
        // is set manually it is considered to be valid.
        if (!isEditable) {
          modelCtrl.$setValidity('editable', true);
        }

        if (inputFormatter) {
          locals.$model = modelValue;
          return inputFormatter(originalScope, locals);
        }

        //it might happen that we don't have enough info to properly render input value
        //we need to check for this situation and simply return model value if we can't apply custom formatting
        locals[parserResult.itemName] = modelValue;
        candidateViewValue = parserResult.viewMapper(originalScope, locals);
        locals[parserResult.itemName] = undefined;
        emptyViewValue = parserResult.viewMapper(originalScope, locals);

        return candidateViewValue !== emptyViewValue ? candidateViewValue : modelValue;
      });
    };
  }])

  .directive('uibTypeahead', function() {
    return {
      controller: 'UibTypeaheadController',
      require: ['ngModel', '^?ngModelOptions', 'uibTypeahead'],
      link: function(originalScope, element, attrs, ctrls) {
        ctrls[2].init(ctrls[0], ctrls[1]);
      }
    };
  })

  .directive('uibTypeaheadPopup', ['$$debounce', function($$debounce) {
    return {
      scope: {
        matches: '=',
        query: '=',
        active: '=',
        position: '&',
        moveInProgress: '=',
        select: '&',
        assignIsOpen: '&',
        debounce: '&'
      },
      replace: true,
      templateUrl: function(element, attrs) {
        return attrs.popupTemplateUrl || 'uib/template/typeahead/typeahead-popup.html';
      },
      link: function(scope, element, attrs) {
        scope.templateUrl = attrs.templateUrl;

        scope.isOpen = function() {
          var isDropdownOpen = scope.matches.length > 0;
          scope.assignIsOpen({ isOpen: isDropdownOpen });
          return isDropdownOpen;
        };

        scope.isActive = function(matchIdx) {
          return scope.active === matchIdx;
        };

        scope.selectActive = function(matchIdx) {
          scope.active = matchIdx;
        };

        scope.selectMatch = function(activeIdx, evt) {
          var debounce = scope.debounce();
          if (angular.isNumber(debounce) || angular.isObject(debounce)) {
            $$debounce(function() {
              scope.select({activeIdx: activeIdx, evt: evt});
            }, angular.isNumber(debounce) ? debounce : debounce['default']);
          } else {
            scope.select({activeIdx: activeIdx, evt: evt});
          }
        };
      }
    };
  }])

  .directive('uibTypeaheadMatch', ['$templateRequest', '$compile', '$parse', function($templateRequest, $compile, $parse) {
    return {
      scope: {
        index: '=',
        match: '=',
        query: '='
      },
      link: function(scope, element, attrs) {
        var tplUrl = $parse(attrs.templateUrl)(scope.$parent) || 'uib/template/typeahead/typeahead-match.html';
        $templateRequest(tplUrl).then(function(tplContent) {
          var tplEl = angular.element(tplContent.trim());
          element.replaceWith(tplEl);
          $compile(tplEl)(scope);
        });
      }
    };
  }])

  .filter('uibTypeaheadHighlight', ['$sce', '$injector', '$log', function($sce, $injector, $log) {
    var isSanitizePresent;
    isSanitizePresent = $injector.has('$sanitize');

    function escapeRegexp(queryToEscape) {
      // Regex: capture the whole query string and replace it with the string that will be used to match
      // the results, for example if the capture is "a" the result will be \a
      return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    }

    function containsHtml(matchItem) {
      return /<.*>/g.test(matchItem);
    }

    return function(matchItem, query) {
      if (!isSanitizePresent && containsHtml(matchItem)) {
        $log.warn('Unsafe use of typeahead please use ngSanitize'); // Warn the user about the danger
      }
      matchItem = query ? ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem; // Replaces the capture string with a the same string inside of a "strong" tag
      if (!isSanitizePresent) {
        matchItem = $sce.trustAsHtml(matchItem); // If $sanitize is not present we pack the string in a $sce object for the ng-bind-html directive
      }
      return matchItem;
    };
  }]);

angular.module("uib/template/accordion/accordion-group.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/accordion/accordion-group.html",
    "<div role=\"tab\" id=\"{{::headingId}}\" aria-selected=\"{{isOpen}}\" class=\"panel-heading\" ng-keypress=\"toggleOpen($event)\">\n" +
    "  <h4 class=\"panel-title\">\n" +
    "    <a role=\"button\" data-toggle=\"collapse\" href aria-expanded=\"{{isOpen}}\" aria-controls=\"{{::panelId}}\" tabindex=\"0\" class=\"accordion-toggle\" ng-click=\"toggleOpen()\" uib-accordion-transclude=\"heading\" ng-disabled=\"isDisabled\" uib-tabindex-toggle><span uib-accordion-header ng-class=\"{'text-muted': isDisabled}\">{{heading}}</span></a>\n" +
    "  </h4>\n" +
    "</div>\n" +
    "<div id=\"{{::panelId}}\" aria-labelledby=\"{{::headingId}}\" aria-hidden=\"{{!isOpen}}\" role=\"tabpanel\" class=\"panel-collapse collapse\" uib-collapse=\"!isOpen\">\n" +
    "  <div class=\"panel-body\" ng-transclude></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("uib/template/accordion/accordion.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/accordion/accordion.html",
    "<div role=\"tablist\" class=\"panel-group\" ng-transclude></div>");
}]);

angular.module("uib/template/alert/alert.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/alert/alert.html",
    "<button ng-show=\"closeable\" type=\"button\" class=\"close\" ng-click=\"close({$event: $event})\">\n" +
    "  <span aria-hidden=\"true\">&times;</span>\n" +
    "  <span class=\"sr-only\">Close</span>\n" +
    "</button>\n" +
    "<div ng-transclude></div>\n" +
    "");
}]);

angular.module("uib/template/carousel/carousel.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/carousel/carousel.html",
    "<div class=\"carousel-inner\" ng-transclude></div>\n" +
    "<a role=\"button\" href class=\"left carousel-control\" ng-click=\"prev()\" ng-class=\"{ disabled: isPrevDisabled() }\" ng-show=\"slides.length > 1\">\n" +
    "  <span aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-left\"></span>\n" +
    "  <span class=\"sr-only\">previous</span>\n" +
    "</a>\n" +
    "<a role=\"button\" href class=\"right carousel-control\" ng-click=\"next()\" ng-class=\"{ disabled: isNextDisabled() }\" ng-show=\"slides.length > 1\">\n" +
    "  <span aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-right\"></span>\n" +
    "  <span class=\"sr-only\">next</span>\n" +
    "</a>\n" +
    "<ol class=\"carousel-indicators\" ng-show=\"slides.length > 1\">\n" +
    "  <li ng-repeat=\"slide in slides | orderBy:indexOfSlide track by $index\" ng-class=\"{ active: isActive(slide) }\" ng-click=\"select(slide)\">\n" +
    "    <span class=\"sr-only\">slide {{ $index + 1 }} of {{ slides.length }}<span ng-if=\"isActive(slide)\">, currently active</span></span>\n" +
    "  </li>\n" +
    "</ol>\n" +
    "");
}]);

angular.module("uib/template/carousel/slide.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/carousel/slide.html",
    "<div class=\"text-center\" ng-transclude></div>\n" +
    "");
}]);

angular.module("uib/template/datepicker/datepicker.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/datepicker/datepicker.html",
    "<div ng-switch=\"datepickerMode\">\n" +
    "  <div uib-daypicker ng-switch-when=\"day\" tabindex=\"0\" class=\"uib-daypicker\"></div>\n" +
    "  <div uib-monthpicker ng-switch-when=\"month\" tabindex=\"0\" class=\"uib-monthpicker\"></div>\n" +
    "  <div uib-yearpicker ng-switch-when=\"year\" tabindex=\"0\" class=\"uib-yearpicker\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("uib/template/datepicker/day.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/datepicker/day.html",
    "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left uib-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-left\"></i><span class=\"sr-only\">previous</span></button></th>\n" +
    "      <th colspan=\"{{::5 + showWeeks}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm uib-title\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right uib-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-right\"></i><span class=\"sr-only\">next</span></button></th>\n" +
    "    </tr>\n" +
    "    <tr>\n" +
    "      <th ng-if=\"showWeeks\" class=\"text-center\"></th>\n" +
    "      <th ng-repeat=\"label in ::labels track by $index\" class=\"text-center\"><small aria-label=\"{{::label.full}}\">{{::label.abbr}}</small></th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr class=\"uib-weeks\" ng-repeat=\"row in rows track by $index\" role=\"row\">\n" +
    "      <td ng-if=\"showWeeks\" class=\"text-center h6\"><em>{{ weekNumbers[$index] }}</em></td>\n" +
    "      <td ng-repeat=\"dt in row\" class=\"uib-day text-center\" role=\"gridcell\"\n" +
    "        id=\"{{::dt.uid}}\"\n" +
    "        ng-class=\"::dt.customClass\">\n" +
    "        <button type=\"button\" class=\"btn btn-default btn-sm\"\n" +
    "          uib-is-class=\"\n" +
    "            'btn-info' for selectedDt,\n" +
    "            'active' for activeDt\n" +
    "            on dt\"\n" +
    "          ng-click=\"select(dt.date)\"\n" +
    "          ng-disabled=\"::dt.disabled\"\n" +
    "          tabindex=\"-1\"><span ng-class=\"::{'text-muted': dt.secondary, 'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "");
}]);

angular.module("uib/template/datepicker/month.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/datepicker/month.html",
    "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left uib-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-left\"></i><span class=\"sr-only\">previous</span></button></th>\n" +
    "      <th colspan=\"{{::yearHeaderColspan}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm uib-title\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right uib-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-right\"></i><span class=\"sr-only\">next</span></i></button></th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr class=\"uib-months\" ng-repeat=\"row in rows track by $index\" role=\"row\">\n" +
    "      <td ng-repeat=\"dt in row\" class=\"uib-month text-center\" role=\"gridcell\"\n" +
    "        id=\"{{::dt.uid}}\"\n" +
    "        ng-class=\"::dt.customClass\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\"\n" +
    "          uib-is-class=\"\n" +
    "            'btn-info' for selectedDt,\n" +
    "            'active' for activeDt\n" +
    "            on dt\"\n" +
    "          ng-click=\"select(dt.date)\"\n" +
    "          ng-disabled=\"::dt.disabled\"\n" +
    "          tabindex=\"-1\"><span ng-class=\"::{'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "");
}]);

angular.module("uib/template/datepicker/year.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/datepicker/year.html",
    "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left uib-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-left\"></i><span class=\"sr-only\">previous</span></button></th>\n" +
    "      <th colspan=\"{{::columns - 2}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm uib-title\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\"><strong>{{title}}</strong></button></th>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right uib-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-right\"></i><span class=\"sr-only\">next</span></button></th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr class=\"uib-years\" ng-repeat=\"row in rows track by $index\" role=\"row\">\n" +
    "      <td ng-repeat=\"dt in row\" class=\"uib-year text-center\" role=\"gridcell\"\n" +
    "        id=\"{{::dt.uid}}\"\n" +
    "        ng-class=\"::dt.customClass\">\n" +
    "        <button type=\"button\" class=\"btn btn-default\"\n" +
    "          uib-is-class=\"\n" +
    "            'btn-info' for selectedDt,\n" +
    "            'active' for activeDt\n" +
    "            on dt\"\n" +
    "          ng-click=\"select(dt.date)\"\n" +
    "          ng-disabled=\"::dt.disabled\"\n" +
    "          tabindex=\"-1\"><span ng-class=\"::{'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "");
}]);

angular.module("uib/template/datepickerPopup/popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/datepickerPopup/popup.html",
    "<ul role=\"presentation\" class=\"uib-datepicker-popup dropdown-menu uib-position-measure\" dropdown-nested ng-if=\"isOpen\" ng-keydown=\"keydown($event)\" ng-click=\"$event.stopPropagation()\">\n" +
    "  <li ng-transclude></li>\n" +
    "  <li ng-if=\"showButtonBar\" class=\"uib-button-bar\">\n" +
    "    <span class=\"btn-group pull-left\">\n" +
    "      <button type=\"button\" class=\"btn btn-sm btn-info uib-datepicker-current\" ng-click=\"select('today', $event)\" ng-disabled=\"isDisabled('today')\">{{ getText('current') }}</button>\n" +
    "      <button type=\"button\" class=\"btn btn-sm btn-danger uib-clear\" ng-click=\"select(null, $event)\">{{ getText('clear') }}</button>\n" +
    "    </span>\n" +
    "    <button type=\"button\" class=\"btn btn-sm btn-success pull-right uib-close\" ng-click=\"close($event)\">{{ getText('close') }}</button>\n" +
    "  </li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("uib/template/modal/window.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/modal/window.html",
    "<div class=\"modal-dialog {{size ? 'modal-' + size : ''}}\"><div class=\"modal-content\" uib-modal-transclude></div></div>\n" +
    "");
}]);

angular.module("uib/template/pager/pager.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/pager/pager.html",
    "<li ng-class=\"{disabled: noPrevious()||ngDisabled, previous: align}\"><a href ng-click=\"selectPage(page - 1, $event)\" ng-disabled=\"noPrevious()||ngDisabled\" uib-tabindex-toggle>{{::getText('previous')}}</a></li>\n" +
    "<li ng-class=\"{disabled: noNext()||ngDisabled, next: align}\"><a href ng-click=\"selectPage(page + 1, $event)\" ng-disabled=\"noNext()||ngDisabled\" uib-tabindex-toggle>{{::getText('next')}}</a></li>\n" +
    "");
}]);

angular.module("uib/template/pagination/pagination.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/pagination/pagination.html",
    "<li ng-if=\"::boundaryLinks\" ng-class=\"{disabled: noPrevious()||ngDisabled}\" class=\"pagination-first\"><a href ng-click=\"selectPage(1, $event)\" ng-disabled=\"noPrevious()||ngDisabled\" uib-tabindex-toggle>{{::getText('first')}}</a></li>\n" +
    "<li ng-if=\"::directionLinks\" ng-class=\"{disabled: noPrevious()||ngDisabled}\" class=\"pagination-prev\"><a href ng-click=\"selectPage(page - 1, $event)\" ng-disabled=\"noPrevious()||ngDisabled\" uib-tabindex-toggle>{{::getText('previous')}}</a></li>\n" +
    "<li ng-repeat=\"page in pages track by $index\" ng-class=\"{active: page.active,disabled: ngDisabled&&!page.active}\" class=\"pagination-page\"><a href ng-click=\"selectPage(page.number, $event)\" ng-disabled=\"ngDisabled&&!page.active\" uib-tabindex-toggle>{{page.text}}</a></li>\n" +
    "<li ng-if=\"::directionLinks\" ng-class=\"{disabled: noNext()||ngDisabled}\" class=\"pagination-next\"><a href ng-click=\"selectPage(page + 1, $event)\" ng-disabled=\"noNext()||ngDisabled\" uib-tabindex-toggle>{{::getText('next')}}</a></li>\n" +
    "<li ng-if=\"::boundaryLinks\" ng-class=\"{disabled: noNext()||ngDisabled}\" class=\"pagination-last\"><a href ng-click=\"selectPage(totalPages, $event)\" ng-disabled=\"noNext()||ngDisabled\" uib-tabindex-toggle>{{::getText('last')}}</a></li>\n" +
    "");
}]);

angular.module("uib/template/tooltip/tooltip-html-popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/tooltip/tooltip-html-popup.html",
    "<div class=\"tooltip-arrow\"></div>\n" +
    "<div class=\"tooltip-inner\" ng-bind-html=\"contentExp()\"></div>\n" +
    "");
}]);

angular.module("uib/template/tooltip/tooltip-popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/tooltip/tooltip-popup.html",
    "<div class=\"tooltip-arrow\"></div>\n" +
    "<div class=\"tooltip-inner\" ng-bind=\"content\"></div>\n" +
    "");
}]);

angular.module("uib/template/tooltip/tooltip-template-popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/tooltip/tooltip-template-popup.html",
    "<div class=\"tooltip-arrow\"></div>\n" +
    "<div class=\"tooltip-inner\"\n" +
    "  uib-tooltip-template-transclude=\"contentExp()\"\n" +
    "  tooltip-template-transclude-scope=\"originScope()\"></div>\n" +
    "");
}]);

angular.module("uib/template/popover/popover-html.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/popover/popover-html.html",
    "<div class=\"arrow\"></div>\n" +
    "\n" +
    "<div class=\"popover-inner\">\n" +
    "    <h3 class=\"popover-title\" ng-bind=\"uibTitle\" ng-if=\"uibTitle\"></h3>\n" +
    "    <div class=\"popover-content\" ng-bind-html=\"contentExp()\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("uib/template/popover/popover-template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/popover/popover-template.html",
    "<div class=\"arrow\"></div>\n" +
    "\n" +
    "<div class=\"popover-inner\">\n" +
    "    <h3 class=\"popover-title\" ng-bind=\"uibTitle\" ng-if=\"uibTitle\"></h3>\n" +
    "    <div class=\"popover-content\"\n" +
    "      uib-tooltip-template-transclude=\"contentExp()\"\n" +
    "      tooltip-template-transclude-scope=\"originScope()\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("uib/template/popover/popover.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/popover/popover.html",
    "<div class=\"arrow\"></div>\n" +
    "\n" +
    "<div class=\"popover-inner\">\n" +
    "    <h3 class=\"popover-title\" ng-bind=\"uibTitle\" ng-if=\"uibTitle\"></h3>\n" +
    "    <div class=\"popover-content\" ng-bind=\"content\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("uib/template/progressbar/bar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/progressbar/bar.html",
    "<div class=\"progress-bar\" ng-class=\"type && 'progress-bar-' + type\" role=\"progressbar\" aria-valuenow=\"{{value}}\" aria-valuemin=\"0\" aria-valuemax=\"{{max}}\" ng-style=\"{width: (percent < 100 ? percent : 100) + '%'}\" aria-valuetext=\"{{percent | number:0}}%\" aria-labelledby=\"{{::title}}\" ng-transclude></div>\n" +
    "");
}]);

angular.module("uib/template/progressbar/progress.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/progressbar/progress.html",
    "<div class=\"progress\" ng-transclude aria-labelledby=\"{{::title}}\"></div>");
}]);

angular.module("uib/template/progressbar/progressbar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/progressbar/progressbar.html",
    "<div class=\"progress\">\n" +
    "  <div class=\"progress-bar\" ng-class=\"type && 'progress-bar-' + type\" role=\"progressbar\" aria-valuenow=\"{{value}}\" aria-valuemin=\"0\" aria-valuemax=\"{{max}}\" ng-style=\"{width: (percent < 100 ? percent : 100) + '%'}\" aria-valuetext=\"{{percent | number:0}}%\" aria-labelledby=\"{{::title}}\" ng-transclude></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("uib/template/rating/rating.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/rating/rating.html",
    "<span ng-mouseleave=\"reset()\" ng-keydown=\"onKeydown($event)\" tabindex=\"0\" role=\"slider\" aria-valuemin=\"0\" aria-valuemax=\"{{range.length}}\" aria-valuenow=\"{{value}}\" aria-valuetext=\"{{title}}\">\n" +
    "    <span ng-repeat-start=\"r in range track by $index\" class=\"sr-only\">({{ $index < value ? '*' : ' ' }})</span>\n" +
    "    <i ng-repeat-end ng-mouseenter=\"enter($index + 1)\" ng-click=\"rate($index + 1)\" class=\"glyphicon\" ng-class=\"$index < value && (r.stateOn || 'glyphicon-star') || (r.stateOff || 'glyphicon-star-empty')\" ng-attr-title=\"{{r.title}}\"></i>\n" +
    "</span>\n" +
    "");
}]);

angular.module("uib/template/tabs/tab.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/tabs/tab.html",
    "<li ng-class=\"[{active: active, disabled: disabled}, classes]\" class=\"uib-tab nav-item\">\n" +
    "  <a href ng-click=\"select($event)\" class=\"nav-link\" uib-tab-heading-transclude>{{heading}}</a>\n" +
    "</li>\n" +
    "");
}]);

angular.module("uib/template/tabs/tabset.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/tabs/tabset.html",
    "<div>\n" +
    "  <ul class=\"nav nav-{{tabset.type || 'tabs'}}\" ng-class=\"{'nav-stacked': vertical, 'nav-justified': justified}\" ng-transclude></ul>\n" +
    "  <div class=\"tab-content\">\n" +
    "    <div class=\"tab-pane\"\n" +
    "         ng-repeat=\"tab in tabset.tabs\"\n" +
    "         ng-class=\"{active: tabset.active === tab.index}\"\n" +
    "         uib-tab-content-transclude=\"tab\">\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("uib/template/timepicker/timepicker.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/timepicker/timepicker.html",
    "<table class=\"uib-timepicker\">\n" +
    "  <tbody>\n" +
    "    <tr class=\"text-center\" ng-show=\"::showSpinners\">\n" +
    "      <td class=\"uib-increment hours\"><a ng-click=\"incrementHours()\" ng-class=\"{disabled: noIncrementHours()}\" class=\"btn btn-link\" ng-disabled=\"noIncrementHours()\" tabindex=\"-1\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n" +
    "      <td>&nbsp;</td>\n" +
    "      <td class=\"uib-increment minutes\"><a ng-click=\"incrementMinutes()\" ng-class=\"{disabled: noIncrementMinutes()}\" class=\"btn btn-link\" ng-disabled=\"noIncrementMinutes()\" tabindex=\"-1\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n" +
    "      <td ng-show=\"showSeconds\">&nbsp;</td>\n" +
    "      <td ng-show=\"showSeconds\" class=\"uib-increment seconds\"><a ng-click=\"incrementSeconds()\" ng-class=\"{disabled: noIncrementSeconds()}\" class=\"btn btn-link\" ng-disabled=\"noIncrementSeconds()\" tabindex=\"-1\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n" +
    "      <td ng-show=\"showMeridian\"></td>\n" +
    "    </tr>\n" +
    "    <tr>\n" +
    "      <td class=\"form-group uib-time hours\" ng-class=\"{'has-error': invalidHours}\">\n" +
    "        <input type=\"text\" placeholder=\"HH\" ng-model=\"hours\" ng-change=\"updateHours()\" class=\"form-control text-center\" ng-readonly=\"::readonlyInput\" maxlength=\"2\" tabindex=\"{{::tabindex}}\" ng-disabled=\"noIncrementHours()\" ng-blur=\"blur()\">\n" +
    "      </td>\n" +
    "      <td class=\"uib-separator\">:</td>\n" +
    "      <td class=\"form-group uib-time minutes\" ng-class=\"{'has-error': invalidMinutes}\">\n" +
    "        <input type=\"text\" placeholder=\"MM\" ng-model=\"minutes\" ng-change=\"updateMinutes()\" class=\"form-control text-center\" ng-readonly=\"::readonlyInput\" maxlength=\"2\" tabindex=\"{{::tabindex}}\" ng-disabled=\"noIncrementMinutes()\" ng-blur=\"blur()\">\n" +
    "      </td>\n" +
    "      <td ng-show=\"showSeconds\" class=\"uib-separator\">:</td>\n" +
    "      <td class=\"form-group uib-time seconds\" ng-class=\"{'has-error': invalidSeconds}\" ng-show=\"showSeconds\">\n" +
    "        <input type=\"text\" placeholder=\"SS\" ng-model=\"seconds\" ng-change=\"updateSeconds()\" class=\"form-control text-center\" ng-readonly=\"readonlyInput\" maxlength=\"2\" tabindex=\"{{::tabindex}}\" ng-disabled=\"noIncrementSeconds()\" ng-blur=\"blur()\">\n" +
    "      </td>\n" +
    "      <td ng-show=\"showMeridian\" class=\"uib-time am-pm\"><button type=\"button\" ng-class=\"{disabled: noToggleMeridian()}\" class=\"btn btn-default text-center\" ng-click=\"toggleMeridian()\" ng-disabled=\"noToggleMeridian()\" tabindex=\"{{::tabindex}}\">{{meridian}}</button></td>\n" +
    "    </tr>\n" +
    "    <tr class=\"text-center\" ng-show=\"::showSpinners\">\n" +
    "      <td class=\"uib-decrement hours\"><a ng-click=\"decrementHours()\" ng-class=\"{disabled: noDecrementHours()}\" class=\"btn btn-link\" ng-disabled=\"noDecrementHours()\" tabindex=\"-1\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n" +
    "      <td>&nbsp;</td>\n" +
    "      <td class=\"uib-decrement minutes\"><a ng-click=\"decrementMinutes()\" ng-class=\"{disabled: noDecrementMinutes()}\" class=\"btn btn-link\" ng-disabled=\"noDecrementMinutes()\" tabindex=\"-1\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n" +
    "      <td ng-show=\"showSeconds\">&nbsp;</td>\n" +
    "      <td ng-show=\"showSeconds\" class=\"uib-decrement seconds\"><a ng-click=\"decrementSeconds()\" ng-class=\"{disabled: noDecrementSeconds()}\" class=\"btn btn-link\" ng-disabled=\"noDecrementSeconds()\" tabindex=\"-1\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n" +
    "      <td ng-show=\"showMeridian\"></td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "");
}]);

angular.module("uib/template/typeahead/typeahead-match.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/typeahead/typeahead-match.html",
    "<a href\n" +
    "   tabindex=\"-1\"\n" +
    "   ng-bind-html=\"match.label | uibTypeaheadHighlight:query\"\n" +
    "   ng-attr-title=\"{{match.label}}\"></a>\n" +
    "");
}]);

angular.module("uib/template/typeahead/typeahead-popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("uib/template/typeahead/typeahead-popup.html",
    "<ul class=\"dropdown-menu\" ng-show=\"isOpen() && !moveInProgress\" ng-style=\"{top: position().top+'px', left: position().left+'px'}\" role=\"listbox\" aria-hidden=\"{{!isOpen()}}\">\n" +
    "    <li class=\"uib-typeahead-match\" ng-repeat=\"match in matches track by $index\" ng-class=\"{active: isActive($index) }\" ng-mouseenter=\"selectActive($index)\" ng-click=\"selectMatch($index, $event)\" role=\"option\" id=\"{{::match.id}}\">\n" +
    "        <div uib-typeahead-match index=\"$index\" match=\"match\" query=\"query\" template-url=\"templateUrl\"></div>\n" +
    "    </li>\n" +
    "</ul>\n" +
    "");
}]);
angular.module('ui.bootstrap.carousel').run(function() {!angular.$$csp().noInlineStyle && !angular.$$uibCarouselCss && angular.element(document).find('head').prepend('<style type="text/css">.ng-animate.item:not(.left):not(.right){-webkit-transition:0s ease-in-out left;transition:0s ease-in-out left}</style>'); angular.$$uibCarouselCss = true; });
angular.module('ui.bootstrap.datepicker').run(function() {!angular.$$csp().noInlineStyle && !angular.$$uibDatepickerCss && angular.element(document).find('head').prepend('<style type="text/css">.uib-datepicker .uib-title{width:100%;}.uib-day button,.uib-month button,.uib-year button{min-width:100%;}.uib-left,.uib-right{width:100%}</style>'); angular.$$uibDatepickerCss = true; });
angular.module('ui.bootstrap.position').run(function() {!angular.$$csp().noInlineStyle && !angular.$$uibPositionCss && angular.element(document).find('head').prepend('<style type="text/css">.uib-position-measure{display:block !important;visibility:hidden !important;position:absolute !important;top:-9999px !important;left:-9999px !important;}.uib-position-scrollbar-measure{position:absolute !important;top:-9999px !important;width:50px !important;height:50px !important;overflow:scroll !important;}.uib-position-body-scrollbar-measure{overflow:scroll !important;}</style>'); angular.$$uibPositionCss = true; });
angular.module('ui.bootstrap.datepickerPopup').run(function() {!angular.$$csp().noInlineStyle && !angular.$$uibDatepickerpopupCss && angular.element(document).find('head').prepend('<style type="text/css">.uib-datepicker-popup.dropdown-menu{display:block;float:none;margin:0;}.uib-button-bar{padding:10px 9px 2px;}</style>'); angular.$$uibDatepickerpopupCss = true; });
angular.module('ui.bootstrap.tooltip').run(function() {!angular.$$csp().noInlineStyle && !angular.$$uibTooltipCss && angular.element(document).find('head').prepend('<style type="text/css">[uib-tooltip-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-popup].tooltip.right-bottom > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-html-popup].tooltip.right-bottom > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.top-left > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.top-right > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.bottom-left > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.bottom-right > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.left-top > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.left-bottom > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.right-top > .tooltip-arrow,[uib-tooltip-template-popup].tooltip.right-bottom > .tooltip-arrow,[uib-popover-popup].popover.top-left > .arrow,[uib-popover-popup].popover.top-right > .arrow,[uib-popover-popup].popover.bottom-left > .arrow,[uib-popover-popup].popover.bottom-right > .arrow,[uib-popover-popup].popover.left-top > .arrow,[uib-popover-popup].popover.left-bottom > .arrow,[uib-popover-popup].popover.right-top > .arrow,[uib-popover-popup].popover.right-bottom > .arrow,[uib-popover-html-popup].popover.top-left > .arrow,[uib-popover-html-popup].popover.top-right > .arrow,[uib-popover-html-popup].popover.bottom-left > .arrow,[uib-popover-html-popup].popover.bottom-right > .arrow,[uib-popover-html-popup].popover.left-top > .arrow,[uib-popover-html-popup].popover.left-bottom > .arrow,[uib-popover-html-popup].popover.right-top > .arrow,[uib-popover-html-popup].popover.right-bottom > .arrow,[uib-popover-template-popup].popover.top-left > .arrow,[uib-popover-template-popup].popover.top-right > .arrow,[uib-popover-template-popup].popover.bottom-left > .arrow,[uib-popover-template-popup].popover.bottom-right > .arrow,[uib-popover-template-popup].popover.left-top > .arrow,[uib-popover-template-popup].popover.left-bottom > .arrow,[uib-popover-template-popup].popover.right-top > .arrow,[uib-popover-template-popup].popover.right-bottom > .arrow{top:auto;bottom:auto;left:auto;right:auto;margin:0;}[uib-popover-popup].popover,[uib-popover-html-popup].popover,[uib-popover-template-popup].popover{display:block !important;}</style>'); angular.$$uibTooltipCss = true; });
angular.module('ui.bootstrap.timepicker').run(function() {!angular.$$csp().noInlineStyle && !angular.$$uibTimepickerCss && angular.element(document).find('head').prepend('<style type="text/css">.uib-time input{width:50px;}</style>'); angular.$$uibTimepickerCss = true; });
angular.module('ui.bootstrap.typeahead').run(function() {!angular.$$csp().noInlineStyle && !angular.$$uibTypeaheadCss && angular.element(document).find('head').prepend('<style type="text/css">[uib-typeahead-popup].dropdown-menu{display:block;}</style>'); angular.$$uibTypeaheadCss = true; });
angular.module('DealersApp', ['ngAnimate', 'ngRoute', 'ngCookies', 'ngMaterial', 'ui.bootstrap', 'ngImgCrop', 'angular-google-analytics', 'pascalprecht.translate', 'tmh.dynamicLocale'])

    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('purple', {
                'default': '500'
            })
            .accentPalette('purple', {
                'default': '500'
            })
    })

    .config(function (AnalyticsProvider) {
        AnalyticsProvider.setAccount({
            tracker: "UA-62425106-3",
            trackEvent: true,
            trackEcommerce: true
        });
        AnalyticsProvider.useECommerce(true, false);
        AnalyticsProvider.setCurrency('ILS');
        AnalyticsProvider.readFromRoute(true);
    })

    .config(function ($translateProvider, tmhDynamicLocaleProvider) {
        $translateProvider.useMissingTranslationHandlerLog();
        $translateProvider.useStaticFilesLoader({
            prefix: 'resources/locale-',// path to translations files
            suffix: '.json'// suffix, currently- extension of the translations
        });
        $translateProvider.registerAvailableLanguageKeys(['he', 'en'], {
            'he*': 'he',
            'en*': 'en'
        });
        $translateProvider.determinePreferredLanguage();
        $translateProvider.fallbackLanguage('en');
        $translateProvider.useSanitizeValueStrategy('escape');
        $translateProvider.useLocalStorage();// saves selected language to localStorage
        tmhDynamicLocaleProvider.localeLocationPattern('/assets/locales/angular-locale_{{locale}}.js');
    })

    .constant('LOCALES', {
        'locales': {
            'he': 'עברית',
            'en': 'English'
        },
        'localeFlags': {
            'עברית': '/assets/images/icons/@2x/flag-israel.png',
            'English': '/assets/images/icons/@2x/flag-usa.png'
        },
        'preferredLocale': 'en'
    })

    .filter('htmlEscape', function () {
        return function (input) {
            if (input) {
                return input.replace("&amp;", "&");
            }
        }
    })

    .run(['$rootScope', '$location', '$cookies', '$http', '$timeout', '$mdToast', 'DealerPhotos', 'Analytics', '$translate', '$translateLocalStorage',
        function ($rootScope, $location, $cookies, $http, $timeout, $mdToast, DealerPhotos, Analytics, $translate, $translateLocalStorage) {

            // global constants
            $rootScope.language = "";
            // $rootScope.baseUrl = 'http://api.dealers-web.com'; // Test
            // $rootScope.homeUrl = "http://www.dealers-web.com"; // Test
            // $rootScope.stripe_publishable_key = 'pk_test_q3cpGyBIL6rsGswSQbP3tMpK'; // Test
            // $rootScope.INTERCOM_APP_ID = "bez9ewf7"; // Test
            $rootScope.baseUrl = 'https://api.dealers-app.com'; // Live
            $rootScope.homeUrl = 'https://www.dealers-app.com'; // Live
            $rootScope.stripe_publishable_key = 'pk_live_mgdZB9xHsOnYaQDXMXJJm4xU'; // Live
            $rootScope.INTERCOM_APP_ID = "z1b3ijln"; // Live
            $rootScope.AWSKey = 'AKIAIWJFJX72FWKD2LYQ';
            $rootScope.AWSSecretKey = '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';
            $rootScope.AWSS3Bucket = 'dealers-app';
            $rootScope.directImageURlPrefix = 'https://' + $rootScope.AWSS3Bucket + '.s3.amazonaws.com/';
            $rootScope.DEFAULT_PRODUCT_PHOTO_URL = "assets/images/icons/@2x/Web_Icons_product_photo_placeholder.png";

            // AWS configuration
            AWS.config.update({
                accessKeyId: $rootScope.AWSKey,
                secretAccessKey: $rootScope.AWSSecretKey
            });
            AWS.config.region = 'eu-west-1';

            // S3 configuration
            $rootScope.s3 = new AWS.S3();

            // Global functions
            $rootScope.setUserProfilePic = setUserProfilePic;

            // Set language
            $rootScope.language = $translate.proposedLanguage();
            var storageKey = 'NG_TRANSLATE_LANG_KEY';

            if (!$translateLocalStorage.get(storageKey)) {
                // There is no translation in the cache. Get the country of the client via the ipinfo.io service and determine the appropriate language.
                console.log("Determining according to country");
                $.getJSON('https://ipinfo.io/json', function (data) {
                    var country = data.country;
                    country = country.toLowerCase();
                    if (country == 'il') {
                        $rootScope.language = 'he';
                        document.documentElement.setAttribute('dir', 'rtl');// sets "lang" attribute to html
                    }
                    $translate.use($rootScope.language);
                    document.documentElement.setAttribute('lang', $rootScope.language);
                });
            } else {
                if ($rootScope.language == 'he') {
                    document.documentElement.setAttribute('dir', 'rtl');// sets "lang" attribute to html
                    document.documentElement.setAttribute('lang', $rootScope.language);
                }
            }


            /**
             * Initializing the Intercom SDK.
             * @param user - the user.
             */
            function initIntercom(user) {
                var date = new Date(user.register_date).getTime();
                window.Intercom("boot", {
                    app_id: $rootScope.INTERCOM_APP_ID,
                    user_id: user.id,
                    user_hash: user.intercom_code,
                    created_at: date / 1000, // Convert the milliseconds into seconds.
                    name: user.full_name, // Full name
                    email: user.email,
                    date_of_birth: user.date_of_birth,
                    gender: user.gender,
                    location: user.location,
                    role: user.role,
                    rank: user.rank,
                    language: $rootScope.language
                });
            }

            // keep user logged in after page refresh
            if ($cookies.get('globals') !== '[object Object]') { // checking if there's an object in the cookies key
                $rootScope.globals = $cookies.getObject('globals') || {};
                if ($rootScope.globals.currentUser) {
                    $http.defaults.headers.common['Authorization'] = 'Token ' + $rootScope.globals.currentUser.token;
                    // get the dealer object from the local storage
                    var dealerString = localStorage.getItem('dealer');
                    if (dealerString) {
                        $rootScope.dealer = JSON.parse(dealerString);
                        // RootDealerReady.setAsReady($rootScope.dealer);
                        $rootScope.userProfilePic = "";
                        $rootScope.userProfilePicSender = "user-dealer-pic";
                        setUserProfilePic();
                        initIntercom($rootScope.dealer);
                        $rootScope.$broadcast("DEALER_LOADED");
                    }
                } else {
                    // User is not logged in.
                    window.Intercom("boot", {
                        app_id: $rootScope.INTERCOM_APP_ID
                    });
                }
            }

            /**
             * Checks if the current user has a dealer pic, and if so, downloads it. Otherwise, sets the default user dealer image.
             */
            function setUserProfilePic() {
                var dealer = $rootScope.dealer;
                var photo = $rootScope.dealer.photo;
                if (photo != "None" && photo != "") {
                    DealerPhotos.getPhoto(photo, dealer.id, $rootScope.userProfilePicSender);
                    $rootScope.$on('downloaded-' + $rootScope.userProfilePicSender + '-dealer-pic-' + dealer.id, function (event, args) {
                        if (args.success) {
                            $timeout(function () {
                                $rootScope.userProfilePic = args.data;
                                $rootScope.$apply();
                            }, 1000);
                        } else {
                            $rootScope.userProfilePic = null;
                            console.log(args.message);
                        }
                    });
                } else {
                    $rootScope.userProfilePic = DealerPhotos.DEFAULT_PROFILE_PIC;
                }
            }

            // Roles
            $rootScope.roles = {
                guest: "Guest",
                viewer: "Viewer",
                dealer: "Dealer",
                admin: "Admin"
            };

            // Categories Local Keys (for local client navigation use)
            $rootScope.categoriesLocal = [
                "All Categories",
                "Art",
                "Automotive",
                "Health & Beauty",
                "Books & Magazines",
                "Electronics",
                "Entertainment & Events",
                "Fashion",
                "Food & Groceries",
                "Home & Furniture",
                "Kids & Babies",
                "Music",
                "Pets",
                "Restaurants & Bars",
                "Services",
                "Sports & Outdoor",
                "Travel",
                "Other"
            ];

            $rootScope.categories = [
                $translate.instant("general.all-categories"),
                $translate.instant("general.art"),
                $translate.instant("general.automotive"),
                $translate.instant("general.health-beauty"),
                $translate.instant("general.books-magazines"),
                $translate.instant("general.electronics"),
                $translate.instant("general.entertainment-events"),
                $translate.instant("general.fashion"),
                $translate.instant("general.food-groceries"),
                $translate.instant("general.home-furniture"),
                $translate.instant("general.kids-events"),
                $translate.instant("general.music"),
                $translate.instant("general.pets"),
                $translate.instant("general.restaurants-bars"),
                $translate.instant("general.services"),
                $translate.instant("general.sports-outdoors"),
                $translate.instant("general.travel"),
                $translate.instant("general.other")
            ];

            $rootScope.$on('$translateChangeSuccess', function () {
                $rootScope.categories = [
                    $translate.instant("general.all-categories"),
                    $translate.instant("general.art"),
                    $translate.instant("general.automotive"),
                    $translate.instant("general.health-beauty"),
                    $translate.instant("general.books-magazines"),
                    $translate.instant("general.electronics"),
                    $translate.instant("general.entertainment-events"),
                    $translate.instant("general.fashion"),
                    $translate.instant("general.food-groceries"),
                    $translate.instant("general.home-furniture"),
                    $translate.instant("general.kids-events"),
                    $translate.instant("general.music"),
                    $translate.instant("general.pets"),
                    $translate.instant("general.restaurants-bars"),
                    $translate.instant("general.services"),
                    $translate.instant("general.sports-outdoors"),
                    $translate.instant("general.travel"),
                    $translate.instant("general.other")
                ];
            });

            // Discount types
            $rootScope.discountTypes = {
                percentage: "PE",
                previousPrice: "PP"
            };

            $rootScope.showToast = function (text, delay) {
                var timer = 3000; // show the toast for 3 seconds
                if (delay) {
                    timer = delay;
                }
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(text)
                        .position('top')
                        .hideDelay(timer)
                );
            };

            /**
             * Listens to changes in the location service in order to prevent the user from reaching restricted pages,
             * according to his role.
             */
            $rootScope.$on('$locationChangeStart', function (event, next, current) {
                var roles = $rootScope.roles;
                var role, restricted;

                window.Intercom("update");

                if (!$rootScope.dealer) {
                    role = roles.guest;
                } else {
                    role = $rootScope.dealer.role;
                }

                if (role != roles.dealer) {
                    restricted = ['/new-product', '/edit-product'];
                    for (var i = 0; i < restricted.length; i++) {
                        if (next.indexOf(restricted[i]) > -1) {
                            $location.path('/');
                            return;
                        }
                    }
                }

                if (role == roles.dealer) {
                    restricted = ['/register'];
                    for (i = 0; i < restricted.length; i++) {
                        if (next.indexOf(restricted[i]) > -1) {
                            $location.path('/');
                            return;
                        }
                    }
                }
            });
        }]);

angular.module('DealersApp')
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

        $routeProvider
            .when('/', {
                templateUrl: 'app/components/views/home.view.html',
                controller: 'HomeController',
            })
            .when('/home', {
                templateUrl: 'app/components/views/home.view.html',
                controller: 'HomeController',
                pageTrack: '/home' // angular-google-analytics extension
            })
            .when('/(?:all-products|Everything', {
                templateUrl: 'app/components/views/home.view.html',
                controller: 'ProductsGridController',
                pageTrack: '/all-products' // angular-google-analytics extension
            })
            .when('/register', {
                templateUrl: 'app/components/views/sign-in/register-as-dealer.view.html',
                controller: 'RegisterAsDealerController',
                pageTrack: '/register-as-dealer'  // angular-google-analytics extension
            })
            .when('/search/products/:query', {
                templateUrl: 'app/components/views/products/products-page.view.html',
                controller: 'ProductsGridController',
                pageTrack: '/search/products'  // angular-google-analytics extension
            })
            .when('/categories', {
                templateUrl: 'app/components/views/categories-list.view.html',
                controller: 'CategoriesListController',
                pageTrack: '/categories'  // angular-google-analytics extension
            })
            .when('/categories/:category', {
                templateUrl: 'app/components/views/products/products-page.view.html',
                controller: 'ProductsGridController',
                pageTrack: '/categories'  // angular-google-analytics extension
            })
            .when('/products/:productID', {
                templateUrl: 'app/components/views/view-deal.view.html',
                controller: 'ViewDealController',
                pageTrack: '/product'  // angular-google-analytics extension
            })
            .when('/dealers/:dealerID', {
                templateUrl: 'app/components/views/profile.view.html',
                controller: 'ProfileController',
                pageTrack: '/profile'  // angular-google-analytics extension
            })
            .when('/dealers/:dealerID/sales', {
                templateUrl: 'app/components/views/profile.view.html',
                controller: 'ProfileController',
                reloadOnSearch: false,
                pageTrack: '/profile-sales'  // angular-google-analytics extension
            })
            .when('/dealers/:dealerID/orders', {
                templateUrl: 'app/components/views/profile.view.html',
                controller: 'ProfileController',
                reloadOnSearch: false,
                pageTrack: '/profile-orders'  // angular-google-analytics extension
            })
            .when('/edit-profile/:dealerID', {
                templateUrl: 'app/components/views/edit-profile.view.html',
                controller: 'EditProfileController',
                pageTrack: '/edit-profile'  // angular-google-analytics extension
            })
            .when('/new-product', {
                templateUrl: 'app/components/views/products/add-product.view.html',
                controller: 'AddProductController',
                pageTrack: '/add-product'  // angular-google-analytics extension
            })
            .when('/new-product/spread-the-word', {
                templateUrl: 'app/components/views/products/add-product-finish.view.html',
                controller: 'AddProductFinishController',
                pageTrack: '/add-product-finish'  // angular-google-analytics extension
            })
            .when('/edit-product/:productID', {
                templateUrl: 'app/components/views/products/edit-product.view.html',
                controller: 'EditProductController',
                pageTrack: '/edit-product'  // angular-google-analytics extension
            })
            .when('/done-registration', {
                templateUrl: 'app/components/views/sign-in/done-registration.view.html',
                pageTrack: '/dealer-registration-finish'  // angular-google-analytics extension
            })
            .when('/products/:productID/checkout', {
                templateUrl: 'app/components/views/checkout.view.html',
                controller: 'CheckoutController',
                pageTrack: '/checkout'  // angular-google-analytics extension
            })
            .when('/products/:productID/checkout-finish', {
                templateUrl: 'app/components/views/checkout-finish.view.html',
                controller: 'CheckoutFinishController',
                pageTrack: '/checkout-finished'  // angular-google-analytics extension
            })
            .when('/purchase/:purchaseID', {
                templateUrl: 'app/components/views/purchases/purchase-details.view.html',
                controller: 'PurchaseDetailsController',
                pageTrack: '/purchase-details'  // angular-google-analytics extension
            })
            .when('/about', {
                templateUrl: '/app/components/views/about/about.view.html'
            })
            .when('/terms-and-privacy', {
                templateUrl: 'app/components/views/about/terms-and-privacy.view.html'
            })
            .when('/contact', {
                templateUrl: 'app/components/views/about/contact.view.html'
            })
            .when('/security', {
                templateUrl: 'app/components/views/about/security.view.html'
            })
            .when('/help', {
                templateUrl: 'app/components/views/about/help.view.html'
            })
            .when('/step-by-step', {
                templateUrl: 'app/components/views/about/step-by-step.view.html'
            })
            .otherwise({redirectTo: '/'});

        $locationProvider.html5Mode(true);

    }]);

angular.module('DealersApp')

/**
 * The controller that manages the second step of the Add Product Procedure.
 */
    .controller('AddProductFinishController', ['$scope', '$rootScope', '$location', '$timeout', '$mdDialog', 'AddProduct',
        function ($scope, $rootScope, $location, $timeout, $mdDialog, AddProduct) {

            var PRODUCT_PAGE_BASE_URL = $rootScope.baseUrl + '/products/';

            $scope.didntShare = true;
            $scope.didShare = false;
            $scope.product = AddProduct.getProduct();

            checkIfProductExists();

            /**
             * Checks if there is a product object in the AddProduct service. If not, then move to the home page.
             */
            function checkIfProductExists() {
                if (!$scope.product) {
                    $location.path("/home");
                }
            }

            $scope.switchDidShare = function (event) {
                $timeout(function () {
                    $scope.didntShare = false;
                }, 2000);
                $timeout(function () {
                    $scope.didShare = true;
                }, 2500);
            };

            $scope.done = function () {
                if ($scope.product) {
                    if ($scope.product.id) {
                        $location.path("/products/" + $scope.product.id);
                        return;
                    }
                }
                $location.path("/home");
            };

            $scope.$on('$destroy', function () {
                AddProduct.clearSession();
            })
        }]);
/**
 * Created by gullumbroso on 11/08/2016.
 */
angular.module('DealersApp')

/**
 * The controller that manages the Add Product Procedure.
 */
    .controller('AddProductController', ['$rootScope', '$scope', '$location', '$timeout', '$mdDialog', '$mdConstant', 'AddProduct', 'Product', 'Photos', 'ProductPhotos', 'Analytics', 'Defaults', 'Dealer', 'ShippingMethods', 'Translations',

        function ($rootScope, $scope, $location, $timeout, $mdDialog, $mdConstant, AddProduct, Product, Photos, ProductPhotos, Analytics, Defaults, Dealer, ShippingMethods, Translations) {

            var CONFIRM_EXIT_MESSAGE = "The content will be lost.";
            var BASIC_DETAILS_INDEX = 0;
            var MORE_DETAILS_INDEX = 1;
            var AP_SESSION = 'apSession';
            var BROADCASTING_PREFIX = 'photos-downloaded-for-';
            var UPLOAD_FINISHED_MESSAGE = 'ap-upload-finished';
            var NEXT_PAGE_PATH = "/new-product/spread-the-word";
            var DEFAULT_QUANTITY = 10;
            var DEFAULT_MAX_QUANTITY = 10;

            $scope.photos = [];
            $scope.photosURLs = [];
            $scope.selectedPhotoIndex = 0;
            $scope.showDiscount = false;
            $scope.variants = {};
            $scope.translations = {}; // Translations that should be inserted in the scope for presentations in the view.
            $scope.DEALERS_SHIPPING_PRICE = ShippingMethods.DEALERS_SHIPPING_PRICE;
            $scope.DEALERS_SHIPPING_ETD = ShippingMethods.DEALERS_SHIPPING_ETD;
            $scope.DEALERS_SHIPPING_DESCRIPTION = ShippingMethods.DEALERS_SHIPPING_DESCRIPTION;
            $scope.shipping_methods = { // Default shipping methods values.
                dealers: ShippingMethods.DEFAULT_DEALER_SHIIPPING,
                custom: {selected: false},
                pickup: ShippingMethods.DEFAULT_PICKUP_SHIIPPING
            };
            $scope.submitButtonTitle = Translations.productEdit.submitTitleNext;
            $scope.showDiscountTitle = Translations.productEdit.addDiscount;
            $scope.placeholderNames = Translations.productEdit.placeholderNames;
            $scope.placeholderOptions = Translations.productEdit.placeholderOptions;
            $scope.presentDealersInfo = false;
            $scope.presentCustomInfo = false;
            $scope.presentPickupInfo = false;
            $scope.maxVariants = 3;
            $scope.variations = [];
            $scope.keys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA, $mdConstant.KEY_CODE.TAB];
            $scope.shouldBeTabIndex = -1;


            $scope.selectPhoto = selectPhoto;
            $scope.changeThumbnailSelection = changeThumbnailSelection;
            $scope.checkIfActive = checkIfActive;
            $scope.showAlertDialog = showAlertDialog;

            initialize();

            function initialize() {
                loadProduct();
                loadScopeTranslations();
                loadDefaults();
                loadPhotos();

                $scope.$watch("product.currency", function () {

                    if ($scope.product.currency == '₪') {
                        $scope.shipping_methods.dealers.shipping_price = $scope.DEALERS_SHIPPING_PRICE = 35;
                    } else if ($scope.product.currency == '$') {
                        $scope.shipping_methods.dealers.shipping_price = $scope.DEALERS_SHIPPING_PRICE = 10;
                    } else if ($scope.product.currency == '€') {
                        $scope.shipping_methods.dealers.shipping_price = $scope.DEALERS_SHIPPING_PRICE = 9;
                    }
                });
            }

            /**
             * Loads the product object if it's in the AddProduct service. If not, checks if the product object is
             * stored in the cookies. Else creates a new product object.
             */
            function loadProduct() {
                var product = AddProduct.getProduct();
                if (!$.isEmptyObject(product) && product != null) {
                    $scope.product = Product.unStringifyObject(product);
                } else if (AddProduct.checkForSavedSessions()) {
                    // If the checkForSavedSessions returns true, that means that the saved session is in the product
                    // object of AddProduct service. Retrieve it. Also true for photosURLs.
                    $scope.product = Product.unStringifyObject(AddProduct.getProduct());
                } else {
                    $scope.product = {};
                }

                $scope.product.currency = '₪';
                $scope.product.inventory = DEFAULT_QUANTITY;
                $scope.product.max_quantity = DEFAULT_MAX_QUANTITY;
            }

            function loadScopeTranslations() {
                $scope.translations.placeholderNames = Translations.productEdit.placeholderNames;
                $scope.translations.placeholderOptions = Translations.productEdit.placeholderOptions;
            }

            function loadDefaults() {
                // Shipping methods
                if ($scope.dealer.dealers_delivery || $scope.dealer.custom_delivery || $scope.dealer.pickup_delivery) {
                    // At least one of the delivery methods of the dealer are not null, which means that there is a
                    // default shipping preference for this dealer.
                    if ($scope.dealer.dealers_delivery) {
                        $scope.shipping_methods.dealers = $scope.dealer.dealers_delivery;
                        $scope.shipping_methods.dealers.selected = true;
                    }
                    if ($scope.dealer.custom_delivery) {
                        $scope.shipping_methods.custom = $scope.dealer.custom_delivery;
                        $scope.shipping_methods.custom.selected = true;
                    }
                    if ($scope.dealer.pickup_delivery) {
                        $scope.shipping_methods.pickup = $scope.dealer.pickup_delivery;
                        $scope.shipping_methods.pickup.selected = true;
                    }
                }
            }

            /**
             * Checks if there are photos in the current product object, and if so loads them into the scope's photos array.
             */
            function loadPhotos() {
                if ($scope.product) {
                    if ($scope.product.photos) {
                        if ($scope.product.photos.length > 0) {
                            $scope.photos = $scope.product.photos;
                            var indexesToDelete = [];
                            for (var i = 0; i < $scope.photos.length; i++) {
                                if (!Photos.checkIfImageData($scope.photos[i])) {
                                    indexesToDelete.push(i);
                                }
                            }
                            for (i = 0; i < indexesToDelete.length; i++) {
                                $scope.photos.splice(indexesToDelete[i], 1);
                            }
                            $scope.photosURLs = Photos.imageDataToUrls($scope.photos);
                            $scope.selectPhoto(0);
                        }
                    }
                }
            }

            /**
             * Changes the presented photo in the photo container.
             * @param index - the index of the new selected photo.
             */
            function selectPhoto(index) {
                var loadTime;
                if ($scope.photosURLs.length == 1) {
                    loadTime = 500;
                } else {
                    loadTime = 50;
                }
                $scope.selectedPhotoIndex = index;
                $scope.changeThumbnailSelection(index);
                $scope.shouldBeTabIndex = $scope.selectedTab;
                $timeout(function () {
                    $('.carousel-inner div').each(function (i) {
                        if ($scope.selectedPhotoIndex == i) {
                            $(this).addClass("active");
                        } else {
                            $(this).removeClass("active");
                        }
                    });
                }, loadTime);
            }

            /**
             * Checks if the photo element in the received index has the 'active' class.
             * @param index - the index of the photo element.
             * @returns {boolean} - True if the photo element has the 'active' class, false otherwise.
             */
            function checkIfActive(index) {
                var carousel = $("div.carousel-inner");
                var photos = carousel.children();
                return $(photos[index]).hasClass("active");
            }

            /**
             * Changes the selection mark to the photo thumbnail with the received index.
             * @param index - the index of the new selected thumbnail.
             */
            function changeThumbnailSelection(index) {
                $('div.ap-thumbnail').removeClass('selected');
                $('li#' + index + "-photo div.ap-thumbnail").addClass('selected');
            }

            /**
             * The bootstrap carousel chevron button was clicked. Checks which chevron button was clicked, left or right,
             * and changes the selected photo accordingly.
             */
            $scope.nextPhoto = function (event) {
                var chevronButton;
                if (event.target.tagName == "A") {
                    // The anchor tag was clicked, set it as the chevron button.
                    chevronButton = event.target;
                } else {
                    // The span tag was clicked, the anchor tag child. Get its parent (the anchor tag).
                    chevronButton = event.target.parentElement;
                }
                var photosNum = $scope.photos.length;
                var index;

                if (!$scope.checkIfActive($scope.selectedPhotoIndex)) {
                    // The current photo doesn't have the 'active' class yet, which means the slide animation isn't finished
                    // yet.
                    return;
                }

                if ($(chevronButton).hasClass("left")) {
                    index = $scope.selectedPhotoIndex - 1;
                    if (index < 0) {
                        index = photosNum - 1;
                    }
                } else if ($(chevronButton).hasClass("right")) {
                    index = $scope.selectedPhotoIndex + 1;
                    if (index >= photosNum) {
                        index = 0;
                    }
                }
                $scope.selectPhoto(index);
            };

            $scope.$watchGroup(
                ["photos[0]", "photos[1]", "photos[2]", "photos[3]"],
                function handleImageChange(newValue, oldValue) {
                    for (var i = 0; i < newValue.length; i++) {
                        if (newValue[i] != null && oldValue[i] == null) {
                            // A new photo was added at the index <i>. Set it in the main image view.
                            $scope.selectPhoto(i);
                        }
                    }
                }
            );

            /**
             * Asks the user to confirm he wants to remove the photo, and if he does, removes the photo.
             * @param event - the event that triggerd the function.
             */
            $scope.removePhoto = function (event) {
                var confirm = $mdDialog.confirm()
                    .title(Translations.general.removePhotoTitle)
                    .textContent(Translations.general.removePhotoConfirm)
                    .ariaLabel('Remove photo')
                    .targetEvent(event)
                    .ok(Translations.general.approve)
                    .cancel(Translations.general.cancel);
                $mdDialog.show(confirm).then(function () {
                    var photoIndex = event.target.parentElement.parentElement.id;
                    photoIndex = parseInt(photoIndex, 10);
                    $scope.photos.splice(photoIndex, 1);
                    $scope.photosURLs.splice(photoIndex, 1);
                });
            };

            /**
             * Opens an angular-material dropdown menu.
             * @param $mdOpenMenu - the menu to open.
             * @param ev - the event that triggered the function.
             */
            $scope.openMenu = function ($mdOpenMenu, ev) {
                $mdOpenMenu(ev);
            };

            $scope.presentDiscountControllers = function (event) {
                if ($scope.showDiscount) {
                    $scope.showDiscount = false;
                    $scope.showDiscountTitle = Translations.productEdit.addDiscount;
                } else {
                    $scope.showDiscount = true;
                    $scope.showDiscountTitle = Translations.productEdit.removeDiscount;
                }

            };

            $scope.changePrice = function (event) {
                if ($scope.product.percentage_off > 0) {
                    $scope.changePercentageOff(event);
                }
            };

            $scope.changePercentageOff = function (event) {
                if ($scope.product.percentage_off) {
                    var margin = 100 - $scope.product.percentage_off;
                    if (margin <= 0) {
                        $scope.product.price = 0;
                        $scope.product.original_price = null;
                    } else {
                        $scope.product.original_price = ($scope.product.price / margin) * 100;
                    }
                }
            };

            $scope.changeOriginalPrice = function (event) {
                var percentage_off = (1 - ($scope.product.price / $scope.product.original_price)) * 100;
                $scope.product.percentage_off = Math.round(percentage_off * 100) / 100; // Keep only 2 decimals.
            };

            $scope.getVariantsLength = function () {
                return Object.keys($scope.variants).length;
            };

            /**
             * Adds another Variant field to the view.
             * @param event
             */
            $scope.addVariant = function (event) {
                if ($scope.getVariantsLength() < $scope.maxVariants) {
                    $scope.variants[$scope.getVariantsLength()] = {
                        name: "",
                        options: []
                    }
                }
            };

            /**
             * Removes the Variant field from the view.
             * @param index - the index of the Variant to remove.
             * @param event
             */
            $scope.removeVariant = function (index, event) {
                delete $scope.variants[index];
                while ($scope.variants[index + 1]) {
                    $scope.variants[index] = $scope.variants[index + 1];
                    delete $scope.variants[index + 1];
                    index++;
                }
            };

            /**
             * Toggles the delivery (shipping method) selection.
             * @param item The shipping method.
             * @param list The
             */
            $scope.toggleDelivery = function (item, list) {
                var idx = list.indexOf(item);
                if (idx > -1) {
                    list.splice(idx, 1);
                }
                else {
                    list.push(item);
                }
            };

            $scope.exists = function (item, list) {
                return list.indexOf(item) > -1;
            };

            /**
             * This function is being called each time one of the tabs are being selected.
             * @param tab - the selected tab.
             */
            $scope.onTabSelected = function (tab) {
                if (tab == 0) {
                    $scope.submitButtonTitle = Translations.productEdit.submitTitleNext;
                } else {
                    $scope.submitButtonTitle = Translations.productEdit.submitTitleDone;
                }
            };

            /**
             * Presents the alert dialog when there is an invalid field.
             * @param title - the title of the alert dialog.
             * @param content - the content of the alert dialog.
             * @param ev - the event that triggered the alert.
             */
            function showAlertDialog(title, content, ev) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .clickOutsideToClose(true)
                        .title(title)
                        .textContent(content)
                        .ariaLabel('Alert Dialog')
                        .ok("Got it")
                        .targetEvent(ev)
                );
            }

            /**
             * Presents the loading dialog.
             * @param ev - the event that triggered the loading.
             */
            function showLoadingDialog(ev) {
                $mdDialog.show({
                    templateUrl: 'app/components/views/loading-dialog.view.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    controller: 'LoadingDialogController',
                    locals: {message: Translations.productEdit.uploadLoading},
                    escapeToClose: false
                });
            }

            /**
             * Hides the loading dialog.
             * @param ev - the event that triggered the hiding.
             */
            function hideLoadingDialog(ev) {
                $mdDialog.hide();
            }

            /**
             * Validates the basic details inputs.
             * @returns {boolean} true if valid, else false.
             */
            function validateBasicDetails(form, event) {
                if (!$scope.product.title) {
                    showAlertDialog(Translations.productEdit.blankTitle, Translations.productEdit.blankTitleContent, event);
                    return false;
                } else if ($scope.photos.length == 0) {
                    showAlertDialog(Translations.productEdit.missingPhotosTitle, Translations.productEdit.missingPhotosContent, event);
                    return false;
                }
                return true;
            }

            /* Validates the more details input.
             * @param form - the form that was filled.
             * @returns {boolean} - true if valid, else false.
             */
            function validateMoreDetails(form, event) {
                if ($scope.product.price == null) {
                    showAlertDialog(Translations.productEdit.blankPriceTitle, Translations.productEdit.blankPriceContent, event);
                    return false;
                }
                if ($scope.product.price <= 0) {
                    showAlertDialog(Translations.productEdit.invalidPriceTitle, Translations.productEdit.invalidPriceContent, event);
                    return false;
                }
                if ($scope.product.percentage_off < 0) {
                    showAlertDialog(Translations.productEdit.invalidDiscountTitle, Translations.productEdit.invalidDiscountContent, event);
                    return false;
                }
                if ($scope.product.percentage_off > 100) {
                    showAlertDialog(Translations.productEdit.invalidDiscountTitle, Translations.productEdit.invalidDiscountContent100, event);
                    return false;
                }
                if ($scope.product.original_price != null && $scope.product.original_price <= $scope.product.price) {
                    showAlertDialog(Translations.productEdit.invalidDiscountTitle, Translations.productEdit.invalidDiscountContentOP, event);
                }
                if ($scope.product.category != null) {
                    if ($scope.product.category.length == 0) {
                        showAlertDialog(Translations.productEdit.blankCategoryTitle, Translations.productEdit.blankCategoryContent, event);
                        return false;
                    }
                } else {
                    showAlertDialog(Translations.productEdit.blankCategoryTitle, Translations.productEdit.blankCategoryContent, event);
                    return false;
                }
                if ($scope.product.max_quantity <= 0 || $scope.product.max_quantity > 10000) {
                    showAlertDialog(Translations.productEdit.invalidMaxQuantityTitle, Translations.productEdit.invalidMaxQuantityContent, event);
                    return false;
                }

                return true;
            }

            /**
             * Organizes the price and discount input before upload.
             */
            function preparePriceAndDiscount() {
                if (!$scope.showDiscount) {
                    $scope.product.percentage_off = null;
                    $scope.product.original_price = null;
                    return;
                }
                if ($scope.product.percentage_off && !$scope.presentPercentageOff) {
                    $scope.product.percentage_off = null;
                }
                if ($scope.product.original_price && !$scope.presentOriginalPrice) {
                    $scope.product.original_price = null;
                }
            }

            /**
             * Removes variants with empty names and also removes empty options.
             */
            function prepareVariants() {
                for (var property in $scope.variants) {
                    if ($scope.variants.hasOwnProperty(property)) {
                        var name = $scope.variants[property].name;
                        if (!(name.length > 0)) {
                            delete $scope.variants[property];
                            continue;
                        }
                        var options = $scope.variants[property].options;
                        for (var i = options.length - 1; i >= 0; i--) {
                            if (options[i].length == 0) {
                                options.splice(i, 1);
                            }
                        }
                    }
                }
            }

            /**
             * Arranges the selected shipping methods in the scope's product object.
             */
            function prepareShippingMethods() {
                if ($scope.shipping_methods.dealers.selected) {
                    $scope.product.dealers_delivery = $scope.shipping_methods.dealers;
                    $scope.product.dealers_delivery.delivery_method = ShippingMethods.DEALERS_METHOD;
                    $scope.product.dealers_delivery = ShippingMethods.convertDeliveryToServer($scope.product.dealers_delivery);
                } else {
                    $scope.product.dealers_delivery = null;
                }
                if ($scope.shipping_methods.custom.selected) {
                    $scope.product.custom_delivery = $scope.shipping_methods.custom;
                    $scope.product.custom_delivery.delivery_method = ShippingMethods.CUSTOM_METHOD;
                    $scope.product.custom_delivery = ShippingMethods.convertDeliveryToServer($scope.product.custom_delivery);
                } else {
                    $scope.product.custom_delivery = null;

                }
                if ($scope.shipping_methods.pickup.selected) {
                    $scope.product.pickup_delivery = $scope.shipping_methods.pickup;
                    $scope.product.pickup_delivery.delivery_method = ShippingMethods.PICKUP_METHOD;
                } else {
                    $scope.product.pickup_delivery = null;
                }
            }

            $scope.addProduct = function (addProductForm, event) {
                if ($scope.selectedTab == BASIC_DETAILS_INDEX) {
                    $scope.selectedTab = MORE_DETAILS_INDEX;
                    $('html, body').animate({scrollTop: 0}, 800);
                    return;
                }
                if (!validateBasicDetails(addProductForm, event)) {
                    return;
                }
                if (!validateMoreDetails(addProductForm, event)) {
                    return;
                }
                if (!ShippingMethods.validateShippingMethods($scope.shipping_methods)) { // Definition the product-edit directive.
                    return;
                }
                preparePriceAndDiscount();
                if (!$.isEmptyObject($scope.variants)) {
                    prepareVariants();
                    $scope.product.variants = Product.parseVariantsToServer($scope.variants);
                }
                prepareShippingMethods();
                $scope.product.photos = $scope.photos;
                $scope.product.max_quantity = Math.round($scope.product.max_quantity);
                showLoadingDialog();
                ProductPhotos.uploadPhotosOfProduct($scope.product, AP_SESSION);
            };

            $scope.$on(BROADCASTING_PREFIX + AP_SESSION, function (event, args) {
                var data = args.data;
                if (args.success) {
                    // Finished uploading photos, start uploading the product's data.
                    $scope.product = args.product;
                    AddProduct.uploadProduct($scope.product);
                    Analytics.trackEvent('Product', 'add', $scope.product.category);
                } else {
                    hideLoadingDialog(event);
                    console.log("Couldn't upload the photos. Aborting upload process.");
                }
            });

            /**
             * Being called when the product finished to be uploaded, whether successfully or unsuccessfully.
             */
            $scope.$on(UPLOAD_FINISHED_MESSAGE, function (event, args) {
                hideLoadingDialog();
                if (args.success) {
                    Defaults.updateShippingMethods(args.product, args.product.dealer);
                    Dealer.updateCurrentUser(args.product.dealer);
                    Intercom('trackEvent', 'added_product', {
                        product_id: args.product.id,
                        product_title: args.product.title
                    });
                    $location.path(NEXT_PAGE_PATH);
                } else {
                    console.log(args.message);
                    showAlertDialog("We're sorry, but there was a problem", args.message, event);
                }
            });

            window.onbeforeunload = function () {
                AddProduct.saveSession($scope.product, $scope.photosURLs);
                if ($scope.photos.length > 0 || !$.isEmptyObject($scope.product)) {
                    return CONFIRM_EXIT_MESSAGE;
                }
            };

            /**
             * Asks the user to confirm he wants to leave the Add Product process, explaining that it will cause the lost
             * of the data he entered.
             * @type {*|(function())}
             */
            var $locationChangeStartUnbind = $scope.$on('$locationChangeStart', function (event, next) {
                var processTitle = "new-product";
                if (next.indexOf(processTitle) == -1 && ($scope.photos.length != 0 || $scope.addProductForm.$dirty)) {
                    // The page that the user navigated to is not a part of the Add Product process. Present the
                    // confirm dialog.
                    var answer = confirm(Translations.general.confirmLeave);
                    if (!answer) {
                        event.preventDefault();
                        return;
                    }
                    AddProduct.clearSession();
                }
            });

            $rootScope.$on('$translateChangeSuccess', function () {
                $scope.submitButtonTitle = Translations.productEdit.submitTitleNext;
                $scope.showDiscountTitle = Translations.productEdit.addDiscount;
                $scope.placeholderNames = Translations.productEdit.placeholderNames;
                $scope.placeholderOptions = Translations.productEdit.placeholderOptions;
            });

            $scope.$on('$destroy', function () {
                window.onbeforeunload = null;
            })
        }]);
angular.module('DealersApp')
    .controller('CategoriesListController', ['$scope', function ($scope) {
        /*
         * The controller that manages the Categories view.
         */
        $scope.elements = $scope.categories;
    }]);
/**
 * Created by gullumbroso on 04/07/2016.
 */

angular.module('DealersApp')

    .controller('CheckoutFinishController', ['$scope', '$rootScope', '$location', '$mdDialog', 'ActiveSession',
        function ($scope, $rootScope, $location, $mdDialog, ActiveSession) {

            $scope.product = ActiveSession.getTempData("PRODUCT");
            $scope.hasPurchase = false;
            var purchaseURL;

            checkIfProductExists();

            /**
             * Checks if there is a product object in the AddProduct service. If not, then move to the home page.
             */
            function checkIfProductExists() {
                if (!$scope.product) {
                    $location.path("/home");
                }
            }

            $scope.$on('purchaseSaved', function(event, purchaseID) {
                $scope.hasPurchase = true;
                purchaseURL = '/purchase/' + purchaseID;
            });

            $scope.purchaseDetails = function (event) {
                if (purchaseURL) {
                    $location.path(purchaseURL);
                }
            };

            $scope.done = function () {
                $location.path("/home");
            };

            $scope.$on('$destroy', function () {
                ActiveSession.removeTempData("PRODUCT");
            })
        }]);
/**
 * Created by gullumbroso on 22/04/2016.
 */

angular.module('DealersApp')
/**
 * The controller that is responsible for checkout's view behaviour.
 * @param $scope - the isolated scope of the controller.
 * @param $mdDialog - the mdDialog service of the Material Angular library.
 */
    .controller('CheckoutController', ['$scope', '$rootScope', '$routeParams', '$location', '$mdMedia', '$mdDialog', 'Checkout', 'ActiveSession', 'Product', 'ProductPhotos', 'Purchase', 'Dialogs', 'ShippingMethods', 'Translations',
        function ($scope, $rootScope, $routeParams, $location, $mdMedia, $mdDialog, Checkout, ActiveSession, Product, ProductPhotos, Purchase, Dialogs, ShippingMethods, Translations) {

            // First check if there's a product object in the ActiveSession service. If not, download it.
            // Then create the purchase object.

            var DEFAULT_PHOTO_RATIO = 0.678125;
            var DOWNLOADED_STATUS = "downloaded";
            var DOWNLOADING_STATUS = "downloading";
            var FAILED_STATUS = "failed";

            $scope.status = DOWNLOADING_STATUS;
            $scope.finished = false;
            var shippingAddress = $rootScope.dealer.shipping_address;
            $scope.shipping_address = shippingAddress ? shippingAddress : {};
            $scope.shippingMethods = [];
            $scope.PICKUP_METHOD = ShippingMethods.PICKUP_METHOD;
            $scope.delivery = {
                selectedShipping: "",
                selectedShippingObj: {}
            };

            initializeView();

            function initializeView() {
                $scope.product = ActiveSession.getTempData("PRODUCT"); // Retrieves the product from the Active Session service.
                $scope.$watch(function () {
                    return $mdMedia('gt-sm');
                }, function (isSmallSize) {
                    $scope.smallSize = !isSmallSize;
                });
                if (!$scope.product) {
                    // There is no product in the session, download it form the server.
                    downloadProduct();
                } else {
                    $scope.status = DOWNLOADED_STATUS;
                    prepareView();
                }
            }

            function downloadProduct() {
                var productID = $routeParams.productID;
                Product.getProduct(productID)
                    .then(function (result) {
                        $scope.status = DOWNLOADED_STATUS;
                        $scope.product = result.data;
                        $scope.product = Product.mapData($scope.product);
                        if (!($scope.product.max_quantity > 0)) $scope.product.max_quantity = 30;
                        prepareView();
                    }, function (httpError) {
                        $scope.status = FAILED_STATUS;
                        $scope.errorMessage = "Couldn't download the product";
                        $scope.errorPrompt = "Please try again...";
                    });
            }

            function prepareView() {
                createPurchaseObject();
                setProductPic();
                organizeShipping();
            }

            function createPurchaseObject() {
                var purchase = Checkout.purchase;
                if (!purchase || $.isEmptyObject(purchase)) {
                    purchase = Checkout.retrieveSavedSession();
                    if (!purchase || $.isEmptyObject(purchase)) {
                        console.log("No purchase object!");
                        $location.path("/products/" + $scope.product.id);
                    }
                }

                $scope.purchase = {
                    buyer: $rootScope.dealer.id,
                    dealer: $scope.product.dealer.id,
                    deal: $scope.product.id,
                    amount: $scope.product.price * 100, // Convert to cents
                    currency: $scope.product.currency,
                    status: "Purchased",
                    quantity: purchase.quantity,
                    selections: purchase.selections
                }
            }

            function setProductPic() {

                if ($scope.product.photo) {
                    $scope.productImage = $scope.product.photo;
                    $scope.productImageStatus = DOWNLOADED_STATUS;

                } else {
                    ProductPhotos.downloadPhoto($scope.product.photo1, $scope.product.id);
                    $scope.productImageStatus = DOWNLOADING_STATUS;

                    $scope.$on('downloaded-photo-' + $scope.product.id, function (event, args) {
                        if (args.success) {
                            $scope.productImage = args.data.url;
                            $scope.product.photo = $scope.productImage;
                            $scope.productImageStatus = DOWNLOADED_STATUS;
                            $scope.$apply();
                        } else {
                            console.log(args.data.message);
                        }
                    });
                }
            }

            /**
             * Presents the description of the shipping method.
             * @param shippingMethod - The shipping method.
             * @param event - The event that triggered the function.
             */
            $scope.presentDetails = function (shippingMethod, event) {
                Dialogs.showAlertDialog(shippingMethod.title, shippingMethod.description, event);
            };

            /**
             * Updates the selcted shipping method in the purchase object each time there is a change event in the radio group.
             * @param event - The event that triggered the function.
             */
            $scope.updateSelectedShipping = function (event) {
                var selected = $scope.delivery.selectedShipping;
                if (selected == ShippingMethods.DEALERS_METHOD) {
                    $scope.delivery.selectedShippingObj = $scope.product.dealers_delivery;
                } else if (selected == ShippingMethods.CUSTOM_METHOD) {
                    $scope.delivery.selectedShippingObj = $scope.product.custom_delivery;
                } else if (selected == ShippingMethods.PICKUP_METHOD) {
                    $scope.delivery.selectedShippingObj = $scope.product.pickup_delivery;
                }
            };

            function organizeShipping() {
                var shippingMethods = [];
                if ($scope.product.dealers_delivery) {
                    shippingMethods.push($scope.product.dealers_delivery);
                }
                if ($scope.product.custom_delivery) {
                    shippingMethods.push($scope.product.custom_delivery);
                }
                if ($scope.product.pickup_delivery) {
                    shippingMethods.push($scope.product.pickup_delivery);
                }

                if (shippingMethods.length == 1) {
                    $scope.delivery.selectedShipping = shippingMethods[0].delivery_method;
                    $scope.delivery.selectedShippingObj = shippingMethods[0];
                }
                $scope.shippingMethods = shippingMethods;
            }

            $scope.checkout = function (form, ev) {

                if (!$scope.purchase.quantity) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .clickOutsideToClose(true)
                            .title(Translations.checkout.invalidQuantityTitle)
                            .textContent(Translations.checkout.invalidQuantityContent + $scope.product.max_quantity + ".")
                            .ariaLabel('Alert Dialog')
                            .ok(Translations.general.gotIt)
                            .targetEvent(ev)
                    );
                    return;
                }
                if (!$scope.delivery.selectedShipping) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .clickOutsideToClose(true)
                            .title(Translations.checkout.blankDelivery)
                            .textContent("")
                            .ariaLabel('Alert Dialog')
                            .ok(Translations.general.gotIt)
                            .targetEvent(ev)
                    );
                    return;
                }
                if (!form.$valid) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .clickOutsideToClose(true)
                            .title(Translations.checkout.invalidShippingAddressTitle)
                            .textContent(Translations.checkout.invalidShippingAddressContent)
                            .ariaLabel('Alert Dialog')
                            .ok(Translations.general.gotIt)
                            .targetEvent(ev)
                    );
                    return;
                }

                var shipping_price = $scope.delivery.selectedShippingObj.shipping_price * 100; // In cents
                var priceBeforeShipping = $scope.product.price * $scope.purchase.quantity * 100; // In cents
                var totalPrice = priceBeforeShipping + shipping_price;
                var imagePath = $rootScope.directImageURlPrefix + $scope.product.dealer.photo;
                var product_currency;

                if ($scope.product.currency.length == 1) {
                    product_currency = Product.keyForCurrency($scope.product.currency);
                } else {
                    product_currency = $scope.product.currency;
                }



                $scope.purchase.shipping_address = $scope.shipping_address;
                $scope.purchase.delivery = $scope.delivery.selectedShippingObj.id;
                var purchaseObj = $.extend(true, {}, $scope.purchase);
                purchaseObj.currency = product_currency;

                var handler = StripeCheckout.configure({
                    key: $rootScope.stripe_publishable_key,
                    image: imagePath,
                    locale: 'auto',
                    email: $rootScope.dealer.email,
                    token: function (token) {
                        // You can access the token ID with `token.id`.
                        // Get the token ID to your server-side code for use.
                        var charge = {
                            token: token.id,
                            amount: totalPrice,
                            currency: product_currency,
                            dealer: $scope.product.dealer.id,
                            buyer: $rootScope.dealer.id
                        };
                        Product.buyProduct(charge)
                            .then(function (response) {
                                    // success
                                    console.log("Payment successful!");
                                    $scope.finished = true;
                                    Purchase.addPurchase(purchaseObj, $scope.product);
                                    ActiveSession.setTempData("PRODUCT", $scope.product);
                                    Intercom('trackEvent', 'purchased', {
                                        product_id: $scope.product.id,
                                        product_title: $scope.product.title,
                                        quantity: purchaseObj.quantity,
                                        total_price: totalPrice,
                                        currency: product_currency
                                    });
                                    $location.path("/products/" + $scope.product.id + "/checkout-finish");
                                },
                                function (httpError) {
                                    // error
                                    console.log("Error!\n" + httpError);
                                });
                    }
                });

                handler.open({
                    name: $scope.product.title,
                    description: $scope.product.dealer.full_name,
                    amount: totalPrice,
                    currency: product_currency
                });
                if (event) {
                    event.preventDefault();
                }

                /*
                 Dealer.updateShippingAddress($scope.shipping_address)
                 .then(function (result) {

                 }, function (httpError) {

                 });
                 */
            };

            window.onbeforeunload = function () {
                Checkout.saveSession($scope.purchase);
            };

            var $locationChangeStartUnbind = $scope.$on('$locationChangeStart', function () {
                if ($scope.finished) {
                    Checkout.clearSession();
                } else {
                    Checkout.saveSession($scope.purchase);
                }
            });

            $scope.$on('$destroy', function () {
                Checkout.clearSession();
            })

        }]);
/**
 * Created by gullumbroso on 25/04/2016.
 */

angular.module('DealersApp')
/**
 * The controller of the dialog which enables the user to crop the photo that he uploaded.
 */
    .controller('CropPhotoDialog', ['$scope', '$rootScope', '$mdDialog', 'rawPhoto', 'Translations',
        function ($scope, $rootScope, $mdDialog, rawPhoto, Translations) {

            var DONE_BUTTON_TITLE = Translations.general.crop;
            var CANCEL_BUTTON_TITLE = Translations.general.cancel;

            $scope.rawPhotoURL = rawPhoto;
            $scope.croppedPhotoURL = "";

            $scope.crop = function () {
                $mdDialog.hide($scope.croppedPhotoURL);
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

        }]);
angular.module('DealersApp')

/**
 * The controller that manages the second step of the Add Product Procedure.
 */
    .controller('EditProductController', ['$scope', '$rootScope', '$location', '$mdDialog', '$mdConstant', '$mdToast', '$routeParams', '$timeout', 'Product', 'ProductPhotos', 'EditProduct', 'ShippingMethods', 'Dialogs', 'Translations',
        function ($scope, $rootScope, $location, $mdDialog, $mdConstant, $mdToast, $routeParams, $timeout, Product, ProductPhotos, EditProduct, ShippingMethods, Dialogs, Translations) {

            var SHEKEL = '₪';
            var DOLLAR = '$';
            var EURO = '€';
            var PERCENTAGE = '%';
            var CONFIRM_EXIT_MESSAGE = "The changes you made will be lost.";
            var VIEW_PRODUCT_PATH = "/products/" + $routeParams.productID + "/";
            var LOADING_MESSAGE = "Saving changes...";
            var BROADCASTING_PREFIX = 'photos-downloaded-for-';
            var UPLOAD_STARTED_MESSAGE = 'ep-upload-started';
            var UPLOAD_FINISHED_MESSAGE = 'ep-upload-finished';
            var EP_SESSION = 'epSession';
            var DONE_UPLOAD_MESSAGE = "Changes Saved!";
            var PRODUCT_URL = $rootScope.baseUrl + '/alldeals/' + $routeParams.productID + '/';

            $scope.DEALERS_SHIPPING_PRICE = ShippingMethods.DEALERS_SHIPPING_PRICE;
            $scope.DEALERS_SHIPPING_ETD = ShippingMethods.DEALERS_SHIPPING_ETD;
            $scope.DEALERS_SHIPPING_DESCRIPTION = ShippingMethods.DEALERS_SHIPPING_DESCRIPTION;
            $scope.originalDealer = {}; // The product without the changes that were taken place in this Edit Product session.
            $scope.product = {};
            $scope.translations = {}; // Translations that should be inserted in the scope for presentations in the view.
            $scope.currency = SHEKEL;
            $scope.discountType = PERCENTAGE;
            $scope.category = "";
            $scope.minDate = new Date();
            $scope.changedPhotos = false;
            $scope.savedChanges = false;
            $scope.downloadedFromServer = false;

            $scope.photos = [];
            $scope.photosStatus = [];
            $scope.photosURLs = [];
            $scope.oldPhotosURLs = []; // If the photos array is changed, all the old photos are deleted, so this array keeps the old photos that should be deleted.
            $scope.selectedIndex = 0;

            $scope.variants = {};
            $scope.maxVariants = 3;
            $scope.variations = [];
            $scope.keys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA, $mdConstant.KEY_CODE.TAB];

            $scope.selectPhoto = selectPhoto;
            $scope.changeThumbnailSelection = changeThumbnailSelection;
            $scope.checkIfActive = checkIfActive;
            $scope.changePercentageOff = changePercentageOff;
            $scope.changeOriginalPrice = changeOriginalPrice;
            $scope.setProductInView = setProductInView;

            if (EditProduct.product.id) {
                loadScopeTranslations();
                setProduct(EditProduct.product);
                $scope.setProductInView();
                $scope.variants = Product.parseVariantsFromServer($scope.product.variants);
            } else {
                $scope.status = 'loading';
                downloadProduct();
                loadPhotos();
            }

            function downloadProduct() {
                var productID = $routeParams.productID;
                Product.getProduct(productID)
                    .then(function (result) {
                        $scope.downloadedFromServer = true;
                        var product = result.data;
                        product = Product.mapData(product);
                        loadScopeTranslations();
                        setProduct(product);
                        $scope.setProductInView();
                        $scope.variants = Product.parseVariantsFromServer($scope.product.variants);
                    }, function (httpError) {
                        $scope.status = 'failed';
                        $scope.errorMessage = "Couldn't download the product";
                        $scope.errorPrompt = "Please try again...";
                    });
            }

            function loadScopeTranslations() {
                $scope.translations.placeholderNames = Translations.productEdit.placeholderNames;
                $scope.translations.placeholderOptions = Translations.productEdit.placeholderOptions;
            }

            function setProduct(product) {
                if (product) {
                    $scope.status = 'downloaded';
                    $scope.product = $.extend(true, {}, product);
                    $scope.shipping_methods = ShippingMethods.parseShippingFromServer($scope.product, $scope.downloadedFromServer);
                    $scope.originalShippingMethods = $.extend(true, {}, $scope.shipping_methods);
                } else {
                    console.log("Something is wrong - setProduct called but there's no product!");
                }
            }

            $scope.changePrice = function (event) {
                if ($scope.product.percentage_off > 0) {
                    $scope.changePercentageOff(event);
                }
            };

            function changePercentageOff(event) {
                if ($scope.product.percentage_off) {
                    var margin = 100 - $scope.product.percentage_off;
                    if (margin <= 0) {
                        $scope.product.price = 0;
                        $scope.product.original_price = null;
                    } else {
                        $scope.product.original_price = ($scope.product.price / margin) * 100;
                    }
                }
            }

            function changeOriginalPrice(event) {
                var percentage_off = (1 - ($scope.product.price / $scope.product.original_price)) * 100;
                $scope.product.percentage_off = Math.round(percentage_off * 100) / 100; // Keep only 2 decimals.
            }

            /**
             * Sets the view to present the product.
             */
            function setProductInView() {
                $scope.presentPercentageOff = $scope.product.percentage_off ? true : false;
                $scope.presentOriginalPrice = $scope.product.original_price ? true : false;
                $scope.changePercentageOff();
                $scope.changeOriginalPrice();
                fillOptionMenus();
                setProductPhotos();
            }

            $scope.changePresentPercentageOff = function (event) {
                $scope.presentPercentageOff = !$scope.presentPercentageOff;
            };

            $scope.changePresentOriginalPrice = function (event) {
                $scope.presentOriginalPrice = !$scope.presentOriginalPrice;
            };

            /**
             * Checks if there are photos in the current product object, and if so loads them into the scope's photos array.
             */
            function loadPhotos() {
                if ($scope.product) {
                    if ($scope.product.photos) {
                        if ($scope.product.photos.length > 0) {
                            $scope.photos = $scope.product.photos;
                            var indexesToDelete = [];
                            for (var i = 0; i < $scope.photos.length; i++) {
                                if (!Photos.checkIfImageData($scope.photos[i])) {
                                    indexesToDelete.push(i);
                                }
                            }
                            for (i = 0; i < indexesToDelete.length; i++) {
                                $scope.photos.splice(indexesToDelete[i], 1);
                            }
                            $scope.photosURLs = Photos.imageDataToUrls($scope.photos);
                            $scope.selectPhoto(0);
                        }
                    }
                }
            }

            /**
             * Takes care of presenting the photos if exists, and handle it gracefully if not.
             */
            function setProductPhotos() {
                ProductPhotos.downloadPhotos($scope.product);
                for (var i = 0; i < ProductPhotos.photosNum($scope.product); i++) {
                    $scope.photosStatus.push("loading");
                    $scope.photosURLs.push($rootScope.DEFAULT_PRODUCT_PHOTO_URL);
                }
                $scope.selectPhoto(0);
                $scope.$on('downloaded-photo-' + $scope.product.id, function (event, args) {
                    var data = args.data;
                    var index = data.photoIndex - 1;
                    if (args.success) {
                        $scope.photos[index] = data.rawImage;
                        $scope.photosURLs[index] = data.url;
                        $scope.photosStatus[index] = "doneLoading";
                        $scope.$apply();
                    } else {
                        console.log("Photos number " + data.photoIndex + " failed to download: \n" + data.message);
                        $scope.photosStatus[index] = "failed";
                    }
                });
            }

            /**
             * Sets the option menus according to the current product.
             */
            function fillOptionMenus() {
                var product = $scope.product;
                if (product) {
                    $scope.currency = product.currency;
                    $scope.category = product.category;
                }
            }

            /**
             * Changes the presented photo in the photo container.
             * @param index - the index of the new selected photo.
             */
            function selectPhoto(index) {
                var loadTime;
                if ($scope.photosURLs.length == 1) {
                    loadTime = 500;
                } else {
                    loadTime = 50;
                }
                $scope.selectedIndex = index;
                $scope.changeThumbnailSelection(index);
                $timeout(function () {
                    $('.carousel-inner div').each(function (i) {
                        if ($scope.selectedIndex == i) {
                            $(this).addClass("active");
                        } else {
                            $(this).removeClass("active");
                        }
                    });
                }, loadTime);
            }

            /**
             * Checks if the photo element in the received index has the 'active' class.
             * @param index - the index of the photo element.
             * @returns {boolean} - True if the photo element has the 'active' class, false otherwise.
             */
            function checkIfActive(index) {
                var carousel = $("div.carousel-inner");
                var photos = carousel.children();
                return $(photos[index]).hasClass("active");
            }

            /**
             * Changes the selection mark to the photo thumbnail with the received index.
             * @param index - the index of the new selected thumbnail.
             */
            function changeThumbnailSelection(index) {
                $('div.ap-thumbnail').removeClass('selected');
                $('li#' + index + "-photo div.ap-thumbnail").addClass('selected');
            }

            /**
             * The bootstrap carousel chevron button was clicked. Checks which chevron button was clicked, left or right,
             * and changes the selected photo accordingly.
             */
            $scope.nextPhoto = function (event) {
                var chevronButton;
                if (event.target.tagName == "A") {
                    // The anchor tag was clicked, set it as the chevron button.
                    chevronButton = event.target;
                } else {
                    // The span tag was clicked, the anchor tag child. Get its parent (the anchor tag).
                    chevronButton = event.target.parentElement;
                }
                var photosNum = $scope.photos.length;
                var index;

                if (!$scope.checkIfActive($scope.selectedIndex)) {
                    // The current photo doesn't have the 'active' class yet, which means the slide animation isn't finished
                    // yet.
                    return;
                }

                if ($(chevronButton).hasClass("left")) {
                    index = $scope.selectedIndex - 1;
                    if (index < 0) {
                        index = photosNum - 1;
                    }
                } else if ($(chevronButton).hasClass("right")) {
                    index = $scope.selectedIndex + 1;
                    if (index >= photosNum) {
                        index = 0;
                    }
                }
                $scope.selectPhoto(index);
            };

            $scope.$watchGroup(
                ["photos[0]", "photos[1]", "photos[2]", "photos[3]"],
                function handleImageChange(newValue, oldValue) {
                    for (var i = 0; i < newValue.length; i++) {
                        if (newValue[i] != null && oldValue[i] == null) {
                            // A new photo was added at the index <i>. Set it in the main image view.
                            $scope.selectPhoto(i);
                        }
                    }
                }
            );

            /**
             * Asks the user to confirm he wants to remove the photo, and if he does, removes the photo.
             * @param event - the event that triggerd the function.
             */
            $scope.removePhoto = function (event) {
                var confirm = $mdDialog.confirm()
                    .title(Translations.general.removePhotoTitle)
                    .textContent(Translations.general.removePhotoConfirm)
                    .ariaLabel('Remove photo')
                    .targetEvent(event)
                    .ok(Translations.general.approve)
                    .cancel(Translations.general.cancel);
                $mdDialog.show(confirm).then(function () {
                    var photoIndex = event.target.parentElement.parentElement.id;
                    photoIndex = parseInt(photoIndex, 10);
                    $scope.photos.splice(photoIndex, 1);
                    $scope.photosURLs.splice(photoIndex, 1);
                    $scope.changedPhotos = true;
                });
            };

            /**
             * Presents the alert dialog when there is an invalid field.
             * @param title - the title of the alert dialog.
             * @param content - the content of the alert dialog.
             * @param ev - the event that triggered the alert.
             */
            function showAlertDialog(title, content, ev) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .clickOutsideToClose(true)
                        .title(title)
                        .textContent(content)
                        .ariaLabel('Alert Dialog')
                        .ok(Translations.general.gotIt)
                        .targetEvent(ev)
                );
            }

            /**
             * Opens an angular-material dropdown menu.
             * @param $mdOpenMenu - the menu to open.
             * @param ev - the event that triggered the function.
             */
            $scope.openMenu = function ($mdOpenMenu, ev) {
                $mdOpenMenu(ev);
            };

            /**
             * Changes the status of the changedPhotos variable to true.
             * @param ev - the event argument.
             */
            $scope.changedPhoto = function (ev) {
                $scope.changedPhotos = true;
            };

            /**
             * Change the selected currency to SHEKEL.
             */
            $scope.shekel = function () {
                $scope.currency = SHEKEL;
            };

            /**
             * Change the selected currency to DOLLAR.
             */
            $scope.dollar = function () {
                $scope.currency = DOLLAR;
            };

            /**
             * Change the selected currency to EURO.
             */
            $scope.euro = function () {
                $scope.currency = EURO;
            };

            $scope.getVariantsLength = function () {
                return Object.keys($scope.variants).length;
            };

            /**
             * Adds another Variant field to the view.
             * @param event
             */
            $scope.addVariant = function (event) {
                if ($scope.getVariantsLength() < $scope.maxVariants) {
                    $scope.variants[$scope.getVariantsLength()] = {
                        name: "",
                        options: []
                    }
                }
            };

            /**
             * Removes the Variant field from the view.
             * @param index - the index of the Variant to remove.
             * @param event
             */
            $scope.removeVariant = function (index, event) {
                delete $scope.variants[index];
                while ($scope.variants[index + 1]) {
                    $scope.variants[index] = $scope.variants[index + 1];
                    delete $scope.variants[index + 1];
                    index++;
                }
            };

            /**
             * Presents the loading dialog.
             * @param ev - the event that triggered the loading.
             */
            function showLoadingDialog(ev) {
                $mdDialog.show({
                    templateUrl: 'app/components/views/loading-dialog.view.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    controller: 'LoadingDialogController',
                    locals: {message: Translations.general.saveChanges},
                    escapeToClose: false
                });
            }

            /**
             * Hides the loading dialog.
             * @param ev - the event that triggered the hiding.
             */
            function hideLoadingDialog(ev) {
                $mdDialog.hide();
            }

            /**
             * Being called when the product started to be uploaded to the server.
             */
            $scope.$on(UPLOAD_STARTED_MESSAGE, function (event) {
                showLoadingDialog(event);
            });

            /**
             * Being called when the product finished to be uploaded, whether successfully or unsuccessfully.
             */
            $scope.$on(UPLOAD_FINISHED_MESSAGE, function (event, args) {
                hideLoadingDialog();
                if (args.success) {
                    $scope.savedChanges = true;
                    if (args.data) {
                        $scope.product = args.data;
                        $scope.product.variants = $scope.variantsForLater;
                        EditProduct.product = $scope.product;
                    }
                    EditProduct.isAfterEdit = true;
                    $location.path(VIEW_PRODUCT_PATH);
                    $timeout($rootScope.showToast, 1500, true, DONE_UPLOAD_MESSAGE);
                } else {
                    console.log(args.message);
                    showAlertDialog("We're sorry, but there was a problem", args.message, event);
                }
            });

            /**
             * Organizes the price and discount input before upload.
             */
            function preparePriceAndDiscount() {
                if ($scope.product.percentage_off && !$scope.presentPercentageOff) {
                    $scope.product.percentage_off = null;
                }
                if ($scope.product.original_price && !$scope.presentOriginalPrice) {
                    $scope.product.original_price = null;
                }
            }

            /**
             * Removes variants with empty names and also removes empty options.
             */
            function prepareVariants() {
                for (var property in $scope.variants) {
                    if ($scope.variants.hasOwnProperty(property)) {
                        var name = $scope.variants[property].name;
                        if (!(name.length > 0)) {
                            delete $scope.variants[property];
                            continue;
                        }
                        var options = $scope.variants[property].options;
                        for (var i = options.length - 1; i >= 0; i--) {
                            if (options[i].length == 0) {
                                options.splice(i, 1);
                            }
                        }
                    }
                }
            }

            /**
             * Update the variants in the server.
             */
            function updateVariants() {
                EditProduct.deleteVariants($scope.product.variants);
                delete $scope.product.variants;
                var variants = Product.parseVariantsToServer($scope.variants);
                var postedVariants = [];
                for (var i = 0; i < variants.length; i++) {
                    variants[i].deal = $scope.product.id;
                    EditProduct.postVariant(variants[i])
                        .then(function (result) {
                            postedVariants.push(result.data);
                            if (postedVariants.length == variants.length) {
                                $scope.variantsForLater = postedVariants; // To add to the product when uploading is finished.
                                $scope.uploadPhotosAndProduct();
                            }
                        }, function (err) {
                            console.log("Failed to post variant.");
                        });
                }
                if (variants.length == 0) {
                    $scope.uploadPhotosAndProduct();
                }
            }

            /**
             * Submits the new product object to the server.
             * @param form - the form.
             */
            $scope.submitEdit = function (form) {
                $scope.product.photos = $scope.photos;
                if (!validation(form, event)) {
                    return;
                }
                preparePriceAndDiscount();
                $scope.product.photos = $scope.photos;
                $scope.product.max_quantity = Math.round($scope.product.max_quantity);
                showLoadingDialog();

                //Update shipping methods. The submission process continues after receiving a notification from the ShippingMethods service.
                ShippingMethods.updateShippingMethods($scope.product, $scope.shipping_methods, $scope.originalShippingMethods);
            };

            /**
             * Continues the submission of the new product after updating the shipping methods.
             */
            $scope.continueEditSubmission = function () {
                // Update variants
                if (!$.isEmptyObject($scope.variants)) {
                    prepareVariants();
                    updateVariants();
                } else {
                    delete $scope.product.variants;
                    $scope.uploadPhotosAndProduct();
                }
            };

            $scope.uploadPhotosAndProduct = function () {
                // If there were changes in the photos, then upload the changes and wait for the message
                // that indicates that the upload is finished. If not, then just upload the product object.
                if ($scope.changedPhotos) {
                    $scope.oldPhotosURLs = ProductPhotos.setProductPhotosInArray($scope.product);
                    ProductPhotos.uploadPhotosOfProduct($scope.product, EP_SESSION);
                } else {
                    EditProduct.uploadModifiedProduct($scope.product);
                }
            };

            $scope.$on(BROADCASTING_PREFIX + EP_SESSION, function (event, args) {
                if (args.success) {
                    // Finished uploading photos, start uploading the product's data, and in the meantime delete the old photos form the s3.
                    $scope.product = args.product;
                    EditProduct.uploadModifiedProduct($scope.product);
                    if ($scope.oldPhotosURLs) {
                        ProductPhotos.deletePhotos($scope.oldPhotosURLs);
                    }
                } else {
                    hideLoadingDialog(event);
                    Dialogs.showAlertDialog("Update Failure :(", "There was an error while uploading the new photos, please try again.");
                    console.log("Couldn't upload the photos. Aborting upload process.");
                }
            });

            $scope.$on(ShippingMethods.UPDATE_FINISHED, function (event, args) {
                if (args.success) {
                    // Finished updating the shipping methods.
                    $scope.continueEditSubmission();
                } else {
                    hideLoadingDialog();
                    Dialogs.showAlertDialog("Update Failure :(", "There was an error in the update process, please try again.");
                }
            });

            /**
             * Validates that all the required fields were filled and that everything is valid.
             * @param form - the form that was filled.
             * @param event - the event that triggered the submission.
             * @returns {boolean} - true if valid, else false.
             */
            function validation(form, event) {
                if ($scope.photos.length == 0) {
                    showAlertDialog(Translations.productEdit.missingPhotosTitle, Translations.productEdit.missingPhotosContent, event);
                    return false;
                }
                if (!$scope.product.title) {
                    showAlertDialog(Translations.productEdit.blankTitle, Translations.productEdit.blankTitleContent, event);
                    return false;
                }
                if ($scope.product.price == null) {
                    showAlertDialog(Translations.productEdit.blankPriceTitle, Translations.productEdit.blankPriceContent, event);
                    return false;
                }
                if ($scope.product.price <= 0) {
                    showAlertDialog(Translations.productEdit.invalidPriceTitle, Translations.productEdit.invalidPriceContent, event);
                    return false;
                }
                if ($scope.presentPercentageOff && $scope.product.percentage_off < 0) {
                    showAlertDialog(Translations.productEdit.invalidDiscountTitle, Translations.productEdit.invalidDiscountContent, event);
                    return false;
                }
                if ($scope.presentPercentageOff && $scope.product.percentage_off > 100) {
                    showAlertDialog(Translations.productEdit.invalidDiscountTitle, Translations.productEdit.invalidDiscountContent100, event);
                    return false;
                }
                if ($scope.presentOriginalPrice && $scope.product.original_price <= $scope.product.price) {
                    showAlertDialog(Translations.productEdit.invalidDiscountTitle, Translations.productEdit.invalidDiscountContentOP, event);
                    return false;
                }
                if (!($scope.product.max_quantity > 0)) {
                    showAlertDialog(Translations.productEdit.invalidMaxQuantityTitle, Translations.productEdit.invalidMaxQuantityContent, event);
                    return false;
                }
                if ($scope.product.category != null) {
                    if ($scope.product.category.length == 0) {
                        showAlertDialog(Translations.productEdit.blankCategoryTitle, Translations.productEdit.blankCategoryContent, event);
                        return false;
                    }
                } else {
                    showAlertDialog(Translations.productEdit.blankCategoryTitle, Translations.productEdit.blankCategoryContent, event);
                    return false;
                }
                if (!ShippingMethods.validateShippingMethods($scope.shipping_methods)) {
                    return false;
                }

                return true;
            }

            $scope.deleteProduct = function (event) {
                var confirm = $mdDialog.confirm()
                    .title(Translations.viewDeal.deletionMessageTitle)
                    .textContent(Translations.viewDeal.deletionMessageContent)
                    .ariaLabel('Delete product')
                    .targetEvent(event)
                    .ok(Translations.general.approve)
                    .cancel(Translations.general.cancel);
                $mdDialog.show(confirm).then(function () {
                    Product.deleteProduct(PRODUCT_URL)
                        .then(function (response) {
                                // success
                                console.log("Product deleted successfully.");
                                $timeout($rootScope.showToast, 1000, true, Translations.viewDeal.deletedMessage);
                                $location.path("/home");
                            },
                            function (httpError) {
                                // error
                                console.log(httpError.status + " : " + httpError.data);
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .parent(angular.element(document.body))
                                        .clickOutsideToClose(true)
                                        .title("Couldn't delete the product")
                                        .textContent("Please try again!")
                                        .ariaLabel('Alert Dialog')
                                        .ok("OK")
                                        .targetEvent(ev)
                                );
                            });
                });
            };

            window.onbeforeunload = function () {
                return CONFIRM_EXIT_MESSAGE;
            };

            /**
             * Asks the user to confirm he wants to leave the Add Product process, explaining that it will cause the lost
             * of the data he entered.
             * @type {*|(function())}
             */
            $scope.$on('$locationChangeStart', function (event, next) {
                if (!$scope.savedChanges) {
                    var answer = confirm(Translations.general.confirmLeave);
                    if (!answer) {
                        event.preventDefault();
                    }
                }
            });

            $scope.$on('$destroy', function () {
                EditProduct.product = null;
                window.onbeforeunload = null;
                // $locationChangeStartUnbind();
            });
        }]);
/**
 * Created by gullumbroso on 28/07/2016.
 */
angular.module('DealersApp')

    .controller('EditProfileController', ['$scope', '$rootScope', '$location', '$mdDialog', '$mdMedia', '$mdToast', '$routeParams', '$timeout', 'Dealer', 'Photos', 'DealerPhotos',
        function ($scope, $rootScope, $location, $mdDialog, $mdMedia, $mdToast, $routeParams, $timeout, Dealer, Photos, DealerPhotos) {

            var LOADING_STATUS = 'loading';
            var DOWNLOADED_STATUS = 'downloaded';
            var FAILED_STATUS = 'failed';
            var CONFIRM_EXIT_MESSAGE = "The changes you made will be lost.";
            var LOADING_MESSAGE = "Saving changes...";
            var EPR_SESSION = 'eprSession';
            var DONE_UPLOAD_MESSAGE = "Changes Saved!";
            var DEALER_MODE = "dealer_mode";
            var VIEWER_MODE = "viewer_mode";
            var ADD_PROFILE_PIC_BUTTON = "/assets/images/icons/@2x/Web_Icons_add_profile_pic_button.png";
            var ADD_PHOTO_BUTTON_TITLE = "Add Photo";
            var CHANGE_PHOTO_BUTTON_TITLE = "Change Photo";
            var PROFILE_PIC_BROADCASTING_PREFIX = 'dealer-pic-uploaded-for-';
            var UPDATE_BROADCASTING_PREFIX = 'update-as-dealer-for-';

            $scope.status = LOADING_STATUS;
            $scope.dealerID = $routeParams.dealerID;
            $scope.originalDealer = {}; // The dealer without the changes that were taken place in this Edit Profile session.
            $scope.newDealer = {};
            $scope.bank_account = {};
            $scope.changedPhoto = false;
            $scope.savedChanges = false;
            $scope.userMode = VIEWER_MODE;
            $scope.photo = "";
            $scope.photoURL = "";
            $scope.croppedPhotoURL = "";
            $scope.editProfilePic = CHANGE_PHOTO_BUTTON_TITLE;
            $scope.editingDone = false;

            initialize();

            function initialize() {
                setWatchersAndListeners();
                $scope.profile = $.extend(true, {}, $rootScope.dealer);
                if ($scope.profile) {
                    if ($scope.profile.id) {
                        setProfileDetails();
                        return;
                    }
                }
                downloadProfileDetails();
            }

            /**
             * Downloads the user's information in case it is absent.
             */
            function downloadProfileDetails() {
                Dealer.getDealer($scope.dealerID)
                    .then(function (response) {
                        $scope.profile = response.data;
                        setProfileDetails();
                    }, function (er) {
                        $scope.status = FAILED_STATUS;
                        console.log("The dealer information was absent and couldn't download it from the server.");
                    })
            }

            /**
             * Sets the user's profile information in the fields as predefined values.
             */
            function setProfileDetails() {
                $scope.status = DOWNLOADED_STATUS;
                $scope.bank_account = $scope.profile.bank_accounts[$scope.profile.bank_accounts.length - 1];
                determineUserMode();
                setProfilePic();
                if ($scope.userMode == VIEWER_MODE) {
                    $scope.datepicker = {
                        opened: false,
                        options: {
                            formatYear: 'yyyy',
                            maxDate: new Date(),
                            showWeeks: false,
                            initDate: new Date($scope.profile.date_of_birth)
                        }
                    };
                }
            }

            /**
             * Determines the user's role (viewer or dealer).
             */
            function determineUserMode() {
                if ($scope.profile.role == $scope.roles.dealer) {
                    $scope.userMode = DEALER_MODE;
                }
            }

            /**
             * Sets the profile pic of the user.
             */
            function setProfilePic() {
                if ($rootScope.userProfilePic) {
                    $scope.photoURL = $rootScope.userProfilePic;
                    $scope.croppedPhotoURL = $rootScope.userProfilePic;
                    return;
                }
                $scope.profilePicStatus = LOADING_STATUS;
                $scope.hasProfilePic = DealerPhotos.hasProfilePic($scope.profile.photo);
                var sender = 'dealer';
                if ($scope.hasProfilePic) {
                    DealerPhotos.getPhoto($scope.profile.photo, $scope.profile.id, sender);
                    $scope.profilePicStatus = LOADING_STATUS;
                }
                $scope.$on('downloaded-' + sender + '-dealer-pic-' + $scope.profile.id, function (event, args) {
                    if (args.success) {
                        $scope.$apply(function () {
                            $scope.croppedPhotoURL = args.data;
                            $scope.profilePicStatus = DOWNLOADED_STATUS;
                        });
                    } else {
                        $scope.profilePicStatus = FAILED_STATUS;
                        console.log(args.message);
                    }
                });
            }

            /**
             * Sets a couple of watchers and broadcasts listeners that are relevant for this controller.
             */
            function setWatchersAndListeners() {

                /**
                 * Listens to the DealerPhotos service's broadcasts when the dealer pic of the user has finished to upload.
                 */
                $scope.$on(PROFILE_PIC_BROADCASTING_PREFIX + EPR_SESSION, function (event, args) {
                    if (args.success) {
                        // Finished uploading the dealer pic, start uploading the bank account, and then the dealer object.
                        $scope.profile.photo = $rootScope.dealer.photo;
                        $rootScope.userProfilePic = $scope.croppedPhotoURL;
                        updateUserDetails();
                    } else {
                        hideLoadingDialog(event);
                        console.log("Couldn't upload the dealer pic. Aborting upload process.");
                    }
                });

                /**
                 * Listens to the Dealer service's broadcasts when the dealer's info has finished to upload.
                 */
                $scope.$on(UPDATE_BROADCASTING_PREFIX + EPR_SESSION, function (event, args) {
                    if (args.success) {
                        // Updated
                        console.log("Dealer was updated successfully!");
                        window.onbeforeunload = null;
                        $scope.editingDone = true;
                        hideLoadingDialog();
                        $location.path("/dealers/" + $scope.dealerID);
                    } else {
                        hideLoadingDialog(event);
                        if (args.message.data) {
                            if (args.message.data.account_number[0]) {
                                showAlertDialog(
                                    "Account number duplicate",
                                    "The account number you entered already exists. Please check your input again.",
                                    event);
                            } else {
                                showAlertDialog(
                                    "There was a problem...",
                                    "We're sorry, please try again!",
                                    event);
                            }
                        } else {
                            showAlertDialog(
                                "There was a problem...",
                                "We're sorry, please try again!",
                                event);
                        }
                    }
                });

                /**
                 * Watching for changes in the $scope.photoURL object so to know when to present the crop dialog for the dealer pic.
                 */
                $scope.$watch('photoURL', function () {
                    if ($scope.photoURL) {
                        if ($scope.photoURL.length > 0 && $scope.photoURL != $rootScope.userProfilePic) {
                            $scope.changedPhoto = true;
                            $scope.showCropDialog();
                        }
                    }
                });

                /**
                 * Watching for changes in the $scope.croppedPhotoURL object so the title of the button will change accordingly.
                 */
                $scope.$watch('croppedPhotoURL', function () {
                    if ($scope.croppedPhotoURL == ADD_PROFILE_PIC_BUTTON) {
                        $scope.editProfilePic = ADD_PHOTO_BUTTON_TITLE;
                    } else {
                        $scope.editProfilePic = CHANGE_PHOTO_BUTTON_TITLE;
                    }
                });
            }

            /**
             * Presents the crop dialog when the user wishes to upload a new dealer pic.
             */
            $scope.showCropDialog = function () {
                var useFullScreen = ($mdMedia('xs'));
                $mdDialog.show({
                    controller: "CropPhotoDialog",
                    templateUrl: 'app/components/views/crop-photo-dialog.view.html',
                    parent: angular.element(document.body),
                    fullscreen: useFullScreen,
                    locals: {rawPhoto: $scope.photoURL}
                })
                    .then(function (cropped) {
                        $scope.croppedPhotoURL = cropped;
                        clearPhotos();
                    }, function () {
                        clearPhotos();
                    });
            };

            /**
             * Presents the alert dialog when there is an invalid field.
             * @param title - the title of the alert dialog.
             * @param content - the content of the alert dialog.
             * @param ev - the event that triggered the alert.
             */
            function showAlertDialog(title, content, ev) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .clickOutsideToClose(true)
                        .title(title)
                        .textContent(content)
                        .ariaLabel('Alert Dialog')
                        .ok("Got it")
                        .targetEvent(ev)
                );
            }

            /**
             * Presents the loading dialog.
             * @param ev - the event that triggered the loading.
             */
            function showLoadingDialog(ev) {
                $mdDialog.show({
                    templateUrl: 'app/components/views/loading-dialog.view.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    controller: 'LoadingDialogController',
                    locals: {message: LOADING_MESSAGE},
                    escapeToClose: false
                });
            }

            /**
             * Hides the loading dialog.
             * @param ev - the event that triggered the hiding.
             */
            function hideLoadingDialog(ev) {
                $mdDialog.hide();
            }

            /**
             * Clears the photo data from the scope's variables.
             */
            function clearPhotos() {
                $scope.photo = "";
                $scope.photoURL = "";
            }

            /**
             * Opens the datepicker pop up.
             * @param event - the event that triggered the opening.
             */
            $scope.openDatepicker = function (event) {
                $scope.datepicker.opened = true;
            };

            /**
             * Converts the date from string representation to Date object.
             * @param dateString - the date represented as a string.
             * @returns {Date} - a Date object.
             * @constructor
             */
            $scope.Date = function (dateString) {
                return new Date(dateString);
            };

            /**
             * Validates the Basic Info of Viewer fields.
             * @param event - the event that triggered the validation.
             * @returns {boolean} - true if valid, else false.
             */
            function isViewerBasicInfoValid(event) {
                if (!$scope.profile.full_name) {
                    showAlertDialog("The name field is blank", "This field is required.", event);
                    return false;
                }
                return true;
            }

            /**
             * Validates the Basic Info of Dealer fields.
             * @param event - the event that triggered the validation.
             * @returns {boolean} - true if valid, else false.
             */
            function isDealerBasicInfoValid(event) {
                if (!$scope.profile.full_name) {
                    showAlertDialog("The name field is blank", "This field is required.", event);
                    return false;
                } else if (!$scope.profile.about) {
                    showAlertDialog("About field is blank", "This field is required.", event);
                    return false;
                } else if (!$scope.profile.location) {
                    showAlertDialog("Location field is blank", "This field is required.", event);
                    return false;
                }
                return true;
            }

            /**
             * Validates the Bank Info fields.
             * @param event - the event that triggered the validation.
             * @returns {boolean} - true if valid, else false.
             */
            function isBankInfoValid(event) {
                if (!$scope.bank_account.account_number) {
                    showAlertDialog("Account number is blank", "This field is required.", event);
                    return false;
                } else if (!$scope.bank_account.branch_number) {
                    showAlertDialog("Branch number is blank", "This field is required.", event);
                    return false;
                } else if (!$scope.bank_account.bank) {
                    showAlertDialog("The bank field is blank", "This field is required.", event);
                    return false;
                } else if (!$scope.bank_account.account_holder) {
                    showAlertDialog("Account holder name is blank", "This field is required.", event);
                    return false;
                }
                return true;
            }

            $scope.submitEdit = function (form) {
                if ($scope.userMode == VIEWER_MODE) {
                    if (!isViewerBasicInfoValid()) {
                        return;
                    }
                } else {
                    if (!isDealerBasicInfoValid()) {
                        return;
                    }
                    if (!isBankInfoValid()) {
                        return;
                    }
                }
                showLoadingDialog();
                if ($scope.changedPhoto) {
                    var croppedPhoto = Photos.dataURItoBlob($scope.croppedPhotoURL);
                    DealerPhotos.uploadPhoto(croppedPhoto, EPR_SESSION);
                } else {
                    updateUserDetails();
                }
            };

            /**
             * Calls the right update method in the Dealers service according to the role of the user.
             */
            function updateUserDetails() {
                if ($scope.userMode == VIEWER_MODE) {
                    Dealer.updateViewer($scope.profile, EPR_SESSION);
                } else {
                    Dealer.updateDealer($scope.bank_account, $scope.profile, EPR_SESSION);
                }
            }

            window.onbeforeunload = function () {
                return CONFIRM_EXIT_MESSAGE;
            };

            /**
             * Asks the user to confirm he wants to leave the Add Product process, explaining that it will cause the lost
             * of the data he entered.
             * @type {*|(function())}
             */
            $scope.$on('$locationChangeStart', function (event, next) {
                if (!$scope.editingDone) {
                    var answer = confirm("Are you sure you want to leave this page? The changes will be lost.");
                    if (!answer) {
                        event.preventDefault();
                    }
                }
            });

            $scope.$on('$destroy', function () {
                window.onbeforeunload = null;
                // $locationChangeStartUnbind();
            });
        }]);
angular.module('DealersApp')
/**
 *
 */
    .controller('HomeController', ['$scope', '$rootScope', '$location', '$mdDialog', '$mdMedia', 'Translations',
        function ($scope, $rootScope, $location, $mdDialog, $mdMedia, Translations) {

            var DEALERS_PATH = "/dealers/";
            var ALL_PRODUCTS_PATH = "/all-products/";
            var ROLE_DEALER = "Dealer";
            var ROLE_VIEWER = "Viewer";

            if ($rootScope.dealer) {
                $scope.role = $rootScope.dealer.role;
                if ($scope.role == ROLE_VIEWER) {
                    $location.path(ALL_PRODUCTS_PATH);
                } else if ($scope.role == ROLE_DEALER) {
                    $location.path(DEALERS_PATH + $rootScope.dealer.id + '/');
                }
            } else {
                $scope.role = $scope.roles.guest;
            }
            $scope.isHomePage = true;
            $scope.gridTitle = "";
            $scope.gridDescription = "";
            $scope.customFullscreen = $mdMedia('xs');

            setGridTitles();

            /**
             * Sets the title of the grid according to the role of the user.
             */
            function setGridTitles() {
                if ($scope.role == $rootScope.roles.guest) {
                    $scope.gridDescription = Translations.home.seeProducts;
                }
            }

            $rootScope.$on('$translateChangeSuccess', function () {
                $scope.gridDescription = Translations.home.seeProducts;
            });
        }]);
/**
 * Created by gullumbroso on 20/09/2016.
 */


angular.module('DealersApp')
    .controller('LoadingDialogController', ['$scope', 'message', function ($scope, message) {
            $scope.message = message;
        }]);
/**
 * Created by gullumbroso on 21/04/2016.
 */

angular.module('DealersApp')
/**
 * Manages the navigation bar and its presentation according to the user's role.
 */
    .controller('NavbarController', ['$scope', '$rootScope', '$location', '$routeParams', '$mdMedia', '$mdMenu',
        function ($scope, $rootScope, $location, $routeParams, $mdMedia, $mdMenu) {

            $scope.dealer = $rootScope.dealer;
            $scope.searchTerm = {};
            $scope.catDropdownDisplay = false;
            $scope.mode = ""; // Guest, Viewer, Dealer or Admin
            $scope.phoneMode = false;
            $scope.searchBarPresented = false;
            $scope.customFullscreen = $mdMedia('xs');

            determineMode();
            setMediaQueryWatchers();

            var currentPath = $location.path().split("/")[1];
            if (currentPath == "search") {
                $scope.searchTerm.text = $routeParams.query;
            }

            /**
             * Determines the mode of the navigation bar according to the user's role. Can be Guest mode, Viewer mode or Dealer mode.
             */
            function determineMode() {
                if (!$scope.dealer) {
                    $scope.mode = $scope.roles.guest;
                } else if ($scope.dealer.role == $scope.roles.admin) {
                    $scope.mode = $scope.roles.dealer;
                } else {
                    $scope.mode = $scope.dealer.role;
                }
            }

            function setMediaQueryWatchers() {
                $scope.$watch(function () {
                    return $mdMedia('xs');
                }, function (isPhone) {
                    $scope.phoneMode = isPhone;
                });

                $scope.$watch(function () {
                    return $mdMedia('sm');
                }, function (isTablet) {
                    $scope.tabletMode = isTablet;
                });
            }

            /**
             * Toggles the presentation of the navigation bar's search bar.
             * @param event - the event that triggered the function.
             */
            $scope.toggleSearchBar = function (event) {
                $scope.searchBarPresented = !$scope.searchBarPresented;
            };

            /**
             * Toggles an angular-material dropdown menu.
             * @param $mdOpenMenu - the menu to open.
             * @param $mdMenuIsOpen - a boolean value indicating if the menu is open.
             * @param ev - the event that triggered the function.
             */
            $scope.toggleMenu = function ($mdOpenMenu, $mdMenuIsOpen, ev) {
                if ($mdMenuIsOpen) {
                    $mdMenu.hide();
                } else {
                    $mdOpenMenu(ev);
                }

            };

            /**
             * Opens an angular-material dropdown menu.
             * @param $mdOpenMenu - the menu to open.
             * @param ev - the event that triggered the function.
             */
            $scope.openMenu = function ($mdOpenMenu, ev) {
                $mdOpenMenu(ev);
            };

            /**
             * Closes an angular-material dropdown menu.
             * @param ev - the event that triggered the function.
             */
            $scope.closeMenu = function (ev) {
                $mdMenu.hide();
            };

            /**
             * Takes the user to the product's View Deal page.
             */
            $scope.search = function (form) {
                $location.path('/search/products/' + $scope.searchTerm.text);
            };

            /**
             * Directs the user to the category page.
             * @param index
             */
            $scope.selectCategory = function (index) {
                var cat = $rootScope.categoriesLocal[index];
                $location.path('/categories/' + cat);
            };

            /**
             * Waits for the root scope to broadcast the user's dealer pic. (Obsolete)
             */
            function waitForProfilePic() {
                $scope.$on('downloaded-' + $rootScope.userProfilePicSender + '-dealer-pic-' + $rootScope.dealer.id, function (event, args) {
                    if (args.success) {
                        $scope.userProfilePic = args.data;
                    } else {
                        $scope.userProfilePic = null;
                        console.log(args.message);
                    }
                });
            }
        }]);
angular.module('DealersApp')
/**
 * The controller that manages the Product Grid view.
 */
    .controller('ProductsGridController', ['$scope', '$rootScope', '$routeParams', 'ActiveSession', 'Product', 'ProductsGrid', 'Translations',
        function ($scope, $rootScope, $routeParams, ActiveSession, Product, ProductsGrid, Translations) {

            var PROFILE_DEALER_AS_KEY = "profile_dealer_id";
            var PROFILE_AS_KEY = "profile_products";
            var PROFILE_PAGE = "dealer";
            var LOADING_STATUS = "loading";
            var DOWNLOADED_STATUS = "downloaded";
            var FAILED_STATUS = "failed";

            var mode;
            var url = $rootScope.baseUrl;
            var routeParams;
            var noProductsMessage;

            $scope.products = [];
            $scope.message = "";
            $scope.status = LOADING_STATUS;

            $scope.update = {};
            $scope.update.loadingMore = false;
            $scope.update.nextPage = "";
            $scope.getProducts = getProducts;

            selectAction();

            /**
             * Determines what to do according to the details defined in the scope.
             */
            function selectAction() {
                if ($scope.source) {
                    // There is a specific source to download products from.
                    if ($scope.page == PROFILE_PAGE) {
                        var dealerID = ActiveSession.getTempData(PROFILE_DEALER_AS_KEY);
                        var tempData = ActiveSession.getTempData(PROFILE_AS_KEY);
                        routeParams = $routeParams.dealerID;
                        if (dealerID == routeParams) {
                            if (tempData) {
                                mode = "activeSession";
                                noProductsMessage = "There are no products.";
                                $scope.status = DOWNLOADED_STATUS;
                                updateGrid(tempData);
                                return;
                            }
                        }
                    }
                    mode = "custom";
                    url = $scope.source;
                    noProductsMessage = Translations.productsGrid.noProducts;

                } else if ($routeParams.query) {
                    // This is a search session, should get the products according to the search term.
                    mode = "search";
                    routeParams = $routeParams.query;
                    url += '/dealsearch/?search=' + routeParams;
                    noProductsMessage = Translations.productsGrid.didntFind + "'" + routeParams + "'.";
                } else if ($routeParams.category) {
                    // This is a search session, should get the products according to the search term.
                    mode = "category";
                    routeParams = $routeParams.category;
                    if (routeParams == "All Categories" || routeParams == "All%20Categories") {
                        mode = "myFeed";
                        url += '/my_feeds/';
                    } else {
                        url += '/category_deals/?category=' + Product.keyForCategory(routeParams);
                    }
                    noProductsMessage = Translations.productsGrid.currentlyNoProducts + routeParams + "...";
                    $scope.title = Translations.translateCategory(routeParams);
                } else {
                    // This is a My Feed session, should get the products from the my-feed endpoint.
                    mode = "myFeed";
                    url += '/my_feeds/';
                    noProductsMessage = Translations.productsGrid.noProductsInterests;
                }

                $scope.getProducts();
            }

            /**
             * Downloads products from the server.
             * @param nextPage - indicates if downloading the next page from the same source.
             */
            function getProducts(nextPage) {

                // Checking if asking for another page
                if (nextPage) {
                    url = nextPage;
                }

                Product.getProducts(url)
                    .then(function (result) {
                        $scope.status = DOWNLOADED_STATUS;
                        var products;
                        if (result.data.results) {
                            products = result.data.results;
                        } else if (result.data.uploaded_deals) {
                            products = result.data.uploaded_deals;
                        }
                        $scope.update.nextPage = result.data.next;
                        updateGrid(products);
                        $scope.update.loadingMore = false;

                        if ($scope.page == PROFILE_PAGE) {
                            ActiveSession.setTempData(PROFILE_DEALER_AS_KEY, routeParams);
                            ActiveSession.setTempData(PROFILE_AS_KEY, products);
                        }

                    }, function (httpError) {
                        $scope.status = FAILED_STATUS;
                        $scope.message = "Couldn't download the products";
                        $scope.errorPrompt = "Please try again...";
                        $scope.update.loadingMore = false;
                    });
            }

            /**
             * Updates the products that are presented in the grid with the received array.
             * @param products - the products to present in the grid.
             */
            function updateGrid(products) {
                mapProductData(products);
                if (products.length > 0) {
                    $scope.products = ProductsGrid.addProductsToArray($scope.products, products);
                } else {
                    $scope.message = noProductsMessage;
                }
            }

            function getPageParams(nextPage) {
                var paramsIndex = nextPage.indexOf("page") + 1; // +1 to get rid of the redundant backslash before the questionmark
                var paramsString;
                if (paramsIndex != -1) {
                    paramsString = nextPage.substring(paramsIndex);
                }
                return paramsString;
            }

            function mapProductData(data) {
                /*
                 * Map the data that should be converted from server keys to regular strings.
                 */
                for (var i = 0; i < data.length; i++) {
                    var product = data[i];
                    product = Product.mapData(product);
                }
            }
        }]);
angular.module('DealersApp')
    .controller('ProfileController', ['$scope', '$rootScope', '$routeParams', '$location', 'Product', 'Dealer', 'DealerPhotos',
        function ($scope, $rootScope, $routeParams, $location, Product, Dealer, DealerPhotos) {
            /*
             * The controller that manages the dealers' Profile view.
             */

            var dealerID = $routeParams.dealerID;
            var dealerUrl = $rootScope.baseUrl;
            var ProductsUrl = $rootScope.baseUrl;
            var noDealsMessage;

            var GUEST_MODE = "guestMode";
            var MY_PROFILE_MODE = "myProfile";
            var OTHER_PROFILE_MODE = "otherProfile";
            var DEALER_DOWNLOADED = "dealerDownloaded";
            var DEALER_FAILED = "failed";
            var LOADING_STATUS = "loading";
            var DOWNLOAD_STATUS = "downloaded";
            var FAILED_STATUS = "failed";
            var VIEWER_ICON = "../../../../assets/images/icons/@2x/Web_Icons_viewer_icon.png";
            var DEALER_ICON = "../../../../assets/images/icons/@2x/Web_Icons_dealer_icon.png";
            var PRO_DEALER_ICON = "../../../../assets/images/icons/@2x/Web_Icons_pro_dealer_icon.png";
            var SENIOR_DEALER_ICON = "../../../../assets/images/icons/@2x/Web_Icons_senior_dealer_icon.png";
            var MASTER_DEALER_ICON = "../../../../assets/images/icons/@2x/Web_Icons_master_dealer_icon.png";

            $scope.profile = {dealer: null};
            $scope.uploadedProducts = [];
            $scope.profileMode = "";
            $scope.displayModes = {
                myProducts: "MY PRODUCTS",
                purchases: "SALES",
                orders: "ORDERS"
            };
            $scope.message = "";
            $scope.status = LOADING_STATUS;
            $scope.downloadDealerStatus = LOADING_STATUS;
            $scope.settings = ["Log Out"];
            $scope.settingsDisplay = false;

            // For the products-grid directive
            $scope.source = $rootScope.baseUrl + "/uploadeddeals/" + dealerID + "/";
            $scope.page = "profile";
            $scope.products = [];
            $scope.settingsToggle = settingsToggle;
            $scope.logOut = logOut;

            $scope.update = {};
            $scope.update.loadingMore = false;
            $scope.update.nextPage = "";
            $scope.getDealer = getDealer;
            $scope.setDealerProfile = setDealerProfile;
            $scope.getUploadedProducts = getUploadedProducts;
            $scope.changeDisplayPresentation = changeDisplayPresentation;
            $scope.changeDisplayToTab = changeDisplayToTab;

            if (location.href.endsWith("/sales")) {
                changeDisplay($scope.displayModes.purchases);
            } else if (location.href.endsWith("/orders")) {
                changeDisplay($scope.displayModes.orders);
            } else {
                changeDisplay($scope.displayModes.myProducts);
            }

            if (!$rootScope.dealer) {
                $scope.profileMode = GUEST_MODE;
            } else if (parseInt(dealerID) == $rootScope.dealer.id) {
                // The dealer is the user, can get his details from the root scope.
                $scope.profileMode = MY_PROFILE_MODE;
                $scope.profile.dealer = $rootScope.dealer;
                if ($scope.profile.dealer.role == $rootScope.roles.viewer) {
                    changeDisplay($scope.displayModes.orders);
                }
            } else {
                // The dealer is not the user.
                $scope.profileMode = OTHER_PROFILE_MODE;
                changeDisplay($scope.displayModes.myProducts);
            }
            dealerUrl += '/dealers/' + dealerID;

            $scope.getDealer(dealerID);

            function getDealer(dealerID) {
                /**
                 * Downloads the dealer's information if necessary.
                 */
                if ($scope.profile.dealer) {
                    // The dealer's information is already available.
                    $scope.downloadDealerStatus = DOWNLOAD_STATUS;
                    $scope.setDealerProfile();
                    return;
                }
                Dealer.getDealer(dealerID)
                    .then(function (result) {
                        $scope.profile.dealer = result.data;
                        $scope.downloadDealerStatus = DOWNLOAD_STATUS;
                        $scope.setDealerProfile();
                    }, function (httpError) {
                        $scope.message = "Couldn't download dealer's information";
                        $scope.errorPrompt = "Please try again...";
                    });
            }

            /**
             * Sets the profile header section and downloads the relevant products that are related to the dealer.
             */
            function setDealerProfile() {
                setProfilePic();
                setRank($scope.profile.dealer.rank);
                $scope.getUploadedProducts();
            }

            /**
             * Downloads the products that the dealer uploaded.
             */
            function getUploadedProducts(nextPage) {
                // Checking if asking for another page
                if (nextPage) {
                    ProductsUrl = nextPage;
                }

                ProductsUrl += '/uploadeddeals/' + $scope.profile.dealer.id + '/';

                Product.getProducts(ProductsUrl)
                    .then(function (result) {
                        $scope.status = DOWNLOAD_STATUS;
                        var products = result.data.uploaded_deals;
                        mapProductData(products);
                        if (products.length > 0) {
                            $scope.uploadedProducts.push.apply($scope.uploadedProducts, products);
                            $scope.update.nextPage = result.data.next;
                        } else {
                            $scope.message = noDealsMessage;
                        }
                        $scope.update.loadingMore = false;
                    }, function (httpError) {
                        $scope.status = FAILED_STATUS;
                        $scope.message = "Couldn't download the products";
                        $scope.errorPrompt = "Please try again...";
                        $scope.update.loadingMore = false;
                    });
            }

            function getPageParams(nextPage) {
                var paramsIndex = nextPage.indexOf("page") + 1; // +1 to get rid of the redundant backslash before the questionmark
                var paramsString;
                if (paramsIndex != -1) {
                    paramsString = nextPage.substring(paramsIndex);
                }
                return paramsString;
            }

            function mapProductData(data) {
                /*
                 * Map the data that should be converted from server keys to regular strings.
                 */
                for (var i = 0; i < data.length; i++) {
                    var product = data[i];
                    product = Product.mapData(product);
                }
            }

            function setProfilePic() {
                /**
                 * Sets the profile picture of the dealer.
                 */
                $scope.hasProfilePic = DealerPhotos.hasProfilePic($scope.profile.dealer.photo);
                var sender = 'profile';
                if ($scope.hasProfilePic) {
                    $scope.profilePic = "";
                    DealerPhotos.getPhoto($scope.profile.dealer.photo, $scope.profile.dealer.id, sender);
                    $scope.profilePicStatus = LOADING_STATUS;
                }
                $scope.$on('downloaded-' + sender + '-dealer-pic-' + $scope.profile.dealer.id, function (event, args) {
                    if (args.success) {
                        $scope.$apply(function () {
                            $scope.profilePic = args.data;
                            $scope.profilePicStatus = DOWNLOAD_STATUS;
                        });
                    } else {
                        console.log(args.message);
                    }
                });
            }

            function settingsToggle() {
                /**
                 * Toggles the display of the settings dropdown.
                 */
                if ($scope.settingsDisplay) {
                    $scope.settingsDisplay = false;
                } else {
                    $scope.settingsDisplay = true;
                }
            }

            /**
             * Opens an angular-material dropdown menu.
             * @param $mdOpenMenu - the menu to open.
             * @param ev - the event that triggered the function.
             */
            $scope.openMenu = function ($mdOpenMenu, ev) {
                $mdOpenMenu(ev);
            };

            $scope.editProfile = function (event) {
                $location.path("/edit-profile/" + dealerID);
            };

            function logOut() {
                Dealer.logOut();
                $location.path('/');
            }

            function changeDisplayPresentation(element) {
                var activeClass = "active";
                $(element).addClass(activeClass);
                $(element).siblings().removeClass(activeClass);
            }

            function changeDisplayToTab(selectedTab) {
                if (selectedTab == "myProducts") {
                    changeDisplay($scope.displayModes.myProducts);
                } else if (selectedTab == "sales") {
                    changeDisplay($scope.displayModes.purchases);
                } else if (selectedTab == "orders") {
                    changeDisplay($scope.displayModes.orders);
                }

            }

            function changeDisplay(displayMode) {
                $scope.displayMode = displayMode;
                var pathSuffix = "/dealers/" + dealerID;
                if (displayMode == $scope.displayModes.purchases) {
                    pathSuffix += "/" + $scope.displayModes.purchases.toLowerCase();
                } else if (displayMode == $scope.displayModes.orders) {
                    pathSuffix += "/" + $scope.displayModes.orders.toLowerCase();
                }
                if ($location.path() != pathSuffix) {
                    $location.path(pathSuffix);
                }
            }

            function setRank(rank) {
                var iconUrl;
                var iconClass;
                if (rank == "Viewer") {
                    iconUrl = VIEWER_ICON;
                    iconClass = "viewerIcon";
                } else if (rank == "Dealer") {
                    iconUrl = DEALER_ICON;
                    iconClass = "dealerIcon";
                } else if (rank == "Pro Dealer") {
                    iconUrl = PRO_DEALER_ICON;
                    iconClass = "proDealerIcon";
                } else if (rank == "Senior Dealer") {
                    iconUrl = SENIOR_DEALER_ICON;
                    iconClass = "seniorDealerIcon";
                } else if (rank == "Master Dealer") {
                    iconUrl = MASTER_DEALER_ICON;
                    iconClass = "masterDealerIcon";
                }
                $scope.rankIcon = iconUrl;
                $scope.rankClass = iconClass;
            }
        }]);
/**
 * Created by gullumbroso on 09/07/2016.
 */


angular.module('DealersApp')
/**
 * The controller that is responsible for checkout's view behaviour.
 * @param $scope - the isolated scope of the controller.
 * @param $mdDialog - the mdDialog service of the Material Angular library.
 */
    .controller('PurchaseDetailsController', ['$scope', '$rootScope', '$routeParams', '$location', '$mdDialog', '$mdMedia', 'ActiveSession', 'Purchase', 'Product', 'Dealer', 'ShippingMethods', 'Translations',
        function ($scope, $rootScope, $routeParams, $location, $mdDialog, $mdMedia, ActiveSession, Purchase, Product, Dealer, ShippingMethods, Translations) {

            var DOWNLOADED_STATUS = "downloaded";
            var DOWNLOADING_STATUS = "downloading";
            var FAILED_STATUS = "failed";
            var ACTIVE_SESSION_PURCHASE_KEY = "PURCHASE";

            $scope.downloadedDelivery = false;

            initializeView();

            function initializeView() {
                $scope.status = DOWNLOADING_STATUS;
                $scope.screenIsSmall = $mdMedia('xs');
                $scope.purchase = ActiveSession.getTempData(ACTIVE_SESSION_PURCHASE_KEY); // Retrieves the product from the Active Session service.
                $scope.isDealer = false; // Whether the user is the dealer of this purchase or not.
                if (!$scope.purchase) {
                    // There is no purchase in the session, download it form the server.
                    downloadPurchase();
                } else {
                    $scope.status = DOWNLOADED_STATUS;
                    setPurchaseDetails();
                }
            }

            function downloadPurchase() {
                var purchaseID = $routeParams.purchaseID;
                Purchase.getPurchase(purchaseID)
                    .then(function (result) {
                        $scope.status = DOWNLOADED_STATUS;
                        $scope.purchase = result.data;
                        setPurchaseDetails();
                    }, function (httpError) {
                        $scope.status = FAILED_STATUS;
                        $scope.errorMessage = "Couldn't download the purchase object.";
                        $scope.errorPrompt = "Please try again...";
                    });
            }

            function downloadDelivery() {
                ShippingMethods.getDelivery($scope.purchase.delivery)
                    .then(function (response) {
                        $scope.delivery = response.data;
                        $scope.delivery = ShippingMethods.convertDeliveryFromServer($scope.delivery);
                        $scope.downloadedDelivery = true;
                    }, function (err) {
                        console.log("There was an error while downloading the delivery method: " + err.data);
                    });
            }

            function setPurchaseDetails() {
                $scope.shipping_address = $scope.purchase.shipping_address;
                downloadDelivery();
                if (!$scope.purchase.buyer.id) {
                    // purchase.buyer contains the id of the buyer. Need to download his name and photo.
                    Dealer.getShortDealer($scope.purchase.buyer)
                        .then(function (result) {
                            $scope.purchase.buyer = result.data;
                        }, function (httpError) {
                            console.log("Couldn't download the buyer's name and photo.");
                        })
                }
                var dealerID = $scope.purchase.dealer.id ? $scope.purchase.dealer.id : $scope.purchase.dealer;
                $scope.isDealer = dealerID == $rootScope.dealer.id;
                var key = $scope.purchase.currency;
                $scope.purchase.currency = Product.currencyForKey(key);
                if ($scope.purchase.deal.id) {
                    downloadProduct($scope.purchase.deal.id);
                } else {
                    downloadProduct($scope.purchase.deal);
                }
            }

            function downloadProduct(productID) {
                Product.getProduct(productID)
                    .then(function (result) {
                        $scope.product = result.data;
                        $scope.product = Product.mapData($scope.product);
                    }, function (httpError) {
                        $scope.status = FAILED_STATUS;
                        $scope.errorMessage = "Couldn't download the product";
                        $scope.errorPrompt = "Please try again...";
                    });
            }

            /**
             * Set the title of the mark button according to the status of the purchase object.
             * @param purchase - the purchase object.
             * @returns {string} the title of the button.
             */
            $scope.markButtonTitle = function (purchase) {
                if (!purchase) return "";
                if ($scope.isDealer) {
                    if (purchase.status == Purchase.SENT_STATUS) {
                        return Translations.purchaseDetails.sent;
                    } else if (purchase.status == Purchase.RECEIVED_STATUS) {
                        return Translations.purchaseDetails.received
                    } else {
                        return Translations.purchaseDetails.markSent;
                    }
                } else {
                    if (purchase.status == Purchase.RECEIVED_STATUS) {
                        return Translations.purchaseDetails.received;
                    } else {
                        return Translations.purchaseDetails.markReceived;
                    }
                }
            };

            /**
             * Returns the appropriate representation of the purchase's status.
             * @param purchase - the purchase.
             * @returns {string} the representation.
             */
            $scope.parseForPresentation = function (purchase) {
                if (purchase.status == Purchase.PURCHASED_STATUS) {
                    return Translations.purchaseDetails.purchased;
                } else if (purchase.status == Purchase.SENT_STATUS) {
                    return Translations.purchaseDetails.sent;
                } else if (purchase.status == Purchase.RECEIVED_STATUS) {
                    return Translations.purchaseDetails.received;
                }
            };

            $scope.$on('$destroy', function () {
                ActiveSession.removeTempData(ACTIVE_SESSION_PURCHASE_KEY);
            });

        }]);
/**
 * Created by gullumbroso on 24/04/2016.
 */

angular.module('DealersApp')
/**
 * The controller that is responsible for dialogs's behaviour.
 * @param $scope - the isolated scope of the controller.
 * @param $mdDialog - the mdDialog service of the Material Angular library.
 */
    .controller('RegisterAsDealerController', ['$scope', '$rootScope', '$location', '$mdDialog', '$mdMedia', 'Dealer', 'DealerPhotos', 'Photos', 'Translations',
        function ($scope, $rootScope, $location, $mdDialog, $mdMedia, Dealer, DealerPhotos, Photos, Translations) {

            var RAD_SESSION = "register-as-dealer-session";
            var GENERAL_TAB_INDEX = 0;
            var BANK_TAB_INDEX = 1;
            var ADD_PROFILE_PIC_BUTTON = "/assets/images/icons/@2x/Web_Icons_add_profile_pic_button.png";
            var PROFILE_PIC_BROADCASTING_PREFIX = 'dealer-pic-uploaded-for-';
            var REGISTER_BROADCASTING_PREFIX = 'register-as-dealer-for-';

            $scope.photo = "";
            $scope.photoURL = "";
            $scope.croppedPhotoURL = ADD_PROFILE_PIC_BUTTON;
            $scope.registrationDone = false;

            $scope.dealer = $rootScope.dealer;
            $scope.bank_account = {};

            setWatchersAndListeners();

            /**
             * This function is being called each time one of the tabs are being selected.
             * @param tab - the selected tab.
             */
            $scope.onTabSelected = function (tab) {
                if (tab == 0) {
                    $scope.submitButtonTitle = Translations.dealerRegistration.next;
                } else {
                    $scope.submitButtonTitle = Translations.dealerRegistration.done;
                }
            };

            /**
             * Validates the General Info fields.
             * @param event - the event that triggered the validation.
             * @returns {boolean} - true if valid, else false.
             */
            function isGeneralInfoValid(event) {
                if ($scope.croppedPhotoURL == ADD_PROFILE_PIC_BUTTON) {
                    showAlertDialog(Translations.dealerRegistration.missingPhotoTitle, Translations.dealerRegistration.missingPhotoContent, event);
                    return false;
                } else if (!$scope.dealer.about) {
                    showAlertDialog(Translations.dealerRegistration.blankAboutTitle, Translations.dealerRegistration.requiredField, event);
                    return false;
                } else if (!$scope.dealer.location) {
                    showAlertDialog(Translations.dealerRegistration.blankLocationTitle, Translations.dealerRegistration.requiredField, event);
                    return false;
                }
                return true;
            }

            /**
             * Validates the Bank Info fields.
             * @param event - the event that triggered the validation.
             * @returns {boolean} - true if valid, else false.
             */
            function isBankInfoValid(event) {
                if (!$scope.bank_account.account_number) {
                    showAlertDialog(Translations.dealerRegistration.blankAccountNumberTitle, Translations.dealerRegistration.requiredField, event);
                    return false;
                } else if (!$scope.bank_account.branch_number) {
                    showAlertDialog(Translations.dealerRegistration.blankBranchNumberTitle, Translations.dealerRegistration.requiredField, event);
                    return false;
                } else if (!$scope.bank_account.bank) {
                    showAlertDialog(Translations.dealerRegistration.blankBankTitle, Translations.dealerRegistration.requiredField, event);
                    return false;
                } else if (!$scope.bank_account.account_holder) {
                    showAlertDialog(Translations.dealerRegistration.blankAccountHolderTitle, Translations.dealerRegistration.requiredField, event);
                    return false;
                }
                return true;
            }

            /**
             * Sets a couple of watchers and broadcasts listeners that are relevant for this controller.
             */
            function setWatchersAndListeners() {

                /**
                 * Listens to the DealerPhotos service's broadcasts when the dealer pic of the user has finished to upload.
                 */
                $scope.$on(PROFILE_PIC_BROADCASTING_PREFIX + RAD_SESSION, function (event, args) {
                    if (args.success) {
                        // Finished uploading the dealer pic, start uploading the bank account, and then the dealer object.
                        $rootScope.userProfilePic = $scope.croppedPhotoURL;
                        Dealer.registerDealer($scope.bank_account, RAD_SESSION);
                    } else {
                        hideLoadingDialog(event);
                        console.log("Couldn't upload the dealer pic. Aborting upload process.");
                    }
                });

                /**
                 * Listens to the Dealer service's broadcasts when the dealer's info has finished to upload.
                 */
                $scope.$on(REGISTER_BROADCASTING_PREFIX + RAD_SESSION, function (event, args) {
                    if (args.success) {
                        // Registered
                        console.log("Dealer is registered successfully!");
                        window.onbeforeunload = null;
                        $scope.registrationDone = true;
                        hideLoadingDialog();
                        $location.path("/done-registration");
                    } else {
                        hideLoadingDialog(event);
                        if (args.message.data) {
                            if (args.message.data.account_number[0]) {
                                showAlertDialog(
                                    Translations.dealerRegistration.accountNumberDuplicateTitle,
                                    Translations.dealerRegistration.accountNumberDuplicateContent,
                                    event);
                            } else {
                                showAlertDialog(
                                    Translations.dealerRegistration.generalProblemTitle,
                                    Translations.dealerRegistration.generalProblemContent,
                                    event);
                            }
                        } else {
                            showAlertDialog(
                                Translations.dealerRegistration.generalProblemTitle,
                                Translations.dealerRegistration.generalProblemContent,
                                event);
                        }
                    }
                });

                /**
                 * Watching for changes in the $scope.photoURL object so to know when to present the crop dialog for the dealer pic.
                 */
                $scope.$watch('photoURL', function () {
                    if ($scope.photoURL) {
                        if ($scope.photoURL.length > 0) {
                            $scope.showCropDialog();
                        }
                    }
                });

                /**
                 * Watching for changes in the $scope.croppedPhotoURL object so the title of the button will change accordingly.
                 */
                $scope.$watch('croppedPhotoURL', function () {
                    if ($scope.croppedPhotoURL == ADD_PROFILE_PIC_BUTTON) {
                        $scope.editProfilePic = Translations.dealerRegistration.addPhoto;
                    } else {
                        $scope.editProfilePic = Translations.dealerRegistration.changePhoto;
                    }
                });

                /**
                 * Watching for changes in the media settings (width of browser window).
                 */
                $scope.$watch(function () {
                    return $mdMedia('xs');
                });
            }

            /**
             * Presents the alert dialog when there is an invalid field.
             * @param title - the title of the alert dialog.
             * @param content - the content of the alert dialog.
             * @param ev - the event that triggered the alert.
             */
            function showAlertDialog(title, content, ev) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .clickOutsideToClose(true)
                        .title(title)
                        .textContent(content)
                        .ariaLabel('Alert Dialog')
                        .ok(Translations.general.gotIt)
                        .targetEvent(ev)
                );
            }

            /**
             * Presents the crop dialog when the user wishes to upload a new dealer pic.
             */
            $scope.showCropDialog = function () {
                var useFullScreen = ($mdMedia('xs'));
                $mdDialog.show({
                    controller: "CropPhotoDialog",
                    templateUrl: 'app/components/views/crop-photo-dialog.view.html',
                    parent: angular.element(document.body),
                    fullscreen: useFullScreen,
                    locals: {rawPhoto: $scope.photoURL}
                })
                    .then(function (cropped) {
                        $scope.croppedPhotoURL = cropped;
                        clearPhotos();
                    }, function () {
                        clearPhotos();
                    });
            };

            /**
             * Presents the loading dialog.
             * @param ev - the event that triggered the loading.
             */
            function showLoadingDialog(ev) {
                $mdDialog.show({
                    templateUrl: 'app/components/views/loading-dialog.view.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    controller: 'LoadingDialogController',
                    locals: {message: Translations.dealerRegistration.uploading},
                    escapeToClose: false
                });
            }

            /**
             * Hides the loading dialog.
             * @param ev - the event that triggered the hiding.
             */
            function hideLoadingDialog(ev) {
                $mdDialog.hide();
            }

            /**
             * Clears the photo data from the scope's variables.
             */
            function clearPhotos() {
                $scope.photo = "";
                $scope.photoURL = "";
            }

            /**
             * Starts the registration process when the user finished filling the form.
             * @param registerAsDealerForm - the form.
             */
            $scope.register = function (registerAsDealerForm) {
                if ($scope.selectedTab == GENERAL_TAB_INDEX) {
                    $scope.selectedTab = BANK_TAB_INDEX;
                    return;
                }
                if (!isGeneralInfoValid()) {
                    return;
                }
                if (!isBankInfoValid()) {
                    return;
                }
                $scope.bank_account.dealer = $scope.dealer.id;
                showLoadingDialog();
                var croppedPhoto = Photos.dataURItoBlob($scope.croppedPhotoURL);
                DealerPhotos.uploadPhoto(croppedPhoto, RAD_SESSION);
            };

            window.onbeforeunload = function () {
                return Translations.dealerRegistration.contentWillBeLost;
            };

            /**
             * Asks the user to confirm he wants to leave the Register As a Dealer process, explaining that it will cause the lost
             * of the data he entered.
             * @type {*|(function())}
             */
            $scope.$on('$locationChangeStart', function (event, next) {
                if (!$scope.registrationDone) {
                    var answer = confirm(Translations.dealerRegistration.contentWillBeLostFullMessage);
                    if (!answer) {
                        event.preventDefault();
                    }
                }
            });

            $rootScope.$on('$translateChangeSuccess', function () {
                $scope.editProfilePic = Translations.dealerRegistration.addPhoto;
                $scope.submitButtonTitle = Translations.dealerRegistration.next;
            });

            $scope.$on('$destroy', function () {
                window.onbeforeunload = null;
            });
        }]);
/**
 * Created by gullumbroso on 22/04/2016.
 */

angular.module('DealersApp')
/**
 * The controller that is responsible for dialogs's behaviour.
 * @param $scope - the isolated scope of the controller.
 * @param $mdDialog - the mdDialog service of the Material Angular library.
 */
    .controller('SignInDialogController', ['$scope', '$rootScope', '$mdDialog', 'Dealer', 'tab', 'isViewer', 'Translations',
        function ($scope, $rootScope, $mdDialog, Dealer, tab, isViewer, Translations) {

            var SIGN_UP_TAB_INDEX = 0;
            var LOG_IN_TAB_INDEX = 1;

            $scope.selectedTab = tab; // 0 - Sign Up; 1 - Log In;
            $scope.selectedOperation = tab;
            $scope.datepicker = {
                opened: false,
                options: {
                    formatYear: 'yyyy',
                    maxDate: new Date(),
                    showWeeks: false
                }
            };
            $scope.maxDate = new Date();
            $scope.logIn = {};
            $scope.dealer = {
                full_name: "",
                email: "",
                user: {
                    username: "",
                    password: ""
                },
                date_of_birth: null,
                gender: "",
                register_date: null,
                role: "Viewer"
            };

            hideError();
            setBroadcastListeners();

            $scope.signUp = function (form) {
                if (!form.$valid) {
                    showError(Translations.signIn.invalidFields);
                    return;
                } else {
                    $scope.showError = false;
                    $scope.buttonTitle = Translations.signIn.loading;
                }
                var dealer = $scope.dealer;
                var subEmail = dealer.email;
                if (subEmail > 30) {
                    dealer.user.username = subEmail.substring(0, 30);
                } else {
                    dealer.user.username = subEmail;
                }
                if (!dealer.gender) {
                    dealer.gender = "Unspecified";
                }
                dealer.bank_accounts = [];
                dealer.credit_cards = [];
                dealer.register_date = new Date();
                Dealer.create(dealer);
            };

            $scope.logIn = function (form) {
                if (!form.$valid) {
                    if (!form.email.$viewValue || form.email.$viewValue === "") {
                        showError(Translations.signIn.blankEmail);
                    } else if (form.email.$invalid) {
                        showError(Translations.signIn.invalidEmail);
                    } else if (!form.password.$viewValue || form.password.$viewValue === "") {
                        showError(Translations.signIn.blankPassword);
                    } else {
                        showError(Translations.signIn.invalidFields);
                    }
                    return;
                } else {
                    $scope.showError = false;
                    $scope.buttonTitle = Translations.signIn.loading;
                }

                Dealer.logIn($scope.logIn.email, $scope.logIn.password);
            };

            $scope.submit = function (event, signUpForm, logInForm) {
                if ($scope.selectedTab == SIGN_UP_TAB_INDEX) {
                    $scope.signUp(signUpForm);
                } else {
                    $scope.logIn(logInForm);
                }
            };

            $scope.onTabSelected = function (tab) {
                if (tab == SIGN_UP_TAB_INDEX) {
                    $scope.buttonTitle = Translations.signIn.signUpButtonTitle;
                    if (isViewer) {
                        ga('send', 'pageview', '/viewer-sign-up');
                    } else {
                        ga('send', 'pageview', '/dealer-sign-up');
                    }
                } else {
                    $scope.buttonTitle = Translations.signIn.logInButtonTitle;
                    ga('send', 'pageview', '/log-in');
                }
            };

            function showError(message) {
                if ($scope.selectedTab == SIGN_UP_TAB_INDEX) {
                    $scope.buttonTitle = Translations.signIn.signUpButtonTitle;
                } else {
                    $scope.buttonTitle = Translations.signIn.logInButtonTitle;
                }
                $scope.errorMessage = message;
                $scope.showError = true;
            }

            function hideError() {
                if ($scope.selectedTab == SIGN_UP_TAB_INDEX) {
                    $scope.buttonTitle = Translations.signIn.signUpButtonTitle;
                } else {
                    $scope.buttonTitle = Translations.signIn.logInButtonTitle;
                }
                $scope.errorMessage = "";
                $scope.showError = false;
            }

            function setBroadcastListeners() {

                // When sign up is done
                $scope.$on('sign-up', function (event, args) {
                    if (args.success) {
                        console.log("User has signed up successfully!");
                        $scope.selectedOperation = 0;
                    } else {
                        var message = args.message.data;
                        if (message.detail) {
                            showError(message.detail);
                        } else if (message.user[0].username[0]) {
                            showError(message.user[0].username[0]);
                        } else {
                            showError(message);
                        }
                    }
                });

                // When the log in is done
                $scope.$on('log-in', function (event, args) {
                    if (args.success) {
                        console.log("User has logged in successfully!");
                        $scope.selectedOperation = 1;
                    } else {
                        var message = args.message.data.detail;
                        showError(message);
                    }
                });

                // When the credentials are set in the default header of the $http service.
                $scope.$on('credentials-set', function (event, args) {
                    if (args.success) {
                        hideError();
                        $scope.enter($scope.selectedOperation);
                    } else {
                        console.log("Couldn't get token: " + String(args.message));
                        showError(Translations.signIn.generalProblem);
                    }
                });
            }

            /**
             * Opens the datepicker pop up.
             * @param event - the event that triggered the opening.
             */
            $scope.openDatepicker = function (event) {
                $scope.datepicker.opened = true;
            };

            /**
             * Enters the system with the finished operation received as an argument.
             * @param op - The finished operation.
             */
            $scope.enter = function (op) {
                $rootScope.setUserProfilePic();
                Dealer.setIntercom($rootScope.dealer);
                $scope.hide(op);
            };

            $scope.hide = function (op) {
                $mdDialog.hide(op);
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };
        }]);

angular.module('DealersApp')
    .controller('ViewDealController',
        ['$scope', '$rootScope', '$http', '$routeParams', '$route', '$location', '$timeout', '$mdDialog', '$mdMedia', 'Product', 'ProductPhotos', 'DealerPhotos', 'ActiveSession', 'EditProduct', 'Dialogs', 'Checkout', 'Translations',
            function ($scope, $rootScope, $http, $routeParams, $route, $location, $timeout, $mdDialog, $mdMedia, Product, ProductPhotos, DealerPhotos, ActiveSession, EditProduct, Dialogs, Checkout, Translations) {

                var ctrl = this;

                var PRODUCT_URL = $rootScope.baseUrl + '/alldeals/' + $routeParams.productID + '/';
                var PRODUCT_PAGE_BASE_URL = $rootScope.baseUrl + '/products/';
                var BUY_FUNCTION_REPR = "buyClicked";
                var PRODUCT_AS_KEY = "PRODUCT";

                $scope.product = {};
                $scope.status = 'loading';
                $scope.productPhotosStatus = [];
                $scope.photosURLs = [];
                $scope.profilePicStatus = 'loading';
                $scope.hasProfilePic = false;
                $scope.variants = [];
                $scope.purchase = {
                    selections: [],
                    quantity: 1
                };
                $scope.user = $rootScope.dealer;
                $scope.totalLikes = 0;
                $scope.firstPhotoSelected = false;
                $scope.movedToCheckout = false;

                $scope.commentPlaceholder = "";
                $scope.comment = {};
                $scope.showCommentError = false;
                $scope.commentErrorMessage = Translations.viewDeal.blankComment;
                $scope.showCommentButton = false;

                $scope.selectPhoto = selectPhoto;
                $scope.changeThumbnailSelection = changeThumbnailSelection;
                $scope.checkIfActive = checkIfActive;
                $scope.addComment = addComment;
                $scope.presentCommentError = presentCommentError;
                $scope.proceedToCheckout = proceedToCheckout;
                $scope.showAlertDialog = showAlertDialog;

                $scope.$watch(function () {
                    return $mdMedia('gt-sm');
                }, function (big) {
                    $scope.bigScreen = big;
                });

                $scope.product = ActiveSession.getTempData(PRODUCT_AS_KEY); // Retrieves the product from the Active Session service.
                if (!$scope.product || EditProduct.isAfterEdit) {
                    // There is no product in the session, or the is not an updated one. Download it form the server.
                    downloadProduct();
                    EditProduct.isAfterEdit = false;
                } else if ($scope.product.id != $routeParams.productID) {
                    downloadProduct();
                } else {
                    $scope.status = 'downloaded';

                    // Check if should go to the checkout view (in case the user signed up in order to buy the product).
                    if (ActiveSession.shouldRunAction(BUY_FUNCTION_REPR)) {
                        proceedToCheckout();
                    }

                    fillData();
                }

                function downloadProduct() {
                    var productID = $routeParams.productID;
                    Product.getProduct(productID)
                        .then(function (result) {
                            $scope.status = 'downloaded';
                            $scope.product = result.data;
                            $scope.product = Product.mapData($scope.product);

                            // Check if should go to the checkout view (in case the user signed up in order to buy the product).
                            if (ActiveSession.shouldRunAction(BUY_FUNCTION_REPR)) {
                                proceedToCheckout();
                            }

                            fillData();
                        }, function (httpError) {
                            $scope.status = 'failed';
                            $scope.errorMessage = Translations.viewDeal.downloadFailed;
                            $scope.errorPrompt = "Please try again...";
                        });
                }

                /**
                 * Injects the product's data into the view.
                 */
                function fillData() {
                    setProductPhotos();
                    setDealerProfile();

                    $scope.firstPhotoHeight = $scope.product.main_photo_height;
                    $scope.variants = Product.parseVariantsFromServer($scope.product.variants);
                    $scope.totalLikes = $scope.product.dealattribs.dealers_that_liked.length;

                    // Comments (only if the user has a dealer object, meaning he's signed in)
                    if ($scope.user) {
                        if ($scope.product.comments.length > 1) {
                            $scope.commentPlaceholder = Translations.viewDeal.addComment;
                        } else {
                            $scope.commentPlaceholder = Translations.viewDeal.addFirstComment;
                        }
                    }
                }

                /**
                 * Takes care of presenting the photos in the carousel.
                 */
                function setProductPhotos() {
                    ProductPhotos.downloadPhotos($scope.product);
                    for (var i = 0; i < ProductPhotos.photosNum($scope.product); i++) {
                        $scope.productPhotosStatus.push("loading");
                        $scope.photosURLs.push($rootScope.DEFAULT_PRODUCT_PHOTO_URL);
                    }
                    $scope.$on('downloaded-photo-' + $scope.product.id, function (event, args) {
                        var data = args.data;
                        var index = data.photoIndex - 1;
                        if (args.success) {
                            $scope.photosURLs[index] = data.url;
                            $scope.productPhotosStatus[index] = "doneLoading";
                            if (!$scope.firstPhotoSelected) {
                                $scope.selectPhoto(0);
                                $scope.firstPhotoSelected = true;
                            }
                            $scope.$apply();
                        } else {
                            console.log("Photos number " + data.photoIndex + " failed to download: \n" + data.message);
                            $scope.productPhotosStatus[index] = "failed";
                        }
                    });
                }

                /**
                 * Changes the presented photo in the photo container.
                 * @param index - the index of the new selected photo.
                 */
                function selectPhoto(index) {
                    $scope.selectedIndex = index;
                    $scope.changeThumbnailSelection(index);
                    $timeout(function () {
                        $('.carousel-inner div').each(function (i) {
                            if ($scope.selectedIndex == i) {
                                $(this).addClass("active");
                            } else {
                                $(this).removeClass("active");
                            }
                        });
                    }, 100);
                }

                /**
                 * Checks if the photo element in the received index has the 'active' class.
                 * @param index - the index of the photo element.
                 * @returns {boolean} - True if the photo element has the 'active' class, false otherwise.
                 */
                function checkIfActive(index) {
                    var carousel = $("div.carousel-inner");
                    var photos = carousel.children();
                    return $(photos[index]).hasClass("active");
                }

                /**
                 * Changes the selection mark to the photo thumbnail with the received index.
                 * @param index - the index of the new selected thumbnail.
                 */
                function changeThumbnailSelection(index) {
                    $('div.ap-thumbnail').removeClass('selected');
                    $('li#' + index + " div.ap-thumbnail").addClass('selected');
                }

                /**
                 * The bootstrap carousel chevron button was clicked. Checks which chevron button was clicked, left or right,
                 * and changes the selected photo accordingly.
                 */
                $scope.nextPhoto = function (event) {
                    var chevronButton;
                    if (event.target.tagName == "A") {
                        // The anchor tag was clicked, set it as the chevron button.
                        chevronButton = event.target;
                    } else {
                        // The span tag was clicked, the anchor tag child. Get its parent (the anchor tag).
                        chevronButton = event.target.parentElement;
                    }
                    var photosNum = $scope.photosURLs.length;
                    var index;

                    if (!$scope.checkIfActive($scope.selectedIndex)) {
                        // The current photo doesn't have the 'active' class yet, which means the slide animation isn't finished
                        // yet.
                        return;
                    }

                    if ($(chevronButton).hasClass("left")) {
                        index = $scope.selectedIndex - 1;
                        if (index < 0) {
                            index = photosNum - 1;
                        }
                    } else if ($(chevronButton).hasClass("right")) {
                        index = $scope.selectedIndex + 1;
                        if (index >= photosNum) {
                            index = 0;
                        }
                    }
                    $scope.selectPhoto(index);
                };

                $scope.$watchGroup(
                    ["photos[0]", "photos[1]", "photos[2]", "photos[3]"],
                    function handleImageChange(newValue, oldValue) {
                        for (var i = 0; i < newValue.length; i++) {
                            if (newValue[i] != null && oldValue[i] == null) {
                                // A new photo was added at the index <i>. Set it in the main image view.
                                $scope.selectPhoto(i);
                            }
                        }
                    }
                );

                function setDealerProfile() {
                    /*
                     * Arranges the dealer's dealer section.
                     */
                    var photo = $scope.product.dealer.photo;
                    var sender = 'view-deal';
                    $scope.hasProfilePic = DealerPhotos.hasProfilePic(photo);
                    if ($scope.hasProfilePic) {
                        $scope.profilePic = "";
                        DealerPhotos.getPhoto(photo, $scope.product.dealer.id, sender);
                        $scope.profilePicStatus = "loading";
                    }
                    $scope.$on('downloaded-' + sender + '-dealer-pic-' + $scope.product.dealer.id, function (event, args) {
                        if (args.success) {
                            $scope.profilePic = args.data;
                            $scope.profilePicStatus = "doneLoading";
                        } else {
                            console.log(args.message);
                            $scope.profilePicStatus = "failed";
                        }
                    });
                }

                $scope.canEdit = function () {
                    if ($scope.user) {
                        if ($scope.product.dealer.id == $rootScope.dealer.id) {
                            return true;
                        }
                    }
                    return false;
                };

                $scope.editProduct = function () {
                    if ($scope.canEdit()) {
                        EditProduct.product = $scope.product;
                        $location.path("edit-product/" + $scope.product.id);
                    }
                };

                /**
                 * Opens an angular-material dropdown menu.
                 * @param $mdOpenMenu - the menu to open.
                 * @param ev - the event that triggered the function.
                 */
                $scope.openMenu = function ($mdOpenMenu, ev) {
                    $mdOpenMenu(ev);
                };

                $scope.report = function (event) {
                    console.log("Report!");
                };

                /**
                 * Asks the user to confirm he wants to delete the product.
                 * @param event - the event that triggered the function.
                 */
                $scope.deleteProduct = function (event) {
                    var confirm = $mdDialog.confirm()
                        .title(Translations.viewDeal.deleteProductTitle)
                        .textContent(Translations.viewDeal.deleteProductContent)
                        .ariaLabel(Translations.viewDeal.deleteProductTitle)
                        .targetEvent(event)
                        .ok(Translations.viewDeal.deleteProductConfirm)
                        .cancel(Translations.general.cancel);
                    $mdDialog.show(confirm).then(function () {
                        Product.deleteProduct(PRODUCT_URL)
                            .then(function (response) {
                                    // success
                                    console.log("Product deleted successfully.");
                                    $timeout($rootScope.showToast, 1000, true, "Deleted the product.");
                                    $location.path("/home");
                                },
                                function (httpError) {
                                    // error
                                    console.log(httpError.status + " : " + httpError.data);
                                    $mdDialog.show(
                                        $mdDialog.alert()
                                            .parent(angular.element(document.body))
                                            .clickOutsideToClose(true)
                                            .title("Couldn't delete the product")
                                            .textContent("Please try again!")
                                            .ariaLabel('Alert Dialog')
                                            .ok("OK")
                                            .targetEvent(ev)
                                    );
                                });
                    });
                };

                function addComment(form) {
                    if (!form.$valid) {
                        $scope.presentCommentError();
                    } else {
                        var comment = $scope.comment;
                        comment.upload_date = new Date();
                        comment.product = $scope.product.id;
                        comment.dealer = $rootScope.dealer.id;
                        comment.type = "Deal";
                        $scope.showCommentError = false;
                        $http.post($rootScope.baseUrl + '/addcomments/', comment)
                            .then(function (response) {
                                    // success
                                    console.log("Comment uploaded successfully!");
                                    comment = response.data;
                                    comment.dealer = $rootScope.dealer;
                                    $scope.product.comments.push(comment);
                                    $scope.comment = {};
                                },
                                function (httpError) {
                                    // error
                                    console.log(httpError.status + " : " + httpError.data);
                                    $scope.showCommmentError = true;
                                    $scope.presentCommentError("There was an error, please try again");
                                });
                    }
                }

                function presentCommentError(errorMessage) {
                    /*
                     * Present an error message above the comment textarea.
                     */
                    if (errorMessage) {
                        $scope.commentErrorMessage = errorMessage;
                    } else {
                        $scope.commentErrorMessage = "There was an error, please try again";
                    }
                    $scope.showCommentError = true;
                }

                /**
                 * Presents the alert dialog when there is an invalid field.
                 * @param title - the title of the alert dialog.
                 * @param content - the content of the alert dialog.
                 * @param ev - the event that triggered the alert.
                 */
                function showAlertDialog(title, content, ev) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .clickOutsideToClose(true)
                            .title(title)
                            .textContent(content)
                            .ariaLabel('Alert Dialog')
                            .ok(Translations.general.gotIt)
                            .targetEvent(ev)
                    );
                }

                function validation() {

                    // Check that the user is signed in
                    if (!$rootScope.dealer) {
                        // The user is not signed in, present the Sign In dialog and quit this function.
                        Dialogs.showSignInDialog(event, 0, true)
                            .then(function (finished) {
                                // Reinstantiate the page after adding the buyClicked function to the Actions To Run stack
                                ActiveSession.addActionToRun(BUY_FUNCTION_REPR);
                                $route.reload();
                            });
                        return false;
                    }

                    if (!($scope.purchase.quantity > 0)) {
                        showAlertDialog(
                            "",
                            Translations.viewDeal.validQuantity);
                        return false;
                    }

                    if ($scope.purchase.quantity > $scope.product.max_quantity) {
                        showAlertDialog(
                            "",
                            Translations.viewDeal.maxQuantity + $scope.product.max_quantity + ".");
                        return false;
                    }

                    $scope.purchase.quantity = Math.round($scope.purchase.quantity);

                    // Check if this product is in stock
                    if ($scope.product.inventory == 0) {
                        Dialogs.showAlertDialog(Translations.viewDeal.outOfStockTitle, Translations.viewDeal.outOfStockContent);
                        return false;
                    } else if ($scope.product.inventory < $scope.purchase.quantity) {
                        Dialogs.showAlertDialog(Translations.viewDeal.notEnoughStockTitle, Translations.viewDeal.notEnoughStockContent1 + $scope.product.inventory + Translations.viewDeal.notEnoughStockContent2);
                        return false;
                    }

                    for (var property in $scope.variants) {
                        if ($scope.variants.hasOwnProperty(property)) {
                            var variant = $scope.variants[property];
                            if (!variant.selection) {
                                showAlertDialog(
                                    "",
                                    Translations.viewDeal.pleaseSelect + variant.name.toLowerCase() + ".");
                                return false;
                            }
                            $scope.purchase.selections.push({
                                name: variant.name,
                                selection: variant.selection
                            });
                        }
                    }

                    return true;
                }

                /**
                 * Takes the user to the checkout view after clicking the buy button.
                 */
                function proceedToCheckout() {

                    if (!validation()) {
                        return;
                    }

                    $scope.product.photo = $scope.photosURLs ? $scope.photosURLs[0] : null;
                    ActiveSession.setTempData(PRODUCT_AS_KEY, $scope.product);
                    Checkout.purchase = $scope.purchase;
                    $scope.movedToCheckout = true;
                    var path = "/products/" + $scope.product.id + "/checkout";
                    $location.path(path);
                }

                $scope.$on('$destroy', function () {
                    if (!$scope.movedToCheckout) {
                        ActiveSession.removeTempData(PRODUCT_AS_KEY);
                    }
                })
            }]);
angular.module('DealersApp')
    .directive('intro', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/components/views/about/intro-section.view.html',
            link: function (scope, element) {
                var navbar = $("nav.navbar");
                var navShadeClass = "navbar-shade";
                if (scope.isHomePage && scope.role == scope.roles.guest) {
                    navbar.removeClass(navShadeClass);
                    $(window).scroll(function () {
                        var scroll = $(window).scrollTop();
                        if (scroll >= 30) {
                            navbar.addClass(navShadeClass);
                        } else {
                            navbar.removeClass(navShadeClass);
                        }
                    });
                }
                scope.$on('$destroy', function () {
                    $(window).off("scroll");
                });
            }
        };
    })
    .directive('sellWithDealers', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/components/views/about/sell-with-dealers.view.html'
        }
    })
    .directive('findOutMore', function () {
        return {
            templateUrl: 'app/components/signed-out/shared/find-out-more.view.html',
            link: function (scope, element) {
                // jQuery for page scrolling feature - requires jQuery Easing plugin
                element.bind('click', function (event) {
                    var $anchor = element.find('a');
                    $('html, body').stop().animate({
                        scrollTop: ($($anchor.attr('href')).offset().top)
                    }, 1250, 'easeInOutExpo');
                    event.preventDefault();
                });
            }
        };
    })
    .directive('aboutSection', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/components/views/about/about-section.view.html'
        };
    })
    .directive('iosSection', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/components/signed-out/shared/ios-section.view.html'
        };
    })
    .directive('footerSection', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/components/views/about/footer-section.view.html'
        };
    })
    .directive('menuFooter', function () {

        return {
            restrict: 'E',
            templateUrl: 'app/components/views/about/menu-footer.view.html'
        };
    });
angular.module('DealersApp')
    .directive('dlNavbar', ['$location', '$routeParams', '$rootScope', 'Dealer', function ($location, $routeParams, $rootScope, Dealer) {
        return {
            restrict: 'E',
            templateUrl: 'app/components/views/navbar.view.html',
            controller: 'NavbarController',
            link: function (scope, element) {
            }
        };
    }])
    .directive('dlCategory', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                category: '='
            },
            template: '<a href="/categories/{{category}}"><li>{{category}}</li></a>'
        };
    })
    .directive('vdInfoPane', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/components/views/view-deal-info-pane.view.html'
        };
    })
    .directive('minimizable', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            scope: {
                text: "=",
                maxHeight: "="
            },
            templateUrl: 'app/components/views/minimizable.view.html',
            link: function ($scope, element) {

                var div = $(element).find(".mini-container");
                div.css("opacity", 0);
                $scope.present = false;
                $scope.needMinimize = false;

                $scope.$watch('text', function () {
                    $timeout(function () {
                        if ($scope.text) {
                            if ($scope.text.length > 0) {
                                if (div.height() > $scope.maxHeight + 40) {
                                    // Checks if need minimization.
                                    $scope.activateMinimization();
                                }
                                div.css("opacity", 1.0);
                            }
                        }
                    }, 100);
                });

                $scope.activateMinimization = function () {
                    $scope.needMinimize = true;
                    div.css("max-height", $scope.maxHeight);
                    div.addClass("animate-height");
                    // $timeout(function () {
                    //
                    // }, 100);
                };

                $scope.toggle = function (event) {
                    if ($scope.present) {
                        div.css("max-height", $scope.maxHeight);
                        $scope.present = false;
                    } else {
                        div.css("max-height", "2000px");
                        $scope.present = true;
                    }
                }
            }
        };
    }])
    .directive('securePayment', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/components/views/secure-payment.view.html'
        };
    })
    .directive('dlComment', ['DealerPhotos',
        function (DealerPhotos) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    comment: '='
                },
                templateUrl: 'app/components/views/comment.view.html',
                link: function (scope, element) {

                    // Dealer Photo
                    scope.hasProfilePic = DealerPhotos.hasProfilePic(scope.comment.dealer.photo);
                    var sender = 'comment';
                    if (scope.hasProfilePic) {
                        scope.commenterPhoto = "";
                        DealerPhotos.getPhoto(scope.comment.dealer.photo, scope.comment.dealer.id, sender);
                        scope.profilePicStatus = "loading";
                    }
                    scope.$on('downloaded-' + sender + '-dealer-pic-' + scope.comment.dealer.id, function (event, args) {
                        if (args.success) {
                            scope.commenterPhoto = args.data;
                            scope.profilePicStatus = "doneLoading";
                            scope.$apply();
                        } else {
                            console.log(args.message);
                        }
                    });
                }
            };
        }]);
var MAX_PHOTOS = 4;

angular.module('DealersApp')

    .directive('tabList', function () {
        return {
            link: function (scope, element) {
                var button = element.children()[0];
                scope.tabSelect = function (selectedTab) {
                    scope.changeDisplayPresentation(element);
                    scope.changeDisplayToTab(selectedTab);
                };
            }
        };
    })

    .directive('carouselItem', function () {
        return {
            replace: true,
            scope: {
                photo: "=photoUrl"
            },
            templateUrl: 'app/components/views/carousel-item.view.html'
        };
    })

    .directive('photoInput', function () {
        return {
            scope: {
                photo: "=",
                photoURL: "=photoUrl"
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var imageFile = changeEvent.target.files[0];
                    if (imageFile == null) {
                        return;
                    }
                    scope.photo = imageFile;
                    scope.photoURL = URL.createObjectURL(imageFile);
                    scope.$apply();
                });
            }
        };
    })
    .directive('photosInput', function () {
        return {
            scope: {
                photos: "=",
                photosURLs: "=photosUrls",
                showAlertDialog: "&"
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var imageFile = changeEvent.target.files[0];
                    if (imageFile == null || scope.photos.length >= MAX_PHOTOS) {
                        return;
                    }
                    if ($.inArray(imageFile, scope.photos) != -1) {
                        scope.showAlertDialog("Duplicate Photo", "This photo was already uploaded.");
                        return;
                    }
                    scope.photos.push(imageFile);
                    var url = URL.createObjectURL(imageFile);
                    scope.photosURLs.push(url);
                    scope.$apply();
                });
            }
        };
    })
    .directive('fileDropzone', function () {
        return {
            restrict: 'A',
            scope: {
                photos: '=',
                photosURLs: "=photosUrls",
                showAlertDialog: '&'
            },
            link: function (scope, element, attrs) {
                var checkSize,
                    isTypeValid,
                    processDragOverOrEnter,
                    validMimeTypes;
                processDragOverOrEnter = function (event) {
                    if (event != null) {
                        event = event.originalEvent;
                        event.preventDefault();
                    }
                    event.dataTransfer.effectAllowed = 'copy';
                    return false;
                };
                validMimeTypes = attrs.fileDropzone;
                checkSize = function (size) {
                    var _ref;
                    if ((( _ref = attrs.maxFileSize) === (
                            void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
                        return true;
                    } else {
                        alert("File must be smaller than " + attrs.maxFileSize + " MB");
                        return false;
                    }
                };
                isTypeValid = function (type) {
                    if ((validMimeTypes === (
                            void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
                        return true;
                    } else {
                        alert("Invalid file type.  File must be one of following types " + validMimeTypes);
                        return false;
                    }
                };
                element.bind('dragover', processDragOverOrEnter);
                element.bind('dragenter', processDragOverOrEnter);
                return element.bind('drop', function (event) {
                    var imageFile;
                    if (event != null) {
                        event = event.originalEvent;
                        event.preventDefault();
                    }
                    imageFile = event.dataTransfer.files[0];
                    if (imageFile == null || !checkSize(imageFile.size) || !isTypeValid(imageFile.type)) {
                        return false;
                    }
                    if (scope.photos.length < MAX_PHOTOS) {
                        if ($.inArray(imageFile, scope.photos) == -1) {
                            scope.photos.push(imageFile);
                        } else {
                            scope.showAlertDialog();
                        }
                    }
                    var url = URL.createObjectURL(imageFile);
                    scope.photosURLs.push(url);
                    scope.$apply();
                    return false;
                });
            }
        };
    })
    /**
     * Adds auto-completion to location input elements.
     */
    .directive('googleLocationAutocomplete', [
        function () {
            return {
                scope: {
                    location: "="
                },
                link: function (scope, element) {

                    var autocomplete = element[0];

                    autocomplete = new google.maps.places.Autocomplete(
                        (element[0]),
                        {types: ['geocode']}
                    );

                    autocomplete.addListener('place_changed', function () {
                        var placeObject = autocomplete.getPlace();
                        if (placeObject) {
                            scope.location = placeObject.formatted_address;
                        }
                    });

                    // Bias the autocomplete object to the user's geographical location,
                    // as supplied by the browser's 'navigator.geolocation' object.
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            var geolocation = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            var circle = new google.maps.Circle({
                                center: geolocation,
                                radius: position.coords.accuracy
                            });
                            autocomplete.setBounds(circle.getBounds());
                        });
                    }
                }
            };
        }]);
/**
 * Created by gullumbroso on 20/09/2016.
 */

angular.module('DealersApp')
    .directive('shippingMethods', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/components/views/products/shipping-methods.view.html',
            link: function ($scope, element) {

            }
        }
    })
    .directive('inventoryEdit', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/components/views/products/inventory-edit.view.html',
            link: function ($scope, element) {

            }
        }
    });
angular.module('DealersApp')
    .directive('productPrice', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                ngModel.$parsers.push(function (value) {
                    value = parseFloat(value);
                    if (value) {
                        value = Math.round(value * 100) / 100; // Keep 2 decimals.
                        return value;
                    }
                });
                ngModel.$formatters.push(function (value) {
                    value = parseFloat(value);
                    if (value) {
                        value = Math.round(value * 100) / 100; // Keep 2 decimals.
                        return value;
                    }
                });
            }
        }
    })
    .directive('productPercentageOff', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                ngModel.$parsers.push(function (value) {
                    value = parseFloat(value);
                    if (value) {
                        if (value > 100 || value < 0) {
                            ngModel.$setValidity('is_valid', false);
                            return null;
                        } else if (value == 0) {
                            ngModel.$setValidity('is_valid', undefined);
                            return null;
                        } else {
                            ngModel.$setValidity('is_valid', true);
                        }
                        return value;
                    }
                });
                ngModel.$formatters.push(function (value) {
                    value = parseFloat(value);
                    if (value) {
                        if (value > 100 || value < 0) {
                            return null;
                        } else {
                            ngModel.$setValidity('is_valid', true);
                        }
                        return value;
                    }
                });
            }
        }
    })
    .directive('dlProductsGrid',
        function () {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    source: '=',
                    page: '=',
                    title: '=',
                    description: '='
                },
                templateUrl: 'app/components/views/products/products-grid.view.html',
                controller: 'ProductsGridController'
            }
        })
    .directive('dlProduct', ['$rootScope', '$location', 'ActiveSession', 'Product', 'ProductPhotos', 'DealerPhotos',
        function ($rootScope, $location, ActiveSession, Product, ProductPhotos, DealerPhotos) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    product: '='
                },
                templateUrl: 'app/components/views/products/product-cell.view.html',
                link: function (scope, element) {

                    var DEFAULT_PHOTO_RATIO = 0.678125;
                    var LOADING_STATUS = "loading";
                    var DOWNLOADED_STATUS = "downloaded";
                    var product = scope.product;

                    // Product Photo
                    scope.hasPhoto = product.photo1.length > 2;

                    scope.dealerProfile = function (event) {
                        $location.path("dealers/" + product.dealer.id);
                    };

                    var ratio = DEFAULT_PHOTO_RATIO;
                    if (product.main_photo_width && product.main_photo_height) {
                        ratio = product.main_photo_height / product.main_photo_width;
                    }

                    var imageContainer = $(element).find(".md-card-image-container");
                    if (scope.hasPhoto) {

                        var currentWidth = element.width();
                        var imageHeight = ratio * currentWidth;
                        var heightString = String(imageHeight) + "px";
                        imageContainer.css("height", heightString);

                        if (product.main_photo) {
                            scope.productImage = product.main_photo;
                            scope.productImageStatus = DOWNLOADED_STATUS;
                            imageContainer.removeAttr("style");
                        } else {
                            ProductPhotos.downloadPhoto(product.photo1, product.id);
                            scope.productImageStatus = LOADING_STATUS;
                        }
                    } else {
                        scope.imageBackgroundColor = ProductPhotos.colorForNum(product.photo1);
                    }
                    scope.$on('downloaded-photo-' + product.id, function (event, args) {
                        if (args.success) {
                            scope.productImage = args.data.url;
                            product.main_photo = scope.productImage;
                            scope.productImageStatus = DOWNLOADED_STATUS;
                            imageContainer.removeAttr("style");
                            scope.$apply();
                        } else {
                            console.log(args.data.message);
                        }
                    });

                    // Dealer Photo
                    scope.hasProfilePic = DealerPhotos.hasProfilePic(scope.product.dealer.photo);
                    var sender = 'products-grid';
                    if (scope.hasProfilePic) {

                        if (product.dealer.profilePic) {
                            scope.profilePic = product.dealer.profilePic;
                            scope.profilePicStatus = DOWNLOADED_STATUS;
                        } else {
                            scope.profilePic = "";
                            DealerPhotos.getPhoto(scope.product.dealer.photo, scope.product.dealer.id, sender);
                            scope.profilePicStatus = LOADING_STATUS;
                        }

                    } else {
                        scope.profilePic = DealerPhotos
                    }
                    scope.$on('downloaded-' + sender + '-dealer-pic-' + scope.product.dealer.id, function (event, args) {
                        if (args.success) {
                            scope.profilePic = args.data;
                            product.dealer.profilePic = scope.profilePic;
                            scope.profilePicStatus = DOWNLOADED_STATUS;
                            scope.$apply();
                        } else {
                            console.log(args.message);
                        }
                    });

                    // Other info
                    scope.discountTypePP = product.discount_type === "123";
                    scope.hasLikes = product.dealattribs.dealers_that_liked.length > 0;

                    scope.viewDeal = function (product) {
                        /**
                         * Takes the user to the product's View Deal page.
                         */
                        ActiveSession.setTempData("PRODUCT", product);
                        $location.path('/products/' + String(product.id));
                    };
                }
            };
        }]);
/**
 * Created by gullumbroso on 18/06/2016.
 */
angular.module('DealersApp')
    .directive('updateStatusBuyer', ['$mdDialog', 'Purchase', 'Dialogs', 'Product', 'Translations', function ($mdDialog, Purchase, Dialogs, Product, Translations) {
        return {
            link: function (scope) {

                /**
                 * Changes the status of the purchase (toggles between "Received" and "Sent").
                 *
                 * @param event - the event that triggered the function.
                 * @param purchase - the purchase object.
                 */
                scope.changeBuyerStatus = function (event, purchase) {
                    var dialog;
                    if (purchase.status == Purchase.SENT_STATUS || purchase.status == Purchase.PURCHASED_STATUS) {
                        dialog = Dialogs.confirmDialog(Translations.purchaseDetails.markReceivedConfirmTitle, Translations.purchaseDetails.markReceivedConfirmContent, Translations.general.approve, event);
                        $mdDialog.show(dialog).then(function () {
                            updatePurchase(Purchase.RECEIVED_STATUS, purchase);
                        });
                    } else if (purchase.status == Purchase.RECEIVED_STATUS) {
                        dialog = Dialogs.confirmDialog(Translations.purchaseDetails.markReceivedCancelTitle, Translations.purchaseDetails.markReceivedCancelContent, Translations.purchaseDetails.markReceivedCancelApprove, event);
                        $mdDialog.show(dialog).then(function () {
                            updatePurchase(Purchase.SENT_STATUS, purchase);
                        });
                    }
                };

                /**
                 * Updates the status of the purchase via the Purchase service.
                 * @param status - the new status to update.
                 * @param purchase - the purchase object.
                 */
                function updatePurchase(status, purchase) {
                    var originalPurchase = $.extend(true, {}, purchase);
                    Purchase.updatePurchase(status, purchase)
                        .then(function (response) {
                            // success
                            scope.purchase = response.data;
                            organizePurchaseData(originalPurchase);
                        }, function (err) {
                            // failure
                            console.log("Couldn't update the status of the purchase :(");
                        });
                }

                /**
                 * Organizes the data of the purchase object before presentation.
                 * @param originalPurchase - the purchase object before the update. (Sometimes includes information
                 *      that gets lost in the patch request)
                 */
                function organizePurchaseData(originalPurchase) {
                    scope.purchase.currency = Product.currencyForKey(scope.purchase.currency);
                    if (originalPurchase.deal.id) {
                        scope.purchase.deal = originalPurchase.deal;
                    }
                    if (originalPurchase.buyer.id) {
                        scope.purchase.buyer = originalPurchase.buyer;
                    }
                    if (originalPurchase.dealer.id) {
                        scope.purchase.dealer = originalPurchase.dealer;
                    }
                }
            }
        };
    }])

    .directive('updateStatusDealer', ['$mdDialog', 'Purchase', 'Dialogs', 'Product', 'Translations', function ($mdDialog, Purchase, Dialogs, Product, Translations) {
        return {
            link: function (scope) {

                /**
                 * Changes the status of the purchase (toggles between "Received" and "Sent").
                 *
                 * @param event - the event that triggered the function.
                 * @param purchase - the purchase object.
                 */
                scope.changeDealerStatus = function (event, purchase) {
                    var dialog;
                    if (purchase.status == Purchase.PURCHASED_STATUS) {
                        dialog = promptDialog(Translations.purchaseDetails.markSentConfirmTitle,
                            Translations.purchaseDetails.markSentConfirmContent,
                            Translations.purchaseDetails.markSentConfirmPlaceholder,
                            Translations.general.ok,
                            event);
                        $mdDialog.show(dialog).then(function (result) {
                            if (result) {
                                if (result.length > 0) {
                                    var numOfDays = parseInt(result, 10);
                                    if (numOfDays > 0) {
                                        purchase.estimated_delivery_time = numOfDays;
                                        updatePurchase(Purchase.SENT_STATUS, purchase);
                                        return;
                                    }
                                }
                            }
                            showAlertDialog(event);
                        });
                    } else if (purchase.status == Purchase.SENT_STATUS) {
                        dialog = Dialogs.confirmDialog(Translations.purchaseDetails.markSentCancelTitle, Translations.purchaseDetails.markSentCancelContent, Translations.purchaseDetails.markSentCancelApprove, event);
                        $mdDialog.show(dialog).then(function () {
                            updatePurchase(Purchase.PURCHASED_STATUS, purchase);
                        });
                    }
                };

                /**
                 * Presented when the dealer didn't specified an estimated delivery time.
                 */
                function showAlertDialog(ev) {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.body))
                            .clickOutsideToClose(true)
                            .title(Translations.purchaseDetails.blankETDTitle)
                            .textContent(Translations.purchaseDetails.blankETDContent)
                            .ariaLabel('Alert Dialog')
                            .ok(Translations.general.gotIt)
                            .targetEvent(ev)
                    );
                }

                /**
                 * Presents the prompt dialog when there is an invalid field.
                 *
                 * @param title - the title of the alert dialog.
                 * @param content - the content of the alert dialog.
                 * @param placeholder - the placeholder of the input.
                 * @param confirm - the confirm button title.
                 * @param ev - the event that triggered the alert.
                 */
                function promptDialog(title, content, placeholder, confirm, ev) {
                    return $mdDialog.prompt()
                        .title(title)
                        .textContent(content)
                        .placeholder(placeholder)
                        .ariaLabel('Estimated Delivery Time')
                        .targetEvent(ev)
                        .ok(confirm)
                        .cancel(Translations.general.cancel);
                }

                /**
                 * Updates the status of the purchase via the Purchase service.
                 * @param status - the new status to update.
                 * @param purchase - the purchase object.
                 */
                function updatePurchase(status, purchase) {
                    var originalPurchase = $.extend(true, {}, purchase);
                    Purchase.updatePurchase(status, purchase)
                        .then(function (response) {
                            // success
                            scope.purchase = response.data;
                            organizePurchaseData(originalPurchase);
                        }, function (err) {
                            // failure
                            console.log("Couldn't update the status of the purchase :(");
                        });
                }

                /**
                 * Organizes the data of the purchase object before presentation.
                 * @param originalPurchase - the purchase object before the update. (Sometimes includes information
                 *      that gets lost in the patch request)
                 */
                function organizePurchaseData(originalPurchase) {
                    scope.purchase.currency = Product.currencyForKey(scope.purchase.currency);
                    if (originalPurchase.deal.id) {
                        scope.purchase.deal = originalPurchase.deal;
                    }
                    if (originalPurchase.buyer.id) {
                        scope.purchase.buyer = originalPurchase.buyer;
                    }
                    if (originalPurchase.dealer.id) {
                        scope.purchase.dealer = originalPurchase.dealer;
                    }
                }
            }
        }
    }])

    .directive('ordersList', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/components/views/purchases/orders-list.view.html',
            controller: function ($scope, $rootScope, $location, $mdDialog, ActiveSession, Purchase, Product, Translations) {

                var LOADING_STATUS = "loading";
                var DOWNLOADED_STATUS = "downloaded";

                $scope.loadingStatus = LOADING_STATUS;
                downloadOrders();

                /**
                 * Downloads the orders of this user.
                 */
                function downloadOrders() {
                    Purchase.getOrders($rootScope.dealer.id)
                        .then(function (result) {
                            // success
                            $scope.purchases = result.data.buyer_purchases;
                            $scope.purchases = Product.convertKeysToCurrencies($scope.purchases);
                            $scope.loadingStatus = DOWNLOADED_STATUS;
                        }, function (err) {
                            // failure
                            console.log("Couldn't download the orders of this user :(");
                        })
                }

                /**
                 * Set the title of the mark button according to the status of the purchase object.
                 * @param purchase - the purchase object.
                 * @returns {string} the title of the button.
                 */
                $scope.markButtonTitle = function (purchase) {
                    if (purchase.status == Purchase.RECEIVED_STATUS) {
                        return Translations.purchaseDetails.received;
                    } else {
                        return Translations.purchaseDetails.markReceived;
                    }
                };

                /**
                 * Returns the appropriate representation of the purchase's status.
                 * @param purchase - the purchase.
                 * @returns {string} the representation.
                 */
                $scope.parseForPresentation = function (purchase) {
                    if (purchase.status == Purchase.PURCHASED_STATUS) {
                        return Translations.purchaseDetails.purchased;
                    } else if (purchase.status == Purchase.SENT_STATUS) {
                        return Translations.purchaseDetails.sent;
                    } else if (purchase.status == Purchase.RECEIVED_STATUS) {
                        return Translations.purchaseDetails.received;
                    }
                };

                /**
                 * Takes the user to the purchase details page.
                 *
                 * @param purchase - the purchase.
                 * @param $event - the event that triggered the function.
                 */
                $scope.purchaseDetails = function (purchase, $event) {
                    ActiveSession.setTempData("PURCHASE", purchase);
                    $location.path("/purchase/" + purchase.id);
                };
            }
        }
    })

    .directive('salesList', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: 'app/components/views/purchases/sales-list.view.html',
            controller: function ($scope, $rootScope, $location, $mdDialog, ActiveSession, Purchase, Product, Translations) {

                var LOADING_STATUS = "loading";
                var DOWNLOADED_STATUS = "downloaded";

                $scope.loadingStatus = LOADING_STATUS;
                downloadSales();

                /**
                 * Downloads the sales of this user.
                 */
                function downloadSales() {
                    Purchase.getSales($rootScope.dealer.id)
                        .then(function (result) {
                            // success
                            $scope.purchases = result.data.dealer_purchases;
                            $scope.purchases = Product.convertKeysToCurrencies($scope.purchases);
                            $scope.loadingStatus = DOWNLOADED_STATUS;
                        }, function (err) {
                            // failure
                            console.log("Couldn't download the orders of this user :(");
                            $scope.loadingStatus = DOWNLOADED_STATUS;
                        })
                }

                /**
                 * Set the title of the mark button according to the status of the purchase object.
                 * @param purchase - the purchase object.
                 * @returns {string} the title of the button.
                 */
                $scope.markButtonTitle = function (purchase) {
                    if (purchase.status == Purchase.SENT_STATUS) {
                        return Translations.purchaseDetails.sent;
                    } else if (purchase.status == Purchase.RECEIVED_STATUS) {
                        return Translations.purchaseDetails.received
                    } else {
                        return Translations.purchaseDetails.markSent;
                    }
                };

                /**
                 * Returns the appropriate representation of the purchase's status.
                 * @param purchase - the purchase.
                 * @returns {string} the representation.
                 */
                $scope.parseForPresentation = function (purchase) {
                    if (purchase.status == Purchase.PURCHASED_STATUS) {
                        return Translations.purchaseDetails.purchased;
                    } else if (purchase.status == Purchase.SENT_STATUS) {
                        return Translations.purchaseDetails.sent;
                    } else if (purchase.status == Purchase.RECEIVED_STATUS) {
                        return Translations.purchaseDetails.received;
                    }
                };

                /**
                 * Takes the user to the purchase details page.
                 *
                 * @param purchase - the purchase.
                 * @param $event - the event that triggered the function.
                 */
                $scope.purchaseDetails = function (purchase, $event) {
                    ActiveSession.setTempData("PURCHASE", purchase);
                    $location.path("/purchase/" + purchase.id);
                };
            }
        }
    })
    .directive('totalPriceCalculator', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                present: '=',
                purchase: '=',
                delivery: '='
            },
            templateUrl: 'app/components/views/purchases/total-price-calculator.view.html',
            link: function ($scope) {
                $scope.price = $scope.purchase.amount / 100; // Convert to cents.
                $scope.$watch('present', function () {
                    if ($scope.present) { // Most of the times the delivery object is pending, so should wait for it to populate.
                        $scope.shipping_price = $scope.delivery.shipping_price; // Convert to cents.
                    }
                });
            }
        }
    });
angular.module('DealersApp')
    .directive('dl-sign-in-dialog', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/components/views/sign-in/sign-in-dialog.view.html',
            controller: 'SignInController'
        };
    });
angular.module('DealersApp')

/**
 * The LIKE button.
 */
    .directive('likeButton', ['$rootScope', '$http', '$route', 'Product', 'Dialogs', 'ActiveSession', 'Analytics', '$translate',
        function ($rootScope, $http, $route, Product, Dialogs, ActiveSession, Analytics, $translate) {
            return {
                link: function (scope, element) {

                    var LIKE_FUNCTION_REPR = "likeClicked";
                    setLikeTitle();

                    // First of all check if the scope is defined properly
                    if (!scope.product) {
                        console.log("There's a problem - the parent scope doesn't have a product attribute.");
                        return;
                    }

                    var dealersThatLiked = scope.product.dealattribs.dealers_that_liked;
                    if ($rootScope.dealer) {
                        var userID = $rootScope.dealer.id;
                        updateLikeAppearance();
                    }

                    scope.likeClicked = likeClicked;

                    if (ActiveSession.shouldRunAction(LIKE_FUNCTION_REPR)) {
                        scope.likeClicked();
                    }

                    function isLiked() {
                        /*
                         * Check if the user liked this product, if so, mark the button.
                         */
                        var likedByUser = $.inArray(userID, dealersThatLiked);
                        if (likedByUser == -1) {
                            // The user didn't like the product before, should like it now.
                            return false;
                        }
                        return true;
                    }

                    function updateLikeAppearance() {
                        /*
                         * If the user liked the product, unmark it. If he didn't, mark it.
                         */
                        if (isLiked()) {
                            scope.likeStatus = 'LIKED';
                            scope.likeTitle = $translate.instant('general.liked');
                            $(element).css('color', '#9C27B0').find("span").replaceWith("<span>" + scope.likeTitle + "<span>");
                        } else {
                            scope.likeStatus = 'LIKE';
                            scope.likeTitle = $translate.instant('general.like');
                            $(element).css('color', '#313140').find("span").replaceWith("<span>" + scope.likeTitle + "<span>");
                        }
                    }

                    $rootScope.$on('$translateChangeSuccess', function () {
                        setLikeTitle();
                    });

                    function setLikeTitle() {
                        if (isLiked()) {
                            scope.likeTitle = $translate.instant('general.liked');
                        } else {
                            scope.likeTitle = $translate.instant('general.like');
                        }
                    }

                    /**
                     * The user clicked the like button.
                     */
                    function likeClicked(event) {

                        // First check that the user is signed in
                        if (!userID) {
                            // The user is not signed in, present the Sign In dialog and quit this function.
                            Dialogs.showSignInDialog(event, 0, true)
                                .then(function (finished) {
                                    // Reinstantiate the page after adding the likeClicked function to the Actions To Run stack
                                    ActiveSession.addActionToRun(LIKE_FUNCTION_REPR);
                                    $route.reload();
                                });
                            return;
                        }

                        if (isLiked()) {
                            // Remove the user from the dealersThatLiked array and update the appearance when done.
                            var index = dealersThatLiked.indexOf(userID);
                            if (index > -1) {
                                dealersThatLiked.splice(index, 1);
                            }
                        } else {
                            // Add the user to the dealersThatLiked array and update the appearance when done.
                            Analytics.trackEvent('Product', 'like', String(scope.product.id));
                            dealersThatLiked.push(userID);
                        }
                        $http.patch($rootScope.baseUrl + '/dealattribs/' + scope.product.dealattribs.id + '/', scope.product.dealattribs)
                            .then(function (response) {
                                    // success
                                    scope.product.dealattribs = response.data;
                                    updateLikeAppearance();
                                    // scope.$apply();
                                },
                                function (httpError) {
                                    // error
                                    console.log(httpError.status + " : " + httpError.data);
                                });
                    }
                }
            };
        }])

    /**
     * The FACEBOOK SHARE button.
     */
    .directive('shareButton', ['$rootScope', 'Analytics', function ($rootScope, Analytics) {
        return {
            link: function (scope, element) {
                $(element).on("click", function (ev) {
                    Analytics.trackEvent('Product', 'share', String(scope.product.id));
                    var url = $rootScope.homeUrl + "/products/" + scope.product.id;
                    FB.ui({
                        method: 'share',
                        mobile_iframe: true,
                        href: url
                    }, function (response) {
                    });
                });
            }
        };
    }])

    /**
     * Register As Dealer button.
     */
    .directive('registerAsDealer', ['$rootScope', '$location', '$mdMedia', '$mdDialog',
        function ($rootScope, $location, $mdMedia, $mdDialog) {
            return {
                link: function (scope, element) {
                    scope.customFullscreen = $mdMedia('xs');

                    /**
                     * Presents the sign in dialog (sign up and log in).
                     * @param ev - The event that triggered the function.
                     * @param tabIndex - the index of the selected option (sign up is 0, log in is 1).
                     */
                    scope.showSignInDialog = function (ev, tabIndex) {
                        $mdDialog.show({
                            controller: 'SignInDialogController',
                            templateUrl: 'app/components/views/sign-in/sign-in-dealer-dialog.view.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,

                            fullscreen: scope.customFullscreen,
                            locals: {tab: tabIndex, isViewer: false}
                        })
                            .then(function (finished) {
                                // Finished the sign in process
                                if (finished == 0) {
                                    $location.path("/register");
                                } else if (finished == 1) {
                                    $location.path("/home");
                                } else {
                                    console.error("Received something wrong to the callback of showSignInDialog");
                                }
                            });
                    };

                    /**
                     * Takes the user to the register-as-dealer page. If he is not signed in, takes him through the sign in process first.
                     * @param ev - the event that triggered the function.
                     */
                    $(element).on("click", function (ev) {
                        if ($rootScope.dealer) {
                            $location.path("/register");
                            scope.$apply();
                        } else {
                            if ($(element).is("#nav-login")) {
                                scope.showSignInDialog(ev, 1, false);
                            } else {
                                scope.showSignInDialog(ev, 0, true);
                            }
                        }
                    });
                }
            };
        }])
    .directive('loadingSpinner', function () {
        return {
            restrict: 'E',
            scope: {
                size: '@'
            },
            template: "<div class='spinnerContainer'></div>",
            link: function (scope, element) {
                var container = element[0].children[0];
                var scale = 0.25;
                if (scope.size === "small") {
                    scale = 0.16;
                }
                var opts = {
                    lines: 13 // The number of lines to draw
                    , length: 28 // The length of each line
                    , width: 14 // The line thickness
                    , radius: 42 // The radius of the inner circle
                    , scale: scale // Scales overall size of the spinner
                    , corners: 1 // Corner roundness (0..1)
                    , color: 'rgb(100,100,115)' // #rgb or #rrggbb or array of colors
                    , opacity: 0.25 // Opacity of the lines
                    , rotate: 0 // The rotation offset
                    , direction: 1 // 1: clockwise, -1: counterclockwise
                    , speed: 1.2 // Rounds per second
                    , trail: 60 // Afterglow percentage
                    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
                    , zIndex: 2e9 // The z-index (defaults to 2000000000)
                    , className: 'spinner' // The CSS class to assign to the spinner
                    , top: '50%' // Top position relative to parent
                    , left: '50%' // Left position relative to parent
                    , shadow: false // Whether to render a shadow
                    , hwaccel: false // Whether to use hardware acceleration
                    , position: 'absolute' // Element positioning
                };
                var spinner = new Spinner(opts).spin(container);
            }
        };
    })
    .directive('ngTranslateLanguageSelect', function (LocalesService) {
        'use strict';
        return {
            restrict: 'A',
            controller: function ($scope) {
                $scope.currentLocaleDisplayName = LocalesService.getLocaleDisplayName();
                $scope.localesDisplayNames = LocalesService.getLocalesDisplayNames();
                $scope.visible = $scope.localesDisplayNames && $scope.localesDisplayNames.length > 1;
                $scope.changeLanguage = function (locale) {
                    LocalesService.setLocaleByDisplayName(locale);
                };
                $scope.getFlag = function (locale) {
                    return LocalesService.getFlag(locale);
                };
            }
        }
    })
    .directive('scrollDetector', ['Product', function (Product) {
        return {
            link: function (scope, element) {
                $(window).scroll(function () {
                    if ($(window).scrollTop() + $(window).height() > $(document).height() - 700) {
                        if (!scope.update.loadingMore) {
                            if (scope.update.nextPage) {
                                scope.update.loadingMore = true;
                                scope.$apply();
                                scope.getProducts(scope.update.nextPage);
                            }
                        }
                    }
                });
                scope.$on('$destroy', function () {
                    $(window).off("scroll");
                });
            }
        };
    }]);
angular.module('DealersApp')
/**
 * Manages information regarding current sessions of the user.
 */
    .factory('ActiveSession', ['$http', '$rootScope', '$cookies', function ActiveSessionFactory($http, $rootScope, $cookies) {

        var service = {};

        service.actionsToRun = []; // Saves string representations of functions that should run in when needed.
        var tempData = {}; // Contains arbitrary data that is stored in order to be passed between controllers.

        service.getTempData = getTempData;
        service.setTempData = setTempData;
        service.removeTempData = removeTempData;
        service.addActionToRun = addActionToRun;
        service.shouldRunAction = shouldRunAction;

        return service;

        /**
         * Adds the received string representation of an action to the Actions To Run array.
         * @param action - the string representation of the action.
         */
        function addActionToRun(action) {
            service.actionsToRun.push(action);
        }

        /**
         * Returns true if the action should run, otherwise return false.
         * @param action - the string representation of the action.
         * @return {boolean} - true if should run the action, else false.
         */
        function shouldRunAction(action) {
            if ($.inArray(action, service.actionsToRun) != -1) {
                // Should run the action
                var index = service.actionsToRun.indexOf(action);
                service.actionsToRun.splice(index, 1);
                return true;
            }
            return false;
        }

        /**
         * @param key - the key.
         * @returns {{}} the object in the received key.
         */
        function getTempData(key) {
            return tempData[key];
        }

        /**
         * Sets the data in the key.
         * @param key - the key.
         * @param data - the data to save.
         */
        function setTempData(key, data) {
            tempData[key] = data;
        }

        /**
         * Removes the received key from the tempData object.
         * @param key - the key to remove.
         */
        function removeTempData(key) {
            if (tempData.hasOwnProperty(key)) {
                delete tempData.key;
            }
        }
    }]);
/*
 *  Manages information regarding the current session of adding a product.
 */
angular.module('DealersApp')
    .factory('AddProduct', ['$http', '$rootScope', 'Product', 'ProductPhotos', function AddProductFactory($http, $rootScope, Product, ProductPhotos) {

        var AP_SESSION = 'apSession';
        var AP_SESSION_PHOTOS = 'apSessionPhotos';
        var ADD_PRODUCT_PATH = '/adddeals/';
        var UPLOAD_STARTED_MESSAGE = 'ap-upload-started';
        var UPLOAD_FINISHED_MESSAGE = 'ap-upload-finished';

        function setListeners() {
            $scope.$on('photos-downloaded-for-' + AP_SESSION, function (event, args) {
                if (args.success) {
                    // Finished uploading photos, start uploading the product's data.
                    uploadData();
                } else {
                    console.log("Couldn't upload the photos. Aborting upload process.");
                }
            });
        }

        var service = {};
        service.product = {};
        service.savedPhotosURLs = [];
        service.getProduct = getProduct;
        service.setProduct = setProduct;
        service.saveSession = saveSession;
        service.checkForSavedSessions = checkForSavedSessions;
        service.clearSession = clearSession;
        service.uploadProduct = uploadProduct;

        return service;

        function getProduct() {
            return service.product;
        }

        function setProduct(product) {
            service.product = product;
        }

        /**
         * Saves the Add Product session to the browser's local storage.
         * @param product - the product that should be saved.
         * @param photosURLs - the urls of the photos that were added.
         */
        function saveSession(product, photosURLs) {
            if (product) {
                var productWithoutPhotos = $.extend({}, product);
                productWithoutPhotos = Product.removePhotoPaths(productWithoutPhotos);
                productWithoutPhotos = Product.extractData(productWithoutPhotos);
                if (typeof productWithoutPhotos.price == "string") {
                    productWithoutPhotos.price = parseFloat(productWithoutPhotos.price);
                }
                try {
                    localStorage.setItem(AP_SESSION, JSON.stringify(productWithoutPhotos));
                }
                catch (err) {
                    console.log("Couldn't save product's data: " + err);
                }
            } else {
                console.log("No product to save to the local storage.");
            }
        }

        /**
         * Checks if there are saved sessions in the browser's local storage.
         * @return {boolean} - true if there is a saved session, else false.
         */
        function checkForSavedSessions() {
            var productString = localStorage.getItem(AP_SESSION);
            if (productString) {
                service.product = JSON.parse(productString);
                if (service.product.category) {
                    if (service.product.category.length == 2) {
                        // The category consists 2 letters, which means it's a server key. Needs to be converted.
                        service.product.category = Product.categoryForKey(service.product.category);
                    }
                }
                if (service.product.expiration) {
                    var dateNum = Date.parse(service.product.expiration);
                    service.product.expiration = new Date(dateNum);
                }

                // var photosURLsString = localStorage.getItem(AP_SESSION_PHOTOS);
                // if (photosURLsString) {
                //     service.photosURLs = JSON.parse(photosURLsString);
                // }

                return true;
            } else {
                return false;
            }
        }

        /**
         * Clears the current session that was saved in this service and in the browser's local storage.
         */
        function clearSession() {
            service.product = {};
            service.savedPhotosURLs = [];
            localStorage.removeItem(AP_SESSION);
            localStorage.removeItem(AP_SESSION_PHOTOS);
        }

        /**
         * Runs the functions that responsible for uploading the product to the server.
         * @param product - the product to upload.
         */
        function uploadProduct(product) {
            service.product = product;
            saveSession(product);
            setProductProperties();
        }

        /**
         * Sets a few properties of the product in order to make is server-ready.
         */
        function setProductProperties() {
            service.product.dealer = $rootScope.dealer.id;
            service.product.currency = Product.keyForCurrency(service.product.currency);
            if (service.product.discount_value && service.product.discount_value > 0) {
                service.product.discount_type = Product.keyForDiscountType(service.product.discount_type);
            } else {
                service.product.discount_value = null;
                service.product.discount_type = null;
            }
            service.product.category = Product.keyForCategory(service.product.category);
            service.product.upload_date = new Date();
            service.product.store = {};
            service.product.dealattribs = {};
            var firstPhoto = new Image();
            firstPhoto.onload = function () {
                service.product.main_photo_width = this.width;
                service.product.main_photo_height = this.height;
                uploadData(); // Need to wait for the image to be loaded because only then it's possible to get its width and height.
            };
            firstPhoto.src = URL.createObjectURL(service.product.photos[0]);
        }

        function uploadData() {
            var data = Product.extractData(service.product);
            $http.post($rootScope.baseUrl + ADD_PRODUCT_PATH, data)
                .then(function (response) {
                    console.log("Product uploaded successfully!");
                    setProduct(response.data);
                    $rootScope.$broadcast(UPLOAD_FINISHED_MESSAGE, {success: true, message: null, product: response.data});
                }, function (err) {
                    console.log("There was an error while uploading the product: " + err.data);
                    $rootScope.$broadcast(UPLOAD_FINISHED_MESSAGE, {success: false, message: err.data});
                });
        }
    }]);
angular.module('DealersApp')
    .factory('Authentication', ['$http', '$rootScope', '$cookies', function AuthenticationFactory($http, $rootScope, $cookies) {
        var service = {};
        service.getCredentials = getCredentials;
        service.getToken = getToken;
        service.saveCredentials = saveCredentials;
        service.clearCredentials = clearCredentials;

        return service;

        function getCredentials(username, password) {
            var authdata = encode(username + ':' + password);
            return 'Basic ' + authdata;
        }

        function getToken(username, password) {
            return $http.post($rootScope.baseUrl + '/dealers-token-auth/', {
                username: username,
                password: password
            });
        }

        function saveCredentials(username, token) {
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    token: token
                }
            };
            $http.defaults.headers.common['Authorization'] = 'Token ' + token;
            $cookies.putObject('globals', $rootScope.globals);
        }

        function clearCredentials() {
            $rootScope.globals = {};
            $http.defaults.headers.common.Authorization = null;
            $cookies.remove('globals');
        }

        function encode(input) {
            var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
            return output;
        }
    }]);
/**
 * Created by gullumbroso on 22/08/2016.
 */

angular.module('DealersApp')
    .factory('Checkout', ['$http', '$rootScope', 'Product', 'ProductPhotos', function CheckoutFactory($http, $rootScope, Product, ProductPhotos) {

        var CO_SESSION = 'coSession';

        var service = {};

        service.product = {};
        service.purchase = {};
        service.saveSession = saveSession;
        service.retrieveSavedSession = retrieveSavedSession;
        service.clearSession = clearSession;

        return service;

        /**
         * Saves the current purchase session in the local storage.
         * @param purchase - the purchase object ot save.
         */
        function saveSession(purchase) {
            if (purchase) {
                service.purchase = purchase;
                try {
                    localStorage.setItem(CO_SESSION, JSON.stringify(purchase));
                }
                catch (err) {
                    console.log("Couldn't save product's data: " + err);
                }
            } else {
                console.log("No product to save to the local storage.");
            }
        }

        /**
         * Retrieves the saved session from the local storage.
         * @returns {*}
         */
        function retrieveSavedSession() {
            var purchaseString = localStorage.getItem(CO_SESSION);
            if (purchaseString) {
                service.purchase = JSON.parse(purchaseString);
                return service.purchase;
            } else {
                return null;
            }
        }

        /**
         * Clears the current purchase session.
         */
        function clearSession() {
            service.product = {};
            localStorage.removeItem(CO_SESSION);
        }
    }]);
angular.module('DealersApp')
    .factory('Comment', ['$http', '$rootScope', 'Authentication', function CommentFactory($http, $rootScope, Authentication) {

        var ctrl = this;
        var service = {};

        service.postComment = postComment;
        service.getProducts = getProducts;
        service.mapData = mapData;

        return service;

        function postComment(comment) {
            /*
             * Posts a comment to the server
             */
            if (comment) {

                return $http.get($rootScope.baseUrl + '/alldeals/' + String(dealID) + '/');
            }
        }

        function getDeals(from) {
            /*
             * Returns a call for a list of products form the server
             */
            return $http.get($rootScope.baseUrl + from);
        }
    }]);
angular.module('DealersApp')
    .factory('DealerPhotos', ['$rootScope', function DealerPhotosFactory($rootScope) {

        var KEY = "media/Profile_Photos/";
        var BROADCASTING_PREFIX = 'dealer-pic-uploaded-for-';

        var service = {};

        service.DEFAULT_PROFILE_PIC = "assets/images/icons/@2x/default_profile_pic.png";

        service.hasProfilePic = hasProfilePic;
        service.getPhoto = getPhoto;
        service.uploadPhoto = uploadPhoto;

        return service;

        /**
         * Determines if the dealer has a dealer picture or not.
         * @param photoAdderss - the address of the photo (if exists).
         * @returns {boolean} - true if exists, else false.
         */
        function hasProfilePic(photoAdderss) {
            return (photoAdderss.length > 2) && (photoAdderss != "None");
        }

        /**
         * Downloads the dealer pic of the received user.
         * @param key - the key in which the photo is located.
         * @param dealerID - the id of the user.
         * @param sender - the controller that asked for the service.
         */
        function getPhoto(key, dealerID, sender) {
            $rootScope.s3.getObject(
                {Bucket: $rootScope.AWSS3Bucket, Key: key, ResponseContentType: "image/jpg"},
                function (error, data) {
                    var message;
                    if (error != null) {
                        message = "Failed to download dealer's dealer pic" + dealerID + ":" + error.message;
                        $rootScope.$broadcast('downloaded-' + sender + '-dealer-pic-' + dealerID, {
                            success: false,
                            message: message
                        });
                    } else {
                        message = "Downloaded dealer's dealer pic successfully!";
                        var blob = new Blob([data.Body], {'type': 'image/png'});
                        var url = URL.createObjectURL(blob);
                        $rootScope.$broadcast('downloaded-' + sender + '-dealer-pic-' + dealerID, {
                            success: true,
                            data: url
                        });
                    }
                }
            );
        }

        /**
         * Uploads the dealer pic of the user.
         * @param photo - the user's dealer pic.
         * @param sender - the controller that asked for the service.
         */
        function uploadPhoto(photo, sender) {
            var photoName = generatePhotoName();
            var params = {
                Bucket: $rootScope.AWSS3Bucket,
                Key: KEY + photoName,
                Body: photo
            };
            $rootScope.s3.putObject(params, function (err, data) {
                if (err) {
                    // There Was An Error With Your S3 Config
                    console.log("There was an error with s3 config: " + err.message);
                    $rootScope.$broadcast(BROADCASTING_PREFIX + sender, {success: false, data: err.message});
                }
                else {
                    console.log("Profile pic upload complete.");
                    $rootScope.dealer.photo = KEY + photoName;
                    $rootScope.$broadcast(BROADCASTING_PREFIX + sender, {success: true, data: data});
                }
            });
        }

        /**
         * Generates a name to every photo that is about to be uploaded to the s3.
         * @returns {string} - the generated name.
         */
        function generatePhotoName() {
            var dealerID = String($rootScope.dealer.id);
            var d = new Date();
            var date = String(d.getTime() / 1000);
            return dealerID + "_" + date + "_" + "dealer" + ".png";
        }
    }]);
/*
 *  Contains methods for downloading users' info, authenticating users and registering new users.
 */

angular.module('DealersApp')
    .factory('Dealer', ['$http', '$rootScope', 'Authentication', function DealerFactory($http, $rootScope, Authentication) {

        var DEFAULT_UN = "ubuntu";
        var DEFAULT_PW = "090909deal";
        var REGISTER_BROADCASTING_PREFIX = 'register-as-dealer-for-';
        var UPDATE_BROADCASTING_PREFIX = 'update-as-dealer-for-';
        var DEALERS_BASE_URL = $rootScope.baseUrl + '/dealers/';

        this.saveCurrent = saveCurrent;
        this.setCredentials = setCredentials;
        this.broadcastResult = broadcastResult;

        var ctrl = this;
        var service = {};

        service.create = create;
        service.logIn = logIn;
        service.logOut = logOut;
        service.getDealer = getDealer;
        service.getShortDealer = getShortDealer;
        service.registerDealer = registerDealer;
        service.updateDealer = updateDealer;
        service.updateViewer = updateViewer;
        service.setIntercom = setIntercom;
        service.updateCurrentUser = updateCurrentUser;
        service.updateShippingAddress = updateShippingAddress;

        return service;

        /**
         * Creates a new dealer object in the server when a new user signs up (as a viewer).
         * @param dealer - the new user (named dealer because of legacy naming).
         */
        function create(dealer) {
            var password = dealer.user.password;
            var credentials = Authentication.getCredentials(DEFAULT_UN, DEFAULT_PW);
            $http.post(DEALERS_BASE_URL, dealer, {headers: {'Authorization': credentials}})
                .then(function (response) {
                        // success
                        var dealer = response.data;
                        ctrl.saveCurrent(dealer);
                        ctrl.setCredentials(dealer.user.username, password);
                        ctrl.broadcastResult('sign-up', true, dealer);
                    },
                    function (httpError) {
                        // error
                        ctrl.broadcastResult('sign-up', false, httpError);
                    });
        }

        /**
         * Validates the username and password that were received and if valid logs the user in.
         * @param username - the username that was entered.
         * @param password - the password that was entered.
         */
        function logIn(username, password) {
            var credentials = Authentication.getCredentials(username, password);
            $http.get($rootScope.baseUrl + '/dealerlogins/', {
                headers: {'Authorization': credentials}
            })
                .then(function (response) {
                        // success
                        var dealer = response.data.results[0];
                        ctrl.saveCurrent(dealer);
                        ctrl.setCredentials(username, password);
                        ctrl.broadcastResult('log-in', true, dealer);
                    },
                    function (httpError) {
                        // error
                        ctrl.broadcastResult('log-in', false, httpError);
                    });
        }

        /**
         * Logs the user out.
         */
        function logOut() {
            Authentication.clearCredentials();
            localStorage.clear();
            logOutIntercom();
            $rootScope.dealer = null;
        }

        /**
         * Saves the user's information in the local storage of the browser.
         * @param dealer - the dealer object containing the user's information.
         */
        function saveCurrent(dealer) {
            if (dealer) {
                localStorage.setItem('dealer', JSON.stringify(dealer));
                $rootScope.dealer = dealer;
            }
        }

        /**
         * Downloads the current dealer object from the server to update the current object in the client.
         * @param dealerID - the id of the dealer that should be updated.
         */
        function updateCurrentUser(dealerID) {
            if (dealerID) {
                getDealer(dealerID)
                    .then(function (response) {
                            // success
                            var dealer = response.data;
                            saveCurrent(dealer);
                        },
                        function (httpError) {
                            console.log("Couldn't update the user:" + httpError);
                        });
            }
        }

        /**
         * Asks for a token and sets it in the default headers of angular's $http service.
         * @param username - the username.
         * @param password - the password.
         */
        function setCredentials(username, password) {
            Authentication.getToken(username, password)
                .then(function (response) {
                        // success
                        console.log("Set credentials successfully! Get in!");
                        Authentication.saveCredentials(username, response.data.token);
                        ctrl.broadcastResult('credentials-set', true);
                    },
                    function (httpError) {
                        console.log("Couldn't get token:" + httpError);
                        ctrl.broadcastResult('credentials-set', false);
                    });
        }

        /**
         * Broadcasts messages via the $broadcast service.
         * @param process - the process that is waiting for the broadcast.
         * @param success - a boolean that indicates if the result was successful or not.
         * @param message - a message containing data regarding the result.
         */
        function broadcastResult(process, success, message) {
            $rootScope.$broadcast(process, {success: success, message: message});
        }

        /**
         * Downloads the dealer's information according to the received dealer id.
         */
        function getDealer(dealerID) {
            return $http.get(DEALERS_BASE_URL + dealerID + '/');
        }

        /**
         * Downloads the dealer's information in short format (name, photo and user object).
         * @param dealerID - the id of the dealer to download.
         * @returns {*} the $http get response object.
         */
        function getShortDealer(dealerID) {
            return $http.get($rootScope.baseUrl + "/dealershorts/" + dealerID + "/")
        }

        /**
         * Register the received dealer.
         * @param bankAccount - the new dealer's bank account object.
         * @param sender - the controller that asked for the service.
         */
        function registerDealer(bankAccount, sender) {
            $http.post($rootScope.baseUrl + '/bank_accounts/', bankAccount)
                .then(function (response) {
                        // success
                        $rootScope.dealer.role = $rootScope.roles.dealer;
                        var dealer = cleanDealerObject($rootScope.dealer);
                        $http.patch(DEALERS_BASE_URL + dealer.id + '/', dealer, {params: {mode: "new"}})
                            .then(function (response) {
                                    // success
                                    var dealer = response.data;
                                    ctrl.saveCurrent(dealer);
                                    broadcastResult(REGISTER_BROADCASTING_PREFIX + sender, true, dealer);
                                },
                                function (httpError) {
                                    // error
                                    broadcastResult(REGISTER_BROADCASTING_PREFIX + sender, false, httpError);
                                });
                    },
                    function (httpError) {
                        // error
                        broadcastResult(REGISTER_BROADCASTING_PREFIX + sender, false, httpError);
                    });
        }

        /**
         * Updates the received dealer's information (via Edit Profile).
         * @param bankAccount - the dealer's bank account object.
         * @param dealer - the updated dealer object.
         * @param sender - the controller that asked for the service.
         */
        function updateDealer(bankAccount, dealer, sender) {
            $http.patch($rootScope.baseUrl + '/bank_accounts/' + bankAccount.id + '/', bankAccount)
                .then(function (response) {
                        // success
                        console.log("Updated the bank account information successfully. Now update the the dealer's information.");
                        dealer = cleanDealerObject(dealer);
                        $http.patch(DEALERS_BASE_URL + dealer.id + '/', dealer, {params: {mode: "edit"}})
                            .then(function (response) {
                                    // success
                                    dealer = response.data;
                                    ctrl.saveCurrent(dealer);
                                    setIntercom(dealer);
                                    broadcastResult(UPDATE_BROADCASTING_PREFIX + sender, true, dealer);
                                },
                                function (httpError) {
                                    // error
                                    broadcastResult(UPDATE_BROADCASTING_PREFIX + sender, false, httpError);
                                });
                    },
                    function (httpError) {
                        // error
                        broadcastResult(UPDATE_BROADCASTING_PREFIX + sender, false, httpError);
                    });
        }

        /**
         * Updates the received viewer's information (via Edit Profile).
         * @param viewer - the updated profile object of the viewer.
         * @param sender - the controller that asked for the service.
         */
        function updateViewer(viewer, sender) {
            viewer = cleanDealerObject(viewer);
            $http.patch(DEALERS_BASE_URL + viewer.id + '/', viewer, {params: {mode: "edit"}})
                .then(function (response) {
                        // success
                        viewer = response.data;
                        ctrl.saveCurrent(viewer);
                        setIntercom(viewer);
                        broadcastResult(UPDATE_BROADCASTING_PREFIX + sender, true, viewer);
                    },
                    function (httpError) {
                        // error
                        broadcastResult(UPDATE_BROADCASTING_PREFIX + sender, false, httpError);
                    });
        }

        /**
         * Returns the dealer object of the user without unnecessary attributes for the patch request.
         * @param dealer - the dealer object that should be cleaned.
         */
        function cleanDealerObject(dealer) {
            var clean_dealer = $.extend({}, dealer);
            if (clean_dealer.hasOwnProperty("bank_accounts")) {
                delete clean_dealer["bank_accounts"];
            }
            if (clean_dealer.hasOwnProperty("screen_counters")) {
                delete clean_dealer["screen_counters"];
            }
            if (clean_dealer.hasOwnProperty("uploaded_deals")) {
                delete clean_dealer["uploaded_deals"];
            }
            if (clean_dealer.hasOwnProperty("liked_deals")) {
                delete clean_dealer["liked_deals"];
            }
            return clean_dealer;
        }

        /**
         * Sets the user's information in Intercom.
         * @param user - the user.
         */
        function setIntercom(user) {
            window.Intercom("update", {
                app_id: $rootScope.INTERCOM_APP_ID,
                user_id: user.id,
                user_hash: user.intercom_code,
                name: user.full_name, // Full name
                email: user.email,
                date_of_birth: user.date_of_birth,
                gender: user.gender,
                location: user.location,
                role: user.role,
                rank: user.rank,
            });
        }

        /**
         * Sets the logout notice to Intercom.
         */
        function logOutIntercom() {
            window.Intercom("shutdown");
        }

        /**
         * Updates the shipping_address field of the current user.
         * @param shippingAddress - the new shipping address.
         * @returns {promise} - the promise object of the dealer.
         */
        function updateShippingAddress(shippingAddress) {
            var data = {
                shipping_address: shippingAddress
            };
            return $http.patch(DEALERS_BASE_URL + $rootScope.dealer.id, data);
        }
    }]);
/**
 * Created by gullumbroso on 20/09/2016.
 */

angular.module('DealersApp')
/**
 * Providing functions for saving default settings for a user.
 */
    .factory('Defaults', ['$http', '$rootScope', 'Authentication', function DefaultsFactory($http, $rootScope, Authentication) {

        var DEALER_DEFAULTS_PATH = "/dealer_defaults/";

        var service = {};

        service.updateShippingMethods = updateShippingMethods;

        return service;

        /**
         * Updates the default values of the shipping methods of the dealer in the server.
         * @param product - the new product from which the shipping methods should be taken.
         * @param dealer - the dealer.
         */
        function updateShippingMethods(product, dealer) {
            var data = {};
            if (product.dealers_delivery) {
                data.dealers_delivery = product.dealers_delivery.id;
            } else {
                data.dealers_delivery = null;
            }
            if (product.custom_delivery) {
                data.custom_delivery = product.custom_delivery.id;
            } else {
                data.custom_delivery = null;
            }
            if (product.pickup_delivery) {
                data.pickup_delivery = product.pickup_delivery.id;
            } else {
                data.pickup_delivery = null;
            }
            $http.patch($rootScope.baseUrl + DEALER_DEFAULTS_PATH + dealer + '/', data)
                .then(function (response) {
                    console.log("Saved the shipping methods as default successfully!");
                }, function (err) {
                    console.log("There was an error while trying to save the shipping methods as defaults: " + err.data);
                });
        }
    }]);
/**
 * Created by gullumbroso on 30/04/2016.
 */
angular.module('DealersApp')
    .factory('Dialogs', ['$rootScope', '$mdDialog', '$mdMedia', 'Translations', function DialogsFactory($rootScope, $mdDialog, $mdMedia, Translations) {

        var service = {};

        var customFullscreen = $mdMedia('xs');

        service.showSignInDialog = showSignInDialog;
        service.confirmDialog = confirmDialog;
        service.showAlertDialog = showAlertDialog;

        return service;


        /**
         * Presents the sign in dialog (sign up and log in) and returns the promise.
         * @param ev - The event that triggered the function.
         * @param tabIndex - the index of the selected option (sign up is 0, log in is 1).
         * @param isViewer - true if triggered the sign up for viewers.
         * @return {Promise} - the promise that will run if process finished successfully.
         */
        function showSignInDialog(ev, tabIndex, isViewer) {
            return $mdDialog.show({
                controller: 'SignInDialogController',
                templateUrl: 'app/components/views/sign-in/sign-in-dialog.view.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: customFullscreen,
                locals: {tab: tabIndex, isViewer: isViewer}
            });
        }

        /**
         * Returns the confirm dialog object of type confirm.
         *
         * @param title - the title of the alert dialog.
         * @param content - the content of the alert dialog.
         * @param confirm - the confirm button title.
         * @param ev - the event that triggered the alert.
         * @return {mdDialog} - the confirm dialog object.
         */
        function confirmDialog(title, content, confirm, ev) {
            return $mdDialog.confirm(ev)
                .parent(angular.element(document.body))
                .clickOutsideToClose(false)
                .title(title)
                .textContent(content)
                .ariaLabel('Confirm Dialog')
                .ok(confirm)
                .cancel(Translations.general.cancel)
                .targetEvent(ev);
        }

        /**
         * Presents the alert dialog when there is an invalid field.
         * @param title - the title of the alert dialog.
         * @param content - the content of the alert dialog.
         * @param ev - the event that triggered the alert.
         */
        function showAlertDialog(title, content, ev) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .clickOutsideToClose(true)
                    .title(title)
                    .textContent(content)
                    .ariaLabel('Alert Dialog')
                    .ok(Translations.general.gotIt)
                    .targetEvent(ev)
            );
        }
    }]);
/*
 *  Manages information regarding the current session of adding a product.
 */
angular.module('DealersApp')
    .factory('EditProduct', ['$http', '$rootScope', '$routeParams', 'Product', 'ProductPhotos', function EditProductFactory($http, $rootScope, $routeParams, Product, ProductPhotos) {

        var EP_SESSION = 'epSession';
        var UPLOAD_STARTED_MESSAGE = 'ep-upload-started';
        var UPLOAD_FINISHED_MESSAGE = 'ep-upload-finished';
        var EP_SESSION_PHOTOS = 'epSessionPhotos';
        var EDIT_PRODUCT_PATH = '/adddeals/';
        var DELIVERY_PATH = "/deliverys/";

        var service = {};
        service.product = {};
        service.savedPhotosURLs = [];
        service.isAfterEdit = false;
        service.uploadModifiedProduct = uploadModifiedProduct;
        service.deleteVariants = deleteVariants;
        service.postVariant = postVariant;
        return service;

        /**
         * Runs the functions that is responsible for uploading the product to the server.
         * @param product - the product to upload.
         */
        function uploadModifiedProduct(product) {
            service.product = $.extend({}, product);
            setModifiedProductProperties();
            var firstPhoto = new Image();
            firstPhoto.onload = function () {
                service.product.main_photo_width = this.width;
                service.product.main_photo_height = this.height;
                uploadData(); // Need to wait for the image to be loaded because only then it's possible to get the main photo's width and height.
            };
            firstPhoto.src = URL.createObjectURL(service.product.photos[0]);
        }

        /**
         * Sets a few properties of the product in order to make is server-ready.
         */
        function setModifiedProductProperties() {
            service.product.currency = Product.keyForCurrency(service.product.currency);
            if (service.product.discount_value && service.product.discount_value > 0) {
                service.product.discount_type = Product.keyForDiscountType(service.product.discount_type);
            } else {
                service.product.discount_value = null;
                service.product.discount_type = null;
            }
            service.product.dealer = service.product.dealer.id;
            service.product.category = Product.keyForCategory(service.product.category);
            delete service.product.dealers_delivery;
            delete service.product.custom_delivery;
            delete service.product.pickup_delivery;
        }

        function uploadData() {
            var data = Product.extractData(service.product);
            $http.patch($rootScope.baseUrl + EDIT_PRODUCT_PATH + service.product.id + '/', data)
                .then(function (response) {
                    console.log("Product uploaded successfully!");
                    $rootScope.$broadcast(UPLOAD_FINISHED_MESSAGE, {success: true, data: response.data});
                }, function (err) {
                    console.log("There was an error while uploading the product: " + err.data);
                    $rootScope.$broadcast(UPLOAD_FINISHED_MESSAGE, {success: false, message: err.data});
                });
        }

        /**
         * Deletes the received variants from the server.
         * @param variants - the variants to delete.
         */
        function deleteVariants(variants) {
            for (var i = 0; i < variants.length; i++) {
                var varID = variants[i].id;
                if (varID) {
                    $http.delete($rootScope.baseUrl + "/variants/" + varID + "/")
                        .then(function (result) {
                        }, function (err) {
                            console.log("Failed to delete variant.");
                        });
                }
            }
        }

        /**
         * Posts the received variant to the server.
         * @param variant - the variant to post.
         * @return {promise} - the promise object.
         */
        function postVariant(variant) {
            return $http.post($rootScope.baseUrl + "/variants/", variant);
        }
    }]);
/**
 * Created by gullumbroso on 15/10/2016.
 */

angular.module('DealersApp')
    .service('LocalesService', function ($translate, LOCALES, $rootScope, tmhDynamicLocale) {
    'use strict';
    // PREPARING LOCALES INFO
    var localesObj = LOCALES.locales;

    // locales and locales display names
    var _LOCALES = Object.keys(localesObj);
    if (!_LOCALES || _LOCALES.length === 0) {
        console.error('There are no _LOCALES provided');
    }
    var _LOCALES_DISPLAY_NAMES = [];
    _LOCALES.forEach(function (locale) {
        _LOCALES_DISPLAY_NAMES.push(localesObj[locale]);
    });

    // STORING CURRENT LOCALE
    var currentLocale = $rootScope.language; // because of async loading

    // METHODS
    var checkLocaleIsValid = function (locale) {
        return _LOCALES.indexOf(locale) !== -1;
    };

    var setLocale = function (locale) {
        if (!checkLocaleIsValid(locale)) {
            console.error('Locale name "' + locale + '" is invalid');
            return;
        }
        currentLocale = locale;// updating current locale

        // asking angular-translate to load and apply proper translations
        $translate.use(locale);
        $rootScope.language = locale;
        document.documentElement.setAttribute('lang', locale);
        if (locale == 'he') {
            document.documentElement.setAttribute('dir', 'rtl');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
        }
    };

    // EVENTS
    // on successful applying translations by angular-translate
    $rootScope.$on('$translateChangeSuccess', function (event, data) {
        document.documentElement.setAttribute('lang', data.language);// sets "lang" attribute to html

        // asking angular-dynamic-locale to load and apply proper AngularJS $locale setting
        tmhDynamicLocale.set(data.language.toLowerCase().replace(/_/g, '-'));
    });

    return {
        getLocaleDisplayName: function () {
            return localesObj[currentLocale];
        },
        getLocaleDisplayFlag: function () {
            return LOCALES.localeFlags[LOCALES.locales[currentLocale]];
        },
        setLocaleByDisplayName: function (localeDisplayName) {
            setLocale(
                _LOCALES[
                    _LOCALES_DISPLAY_NAMES.indexOf(localeDisplayName)// get locale index
                    ]
            );
        },
        getLocalesDisplayNames: function () {
            return _LOCALES_DISPLAY_NAMES;
        },
        getFlag: function (localeDisplayName) {
            return LOCALES.localeFlags[localeDisplayName];
        }
    };
});
/**
 * Created by gullumbroso on 30/03/2016.
 */
angular.module('DealersApp')
    .factory('Photos', ['$mdMedia', function PhotosFactory($mdMedia) {

        var service = {};

        service.product = {
            maxWidth: 480,
            quality: 0.6
        };
        var isMobile = $mdMedia('xs') || $mdMedia('sm');

        service.hexToBase64 = hexToBase64;
        service.imageDataToUrls = imageDataToUrls;
        service.dataURItoBlob = dataURItoBlob;
        service.checkIfImageData = checkIfImageData;
        service.preparePhotoForUpload = preparePhotoForUpload;

        return service;

        function hexToBase64(str) {
            return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
        }

        /**
         * Receives an array with images data, and returns an array of urls for presentation in html.
         * @param data - the data to present.
         * @returns {Array} - the array of urls.
         */
        function imageDataToUrls(data) {
            var urls = [];
            for (var i = 0; i < data.length; i++) {
                try {
                    urls.push(URL.createObjectURL(data[i]));
                } catch (err) {
                    console.log(err.message);
                }
            }
            return urls;
        }

        /**
         * Converts data uri objects to blobs.
         * @param dataURI - the data uri of the photo.
         * @returns {blob} - blob object
         */
        function dataURItoBlob(dataURI) {
            var byteString = atob(dataURI.split(',')[1]);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], {type: 'image/png'});
        }

        /**
         * Checks to see if the createObjectURL method is callable on the received object. If so, it will indicate that
         * the received object is indeed an image data file.
         * @param object - the object to check.
         * @returns {boolean} - true if the method is callable on the object, else false.
         */
        function checkIfImageData(object) {
            var url;
            try {
                url = URL.createObjectURL(object);
            } catch (err) {
                console.log("Not a Blob object:\n" + err.message);
                return false;
            }
            if (url.length > 0) {
                return true;
            }
        }

        /**
         * Starts the photo reduction and upload process.
         * @param counter - the photo index (in the photos array, in case there is more than one).
         * @param photoName - the name of the photo.
         * @param photo - the photo to upload.
         * @param uploadFunc - the upload callback function.
         */
        function preparePhotoForUpload(counter, photoName, photo, uploadFunc) {
            var img = document.createElement("img");

            if (isMobile) { // The photo was taken in mobile, need to check orientation before uploading.
                EXIF.getData(photo, function () {
                    var compressionFactor = 0.65;
                    var orientation = EXIF.getTag(this, "Orientation");
                    img.onload = function () {
                        var canvas = createCanvasForImage(img);
                        var ctx = canvas.getContext('2d');
                        var width = canvas.width * compressionFactor;
                        var styleWidth = canvas.style.width * compressionFactor;
                        var height = canvas.height * compressionFactor;
                        var styleHeight = canvas.style.height * compressionFactor;
                        if (orientation > 4) {
                            canvas.width = height;
                            canvas.style.width = styleHeight;
                            canvas.height = width;
                            canvas.style.height = styleWidth;
                        } else {
                            canvas.width = width;
                            canvas.style.width = styleWidth;
                            canvas.height = height;
                            canvas.style.height = styleHeight;
                        }
                        switch (orientation) {
                            case 2:
                                ctx.translate(width, 0);
                                ctx.scale(-1, 1);
                                break;
                            case 3:
                                ctx.translate(width, height);
                                ctx.rotate(Math.PI);
                                break;
                            case 4:
                                ctx.translate(0, height);
                                ctx.scale(1, -1);
                                break;
                            case 5:
                                ctx.rotate(0.5 * Math.PI);
                                ctx.scale(1, -1);
                                break;
                            case 6:
                                ctx.rotate(0.5 * Math.PI);
                                ctx.translate(0, -height);
                                break;
                            case 7:
                                ctx.rotate(0.5 * Math.PI);
                                ctx.translate(width, -height);
                                ctx.scale(-1, 1);
                                break;
                            case 8:
                                ctx.rotate(-0.5 * Math.PI);
                                ctx.translate(-width, 0);
                                break;
                        }
                        ctx.drawImage(img, 0, 0, width, height);
                        var dataUrl = canvas.toDataURL('image/jpeg', service.product.quality);
                        var blob = dataURItoBlob(dataUrl);
                        uploadFunc(counter, photoName, blob);
                    };
                    img.src = URL.createObjectURL(photo);
                });

            } else { // The photo was taken in desktop computer.
                var reader = new FileReader();
                reader.onabort = function () {
                    alert("The upload was aborted.");
                };
                reader.onerror = function () {
                    alert("An error occurred while reading the file.");
                };
                reader.onload = function (e) {
                    img.src = e.target.result;
                    var photoBlob;
                    photoBlob = dataURItoBlob(reduceSize(img));
                    uploadFunc(counter, photoName, photoBlob);
                };

                reader.readAsDataURL(photo);
            }
        }

        function contextAccordingToOrientation(canvas, ctx, orientation) {
            switch (orientation) {
                case 2:
                    ctx.translate(width, 0);
                    ctx.scale(-1, 1);
                    break;
                case 3:
                    ctx.translate(width, height);
                    ctx.rotate(Math.PI);
                    break;
                case 4:
                    ctx.translate(0, height);
                    ctx.scale(1, -1);
                    break;
                case 5:
                    ctx.rotate(0.5 * Math.PI);
                    ctx.scale(1, -1);
                    break;
                case 6:
                    ctx.rotate(0.5 * Math.PI);
                    ctx.translate(0, -height);
                    break;
                case 7:
                    ctx.rotate(0.5 * Math.PI);
                    ctx.translate(width, -height);
                    ctx.scale(-1, 1);
                    break;
                case 8:
                    ctx.rotate(-0.5 * Math.PI);
                    ctx.translate(-width, 0);
                    break;
            }
            return ctx;
        }

        /**
         * Reduces the size of the photo before upload. Uses the algorithm that was presented in the following Stackoverflow post:
         * http://stackoverflow.com/questions/10333971/html5-pre-resize-images-before-uploading
         * @param image - the image.
         * @returns {string} the image data url.
         */
        function reduceSize(image) {
            var canvas = createCanvasForImage(image);

            while (canvas.width >= (2 * service.product.maxWidth)) {
                canvas = getHalfScaleCanvas(canvas);
            }

            if (canvas.width > service.product.maxWidth) {
                canvas = scaleCanvasWithAlgorithm(canvas);
            }

            return canvas.toDataURL('image/jpeg', service.product.quality);
        }

        /**
         * Creates a canvas object for the received image.
         * @param image - the image.
         * @returns {canvas} - the new canvas object.
         */
        function createCanvasForImage(image) {
            var canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
            return canvas;
        }

        function getHalfScaleCanvas(canvas) {
            var halfCanvas = document.createElement('canvas');
            halfCanvas.width = canvas.width / 2;
            halfCanvas.height = canvas.height / 2;
            halfCanvas.getContext('2d').drawImage(canvas, 0, 0, halfCanvas.width, halfCanvas.height);
            return halfCanvas;
        }

        function scaleCanvasWithAlgorithm(canvas) {
            var scaledCanvas = document.createElement('canvas');
            var scale = service.product.maxWidth / canvas.width;
            scaledCanvas.width = canvas.width * scale;
            scaledCanvas.height = canvas.height * scale;

            var srcImgData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
            var destImgData = scaledCanvas.getContext('2d').createImageData(scaledCanvas.width, scaledCanvas.height);

            applyBilinearInterpolation(srcImgData, destImgData, scale);

            scaledCanvas.getContext('2d').putImageData(destImgData, 0, 0);

            return scaledCanvas;
        }

        function applyBilinearInterpolation(srcCanvasData, destCanvasData, scale) {
            function inner(f00, f10, f01, f11, x, y) {
                var un_x = 1.0 - x;
                var un_y = 1.0 - y;
                return (f00 * un_x * un_y + f10 * x * un_y + f01 * un_x * y + f11 * x * y);
            }

            var i, j;
            var iyv, iy0, iy1, ixv, ix0, ix1;
            var idxD, idxS00, idxS10, idxS01, idxS11;
            var dx, dy;
            var r, g, b, a;
            for (i = 0; i < destCanvasData.height; ++i) {
                iyv = i / scale;
                iy0 = Math.floor(iyv);
                // Math.ceil can go over bounds
                iy1 = (Math.ceil(iyv) > (srcCanvasData.height - 1) ? (srcCanvasData.height - 1) : Math.ceil(iyv));
                for (j = 0; j < destCanvasData.width; ++j) {
                    ixv = j / scale;
                    ix0 = Math.floor(ixv);
                    // Math.ceil can go over bounds
                    ix1 = (Math.ceil(ixv) > (srcCanvasData.width - 1) ? (srcCanvasData.width - 1) : Math.ceil(ixv));
                    idxD = (j + destCanvasData.width * i) * 4;
                    // matrix to vector indices
                    idxS00 = (ix0 + srcCanvasData.width * iy0) * 4;
                    idxS10 = (ix1 + srcCanvasData.width * iy0) * 4;
                    idxS01 = (ix0 + srcCanvasData.width * iy1) * 4;
                    idxS11 = (ix1 + srcCanvasData.width * iy1) * 4;
                    // overall coordinates to unit square
                    dx = ixv - ix0;
                    dy = iyv - iy0;
                    // I let the r, g, b, a on purpose for debugging
                    r = inner(srcCanvasData.data[idxS00], srcCanvasData.data[idxS10], srcCanvasData.data[idxS01], srcCanvasData.data[idxS11], dx, dy);
                    destCanvasData.data[idxD] = r;

                    g = inner(srcCanvasData.data[idxS00 + 1], srcCanvasData.data[idxS10 + 1], srcCanvasData.data[idxS01 + 1], srcCanvasData.data[idxS11 + 1], dx, dy);
                    destCanvasData.data[idxD + 1] = g;

                    b = inner(srcCanvasData.data[idxS00 + 2], srcCanvasData.data[idxS10 + 2], srcCanvasData.data[idxS01 + 2], srcCanvasData.data[idxS11 + 2], dx, dy);
                    destCanvasData.data[idxD + 2] = b;

                    a = inner(srcCanvasData.data[idxS00 + 3], srcCanvasData.data[idxS10 + 3], srcCanvasData.data[idxS01 + 3], srcCanvasData.data[idxS11 + 3], dx, dy);
                    destCanvasData.data[idxD + 3] = a;
                }
            }
        }
    }]);
/*
 *  Contains valueable constants regarding the deal's information.
 */

angular.module('DealersApp')
    .factory('ProductInfo', ['$http', '$rootScope', 'Authentication', function ProductInfoFactory($http, $rootScope, Authentication) {

        var ctrl = this;
        var service = {};

        // dictionaries
        var currencies = {
            'USD': '$',
            'ILS': '₪',
            'CNY': '¥',
            'GBP': '£',
            'EUR': '€'
        };

        service.currencyForKey = currencyForKey;
        service.getDummyProducts = getDummyProducts;

        return service;

        function currencyForKey(key) {
            return currencies[key];
        }

        function getDummyProducts() {
            var products = [];
            var product = {};
            product.store = {};
            product.title = "Great product now at Zara with great accessories and stuff";
            product.price = Number(15);
            product.currency = "DO";
            product.expiration = new Date();
            product.store.name = "Zara, Raanana";
            product.photoURL1 = "jdsfjkdsf;";

            products.push(product);

            product = {};
            product.store = {};
            product.title = "Wow come see what I found here";
            product.price = Number(266);
            product.currency = "SH";
            product.expiration = new Date();
            product.store.name = "Shekem Electric";
            product.photoURL1 = "jdsfjkdsf;";
            product.dealattribs = {};
            product.dealattribs.dealers_that_liked = [2, 4, 14];

            products.push(product);

            product = {};
            product.store = {};
            product.title = "1+1 on al hamburgers at McDonalds... Yam Yam!";
            product.store.name = "McDonalds, Kiryat Mozkin Krayot";
            product.photoURL1 = "jdsfjkdsf;";

            products.push(product);

            product = {};
            product.store = {};
            product.title = "Awesome shoes at nike store";
            product.price = Number(15);
            product.currency = "SH";
            product.store.name = "Nike";
            product.photoURL1 = "jdsfjkdsf;";

            products.push(product);

            return products;
        }
    }]);
angular.module('DealersApp')
    .factory('ProductPhotos', ['$rootScope', 'Photos', function ProductPhotosFactory($rootScope, Photos) {

        var KEY = "media/Deals_Photos/";
        var BROADCASTING_PREFIX = 'photos-downloaded-for-';

        var service = {};

        service.hasPhoto = hasPhoto;
        service.downloadPhoto = downloadPhoto;
        service.downloadPhotos = downloadPhotos;
        service.photosNum = photosNum;
        service.colorForNum = colorForNum;
        service.generatePhotoName = generatePhotoName;
        service.addPhotoUrlToProduct = addPhotoUrlToProduct;
        service.uploadPhotosOfProduct = uploadPhotosOfProduct;
        service.setProductPhotosInArray = setProductPhotosInArray;
        service.deletePhotos = deletePhotos;

        service.process = {};
        service.process.sender = ""; // The originator of the current uploading process
        service.process.amount = 0; // The amount of photos to upload in the current process
        service.process.product = null; // The product object of the current process

        return service;

        /**
         * Determines if the product has photos.
         * @param photoAddress
         * @returns {boolean}
         */
        function hasPhoto(photoAddress) {
            return (photoAddress.length > 2) && (photoAddress != "None");
        }

        /**
         * Downloads the photo from the s3.
         * @param key - the key of the photo.
         * @param productID - the id of the product.
         * @param photoIndex - the index of the photo, if it is one out of a number of photos.
         */
        function downloadPhoto(key, productID, photoIndex) {
            $rootScope.s3.getObject(
                {Bucket: $rootScope.AWSS3Bucket, Key: key, ResponseContentType: "image/jpg"},
                function (error, result) {
                    var data = {};
                    data.photoIndex = photoIndex;
                    if (error != null) {
                        data.message = "Failed to download photo of product" + productID + ":\n" + error.message;
                        $rootScope.$broadcast('downloaded-photo-' + productID, {success: false, data: data});
                    } else {
                        var blob = new Blob([result.Body], {'type': 'image/png'});
                        data.rawImage = blob;
                        data.url = URL.createObjectURL(blob);
                        $rootScope.$broadcast('downloaded-photo-' + productID, {success: true, data: data});
                    }
                }
            );
        }

        /**
         * Downloads the photos of the received product.
         * @param product - the product.
         */
        function downloadPhotos(product) {
            if (product.photo1) {
                downloadPhoto(product.photo1, product.id, 1);
            }
            if (product.photo2) {
                downloadPhoto(product.photo2, product.id, 2);
            }
            if (product.photo3) {
                downloadPhoto(product.photo3, product.id, 3);
            }
            if (product.photo4) {
                downloadPhoto(product.photo4, product.id, 4);
            }
        }

        /**
         * Generates a name to every photo that is about to be uploaded to the s3.
         * @param index - the index of the photo in the product's photos array.
         * @returns {string} - the generated name.
         */
        function generatePhotoName(index) {
            var dealerID = String($rootScope.dealer.id);
            var d = new Date();
            var date = String(d.getTime() / 1000);
            var i = String(index + 1); // Avoiding the 0 indexing
            return dealerID + "_" + date + "_" + i + ".png";
        }

        /**
         * Adds the photos' path and name to the product object.
         * @param index - the index of the photo.
         * @param photoName - the name of the photo.
         * @param key - the s3 key.
         * @param product - the product.
         */
        function addPhotoUrlToProduct(index, photoName, key, product) {
            switch (index) {
                case 0:
                    product.photo1 = key + photoName;
                    break;
                case 1:
                    product.photo2 = key + photoName;
                    break;
                case 2:
                    product.photo3 = key + photoName;
                    break;
                case 3:
                    product.photo4 = key + photoName;
                    break;
            }
        }

        /**
         * Clears the photo urls of the received product.
         * @param product - the product.
         * @returns {product} the product with blank photo urls.
         */
        function clearPhotosUrlsOfProduct(product) {
            if (product.photo1) {
                product.photo1 = "";
            }
            if (product.photo2) {
                product.photo2 = "";
            }
            if (product.photo3) {
                product.photo3 = "";
            }
            if (product.photo4) {
                product.photo4 = "";
            }
            return product;
        }

        /**
         * Returns the number of photos the product has.
         * @param product - the product.
         * @return {int} - the number of photos the product has.
         */
        function photosNum(product) {
            var count = 0;
            if (product.photo1)
                count++;
            if (product.photo2)
                count++;
            if (product.photo3)
                count++;
            if (product.photo4)
                count++;
            return count;
        }

        function colorForNum(num) {
            switch (parseInt(num, 10)) {
                case 0:
                    return "rgb(79,195,247)";
                    break;
                case 1:
                    return "rgb(129,216,132)";
                    break;
                case 2:
                    return "rgb(255,100,105)";
                    break;
                case 3:
                    return "rgb(255,212,40)";
                    break;
                default:
                    return "rgb(79,195,247)";
                    break;
            }
        }

        /**
         * Uploads the photos of the received product.
         * @param product - the product to which the photos belong.
         * @param sender - the originator of this process.
         */
        function uploadPhotosOfProduct(product, sender) {
            var photos = product.photos;

            service.process.sender = sender;
            service.process.amount = photos.length;
            service.process.product = product;

            if (!photos) {
                console.log("The photos array that was sent to the upload function is null!");
                $rootScope.$broadcast(BROADCASTING_PREFIX + sender, {
                    success: false,
                    data: "There was a problem, please try again!"
                });
                return;
            }
            if (photos.length == 0) {
                console.log("The photos array that was sent to the upload function is empty!");
                $rootScope.$broadcast(BROADCASTING_PREFIX + sender, {
                    success: false,
                    data: "There was a problem, please try again!"
                });
                return;
            }
            product = clearPhotosUrlsOfProduct(product);
            var uploadFunc = uploadData;
            for (var i = 0; i < photos.length; i++) {
                var photoName = generatePhotoName(i);
                addPhotoUrlToProduct(i, photoName, KEY, product);
                Photos.preparePhotoForUpload(i, photoName, photos[i], uploadFunc);
            }
        }

        /**
         * Uploads the received photo and photo metadata to the S3.
         * @param photoCount - the photo index (in the product's photos array).
         * @param photoName - the name of the photo.
         * @param photo - the photo.
         */
        function uploadData(photoCount, photoName, photo) {
            var params = {
                Bucket: $rootScope.AWSS3Bucket,
                Key: KEY + photoName,
                Body: photo
            };
            $rootScope.s3.putObject(params, function (err, data) {
                var sender = service.process.sender;
                if (err) {
                    // There Was An Error With Your S3 Config
                    console.log("There was an error with s3 config: " + err.message);
                    $rootScope.$broadcast(BROADCASTING_PREFIX + sender, {success: false, data: err.message});
                }
                else {
                    photoCount++;
                    console.log("Photo number " + photoCount + " upload complete.");
                    if (photoCount == service.process.amount) {
                        $rootScope.$broadcast(BROADCASTING_PREFIX + sender, {
                            success: true,
                            data: data,
                            product: service.process.product
                        });
                        // Reset the service process global values.
                        service.process.sender = "";
                        service.process.amount = 0;
                        service.process.product = null;
                    }
                }
            });
        }

        /**
         * Sets the photo urls of the received product in an array, and returns it.
         * @param product - the product.
         * @returns {Array} - the array of photo urls.
         */
        function setProductPhotosInArray(product) {
            var photoURL = [];
            if (product.photo1) {
                photoURL.push(product.photo1);
            }
            if (product.photo2) {
                photoURL.push(product.photo2);
            }
            if (product.photo3) {
                photoURL.push(product.photo3);
            }
            if (product.photo4) {
                photoURL.push(product.photo4);
            }
            return photoURL;
        }

        function deletePhotos(photosToDelete) {
            for (var i = 0; i < photosToDelete.length; i++) {
                var params = {
                    Bucket: $rootScope.AWSS3Bucket,
                    Key: KEY + photosToDelete[i]
                };
                $rootScope.s3.deleteObject(params, function (err, data) {
                    if (err) {
                        console.log(err, err.stack); // an error occurred
                    }
                    else {
                        console.log("Old photo was deleted successfully!\n" + data);
                    }
                });
            }

        }
    }]);

angular.module('DealersApp')
    .factory('Product', ['$http', '$rootScope', 'ShippingMethods', function ProductFactory($http, $rootScope, ShippingMethods) {

        var ctrl = this;
        var service = {};

        var currencies = {
            'USD': '$',
            'ILS': '₪',
            'CNY': '¥',
            'GBP': '£',
            'EUR': '€'
        };

        var categories = {
            "Fa": "Fashion",
            "Au": "Automotive",
            "Ar": "Art",
            "Be": "Health & Beauty",
            "Bo": "Books & Magazines",
            "El": "Electronics",
            "En": "Entertainment & Events",
            "Fo": "Food & Groceries",
            "Ho": "Home & Furniture",
            "Ki": "Kids & Babies",
            "Mu": "Music",
            "Pe": "Pets",
            "Re": "Restaurants & Bars",
            "Se": "Services",
            "Sp": "Sports & Outdoor",
            "Tr": "Travel",
            "Ot": "Other"
        };

        service.getProduct = getProduct;
        service.getProducts = getProducts;
        service.deleteProduct = deleteProduct;
        service.buyProduct = buyProduct;
        service.removePhotoPaths = removePhotoPaths;

        service.mapData = mapData;
        service.unStringifyObject = unStringifyObject;
        service.categoryForKey = categoryForKey;
        service.keyForCategory = keyForCategory;
        service.currencyForKey = currencyForKey;
        service.keyForCurrency = keyForCurrency;
        service.convertKeysToCurrencies = convertKeysToCurrencies;
        service.discountTypeForKey = discountTypeForKey;
        service.keyForDiscountType = keyForDiscountType;
        service.areEqual = areEqual;
        service.parseVariantsToServer = parseVariantsToServer;
        service.parseVariantsFromServer = parseVariantsFromServer;
        service.extractData = extractData;

        return service;

        /**
         * Returns a call for a specific product form the server
         */
        function getProduct(productID) {
            if (productID) {
                return $http.get($rootScope.baseUrl + '/alldeals/' + String(productID) + '/');
            }
        }

        /**
         * Returns a call for a list of products form the server
         */
        function getProducts(url) {
            return $http.get(url);
        }

        function deleteProduct(url) {
            return $http.delete(url);
        }

        /**
         * Sends the buy request to the server and from there to Stripe.
         * @param charge - the charge object.
         * @returns {promise} - the promise object of the post method.
         */
        function buyProduct(charge) {
            return $http.post($rootScope.baseUrl + '/transactions/', charge);
        }

        /**
         * Returns the received product without the photo's paths properties.
         * @param product - the received product.
         * @returns {product} the "photo pathless" product.
         */
        function removePhotoPaths(product) {
            if (product.hasOwnProperty("photo1")) {
                delete product["photo1"];
            }
            if (product.hasOwnProperty("photo2")) {
                delete product["photo2"];
            }
            if (product.hasOwnProperty("photo3")) {
                delete product["photo3"];
            }
            if (product.hasOwnProperty("photo4")) {
                delete product["photo4"];
            }
            return product;
        }

        /**
         * Converts the keys of the server to regular strings, and returns the updated product.
         */
        function mapData(product) {
            if (product.category) {
                var category = categoryForKey(product.category);
                if (category) {
                    product.category = category;
                }
            }
            if (product.currency) {
                if (product.currency.length == 3) {
                    product.currency = currencyForKey(product.currency);
                }
            }
            if (product.discount_type) {
                if (product.discount_type.length == 2) {
                    product.discount_type = discountTypeForKey(product.discount_type);
                }
            }
            if (product.expiration) {
                if (typeof product.expiration == "string") {
                    product.expiration = new Date(product.expiration);
                }
            }
            product = ShippingMethods.mapProductDeliveries(product);
            return product;
        }

        /**
         * Parses the string representation of the product object into a valid product object with various value types.
         * @param product - the product to parse.
         * @returns {product} - a new valid product object.
         */
        function unStringifyObject(product) {
            if (product.id) {
                product.id = parseInt(product.id);
            }
            if (product.dealer) {
                if (product.dealer.id) {
                    product.dealer.id = parseInt(product.dealer.id);
                }
            }
            if (product.price) {
                product.price = parseFloat(product.price);
            }
            if (product.percentage_off) {
                product.percentage_off = parseFloat(product.percentage_off);
            }
            if (product.original_price) {
                product.original_price = parseFloat(product.original_price);
            }
            if (product.max_quantity) {
                product.max_quantity = parseInt(product.max_quantity);
            }
            if (product.expiration) {
                product.expiration = new Date(product.expiration);
            }
            if (product.upload_date) {
                product.upload_date = new Date(product.upload_date);
            }
            if (product.main_photo_width) {
                product.main_photo_width = parseInt(product.main_photo_width);
            }
            if (product.main_photo_height) {
                product.main_photo_height = parseInt(product.main_photo_height);
            }

            return product;
        }

        /**
         * Returns the category that matches the received server key.
         * @param key - the server key.
         * @returns {string} the matching category.
         */
        function categoryForKey(key) {
            return categories[key];
        }

        /**
         * Returns the server key that matches the received category.
         * @param category - the received category.
         * @returns {string} the matching server key.
         */
        function keyForCategory(category) {
            for (var property in categories) {
                if (categories.hasOwnProperty(property)) {
                    if (categories[property] === category)
                        return property;
                }
            }
        }

        /**
         * Returns the currency that matches the received server key.
         * @param key - the server key.
         * @returns {string} the matching currency.
         */
        function currencyForKey(key) {
            if (key) {
                if (key.length == 3)
                    return currencies[key];
            }
            return key;
        }

        /**
         * Returns the server key that matches the received currency.
         * @param currency - the currency.
         * @returns {string} the matching server key.
         */
        function keyForCurrency(currency) {
            for (var property in currencies) {
                if (currencies.hasOwnProperty(property)) {
                    if (currencies[property] === currency)
                        return property;
                }
            }
        }

        /**
         * Converts the server keys currencies in the received object to presentable currencies.
         *
         * @param currArray - an array with objects that contain a currency field.
         * @returns {Array} the received array with with converted objects.
         */
        function convertKeysToCurrencies(currArray) {
            for (var i = 0; i < currArray.length; i++) {
                var currKey = currArray[i].currency;
                currArray[i].currency = currencyForKey(currKey);
            }
            return currArray;
        }

        /**
         * Returns the discount type that matches the server key.
         * @param key - the server key.
         * @returns {string} the matching discount type.
         */
        function discountTypeForKey(key) {
            if (key == "PP") {
                return "123";
            } else if (key == "PE") {
                return "%";
            }
        }

        /**
         * Returns the server key that matches the received discount type.
         * @param type - the discount type.
         * @returns {string} the matching server key.
         */
        function keyForDiscountType(type) {
            if (type == "123") {
                return "PP";
            } else if (type == "%") {
                return "PE";
            }
        }

        /**
         * Determines if 2 products are equal, according to specific fields (those who are editable).
         * @param product1 - the first product.
         * @param product2 - the second product.
         * @returns {boolean} - true if equal, else false.
         */
        function areEqual(product1, product2) {
            if (product1.title != product2.title) {
                return false;
            }
            if (product1.price != product2.price) {
                return false;
            }
            if (product1.currency != product2.currency) {
                return false;
            }
            if (product1.discount_value != product2.discount_value) {
                return false;
            }
            if (product1.discount_type != product2.discount_type) {
                return false;
            }
            if (product1.category != product2.category) {
                return false;
            }
            if (product1.expiration != product2.expiration) {
                return false;
            }
            if (product1.more_description != product2.more_description) {
                return false;
            }
            if (product1.more_description != product2.more_description) {
                return false;
            }
            return true;
        }

        /**
         * Parses the variants of the product to the server format.
         * @param variants - the variants to parse.
         * @returns {Array} - the parsed variants array.
         */
        function parseVariantsToServer(variants) {
            var parsedVariants = [];
            var variant = {};
            for (var property in variants) {
                if (variants.hasOwnProperty(property)) {
                    variant.name = variants[property].name;
                    variant.options = [];
                    var options = variants[property].options;
                    for (var j = 0; j < options.length; j++) {
                        variant.options.push({"option": variants[property].options[j]});
                    }
                    parsedVariants.push(variant);
                    variant = {};
                }
            }
            return parsedVariants;
        }

        /**
         * Parses the variants of the product to the front format.
         * @param variants - the variants to parse.
         * @returns {variants} - the parsed variants.
         */
        function parseVariantsFromServer(variants) {
            var parsedVariants = {};
            var variant = {};
            var counter = 0;
            for (var i = 0; i < variants.length; i++) {
                var curVar = variants[i];
                variant.name = curVar.name;
                variant.options = [];
                for (var j = 0; j < curVar.options.length; j++) {
                    variant.options.push(curVar.options[j].option);
                }
                parsedVariants[counter] = variant;
                variant = {};
                counter++;
            }
            return parsedVariants;
        }

        /**
         * Remove the raw photos data in order to separate between the photos of the product (that goes to s3) and the
         * actual data that is uploaded to the server.
         * @param product - the product that should be extracted.
         */
        function extractData(product) {
            var extracted = $.extend(true, {}, product);
            delete extracted.photos;
            return extracted;
        }
    }]);
/**
 * Created by gullumbroso on 29/04/2016.
 */

angular.module('DealersApp')
/**
 * This service offer methods to manage and orginize product arrays.
 */
    .factory('ProductsGrid', ['$http', '$rootScope', 'Authentication', function ProductsGridFactory($http, $rootScope, Authentication) {

        var PRODUCTS_IN_CHUNK = 2;

        var service = {};
        service.divideProductsIntoChunks = divideProductsIntoChunks;
        service.addProductsToArray = addProductsToArray;

        return service;

        /**
         * Slices the received array of products into chunks.
         * @param products - the received products array.
         * @returns {Array} - the chunkedArray.
         */
        function divideProductsIntoChunks(products) {
            var chunkedProductsArray = [], productsChunk;
            for (var i = 0; i < products.length; i += PRODUCTS_IN_CHUNK) {
                productsChunk = products.slice(i, i + PRODUCTS_IN_CHUNK);
                chunkedProductsArray.push(productsChunk);
            }
            return chunkedProductsArray;
        }

        /**
         * Adds new products to an existing product array. This method assumes that the first argument (the existing product array) is
         * already divided into chunks.
         * @param products - the existing product array.
         * @param newProducts - the products to add to the existing array.
         * @returns {Array} - the product array that contains the new products.
         */
        function addProductsToArray(products, newProducts) {
            if (products && newProducts) {
                if (products.length == 0) {
                    return divideProductsIntoChunks(newProducts);
                }
                var lastChunk = products[products.length - 1];
                var def = PRODUCTS_IN_CHUNK - lastChunk.length;
                Array.prototype.push.apply(lastChunk, newProducts.splice(0, def));
                newProducts = divideProductsIntoChunks(newProducts);
                Array.prototype.push.apply(products, newProducts);
                return products;
            }
        }
    }]);

/**
 * Created by gullumbroso on 18/06/2016.
 */

angular.module('DealersApp')
/**
 * This service offer methods to download and post purchases data.
 */
    .factory('Purchase', ['$http', '$rootScope', 'Product', 'Analytics', function PurchaseFactory($http, $rootScope, Product, Analytics) {

        var PURCHASES_SOURCE = $rootScope.baseUrl + '/purchases/';
        var ORDERS_SOURCE = $rootScope.baseUrl + "/orders/";
        var SALES_SOURCE = $rootScope.baseUrl + "/sales/";

        var service = {};

        service.PURCHASED_STATUS = "Purchased";
        service.SENT_STATUS = "Sent";
        service.RECEIVED_STATUS = "Received";

        service.getOrders = getOrders;
        service.getSales = getSales;
        service.getPurchase = getPurchase;
        service.addPurchase = addPurchase;
        service.updatePurchase = updatePurchase;
        service.updateEstimatedDeliveryTime = updateEstimatedDeliveryTime;

        return service;

        /**
         * Returns the orders that the user made.
         *
         * @param userID - the id of the user.
         * @returns the callback of the $http.get function.
         */
        function getOrders(userID) {
            return $http.get(ORDERS_SOURCE + userID + '/');
        }

        /**
         * Returns the sales of the dealer.
         *
         * @param dealerID - the id of the dealer.
         * @returns the callback of the $http.get function.
         */
        function getSales(dealerID) {
            return $http.get(SALES_SOURCE + dealerID + '/');
        }

        function getPurchase(purchaseID) {
            return $http.get(PURCHASES_SOURCE + purchaseID + '/');
        }

        /**
         * Posts the purchase information to the server.
         * @param purchase - the purchase object.
         * @param product - the purchased product.
         */
        function addPurchase(purchase, product) {
            purchase.purchase_date = new Date();
            $http.post(PURCHASES_SOURCE, purchase)
                .then(function (response) {
                        // success
                        console.log("Purchase saved.");
                        purchase = response.data;
                        Analytics.addTrans(String(purchase.id), String(purchase.dealer), String((purchase.amount * purchase.quantity) / 100), '', '', '', '', '', purchase.currency);
                        Analytics.addItem(String(purchase.id), '', product.title, product.category, String(purchase.amount / 100), String(purchase.quantity));
                        $rootScope.$broadcast("purchaseSaved", purchase.id);
                    },
                    function (httpError) {
                        // error
                        console.log("Couldn't save the purchase data.");
                    });
        }

        /**
         * Updates the purchase object.
         *
         * @param newStatus - the new status of the purchase.
         * @param purchase - the purchase object to update.
         * @returns the callback function of the $http.patch function.
         */
        function updatePurchase(newStatus, purchase) {
            if (newStatus == service.SENT_STATUS && purchase.status == service.PURCHASED_STATUS) {
                purchase.send_date = new Date();
            } else if (newStatus == service.RECEIVED_STATUS && purchase.status == service.SENT_STATUS) {
                purchase.receive_date = new Date();
            } else if (newStatus == service.PURCHASED_STATUS && purchase.status == service.SENT_STATUS) {
                purchase.send_date = null;
                purchase.estimated_delivery_time = null;
            } else if (newStatus == service.SENT_STATUS && purchase.status == service.RECEIVED_STATUS) {
                purchase.receive_date = null;
            }
            purchase.status = newStatus;
            purchase = preparePurchaseForServer(purchase);
            return $http.patch(PURCHASES_SOURCE + purchase.id + '/', purchase)
        }

        /**
         * Maps all the relevant properties to the matching values in the server.
         * @param purchase - the purchase object.
         * @returns {purchase} the mapped purchase object.
         */
        function preparePurchaseForServer(purchase) {
            purchase.currency = Product.keyForCurrency(purchase.currency);
            if (purchase.dealer.id) {
                purchase.dealer = purchase.dealer.id;
            }
            if (purchase.deal.id) {
                purchase.deal = purchase.deal.id;
            }
            if (purchase.buyer.id) {
                purchase.buyer = purchase.buyer.id;
            }
            return purchase;
        }

        /**
         * Updates the estimated delivery time of the purchase.
         *
         * @param estimatedDeliveryTime - the estimated delivery time of the purchase.
         * @param purchase - the purchase object to update.
         * @returns the callback function of the $http.patch function.
         */
        function updateEstimatedDeliveryTime(estimatedDeliveryTime, purchase) {
            if (estimatedDeliveryTime >= 0) {
                var data = {estimated_delivery_time: estimatedDeliveryTime};
                return $http.patch(PURCHASES_SOURCE + purchase.id + '/', data);
            }
            console.log("Invalid estimated delivery time value.");
        }
    }]);
/**
 * Created by gullumbroso on 09/08/2016.
 */

angular.module('DealersApp')
    .factory('RootDealerReady', ['$q', function RootDealerReadyFactory($q) {

        var deferred = $q.defer();
        var service = {};

        service.setAsReady = function (dealer) {
            deferred.resolve(dealer);
        };

        service.whenReady = function () {
            return deferred.promise;
        };

        return service;
    }]);
/**
 * Created by gullumbroso on 20/09/2016.
 */


/*
 *  Manages information regarding the current session of adding a product.
 */
angular.module('DealersApp')
    .factory('ShippingMethods', ['$http', '$rootScope', 'Dialogs', '$translate', 'Translations',
        function ShippingMethodsFactory($http, $rootScope, Dialogs, $translate, Translations) {

            var DELIVERY_PATH = "/deliverys/";
            var EDIT_DELIVERY_PATH = "/editdeliverys/";

            var service = {};

            service.DEALERS_TITLE = "Dealers Express Shipping";
            service.DEALERS_SHIPPING_PRICE = 35; // Shekels
            service.DEALERS_SHIPPING_ETD = 2; // Days
            service.DEALERS_SHIPPING_DESCRIPTION = "This is the standard express shipping.";
            service.DEALERS_METHOD = "Dealers_delivery";
            service.CUSTOM_METHOD = "Other_delivery";
            service.PICKUP_TITLE = "Self Pickup";
            service.PICKUP_METHOD = "Self_pickup";
            service.UPDATE_FINISHED = "shipping_update_update";
            service.updateCounter = 0;

            service.DEFAULT_DEALER_SHIIPPING = {
                selected: false,
                title: service.DEALERS_TITLE,
                shipping_price: service.DEALERS_SHIPPING_PRICE,
                estimated_delivery_time: service.DEALERS_SHIPPING_ETD,
                description: service.DEALERS_SHIPPING_DESCRIPTION
            };

            service.DEFAULT_PICKUP_SHIIPPING = {
                selected: false,
                title: service.PICKUP_TITLE,
                shipping_price: 0,
            };

            $rootScope.$on('$translateChangeSuccess', function () {
                service.DEALERS_TITLE = $translate.instant("services.shipping-methods.dealers-title");
                service.DEALERS_SHIPPING_DESCRIPTION = $translate.instant("services.shipping-methods.dealers-description");
                service.PICKUP_TITLE = $translate.instant("services.shipping-methods.pickup-title");
            });

            service.getDelivery = getDelivery;
            service.convertDeliveryToServer = convertDeliveryToServer;
            service.convertDeliveryFromServer = convertDeliveryFromServer;
            service.parseShippingFromServer = parseShippingFromServer;
            service.mapProductDeliveries = mapProductDeliveries;
            service.updateShippingMethods = updateShippingMethods;
            service.validateShippingMethods = validateShippingMethods;

            return service;

            /**
             * Returns the promise object of the call for the delivery's information form the server.
             * @param deliveryID - The delivery's id.
             * @returns {HttpPromise} - The promise of the call.
             */
            function getDelivery(deliveryID) {
                if (!deliveryID) {
                    console.error("Didn't get a valid delivery id.");
                    return null;
                }
                return $http.get($rootScope.baseUrl + DELIVERY_PATH + '/' + deliveryID + '/');
            }

            /**
             * Converts the values of the delivery object into the server's format.
             * @param delivery - The delivery object.
             * @returns {Delivery} - The converted delivery object.
             */
            function convertDeliveryToServer(delivery) {
                if (delivery.hasOwnProperty("shipping_price")) {
                    delivery.shipping_price *= 100;
                }
                return delivery;
            }

            /**
             * Converts the values of the delivery object into the client's format.
             * @param delivery - The delivery object.
             * @returns {Delivery} - The converted delivery object.
             */
            function convertDeliveryFromServer(delivery) {
                if (delivery.hasOwnProperty("shipping_price")) {
                    delivery.shipping_price /= 100;
                }
                return delivery;
            }

            /**
             * Parses the received object's shipping methods into the client format, and returns it.
             * @param object - the received object to parse.
             */
            function parseShippingFromServer(object) {
                if (!object.hasOwnProperty("dealers_delivery")) {
                    console.error("Error - received an object without deliveries fields.")
                }
                var shippingObject = {
                    dealers: service.DEFAULT_DEALER_SHIIPPING,
                    custom: {selected: false},
                    pickup: service.DEFAULT_PICKUP_SHIIPPING
                };

                if (object.dealers_delivery) {
                    shippingObject.dealers = object.dealers_delivery;
                    shippingObject.dealers.selected = true;
                }
                if (object.custom_delivery) {
                    shippingObject.custom = object.custom_delivery;
                    shippingObject.custom.selected = true;
                }
                if (object.pickup_delivery) {
                    shippingObject.pickup = object.pickup_delivery;
                    shippingObject.pickup.selected = true;
                }

                return shippingObject;
            }

            /**
             * Converts the delivery methods from the server to the client format.
             * @param product - The product to convert.
             * @returns {Product} - The converted product object.
             */
            function mapProductDeliveries(product) {
                if (product.dealers_delivery) {
                    product.dealers_delivery.shipping_price /= 100;
                }
                if (product.custom_delivery) {
                    product.custom_delivery.shipping_price /= 100;
                }
                return product;
            }


            /**
             * Posts the delivery object to the server.
             * @param delivery
             */
            function postDelivery(delivery) {
                if (!delivery) {
                    console.error("No delivery object.");
                }
                service.updateCounter++;
                delivery = convertDeliveryToServer(delivery);
                $http.post($rootScope.baseUrl + EDIT_DELIVERY_PATH, delivery)
                    .then(function (response) {
                        console.log("Posted delivery");
                        successfulUpdate();
                    }, function (err) {
                        console.log("There was an error while updating the delivery method: " + err.data);
                        failedUpdate();
                    });
            }

            /**
             * Patches the delivery object to the server.
             * @param delivery
             */
            function patchDelivery(delivery) {
                if (!delivery) {
                    console.error("No delivery object.");
                }
                service.updateCounter++;
                delivery = convertDeliveryToServer(delivery);
                $http.patch($rootScope.baseUrl + DELIVERY_PATH + delivery.id + '/', delivery)
                    .then(function (response) {
                        console.log("Patched delivery");
                        successfulUpdate();
                    }, function (err) {
                        console.log("There was an error while updating the delivery method: " + err.data);
                        failedUpdate();
                    });
            }

            /**
             * Deletes the delivery object from the server.
             * @param delivery
             */
            function deleteDelivery(delivery) {
                if (!delivery) {
                    console.error("No delivery object.");
                }
                service.updateCounter++;
                $http.delete($rootScope.baseUrl + DELIVERY_PATH + delivery.id + '/')
                    .then(function (response) {
                        console.log("Deleted delivery");
                        successfulUpdate();
                    }, function (err) {
                        console.log("There was an error while deleting the delivery method: " + err.data);
                        failedUpdate();
                    });
            }

            function successfulUpdate() {
                service.updateCounter--;
                if (service.updateCounter <= 0) {
                    $rootScope.$broadcast(service.UPDATE_FINISHED, {success: true});
                }
            }

            function failedUpdate() {
                service.updateCounter = 0;
                $rootScope.$broadcast(service.UPDATE_FINISHED, {success: false});
            }

            /**
             * Updates the shipping method of a product, only after checking that such update is needed (if spotted
             * changes in the objects).
             * @param product - the product.
             * @param shippingMethods - the new shipping methods.
             * @param originalShippingMethods - the original shipping methods.
             */
            function updateShippingMethods(product, shippingMethods, originalShippingMethods) {

                service.updateCounter = 0;

                if (!product) {
                    console.error("No product object.");
                }

                if (product.dealers_delivery) {
                    if (shippingMethods.dealers.selected) {
                        if (!angular.equals(shippingMethods.dealers, originalShippingMethods.dealers)) {
                            patchDelivery(product.dealers_delivery);
                        }
                    } else {
                        deleteDelivery(product.dealers_delivery);
                    }
                } else {
                    if (shippingMethods.dealers) {
                        if (shippingMethods.dealers.selected) {
                            var d_delivery = {
                                delivery_method: service.DEALERS_METHOD,
                                title: shippingMethods.dealers.title,
                                estimated_delivery_time: shippingMethods.dealers.estimated_delivery_time,
                                shipping_price: shippingMethods.dealers.shipping_price,
                                description: shippingMethods.dealers.description,
                                dealers_dealdeliverys: [product.id]
                            };
                            postDelivery(d_delivery);
                        }
                    }
                }
                if (product.custom_delivery) {
                    if (shippingMethods.custom.selected) {
                        if (!angular.equals(shippingMethods.custom, originalShippingMethods.custom)) {
                            patchDelivery(product.custom_delivery);
                        }
                    } else {
                        deleteDelivery(product.custom_delivery);
                    }
                } else {
                    if (shippingMethods.custom) {
                        if (shippingMethods.custom.selected) {
                            var c_delivery = {
                                delivery_method: service.CUSTOM_METHOD,
                                title: shippingMethods.custom.title,
                                estimated_delivery_time: shippingMethods.custom.estimated_delivery_time,
                                shipping_price: shippingMethods.custom.shipping_price,
                                description: shippingMethods.custom.description,
                                custom_dealdeliverys: [product.id]
                            };
                            postDelivery(c_delivery);
                        }
                    }
                }
                if (product.pickup_delivery) {
                    if (shippingMethods.pickup.selected) {
                        if (!angular.equals(shippingMethods.pickup, originalShippingMethods.pickup)) {
                            patchDelivery(product.pickup_delivery);
                        }
                    } else {
                        deleteDelivery(product.pickup_delivery);
                    }
                } else {
                    if (shippingMethods.pickup) {
                        if (shippingMethods.pickup.selected) {
                            var p_delivery = service.DEFAULT_PICKUP_SHIIPPING;
                            p_delivery.delivery_method = service.PICKUP_METHOD;
                            p_delivery.description = shippingMethods.pickup.description;
                            p_delivery.pickup_dealdeliverys = [product.id];
                            postDelivery(p_delivery);
                        }
                    }
                }

                if (service.updateCounter == 0) {
                    // No changes were made, return to the main process.
                    successfulUpdate();
                }
            }

            /**
             * Validates the shipping methods.
             * @param shippingMethods
             * @returns {boolean} true if valid, else false.
             */
            function validateShippingMethods(shippingMethods) {
                var dealersShipping = shippingMethods.dealers;
                var customShipping = shippingMethods.custom;
                var pickup = shippingMethods.pickup;

                if (!dealersShipping) dealersShipping = {};
                if (!customShipping) customShipping = {};
                if (!pickup) pickup = {};

                if (dealersShipping.selected) {
                    if (!dealersShipping.title) {
                        Dialogs.showAlertDialog(Translations.shippingMethods.blankTitle, Translations.shippingMethods.blankTitleContent);
                        return false;
                    }
                    if (!(dealersShipping.shipping_price >= 0)) {
                        Dialogs.showAlertDialog(Translations.shippingMethods.invalidShippingPriceTitle, Translations.shippingMethods.invalidShippingPriceContent);
                        return false;
                    }
                    if (!(dealersShipping.estimated_delivery_time > 0)) {
                        Dialogs.showAlertDialog(Translations.shippingMethods.invalidETDTitle, Translations.shippingMethods.invalidETDContent);
                        return false;
                    }
                }
                if (customShipping.selected) {
                    if (!customShipping.title) {
                        Dialogs.showAlertDialog(Translations.shippingMethods.blankTitle, Translations.shippingMethods.blankTitleContent);
                        return false;
                    }
                    if (!(customShipping.shipping_price >= 0)) {
                        Dialogs.showAlertDialog(Translations.shippingMethods.invalidShippingPriceTitle, Translations.shippingMethods.invalidShippingPriceContent);
                        return false;
                    }
                    if (!(customShipping.estimated_delivery_time > 0)) {
                        Dialogs.showAlertDialog(Translations.shippingMethods.invalidETDTitle, Translations.shippingMethods.invalidETDContent);
                        return false;
                    }
                }
                if (!dealersShipping.selected && !customShipping.selected && !pickup.selected) {
                    Dialogs.showAlertDialog(Translations.shippingMethods.noShippingMethodsTitle, Translations.shippingMethods.noShippingMethodsContent);
                    return false;
                }

                return true;
            }
        }]);

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