// Create a Node.js application that is the beginning of a user management system. Your users are all saved in a "users.json" file, and you can currently do the following:
// - search for users
// - add new users to your users file.
// - get your starter file here: users.json

// required modules 
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const port = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// set view engine
app.set('view engine', 'ejs');

// setup path to 'views' folder
app.set(express.static(path.join(__dirname, '/views')));

// setup path to 'public' folder
app.use(express.static(path.join(__dirname + '/public')));

// required to make css work
app.use('/static', express.static('./static') )
app.use(express.static('./static/css'));


// render index page
app.get('/', (req, res) => {
    console.log('index rendered');
    res.render('index')});

// PART 0
// route 1: renders a page that displays all your users.
app.get('/users', (req, res) => {
    let parsedData = '';
  
    fs.readFile('./users.json', (error, data) => {
      if (error) throw error;
      parsedData = JSON.parse(data);
      console.log(parsedData);
      res.render('users.ejs', {
        users: parsedData
      })
    });
  });

// PART 1
// route 2: renders a page that displays a form which is your search bar.
app.get('/search', (req, res) => {
    console.log('search rendered')
    res.render('search', {
        title: "Search User"
    });
})

// Autocomplete
app.post('/search', (req, res) => {
    let input = req.body.user;
    let match = [];
  
    fs.readFile('users.json', 'utf8', (err, data) => {
      if (err) throw err;
  
      let userData = JSON.parse(data);
  
  
      userData.forEach((user) => {
        if ((input).length >= 2 && (user.firstname.toLowerCase()).includes(input) && (user.firstname.toLowerCase()).charAt(0) === input.charAt(0)) {
          match.push(user)
        } else if ((input).length >= 2 && (user.lastname.toLowerCase()).includes(input) && (user.lastname.toLowerCase()).charAt(0) === input.charAt(0)) {
          match.push(user)
        }
      });
      res.send(match);
    })
  });

// route 3: takes in the post request from your form, then displays matching users on a new page. Users should be matched based on whether either their first or last name contains the input string.
app.post('/results', (req, res) => {

    fs.readFile(__dirname + "/users.json", 'utf8', (error, data) => {
      if (error) {
        throw error
      };
  
      let content = JSON.parse(data);
  
      let fixString = req.body.userName.toLowerCase()
        .split(' ')
        .map((string) => string.charAt(0).toUpperCase() + string.slice(1))
        .join(' ');
  
      let matches = [];
  
      content.forEach((name) => {
        if (name.firstname.includes(fixString.trim()) || name.lastname.includes(fixString.trim()) || (`${name.firstname} ${name.lastname}`).includes(fixString.trim())) {
          matches.push(name);
        }
      });
  
      if (matches === undefined || matches.length === 0) {
        res.sendFile(__dirname + '/public/notFound.html'
      } else {
        res.render('results', {
          users: matches
        })
      }
    })
  });

// PART 2
// route 4: renders a page with three inputs on it (first name, last name, and email) that allows you to add new users to the users.json file.
app.get('/adduser', (req, res) => {
    console.log('adduser rendered')
    res.render('adduser')});

// route 5: takes in the post request from the 'create user' form, then adds the user to the users.json file.
app.post('/adduser', (req, res) => {
    fs.readFile('./users.json', 'utf8', (error, data) => {
        if (error) throw error;

        let parsedData = JSON.parse(data);
        let newUser = {
            firstname: req.body.firstName,
            lastname: req.body.lastName,
            email: req.body.email
        };

        parsedData.push(newUser);
        writeUsers(JSON.stringify(parsedData, null, 2));
    });

//writes in to JSON file
    function writeUsers(updatedUsersList) {
        fs.writeFile('users.json', updatedUsersList, (error, data) => {
            console.log('user added to json file');
            if (error) throw error;
        })
    }

// redirects to users after user is added
    res.redirect('/users')
});

app.listen(port, () => console.log(`Got ears on ${port}`));