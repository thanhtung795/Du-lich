var app = angular.module("MyApp", ["ngRoute"]);

app.controller("NavController", function ($scope, $window, $location) {
  $scope.$on("$routeChangeSuccess", function () {
    const currentLocation = `#!${$location.path()}`; // Bao gồm cả #!
    const menuItem = document.querySelectorAll(".nav-link");
    const menuLength = menuItem.length;

    console.log(currentLocation);

    for (let i = 0; i < menuLength; i++) {
      if (
        menuItem[i].getAttribute("href") === currentLocation.replace("/", "")
      ) {
        // So sánh toàn bộ giá trị href
        menuItem[i].classList.add("active");
      } else {
        menuItem[i].classList.remove("active");
      }
    }
  });
  $scope.$on("$routeChangeSuccess", function () {
    $window.scrollTo(0, 0);
  });
});
app.controller(
  "Carts",
  function ($scope, $rootScope, $timeout, $location, $http) {
    // Khởi tạo giỏ hàng từ Local Storage hoặc một mảng rỗng
    $scope.getDataCartLocal = function () {
      try {
        $rootScope.Carts = JSON.parse(localStorage.getItem("cartItems")) || [];
      } catch (e) {
        console.error("Không lấy dữ liệu", e);
        $rootScope.Carts = [];
      }
    };

    // Hàm lưu giỏ hàng vào Local Storage
    $scope.saveCartToLocalStorage = function () {
      localStorage.setItem("cartItems", JSON.stringify($rootScope.Carts));
    };

    $scope.getDataProductctsp = function () {
      try {
        $rootScope.productctsp = JSON.parse(
          localStorage.getItem("selectedProduct")
        );
      } catch (e) {
        $rootScope.productctsp = {};
      }
    };
    $scope.saveProductctspToLocalStorage = function () {
      // Chuyển đối tượng productctsp thành chuỗi JSON
      let productctspJSON = JSON.stringify($rootScope.productctsp);

      // Lưu chuỗi JSON vào Local Storage với một key cụ thể, ví dụ: 'selectedProduct'
      localStorage.setItem("selectedProduct", productctspJSON);
    };

    // Hàm cập nhật số lượng sản phẩm trong giỏ hàng
    $scope.updateCartItemCount = function () {
      var cartItemCountElement = document.getElementById("cartItemCount");
      var cartItemCount = $rootScope.Carts.length; // Số lượng phần tử trong mảng carts

      // Cập nhật số lượng hiển thị trong thẻ span
      if (cartItemCountElement) {
        cartItemCountElement.innerText = cartItemCount;
      }
    };

    // Hàm tính tổng giá của giỏ hàng
    $scope.updateTotalPrice = function () {
      $scope.totalPrice = $rootScope.Carts.reduce(function (total, product) {
        return total + product.Gia * product.SL;
      }, 0);
    };

    // Hàm tìm sản phẩm trong giỏ hàng
    $scope.findProduct = function (product) {
      return $rootScope.Carts.find(
        (cartProduct) => cartProduct.id === product.id
      );
    };

    // Hàm thêm sản phẩm vào giỏ hàng
    $scope.pushToCart = function (product) {
      $rootScope.Carts.push(product);
    };

    $scope.pushProductctspToCart = function (product) {
      $rootScope.Carts.push(angular.copy(product));
    };

    $scope.showThongBaoAndHide = function () {
      Swal.fire({
        title: "Giõ hàng",
        text: "Đã thêm vào giõ hàng thành công",
        icon: "success",
        confirmButtonText: "Xác nhận",
      }).then((result) => {
        if (result.isConfirmed) {
        }
      });
    };
    // $scope.showThongBaoAndHide = function () {
    //   let thongBaoElement = document.querySelector(".ThongBao");

    //   // Hiển thị thông báo và thêm lớp 'show' để kích hoạt animation
    //   thongBaoElement.classList.add("show");

    //   $timeout(function () {
    //     // Ẩn thông báo và loại bỏ lớp 'show' sau 3 giây
    //     thongBaoElement.classList.remove("show");
    //   }, 2000);
    // };

    $scope.AddCart = function (product) {
      // Kiểm tra nếu người dùng chưa đăng nhập
      if (!$rootScope.User || Object.keys($rootScope.User).length === 0) {
        // Chuyển hướng đến trang đăng nhập
        $location.path("/DangNhap");
      } else {
        let productFinded = $scope.findProduct(product);

        if (productFinded) {
          productFinded.SL += 1;
        } else {
          product.SL = 1;
          $scope.pushToCart(product);
        }
        $scope.saveCartToLocalStorage();
        $scope.updateCartItemCount();
        $scope.updateTotalPrice();
        $scope.showThongBaoAndHide();
      }
    };
    $scope.addProdutctsp = function (product) {
      if (!$rootScope.User || Object.keys($rootScope.User).length === 0) {
        // Chuyển hướng đến trang đăng nhập
        $location.path("/DangNhap");
      } else {
        let productFinded = $scope.findProduct(product);

        if (productFinded) {
          productFinded.SL += product.SL;
        } else {
          $scope.pushProductctspToCart(product);
        }
        $scope.updateCartItemCount();
        $scope.updateTotalPrice();
        // Lưu giỏ hàng vào local storage
        $scope.saveCartToLocalStorage();

        // Chuyển hướng đến trang /GioHang sau khi dữ liệu đã được lưu vào local storage
        $location.path("/GioHang");
      }
    };

    // Hàm xóa sản phẩm khỏi giỏ hàng
    $scope.RemoveProduct = function (index) {
      $rootScope.Carts.splice(index, 1);
      $scope.updateCartItemCount();
      $scope.updateTotalPrice();
      $scope.saveCartToLocalStorage();
    };
    $scope.filteredProducts = $rootScope.Products;

    $scope.filterCategory = function (category) {
      $rootScope.filteredProducts = $rootScope.Products.filter(function (
        product
      ) {
        return product.TenNoiDen.includes(category);
      });
    };

    $scope.payProducts = function () {
      $rootScope.getLoggedInUser();
      if ($rootScope.Carts.length == 0) {
        Swal.fire({
          title: "Thanh toán thất bại",
          text: "Bạn hãy chọn một sản phẩm",
          icon: "error",
          confirmButtonText: "Xác nhận",
        });
        return;
      } else {
        // Kiểm tra xem User đã được khởi tạo và có giỏ hàng chưa
        if ($rootScope.User && $rootScope.User.carts) {
          // Thêm các sản phẩm từ giỏ hàng vào giỏ hàng của người dùng
          $rootScope.Carts.forEach((cartItem) => {
            cartItem.orderTime = new Date();
                $rootScope.User.carts.push(cartItem);
                $rootScope.SaveUserLogin();
      
          });

          // Xóa các sản phẩm trong giỏ hàng của người dùng sau khi thanh toán
          $rootScope.Carts = [];
          $scope.saveCartToLocalStorage();
          // Hiển thị thông báo thanh toán thành công
          Swal.fire({
            title: "Thanh toán",
            text: "Thanh toán thành công",
            icon: "success",
            confirmButtonText: "Xác nhận",
          }).then((result) => {
            if (result.isConfirmed) {
              // Tiến hành đồng bộ hóa người dùng và giỏ hàng với server
              $scope.syncUserAndCart();
              $location.path("/trangchu");
            }
          });
        } else {
          console.error(
            "User hoặc User.carts không được khởi tạo hoặc không có giá trị."
          );
        }
      }
    };

    // Hàm đồng bộ người dùng và giỏ hàng với server
    $scope.syncUserAndCart = function () {
      if ($rootScope.User && $rootScope.User.id) {
        $http
          .put(
            "http://localhost:3000/users/" + $rootScope.User.id,
            $rootScope.User
          )
          .then(function (response) {
            console.log("Dữ liệu người dùng đã được cập nhật thành công.");
            // Nếu cập nhật thành công, gửi yêu cầu PUT để cập nhật số lượng sản phẩm trên server
            $scope.updateProductQuantities();
          })
          .catch(function (error) {
            console.error("Lỗi khi cập nhật dữ liệu người dùng:", error);
          });
      }
    };

    // Hàm cập nhật số lượng sản phẩm trên server
    $scope.updateProductQuantities = function () {
      $rootScope.User.carts.forEach((cartItem) => {
        const product = $rootScope.Products.find((p) => p.id === cartItem.id);
        if (product) {
          product.SL -= cartItem.SL;
          $http
            .put("http://localhost:3000/products/" + product.id, product)
            .then(function () {
              console.log("Số lượng sản phẩm đã được cập nhật thành công.");
              // Sau khi cập nhật thành công, tải lại dữ liệu từ server và chuyển hướng người dùng đến trang chủ
              $http
                .get("http://localhost:3000/products")
                .then(function (response) {
                  $rootScope.Products = response.data;
                  $location.path("/trangchu");
                });
            })
            .catch(function (error) {
              console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
            });
        }
      });
    };

    window.onload = function () {
      $scope.getDataCartLocal();
      $scope.getDataProductctsp();
      $scope.updateCartItemCount();
      $scope.updateTotalPrice();
      $scope.$apply();
    };

    // Khởi tạo giỏ hàng và cập nhật lại giao diện khi controller được tải
    $scope.getDataCartLocal();
    $scope.getDataProductctsp();
    $scope.updateCartItemCount();
    $scope.updateTotalPrice();
  }
);

