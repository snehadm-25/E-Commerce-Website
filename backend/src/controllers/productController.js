import Product from '../models/Product.js';

export const getProducts = async (req, res, next) => {
    try {
        const pageSize = 8;
        const page = Number(req.query.pageNumber) || 1;

        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const category = req.query.category
            ? { category: { $in: req.query.category.split(',') } }
            : {};

        const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
        const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : Number.MAX_SAFE_INTEGER;
        const priceFilter = { price: { $gte: minPrice, $lte: maxPrice } };

        const count = await Product.countDocuments({ ...keyword, ...category, ...priceFilter });

        let sortOption = {};
        if (req.query.sort === 'priceLow') sortOption = { price: 1 };
        else if (req.query.sort === 'priceHigh') sortOption = { price: -1 };
        else if (req.query.sort === 'rating') sortOption = { rating: -1 };
        else sortOption = { createdAt: -1 };

        const products = await Product.find({ ...keyword, ...category, ...priceFilter })
            .sort(sortOption)
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({
            success: true,
            data: products,
            page,
            pages: Math.ceil(count / pageSize),
            count
        });
    } catch (error) {
        next(error);
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json({ success: true, data: product });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        // If it's an invalid ObjectID, findById throws CastError which is passed to express error handler
        next(error);
    }
};

export const createProduct = async (req, res, next) => {
    try {
        const product = new Product(req.body);
        const createdProduct = await product.save();
        res.status(201).json({ success: true, data: createdProduct });
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            Object.assign(product, req.body);
            const updatedProduct = await product.save();
            res.json({ success: true, data: updatedProduct });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ success: true, message: 'Product removed' });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        next(error);
    }
};

export const createProductReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

            await product.save();
            res.status(201).json({ success: true, message: 'Review added' });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        next(error);
    }
};
