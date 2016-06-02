var allfunction = {};
var myfunction = '';
angular.module('starter.controllers', ['ui.bootstrap', 'ui.slider', 'ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location, $ionicPopup, $rootScope, MyServices, $ionicLoading, $interval, $window, $templateCache, $state) {
    $rootScope.transparent_header = false;
    $scope.userSignup = {};
    $scope.loginData = {};
    $scope.forgot = {};
    $scope.searchbar = false;
    $scope.showlogin = true;

    if (MyServices.getuser()) {
        $scope.showlogin = false;
    }

    allfunction.msg = function(msg, title) {
        var myPopup = $ionicPopup.show({
            template: '<p class="text-center">' + msg + '!</p>',
            title: title,
            scope: $scope,
        });
        $timeout(function() {
            myPopup.close(); //close the popup after 3 seconds for some reason
        }, 2500);
    };
    allfunction.msgHome = function(msg, title) {
        var myPopup = $ionicPopup.show({
            template: '<p class="text-center">' + msg + '!</p>',
            title: title,
            scope: $scope,
        });
        $timeout(function() {
            myPopup.close(); //close the popup after 3 seconds for some reason
            $state.go('app.home');
        }, 2500);
    };
    allfunction.loading = function() {
        $ionicLoading.show({
            // template: '<ion-spinner class="spinner-positive">Give us a moment</ion-spinner>'
            template: '<div class="text-center">Give us a moment..</div>'
        });
        $timeout(function() {
            $ionicLoading.hide();
        }, 40000);
    };

    $scope.logout = function() {
        MyServices.logout(function(data) {
            console.log(data);
            if (data == 'true') {
                $.jStorage.flush();
                $scope.showlogin = true;
            }
        })
    }

    $scope.user = {
        cart: 1
    };
    myfunction = function() {
        MyServices.gettotalcart(function(data) {
            console.log("totalcart = " + data);
            $scope.user.cart = data;
        });
        MyServices.totalcart(function(data) {
            console.log("totalamount = " + data);
            $scope.amount = data;
        });
    }
    myfunction();

    $scope.search = function() {
        $scope.searchbar = $scope.searchbar === true ? false : true;
    };
    $scope.cartCheck = function() {
        console.log($scope.user.cart);
        if ($scope.user.cart == 0)
            $scope.showAlert();
        else
            $location.path('/app/cart');
    };
    $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Cart',
            template: 'There is nothing here. Keep shopping!'
        });
        alertPopup.then(function(res) {
            console.log('Thank you for not eating my delicious ice cream cone');
        });
    };
    //    -------------------LOGIN MODAL---------------------
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.closeLogin = function() {
        $scope.loginData = {};
        $scope.modal.hide();
    };
    $scope.login = function() {
        $scope.modal.show();
        $scope.closeSignup();
    };

    function authenticateUser() {
        MyServices.authenticate(function(data) {
            console.log(data);
            if (data != 'false') {
                $ionicLoading.hide();
                MyServices.setuser(data);
                $scope.closeLogin();
                $window.location.reload();
                //                 $templateCache.removeAll();
                // $location.url("/home");
            }
        })
    }

    $scope.doLogin = function() {
        $scope.allvalidation = [{
            field: $scope.loginData.email,
            validation: ""
        }, {
            field: $scope.loginData.password,
            validation: ""
        }];
        var check = formvalidation($scope.allvalidation);
        if (check) {
            console.log($scope.loginData);
            allfunction.loading();
            MyServices.login($scope.loginData, function(data) {
                console.log(data);
                if (data != "false") {
                    authenticateUser();
                } else {
                    $ionicLoading.hide();
                    allfunction.msg("Email & Password Did Not Match", 'Error!');
                }
            });
        } else {
            allfunction.msg("Fill all mandatory fields", "Error !");
        }
    };

    var ref = '';
    var stopinterval = '';
    var checktwitter = function(data, status) {
        console.log(data);
        if (data != "false") {
            $interval.cancel(stopinterval);
            ref.close();
            authenticateUser();
        }
    };

    var callAtIntervaltwitter = function() {
        MyServices.authenticate(checktwitter);
    };

    $scope.facebooklogin = function() {
        ref = window.open(adminhauth + 'login/Facebook?returnurl=http://www.wohlig.com', '_blank', 'location=no');
        stopinterval = $interval(callAtIntervaltwitter, 2000);
        ref.addEventListener('exit', function(event) {
            authenticateUser();
            $interval.cancel(stopinterval);
        });
    }
    $scope.googlelogin = function() {
        ref = window.open(adminhauth + 'login/Google?returnurl=http://www.wohlig.com', '_blank', 'location=no');
        stopinterval = $interval(callAtIntervaltwitter, 2000);
        ref.addEventListener('exit', function(event) {
            authenticateUser();
            $interval.cancel(stopinterval);
        });
    }

    $scope.openSignup = function() {
        //        $scope.closeLogin();
        $scope.signup();
    };
    //    -------------------END- LOGIN MODAL----------------------

    //    --------------------SIGNUP MODAL-------------------------
    $ionicModal.fromTemplateUrl('templates/signup.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modalSignup = modal;
    });
    $scope.closeSignup = function() {
        $scope.userSignup = {};
        $scope.modalSignup.hide();
    };
    $scope.signup = function() {
        $scope.modalSignup.show();
        $scope.closeLogin();
    };
    $scope.doSignup = function() {
        $scope.allvalidation = [{
            field: $scope.userSignup.firstname,
            validation: ""
        }, {
            field: $scope.userSignup.lastname,
            validation: ""
        }, {
            field: $scope.userSignup.email,
            validation: ""
        }, {
            field: $scope.userSignup.password,
            validation: ""
        }, {
            field: $scope.userSignup.confirmpassword,
            validation: ""
        }];
        var check = formvalidation($scope.allvalidation);
        if (check) {
            if ($scope.userSignup.password === $scope.userSignup.confirmpassword) {
                console.log($scope.userSignup);
                allfunction.loading();
                MyServices.registerUser($scope.userSignup, function(data) {
                    if (data != "false") {
                        console.log(data);
                        $ionicLoading.hide();
                        MyServices.setuser(data);
                        $scope.closeSignup();
                        $location.path("/app/home");
                    } else {
                        console.log(data);
                        $ionicLoading.hide();
                        allfunction.msg("This Email Id is already registered with us or Error In Registration", 'Error!');
                    }
                });
            } else {
                allfunction.msg('Password did not match, Please re-enter password', 'Password Mis-match');
            }
        } else {
            allfunction.msg("Fill all mandatory fields", "Error !");
        }
    };
    //    -----------------END- SIGNUP MODAL-------------------------
    //   ---------------------FORGOT PASSWORD
    $ionicModal.fromTemplateUrl('templates/forgotpassword.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modalFrgt = modal;
    });
    $scope.closeFrgt = function() {
        $scope.modalFrgt.hide();
    };
    $scope.frgt = function() {
        $scope.modalFrgt.show();
    };
    $scope.doFrgt = function(emailforgot) {
        $scope.forgot = emailforgot;
        $scope.allvalidation = [{
            field: $scope.forgot.email,
            validation: ""
        }];
        var check = formvalidation($scope.allvalidation);
        if (check) {
            allfunction.loading();
            MyServices.forgotPassword($scope.forgot, function(data) {
                console.log(data);
                if (data != "Not A Valid Email.") {
                    $ionicLoading.hide();
                    $scope.closeFrgt();
                    $location.path("/app/home");
                } else {
                    $ionicLoading.hide();
                    allfunction.msg("Email Id Not Found", 'Error!');
                }
            });
        } else {
            allfunction.msg("Fill all mandatory fields", "Error !");
        }
    };
    $scope.openFrgt = function() {
        $scope.frgt();
        $scope.closeLogin();
    };
    //    --------------------END- FORGOT PASSWORD
    //   ---------------------FILTERS
    // $ionicModal.fromTemplateUrl('templates/filters.html', {
    //     scope: $scope
    // }).then(function(modal) {
    //     $scope.modalFilter = modal;
    // });
    // $scope.closeFilter = function() {
    //     $scope.modalFilter.hide();
    // };
    // $scope.filter = function() {
    //     $scope.modalFilter.show();
    // };
    $scope.doFilter = function() {
        console.log('Doing Signup', $scope.loginData);
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
    // $scope.openFilter = function() {
    //     //        $scope.closeLogin();
    //     $scope.filter();
    // };
    //    --------------------END- FILTERS
})