// app.controller(
//   "Carts",
//   function ($scope, $rootScope, $timeout, $location, $http) {
//     // Khởi tạo giỏ hàng từ Local Storage hoặc một mảng rỗng
//     $scope.getDataCartLocal = function () {
//       try {
//         $rootScope.Carts = JSON.parse(localStorage.getItem("cartItems")) || [];
//       } catch (e) {
//         console.error("Không lấy dữ liệu", e);
//         $rootScope.Carts = [];
//       }
//     };

//     // Hàm lưu giỏ hàng vào Local Storage
//     $scope.saveCartToLocalStorage = function () {
//       localStorage.setItem("cartItems", JSON.stringify($rootScope.Carts));
//     };

//     $scope.getDataProductctsp = function () {
//       try {
//         $rootScope.productctsp = JSON.parse(
//           localStorage.getItem("selectedProduct")
//         );
//       } catch (e) {
//         $rootScope.productctsp = {};
//       }
//     };
//     $scope.saveProductctspToLocalStorage = function () {
//       // Chuyển đối tượng productctsp thành chuỗi JSON
//       let productctspJSON = JSON.stringify($rootScope.productctsp);

//       // Lưu chuỗi JSON vào Local Storage với một key cụ thể, ví dụ: 'selectedProduct'
//       localStorage.setItem("selectedProduct", productctspJSON);
//     };

