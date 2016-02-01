var stream = new EventSource('/stream');
var list = $('#messages');

var serviceWorker = navigator.serviceWorker.register('/service-worker.js');

stream.addEventListener('message', (event) => {
  var message = JSON.parse(event.data);

  var li = $(`
    <li class="new">
      <p><strong>From</strong>: ${message.from}</p>
      <p><strong>Message:</strong>: ${message.body}</p>
    </li>
  `);

  list.prepend(li);

  // if (Notification.permission === 'granted') {
  //   new Notification(`From: ${message.from}`, {
  //     body: `Message: ${message.body}`
  //   })
  // }
});


$('button').on('click', (event) => {
  // Notification.requestPermission();

  serviceWorker.then((registration) => {
    return registration.pushManager.subscribe({userVisibleOnly: true})
  }).then((subscription) => {
    var endpoint = subscription.endpoint;
    fetch(`/sub?endpoint=${endpoint}`);
  });
});
