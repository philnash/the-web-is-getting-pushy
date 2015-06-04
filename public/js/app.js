var stream = new EventSource('/stream');
var list = $('#messages');

var serviceWorker = navigator.serviceWorker.register('/service-worker.js');

stream.addEventListener('message', function(event){
  var message = JSON.parse(event.data);

  var li = $(`<li class="new"><p><strong>From: </strong>${message.from}</p><p><strong>Message: </strong>${message.body}</p></li>`);
  list.prepend(li);

  // if (Notification.permission === 'granted'){
  //   new Notification(`From: ${message.from}`, {
  //     body: `Message: ${message.body}`
  //   });
  // }
}, false);

var button = $('button');

button.on('click', function(event){
  Notification.requestPermission();

  serviceWorker.then(function(registration){
    return registration.pushManager.subscribe();
  }).then(function(subscription){
    fetch(`/sub?subId=${subscription.subscriptionId}`);
  });
});
