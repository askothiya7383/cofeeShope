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
      '<div class="menu-card">' +
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
      "</div>"
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
    currentOrderName = event.target.getAttribute("data-name");
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

function makeSlider(options) {
  let box = options.box;
  let track = box.querySelector(options.trackSelector);
  let prevBtn = box.querySelector(options.prevSelector);
  let nextBtn = box.querySelector(options.nextSelector);
  let items = options.items;
  let current = 0;
  let busy = false;
  let timer;
  let visibleNow = options.visible();

  function build() {
    visibleNow = Math.min(options.visible(), items.length);
    track.innerHTML = items.map(options.makeCard).join("");

    let view = box.querySelector(options.viewSelector);
    let gap = parseFloat(getComputedStyle(track).gap) || 0;
    let itemWidth = (view.clientWidth - gap * (visibleNow - 1)) / visibleNow;

    Array.from(track.children).forEach(function (item) {
      item.style.flex = "0 0 " + itemWidth + "px";
    });

    current = 0;
    track.style.transition = "none";
    move();
    updateButtons();
  }

  function move() {
    let gap = parseFloat(getComputedStyle(track).gap) || 0;
    let firstItem = track.children[0];
    let itemWidth = firstItem ? firstItem.offsetWidth : 0;

    track.style.transform = "translateX(-" + current * (itemWidth + gap) + "px)";
  }

  function updateButtons() {
    let max = Math.max(0, items.length - visibleNow);
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= max;
    prevBtn.style.opacity = prevBtn.disabled ? 0.5 : 1;
    nextBtn.style.opacity = nextBtn.disabled ? 0.5 : 1;
  }

  function next() {
    let max = Math.max(0, items.length - visibleNow);
    if (busy || current >= max) return;

    busy = true;
    current = current + 1;
    track.style.transition = "transform 0.5s ease";
    move();
    updateButtons();

    setTimeout(function () {
      busy = false;
    }, 500);
  }

  function prev() {
    if (busy || current === 0) return;

    busy = true;
    current = current - 1;
    track.style.transition = "transform 0.5s ease";
    move();
    updateButtons();

    setTimeout(function () {
      busy = false;
    }, 500);
  }

  function startAutoSlide() {
    clearInterval(timer);
    timer = setInterval(function () {
      let max = Math.max(0, items.length - visibleNow);
      if (current >= max) {
        current = 0;
        track.style.transition = "none";
        move();
        updateButtons();
      } else {
        next();
      }
    }, options.speed);
  }

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  box.addEventListener("mouseenter", function () {
    clearInterval(timer);
  });

  box.addEventListener("mouseleave", startAutoSlide);

  window.addEventListener("resize", function () {
    let newVisible = Math.min(options.visible(), items.length);
    if (newVisible !== visibleNow) {
      build();
    } else {
      move();
    }
  });

  build();
  startAutoSlide();
}

let photos = [
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
  "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800",
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
  "https://images.unsplash.com/photo-1567880905822-56f8e06fe630?w=800"
];

let carouselBoxes = document.querySelectorAll(".carousel-box");

carouselBoxes.forEach(function (box) {
  makeSlider({
    box: box,
    trackSelector: ".carousel-track",
    viewSelector: ".carousel-view",
    prevSelector: ".carousel-prev",
    nextSelector: ".carousel-next",
    items: photos,
    speed: 3000,
    visible: function () {
      if (window.innerWidth <= 600) return 1;
      return 1;
    },
    makeCard: function (link) {
      return '<img src="' + link + '" alt="Coffee shop photo">';
    }
  });
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
  box: document.getElementById("reviewBox"),
  trackSelector: ".review-track",
  viewSelector: ".review-view",
  prevSelector: "#reviewPrev",
  nextSelector: "#reviewNext",
  items: reviews,
  speed: 3000,
  visible: function () {
    if (window.innerWidth <= 500) return 1;
    if (window.innerWidth <= 768) return 2;
    return 3;
  },
  makeCard: function (item) {
    return (
      '<div class="review-card">' +
      '<div class="review-inner">' +
      '<div class="review-stars">' + item.stars + "</div>" +
      '<p>"' + item.text + '"</p>' +
      "<h3>- " + item.name + "</h3>" +
      "</div>" +
      "</div>"
    );
  }
});

let contactForm = document.getElementById("contactForm");
let successMsg = document.getElementById("successMsg");

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  successMsg.style.display = "block";
  contactForm.reset();
});

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


