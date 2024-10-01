//imports express and axios
const express = require('express');
const axios = require('axios');
//sets the app as express
const app = express();

// Set EJS as the template engine
app.set('view engine', 'ejs');
//sets public as the static folder
app.use(express.static('public'));

//When nothing is added in front of / automatically renders index ejs
app.get('/', (req, res) => 
{
    res.render('index');
});

// Route for getting the joke
app.get('/get-joke', async (req, res) => 
{
    //in case the user does not pass their user name sets User as the default
    const name = req.query.name || 'User'; 
    //sets category to any if user doesnt select one
    const category = req.query.category || 'Any';
    
    //tries to get a joke for the user based on a given catagory
    try 
    {
        const response = await axios.get(`https://v2.jokeapi.dev/joke/${category}`, 
        {
            //bans these categories from the possible jokes
            params: 
            {
                blacklistFlags: 'nsfw,racist,sexist'
            }
        });

        //sets joke as response data
        let joke = response.data;
        let jokeText;

        //prints the joke in a single format or along with the delibery
        if (joke.type === 'single')
        {
            jokeText = joke.joke;
        } 
        else 
        {
            jokeText = `${joke.setup} - ${joke.delivery}`;
        }

        //if Chuck Norris is in the joke replaces it with the name of the user
        //not gonna lie getting this on a dark joke was actually funny
        jokeText = jokeText.replace(/Chuck Norris/gi, name);

        //renders the joke ejs passing the joke to be displayed
        res.render('joke', { joke: jokeText, name: name });
    } 
    //otherwise there was an error (to reprotmpt for another joke)
    catch (error) 
    {
        //sends the error message to the console and renders the error ejs
        console.error('Error fetching joke:', error.response ? error.response.data : error.message);
        res.render('error', { message: 'Unable to fetch the joke, please try again later!' });
    }
});

// Start the server
app.listen(8080, () => 
{
    console.log('Server running http://localhost:8080');
});

