// const express = require('express')
// const app = express()


// //set the template engine ejs
// app.set('view engine', 'ejs')

// //middlewares
// app.use(express.static('public'))
// var path = require ('path');
// app.use(express.static(path.join(__dirname + '.../public')));

// //routes
// app.get('/', (req, res) => {
// 	res.render('index')
// })


// //Listen on port 3000
// server = app.listen(3000)

// const io=require("socket.io")(server)
// io.on('connection',(socket)=>{
// 	console.log('New User Connected')
// 	// console.log('New user connected')

// 	//default username
// 	socket.username = "Anonymous"

//     //listen on change_username
//     socket.on('change_username', (data,req,res) => {
//         socket.username = data.username
//         res.render('/p.ejs');
// 	})

// 	socket.on('new_message', (data) => {
//         //broadcast the new message
//         io.sockets.emit('new_message', {message : data.message, username : socket.username});
//     })

// })
const express = require('express')
const app = express()


//set the template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))


//routes
app.get('/', (req, res) => {
	res.render('index')
})

//Listen on port 3000
server = app.listen(3000)



//socket.io instantiation
const io = require("socket.io")(server)
var word="";
var guesses="";
var word_giver="";

//listen on every connection
io.on('connection', (socket) => {
	console.log('New user connected')

	//default username
	socket.username = "Anonymous"

    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username
    })

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        var string=data.message;
        if(string.slice(0,4).toLowerCase()==="word"){
        	if(word.length==0){
        		word=String(data.message).toUpperCase().slice(5).split(" ")[0];
        		guessed=word.slice(0,1);
        		var msg="A new word has been given"
        		io.sockets.emit('new_message', {message : word, username : "master"});
        		io.sockets.emit('guess',{guess : guessed})
        		word_giver=data.username;
        	}
        	else{
        		var msg="A Word is already in play";
        		io.sockets.emit('new_message', {message : msg, username : "master"});
        	}
        	// io.sockets.emit('new_message', {message : data.message, username : socket.username});	
        }
        // io.sockets.emit('new_message', {message : data.message, username : socket.username});
    })

    // //listen on typing
    // socket.on('typing', (data) => {
    // 	socket.broadcast.emit('typing', {username : socket.username})
    // })
})