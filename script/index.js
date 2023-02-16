let ham_menu = document.querySelector("#ham-menu>span");
let resume_btn = document.querySelectorAll(".resume");

function openNav() {
    if (ham_menu.innerText == "menu") {
        ham_menu.innerText = "close";
        document.getElementById("mySidenav").style.width = "100%";

    }
    else {
        document.getElementById("mySidenav").style.width = "0";
        ham_menu.innerText = "menu";
    }
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    ham_menu.innerText = "menu";
}

resume_btn.forEach((btn) => {
    btn.addEventListener("click", () => {
        window.open("https://drive.google.com/file/d/1nFhA1j00JGnspzHS3UP5_AgFS2Icgm-j/view?usp=share_link");
    })
})

GitHubCalendar(".calendar", "sumitujjwal", {
    responsive: true,
    global_stats: true,
    tooltips: true,
});

// project-image hover events
let projectImg = document.querySelectorAll(".project-img");
for (let i = 0; i < projectImg.length; i++) {
    projectImg[i].addEventListener("mouseover", function () {
        projectImg[i].firstElementChild.style.display = "none";
        projectImg[i].lastElementChild.style.display = "block";
        console.log("static_img.style.display")
    });

    projectImg[i].addEventListener("mouseout", function () {
        projectImg[i].firstElementChild.style.display = "block";
        projectImg[i].lastElementChild.style.display = "none";
        console.log("out")
    });
}


// fade-in effect while scrolling
document.addEventListener("scroll", function () {
    let pageTop = document.documentElement.scrollTop;
    let pageBottom = pageTop + window.innerHeight;
    let tags = document.querySelectorAll(".tag");

    for (let i = 0; i < tags.length; i++) {
        let tag = tags[i];
        if (tag.getBoundingClientRect().top < pageBottom) {
            tag.classList.add("visible");
        } else {
            tag.classList.remove("visible");
        }
    }
});