.controller('HomeCtrl', function($scope, MyServices, $ionicLoading, $location, $ionicSlideBoxDelegate) {
    //    $templateCache.removeAll();
    $.jStorage.set("filters", null);
    MyServices.getHomeSlider(function(data) {
        if (data) {
            $scope.slides = data;
            console.log(data);
            $ionicSlideBoxDelegate.update();
        }
    });

    $scope.homeProducts = [];
    MyServices.getHomeProducts(function(data) {
        if (data) {
            console.log(data);
            _.each(data, function(n) {
                if (n.firstsaleprice) {
                    if (n.specialpricefrom == "0000-00-00" && n.specialpriceto == "0000-00-00") {
                        n.showSalePrice = true;
                        console.log("in if");
                    } else if (n.specialpricefrom != "0000-00-00" && n.specialpriceto != "0000-00-00") {
                        var birth = new Date(n.specialpricefrom);
                        var death = new Date(n.specialpriceto);
                        var curr = new Date();
                        var diff = curr.getTime() - birth.getTime();
                        var diff2 = curr.getTime() - death.getTime();
                        var start = Math.floor(diff / (1000 * 60 * 60 * 24));
                        var end = Math.floor(diff2 / (1000 * 60 * 60 * 24));
                        if (start >= 0 && end <= 0) {
                            n.showSalePrice = true;
                        }
                        console.log("in 1 else if");
                    } else if (n.specialpricefrom != "0000-00-00") {
                        var birth = new Date(n.specialpricefrom);
                        var curr = new Date();
                        var diff = curr.getTime() - birth.getTime();
                        var start = Math.floor(diff / (1000 * 60 * 60 * 24));
                        if (start >= 0) {
                            n.showSalePrice = true;
                        }
                        console.log("in 2 else if");
                    } else if (n.specialpricefrom == "0000-00-00") {
                        n.showSalePrice = true;
                        console.log("in 3 else if");
                    }
                    console.log("Show Sale Price = " + n.showSalePrice);
                }
                $scope.homeProducts.push(n);
            });
        }
    });

    $scope.goToProduct = function(id) {
        console.log(id);
        $location.url("/app/productdetail/" + id);
    }

    $scope.usersubscribtion = function(email) {
        if (email) {
            MyServices.getsubscribe(email, function(data) {
                console.log(data);
                if (data == "true") {
                    allfunction.msg("Thank you for your subscribtion ", "Thank You");
                    // $scope.msg = "Thank you for your subscribtion . ";
                } else {
                    // $scope.msg = "Already subscribed";
                    allfunction.msg("You have already subscribed ", "Thank You");
                }
            });
        } else {
            allfunction.msg("Please provide your email id ", "Error !");
        }
    }

})

.controller('DealsCtrl', function($scope, $stateParams, MyServices, $ionicLoading, $ionicSlideBoxDelegate) {
    $.jStorage.set("filters", null);
    allfunction.loading();
    $scope.dealsimg = [];
    $scope.offers = [];
    $scope.slider = [];

    $scope.sliderclick = function(id) {
        MyServices.getofferproducts(id.id, function(data) {
            console.log(data);
            $scope.deals = [];
            $scope.deals[0] = data.offerdetails;
            $scope.deals[0].offerproducts = data.offerproducts;
            console.log($scope.deals);

        })
    }

    MyServices.getofferdetails(function(data, status) {
        console.log(data);
        if (data && data.offer && data.offer.length > 0) {
            $scope.offers = data.offer[0];
            _.each(data.offer[0], function(n) {
                $scope.slider.push(n.image);
            })
        }
        $ionicLoading.hide();
        $ionicSlideBoxDelegate.update();
    });

})

.controller('NewArrivalsCtrl', function($scope, $stateParams, MyServices, $ionicLoading) {
    $.jStorage.set("filters", null);
    allfunction.loading();
    $scope.pageno = 0;
    $scope.products = [];
    $scope.shownodata = false;
    $scope.keepscrolling = true;

    $scope.addMoreItems = function() {
        ++$scope.pageno;
        MyServices.getexclusiveandnewarrival($scope.pageno, 2, function(data, status) {
            if (data.queryresult.length == 0) {
                $scope.keepscrolling = false;
            }
            _.each(data.queryresult, function(n) {
                if (n.isfavid) {
                    n.fav = "fav";
                }
                if (n.firstsaleprice) {
                    if (n.specialpricefrom == "0000-00-00" && n.specialpriceto == "0000-00-00") {
                        n.showSalePrice = true;
                    } else if (n.specialpricefrom != "0000-00-00" && n.specialpriceto != "0000-00-00") {
                        var birth = new Date(n.specialpricefrom);
                        var death = new Date(n.specialpriceto);
                        var curr = new Date();
                        var diff = curr.getTime() - birth.getTime();
                        var diff2 = curr.getTime() - death.getTime();
                        var start = Math.floor(diff / (1000 * 60 * 60 * 24));
                        var end = Math.floor(diff2 / (1000 * 60 * 60 * 24));
                        if (start >= 0 && end <= 0) {
                            n.showSalePrice = true;
                        }
                    } else if (n.specialpricefrom != "0000-00-00") {
                        var birth = new Date(n.specialpricefrom);
                        var curr = new Date();
                        var diff = curr.getTime() - birth.getTime();
                        var start = Math.floor(diff / (1000 * 60 * 60 * 24));
                        if (start >= 0) {
                            n.showSalePrice = true;
                        }
                    } else if (n.specialpricefrom == "0000-00-00") {
                        n.showSalePrice = true;
                    }
                    if (n.showSalePrice == true) {
                        n.discountinper = Math.floor((1 - (parseFloat(n.firstsaleprice) / parseFloat(n.price))) * 100);
                    }
                }
                $scope.products.push(n);
            });
            console.log($scope.products);
            if ($scope.products.length == 0) {
                $scope.shownodata = true;
            } else {
                $scope.shownodata = false;
            }
            $ionicLoading.hide();
        });
    }
    $scope.addMoreItems();
})

.controller('MyAccountCtrl', function($scope, $stateParams) {})

.controller('EditInfoCtrl', function($scope, $ionicScrollDelegate, $stateParams, MyServices, $ionicLoading) {
    $.jStorage.set("filters", null);
    $scope.userdetails = {};
    $scope.userdetails = $.jStorage.get("user");
    console.log($scope.userdetails);
    $scope.edit_save = "Edit information";
    $scope.disabled = true;
    $scope.saved = false;
    $scope.editSave = function(userdetails) {

        $scope.allvalidation = [{
            field: $scope.userdetails.firstname,
            validation: ""
        }, {
            field: $scope.userdetails.lastname,
            validation: ""
        }, {
            field: $scope.userdetails.billingaddress,
            validation: ""
        }, {
            field: $scope.userdetails.billingcity,
            validation: ""
        }, {
            field: $scope.userdetails.billingstate,
            validation: ""
        }, {
            field: $scope.userdetails.billingcountry,
            validation: ""
        }, {
            field: $scope.userdetails.billingpincode,
            validation: ""
        }, {
            field: $scope.userdetails.email,
            validation: ""
        }, {
            field: $scope.userdetails.phone,
            validation: ""
        }];
        var check = formvalidation($scope.allvalidation);
        console.log(check);
        if (check) {
            console.log($scope.userdetails);
            allfunction.loading();
            MyServices.updateuser($scope.userdetails, function(data) {
                console.log(data);
                if (data != "false") {
                    $ionicLoading.hide();
                    // MyServices.setuser(data);
                    allfunction.msg("Successfully Edited", 'Thankyou!');
                } else {
                    $ionicLoading.hide();
                    allfunction.msg("Sorry Try Again", 'Sorry!');
                }
            });
        } else {
            allfunction.msg("Fill all mandatory fields", "Error !");
        }
        //            if ($scope.edit_save === "Edit information") {
        //                $scope.edit_save = "Save";
        //                $scope.disabled = false;
        //
        //            } else {
        //                $scope.edit_save = "Edit information";
        //                //                SAVE OPERATIONS
        //                $scope.disabled = true;
        //                $scope.saved = true;
        //                $ionicScrollDelegate.scrollTop();
        //            }
    }
})

