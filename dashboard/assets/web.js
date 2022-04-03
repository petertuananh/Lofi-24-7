const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const getID = document.getElementById.bind(document)

function hideOverlay() {
    const overlay = $('.overlay')
    overlay.style.display = 'none'
}

function openNavbar() {
    const navbar = $('.navbar-list')
    navbar.style.tranform = 'translateX(0)'
}