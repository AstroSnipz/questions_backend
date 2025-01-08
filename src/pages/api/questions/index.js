import db from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const {
      is_answered,
      tags,
      answers_count__gt,
      answers_count__lt,
      sort,
      page = 1,
    } = req.query;

    const limit = 10; // Number of items per page
    const offset = (page - 1) * limit; // Offset calculation for pagination

    let query = "SELECT * FROM questions WHERE true"; // Start with a query that always returns true
    const params = []; // Array to hold query parameters

    // Validate and parse the page parameter
    const pageNum = Math.max(1, parseInt(page, 10));

    // Filter by is_answered
    if (is_answered !== undefined) {
      params.push(is_answered === "true"); // Convert 'true'/'false' string to boolean
      query += ` AND is_answered = $${params.length}`;
    }

    // Filter by tags
    if (tags) {
      const tagsArray = tags.split(","); // Split the tags by commas
      if (tagsArray.length > 0) {
        params.push(tagsArray); // Add tags array to params
        query += ` AND tags @> $${params.length}`; // Use @> operator to match tags
      }
    }

    // Filter by answers_count__gt (greater than)
    if (answers_count__gt) {
      const gt = parseInt(answers_count__gt, 10);
      if (gt > 0) {
        params.push(gt); // Convert to number for proper comparison
        query += ` AND answer_count > $${params.length}`;
      }
    }

    // Filter by answers_count__lt (less than)
    if (answers_count__lt) {
      const lt = parseInt(answers_count__lt, 10);
      if (lt > 0) {
        params.push(lt); // Convert to number for proper comparison
        query += ` AND answer_count < $${params.length}`;
      }
    }

    // Sorting by score or created_at
    if (sort === "score") {
      query += " ORDER BY score DESC"; // Sort by score descending
    } else if (sort === "created_at") {
      query += " ORDER BY created_at DESC"; // Sort by created_at descending
    }

    // Apply pagination (limit and offset)
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    try {
      // Execute the query with parameters
      const { rows } = await db.query(query, params);
      res.status(200).json(rows); // Return the rows as the response
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: "Error fetching questions" }); // Return an error response
    }
  } else if (req.method === "POST") {
    const {
      stack_id,
      title,
      body,
      is_answered,
      tags,
      score,
      answer_count,
      created_at,
    } = req.body;

    // console.log(
    //   "Types:",
    //   typeof stack_id,
    //   typeof title,
    //   typeof body,
    //   typeof tags,
    //   typeof score,
    //   typeof answer_count,
    //   typeof created_at
    // );

    // Check for missing or invalid fields
    if (
      !stack_id ||
      typeof stack_id !== "number" ||
      !title ||
      !tags ||
      !Array.isArray(tags) ||
      tags.length === 0 ||
      score === undefined ||
      answer_count === undefined ||
      !created_at
    ) {
      return res
        .status(400)
        .json({ error: "Missing or invalid required fields" });
    }

    // Validate created_at
    const parsedDate = Date.parse(created_at);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ error: "Invalid created_at date format" });
    }

    try {
      // Insert question into the database with stack_id
      const newQuestion = await db.query(
        "INSERT INTO questions (stack_id, title, body, is_answered, tags, score, answer_count, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        [
          stack_id,
          title,
          body,
          is_answered,
          tags,
          score,
          answer_count,
          created_at,
        ]
      );
      res.status(201).json({
        message: "Question created successfully",
        question: newQuestion.rows[0],
      });
    } catch (error) {
      console.error("Error creating question:", error);

      // Handle unique constraint violation for stack_id
      if (error.code === "23505") {
        res.status(409).json({ error: "stack_id must be unique" });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