.controller('ContactUsCtrl', function($scope, $stateParams, MyServices, $ionicLoading) {
    $.jStorage.set("filters", null);
    $scope.contactus = {};
    $scope.usercontact = function() {
        $scope.allvalidation = [{
            field: $scope.contactus.name,
            validation: ""
        }, {
            field: $scope.contactus.email,
            validation: ""
        }, {
            field: $scope.contactus.comment,
            validation: ""
        }];
        var check = formvalidation($scope.allvalidation);
        console.log(check);
        console.log($scope.contactus);
        if (check) {
            console.log($scope.contactus);
            allfunction.loading();
            MyServices.usercontact($scope.contactus, function(data) {
                console.log(data);
                if (data != "") {
                    $ionicLoading.hide();
                    $scope.contactus = {};
                    allfunction.msg("Query Sumbitted Successfully ", 'Thankyou!');

                } else {
                    $ionicLoading.hide();
                    allfunction.msg("Sorry Try Again", 'Sorry!');
                }
            });
        } else {
            allfunction.msg("Fill all mandatory fields", "Error !");
        }

    }

})

.controller('ProductCategoriesCtrl', function($scope, $stateParams, $location, MyServices, $ionicLoading) {
    $.jStorage.set("filters", null);
    allfunction.loading();
    MyServices.getallcategories(function(data) {
        console.log(data);
        $scope.cats = _.chunk(data, 2);
        $ionicLoading.hide();
    });

    $scope.oneAtATime = true;
    $scope.category = [{
        title: "Cover & Cases",
        parent: 1,
        category: 0,
        submenu: [{
            name: "Apple",
            parent: 2,
            category: 0
        }]
    }, {
        title: "Earphones & Headphones",
        parent: 3,
        category: 0,
        submenu: [

            {
                name: "Wireless Headphones",
                parent: 4,
                category: 0
            }
        ]
    }, {
        title: "Speakers & Docks",
        parent: 5,
        category: 0,
        submenu: [

            {
                name: "Bluetooth",
                parent: 6,
                category: 0
            }
        ]
    }];

    // $scope.cats = [{
    //     image: "img/pcategory/1.png",
    //     name: "Cases & Protection"


    // }, {
    //     image: "img/pcategory/2.png",
    //     name: "Bags & Sleeves"

    // }, {
    //     image: "img/pcategory/3.png",
    //     name: "Earphones & Headphones"

    // }, {
    //     image: "img/pcategory/4.png",
    //     name: "Accessories"

    // }, {
    //     image: "img/pcategory/5.png",
    //     name: "Speakers & Docks"

    // }, {
    //     image: "img/pcategory/6.png",
    //     name: "Gadgets"

    // }];
    // $scope.cats = _.chunk($scope.cats, 3);

    $scope.getproductbycategory = function(parent, category) {
        $location.url("/app/product/" + parent + "/" + category + "/0");
    }

})

.controller('CartCtrl', function($scope, $stateParams, $location, $ionicHistory, MyServices, $ionicLoading) {
    $.jStorage.set("filters", null);
    $scope.goHome = function() {
        console.log($ionicHistory.viewHistory());
        $location.path('app/home');
    };

    $scope.gotocheckout = function(totalcart) {
        $location.url('app/checkout/' + totalcart);
    }

    $scope.gettotalcartfunction = function() {
        MyServices.totalcart(function(data) {
            if ($scope.userdetail.credits) {
                $scope.totalcart = data - $scope.userdetail.credits;
                if ($scope.totalcart <= 0) {
                    $scope.totalcart = 0
                }
            } else {
                $scope.totalcart = data;
            }
        });
    }

    MyServices.getuserdetails(function(data) {
        console.log(data);
        $scope.userdetail = data;
        $scope.gettotalcartfunction();
    });

    //check coupons
    $scope.discountamount = 0;

    function calcdiscountamount() {
        var data = MyServices.getcoupondetails();
        var subtotal = parseFloat($scope.totalcart);
        console.log(data);
        if (data.coupontype == '1') {
            if (data.discountpercent != '0') {
                console.log("ABC");
                $scope.ispercent = parseFloat(data.discountpercent);
                $scope.discountamount = (subtotal * $scope.ispercent / 100);
            } else {
                $scope.isamount = parseFloat(data.discountamount);
                console.log("ABCD");
                $scope.discountamount = $scope.isamount;
            }
        }
        if (data.coupontype == '2') {
            console.log($scope.cart);

            var totallength = 0;
            _.each($scope.cart, function(cart) {
                totallength += parseInt(cart.qty);
            });
            var xproducts = parseInt(data.xproducts);
            var yproducts = parseInt(data.yproducts);
            var itter = Math.floor(totallength / xproducts) * yproducts;
            console.log("ITTER " + itter);
            var newcart = _.sortBy($scope.cart, function(cart) {
                cart.price = parseFloat(cart.price);
                cart.qty2 = parseInt(cart.qty);
                return parseFloat(cart.price);
            });
            //newcart=_.each(newcart, function(cart){  cart.price=parseFloat(cart.price);cart.qty=parseFloat(cart.qty); });
            console.log(newcart);
            $scope.discountamount = 0;
            for (var i = 0; i < itter; i++) {
                if (newcart[i].qty2 != 0) {
                    newcart[i].qty2--;
                    $scope.discountamount += newcart[i].price;
                }

            }
        }
        if (data.coupontype == '4') {
            console.log("FREE DELIVERY APPLIED");
            $scope.isfreedelivery = "Free Delivery";
            $scope.discountamount = 0;
        }
        $.jStorage.set("discountamount", $scope.discountamount);
    };

    $scope.tocheckout = function(totalcarts) {
        console.log("cart");
        allfunction.loading();
        MyServices.checkoutCheck(function(data) {
            $ionicLoading.hide();
            if (data.value == true) {
                $.jStorage.set("discountamount", $scope.discountamount);
                if ($.jStorage.get('coupon')) {
                    $.jStorage.set('coupon', _.merge($.jStorage.get('coupon'), {
                        'totalcart': $scope.totalcart - $scope.discountamount
                    }));
                } else {
                    $.jStorage.set('coupon', {
                        'totalcart': $scope.totalcart - $scope.discountamount
                    });
                }
                $location.url('app/checkout/' + totalcarts);
            } else {
                allfunction.msg("Some product has more than quantity available ", "Error !");
            }
        })
    }

    var coupondetails = {};
    $scope.ispercent = 0;
    $scope.isamount = 0;
    $scope.isfreedelivery = 0;
    $scope.discountamount = 0;
    var couponsuccess = function(data, status) {
        console.log(data);
        if (data == 'false') {
            $scope.validcouponcode = 0;
            allfunction.msg("Coupon code is not valid ", "Invalid Coupon Code");
        } else {
            console.log("Show it");
            $scope.validcouponcode = 1;
            MyServices.setcoupondetails(data);
            calcdiscountamount();
        }
    }

    $scope.checkcoupon = function(couponcode) {
        console.log(couponcode);
        MyServices.getdiscountcoupon(couponcode).success(couponsuccess);
    };

    //discrount coupons

    // add and subtract from cart
    var cartt = function(data, status) {
        console.log(data);
        $scope.gettotalcartfunction();
        $scope.getcartfunction();
        myfunction();
        $ionicLoading.hide();
    };

    $scope.changeqty = function(mycart, option) {
        if (option == '+') {
            if (mycart.qty < mycart.maxQuantity) {
                allfunction.loading();
                if (option == '+') {
                    ++mycart.qty;
                } else {
                    if (mycart.qty > 1)
                        --mycart.qty;
                }
                var selectedproduct = {};
                selectedproduct.product = mycart.id;
                selectedproduct.productname = mycart.options.realname;
                selectedproduct.price = mycart.price;
                selectedproduct.quantity = mycart.qty;
                MyServices.addtocart(selectedproduct, cartt);
            } else {
                allfunction.msg("Only " + mycart.maxQuantity + " quantity is available ", "Quantity Exceeds");
            }
        } else if (option == '-') {
            if (mycart.qty > 1) {
                allfunction.loading();
                if (option == '+') {
                    ++mycart.qty;
                } else {
                    if (mycart.qty > 1)
                        --mycart.qty;
                }
                var selectedproduct = {};
                selectedproduct.product = mycart.id;
                selectedproduct.productname = mycart.options.realname;
                selectedproduct.price = mycart.price;
                selectedproduct.quantity = mycart.qty;
                MyServices.addtocart(selectedproduct, cartt);
            } else {
                allfunction.msg("Cannot decrease quantity ", "Error !");
            }
        }
    };

    //add and subtract from cart

    $scope.getcartfunction = function() {
        allfunction.loading();
        MyServices.getcart(function(data) {
            console.log(data);
            $ionicLoading.hide();
            $scope.cart = data;
            if (data == '' || data.length == 0) {
                $scope.nodatafound = true;
                $scope.nodata = "Nothing to Show, Folks!.";
            } else {
                $scope.nodatafound = false;
            }
        });
    }

    $scope.getcartfunction();

    //delete cart
    $scope.deletecart = function(cart) {
        allfunction.loading();
        console.log(cart);
        MyServices.deletecart(cart.id, function(data) {
            console.log(data);
            $scope.getcartfunction();
            $scope.gettotalcartfunction();
            myfunction();
            $ionicLoading.hide();
        });
    }

})

