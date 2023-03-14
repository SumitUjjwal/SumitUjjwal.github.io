// const { application } = require("express");

// // LOADER
let loader = document.getElementById("window-loader");
let navigation = document.getElementById("nav-menu");
let progress_bar = document.getElementById("progress");
let main = document.querySelector("main");
window.addEventListener("load", () => {
    loader.style.opacity = "0";
    loader.style.transition = "opacity 1.8s ease-in-out, -webkit-opacity 1.8s ease-in-out";
    setTimeout(() => {
        navigation.style.display = "flex";
        setTimeout(() => {
            navigation.style.opacity = "1";
            navigation.style.transition = "opacity 3s ease-in-out, -webkit-opacity 3s ease-in-out";
        }, 10);
        main.style.display = "block";
        setTimeout(() => {
            main.style.opacity = "1";
            main.style.transition = "opacity 3s ease-in-out, -webkit-opacity 3s ease-in-out";
        }, 10);
        progress_bar.style.display = "block";
        setTimeout(() => {
            progress_bar.style.opacity = "1";
            progress_bar.style.transition = "opacity 3s ease-in-out, -webkit-opacity 3s ease-in-out";
        }, 10);
        loader.style.display = "none";
        console.log("Page and all assets have finished loading.");
    }, 1500);
});

// PROGRESS BAR
function progress() {
    let windowScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    let docHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
    );
    let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    let progress = (windowScrollTop / (docHeight - windowHeight)) * 100;
    const progress_bar = document.getElementById("progress");
    progress_bar.style.width = (progress + '%');
    progress_bar.style.backgroundColor = "#00FF00";
    // console.log(progress);
    if(progress > 11){
        document.getElementById("nav-menu").style.boxShadow = "rgba(0, 0, 0, 0.24) 0px 3px 8px";
    }
    else{
        document.getElementById("nav-menu").style.boxShadow = null;
    }
}

progress();

document.addEventListener('scroll', progress);


// SIDENAV
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

GitHubCalendar(".calendar", "SumitUjjwal", {
    responsive: true,
    global_stats: true,
    tooltips: true,
});

// project-image hover events
let projectImg = document.querySelectorAll(".project-img");
// for (let i = 0; i < projectImg.length; i++) {
//     projectImg[i].addEventListener("mouseover", function () {
//         projectImg[i].firstElementChild.style.display = "none";
//         projectImg[i].lastElementChild.style.display = "block";
//         console.log("static_img.style.display")
//     });

//     projectImg[i].addEventListener("mouseout", function () {
//         projectImg[i].firstElementChild.style.display = "block";
//         projectImg[i].lastElementChild.style.display = "none";
//         console.log("out")
//     });
// }

