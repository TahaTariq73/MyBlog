const menuIcon = document.getElementById("menu-icon");
const responsiveNav = document.getElementById("responsive-nav");

menuIcon.addEventListener("click", () => {
    responsiveNavHeight = parseFloat(getComputedStyle(responsiveNav).getPropertyValue("height")) || 0;
    if (responsiveNavHeight == 0) {
        responsiveNav.style.height = "165px";
        responsiveNav.style.display = "block";
    } else {
        responsiveNav.style.height = "0px";
        responsiveNav.style.display = "none";
    }
})