.controller('CheckoutCtrl', function($scope, $stateParams, MyServices, $ionicLoading, $location, $interval, $cordovaInAppBrowser) {
    $.jStorage.set("filters", null);
    $scope.chklogin = $.jStorage.get("user");
    $scope.showlogreg = true;
    $scope.paymentinfo = false;

    if ($.jStorage.get("user")) {
        $scope.showlogreg = false;
        $scope.openbilling = true;
        $scope.showOrderReview = true;
    } else {
        $scope.showlogreg = true;
        $scope.openbilling = false;
        $scope.showOrderReview = false;
    }
    $scope.different_address = false;
    $scope.address_select = "Ship to different address";
    $scope.toggleAddress = function() {
        if ($scope.different_address === false) {
            $scope.different_address = true;
            $scope.address_select = "Ship to same address";
        } else {
            $scope.different_address = false;
            $scope.address_select = "Ship to different address";
        }
    };

    $scope.totalcart = $stateParams.totalcart;
    console.log("totalcart");
    console.log($scope.totalcart);
    $scope.continue = function(ch) {
        if (!$.jStorage.get("user")) {
            if (ch === 'login') {
                $scope.openbilling = false;
                $scope.login();
                $scope.showOrderReview = true;
            } else if (ch === 'guest') {
                $scope.openbilling = true;
                $scope.showOrderReview = true;
            } else {
                allfunction.msg("Please select checkout type ", "Please Select")
            }
        } else {
            $scope.openbilling = true;
        }
    };

    // form integrate pooja
    $scope.checkout = {};
    if ($.jStorage.get("user")) {
        MyServices.getuserdetails(function(data) {
            console.log(data);
            $scope.checkout.userid = data.id;
            $scope.checkout.firstname = data.firstname;
            $scope.checkout.lastname = data.lastname;
            $scope.checkout.email = data.email;
            $scope.checkout.billingaddress = data.billingaddress;
            $scope.checkout.billingcity = data.billingcity;
            $scope.checkout.billingstate = data.billingstate;
            $scope.checkout.billingpincode = data.billingpincode;
            $scope.checkout.billingcountry = data.billingcountry;
            $scope.checkout.billingcontact = data.phone;
        });
    }
    // MyServices.getcart(function(data) {
    //     $scope.cart = data;
    //     $scope.checkout.cart = $scope.cart;
    //     $scope.checkout.finalamount = $scope.totalcart;
    //     console.log($scope.cart);
    // });

    //order products
    MyServices.totalcart(function(data) {
        $scope.totalcart = data;
        $scope.allamount = data;
        if ($.jStorage.get('coupon').couponcode && $.jStorage.get('coupon').couponcode != null) {
            $scope.couponhave = $.jStorage.get('coupon').couponcode;
        } else {
            $scope.couponhave = 0;
        }
        $scope.allamount = $.jStorage.get('coupon').totalcart;
        if ($.jStorage.get("discountamount")) {
            $scope.discount = $.jStorage.get("discountamount");
            // if ($scope.discount>$scope.totalcart) {
            //   $scope.totalcart = 0;
            // }
        }
    });

    $scope.paymentOption = function() {
        $scope.allvalidation = [];
        if ($scope.different_address == false) {
            $scope.allvalidation = [{
                field: $scope.checkout.firstname,
                validation: ""
            }, {
                field: $scope.checkout.lastname,
                validation: ""
            }, {
                field: $scope.checkout.email,
                validation: ""
            }, {
                field: $scope.checkout.billingaddress,
                validation: ""
            }, {
                field: $scope.checkout.billingcity,
                validation: ""
            }, {
                field: $scope.checkout.billingstate,
                validation: ""
            }, {
                field: $scope.checkout.billingpincode,
                validation: ""
            }, {
                field: $scope.checkout.billingcountry,
                validation: ""
            }, {
                field: $scope.checkout.billingcontact,
                validation: ""
            }];
            $scope.checkout.shippingname = $scope.checkout.firstname + " " + $scope.checkout.lastname;
            $scope.checkout.shippingaddress = $scope.checkout.billingaddress;
            $scope.checkout.shippingcity = $scope.checkout.billingcity;
            $scope.checkout.shippingstate = $scope.checkout.billingstate;
            $scope.checkout.shippingpincode = $scope.checkout.billingpincode;
            $scope.checkout.shippingcountry = $scope.checkout.billingcountry;
            $scope.checkout.shippingcontact = $scope.checkout.billingcontact;
        } else if ($scope.different_address == true) {
            $scope.allvalidation = [{
                field: $scope.checkout.firstname,
                validation: ""
            }, {
                field: $scope.checkout.lastname,
                validation: ""
            }, {
                field: $scope.checkout.email,
                validation: ""
            }, {
                field: $scope.checkout.billingaddress,
                validation: ""
            }, {
                field: $scope.checkout.billingcity,
                validation: ""
            }, {
                field: $scope.checkout.billingstate,
                validation: ""
            }, {
                field: $scope.checkout.billingpincode,
                validation: ""
            }, {
                field: $scope.checkout.billingcountry,
                validation: ""
            }, {
                field: $scope.checkout.billingcontact,
                validation: ""
            }, {
                field: $scope.checkout.shippingname,
                validation: ""
            }, {
                field: $scope.checkout.shippingaddress,
                validation: ""
            }, {
                field: $scope.checkout.shippingcity,
                validation: ""
            }, {
                field: $scope.checkout.shippingstate,
                validation: ""
            }, {
                field: $scope.checkout.shippingpincode,
                validation: ""
            }, {
                field: $scope.checkout.shippingcountry,
                validation: ""
            }, {
                field: $scope.checkout.shippingcontact,
                validation: ""
            }];
        }
        var check = formvalidation($scope.allvalidation);
        console.log(check);
        if (check) {
            console.log($scope.checkout);
            allfunction.loading();
            MyServices.placeorder($scope.checkout, function(data) {
                console.log(data);
                $ionicLoading.hide();
                if (data != 'false') {
                    $scope.checkout.orderid = data;
                    // allfunction.msg("Your Order has been placed", 'Thankyou!');
                    $scope.paymentinfo = true;
                    // $location.url("/app/home/");

                    var options = {
                        location: 'no',
                        clearcache: 'yes',
                        toolbar: 'no'
                    };

                    var ref = $cordovaInAppBrowser.open("http://accessinfoworld.com/admin/paymentgateway/ccavRequestHandlerGet.php?tid=&order_id=" + $scope.checkout.orderid + "&merchant_id=76752&amount=" + $scope.allamount + "&billing_name=" + $scope.checkout.firstname + "&currency=INR&merchant_param1=" + $scope.couponhave + "&redirect_url=http://accessinfoworld.com/admin/index.php/json/payumoneysuccess&cancel_url=http://accessinfoworld.com/admin/index.php/json/payumoneysuccess&language=EN&billing_address=" + $scope.checkout.billingaddress + "&billing_country=" + $scope.checkout.billingcountry + "&billing_state=" + $scope.checkout.billingstate + "&billing_city=" + $scope.checkout.billingcity + "&billing_zip=" + $scope.checkout.billingpincode + "&billing_tel=" + $scope.checkout.billingcontact + "&billing_email=" + $scope.checkout.email + "&delivery_name=" + $scope.checkout.shippingname + "&delivery_address=" + $scope.checkout.shippingaddress + "&delivery_country=" + $scope.checkout.shippingcountry + "&delivery_city=" + $scope.checkout.shippingcity + "&delivery_state=" + $scope.checkout.shippingstate + "&delivery_zip=" + $scope.checkout.shippingpincode + "&delivery_tel=" + $scope.checkout.shippingcontact + "&integration_type=iframe_normal", '_blank', options)
                        .then(function(event) {
                            // success
                        })
                        .catch(function(event) {
                            // error
                        });

                    // var ref = window.open("http://accessinfoworld.com/admin/paymentgateway/ccavRequestHandlerGet.php?tid=&order_id=" + $scope.checkout.orderid + "&merchant_id=76752&amount=" + $scope.allamount + "&billing_name=" + $scope.checkout.firstname + "&currency=INR&merchant_param1=" + $scope.couponhave + "&redirect_url=http://accessinfoworld.com/admin/index.php/json/payumoneysuccess&cancel_url=http://accessinfoworld.com/admin/index.php/json/payumoneysuccess&language=EN&billing_address=" + $scope.checkout.billingaddress + "&billing_country=" + $scope.checkout.billingcountry + "&billing_state=" + $scope.checkout.billingstate + "&billing_city=" + $scope.checkout.billingcity + "&billing_zip=" + $scope.checkout.billingpincode + "&billing_tel=" + $scope.checkout.billingcontact + "&billing_email=" + $scope.checkout.email + "&delivery_name=" + $scope.checkout.shippingname + "&delivery_address=" + $scope.checkout.shippingaddress + "&delivery_country=" + $scope.checkout.shippingcountry + "&delivery_city=" + $scope.checkout.shippingcity + "&delivery_state=" + $scope.checkout.shippingstate + "&delivery_zip=" + $scope.checkout.shippingpincode + "&delivery_tel=" + $scope.checkout.shippingcontact + "&integration_type=iframe_normal");

                    var interval = $interval(function() {
                        MyServices.getorderbyorderid(data, function(orderData) {
                            console.log(orderData);
                            if (orderData.orderstatus == 5 || orderData.orderstatus == "5") {
                                $cordovaInAppBrowser.close();
                                $interval.cancel(interval);
                                allfunction.msgHome("Payment Failed", 'Sorry!');
                            } else if (orderData.orderstatus == 2 || orderData.orderstatus == "2") {
                                $cordovaInAppBrowser.close();
                                $interval.cancel(interval);
                                allfunction.msgHome("Thank you for shopping", 'Payment Successfull');
                            }
                        })
                    }, 2000);
                } else {
                    allfunction.msg("Sorry Try Again", 'Sorry!');
                }
            });
        } else {
            allfunction.msg("Fill all mandatory fields", "Error !");
        }
    }
})

