var CONFIG_KEY = 1;

var initialized = false;

function sendConfigToWatch() {
  var cleanOptions = localStorage.getItem(CONFIG_KEY);
  var parsedOptions = JSON.parse(cleanOptions);
  var transactionId = Pebble.sendAppMessage(
    { 'CONFIG_MSGKEY': parsedOptions.summary },
    function(e) {
      console.log('Successfully delivered message with transactionId='
        + e.data.transactionId);
    },
    function(e) {
      console.log('Unable to deliver message with transactionId='
        + e.data.transactionId
        + ' Error is: ' + e.error.message);
    }
  );
}

Pebble.addEventListener("ready", function() {
  console.log("ready called!");
  initialized = true;
});

Pebble.addEventListener("showConfiguration", function() {
  console.log("showing configuration");
  var cleanOptions = localStorage.getItem(CONFIG_KEY);
  var url = 'http://mindfull.terellium.com/config.html?' + encodeURIComponent(cleanOptions);
  console.log("url:" + url);
  Pebble.openURL(url);
});

Pebble.addEventListener("webviewclosed", function(e) {
  console.log("configuration closed");
  console.log("response: " + e.response);
  // webview closed
  //Using primitive JSON validity and non-empty check
  if (e.response.charAt(0) == "{" && e.response.slice(-1) == "}" && e.response.length > 5) {
    var options = JSON.parse(decodeURIComponent(e.response));
    var cleanOptions = JSON.stringify(options);
    console.log("Options = " + cleanOptions);
    localStorage.setItem(CONFIG_KEY, cleanOptions);
    sendConfigToWatch();
  } else {
    console.log("Cancelled");
  }
});

Pebble.addEventListener("appmessage", function(e) {
  console.log('Received message: ' + JSON.stringify(e.payload));
});
