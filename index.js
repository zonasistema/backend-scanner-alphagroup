import server from "./src/App.js";
import dotenv from "dotenv";

dotenv.config();
const { PORT } = process.env;

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
