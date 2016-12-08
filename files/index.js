document.addEventListener("DOMContentLoaded", function(event) {

  //Array buttons
  var buttons = Array.prototype.slice.call(document.getElementsByTagName('a'));
  // Create a client instance
  var hostname = "broker.hivemq.com";
  var port = 8000;
  var username = "";
  var password = "";
  var path = "/navidad"
  client = new Paho.MQTT.Client(hostname, port, "web_" + parseInt(Math.random() * 100, 10));

  // connect
  client.connect({
//    userName: username,
//    password: password,
    onSuccess: function() {
      console.log("onConnect");

      buttons.forEach(function(button) {
        button.addEventListener('click', function() {
          console.log(this.id)
          if (this.classList.contains('active')) {
            this.classList.remove('active');
            message = new Paho.MQTT.Message("off");
            message.destinationName = "infotec/"+this.id;
          } else {
            this.classList.add('active');
            message = new Paho.MQTT.Message("on");
            message.destinationName = "infotec/"+this.id;
          }
          client.send(message);
        })

      });
      buttons.forEach(function(button) {
        client.subscribe( "infotec/"+button.id);
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
    console.log(message.destinationName)
    button = document.getElementById(message.destinationName.substring(message.destinationName.indexOf("/")+1));
    if (button) {
      if (message.payloadString == "off") {
        button.classList.remove('active');
      } else if (message.payloadString == "on") {
        button.classList.add('active');
      }
    }
  }


});
