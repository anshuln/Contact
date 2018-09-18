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
var clue_people=[];
var min_people=3;
var curr_words=[];
var contact_flag=0;
var curr_index=0;
var contact_time;
new Date();
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
        		curr_guess=1;
        		var msg="A new word has been given by "+socket.username;
        		word_giver=socket.username;
        		io.sockets.emit('new_message', {message : msg, username : "master"});
        		io.sockets.emit('guess',{guess : word.slice(0,curr_guess)})
        		word_giver=data.username;
        		clues=[];
        		clue_number=[];
        		curr_words=[];
        		clue_correct=[];
        		curr_index=0;
        		contact_flag=0;
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
	        		clue_correct.push(0);
	        		var temp=[];
	        		clue_people.push(temp);
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
        if(string.slice(0,8).toLowerCase()==="contact "){
        	var index=parseInt(string.slice(8,9))-1;
        	if(clue_people[index].indexOf(socket.username) == -1){	//To ensure you contact only once on a clue
        		clue_people[index].push(socket.username);
        		clue_number[index]+=1;
        		//TODO- if word correct (Timer etc), if number more than contact, printing stuff,
        		var c=String(data.message).toUpperCase().slice(9);	//Check once whether indexing is correct
        		curr_guess=c.split(" ")[0];
        		if(curr_guess === curr_words[index]){
        			clue_correct[index]+=1;	
        		}
        		if(clue_number[index]==min_people){
        			curr_index=index;
        			contact_flag=1;
        			
        			contact_time=Date.now();
        			io.sockets.emit('contact',{clue:clues[index],player:word_giver,time:contact_time})
        		}

        	}
        }
        if(string.slice(0,1).toLowerCase()==="/"){	//Comments

        }
        else{			//Word giver guessing
        	if(data.username === word_giver){
        		if(Date.now()-contact_time < 11000){
        			if(data.message.toUpperCase().split(" ")[0] === clue_correct[curr_index]){
        				contact_flag=0;
        				io.sockets.emit('correct',{word:data.message,username:data.username});
        			}
        			else{
        				io.sockets.emit('incorrect',{word:data.message,username:data.username});	
        			}
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
if(Date.now()-contact_time > 11000 && contact_flag == 1 && clue_correct[curr_index] == clue_people[curr_index]){
		clues=[];
		clue_number=[];
		curr_words=[];
		clue_correct=[];
		curr_index=0;
		contact_flag=0;
		curr_guess+=1;
		io.sockets.emit('guess',{guess : word.slice(0,curr_guess)});
}
else if (Date.now()-contact_time > 11000 && contact_flag == 1 && clue_correct[curr_index] < clue_people[curr_index]){
		clues=[];
		clue_number=[];
		curr_words=[];
		clue_correct=[];
		curr_index=0;
		contact_flag=0;
		//TODO - kataane ka message
}