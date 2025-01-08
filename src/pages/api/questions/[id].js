import db from "@/lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid or missing question ID" });
    }

    try {
      const { rows } = await db.query("SELECT * FROM questions WHERE id = $1", [
        id,
      ]);

      if (rows.length === 0) {
        return res.status(404).json({ error: "Question not found" });
      }

      res.status(200).json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching question" });
    }
  } else if (req.method === "PUT") {
    // PUT /questions/:id - Update a specific question
    const { title, body, is_answered, tags, score, answer_count, created_at } =
      req.body;

    if (!title || !body || !tags || !score || !answer_count || !created_at) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const updatedQuestion = await db.query(
        "UPDATE questions SET title = $1, body = $2, is_answered = $3, tags = $4, score = $5, answer_count = $6, created_at = $7 WHERE id = $8 RETURNING *",
        [title, body, is_answered, tags, score, answer_count, created_at, id]
      );

      if (updatedQuestion.rows.length === 0) {
        return res.status(404).json({ error: "Question not found" });
      }

      res.json({
        message: "Question updated successfully",
        question: updatedQuestion.rows[0],
      });
    } catch (error) {
      console.error("Error updating question:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "DELETE") {
    // DELETE /questions/:id - Delete a specific question
    try {
      const deletedQuestion = await db.query(
        "DELETE FROM questions WHERE id = $1 RETURNING *",
        [id]
      );

      if (deletedQuestion.rows.length === 0) {
        return res.status(404).json({ error: "Question not found" });
      }

      res.json({
        message: "Question deleted successfully",
        question: deletedQuestion.rows[0],
      });
    } catch (error) {
      console.error("Error deleting question:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
