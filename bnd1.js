import express from "express";
import connect from "./schemas/index.js";
import treaRouter from "./routes/treasures.router.js";
// treaRouter 라는 이름으로 가져옴

const app = express();
const PORT = 2000; // 내가 태어난 연도ㅎ

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = express.Router(); // 라우터 생성

router.get("/", (req, res) => {
  return res.json({ message: "Hello" });
});

app.use("/api", [router, treaRouter]); // 라우터 목록

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
