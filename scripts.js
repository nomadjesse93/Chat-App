(function () {
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

  //Handle Output
  let socket = io.connect("http://127.0.0.1:4000");

  //Check for connection
  if (socket !== undefined) {
    console.log("Connected to socket.io");

    socket.on("output", data => {
      //   console.log(data);
      if (data.length) {
        for (let x = 0; x < data.length; x++) {
          //Build out message div
          var message = document.createElement("div");

          message.setAttribute("class", "chat-message");

          message.textContent = data[x].name + ": " + data[x].message;

          messages.appendChild(message);
          messages.insertBefore(message, messages.firstChild);
        }
      }
    });
    //Get status from Server
    socket.on("status", data => {
      //get message status
      setStatus(typeof data === "object" ? data.message : data);

      //if status is clear, clear text
      if (data.clear) {
        textarea.value = "";
      }
    });

    //Handle input

    textarea.addEventListener("keydown", event => {
      if (event.which === 13 && event.shiftKey === false) {
        //Emit to server input
        socket.emit("input", {
          name: username.value,
          message: textarea.value
        });
        event.preventDefault();
      }
    });

    //Handle Chat clear
    clearBtn.addEventListener("click", function () {
      socket.emit("clear");
    });

    //Clear Message

    socket.on("cleared", function () {
      return messages.textContent = "";
    });
  }
})();