const { z } = require('zod');
const prisma = require('../config/db');

const categorySchema = z.object({
  name: z.string().min(2, 'Category name required'),
  description: z.string().min(2, 'Description required'),
  examples: z.array(z.string()).default([]),
  baseRate: z.number().int().min(1, 'Base rate must be positive'),
  unit: z.enum(['PER_ITEM', 'PER_KG']),
  hazardous: z.boolean().default(false),
  co2PerKg: z.number().default(0),
  active: z.boolean().default(true),
});

// GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.ewasteCategory.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    });

    res.json({
      success: true,
      data: categories,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/categories (ADMIN)
const createCategory = async (req, res, next) => {
  try {
    const validated = categorySchema.parse(req.body);

    const category = await prisma.ewasteCategory.create({
      data: validated,
    });

    res.status(201).json({
      success: true,
      data: category,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/categories/:id (ADMIN)
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validated = categorySchema.partial().parse(req.body);

    const category = await prisma.ewasteCategory.update({
      where: { id },
      data: validated,
    });

    res.json({
      success: true,
      data: category,
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
};
