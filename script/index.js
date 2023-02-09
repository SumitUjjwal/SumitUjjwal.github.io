let ham_menu = document.querySelector("#ham-menu>span");
let resume_btn = document.querySelector(".resume");

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

resume_btn.addEventListener("click", () => {
    window.open("https://drive.google.com/file/d/1nFhA1j00JGnspzHS3UP5_AgFS2Icgm-j/view?usp=share_link");
})

GitHubCalendar(".calendar", "sumitujjwal", {
    responsive: true,
    global_stats: true,
    tooltips: true,
  });