//     // Hàm cập nhật số lượng sản phẩm trong giỏ hàng
//     $scope.updateCartItemCount = function () {
//       var cartItemCountElement = document.getElementById("cartItemCount");
//       var cartItemCount = $rootScope.Carts.length; // Số lượng phần tử trong mảng carts

//       // Cập nhật số lượng hiển thị trong thẻ span
//       if (cartItemCountElement) {
//         cartItemCountElement.innerText = cartItemCount;
//       }
//     };

//     // Hàm tính tổng giá của giỏ hàng
//     $scope.updateTotalPrice = function () {
//       $scope.totalPrice = $rootScope.Carts.reduce(function (total, product) {
//         return total + product.Gia * product.SL;
//       }, 0);
//     };

//   // Hàm hiển thị thông báo và ẩn sau một khoảng thời gian
//   $scope.showThongBaoAndHide = function () {
//     let thongBaoElement = document.querySelector(".ThongBao");
//     thongBaoElement.classList.add("show");
//     $timeout(function () {
//       thongBaoElement.classList.remove("show");
//     }, 2000);
//   };

//   // Hàm lấy giỏ hàng của người dùng
//   $scope.getCart = function () {
//     if ($rootScope.User && $rootScope.User.id) {
//       $http.get("http://localhost:3000/users/" + $rootScope.User.id)
//         .then(function (response) {
//           $scope.user = response.data || { carts: [] };
//           $scope.updateCartItemCount();
//           $scope.updateTotalPrice();
//         })
//         .catch(function (error) {
//           console.error("Lỗi khi lấy thông tin giỏ hàng của user:", error);
//         });
//     }
//   };

