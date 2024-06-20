var swiper = new Swiper(".mySwiper", {
  slidesPerView: getSlidesPerView(),
  spaceBetween: 30,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  // Add the 'slidesPerView' property dynamically when the window is resized
  on: {
    resize: function () {
      this.params.slidesPerView = getSlidesPerView();
      this.update();
    },
  },
});

function getSlidesPerView() {
  if (window.innerWidth >= 576 && window.innerWidth < 768) {
    return 2;
  } else if (window.innerWidth >= 724) {
    return 3;
  } else {
    return 1;
  }
}

window.addEventListener("scroll", function () {
  var navbar1Height = document.querySelector(
    ".navbar:nth-child(1)"
  ).offsetHeight;
  var navbar2 = document.querySelector(".navbar:nth-child(1)");

  if (window.scrollY >= navbar1Height) {
    navbar2.classList.add("fix");
    navbar2.style.zIndex = 1111;
  } else {
    navbar2.classList.remove("fix");
  }
});

$(document).ready(function ($) {
  $(".customer-carousel").slick({
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    centerMode: true,
    pauseOnHover: false, // Thêm dòng này
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });
});
$(document).ready(function () {
  // Sự kiện click cho nút điều hướng trái
  $(".carousel-control-prev").click(function () {
    $("#customerCarousel").slick("slickPrev"); // Di chuyển carousel sang trái
  });

  // Sự kiện click cho nút điều hướng phải
  $(".carousel-control-next").click(function () {
    $("#customerCarousel").slick("slickNext"); // Di chuyển carousel sang phải
  });
});

AOS.init();
function changImg() {
  let imgProductTop = document.querySelector(".img-product-top");
  let imgThumbnail = document.querySelectorAll(".img-thumbnail");

  // Kiểm tra chiều rộng màn hình
  let isSmallScreen = window.innerWidth <= 756;

  imgThumbnail.forEach((thumbnail) => {
      if (isSmallScreen) {
          // Thêm sự kiện click cho màn hình nhỏ
          thumbnail.addEventListener("click", () => {
              imgProductTop.src = thumbnail.src;
              console.log(imgProductTop.src);
          });
      } else {
          // Thêm sự kiện mouseover và mouseout cho màn hình lớn
          thumbnail.addEventListener("mouseover", () => {
              imgProductTop.src = thumbnail.src;
              console.log(imgProductTop.src);
          });

      }
  });
}
// Gọi hàm khi trang tải xong
window.onload = changImg;


changImg();
document
  .getElementById("checkoutButton")
  .addEventListener("click", function () {
    // Hiển thị thông báo đợi xác minh
    const alert = document.getElementById("verificationAlert");
    alert.style.display = "block";

    setTimeout(function () {
      alert.style.display = "none";
      window.location.href = "../UI-UX/index.html"; // Thay đổi URL của trang chủ nếu cần thiết
    }, 3000);
  });

document.getElementById("uploadButton").addEventListener("click", function () {
  document.getElementById("formFile").click();
});
