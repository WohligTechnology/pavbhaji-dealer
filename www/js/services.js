// var adminbase = "http://admin.accessworld.in/";
var adminbase = "http://192.168.1.102/accessback/";
var adminurl = adminbase + "index.php/json/";
var adminhauth = adminbase + "index.php/hauth/";
var adminimage = "http://admin.accessworld.in/uploads/";
// var adminimage = adminbase + "uploads/";
// var adminimage = "http://accessworld.in/admin/uploads/";

angular.module('starter.services', ['httpService'])

.factory('MyServices', function($http, httpService) {

    var coupondetails = $.jStorage.get("coupon");

    return {
        makeactive: function(menuname) {
            for (var i = 0; i < navigation.length; i++) {
                if (navigation[i].name == menuname) {
                    navigation[i].classis = "active";
                } else {
                    navigation[i].classis = "";
                }
            }
            return menuname;
        },
        registerUser: function(signup, callback) {
            return $http({
                url: adminurl + 'registeruser',
                method: "POST",
                data: signup
            }).success(callback);
        },
        login: function(login, callback) {
            return $http({
                url: adminurl + 'dealerLogin',
                method: "POST",
                data: login
            }).success(callback);
        },
        authenticate: function(callback, errCallback) {
            httpService.get(adminurl + 'authenticateDealer', {}, callback, errCallback);
            // httpService.get(adminurl + 'getbrand?maxrow=12&pageno=' + pageno, {}, callback, errCallback);
        },
        getStoreDropDown: function(callback, errCallback) {
            httpService.get(adminurl + 'getStoreDropDown', {}, callback, errCallback);
        },
        orderhistory: function(callback, errCallback) {
            // return $http.get(adminurl + 'orderDealerHistory').success(callback);
            httpService.get(adminurl + 'orderDealerHistory', {}, callback, errCallback);
        },
        logout: function(callback) {
            return $http.post(adminurl + 'logout', {
                withCredentials: true
            }).success(callback);
        },
        updateuser: function(userdetails, callback) {
            return $http({
                url: adminurl + 'updateDealer',
                method: "POST",
                data: {
                    'id': $.jStorage.get("user").id,
                    'storename': userdetails.storename,
                    'ownername': userdetails.ownername,
                    'email': userdetails.email,
                    'address': userdetails.address,
                    'city': userdetails.city,
                    'state': userdetails.state,
                    'phone': userdetails.phone,
                    'pincode': userdetails.pincode
                }
            }).success(callback);
        },
        placeorder: function(checkout, callback) {
            console.log(checkout);
            return $http({
                url: adminurl + 'placeOrderForDealer',
                method: "POST",
                data: checkout
            }).success(callback);
        },
        usercontact: function(usercontact, callback) {
            // return $http.get(adminurl + 'userContactDealer?name=' + usercontact.name + '&phone=' + usercontact.phone + '&email=' + usercontact.email + '&comment=' + usercontact.comment, {}, {
            //     withCredentials: true
            // }).success(callback);
            return $http({
                url: adminurl + 'userContactDealer',
                method: "POST",
                data: {
                    'name': usercontact.name,
                    'phone': usercontact.phone,
                    'email': usercontact.email,
                    'comment': usercontact.comment
                }
            }).success(callback);
        },
        //dhaval start
        getbrand: function(pageno, callback, errCallback) {
            console.log(pageno);
            httpService.get(adminurl + 'getbrand?maxrow=12&pageno=' + pageno, {}, callback, errCallback);
        },
        getDealerOrderDetails: function(callback, errCallback) {
            var user = parseInt($.jStorage.get("user").id);
            httpService.get(adminurl + 'getDealerOrderDetails?user=' + user, {}, callback, errCallback);
        },
        getproductbybrand: function(pageno, brand, filters, callback, errCallback) {
            return $http.get(adminurl + 'getproductbycategory?category=' + filters.category + '&pageno=' + pageno + '&color=' + filters.color + '&type=' + filters.type + '&material=' + filters.material + '&finish=' + filters.finish + '&compatibledevice=' + filters.compatibledevice + '&compatiblewith=' + filters.compatiblewith + '&brand=' + brand + '&pricemin=' + filters.pricemin + '&pricemax=' + filters.pricemax + '&microphone=' + filters.microphone + '&size=' + filters.size + '&lenght=' + filters.clength + '&voltage=' + filters.voltage + '&capacity=' + filters.capacity, {}, {
                withCredentials: true
            }).success(callback);


            // httpService.get(adminurl + 'getproductbycategory?category=' + filters.category + '&pageno=' + pageno + '&color=' + filters.color + '&type=' + filters.type + '&material=' + filters.material + '&finish=' + filters.finish + '&compatibledevice=' + filters.compatibledevice + '&compatiblewith=' + filters.compatiblewith + '&brand=' + brand + '&pricemin=' + filters.pricemin + '&pricemax=' + filters.pricemax + '&microphone=' + filters.microphone + '&size=' + filters.size + '&lenght=' + filters.clength + '&voltage=' + filters.voltage + '&capacity=' + filters.capacity, {}, callback, errCallback);
        },
        getproductbycategory: function(pageno, category, filters, callback, errCallback) {
            return $http.get(adminurl + 'getproductbycategory?category=' + category + '&pageno=' + pageno + '&color=' + filters.color + '&type=' + filters.type + '&material=' + filters.material + '&finish=' + filters.finish + '&compatibledevice=' + filters.compatibledevice + '&compatiblewith=' + filters.compatiblewith + '&brand=' + filters.brand + '&pricemin=' + filters.pricemin + '&pricemax=' + filters.pricemax + '&microphone=' + filters.microphone + '&size=' + filters.size + '&lenght=' + filters.clength + '&voltage=' + filters.voltage + '&capacity=' + filters.capacity + '&maxrow=18', {}, {
                withCredentials: true
            }).success(callback);



            //
            // httpService.get(adminurl + 'getproductbycategory?category=' + category + '&pageno=' + pageno + '&color=' + filters.color + '&type=' + filters.type + '&material=' + filters.material + '&finish=' + filters.finish + '&compatibledevice=' + filters.compatibledevice + '&compatiblewith=' + filters.compatiblewith + '&brand=' + filters.brand + '&pricemin=' + filters.pricemin + '&pricemax=' + filters.pricemax + '&microphone=' + filters.microphone + '&size=' + filters.size + '&lenght=' + filters.clength + '&voltage=' + filters.voltage + '&capacity=' + filters.capacity + '&maxrow=18', {}, callback, errCallback);
        },
        getallproduct: function(pageno, callback) {
            // return $http.get(adminurl + 'getallproducts?pageno=' + pageno, {}, {
            //     withCredentials: true
            // }).success(callback);

            httpService.get(adminurl + 'getallproducts?pageno=' + pageno, {}, callback, errCallback);
        },
        getexclusiveandnewarrival: function(pageno, id, callback) {
            return $http.get(adminurl + 'getexclusiveandnewarrival?id=' + id + '&pageno=' + pageno, {}, {
                withCredentials: true
            }).success(callback);

        },
        getproductdetails: function(id, callback, errCallback) {
            // return $http.get(adminurl + 'getproductdetails?id=' + id, {}, {
            //     withCredentials: true
            // }).success(callback);
            httpService.get(adminurl + 'getproductdetails?id=' + id, {}, callback, errCallback);
        },
        addtowishlist: function(productid, callback) {
            return $http({
                url: adminurl + "addtowishlist",
                method: "POST",
                withCredentials: true,
                data: {
                    "user": $.jStorage.get("user").id,
                    "product": productid
                }
            }).success(callback);
        },
        addtocart: function(product, callback) {
            return $http.get(adminurl + 'addtocartDealer?product=' + product.product + '&productname=' + product.productname + '&price=' + product.price + '&quantity=' + product.quantity, {}, {
                withCredentials: true
            }).success(callback);
        },
        gettotalcart: function(callback) {
            return $http.post(adminurl + 'totalitemcart', {}, {
                withCredentials: true
            }).success(callback);
        },
        totalcart: function(callback) {
            return $http.post(adminurl + 'totalcart', {}, {
                withCredentials: true
            }).success(callback);
        },
        getcoupondetails: function() {
            return coupondetails;
        },
        setcoupondetails: function(coupon) {
            $.jStorage.set("coupon", coupon);
            coupondetails = coupon;
        },
        getdiscountcoupon: function(couponcode) {
            return $http.post(adminurl + 'getdiscountcoupon?couponcode=' + couponcode, {}, {
                withCredentials: true
            });
        },
        getcart: function(callback) {
            return $http({
                url: adminurl + "showcart",
                method: "POST",
                withCredentials: true,
                data: {}
            }).success(callback);
        },
        deletecart: function(id, callback) {
            return $http.get(adminurl + 'deletecart?id=' + id, {}, {
                withCredentials: true
            }).success(callback);
        },
        getwishlistproduct: function(callback) {
            return $http({
                url: adminurl + "getwishlistproduct",
                method: "POST",
                withCredentials: true,
                data: {
                    "user": $.jStorage.get("user").id
                }
            }).success(callback);
        },
        removefromwishlist: function(productid, callback) {
            return $http({
                url: adminurl + "removefromwishlist",
                method: "POST",
                withCredentials: true,
                data: {
                    "user": $.jStorage.get("user").id,
                    "product": productid
                }
            }).success(callback);
        },
        getaboutus: function(callback) {
            return $http({
                url: adminurl + 'getaboutus',
                method: "POST"
            }).success(callback);
        },
        getofferdetails: function(callback) {
            return $http({
                url: adminurl + 'getofferdetails',
                method: "POST"
            }).success(callback);
        },
        search: function(search, callback) {
            return $http.get(adminurl + 'searchbyname?search=' + search, {}, {
                withCredentials: true
            }).success(callback);
        },
        getallcategories: function(callback, errCallback) {
            // return $http.get(adminurl + 'getallcategory', {}, {
            //     withCredentials: true
            // }).success(callback);
            httpService.get(adminurl + 'getallcategory', {}, callback, errCallback);
        },

        getsinglecategory: function(id, callback, errCallback) {
            // return $http.get(adminurl + 'getsinglecategory?categoryid=' + id, {}, {
            //     withCredentials: true
            // }).success(callback);
            httpService.get(adminurl + 'getsinglecategory?categoryid=', {}, callback, errCallback);
        },
        getHomeProducts: function(callback, errCallback) {
            // return $http.get(adminurl + 'getHomeProducts', {}, {
            //     withCredentials: true
            // }).success(callback);
            httpService.get(adminurl + 'getHomeProducts', {}, callback, errCallback);

        },
        getHomeSlider: function(callback, errCallback) {
            // return $http.get(adminurl + 'getHomeSlider', {}, {
            //     withCredentials: true
            // }).success(callback);
            httpService.get(adminurl + 'getHomeSlider', {}, callback, errCallback);
        },
        getFilters: function(category, brand, callback) {
            return $http.post(adminurl + 'getFilters?category=' + category + "&brand=" + brand, {}, {
                withCredentials: true
            }).success(callback);
        },
        getuserdetails: function(callback, errCallback) {
            // return $http.get(adminurl + 'getDealerDetails', {}, {
            //     withCredentials: true
            // }).success(callback);
            httpService.get(adminurl + 'getDealerDetails', {}, callback, errCallback);
        },
        checkoutCheck: function(callback) {
            return $http.get(adminurl + 'checkoutCheck', {}, {
                withCredentials: true
            }).success(callback);
        },
        getsubscribe: function(email, callback) {
            return $http.get(adminurl + 'getsubscribe?email=' + email, {}, {
                withCredentials: true
            }).success(callback);
        },
        //dhaval end
        forgotPassword: function(forgot, callback) {
            return $http({
                url: adminurl + 'forgotpassword',
                method: "POST",
                data: forgot
            }).success(callback);
        },
        getorderbyorderid: function(orderid, callback) {
            return $http.get(adminurl + 'getorderbyorderid?id=' + orderid, {}, {
                withCredentials: true
            }).success(callback);
        },
        setNotify: function(data) {
            $.jStorage.set("notify", data);
        },
        getNotify: function() {
            return $.jStorage.get("notify");
        },
        setuser: function(data) {
            $.jStorage.set("user", data);
        },
        getuser: function() {
            return $.jStorage.get("user");
        }
    };
});
