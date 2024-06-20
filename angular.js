 var app = angular.module("myapp", ["ngRoute"]);

app.controller('myCtrl', function ($scope) {
});

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", { 
            templateUrl: "trangchu.html",
             controller: "myCtrl" 
            })
        .when("/gioithieu", {
             templateUrl: "gioithieu.html",
              controller: "myCtrl" 
            })
        .when("/lienhe", { 
            templateUrl: "lienhe.html",
             controller: "myCtrl" 
            })
        .when("/detail/:id", { 
            templateUrl: "chitiet.html",
             controller: "myCtrl" 
        })
        .when("/dangnhap", { 
            templateUrl: "dangnhap.html",
             controller: "myCtrl" 
            })
        .when("/dangky", { 
            templateUrl: "dangky.html",
             controller: "myCtrl"
             })
        .when("/giohang", { 
            templateUrl: "giohang.html", 
            controller: "myCtrl"
         })
        .when("/trongnuoc", {
             templateUrl: "trongnuoc.html", 
             controller: "myCtrl" 
            })
        .when("/ngoainuoc", { 
            templateUrl: "ngoainuoc.html", 
            controller: "myCtrl" 
    })
        .otherwise({ 
            templateUrl: "trangchu.html",
             controller: "myCtrl" 
            });
});