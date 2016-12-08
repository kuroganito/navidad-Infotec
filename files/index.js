document.addEventListener("DOMContentLoaded", function(event) {

  //Array buttons
  var buttons = Array.prototype.slice.call(document.getElementsByTagName('a'));
  // Create a client instance
  var hostname = "wss//m13.cloudmqtt.com";
  var port = 32837;
  var username = "huauzaup"
  var password = "7zO7RXczdyGa";
  var path = "/navidad"
  client = new Paho.MQTT.Client(hostname, port, path, "web_" + parseInt(Math.random() * 100, 10));

  // connect
  client.connect({
    userName: username,
    password: password,
    onSuccess: function() {
      console.log("onConnect");
      buttons.forEach(function(button) {
        client.subscribe(button.id);
      })
    },
    onFailure: function(e) {
      console.log("Fallo", e)
    }
  });

  client.onConnectionLost = function(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:" + responseObject.errorMessage);
    }
  }

  // called when a message arrives
  client.onMessageArrived = function(message) {
    console.log("onMessageArrived:" + message.payloadString);
    button = document.getElementById(message.destinationName);
    if (button) {
      if (message.payloadString == "off") {
        button.classList.remove('active');
      } else if (message.payloadString == "on") {
        button.classList.add('active');
      }
    }
  }

  buttons.forEach(function(button) {
    button.addEventListener('click', function() {
      console.log(this.id)
      if (this.classList.contains('active')) {
        this.classList.remove('active');
        message = new Paho.MQTT.Message("off");
        message.destinationName = this.id;
      } else {
        this.classList.add('active');
        message = new Paho.MQTT.Message("onn");
        message.destinationName = this.id;
      }
      client.send(message);

    })

  });
});
