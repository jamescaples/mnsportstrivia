$(document).ready(function(){
  
  // event listeners
  $("#remaining-time").hide();
  $("#start").on('click', trivia.startGame);
  $(document).on('click' , '.option', trivia.guessChecker);
  
})

var trivia = {
  // trivia properties
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  currentSet: 0,
  timer: 15,
  timerOn: false,
  timerId : '',
  // questions
  questions: {
    q1: 'Who is the all time rushing leader in Vikings history?',
    q2: 'Who has the most rebounds in Timberwolves history ?',
    q3: 'What year did the Gophers first win the Rose Bowl?',
    q4: 'What was the first year the Minnesota Twins won the world series?',
    q5: "Who has the most homeruns in Twins history?",
    q6: 'Who has the most receptions in vikings history?',
  },
  // Options
  options: {
    q1: ['Dalvin Cook', 'Robert Smith', 'Hershal Walker', 'Adrian Peterson'],
    q2: ['Karl Anthony Towns', 'Joe Smith', 'Kevin Garnett', 'Anthony Peeler'],
    q3: ['2002', '1984', '1964', '1994'],
    q4: ['1991', '2002', '2011', '1996'],
    q5: ['Kirby Puckett','Chuck Knoblock ','Herman Killebrew ','Paul Moliter'],
    q6: ['Randy Moss','Jake Reed','Cris Carter','Nate Burleson'],
  },
  //Answers
  answers: {
    q1: 'Adrian Peterson',
    q2: 'Kevin Garnett',
    q3: '1964',
    q4: '1991',
    q5: 'Herman Killebrew',
    q6: 'Cris Carter',
  },
  
  // initialize game
  startGame: function(){
    // restarting game results
    trivia.currentSet = 0;
    trivia.correct = 0;
    trivia.incorrect = 0;
    trivia.unanswered = 0;
    clearInterval(trivia.timerId);
    
    // show game section
    $('#game').show();
    
    //  empty last results
    $('#results').html('');
    
    // timer
    $('#timer').text(trivia.timer);
    
    // clear start button
    $('#start').hide();

    $('#remaining-time').show();
    
    // ask first question
    trivia.nextQuestion();
    
  },
  // Loop through and display questions and options 
  nextQuestion : function(){
    
    // set timer to 15 seconds each question
    trivia.timer = 15;
     $('#timer').removeClass('last-seconds');
    $('#timer').text(trivia.timer);
    
    // timer run time
    if(!trivia.timerOn){
      trivia.timerId = setInterval(trivia.timerRunning, 1000);
    }
    
    // gets questions indexes current questions
    var questionContent = Object.values(trivia.questions)[trivia.currentSet];
    $('#question').text(questionContent);
    
    // an array of all the user options for the current question
    var questionOptions = Object.values(trivia.options)[trivia.currentSet];
    
    // trivia guess options in the html
    $.each(questionOptions, function(index, key){
      $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
    })
    
  },
  // method to decrement counter and count unanswered if timer runs out
  timerRunning : function(){
    // if timer still has time left and there are still questions left to ask
    if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
      $('#timer').text(trivia.timer);
      trivia.timer--;
        if(trivia.timer === 4){
          $('#timer').addClass('last-seconds');
        }
    }
    // the time has run out and increment unanswered, run result
    else if(trivia.timer === -1){
      trivia.unanswered++;
      trivia.result = false;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Out of time! The answer was '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
    }
    // if all the questions have been shown end the game, show results
    else if(trivia.currentSet === Object.keys(trivia.questions).length){
      
      // adds results of game to the page
      $('#results')
        .html('<h3>Thank you for playing!</h3>'+
        '<p>Correct: '+ trivia.correct +'</p>'+
        '<p>Incorrect: '+ trivia.incorrect +'</p>'+
        '<p>Unaswered: '+ trivia.unanswered +'</p>'+
        '<p>Please play again!</p>');
      
      // hide game sction
      $('#game').hide();
      
      // show start button to begin a new game
      $('#start').show();
    }
    
  },
  // evaluate the option clicked
  guessChecker : function() {
  
    // ID for gameResult
    var resultId;
    
    //current question being asked (answer)
    var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
    
    // match answer of the current question, increment correct
    if($(this).text() === currentAnswer){
      // turn button green for correct
      $(this).addClass('btn-success').removeClass('btn-info');
      
      trivia.correct++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Correct Answer!</h3>');
    }
    // else the user picked the wrong option, increment incorrect
    else{
      // turn button clicked red for incorrect
      $(this).addClass('btn-danger').removeClass('btn-info');
      
      trivia.incorrect++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Better luck next time! '+ currentAnswer +'</h3>');
    }
    
  },
  // method to remove previous question results and options
  guessResult : function(){
    
    // increment to next question set
    trivia.currentSet++;
    
    // remove the options and results
    $('.option').remove();
    $('#results h3').remove();
    
    // begin next question
    trivia.nextQuestion();
     
  }

}