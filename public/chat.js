// $(function(){
// 	var socket=io.connect('http://localhost:3000')
// 	var message = $("#message")
// 	var username = $("#username")
// 	var send_message = $("#send_message")
// 	var send_username = $("#send_username")
// 	var chatroom = $("#chatroom")
// 	var feedback = $("#feedback")
// 	var login=$('#login_page')
// 	// var $usernameInput = $('#username');
// 	// var $currentInput = $usernameInput.focus();
// 	// var $loginPage=$("#login_page")
// 	// var $chatPage=$("##chatroom")
// 	// $(document).ready(function(){
// 	// });
// 	send_username.click(function(){
// 		socket.emit('change_username', {username : username.val()})
//  	// 	$loginPage.fadeOut();
//   //     	$chatPage.show();
//   //     	$loginPage.off('click');
// 		// $currentInput = $inputMessage.focus();
// 		// $loginPage.off('click');
// 	})

// 	send_message.click(function(){
// 		socket.emit('new_message', {message : message.val()})
// 	})
// 	socket.on("new_message", (data) => {
// 		feedback.html('');
// 		message.val('');
// 		chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
// 	})
// });
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
	})
	//Emit a username
	send_username.click(function(){
		socket.emit('change_username', {username : username.val()})
		$("#welcome_page").hide();
		$("#main_page").show();
	})
});