let projectcard = document.querySelectorAll(".project-card");
for (let i = 0; i < projectcard.length; i++) {
    projectcard[i].addEventListener("mouseover", () => {
        projectImg[i].firstElementChild.style.display = "none";
        projectImg[i].lastElementChild.style.display = "block";
    })
    projectcard[i].addEventListener("mouseout", () => {
        projectImg[i].firstElementChild.style.display = "block";
        projectImg[i].lastElementChild.style.display = "none";
    })
    // for (let i = 0; i < projectImg.length; i++) {
    //     projectImg[i].addEventListener("mouseover", function () {
    //         projectImg[i].firstElementChild.style.display = "none";
    //         projectImg[i].lastElementChild.style.display = "block";
    //         console.log("static_img.style.display")
    //     });

    //     projectImg[i].addEventListener("mouseout", function () {
    //         projectImg[i].firstElementChild.style.display = "block";
    //         projectImg[i].lastElementChild.style.display = "none";
    //         console.log("out")
    //     });
    // }
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
    // let navElem = document.querySelectorAll("nav a, nav button")
    // navElem.forEach(element => {
    //     element.style.color = "#ffffff";
    // });

    // loader
    let loader_img = document.querySelector("#window-loader>img");
    loader_img.setAttribute("src", "../assets/Infinity-loader-dark.gif");

    // ham icons
    let ham_icons = document.querySelectorAll("#ham-menu>span")
    ham_icons.forEach(element => {
        element.style.color = "#667C89";
    });

    // nav
    let nav = document.getElementById("nav-menu");
    nav.style.backgroundImage = "url(../assets/background/endless-constellation.svg)";

    // section titles
    let section_titles = document.querySelectorAll(".section-title")
    section_titles.forEach(element => {
        element.style.color = "#ffffff";
    });

    // home section
    let home = document.getElementById("home");
    home.style.backgroundColor = "#22272A";
    home.style.backgroundImage = "url(../assets/background/endless-constellation.svg)";

    // github stats
    let github_streak = document.getElementById("github-streak-stats");
    github_streak.src = "https://github-readme-streak-stats.herokuapp.com?user=SumitUjjwal&theme=dark&border_radius=6.5&date_format=M%20j%5B%2C%20Y%5D";


    let github_topLangs = document.getElementById("github-top-langs");
    github_topLangs.src = "https://github-readme-stats.vercel.app/api/top-langs/?username=sumitujjwal&layout=compact&theme=dark";


    let github_stat = document.getElementById("github-stats-card");
    github_stat.src = "https://github-readme-stats.vercel.app/api?username=SumitUjjwal&count_private=true&theme=dark";

    // skill cards
    let skill_cards = document.querySelectorAll(".skills-card");
    skill_cards.forEach(skill_card => {
        // box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
        let skill_text = skill_card.querySelector(".skills-card-name")
        skill_card.style.boxShadow = "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px";
        skill_card.style.backgroundColor = "#667C89";
        skill_text.style.color = "#fff"
        skill_card.addEventListener("mouseover", () => {
            skill_card.style.boxShadow = "#fff 0px 3px 8px";
            skill_card.style.backgroundColor = "#fff";
            skill_text.style.color = "#667C89"
        })
        skill_card.addEventListener("mouseout", () => {
            skill_card.style.backgroundColor = "#667C89";
            skill_text.style.color = "#fff"
            skill_card.style.boxShadow = "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px";
        })
    });

    // tools cards
    let tool_cards = document.querySelectorAll(".tools-card");
    tool_cards.forEach(tool_card => {
        tool_card.style.boxShadow = "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset";
        tool_card.addEventListener("mouseover", () => {
            tool_card.style.boxShadow = "#fff 0px 3px 8px";
        })
        tool_card.addEventListener("mouseout", () => {
            tool_card.style.boxShadow = "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset";
        })
        let skill_text = tool_card.querySelector(".tools-card-name")
        tool_card.style.boxShadow = "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px";
        tool_card.style.backgroundColor = "#667C89";
        skill_text.style.color = "#fff"
        tool_card.addEventListener("mouseover", () => {
            tool_card.style.boxShadow = "#fff 0px 3px 8px";
            tool_card.style.backgroundColor = "#fff";
            skill_text.style.color = "#667C89"
        })
        tool_card.addEventListener("mouseout", () => {
            tool_card.style.backgroundColor = "#667C89";
            skill_text.style.color = "#fff"
            tool_card.style.boxShadow = "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px";
        })
    });

    // project cards
    let project_cards = document.querySelectorAll(".project-card")
    project_cards.forEach(element => {
        element.style.backgroundColor = "#000000";
        element.addEventListener("mouseover", () => {
            // element.style.boxShadow = "#fff 0px 3px 8px";
            element.style.border = "1px solid #667C89";
        })
        element.addEventListener("mouseout", () => {
            element.style.boxShadow = "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px";
            element.style.border = null;
        })
    });

    // contact section
    let contact = document.getElementById("contact");
    contact.style.backgroundColor = "#22272A";
    contact.style.backgroundImage = "url(../assets/background/endless-constellation.svg)";

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

    // contact section
    let copyright = document.getElementById("copyright");
    copyright.style.backgroundColor = "#22272A";
    copyright.style.backgroundImage = "url(../assets/background/endless-constellation.svg)";

    // // fixed social icons
    // let github_fixed_icon = document.querySelector(".fixed-social-icons-github");
    // github_fixed_icon.addEventListener("mouseover", () => {
    //     github_fixed_icon.style.backgroundColor = "#ffffff";
    // })
}

