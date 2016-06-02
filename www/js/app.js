// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var formvalidation = function(allvalidation) {
    var isvalid2 = true;
    for (var i = 0; i < allvalidation.length; i++) {
        // console.log(allvalidation);
        if (allvalidation[i].field == "" || !allvalidation[i].field || allvalidation[i].field == "Please select" || allvalidation[i].field == "Please Select") {
            allvalidation[i].validation = "ng-invalid ng-dirty";
            isvalid2 = false;
        }
    }
    return isvalid2;
}
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $rootScope) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        $rootScope.transparent_header = false;
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    $ionicConfigProvider.views.maxCache(0);
    $stateProvider

        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.home', {
            url: '/home',
            views: {
                'menuContent': {
                    templateUrl: 'templates/home.html',
                    controller: 'HomeCtrl'
                }
            }
        })
        .state('app.brands', {
            url: '/brands',
            views: {
                'menuContent': {
                    templateUrl: 'templates/brands.html',
                    controller: 'BrandsCtrl'
                }
            }
        })
        .state('app.product', {
            url: '/product/:parent/:category/:brand',
            views: {
                'menuContent': {
                    templateUrl: 'templates/product.html',
                    controller: 'ProductCtrl'
                }
            }
        })

    .state('app.productcategories', {
        url: '/productcategories',
        views: {
            'menuContent': {
                templateUrl: 'templates/productcategories.html',
                controller: 'ProductCategoriesCtrl'
            }
        }
    })

    .state('app.productdetail', {
            url: '/productdetail/:id',
            views: {
                'menuContent': {
                    templateUrl: 'templates/productdetail.html',
                    controller: 'ProductDetailCtrl'
                }
            }
        })
        .state('app.searchresult', {
            url: '/searchresult',
            views: {
                'menuContent': {
                    templateUrl: 'templates/searchresult.html',
                    controller: 'SearchresultCtrl'
                }
            }
        })

    .state('app.deals', {
            url: '/deals',
            views: {
                'menuContent': {
                    templateUrl: 'templates/deals.html',
                    controller: 'DealsCtrl'
                }
            }
        })
        .state('app.category', {
            url: '/category/:name/:id',
            views: {
                'menuContent': {
                    templateUrl: 'templates/category.html',
                    controller: 'CategoryCtrl'
                }
            }
        })
        .state('app.newarrivals', {
            url: '/newarrivals',
            views: {
                'menuContent': {
                    templateUrl: 'templates/newarrivals.html',
                    controller: 'NewArrivalsCtrl'
                }
            }
        })
        .state('app.distribution', {
            url: '/distribution',
            views: {
                'menuContent': {
                    templateUrl: 'templates/distribution.html',
                    controller: 'DistributionCtrl'
                }
            }
        })
        .state('app.about', {
            url: '/about',
            views: {
                'menuContent': {
                    templateUrl: 'templates/about.html',
                    controller: 'AboutCtrl'
                }
            }
        })
        .state('app.contactus', {
            url: '/contactus',
            views: {
                'menuContent': {
                    templateUrl: 'templates/contactus.html',
                    controller: 'ContactUsCtrl'
                }
            }
        })
        .state('app.cart', {
            url: '/cart',
            views: {
                'menuContent': {
                    templateUrl: 'templates/cart.html',
                    controller: 'CartCtrl'
                }
            }
        })
        .state('app.checkout', {
            url: '/checkout/:totalcart',
            views: {
                'menuContent': {
                    templateUrl: 'templates/checkout.html',
                    controller: 'CheckoutCtrl'
                }
            }
        })
        .state('app.myorders', {
            url: '/myorders',
            views: {
                'menuContent': {
                    templateUrl: 'templates/myorders.html',
                    controller: 'MyOrdersCtrl'
                }
            }
        })
        .state('app.mywishlist', {
            url: '/mywishlist',
            views: {
                'menuContent': {
                    templateUrl: 'templates/mywishlist.html',
                    controller: 'MyWishlistCtrl'
                }
            }
        })
        .state('app.myaccount', {
            url: '/myaccount',
            views: {
                'menuContent': {
                    templateUrl: 'templates/myaccount.html',
                    controller: 'MyAccountCtrl'
                }
            }
        })
        .state('app.editinfo', {
            url: '/editinfo',
            views: {
                'menuContent': {
                    templateUrl: 'templates/editinfo.html',
                    controller: 'EditInfoCtrl'
                }
            }
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
})

.filter('serverimage', function() {
    return function(image) {
        if (image && image != null) {
            return adminimage + image;
        } else {
            return "img/noimage.png";
        }
    };
})

.filter('localimage', function() {
    return function(image) {
        if (image && image != null) {
            switch (image) {
                case "Earphones & Headphones":
                    {
                        return "img/pcategory/3.png";
                        break;
                    }
                case "Speakers & Docks":
                    {
                        return "img/pcategory/5.png";
                        break;
                    }
                case "Gadgets":
                    {
                        return "img/pcategory/6.png";
                        break;
                    }
                case "Bags & Sleeves":
                    {
                        return "img/pcategory/2.png";
                        break;
                    }
                case "Accessories":
                    {
                        return "img/pcategory/4.png";
                        break;
                    }
                case "Cases & Protection":
                    {
                        return "img/pcategory/1.png";
                        break;
                    }
                default:
                    {
                        return "img/noimage.png";
                        break;
                    }
            }
        } else {
            return "img/noimage.png";
        }
    };
})

.filter('numberWithCommas', function() {
    return function(x) {
        if (x)
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        else
            return "";
    };
})

.directive('onlyDigits', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
})

.directive('youtube', function($sce) {
    return {
        restrict: 'A',
        scope: {
            code: '='
        },
        replace: true,
        template: '<iframe id="popup-youtube-player" style="overflow:hidden;width:100%" width="100%" height="225px" src="{{url}}" frameborder="0" allowscriptaccess="always" allowfullscreen="allowfullscreen" mozallowfullscreen="mozallowfullscreen" msallowfullscreen="msallowfullscreen" oallowfullscreen="oallowfullscreen" webkitallowfullscreen="webkitallowfullscreen"></iframe>',
        link: function(scope) {
            scope.$watch('code', function(newVal) {
                if (newVal) {
                    scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + newVal);
                }
            });
        }
    };
})

.directive('product', function() {
    return {
        restrict: 'E',
        scope: {
            data: '='
        },
        replace: true,
        templateUrl: 'templates/productsGrid.html',
        link: function(scope, element, attrs) {
            scope.$watch('data', function(singleProduct) {
                if (singleProduct) {
                    scope.item = singleProduct;
                }
            });
        }
    };
});
