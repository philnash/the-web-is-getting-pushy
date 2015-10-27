self.addEventListener('push', (event) => {
  event.waitUntil(
    fetch('/latest').then((data) => {
      return data.json()
    }).then((message) => {
      return self.registration.showNotification(`From: ${message.from}`, {
        body: `Message: ${message.body}`
      })
    })
  );
})

self.addEventListener('notificationclick', (event) => {
  event.waitUntil(
    clients.openWindow('http://localhost:3000/')
  )
})
