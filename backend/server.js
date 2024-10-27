const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: "css_mp",
  port: 3306,
});
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

app.get("/", (request, response) => {
  response.send("Hello World!");
});

app.get("/api/getResult", (request, response) => {
  const { studentIdentifier } = request.query;
  const query = `
    select s.name,s.percentage,r.subject_name,r.theory_marks,r.practical_marks from student s  
    JOIN results r ON s.id = r.student_id 
    where enrollment_no = ${studentIdentifier} or seat_no = ${studentIdentifier}
    `;
  db.query(query, (err, results) => {
    if (err) {
      return response.status(500).send(err);
    }
    if (results == []) {
      return response.json({ success: false });
    }
    response.json(results);
  });
});

app.post("/api/addResult", (request, response) => {
  const studObject = request.body;
  console.log(studObject);
  const studentQuery = `
        INSERT INTO student (name, enrollment_no, seat_no) VALUES (?, ?, ?);
    `;
  const studentValues = [
    studObject.name,
    studObject.enrollment_no,
    studObject.seat_no,
  ];
  db.query(studentQuery, studentValues, (err, studentResult) => {
    if (err) {
      console.error("Error inserting student:", err);
      return response
        .status(500)
        .json({ success: false, error: "Error inserting student" });
    }
    const studentId = studentResult.insertId;
    const resultsQuery = `
            INSERT INTO results (student_id, subject_id, theory_marks, practical_marks, subject_name) VALUES (?, ?, ?, ?, ?);
        `;
    const subjects = ["ajp", "css", "est", "osy", "ste", "cpp", "itr"];
    let promises = subjects.map((subject) => {
      return new Promise((resolve, reject) => {
        let th =
          studObject[subject + "th"] == undefined
            ? null
            : studObject[subject + "th"];
        let pr =
          studObject[subject + "pr"] == undefined
            ? null
            : studObject[subject + "pr"];
        let values = [studentId, null, th, pr, subject.toUpperCase()];

        db.query(resultsQuery, values, (err, result) => {
          if (err) {
            console.error("Error inserting results:", err);
            reject("Error inserting results for " + subject);
          } else {
            resolve();
          }
        });
      });
    });
    Promise.all(promises)
      .then(() => {
        const addPercentageQuery = `UPDATE student s
JOIN (
    SELECT 
        student_id,
        (SUM(CASE 
            WHEN subject_name IN ('AJP', 'CSS', 'OSY', 'STE') THEN IFNULL(theory_marks, 0) + IFNULL(practical_marks, 0)
            WHEN subject_name = 'EST' THEN IFNULL(theory_marks, 0)
            WHEN subject_name = 'ITR' THEN IFNULL(practical_marks, 0)
            WHEN subject_name = 'CPP' THEN IFNULL(practical_marks, 0)
            ELSE 0
        END) / 900) * 100 AS percentage
    FROM 
        results
    GROUP BY 
        student_id
) r ON s.id = r.student_id
SET s.percentage = r.percentage;`;
        db.query(addPercentageQuery, (err, result) => {
          if (err) {
            console.error("Error updating percentage: ", err);
            return response
              .status(500)
              .json({ success: false, error: "Error updating percentage" });
          }

          return response.json({ success: true });
        });
      })
      .catch((error) => {
        console.error(error);
        return response.status(500).json({ success: false, error });
      });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
