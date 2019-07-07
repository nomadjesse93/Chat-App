(function() {
  const element = id => {
    return document.getElementById(id);
  };

  //Get elements

  let status = element("status");
  let messages = element("messages");
  let textarea = element("textarea");
  let username = element("username");
  let clearBtn = element("clear");

  //Set default status
  let statusDefault = status.textContent;

  const setStatus = s => {
    //Set status
    status.textContent = s;
    if (s !== statusDefault) {
      let delay = setTimeout(() => {
        setStatus(statusDefault);
      }, 4000);
    }
  };

  //Connect to socket.io

  let socket = io.connect("http://127.0.0.1:4000");

  //Check for connection
  if (socket !== undefined) {
    console.log("Connected to socket.io");

    socket.on("output", data => {
      console.log(data);
    });
  }
})();
