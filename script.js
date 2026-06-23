/* ===================================
   TRIUMPH PLAZA HOTEL LAUNDRY
   Premium JavaScript
=================================== */

window.addEventListener("load", () => {

    const loader = document.querySelector(".loader");

    setTimeout(() => {

        loader.style.opacity = "0";
        loader.style.visibility = "hidden";

    }, 1500);

});


// زر الطلب

const button = document.querySelector(".hero-content button");

button.addEventListener("mouseenter", () => {

    button.style.transform = "translateY(-6px) scale(1.05)";

});

button.addEventListener("mouseleave", () => {

    button.style.transform = "translateY(0) scale(1)";

});