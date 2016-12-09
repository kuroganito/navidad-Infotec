document.addEventListener("DOMContentLoaded", function(event) {

  //Array buttons
  var buttons = Array.prototype.slice.call(document.getElementsByTagName('a'));


  var id = "584841a824ac158eeddbc4f6"
  var url = 'ws://cloudino.io/websocket/cdino?ID=' + id;

  WS.connect(url, function() {
    console.log("Conectado a cloudino")
    buttons.forEach(function(button) {
      button.addEventListener('click', function() {

        if (this.classList.contains('active')) {
          this.classList.remove('active');
          console.log(this.getAttribute('data-off'))
            WS.post('pin', this.getAttribute('data-off'));
        } else {
          this.classList.add('active');
            WS.post('pin', this.getAttribute('data-on'));

            console.log(this.getAttribute('data-on'))
        }
      })
    });
  });

  WS.onMessage = function (topic,message){
    console.log("Recive: " + topic)
    button = document.getElementById(topic);
    if (button) {
      if (message == "off") {
        button.classList.remove('active');
      } else if (message == "on") {
        button.classList.add('active');
      }
    }
  }

});
