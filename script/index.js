// const { application } = require("express");

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
    console.log("toggle");
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
    let contact_input = document.querySelectorAll(".contact-form>form>input, .contact-form>form>textarea, .contact-form>form>button")
    contact_input.forEach(element => {
        element.style.backgroundColor = "#22272A";
    });
}

// nodemailer
let form = document.querySelector("form");
// let url = "https://cute-puce-dragonfly-hose.cyclic.app";
let url = "http://localhost:2020";

form.addEventListener("submit", async(event) => {
    event.preventDefault();
    let contact_input_name = document.getElementById("contact-input-name").value;
    let contact_input_email = document.getElementById("contact-input-email").value;
    let contact_input_subject = document.getElementById("contact-input-subject").value;
    let contact_input_message = document.getElementById("contact-input-message").value;
    let contact_input_button = document.getElementById("contact-input-button");
    contact_input_button.innerHTML = `<i class="fa fa-spinner fa-spin"></i>Sending`;
    // console.log(contact_input_name, contact_input_email, contact_input_subject, contact_input_message);

    let obj = {
        name: contact_input_name,
        email: contact_input_email,
        subject: contact_input_subject,
        message: contact_input_message
    }

    console.log(obj);

    let request = await fetch(`${url}/messages`, {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(obj)
    })
    // contact_input_button.innerHTML = "<i class=fa fa-circle-o-notch fa-spin></i>Sending";
    let response = await request.json();
    console.log(response);
    if(response.okay){
        contact_input_button.innerHTML = "Send";
        alert(`Thanks ${obj.name} for your message! \n Will get back to you soon!`);
    }else{
        alert(`Error in sending message! \n Please contact me through Linkedin!`);
    }
})