//   // Hàm tính tổng số lượng sản phẩm trong giỏ hàng
//   $scope.updateCartItemCount = function () {
//     if ($scope.user && $scope.user.carts) {
//       $scope.cartItemCount = $scope.user.carts.reduce(function (total, cart) {
//         return total + cart.SL;
//       }, 0);
//       console.log("Cart item count updated:", $scope.cartItemCount);
//     } else {
//       $scope.cartItemCount = 0;
//     }
//   };

//   // Hàm thêm sản phẩm vào giỏ hàng của người dùng
//   $scope.AddCart = function (product) {
//     if (!$rootScope.User || Object.keys($rootScope.User).length === 0) {
//       $location.path("/DangNhap");
//     } else {
//       var existingProduct = $scope.user.carts.find(item => item.id === product.id);

//       if (existingProduct) {
//         existingProduct.SL += 1;
//       } else {
//         product.SL = 1;
//         $scope.user.carts.push(product);
//       }

//       $scope.updateCartItemCount();
//       $scope.updateTotalPrice();
//       $scope.showThongBaoAndHide();
//       // Chỉ đồng bộ giỏ hàng với server sau khi đã cập nhật giỏ hàng trên client-side
//       $scope.syncCart();
//     }
//   };

//   // Hàm đồng bộ giỏ hàng với server
//   $scope.syncCart = function () {
//     if ($rootScope.User && $rootScope.User.id) {
//       $http.put("http://localhost:3000/users/" + $rootScope.User.id, $scope.user)
//         .then(function (response) {
//           console.log("Cart synchronized successfully");
//         })
//         .catch(function (error) {
//           console.error("Lỗi khi đồng bộ giỏ hàng của user:", error);
//         });
//     }
//   };

//   // Hàm tính tổng tiền
//   $scope.updateTotalPrice = function () {
//     if ($scope.user && $scope.user.carts) {
//       $scope.totalPrice = $scope.user.carts.reduce(function (total, cart) {
//         return total + (cart.Gia * cart.SL);
//       }, 0);
//     } else {
//       $scope.totalPrice = 0;
//     }
//   };

//   // Hàm xóa sản phẩm khỏi giỏ hàng
//   $scope.RemoveProduct = function (index) {
//     $scope.user.carts.splice(index, 1);
//     $scope.updateCartItemCount();
//     $scope.updateTotalPrice();
//     $scope.syncCart();
//   };

//   // Hàm thanh toán sản phẩm
//   $scope.payProducts = function () {
//     // Logic thanh toán sản phẩm
//   };

//   // Gọi hàm lấy giỏ hàng khi khởi tạo controller
//   $scope.getCart();
// });

