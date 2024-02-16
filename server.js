const express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');

let PORT = 3000;
const { userIdToColor: userColor } = require("./colors.js");
const app = express();

app.use(express.static("./styles"));
app.use('/images', express.static('images'));
app.use(cookieParser());
app.use(session({secret: "Spacemen die alone..."}));
app.use(express.urlencoded({ extended: true }));

const fs = require("fs")

app.engine("europa", (filePath, options, callback) =>{
    fs.readFile(filePath, (err, content) =>{
        if (err) return callback(err);

        const rendered = content
        .toString()
        .replaceAll("#title#", `${options.title}`)
        .replace('#sub-title#', `${options.subTitle}`)
        .replace('#content#', `${options.content}`)
        .replace('#link4#', `${options.contactlink}`)
        .replace("#link1#", `${options.homelink}`);
        return callback(null, rendered);
    });
});

app.set("pages", "./views");
app.set("view engine", "europa");

app.get('/', (req, res)=>{
    let savedMessage = "";
    if(req.session.page_views){
        req.session.page_views++;
        savedMessage = "You visited this page " + req.session.page_views + " times";
     } else {
        req.session.page_views = 1;
        savedMessage = "Welcome to this page for the first time!";
     }
    const options = {
        homelink:"/",
        contactlink:"/contact",
        title: "This is the Home Page",
        subTitle: "Welcome to the wonderful world of Europa",
        content: `Europa is a place that holds unilimited possibilities. Please read more about it below. <br /><br />
        ${savedMessage}`
    };
    res.render("index", options);
})

app.get('/contact', (req, res) => {
    const options = {
        homelink: "/",
        contactlink: "/contact",
        title: "This is the Contact Page",
        subTitle: "Welcome to the wonderful form of Europa",
        content: `
        <form action="/submit-form" method="POST">
            <label for="name">Name (up to 20 characters):</label>
            <input type="text" id="name" name="name" required minlength="1" maxlength="20" size="20" />
            <input type="submit" value="Submit" />
        </form>
    
        `
    };
    res.render("contact", options);
});
app.post('/submit-form', (req, res) => {
    const userId = req.body.name;
    console.log("Form data received:", req.body);

    res.send(`Success! Received submission for userId: ${userId}`);
});
app.get('/:userId/color', (req, res)=>{
    let useridvar = req.params.userId;
    let useridColor = userColor(useridvar);
    const options = {
        homelink:"/",
        contactlink:"/contact",
        title: "This is the Contact Page",
        subTitle: "Welcome to the wonderful form of Europa",
        content: `This is a custom color based on user id: ${useridvar}
        <br /><div style="background-color: ${useridColor}; width: 100px; height: 100px;">${useridColor}</div>
        `
    };
    res.render("index", options);
})
app.get('/download', (req, res)=>{
    const options = {
        homelink:"/",
        contactlink:"/contact",
        title: "This is the Contact Page",
        subTitle: "Welcome to the wonderful downloads of Europa",
        content: `Click the image to download <br /><br />
        <a href="/download/moose"><img src="/images/moosebg.png" alt="Downloadable image" width="500"></a>`   
    };
    res.render("index", options);
})
app.get('/download/moose', (req, res) => {
    res.download('./images/moosebg.png');
});
app.get('/about', (req, res)=>{
    res.send('About Route')
})
app.get('/contact', (req, res)=>{
    res.send('Contact Route')
})
app.get('/user/:userID', (req, res)=>{
    res.send(req.params.userID)
})

app.listen(PORT, ()=>{
    console.log(`Server listening on port ${PORT}`);
})