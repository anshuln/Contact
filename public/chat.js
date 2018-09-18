$(function(){
   	//make connection
	var socket = io.connect('http://localhost:3000')

	//buttons and inputs
	var message = $("#message")
	var username = $("#username")
	var send_message = $("#send_message")
	var send_username = $("#send_username")
	var chatroom = $("#chatroom")
	var feedback = $("#feedback")
	var guess = $("#till_now")
	var clues = $("#clues")
	var contact_flag=0;
	var word_giver='';
	var self_player='';
	var timer=$("#timer")
	new Date();
	$("#main_page").hide();
	//Emit message
	send_message.click(function(){
		if(contact_flag == 0){
			socket.emit('new_message', {message : message.val()});
		}
		else if(self_player=word_giver){
			socket.emit('new_message', {message : message.val()});
		}
	})

	//Listen on new_message
	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');
		chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")

	})
	socket.on("guess", (data) => {
		document.getElementById("till_now").innerHTML=data.guess;
		document.getElementById("clues").innerHTML="";
	})
	socket.on("clue", (data) => {
		clues.append("<li>"+data.clue+" : "+String(data.number)+"</li>");
	})	
	socket.on("contact", (data) => {
		contact_flag=1;
		word_giver=data.player;
		chatroom.append("<p class='message'> CONTACT" "</p>")
		//Write a function for timer
		document.getElementById("clues").innerHTML="";
		clues.append(data.clue);	//Beautify this later
		contact_time=data.time;

	})
	socket.on("correct", (data) => {
		chatroom.append("<p class='message'>" + data.username + "Correctly guessed " + data.word + "</p>")
		contact_flag=0;

	})
	socket.on("incorrect", (data) => {
		chatroom.append("<p class='message'>" + data.username + "inorrectly guessed " + data.word + "</p>")

	})
	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');
		chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")

	})
	if(contact_flag==1){
		document.getElementById("clues").innerHTML=(Date.now()-contact_time)/1000;
	}
	//Emit a username
	send_username.click(function(){
		$("#welcome_page").hide();
		$("#main_page").show();
		self_player=username.val();
		socket.emit('change_username', {username : username.val()})
	})
});