app.controller(
  "ProfileUser",
  function ($scope, $rootScope, $location, $route, $http) {
    // Hàm lấy dữ liệu từ Local Storage
    $rootScope.getDataFromLocalStorage = function (key, defaultValue) {
      try {
        const data = localStorage.getItem(key);
        if (data === null) return defaultValue;
        return JSON.parse(data) || defaultValue;
      } catch (e) {
        console.error(`Lỗi khi lấy dữ liệu cho key ${key}`, e);
        return defaultValue;
      }
    };

    // Hàm lưu dữ liệu vào Local Storage
    $rootScope.saveDataToLocalStorage = function (key, data) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.error(`Lỗi khi lưu dữ liệu cho key ${key}`, e);
      }
    };

    $scope.saveCartToLocalStorage = function () {
      $rootScope.saveDataToLocalStorage("cartItems", $rootScope.Carts);
    };

    // Lưu trạng thái đăng nhập vào Local Storage
    $rootScope.SaveUserLogin = function () {
      $rootScope.saveDataToLocalStorage("LoggedInUser", $rootScope.User);
    };
    // Lấy người dùng đã đăng nhập từ Local Storage
    $rootScope.getLoggedInUser = function () {
      $rootScope.User = $rootScope.getDataFromLocalStorage("LoggedInUser", {});
      console.log("User", $rootScope.User);
    };

    function getUsers() {
      $http.get("http://localhost:3000/users").then(
        function (response) {
          $scope.Users = response.data;
          console.log("Users", $scope.Users);
        },
        function (error) {
          console.error("Error fetching users:", error);
        }
      );
    }

    getUsers();
    $scope.DangKy = function (User) {
      $scope.Checknull = true;
      if (
        User.HoTen == null ||
        User.Email == null ||
        User.MatKhau == null ||
        User.confirmPassword == null ||
        User.SoDienThoai == null ||
        User.GioiTinh == null
      ) {
        return;
      }
      $scope.confirmPassword = true;
      if (User.MatKhau != User.confirmPassword) {
        return;
      }

      // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
      var existingUser = $scope.Users.find(function (existingUser) {
        return existingUser.Email === User.Email;
      });

      if (existingUser) {
        // Nếu email đã tồn tại, hiển thị thông báo lỗi
        Swal.fire({
          title: "Đăng ký",
          text: "Email đã tồn tại trong hệ thống",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      } else {
        // Nếu email không tồn tại, thêm người dùng mới vào cơ sở dữ liệu
        var maxId = 0;
        for (var i = 0; i < $scope.Users.length; i++) {
          if ($scope.Users[i].id > maxId) {
            maxId = $scope.Users[i].id;
          }
        }

        var newId = parseInt(maxId) + 1;

        var newUser = {
          id: newId+"",
          HoTen: User.HoTen,
          Email: User.Email,
          MatKhau: User.MatKhau,
          GioiTinh: User.GioiTinh,
          SoDienThoai: User.SoDienThoai,
          img: "",
          carts: [],
        };

        Swal.fire({
          title: "Đăng ký",
          text: "Đăng ký thành công",
          icon: "success",
          confirmButtonText: "Xác nhận",
        }).then((result) => {
          if (result.isConfirmed) {
            // Xử lý khi người dùng nhấn xác nhận
            $http.post("http://localhost:3000/users", newUser);
            $location.path("/DangNhap");
          }
        });
      } 
    };

    // Hàm upload ảnh và set giá trị cho User.Hinh
    $scope.uploadImage = function (element) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $scope.$apply(function () {
          $scope.User.img = e.target.result;
        });
      };
      reader.readAsDataURL(element.files[0]);
    };
    $scope.UpdateUser = function (User) {
      // Đoạn mã ở đây sẽ được sử dụng để cập nhật thông tin của người dùng đang đăng nhập
      // Ví dụ:
      $rootScope.User.HoTen = User.HoTen;
      $rootScope.User.Email = User.Email;
      $rootScope.User.MatKhau = User.MatKhau;
      $rootScope.User.GioiTinh = User.GioiTinh;
      $rootScope.User.SoDienThoai = User.SoDienThoai;
      $rootScope.User.NgaySinh = User.NgaySinh;
      $rootScope.User.img = User.img;
      $rootScope.User.carts = User.carts;
     
      Swal.fire({
        title: "thanh cong",
        text: "Cặp nhật  thành công",
        icon: "success",
        confirmButtonText: "Xác nhận",
      }).then((result) => {
        if (result.isConfirmed) {
          $rootScope.SaveUserLogin();
      // Sau khi cập nhật thông tin, có thể thực hiện các hành động khác ở đây
      $http.put("http://localhost:3000/users/"+ $rootScope.User.id, $rootScope.User)
      .then(function(response) {
          // Xử lý kết quả sau khi gửi thành công
          console.log('Dữ liệu đã được cập nhật thành công:', response.data);
      })
      .catch(function(error) {
          // Xử lý lỗi nếu gửi không thành công
          console.error('Lỗi khi gửi dữ liệu cập nhật:', error);
      });
      $rootScope.getLoggedInUser();
      
        }
      });
  };
  
    // Tìm người dùng để đăng nhập// Tìm người dùng để đăng nhập
    $scope.findUserLogin = function (LoginUser) {
      return $scope.Users.find(
        (user) =>
          user.Email === LoginUser.Email && user.MatKhau === LoginUser.MatKhau
      );
    };

    $scope.LoginUser = {
      Email: "",
      MatKhau: "",
    };
    // Hàm đăng nhập
    $scope.DangNhap = function (LoginUser) {
      $scope.Checknull = true;
      if (!LoginUser.Email || !LoginUser.MatKhau) {
        return;
      }

      let foundUser = $scope.findUserLogin(LoginUser);
      if (foundUser) {
        $rootScope.User = foundUser;

        Swal.fire({
          title: "Đăng nhập",
          text: "Đăng nhập thành công",
          icon: "success",
          confirmButtonText: "Xác nhận",
        }).then((result) => {
          if (result.isConfirmed) {
            document.getElementById("input-tendangnhap").value = null;
            document.getElementById("input-matkhau").value = null;
            $scope.SaveUserLogin();
            window.location.href = "../UI-UX/index.html";
          }
        });
        // Lưu trạng thái đăng nhập vào Local Storage
      } else {
        $rootScope.User = {};
        Swal.fire({
          title: "Đăng nhập",
          text: "Tên đăng nhập hoặc mật khẩu không đúng!",
          icon: "error",
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            document.getElementById("input-tendangnhap").value = null;
            document.getElementById("input-matkhau").value = null;
          }
        });
      }
    };

    $scope.showPassword = false;

    // Hàm chuyển đổi sự hiển thị của mật khẩu
    $scope.Changepass = function () {
      $scope.showPassword = !$scope.showPassword;
    };
    $scope.showPasswordLogin = false;

    // Hàm chuyển đổi sự hiển thị của mật khẩu
    $scope.ChangepassLogin = function () {
      $scope.showPasswordLogin = !$scope.showPasswordLogin;
    };

    $scope.isLoggedIn = function () {
      return $rootScope.User != null && Object.keys($rootScope.User).length > 0;
    };
    $scope.LogOut = function () {
      $rootScope.User = null;
      $rootScope.Carts = null;
      $rootScope.SaveUserLogin();
      $scope.saveCartToLocalStorage();
    };

    $rootScope.getLoggedInUser();

    
    
  });
