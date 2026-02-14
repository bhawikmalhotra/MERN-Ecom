import express from "express";
import connectDB from "./database/db.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import 'dotenv/config'

const app = express();
app.use(express.json());
app.use(cors());
app.set("json spaces", 2)
app.use('/api/user', userRoutes)

app.listen(process.env.PORT || 3000, () => {
    connectDB();
    console.log(`Server is running on port ${process.env.PORT}`);
});
