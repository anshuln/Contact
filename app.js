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
var curr_guess="";
var word_giver="";
var clues=[];
var clue_number=[];
var clue_correct=[];
var curr_words=[];
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
        if(string.slice(0,5).toLowerCase()==="word "){		//TODO - Word Validation
        	if(word.length==0){
        		word=String(data.message).toUpperCase().slice(5).split(" ")[0];
        		curr_guess=word.slice(0,1);
        		var msg="A new word has been given by "+socket.username;
        		io.sockets.emit('new_message', {message : msg, username : "master"});
        		io.sockets.emit('guess',{guess : curr_guess})
        		word_giver=data.username;
        		clues=[];
        		clue_number=[];
        		clue_correct=[];
        	}
        	else{
        		var msg="A Word is already in play";
        		io.sockets.emit('new_message', {message : msg, username : "master"});
        	}
        	// io.sockets.emit('new_message', {message : data.message, username : socket.username});	
        }
        if(string.slice(0,5).toLowerCase()==="clue "){
        	if(word.length==0){			//TODO check if word is in clue or not.
        		var msg="No Words currently, "+data.username;
        		io.sockets.emit('new_message', {message : msg, username : "master"});
        	}
        	else{
        		var c=String(data.message).toUpperCase().slice(5);
        		var pos = c.indexOf("WORD");	//TODO if no word
        		var cop=c;
        		var curr_word=cop.slice(pos+5);
        		c=c.substring(0,pos);
        		if(curr_word.indexOf(curr_guess)==0){
        			//TODO Search whether already in list of clues
	        		clues.push(c);
	        		clue_number.push(0);
	        		curr_words.push(curr_word);
	        		var msg="CLUE: "+c;
	        		io.sockets.emit('new_message', {message : msg, username : socket.username});
	        		io.sockets.emit('clue',{clue : c,number : 0})
        		}
        		else{
        			//TODO - Private Messaging
        		}
        	}
        }
        
        // io.sockets.emit('new_message', {message : data.message, username : socket.username});
    })

    // //listen on typing
    // socket.on('typing', (data) => {
    // 	socket.broadcast.emit('typing', {username : socket.username})
    // })
})