.controller('MyOrdersCtrl', function($scope, $stateParams, $location, $ionicHistory, MyServices, $ionicLoading) {
    $.jStorage.set("filters", null);
    MyServices.orderhistory(function(data) {
        console.log(data);

        $scope.orderhistory = data;
        _.each($scope.orderhistory, function(n) {
            n.timestamp = new Date();
        });

        if (data == "") {} else {

        }
    });

})

.controller('CategoryCtrl', function($scope, $stateParams, $location, $ionicHistory, MyServices, $ionicLoading) {
    $.jStorage.set("filters", null);
    allfunction.loading();
    $scope.parent = $stateParams.id;
    $scope.categoryName = $stateParams.name;
    MyServices.getsinglecategory($stateParams.id, function(data) {
        $scope.subcategories = data;
        console.log(data);
        $ionicLoading.hide();
    })

})

.controller('MyWishlistCtrl', function($scope, $stateParams, $location, $ionicHistory, MyServices, $ionicLoading) {
    $.jStorage.set("filters", null);
    allfunction.loading();

    $scope.showLoginToContinue = false;
    $scope.shownodata = false;

    $scope.getproductdetails = function(productid) {
        console.log(productid);
        $location.url("/app/productdetail/" + productid);
    }

    var getwishlistproductcallback = function(data, status) {
        $scope.products = data.queryresult;
        if (data.queryresult.length == 0) {
            $scope.shownodata = true;
        }
        $ionicLoading.hide();
    }
    if (MyServices.getuser()) {
        MyServices.getwishlistproduct(getwishlistproductcallback);
    } else {
        $scope.showLoginToContinue = true;
        $ionicLoading.hide();
    }

    // DELETE PRODUCT FROM WISHLIST
    $scope.removefromwishlist = function(productid) {
        allfunction.loading();
        console.log(productid);
        MyServices.removefromwishlist(productid, function(data, status) {
            console.log(data);
            if (data == 1) {
                MyServices.getwishlistproduct(getwishlistproductcallback);
            }
        });
    }

})

.controller('DistributionCtrl', function($scope, $stateParams, MyServices, $ionicLoading, $location) {
    $.jStorage.set("filters", null);
    allfunction.loading();

    $scope.pageno = 0;
    $scope.keepscrolling = true;
    $scope.shownodata = false;
    $scope.brandimages = [];

    $scope.addMoreItems = function() {
        ++$scope.pageno;
        MyServices.getbrand($scope.pageno, function(data, status) {
            if (data.queryresult.length == 0) {
                $scope.keepscrolling = false;
            }
            _.each(data.queryresult, function(n) {
                if (n.isdistributer == '1')
                    $scope.brandimages.push(n);
            });
            if ($scope.brandimages.length == 0) {
                $scope.shownodata = true;
            }
            $scope.brands = _.chunk($scope.brandimages, 3);
            lastpage = data.lastpage;
            $ionicLoading.hide();
            $scope.$broadcast('scroll.infiniteScrollComplete');
            // $scope.$broadcast('scroll.refreshComplete');
        });
    }
    $scope.addMoreItems();

    $scope.getproductbybrand = function(id) {
        $location.url("app/product/" + 0 + "/" + 0 + "/" + id);
    }

})

