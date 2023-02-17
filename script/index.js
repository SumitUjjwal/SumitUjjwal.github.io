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

// darkmode
const appearance = localStorage.getItem("appearance");
const toggle = document.getElementById("appearance-toggle");
const toggle_img = document.getElementById("toggle_img");

if (appearance == "dark") {
    toggle_img.src = "../assets/toggle/bright_image.png";
    toggle_img.alt = "bright";
    darkmode();
} else {
    toggle_img.src = "../assets/toggle/dark_image.png";
    toggle_img.alt = "dark";
}

toggle.addEventListener("click", () => {
    if (appearance == "light" || !appearance) {
        localStorage.setItem("appearance", "dark");
        console.log(appearance + " darkmode");
        darkmode();
        location.reload();
    }
    else if (appearance == "dark") {
        localStorage.setItem("appearance", "light");
        console.log(appearance + " light mode");
        location.reload();
    }
    console.log("toggle")
})

function darkmode() {
    // backgrounds
    let backgrounds = document.querySelectorAll("body, #contact, #copyright, #projects, #home, #nav-menu, .sidenav");
    backgrounds.forEach(element => {
        element.style.backgroundColor = "#22272A";
    })

    // foregrounds
    // nav elments
    let navElem = document.querySelectorAll("nav a, nav button")
    navElem.forEach(element => {
        element.style.color = "#ffffff";
    });

    // ham icons
    let ham_icons = document.querySelectorAll("#ham-menu>span")
    ham_icons.forEach(element => {
        element.style.color = "#ffffff";
    });

    // section titles
    let section_titles = document.querySelectorAll(".section-title")
    section_titles.forEach(element => {
        element.style.color = "#ffffff";
    });

    // github stats
    let github_streak = document.getElementById("github-streak-stats");
    github_streak.src = "https://github-readme-streak-stats.herokuapp.com?user=SumitUjjwal&theme=dark&border_radius=6.5&date_format=M%20j%5B%2C%20Y%5D";


    let github_topLangs = document.getElementById("github-top-langs");
    github_topLangs.src = "https://github-readme-stats.vercel.app/api/top-langs/?username=SumitUjjwal&theme=dark";


    let github_stat = document.getElementById("github-stats-card");
    github_stat.src = "https://github-readme-stats.vercel.app/api?username=SumitUjjwal&count_private=true&theme=dark";


    // project cards
    let project_cards = document.querySelectorAll(".project-card")
    project_cards.forEach(element => {
        element.style.backgroundColor = "#000000";
    });

    // contacts box
    let contact_box = document.querySelectorAll(".contact-section>div")
    contact_box.forEach(element => {
        element.style.backgroundColor = "#000000";
    });

    // contacts form inputs
    let contact_input = document.querySelectorAll(".contact-form>form>input, .contact-form>form>textarea")
    contact_input.forEach(element => {
        element.style.backgroundColor = "#22272A";
    });
}