// fixed social icons
window.addEventListener("resize", () => {
    let width = screen.width;
    let social_icons_box = document.getElementById("fixed-social-icons");
    if (width < 700) {
        social_icons_box.innerHTML = `
            <a target="_blank" href="https://github.com/SumitUjjwal"><i class="fa-brands fa-square-github fa-lg"></i></a>
            <a target="_blank" href="https://www.linkedin.com/in/sumitujjwal/"><i class="fa-brands fa-linkedin fa-lg"></i></a>
            <a target="_blank" href="https://wa.me/917070580782?text=Hello%20Sumit"><i class="fa-brands fa-square-whatsapp fa-lg"></i></a>
            <a target="_blank" href="tel:+918789223801"><i class="fa-solid fa-square-phone fa-lg"></i></a>
            <a target="_blank" href="mailto:sumitujjwal.work@gmail.com"><i class="fa-sharp fa-solid fa-square-envelope fa-lg"></i></a>
        `;
        social_icons_box.style.gap = "20px";
        social_icons_box.style.left = "5px";
    } else {
        social_icons_box.innerHTML = `
            <a target="_blank" href="https://github.com/SumitUjjwal"><i class="fa-brands fa-square-github fa-2xl"></i></a>
            <a target="_blank" href="https://www.linkedin.com/in/sumitujjwal/"><i class="fa-brands fa-linkedin fa-2xl"></i></a>
            <a target="_blank" href="https://wa.me/917070580782?text=Hello%20Sumit"><i class="fa-brands fa-square-whatsapp fa-2xl"></i></a>
            <a target="_blank" href="tel:+918789223801"><i class="fa-solid fa-square-phone fa-2xl"></i></a>
            <a target="_blank" href="mailto:sumitujjwal.work@gmail.com"><i class="fa-sharp fa-solid fa-square-envelope fa-2xl"></i></a>
        `;
        social_icons_box.style.gap = "50px";
        social_icons_box.style.left = "10px";
    }
})

let width = screen.width;
let social_icons_box = document.getElementById("fixed-social-icons");
if (width < 700) {
    social_icons_box.innerHTML = `
            <a target="_blank" href="https://github.com/SumitUjjwal"><i class="fa-brands fa-square-github fa-xl"></i></a>
            <a target="_blank" href="https://www.linkedin.com/in/sumitujjwal/"><i class="fa-brands fa-linkedin fa-xl"></i></a>
            <a target="_blank" href="https://wa.me/917070580782?text=Hello%20Sumit"><i class="fa-brands fa-square-whatsapp fa-xl"></i></a>
            <a target="_blank" href="tel:+918789223801"><i class="fa-solid fa-square-phone fa-xl"></i></a>
            <a target="_blank" href="mailto:sumitujjwal.work@gmail.com"><i class="fa-sharp fa-solid fa-square-envelope fa-xl"></i></a>
        `;
    social_icons_box.style.gap = "20px";
    social_icons_box.style.left = "5px";
} else {
    social_icons_box.innerHTML = `
            <a target="_blank" href="https://github.com/SumitUjjwal"><i class="fa-brands fa-square-github fa-2xl"></i></a>
            <a target="_blank" href="https://www.linkedin.com/in/sumitujjwal/"><i class="fa-brands fa-linkedin fa-2xl"></i></a>
            <a target="_blank" href="https://wa.me/917070580782?text=Hello%20Sumit"><i class="fa-brands fa-square-whatsapp fa-2xl"></i></a>
            <a target="_blank" href="tel:+918789223801"><i class="fa-solid fa-square-phone fa-2xl"></i></a>
            <a target="_blank" href="mailto:sumitujjwal.work@gmail.com"><i class="fa-sharp fa-solid fa-square-envelope fa-2xl"></i></a>
        `;
    social_icons_box.style.gap = "50px";
    social_icons_box.style.left = "10px";
}

// nodemailer
let form = document.querySelector("form");
let url = "https://cute-puce-dragonfly-hose.cyclic.app";
// let url = "http://localhost:2020";

form.addEventListener("submit", async (event) => {
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
    if (response.okay) {
        contact_input_button.innerHTML = "Send";
        alert(`Thanks ${obj.name} for your message! \n Will get back to you soon!`);
    } else {
        alert(`Error in sending message! \n Please contact me through Linkedin!`);
    }
})
