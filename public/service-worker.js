self.addEventListener('push', function(event){
  console.log(event);
  event.waitUntil(
    fetch('/latest').then(function(data){
      console.log(data);
      return data.json()
    }).then(function(message){
      console.log(message);
      self.registration.showNotification(`From: ${message.from}`, {
        body: `Message: ${message.body}`
      })
    })
  )
}, false);

self.addEventListener('notificationclick', function(event){
  event.waitUntil(
    clients.openWindow('http://localhost:3000/')
  )
}, false);
