import axios from "axios";
import db from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { data } = await axios.get(
      "https://api.stackexchange.com/2.3/questions",
      {
        params: {
          order: "desc",
          sort: "creation",
          site: "stackoverflow",
        },
      }
    );

    const sqlQuery = `
      INSERT INTO questions (stack_id, title, body, is_answered, tags, score, answer_count, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (stack_id) DO NOTHING
    `;

    for (const question of data.items) {
      // Log each question for debugging
      // console.log("Processing Question:", question);

      await db.query(sqlQuery, [
        question.question_id,
        question.title,
        question.body || "",
        question.is_answered,
        question.tags,
        question.score,
        question.answer_count,
        new Date(question.creation_date * 1000),
      ]);
    }

    res.status(201).json({ message: "Questions loaded successfully" });
  } catch (error) {
    console.error("Error loading questions:", error);
    res.status(500).json({ error: "Error loading questions" });
  }
}
