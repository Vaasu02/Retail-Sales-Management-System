const SalesModel = require('../models/salesModel');

exports.getSales = (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;


        const sort = {
            field: req.query.sortBy || 'date',
            order: req.query.order || 'DESC'
        };


        const toArray = (val) => val ? (Array.isArray(val) ? val : val.split(',')) : null;

        const filters = {
            search: req.query.q,
            region: toArray(req.query.region),
            category: toArray(req.query.category),
            gender: toArray(req.query.gender),
            tags: toArray(req.query.tags),
            payment_method: toArray(req.query.payment_method),
            age_min: req.query.age_min,
            age_max: req.query.age_max,
            date_from: req.query.date_from,
            date_to: req.query.date_to
        };

        const result = SalesModel.findAll(filters, page, limit, sort);


        if (req.query.includeMeta) {
            const options = SalesModel.getFilterOptions();
            console.log('DEBUG: Filter Options sent:', JSON.stringify({ ...options, tagsCount: options.tags ? options.tags.length : 0 }));
            result.meta.options = options;
        }

        res.json(result);

    } catch (err) {
        console.error('Error fetching sales:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
