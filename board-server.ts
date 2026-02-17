// 라이브러리 로드
import express from "express";
import cors from "cors";
import oracledb, { Connection } from "oracledb";
import axios from "axios";

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}));
app.use(express.json());
app.listen(3355, () => {
  console.log("Server is running: http://localhost:3355");
})

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

async function getConnection() {
  return await oracledb.getConnection({
    username: "hr",
    password: "happy",
    connectionString: "211.238.142.22:1521/xe"
  });
}
app.get('/board/list-node', async (req, res) => {
  let conn: Connection | undefined;
  const page = parseInt(req.query.page as string) || 1;
  const rowSize = 10;
  const start = (page - 1) * rowSize;
  try {
    conn = await getConnection();
    const sql = `SELECT no, subject, name, TO_CHAR(regdate, 'YYYY-MM-DD') AS dbday, hit 
                 FROM board_3
                 ORDER BY no DESC
                 OFFSET ${start} ROWS FETCH NEXT ${rowSize} ROWS ONLY`;
    const totalSql = `SELECT CEIL(COUNT(*) / ${rowSize}) AS totalpage
                      FROM board_3`;
    const result = await conn.execute(sql);
    const total = await conn.execute(totalSql);
    res.json({
      curpage: page,
      totalpage: (total.rows as {TOTALPAGE: number}[])[0].TOTALPAGE,
      list: result.rows
    });
  } catch (e) {
    console.error(e);
  } finally {
    conn?.close();
  }
});

app.post('/board/insert-node', async (req, res) => {
  let conn: Connection | undefined;
  const { name, subject, content, pwd } = req.body;

  try {
    conn = await getConnection();
    const sql = `INSERT INTO board_3(no, name, subject, content, pwd) 
                 VALUES(BR3_NO_SEQ.nextval, :name, :subject, :content, :pwd)`;
    await conn.execute(
      sql,
      { name, subject, content, pwd },
      { autoCommit: true }
    );
    res.json({ msg: 'yes' })
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'no' })
  } finally {
    conn?.close();
  }
});

app.get('/board/detail-node', async (req, res) => {
  let conn: Connection | undefined;
  const no = parseInt(req.query.no as string);

  try {
    conn = await getConnection();
    await conn.execute(
      `UPDATE board_3 SET hit = hit + 1 WHERE no = :no`,
      { no },
      { autoCommit: true }
    );
    const result = await conn.execute(
      `SELECT no, subject, TO_CHAR(content) AS content, name, hit, TO_CHAR(regdate, 'YYYY-MM-DD') AS dbday
           FROM board_3
           WHERE no = :no`,
      { no },
      { autoCommit: true }
    );
    res.json(result.rows?.[0])
  } catch (error) {
    console.error(error);
  } finally {
    conn?.close();
  }
});

app.get('/board/update-node', async (req, res) => {
  let conn: Connection | undefined;
  const no = parseInt(req.query.no as string);

  try {
    // 오라클 연동
    conn = await getConnection();
    const sql = 'SELECT no, name, subject, TO_CHAR(content) AS content FROM board_3 WHERE no = :no';
    const result = await conn.execute(
      sql,
      { no },
      { autoCommit: true }
    );
    res.json(result.rows?.[0]);
  } catch (e) {
    console.error(e);
  } finally {
    conn?.close();
  }
});

interface CheckResult {
  CNT: number;
}

app.put('/board/update-ok-node', async (req, res) => {
  let conn: Connection | undefined;
  const { no, name, subject, content, pwd } = req.body;

  try {
    conn = await getConnection();
    const checkSql = 'SELECT COUNT(*) AS cnt FROM board_3 WHERE no = :no AND pwd = :pwd';
    const check = await conn.execute<CheckResult>(
      checkSql,
      { no, pwd },
      { autoCommit: true }
    );
    const count = check.rows?.[0]?.CNT ?? 0;
    if (count === 0) {
      // console.log('비밀번호가 틀립니다: ' + count);
      res.json({ msg: 'no'});
    }
    const updateSql = 'UPDATE board_3 SET name = :name, subject = :subject, content = :content WHERE no = :no';
    await conn.execute(
      updateSql,
      { name, subject, content, no },
      { autoCommit: true }
    );
    res.json({ msg: 'yes' });
  } catch (e) {
    console.error(e);
  } finally {
    conn?.close();
  }
});

app.delete('/board/delete-node/:no', async (req, res) => {
  let conn: Connection | undefined;
  const no = parseInt(req.params.no as string);
  const { pwd } = req.body;

  try {
    conn = await getConnection();
    const checkSql = 'SELECT COUNT(*) AS cnt FROM board_3 WHERE no = :no AND pwd = :pwd';
    const check = await conn.execute<CheckResult>(
      checkSql,
      { no, pwd },
      { autoCommit: true }
    );
    const count = check.rows?.[0]?.CNT ?? 0;
    if (count === 0) {
      // console.log('비밀번호가 틀립니다: ' + count);
      res.json({ msg: 'no'});
    }

    const deleteSql = 'DELETE FROM board_3 WHERE no = :no';
    await conn.execute(
      deleteSql,
      { no },
      { autoCommit: true }
    );
    res.json({ msg: 'yes' });
  } catch (e) {
    console.error(e);
  } finally {
    conn?.close();
  }
});

// 뉴스 검색
const client_id = 'ckK1gpvsAauXWt7hUIay';
const client_secret = 'lRWQnnOoVn';
app.get('/news/find-node', async (req, res) => {
  const query = req.query.query as string;
  if (!query) {
    return res.status(400).send({ message: '검색어가 없습니다' });
  }
  const api_url = 'https://openapi.naver.com/v1/search/news.json?display=50&query=' + encodeURI(query); // JSON 결과

  await axios.create({
    headers: {
      'X-Naver-Client-Id': client_id,
      'X-Naver-Client-Secret': client_secret
    }
  }).get(api_url).then((response) => {
    res.json(response.data);
  }).catch((error) => {
    res.status(error).end();
  });
});