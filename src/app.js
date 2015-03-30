/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Wakeup = require('wakeup');
var Clock = require('clock');
var ajax = require('ajax');
var nextTime;

var i = 0;

var main = new UI.Card({
  title: '',
  subtitle: '',
  body: '',
  
});

ajax(
  {
    url: 'http://client-75-102-97-252.mobility-up.psu.edu:3000/Kevin/medicine',
    type: 'json'
  },
  function(data, status, request) {
    nextTime = Clock.weekday(data.contents[3].weekday, data.contents[1].hour,data.contents[2].minutes);
    
    Wakeup.schedule(
    {
        time: nextTime,
    });
    main.title('Medicine: ' + data.contents[0].medicine);
    main.subtitle('At: '+ data.contents[1].hour + ':' + data.contents[2].minutes + (data.contents[1].hour<=12?'AM':'PM'));
    main.body('On:' +  data.contents[3].weekday);
     
  },
  function(error, status, request) {
    console.log('The ajax request failed: ' + error);
  }
);

Wakeup.launch(function(e) {
    
      ajax(
  {
    url: 'http://client-75-102-97-252.mobility-up.psu.edu:3000/Kevin/medicine',
    type: 'json'
  },
  function(data, status, request) {
    if (e.wakeup) 
    {
      i = i+4;
      console.log('Woke up to ' + e.id + '! data: ' + JSON.stringify(e.data));
      var Vibe = require('ui/vibe');
      var Light = require('ui/light');
  
      Vibe.vibrate('double'); 
      Light.on('double');
      
      main.title('Medicine: ' + data.contents[i].medicine);
      main.subtitle('At: '+ data.contents[1+i].hour + ':' + data.contents[2+i].minutes + (data.contents[1+i].hour<=12?'AM':'PM'));
      main.body('On:' +  data.contents[3+i].weekday);
      
      nextTime = Clock.weekday(data.contents[3+i].weekday, data.contents[1+i].hour,data.contents[2+i].minutes);
      
      Wakeup.schedule(
      {
          time: nextTime,
      });
      
    }
    else
    {
      main.title('');
      main.subtitle('DO NOT TAKE PILL YET');
      main.body('');
    } 
},
  function(error, status, request) {
    console.log('The ajax request failed: ' + error);
  }
);   
});

main.show();

// if clicks select, starts schedule for next available pill for that same day. If none, display No more pills for today.


