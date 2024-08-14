import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect("mongodb://localhost:27017/", {
      dbName: "Mob-Mart",
    })
    .then((c) => console.log(`DB connceted to ${c.connection.host}`))
    .catch((e) => console.log(e));
};
