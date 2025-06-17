const express = require("express")
const Problem = require("../models/Problem")

const router = express.Router()

// GET all problems (for home page)
router.get("/problem", async (req, res) => {
  try {
    const problems = await Problem.find()
      .select("id title difficulty category order videoId likes dislikes")
      .sort({ order: 1 })

    res.status(200).json(problems)
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch problems",
      error: error.message,
    })
  }
})

// GET single problem by ID (for editor page)
router.get("/problem/:id", async (req, res) => {
  try {
    const problem = await Problem.findOne({ id: req.params.id })

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" })
    }

    res.status(200).json(problem)
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch problem",
      error: error.message,
    })
  }
})

// POST create new problem
router.post("/problem", async (req, res) => {
  try {
    const problem = new Problem(req.body)
    await problem.save()

    res.status(201).json({
      message: "Problem created successfully",
      problem,
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Problem with this ID or order already exists",
      })
    }

    res.status(400).json({
      message: "Failed to create problem",
      error: error.message,
    })
  }
})

// PUT update problem
router.put("/problem/:id", async (req, res) => {
  try {
    const problem = await Problem.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, runValidators: true })

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" })
    }

    res.status(200).json({
      message: "Problem updated successfully",
      problem,
    })
  } catch (error) {
    res.status(400).json({
      message: "Failed to update problem",
      error: error.message,
    })
  }
})

// DELETE problem
router.delete("/problem/:id", async (req, res) => {
  try {
    const problem = await Problem.findOneAndDelete({ id: req.params.id })

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" })
    }

    res.status(200).json({ message: "Problem deleted successfully" })
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete problem",
      error: error.message,
    })
  }
})

// POST like/dislike problem
router.post("/problem/:id/vote", async (req, res) => {
  try {
    const { type } = req.body // 'like' or 'dislike'
    const problem = await Problem.findOne({ id: req.params.id })

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" })
    }

    if (type === "like") {
      problem.likes += 1
    } else if (type === "dislike") {
      problem.dislikes += 1
    } else {
      return res.status(400).json({ message: "Invalid vote type" })
    }

    await problem.save()

    res.status(200).json({
      message: "Vote recorded successfully",
      likes: problem.likes,
      dislikes: problem.dislikes,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to record vote",
      error: error.message,
    })
  }
})

module.exports = router
