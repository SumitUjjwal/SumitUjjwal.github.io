const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require("dotnev").config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome");
})

app.post("/messages", async(req, res) => {
    let {name, email, subject, message} = req.body;
    console.log(name, email, subject, message);
    // console.log(req.body);
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    transporter.sendMail({
        to: "sumitujjwal.work@gmail.com",
        // from: "sumit@scratch.com",
        subject: `${subject} - ${name}`,
        text: `from: ${email} \n message: ${message}`
    }).then(async () => {
        console.log("Email sent successfully");
        // res.cookie("otp", OTP);
        res.json({ "msg": "Email sent successfully", "okay": true });
        // next();
    })
        .catch((err) => {
            console.log("Error sending email: " + err);
            res.json({ "msg": "Error sending email: " + err.message });
        })
})

app.listen(2020, () => {
    console.log("Listening on port: 2020");
});