app.filter("unique", function () {
  return function (ArrayUnique, keyname) {
    var output = [],
      keys = [];

    angular.forEach(ArrayUnique, function (item) {
      var key = item[keyname];
      if (keys.indexOf(key) === -1) {
        keys.push(key);
        output.push(item);
      }
    });
    return output;
  };
});
app.config(function ($routeProvider) {
  $routeProvider
    .when("/trangchu", {
      templateUrl: "trangchu.html",
      controller: "Carts",
    })
    .when("/GioiThieu", {
      templateUrl: "GioiThieu.html",
      controller: "Carts",
    })
    .when("/DanhMuc", {
      templateUrl: "DanhMuc.html",
      controller: "Carts",
    })
    .when("/ChitietSP/:id", {
      templateUrl: "ChitietSP.html",
      controller: "FillDataPD",
    })
    .when("/LienHe", {
      templateUrl: "LienHe.html",
      controller: "Carts",
    })
    .when("/GioHang", {
      templateUrl: "GioHang.html",
      controller: "Carts",
    })
    .when("/TinTuc", {
      templateUrl: "TinTuc.html",
      controller: "Carts",
    })
    .when("/ThongTinCaNhan", {
      templateUrl: "ThongTinCaNhan.html",
      controller: "Carts",
    })
    .when("/DangNhap", {
      templateUrl: "DangNhap.html",
      controller: "Carts",
    })
    .when("/Dangky", {
      templateUrl: "Dangky.html",
      controller: "Carts",
    })
    .otherwise({
      redirectTo: "/trangchu",
    });
});

