const app = require("./app");
const { dbConnect } = require("./config/db");

// handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shut Down the server due to Unhandled Promise Rejection`);
  process.exit(1);
});
const port = process.env.PORT | 7000

//config db connect
dbConnect();

// start the server
const server = app.listen(port, () =>
{  console.log(`server start ${port}`)
  
}
);

// Unhandeld Promise Rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error:${err.message}`);
  console.log(`Shut Down the server due to Unhandeld Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
