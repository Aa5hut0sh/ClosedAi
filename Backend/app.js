require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const { initSocket } = require("./socketio");

app.use(cors());
app.use(express.json());



const dbUrl = process.env.DBURL ;
main()
  .then(() => console.log("App is connected to Database"))
  .catch((err) => console.log(err));


async function main() {
  await mongoose.connect(dbUrl);
}

const mainRouter = require("./routes/index");

const server = app.listen(3000, () => console.log("Server running"));
initSocket(server);



app.use("/api/v1" , mainRouter);

app.listen(3000 , ()=>{
    console.log("App is Listening to Port : 3000");
})
