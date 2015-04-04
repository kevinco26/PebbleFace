
var UI = require('ui');

var Wakeup = require('wakeup');
var ajax = require('ajax');
var Clock = require('clock');

var medicine;
var nextTime;
var hours;
var minutes;

var main = new UI.Card({
  title: 'Welcome to your medicine tracker',
  subtitle: '',
  body: 'Press the down button to schedule the next reminder'
});


 ajax(
  {
    url: 'http://Kevin-Cs-MacBook-Pro-4.local:3000/Kevin/medicine',
    type: 'json'
  },
  function(data, status, request) {
    medicine = data.contents.medicine;
    nextTime = Clock.weekday(data.contents.weekday,data.contents.hour,data.contents.minutes);
    hours = data.contents.hour;
    minutes = data.contents.minutes;
  },
  function(error, status, request) {
    console.log('The ajax request failed: ' + error);
  }
);

// wakeup get launch event
Wakeup.launch(function(e) {
  if (e.wakeup) {
   // Wakeup.cancel('all');
    var Vibe = require('ui/vibe');
    var Light = require('ui/light');
  
    Vibe.vibrate('double'); 
    Light.on('double');
    console.log('woke up!' + JSON.stringify(e));
    main.title('Medicine: ' + medicine);
    main.body('At: '+ hours + ':' + (minutes<10?'0'+minutes:minutes) + (hours<=11?'AM':'PM'));

  } else {
    ajax(
  {
    url: 'http://Kevin-Cs-MacBook-Pro-4.local:3000/Kevin/medicine',
    type: 'json'
  },
  function(data, status, request) {
    medicine = data.contents.medicine;
    nextTime = Clock.weekday(data.contents.weekday,data.contents.hour,data.contents.minutes);
    hours = data.contents.hour;
    minutes = data.contents.minutes;
  },
  function(error, status, request) {
    console.log('The ajax request failed: ' + error);
  }
);
     main.body('Next medicine: ' + medicine + 'At: '+ hours + ':' + (minutes<10?'0'+minutes:minutes) + (hours<=11?'AM':'PM'));
  }
});
 
 

main.on('click', 'down', function(e) {
  // schedule a wakeup, takes Date or seconds (not ms) and persists data
  Wakeup.cancel('all');

  Wakeup.schedule(
    {
      time: nextTime,
      data: { hello: 'world' },
    },
    function(e) {
      console.log('wakeup set! ' + JSON.stringify(e));
 
      if (e.failed) {
        main.body('Wakeup failed: ' + e.error + '!');
      } else {
        main.body('Wakeup set!\nExit or cancel.');
      }
    }
  );
});
 
main.show();
