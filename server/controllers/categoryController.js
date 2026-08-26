import Category from '../models/Category.js';
import Complaint from '../models/Complaint.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });

    // Attach complaint counts to each category for analytics
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Complaint.countDocuments({ category: cat.name });
        return {
          ...cat.toObject(),
          complaintCount: count,
        };
      })
    );

    res.json({
      success: true,
      count: categoriesWithCount.length,
      categories: categoriesWithCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new complaint category
// @route   POST /api/categories
// @access  Private (Admin only)
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category name is required.',
      });
    }

    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name already exists.',
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description ? description.trim() : '',
      icon: icon || 'folder',
    });

    res.status(201).json({
      success: true,
      message: `Category '${category.name}' created successfully!`,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin only)
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, icon, isActive } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    const oldName = category.name;

    if (name) category.name = name.trim();
    if (description !== undefined) category.description = description.trim();
    if (icon) category.icon = icon;
    if (isActive !== undefined) category.isActive = isActive;

    const updatedCategory = await category.save();

    // If name changed, update corresponding complaints
    if (name && name.trim() !== oldName) {
      await Complaint.updateMany(
        { category: oldName },
        { category: name.trim() }
      );
    }

    res.json({
      success: true,
      message: 'Category updated successfully!',
      category: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin only)
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `Category '${category.name}' deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