.controller('ProductCtrl', function($scope, $stateParams, $timeout, $rootScope, MyServices, $ionicLoading, $ionicModal, $ionicScrollDelegate) {
    $scope.addwishlist = false;
    $rootScope.transparent_header = false;
    $scope.params = $stateParams;
    allfunction.loading();

    $scope.addWishlist = function() {
        $scope.addwishlist = true;
        console.log($scope.addwishlist);
    };

    $ionicModal.fromTemplateUrl('templates/filters.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modalFilter = modal;
    });
    $scope.closeFilter = function() {
        $scope.modalFilter.hide();
        if (($scope.filters.pricemin != $scope.showfilter.price.min) || ($scope.filters.pricemax != $scope.showfilter.price.max)) {
            $scope.getFilterResults();
        }
    };
    $scope.openFilter = function() {
        $scope.modalFilter.show();
    };

    $scope.pageno = 0;
    $scope.keepscrolling = true;
    $scope.shownodata = false;
    $scope.brandid = $stateParams.brand;
    $scope.parent = $stateParams.parent;
    $scope.category = $stateParams.category;
    $scope.productsarr = [];
    $scope.showfilter = [];
    $scope.filters = {};
    $scope.filters.category = "";
    $scope.filters.color = "";
    $scope.filters.type = "";
    $scope.filters.material = "";
    $scope.filters.finish = "";
    $scope.filters.compatibledevice = "";
    $scope.filters.compatiblewith = "";
    $scope.filters.brand = "";
    $scope.filters.pricemin = "";
    $scope.filters.pricemax = "";
    $scope.filters.microphone = "";
    $scope.filters.size = "";
    $scope.filters.clength = "";
    $scope.filters.voltage = "";
    $scope.filters.capacity = "";
    var lastpage = 1;
    var currentpage = -1;
    var getproductbybrandcallback = function(data, status) {
        // console.log(data);
        lastpage = data.data.lastpage;
        currentpage = data.data.pageno;
        $scope.keepscrolling = true;
        if (currentpage == lastpage) {
            $scope.keepscrolling = false;
        }
        if (data.data.queryresult.length == 0) {
            $scope.keepscrolling = false;
        } else {
            _.each(data.data.queryresult, function(n) {
                if (n.isfavid) {
                    n.fav = "fav";
                }
                if (n.firstsaleprice) {
                    if (n.specialpricefrom == "0000-00-00" && n.specialpriceto == "0000-00-00") {
                        n.showSalePrice = true;
                    } else if (n.specialpricefrom != "0000-00-00" && n.specialpriceto != "0000-00-00") {
                        var birth = new Date(n.specialpricefrom);
                        var death = new Date(n.specialpriceto);
                        var curr = new Date();
                        var diff = curr.getTime() - birth.getTime();
                        var diff2 = curr.getTime() - death.getTime();
                        var start = Math.floor(diff / (1000 * 60 * 60 * 24));
                        var end = Math.floor(diff2 / (1000 * 60 * 60 * 24));
                        if (start >= 0 && end <= 0) {
                            n.showSalePrice = true;
                        }
                    } else if (n.specialpricefrom != "0000-00-00") {
                        var birth = new Date(n.specialpricefrom);
                        var curr = new Date();
                        var diff = curr.getTime() - birth.getTime();
                        var start = Math.floor(diff / (1000 * 60 * 60 * 24));
                        if (start >= 0) {
                            n.showSalePrice = true;
                        }
                    } else if (n.specialpricefrom == "0000-00-00") {
                        n.showSalePrice = true;
                    }
                    if (n.showSalePrice == true) {
                        n.discountinper = Math.floor((1 - (parseFloat(n.firstsaleprice) / parseFloat(n.price))) * 100);
                    }
                }
                $scope.productsarr.push(n);
            });

            $scope.productsarr = _.uniq($scope.productsarr, 'id');
            $scope.products = _.chunk($scope.productsarr, 2);
            // console.log("keepscrolling = " + $scope.keepscrolling);

            if (data.filter) {
                if ($scope.filters.category == "" && data.filter.category) {
                    $scope.showfilter.category = data.filter.category;
                }
                if ($scope.filters.color == "" && data.filter.color) {
                    $scope.showfilter.color = data.filter.color;
                } else {
                    _.each(data.filter.color, function(n) {
                        var index = _.findIndex($scope.showfilter.color, {
                            "color": n.color
                        });
                        $scope.showfilter.color[index].status = true;
                    })
                }
                if ($scope.filters.type == "" && data.filter.type) {
                    $scope.showfilter.type = data.filter.type;
                }
                if ($scope.filters.material === "" && data.filter.material) {
                    $scope.showfilter.material = data.filter.material;
                } else {
                    _.each(data.filter.material, function(n) {
                        var index = _.findIndex($scope.showfilter.material, {
                            "material": n.material
                        });
                        $scope.showfilter.material[index].status = true;
                    })
                }
                if ($scope.filters.finish === "" && data.filter.finish) {
                    $scope.showfilter.finish = data.filter.finish;
                } else {
                    _.each(data.filter.finish, function(n) {
                        var index = _.findIndex($scope.showfilter.finish, {
                            "finish": n.finish
                        });
                        $scope.showfilter.finish[index].status = true;
                    })
                }
                var arr = [];
                if ($scope.filters.compatibledevice === "" && data.filter.compatibledevice) {
                    if (data.filter.compatibledevice.length > 1) {

                        _.each(data.filter.compatibledevice, function(n) {
                            n.compatibledevice = n.compatibledevice.split(",");
                            _.each(n.compatibledevice, function(m) {
                                arr.push({
                                    "compatibledevice": _.trim(m)
                                });
                            });
                        });
                        arr = _.uniq(arr, 'compatibledevice');
                        $scope.showfilter.compatibledevice = arr;
                    }
                }
                var arr2 = [];
                if ($scope.filters.compatiblewith === "" && data.filter.compatiblewith) {

                    if (data.filter.compatiblewith.length > 1) {
                        _.each(data.filter.compatiblewith, function(n) {
                            n.compatiblewith = n.compatiblewith.split(",");
                            _.each(n.compatiblewith, function(m) {
                                arr2.push({
                                    "compatiblewith": _.trim(m)
                                });
                            });
                        });
                        arr2 = _.uniq(arr2, 'compatiblewith');
                        $scope.showfilter.compatiblewith = arr2;
                    }
                } else {
                    _.each(data.filter.compatiblewith, function(n) {
                        var index = _.findIndex($scope.showfilter.compatiblewith, {
                            "compatiblewith": n.compatiblewith
                        });
                        $scope.showfilter.compatiblewith[index].status = true;
                    })
                }
                if ($scope.filters.brand === "" && data.filter.brand) {
                    $scope.showfilter.brand = data.filter.brand;
                } else {
                    _.each(data.filter.brand, function(n) {
                        var index = _.findIndex($scope.showfilter.brand, {
                            "id": n.id
                        });
                        $scope.showfilter.brand[index].status = true;
                    })
                }
                if ($scope.filters.microphone === "" && data.filter.microphone) {
                    $scope.showfilter.microphone = data.filter.microphone;
                } else {
                    _.each(data.filter.microphone, function(n) {
                        var index = _.findIndex($scope.showfilter.microphone, {
                            "microphone": n.microphone
                        });
                        $scope.showfilter.microphone[index].status = true;
                    })
                }
                if ($scope.filters.size === "" && data.filter.size) {
                    $scope.showfilter.size = data.filter.size;
                } else {
                    _.each(data.filter.size, function(n) {
                        var index = _.findIndex($scope.showfilter.size, {
                            "size": n.size
                        });
                        $scope.showfilter.size[index].status = true;
                    })
                }
                if ($scope.filters.clength === "" && data.filter.clength) {
                    $scope.showfilter.clength = data.filter.clength;
                }
                if ($scope.filters.voltage === "" && data.filter.voltage) {
                    $scope.showfilter.voltage = data.filter.voltage;
                }
                if ($scope.filters.capacity === "" && data.filter.capacity) {
                    $scope.showfilter.capacity = data.filter.capacity;
                }
                if (data.filter.price && data.filter.price.min) {
                    $scope.filters.pricemin = data.filter.price.min;
                }
                if (data.filter.price && data.filter.price.max) {
                    $scope.filters.pricemax = data.filter.price.max;
                }
                console.log($scope.showfilter);
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }

        if (data.data.queryresult.length == 0 && $scope.productsarr.length == 0) {
            $scope.shownodata = true;
            $scope.keepscrolling = false;
        }
        console.log($scope.filters);
        console.log($scope.showfilter);
        $ionicLoading.hide();
    }

    $scope.addMoreItems = function() {
        allfunction.loading();
        $scope.keepscrolling = false;
        console.log($scope.filters);
        if (lastpage > $scope.pageno) {
            ++$scope.pageno;
            if ($stateParams.brand != 0) {
                MyServices.getproductbybrand($scope.pageno, $stateParams.brand, $scope.filters, getproductbybrandcallback);
            } else if ($stateParams.parent != 0) {
                MyServices.getproductbycategory($scope.pageno, $stateParams.parent, $scope.filters, getproductbybrandcallback);
            } else {
                MyServices.getallproduct($scope.pageno, getproductbybrandcallback);
            }
        } else {
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $scope.keepscrolling = false;
        }
    }

    // $scope.addMoreItems();

    $scope.getFilterResults = function() {
        $.jStorage.set("filters", $scope.filters);
        $ionicScrollDelegate.scrollTop();
        $scope.pageno = 1;
        $scope.productsarr = [];
        // $scope.closeFilter();
        allfunction.loading();
        if ($stateParams.brand != 0) {
            MyServices.getproductbybrand(1, $stateParams.brand, $scope.filters, getproductbybrandcallback);
        } else if ($stateParams.parent != 0) {
            MyServices.getproductbycategory(1, $stateParams.parent, $scope.filters, getproductbybrandcallback);
        } else {
            MyServices.getallproduct(1, getproductbybrandcallback);
        }
    }

    $scope.alignFilter = function(str) {
        $scope.filters[str] = "";
        var objsend = $scope.showfilter[str];
        var objfil = $scope.filters[str];
        // console.log(objsend);
        _.each(objsend, function(n) {
            if (n.status) {
                objfil += n[str] + ",";
            }
        });
        objfil = objfil.substr(0, objfil.length - 1);
        $scope.filters[str] = objfil;
        // console.log($scope.filters[str]);
        $scope.getFilterResults();
    }

    $scope.alignFilterId = function(str) {
        $scope.filters[str] = "";
        var objsend = $scope.showfilter[str];
        var objfil = $scope.filters[str];
        console.log(objsend);
        _.each(objsend, function(n) {
            if (n.status) {
                objfil += n.id + ",";
            }
        });
        objfil = objfil.substr(0, objfil.length - 1);
        $scope.filters[str] = objfil;
        console.log(objfil);
        $scope.getFilterResults();
    }

    $scope.clearFilters = function() {
        console.log("in clearFilters");
        $scope.keepscrolling = false;
        MyServices.getFilters($stateParams.parent, $stateParams.brand, function(data) {
            if (data) {
                $scope.showfilter = data;
                if (data.compatibledevice && data.compatibledevice.length > 0) {
                    var arr = [];
                    _.each(data.compatibledevice, function(n) {
                        n.compatibledevice = n.compatibledevice.split(",");
                        _.each(n.compatibledevice, function(m) {
                            arr.push({
                                "compatibledevice": m
                            });
                        })
                    })
                    data.compatibledevice = arr;
                }
                if (data.compatiblewith && data.compatiblewith.length > 0) {
                    var arr = [];
                    _.each(data.compatiblewith, function(n) {
                        n.compatiblewith = n.compatiblewith.split(",");
                        _.each(n.compatiblewith, function(m) {
                            arr.push({
                                "compatiblewith": m
                            });
                        })
                    })
                    data.compatiblewith = arr;
                }
                $scope.filters.pricemin = data.price.min;
                $scope.filters.pricemax = data.price.max;
                $scope.pageno = 1;
                $scope.products = [];
                if (!$.jStorage.get("filters")) {
                    $scope.filters = {};
                    $scope.filters.category = "";
                    $scope.filters.color = "";
                    $scope.filters.type = "";
                    $scope.filters.material = "";
                    $scope.filters.finish = "";
                    $scope.filters.compatibledevice = "";
                    $scope.filters.compatiblewith = "";
                    $scope.filters.brand = "";
                    $scope.filters.pricemin = "";
                    $scope.filters.pricemax = "";
                    $scope.filters.microphone = "";
                    $scope.filters.size = "";
                    $scope.filters.clength = "";
                    $scope.filters.voltage = "";
                    $scope.filters.capacity = "";
                } else {
                    $scope.filters = $.jStorage.get("filters");
                }

                if ($stateParams.brand != 0) {
                    MyServices.getproductbybrand(1, $stateParams.brand, $scope.filters, getproductbybrandcallback);
                } else if ($stateParams.parent != 0) {
                    MyServices.getproductbycategory(1, $scope.parent, $scope.filters, getproductbybrandcallback);
                } else {
                    MyServices.getallproduct(1, getproductbybrandcallback);
                }
            }
        });
    }

    $scope.clearFilters();

})

