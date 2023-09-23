// IMPORTS -
import mongoose from "mongoose";

const connectDatabase = () => {
  mongoose.connect(process.env.DATABASE_URL!).then((data) => {
    console.log(
      `Database has been connected with the server: ${data.connection.host}`
    );
  });
};

export default connectDatabase;