app.controller(
  "FillDataPD",
  function ($scope, $rootScope, $route, $location, $http, $routeParams) {
    $rootScope.productctsp = {};
    $rootScope.ProDucts = [];
    $scope.begin = 0;
    $scope.itemsPerPage = 8; // Số sản phẩm mỗi trang
    $scope.currentPage = 1; // Trang hiện tại

    // Lấy dữ liệu từ file JSON
    $http.get("http://localhost:3000/products").then(function (response) {
      // $http.get('../db.json').then(function (response) {
      $rootScope.ProDucts = response.data;
      $scope.pageCount = Math.ceil(
        $rootScope.ProDucts.length / $scope.itemsPerPage
      );
      $scope.pages = Array.from({ length: $scope.pageCount }, (v, k) => k + 1);
      $scope.updatePage(); // Cập nhật lại trang sau khi tải dữ liệu

      $scope.detailPro = $scope.ProDucts.find(
        (item) => item.id == $routeParams.id
      );
      $scope.totalQuantity = $scope.detailPro.SL;
      $scope.detailPro.SL = 1;
    });

    // Hàm di chuyển về trang trước
    $scope.prev = function () {
      if ($scope.currentPage > 1) {
        $scope.currentPage--;
        $scope.updatePage();
      }
    };

    // Hàm di chuyển đến trang tiếp theo
    $scope.next = function () {
      if ($scope.currentPage < $scope.pageCount) {
        $scope.currentPage++;
        $scope.updatePage();
      }
    };

    // Hàm cập nhật trang hiện tại
    $scope.goToPage = function (page) {
      $scope.currentPage = page;
      $scope.updatePage();
    };

    // Hàm cập nhật vị trí bắt đầu cho sản phẩm hiển thị
    $scope.updatePage = function () {
      $scope.begin = ($scope.currentPage - 1) * $scope.itemsPerPage;
    };

    $scope.TenTour = "";

    $scope.filtersName = function (TenTour) {
      $scope.TenTour = TenTour;
      sessionStorage.setItem("TenTour", TenTour);
      $route.reload();
    };
    $scope.TenTour = sessionStorage.getItem("TenTour");

    //  $scope.xoaDau = function(str) {
    //   return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // }

    $scope.searchTerm;

    $scope.$watch("searchTerm", function (newVal, oldVal) {
      if (newVal !== oldVal) {
        $scope.begin = 0;
      }
    });
    $scope.getDataFromLocalStorage = function (key, defaultValue) {
      try {
        const data = localStorage.getItem(key);
        if (data === null) return defaultValue;
        return JSON.parse(data) || defaultValue;
      } catch (e) {
        console.error(`Lỗi khi lấy dữ liệu cho key ${key}`, e);
        return defaultValue;
      }
    };

    $scope.saveDataToLocalStorage = function (key, data) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.error(`Lỗi khi lưu dữ liệu cho key ${key}`, e);
      }
    };

    $scope.sortPrice;

    $scope.getPrice = function (sortPrice) {
      $scope.sortPrice = sortPrice;
      console.log(sortPrice);
    };

    // // Hàm sắp xếp theo giá tăng dần
    // $scope.sortAscending = function () {
    //   $rootScope.ProDucts.sort(
    //     (product1, product2) => product1.Gia - product2.Gia
    //   );
    //   console.log($rootScope.ProDucts, "tang  dan");
    // };

    // // Hàm sắp xếp theo giá giảm dần
    // $scope.sortDescending = function () {
    //   $scope.ProDucts.sort((product1, product2) => product2.Gia - product1.Gia);
    //   console.log($scope.ProDucts, "giam dan");
    // };
  }
);
