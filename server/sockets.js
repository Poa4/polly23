
function sockets(io, socket, data) {
  socket.emit('init', data.getUILabels());
  
  socket.on('pageLoaded', function (lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('switchLanguage', function(lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('getGameInfo', function(pollId) { 
    let gameInfo = data.getGameInfo(pollId);
    socket.emit('pollCreated', gameInfo);   
  });

  socket.on('addQuestion', function(d) {
    data.addQuestion(d.pollId, {q: d.q, a: d.a});
    socket.emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('editQuestion', function(d) {
    data.editQuestion(d.pollId, d.index, {q: d.q, a: d.a});
    socket.emit('questionEdited', data.getAllQuestions(d.pollId));
  });

  socket.on('joinPoll', function(pollId) {
    socket.join(pollId);
    socket.emit('dataUpdate', data.getAnswers(pollId));
  });

  socket.on('runQuestion', function(d) {
    io.to(d.pollId).emit('newQuestion', data.getQuestion(d.pollId, d.questionNumber));
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('submitAnswer', function(d) {
    data.submitAnswer(d.pollId, d.answer);
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('submitUserName', function(d) {
    data.submitUserName(d.pollId, d.name, d.avatar);
    let participents = data.getParticipents(d.pollId);
    io.to(d.pollId).emit('participentsUpdate', participents);
  });
  socket.on('enterLobby', function(pollId){
    let participents = data.getParticipents(pollId);
    let gameOptions = data.getGameOptions(pollId);
    socket.emit('currentRoomStatus', participents, gameOptions);
  });

  socket.on('resetAll', () => {
    data = new Data();
    data.initializeData();
  });

  socket.on("GameOptionsChange", function(d){
    data.editGameOptions(d.pollId, d.data)
    io.to(d.pollId).emit("GOptionsChange", d.data)
  });
  
  socket.on("startGame", function(pollId){
    io.to(pollId).emit("startGame")
  });

  socket.on("createGameLobby", (d, callback)=> {
    if (data.polls[d.pollId]){
      return callback({successStatus: false, message: "There is already a lobby with this game code, generating a new one."})}
    data.createPoll(d.pollId)
    data.submitUserName(d.pollId,d.name,d.avatar)
    callback({successStatus: true, message: "You joined the lobby!"})
  });

  socket.on("sendQuestions", function(pollId,questionaire){
    data.addQuestion2(pollId ,questionaire);
    if (data.checkParticipantStatus(pollId)) {
      setTimeout(()  => {
        io.to(pollId).emit("startRound");}, 5000);}
  })
  socket.on("leaveLobby", function(pollId,username) {
    let participants = data.getParticipents(pollId);
    participants = participants.filter(participants => participants.name !== username);
    data.updateParticipants(pollId, participants)
    io.to(pollId).emit('participentsUpdate', participants);
  });

  socket.on("hostLeft", function(pollId) {
    io.to(pollId).emit("hostLeftTheLobby")
    data.removePoll(pollId)
  });

  socket.on("getTime", function(pollId) {
    const timeInfo = data.getTimeInfo(pollId);
    io.to(pollId).emit("sendTimeInfo", timeInfo)
  });


  socket.on("getRoundInfo", function(pollId) {
    const roundInfo = data.getRoundsInfo(pollId);
    const amountOfParticipants = data.getParticipents(pollId)
    io.to(pollId).emit("sendRoundInfo", roundInfo, amountOfParticipants.length)
  });

  socket.on("ReadyToGo", function(pollId){
    data.clearAnswers(pollId);
    if(data.waitForAllPlayers(pollId)){
      let question = data.getQuestion(pollId);
      let participent = data.getParticentInfo(pollId,question.username);
      question = Object.values(question);
      question = data.randomizeQuestion([question[0], question[1], question[2]]);
      question.push(participent);
      io.to(pollId).emit("startingRounds", question)
    }
  });

  socket.on("sendSelectedLie", function(pollId,userName,lie){
      data.addAnswer(pollId,userName,lie);
      const clientAnswers = data.getAnswers(pollId);
      io.to(pollId).emit("showParticipantAnswersDuringRound", clientAnswers)
      if(data.checkAnswerStatus(pollId)){
        const correctAnswer = data.getCorrectAnswer(pollId);
        io.to(pollId).emit("showAnswer", correctAnswer, clientAnswers);
        setTimeout(() => {
        if(data.checkGameOver(pollId)){
          io.to(pollId).emit("endGame");
        }
        else{
          io.to(pollId).emit("updateRound");
        }
        }, 3000)
      }
  } );

  socket.on("joinGame", function(d, callback) {
    if (!data.doesPollExist(d.pollId)) {
      return callback({successStatus: false, message: "This lobby does not exist."})

    }
    if (data.doesUserExistInLobby(d.pollId, d.name)) {
      return callback({successStatus: false, message: "There is already a player with this name."})
    }
    data.submitUserName(d.pollId, d.name, d.avatar);
    let participents = data.getParticipents(d.pollId);
    io.to(d.pollId).emit('participentsUpdate', participents);
    callback({successStatus: true, message: "You joined the lobby!"})
  });

  socket.on("GetScore", function(pollId){
    const participants = data.getParticipents(pollId);
    io.to(pollId).emit("sendScore", participants);
    setTimeout(() => {data.removePoll(pollId)}, 5000)
  })


}

export { sockets };