.controller('ProductDetailCtrl', function($scope, $stateParams, $rootScope, $ionicScrollDelegate, MyServices, $ionicLoading, $ionicSlideBoxDelegate, $ionicPopup, $timeout, $filter, $ionicModal, $state, $location) {
    $rootScope.transparent_header = true;
    allfunction.loading();
    $scope.activate = true;
    $scope.showSalePrice = false;
    $scope.tab = {
        left: true,
        right: false
    }
    var i = 0;
    $scope.pageScrolled = function() {
        if ($ionicScrollDelegate.getScrollPosition().top > 240) {
            $rootScope.transparent_header = false;
            $scope.$apply();
        } else {
            $rootScope.transparent_header = true;
            $scope.$apply();
        }
    };
    $scope.clickTab = function(side) {
        if (side === "left") {
            $scope.tab.left = true;
            $scope.tab.right = false;
        } else {
            $scope.tab.right = true;
            $scope.tab.left = false;
        }
    };

    $scope.getPoductDetail = function(id) {
        $ionicLoading.show();
        MyServices.getproductdetails(id, function(data, status, $filter) {
            console.log(data);
            $scope.product = data;
            if ($scope.product.product.user) {
                $scope.product.product.fav = "fav";
            }
            if (data.product.quantity >= 1) {
                $scope.availability = "In Stock";
            } else {
                $scope.availability = "Out of Stock";
            }

            $scope.productdetail = [];
            $scope.product.productimage = _.sortByOrder($scope.product.productimage, ['order'], ['asc']);
            _.each($scope.product.productimage, function(n) {
                $scope.productdetail.push({
                    image: adminimage + n.image,
                    check: 1
                });
            });
            if (data.product.videourl != '') {
                $scope.productdetail.push({
                    image: "http://img.youtube.com/vi/" + data.product.videourl + "/maxresdefault.jpg",
                    url: data.product.videourl,
                    check: 0
                });
            }

            if ($scope.product.product.firstsaleprice) {
                if ($scope.product.product.specialpricefrom == "0000-00-00" && $scope.product.product.specialpriceto == "0000-00-00") {
                    $scope.showSalePrice = true;
                } else if ($scope.product.product.specialpricefrom != "0000-00-00" && $scope.product.product.specialpriceto != "0000-00-00") {
                    var birth = new Date($scope.product.product.specialpricefrom);
                    var death = new Date($scope.product.product.specialpriceto);
                    var curr = new Date();
                    var diff = curr.getTime() - birth.getTime();
                    var diff2 = curr.getTime() - death.getTime();
                    var start = Math.floor(diff / (1000 * 60 * 60 * 24));
                    var end = Math.floor(diff2 / (1000 * 60 * 60 * 24));
                    if (start >= 0 && end <= 0) {
                        $scope.showSalePrice = true;
                    }
                } else if ($scope.product.product.specialpricefrom != "0000-00-00") {
                    var birth = new Date($scope.product.product.specialpricefrom);
                    var curr = new Date();
                    var diff = curr.getTime() - birth.getTime();
                    var start = Math.floor(diff / (1000 * 60 * 60 * 24));
                    if (start >= 0) {
                        $scope.showSalePrice = true;
                    }
                } else if ($scope.product.product.specialpricefrom == "0000-00-00") {
                    $scope.showSalePrice = true;
                }
                if ($scope.showSalePrice == true) {
                    // $scope.product.product.discountinper = Math.round(parseFloat($scope.product.product.firstsaleprice) / parseFloat($scope.product.product.price) * 100);
                    $scope.product.product.discountinper = Math.floor((1 - (parseFloat($scope.product.product.firstsaleprice) / parseFloat($scope.product.product.price))) * 100);
                }
            } else {
                $scope.showSalePrice = false;
            }

            if ($scope.product.samecolor && $scope.product.samecolor.length > 0) {
                var same = [];
                _.each($scope.product.samecolor, function(n) {
                    if ($scope.product.product.id != n.id) {
                        same.push(n);
                    }
                })
                $scope.product.samecolor = _.chunk(same, 4);
            }

            // console.log($scope.product);
            $timeout(function() {
                $ionicSlideBoxDelegate.slide(0);
                $ionicSlideBoxDelegate.update();
            }, 500);
            $ionicLoading.hide();
            // $scope.product.product.quantity = 1;
        });
    }

    $scope.getPoductDetail($stateParams.id);

    var addtowishlistcallback = function(data, status) {
        console.log(data);
        if (data == "true") {
            $scope.product.product.fav = "fav";
            var xyz = $ionicPopup.show({
                title: 'Your product has been added to wishlist'
            });
            $timeout(function() {
                xyz.close();
            }, 3000)
        } else if (data == "0") {
            var xyz = $ionicPopup.show({
                title: 'Already added to wishlist !!'
            });
            $timeout(function() {
                xyz.close();
            }, 3000)
        } else {
            var xyz = $ionicPopup.show({
                title: 'Oops something went wrong !!'
            });
            $timeout(function() {
                xyz.close();
            }, 3000)
        }
        $ionicLoading.hide();
    }

    $scope.addtowishlist = function(productid) {
        console.log(productid);
        if (MyServices.getuser()) {
            allfunction.loading();
            MyServices.addtowishlist(productid, addtowishlistcallback);
        } else {
            var xyz = $ionicPopup.show({
                title: 'Login for wishlist'
            });
            $timeout(function() {
                xyz.close();
            }, 3000)
        }
    }

    $scope.addtocart = function(product) {
        allfunction.loading();
        console.log(product);
        var selectedproduct = {};
        selectedproduct.product = product.id;
        selectedproduct.productname = product.name;
        selectedproduct.price = product.price;
        selectedproduct.quantity = product.quantity;
        MyServices.addtocart(selectedproduct, function(data) {
            console.log(data);
            var xyz = $ionicPopup.show({
                title: 'Added to cart'
            });
            $timeout(function() {
                xyz.close();
            }, 3000);
            myfunction();
            $ionicLoading.hide();
        });
    }

    $ionicModal.fromTemplateUrl('templates/product-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function(image) {
        if (image.indexOf('youtube') == -1) {
            $scope.showImage = true;
            $scope.zoomImage = {};
            $scope.zoomImage.image = image;
            $scope.zoomImage.name = $scope.product.product.name;
            console.log($scope.zoomImage);
        } else {
            $scope.showImage = false;
            console.log($scope.product.product.videourl);
            $scope.zoomImage = {};
            $scope.zoomImage.name = $scope.product.product.name;
            $scope.zoomImage.image = $scope.product.product.videourl;
        }
        $scope.modal.show();
    };

    $scope.closeModal = function() {
        $scope.zoomImage = {};
        $scope.modal.hide();
    };

    $scope.goToSameColorProduct = function(product) {
        // $scope.getPoductDetail(product.id);
        $location.url("/app/productdetail/" + product.id);
    }
})

