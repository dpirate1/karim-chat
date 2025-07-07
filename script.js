// Header Postion :
window.addEventListener("scroll", function () {
    const header = document.querySelector('header');

    if (window.scrollY >= 90) {

        header.classList.add("scrolled");
    } else {

        header.classList.remove("scrolled");
    }
});

window.onload = () => {
    homeButton.style.color = '#0eacde';
}

// whene i preess links or logo :

let homeButton = document.querySelector('.home');
let aboutButton = document.querySelector('.about');
let slkilsButton = document.querySelector('.slkils');
let contactButton = document.querySelector('.contact');

let allLinks = document.querySelectorAll('nav a');


let logo = document.querySelector('.website-logo');

// whene i preess logo :

logo.addEventListener('click', () => {
    window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
    });
    allLinks.forEach((ele) => {
        ele.style.color = '#fff'
    });

    homeButton.style.color = '#0eacde';
});

// whene i preess home :

homeButton.addEventListener('click', () => {
    window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
    });
    allLinks.forEach((ele) => {
        ele.style.color = '#fff'
    });

    homeButton.style.color = '#0eacde';
});

// whene i preess about :

aboutButton.addEventListener('click', () => {
    window.scrollTo({
        left: 0,
        top: 638,
        behavior: 'smooth'
    });
    allLinks.forEach((ele) => {
        ele.style.color = '#fff'
    });

    aboutButton.style.color = '#0eacde';
});

// whene i preess skils :

slkilsButton.addEventListener('click', () => {
    window.scrollTo({
        left: 0,
        top: 1400,
        behavior: 'smooth'
    });
    allLinks.forEach((ele) => {
        ele.style.color = '#fff'
    });

    slkilsButton.style.color = '#0eacde';
});

// whene i preess contact :

contactButton.addEventListener('click', () => {
    window.scrollTo({
        left: 0,
        top: 2063,
        behavior: 'smooth'
    });
    allLinks.forEach((ele) => {
        ele.style.color = '#fff'
    });

    contactButton.style.color = '#0eacde';
});

// srooll to up :

let upButton = document.querySelector('.up-btn');

upButton.addEventListener('click', () => {
    window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth'
    });
    allLinks.forEach((ele) => {
        ele.style.color = '#fff'
    });

    homeButton.style.color = '#0eacde';
});


// whene the scroll be at home :

window.addEventListener('scroll', () => {
    if (window.scrollY >= 0 && window.scrollY <= 10) {
        

        homeButton.style.color = '#0eacde';
    }else {
        homeButton.style.color = '#fff';
    }
});

// whene the scroll be at about :

window.addEventListener('scroll', () => {
    if (window.scrollY >= 530 && window.scrollY <= 1262) {
        
        aboutButton.style.color = '#0eacde';
    }else {
        aboutButton.style.color = '#fff';
    }
});

// whene the scroll be at skils :

window.addEventListener('scroll', () => {
    if (window.scrollY >= 1262 && window.scrollY <= 1990) {
        
        slkilsButton.style.color = '#0eacde';
    }else {
        slkilsButton.style.color = '#fff';
    }
});

// whene the scroll be at contact :

window.addEventListener('scroll', () => {
    if (window.scrollY >= 1990 && window.scrollY <= 2700) {
        
        contactButton.style.color = '#0eacde';
    }else {
        contactButton.style.color = '#fff';
    }
});