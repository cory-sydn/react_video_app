import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from './routes/users.js'
import commentRoutes from './routes/comments.js'
import videoRoutes from './routes/videos.js'
import auth from './routes/authentication.js'
import cookieParser from "cookie-parser";
import path from "path"
import { fileURLToPath } from 'url';

const app = express();
dotenv.config();

app.use(cookieParser())

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', "https://cory-youtube.herokuapp.com");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
	res.header("Access-Control-Expose-Headers", "Set-Cookie",)
  next();
});

const connect = () => {
	mongoose
		.connect(process.env.MONGODB)
		.then(() => {
			console.log("connected to db");
		})
		.catch((err) => {
			throw err;
		});
};

app.use(express.json())

app.use("/api/auth", auth)
app.use("/api/users", userRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/videos", videoRoutes)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "/client/build")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build", "index.html"));
});

app.use((err, req, res, next) => {
	const status = err.status || 500;
	const message = err.message || "Something went wrong";
	return res.status(status).json({
		 succes: false,
		 status,
		 message,
	})
})

app.listen(process.env.PORT || 8800, () => {
	connect()
	console.log("Server Connected!");
});