//dhaval start
.controller('BrandsCtrl', function($scope, $stateParams, $rootScope, MyServices, $location, $ionicLoading) {
    $.jStorage.set("filters", null);
    $rootScope.nosearch = true;
    allfunction.loading();
    var lastpage = 1;
    $scope.pageno = 0;
    $scope.keepscrolling = true;
    $scope.shownodata = false;
    $scope.brandimages = [];

    $scope.addMoreItems = function() {
        console.log("load more brands");
        ++$scope.pageno;
        MyServices.getbrand($scope.pageno, function(data, status) {
            console.log(data);
            if (data.queryresult.length == 0) {
                $scope.keepscrolling = false;
            }
            _.each(data.queryresult, function(n) {
                $scope.brandimages.push(n);
            });
            if ($scope.brandimages.length == 0) {
                $scope.shownodata = true;
            }
            $scope.brands = _.chunk($scope.brandimages, 3);
            lastpage = data.lastpage;
            $ionicLoading.hide();
            $scope.$broadcast('scroll.infiniteScrollComplete');
            // $scope.$broadcast('scroll.refreshComplete');
        });
    }
    $scope.addMoreItems();

    $scope.getproductbybrand = function(id) {
        $location.url("app/product/" + 0 + "/" + 0 + "/" + id);
    }
})

//dhaval end

.controller('AboutCtrl', function($scope, $ionicScrollDelegate, $stateParams, MyServices, $ionicLoading) {
    $.jStorage.set("filters", null);
    $scope.activate = true;
    $scope.tab = {
        left: true,
        right: false
    }
    $scope.clickTab = function(side) {
        $ionicScrollDelegate.scrollTop(true);
        if (side === "left") {
            $scope.tab.left = true;
            $scope.tab.right = false;
        } else {
            $scope.tab.right = true;
            $scope.tab.left = false;
            console.log("here");
        }
    };

    allfunction.loading();

    MyServices.getaboutus(function(data, status) {
        console.log(data);
        $scope.celebimages = data.queryresult;
        $ionicLoading.hide();
    });

    //    tab change

    $scope.tab = 'new';
    $scope.classa = 'active';
    $scope.classb = '';

    $scope.tabchange = function(tab, a) {
        //        console.log(tab);
        $scope.tab = tab;
        if (a == 1) {
            $ionicScrollDelegate.scrollTop();
            $scope.classa = "active";
            $scope.classb = '';
        } else {
            $ionicScrollDelegate.scrollTop();
            $scope.classa = '';

            $scope.classb = "active";
        }
    };

})

.controller('SearchresultCtrl', function($scope, $ionicScrollDelegate, $stateParams, MyServices, $ionicLoading) {
    $.jStorage.set("filters", null);
    $scope.searchfor = '';
    $scope.showSearchForSomething = true;
    $scope.shownodata = false;

    $scope.getSearchResults = function() {
        if ($scope.searchfor != "" && $scope.searchfor.length >= 3) {
            allfunction.loading();
            MyServices.search($scope.searchfor, function(data) {
                console.log(data);
                if (data.length == 0) {
                    $scope.products = [];
                    $scope.shownodata = true;
                } else {
                    $scope.products = data;
                    $scope.products = _.chunk($scope.products, 2);
                    $scope.showSearchForSomething = false;
                }
                $ionicLoading.hide();
            });
        } else {
            $scope.products = [];
            $scope.showSearchForSomething = true;
            $scope.shownodata = false;
        }
    }

});
