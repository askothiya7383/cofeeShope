let menuBtn = document.getElementById("menuBtn");
let navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", function () {
  navLinks.classList.toggle("show");
});

let menuItems = [
  {
    name: "Cappuccino",
    description: "Hot milk coffee with foam on top.",
    price: "$3.50",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400",
    type: "coffee",
  },
  {
    name: "Latte",
    description: "Soft and milky coffee, very smooth.",
    price: "$4.00",
    image: "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400",
    type: "coffee",
  },
  {
    name: "Espresso",
    description: "Small and strong black coffee.",
    price: "$2.50",
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400",
    type: "coffee",
  },
  {
    name: "Cold Coffee",
    description: "Chilled coffee with ice and milk.",
    price: "$4.50",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400",
    type: "coffee",
  },
  {
    name: "Chocolate Muffin",
    description: "Sweet muffin with chocolate chips.",
    price: "$2.00",
    image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400",
    type: "snacks",
  },
  {
    name: "Croissant",
    description: "Soft and flaky butter croissant.",
    price: "$2.50",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400",
    type: "snacks",
  },
];

let menuGrid = document.getElementById("menuGrid");
let filterButtons = document.querySelectorAll(".filter-btn");

function showMenu(type) {
  let filteredItems = menuItems.filter(function (item) {
    if (type === "all") {
      return true;
    }
    return item.type === type;
  });

  let cards = filteredItems.map(function (item) {
    return (
      '<article class="menu-card">' +
      '<img src="' +
      item.image +
      '" alt="' +
      item.name +
      '">' +
      "<h3>" +
      item.name +
      "</h3>" +
      "<p>" +
      item.description +
      "</p>" +
      '<div class="price-row">' +
      '<p class="price">' +
      item.price +
      "</p>" +
      '<button class="btn buy-btn" data-name="' +
      item.name +
      '" data-image="' +
      item.image +
      '" data-price="' +
      item.price +
      '">Order</button>' +
      "</div>" +
      "</article>"
    );
  });

  menuGrid.innerHTML = cards.join("");
}

showMenu("all");

let orderModal = document.getElementById("orderModal");
let orderImage = document.getElementById("orderImage");
let orderName = document.getElementById("orderName");
let orderPrice = document.getElementById("orderPrice");
let orderConfirmBtn = document.getElementById("orderConfirmBtn");
let orderPopup = document.getElementById("orderPopup");
let popupTimer = null;
let currentOrderName = "";   
 

menuGrid.addEventListener("click", function (event) {
  if (event.target.classList.contains("buy-btn")) {
    orderImage.src = event.target.getAttribute("data-image");
    orderName.textContent = event.target.getAttribute("data-name");
    orderPrice.textContent = event.target.getAttribute("data-price");
    currentOrderName = event.target.getAttribute("data-name"); // save for step 2
    orderModal.classList.add("show");
  }
});


orderConfirmBtn.addEventListener("click", function () {
  orderModal.classList.remove("show");

  orderPopup.textContent =
    currentOrderName + " ordered! Your order is placed. Thank you!";
  orderPopup.classList.add("show");

  clearTimeout(popupTimer);
  popupTimer = setTimeout(function () {
    orderPopup.classList.remove("show");
  }, 2500);
});

let orderCloseBtn = document.getElementById("orderCloseBtn");

orderCloseBtn.addEventListener("click", function () {
  orderModal.classList.remove("show");
});

orderModal.addEventListener("click", function (event) {
  if (event.target === orderModal) {
    orderModal.classList.remove("show");
  }
});

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    let type = button.getAttribute("data-type");
    showMenu(type);
  });
});

let photos = [
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
  "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800",
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
];

function makeSlider(options) {
  let track = document.getElementById(options.trackId);
  let box = document.getElementById(options.boxId);
  let prevBtn = document.getElementById(options.prevId);
  let nextBtn = document.getElementById(options.nextId);
  let items = options.items;
  let visibleNow = options.visible();
  let current = visibleNow;
  let busy = false;

  function build() {
    visibleNow = options.visible();
    let realHtml = items.map(options.makeCard);
    let startClones = items.slice(-visibleNow).map(options.makeCard);
    let endClones = items.slice(0, visibleNow).map(options.makeCard);
    track.innerHTML =
      startClones.join("") + realHtml.join("") + endClones.join("");

    current = visibleNow;
    track.style.transition = "none";
    track.style.transform =
      "translateX(-" + current * (100 / visibleNow) + "%)";
  }

  function move() {
    track.style.transition = "transform 0.5s ease";
    track.style.transform =
      "translateX(-" + current * (100 / visibleNow) + "%)";
  }

  function next() {
    if (busy) {
      return;
    }
    busy = true;
    current = current + 1;
    move();
    if (current === items.length + visibleNow) {
      setTimeout(function () {
        track.style.transition = "none";
        current = visibleNow;
        track.style.transform =
          "translateX(-" + current * (100 / visibleNow) + "%)";
        busy = false;
      }, 500);
    } else {
      setTimeout(function () {
        busy = false;
      }, 500);
    }
  }

  function prev() {
    if (busy) {
      return;
    }
    busy = true;
    current = current - 1;
    move();
    if (current < visibleNow) {
      setTimeout(function () {
        track.style.transition = "none";
        current = current + items.length;
        track.style.transform =
          "translateX(-" + current * (100 / visibleNow) + "%)";
        busy = false;
      }, 500);
    } else {
      setTimeout(function () {
        busy = false;
      }, 500);
    }
  }

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  let auto = setInterval(next, options.speed);
  box.addEventListener("mouseenter", function () {
    clearInterval(auto);
  });
  box.addEventListener("mouseleave", function () {
    clearInterval(auto);
    auto = setInterval(next, options.speed);
  });

  window.addEventListener("resize", function () {
    if (options.visible() !== visibleNow) {
      build();
    } else {
      track.style.transition = "none";
      track.style.transform =
        "translateX(-" + current * (100 / visibleNow) + "%)";
    }
  });

  build();
}

