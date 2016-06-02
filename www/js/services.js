var adminbase = "http://accessworld.in/admin/";
// var adminbase = "http://localhost/accessback/";
var adminurl = adminbase + "index.php/json/";
var adminhauth = adminbase + "index.php/hauth/";
var adminimage = adminbase + "uploads/";
var adminimage = "http://accessworld.in/admin/uploads/";
//var adminimage = "http://localhost/accessback/uploads/";

angular.module('starter.services', [])

.factory('MyServices', function($http) {

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
                url: adminurl + 'loginuser',
                method: "POST",
                data: login
            }).success(callback);
        },
        authenticate: function(callback) {
            return $http.get(adminurl + 'authenticate').success(callback);
        },
        orderhistory: function(callback) {
            return $http.get(adminurl + 'orderhistory').success(callback);
        },
        logout: function(callback) {
            return $http.post(adminurl + 'logout', {
                withCredentials: true
            }).success(callback);
        },
        updateuser: function(userdetails, callback) {
            return $http({
                url: adminurl + 'updateuser',
                method: "POST",
                data: {
                    'id': $.jStorage.get("user").id,
                    'firstname': userdetails.firstname,
                    'lastname': userdetails.lastname,
                    'email': userdetails.email,
                    'phone': userdetails.phone,
                    'billingaddress': userdetails.billingaddress,
                    'billingcity': userdetails.billingcity,
                    'billingpincode': userdetails.billingpincode,
                    'billingcountry': userdetails.billingcountry,
                    'billingstate': userdetails.billingstate
                }
            }).success(callback);
        },
        placeorder: function(checkout, callback) {
            return $http({
                url: adminurl + 'placeorder',
                method: "POST",
                data: {
                    'firstname': checkout.firstname,
                    'lastname': checkout.lastname,
                    'billingaddress': checkout.billingaddress,
                    'billingcity': checkout.billingcity,
                    'billingstate': checkout.billingstate,
                    'billingcountry': checkout.billingcountry,
                    'billingpincode': checkout.billingpincode,
                    'email': checkout.email,
                    'company': checkout.company,
                    'billingcontact': checkout.billingcontact,
                    'shippingname': checkout.shippingname,
                    'shippingpincode': checkout.shippingpincode,
                    'shippingaddress': checkout.shippingaddress,
                    'shippingcity': checkout.shippingcity,
                    'shippingstate': checkout.shippingstate,
                    'shippingcountry': checkout.shippingcountry,
                    'shippingcontact': checkout.shippingcontact,
                    'cart': checkout.cart,
                    'finalamount': checkout.finalamount,
                    'user': checkout.userid,
                }
            }).success(callback);
        },
        usercontact: function(usercontact, callback) {
            return $http.get(adminurl + 'usercontact?name=' + usercontact.name + '&phone=' + usercontact.phone + '&email=' + usercontact.email + '&comment=' + usercontact.comment, {}, {
                withCredentials: true
            }).success(callback);

        },
        //dhaval start
        getbrand: function(pageno, callback) {
            return $http.get(adminurl + 'getbrand?maxrow=12&pageno=' + pageno, {}, {
                withCredentials: true
            }).success(callback);
        },
        getproductbybrand: function(pageno, brand, filters, callback) {
            return $http.get(adminurl + 'getproductbycategory?category=' + filters.category + '&pageno=' + pageno + '&color=' + filters.color + '&type=' + filters.type + '&material=' + filters.material + '&finish=' + filters.finish + '&compatibledevice=' + filters.compatibledevice + '&compatiblewith=' + filters.compatiblewith + '&brand=' + brand + '&pricemin=' + filters.pricemin + '&pricemax=' + filters.pricemax + '&microphone=' + filters.microphone + '&size=' + filters.size + '&lenght=' + filters.clength + '&voltage=' + filters.voltage + '&capacity=' + filters.capacity, {}, {
                withCredentials: true
            }).success(callback);
        },
        getproductbycategory: function(pageno, category, filters, callback) {
            return $http.get(adminurl + 'getproductbycategory?category=' + category + '&pageno=' + pageno + '&color=' + filters.color + '&type=' + filters.type + '&material=' + filters.material + '&finish=' + filters.finish + '&compatibledevice=' + filters.compatibledevice + '&compatiblewith=' + filters.compatiblewith + '&brand=' + filters.brand + '&pricemin=' + filters.pricemin + '&pricemax=' + filters.pricemax + '&microphone=' + filters.microphone + '&size=' + filters.size + '&lenght=' + filters.clength + '&voltage=' + filters.voltage + '&capacity=' + filters.capacity + '&maxrow=18', {}, {
                withCredentials: true
            }).success(callback);
        },
        getallproduct: function(pageno, callback) {
            return $http.get(adminurl + 'getallproducts?pageno=' + pageno, {}, {
                withCredentials: true
            }).success(callback);
        },
        getexclusiveandnewarrival: function(pageno, id, callback) {
            return $http.get(adminurl + 'getexclusiveandnewarrival?id=' + id + '&pageno=' + pageno, {}, {
                withCredentials: true
            }).success(callback);
        },
        getproductdetails: function(id, callback) {
            return $http.get(adminurl + 'getproductdetails?id=' + id, {}, {
                withCredentials: true
            }).success(callback);
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
            return $http.get(adminurl + 'addtocart?product=' + product.product + '&productname=' + product.productname + '&price=' + product.price + '&quantity=' + product.quantity, {}, {
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
        getallcategories: function(callback) {
            return $http.get(adminurl + 'getallcategory', {}, {
                withCredentials: true
            }).success(callback);
        },
        getsinglecategory: function(id, callback) {
            return $http.get(adminurl + 'getsinglecategory?categoryid=' + id, {}, {
                withCredentials: true
            }).success(callback);
        },
        getHomeProducts: function(callback) {
            return $http.get(adminurl + 'getHomeProducts', {}, {
                withCredentials: true
            }).success(callback);
        },
        getHomeSlider: function(callback) {
            return $http.get(adminurl + 'getHomeSlider', {}, {
                withCredentials: true
            }).success(callback);
        },
        getFilters: function(category, brand, callback) {
            return $http.post(adminurl + 'getFilters?category=' + category + "&brand=" + brand, {}, {
                withCredentials: true
            }).success(callback);
        },
        getuserdetails: function(callback) {
            return $http.get(adminurl + 'getuserdetails', {}, {
                withCredentials: true
            }).success(callback);
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
