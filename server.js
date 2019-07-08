const mongo = require("mongodb").MongoClient;
const client = require("socket.io").listen(4000).sockets;

//Connect to mongodb

mongo.connect(
  "mongodb://127.0.0.1/chatapp",
  {useNewUrlParser:true},
  (err, data) => {
    if (err) {
      throw err;
    }

    console.log("mongodb connected");

    // Connect to socket.io
    let db = data.db();

    client.on("connection", socket => {
      let chat = db.collection("chats");

      // Create function to send status

      const sendStatus = s => {
        socket.emit("status", s);
      };
      //Get chats from mongo collection
      chat
        .find()
        .limit(100)
        .sort({ _id: 1 })
        .toArray((err, res) => {
          if (err) {
            throw err;
          }

          //Emit messages

          socket.emit("output", res);
        });

      //Handle input events
      socket.on("input", data => {
        let name = data.name;
        let message = data.message;

        //Check for name and message

        if (name == "" || message == "") {
          // Send error status
          sendStatus("Please enter a name and message");
        } else {
          //Insert message
          chat.insertOne({ name: name, message: message }, () => {
            client.emit("output", [data]);
            //Send status object
            sendStatus({
              message: "Message sent",
              clear: true
            });
          });
        }
      });

      //Handle clear
      socket.on("clear", db => {
        //Remove all chats from collection
        chat.deleteMany({}, () => {
          socket.emit("cleared");
        });
      });
    }); 
  }
);
