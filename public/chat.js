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
	$("#main_page").hide();
	//Emit message
	send_message.click(function(){
		socket.emit('new_message', {message : message.val()})
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
	//Emit a username
	send_username.click(function(){
		$("#welcome_page").hide();
		$("#main_page").show();
		socket.emit('change_username', {username : username.val()})
	})
});