makeSlider({
  trackId: "carouselTrack",
  boxId: "carouselBox",
  prevId: "prevBtn",
  nextId: "nextBtn",
  items: photos,
  speed: 3000,
  visible: function () {
    return 1;
  },
  makeCard: function (link) {
    return '<img src="' + link + '" alt="Coffee shop photo">';
  },
});

let galleryPhotos = [
  {
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400",
    text: "Inside our coffee shop",
  },
  {
    image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400",
    text: "Barista making coffee",
  },
  {
    image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400",
    text: "Coffee cups on table",
  },
  {
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400",
    text: "People sitting in coffee shop",
  },
  {
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
    text: "Hot coffee cup",
  },
  {
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400",
    text: "Cold coffee glass",
  },
];

let galleryGrid = document.getElementById("galleryGrid");

let galleryHtml = galleryPhotos.map(function (photo) {
  return '<img src="' + photo.image + '" alt="' + photo.text + '">';
});
galleryGrid.innerHTML = galleryHtml.join("");

let galleryImages = document.querySelectorAll("#galleryGrid img");
let lightbox = document.getElementById("lightbox");
let lightboxImg = document.getElementById("lightboxImg");
let closeBtn = document.getElementById("closeBtn");
let lightPrev = document.getElementById("lightPrev");
let lightNext = document.getElementById("lightNext");
let currentLight = 0;

function showLight(n) {
  currentLight = n;
  lightboxImg.src = galleryPhotos[currentLight].image;
  lightbox.classList.add("show");
}

galleryImages.forEach(function (img, index) {
  img.addEventListener("click", function () {
    showLight(index);
  });
});

lightNext.addEventListener("click", function (event) {
  event.stopPropagation();
  let next = currentLight + 1;
  if (next >= galleryPhotos.length) {
    next = 0;
  }
  showLight(next);
});

lightPrev.addEventListener("click", function (event) {
  event.stopPropagation();
  let prev = currentLight - 1;
  if (prev < 0) {
    prev = galleryPhotos.length - 1;
  }
  showLight(prev);
});

closeBtn.addEventListener("click", function () {
  lightbox.classList.remove("show");
});

lightbox.addEventListener("click", function (event) {
  if (event.target === lightbox) {
    lightbox.classList.remove("show");
  }
});

let reviews = [
  {
    name: "Priya",
    text: "Best cappuccino in town. Very cozy place.",
    stars: "★★★★★",
  },
  {
    name: "Rahul",
    text: "I love the cold coffee and friendly staff.",
    stars: "★★★★★",
  },
  {
    name: "Sara",
    text: "Nice quiet place to study with good Wi-Fi.",
    stars: "★★★★☆",
  },
  {
    name: "Amit",
    text: "Croissants are fresh and tasty. Highly recommended.",
    stars: "★★★★★",
  },
  {
    name: "Neha",
    text: "Affordable prices and quick service. Loved it.",
    stars: "★★★★☆",
  },
  {
    name: "John",
    text: "Great muffins with my latte. Will visit again.",
    stars: "★★★★★",
  },
];

makeSlider({
  trackId: "reviewTrack",
  boxId: "reviewBox",
  prevId: "reviewPrev",
  nextId: "reviewNext",
  items: reviews,
  speed: 3000,
  visible: function () {
    let screenWidth = window.innerWidth;
    if (screenWidth <= 500) {
      return 1;
    }
    if (screenWidth <= 768) {
      return 2;
    }
    return 3;
  },
  makeCard: function (item) {
    return (
      '<div class="review-card">' +
      '<div class="review-inner">' +
      '<div class="review-stars">' +
      item.stars +
      "</div>" +
      '<p>"' +
      item.text +
      '"</p>' +
      "<h3>- " +
      item.name +
      "</h3>" +
      "</div>" +
      "</div>"
    );
  },
});

let contactForm = document.getElementById("contactForm");
let successMsg = document.getElementById("successMsg");

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  successMsg.style.display = "block";
  contactForm.reset();
});


// let faqItems = document.querySelectorAll(".faq-section details");

// faqItems.forEach(function (oneFaq) {
//   oneFaq.addEventListener("toggle", function () {
   
//     if (oneFaq.open) {
//       faqItems.forEach(function (otherFaq) {
        
//         if (otherFaq !== oneFaq) {
//           otherFaq.open = false;
//         }
//       });
//     }
//   });
// });

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(function (item) {
  const header = item.querySelector(".faq-header");
  const content = item.querySelector(".faq-content");

  header.addEventListener("click", function () {
    const isOpen = item.classList.contains("active");

    faqItems.forEach(function (el) {
      el.classList.remove("active");
      el.querySelector(".faq-content").style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add("active");
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});
