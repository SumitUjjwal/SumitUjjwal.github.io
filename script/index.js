// const Typed = require("typed")

// // auto type section
// let typed = new Typed('.auto-typed',{
//     strings: ['Sumit,'],
//     typeSpeed: 220,
//     backSpeed: 220,
//     loop: true,
// });

let ham_menu = document.querySelector("#ham-menu>span");


function openNav() {
    if(ham_menu.innerText == "menu"){
        ham_menu.innerText = "close";
        document.getElementById("mySidenav").style.width = "100%";
        
    }
    else{
        document.getElementById("mySidenav").style.width = "0";
        ham_menu.innerText = "menu";
    }
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    ham_menu.innerText = "menu";
}
