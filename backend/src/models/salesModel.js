const { getDb } = require('../db/init');

function buildWhereClause(filters) {
    const conditions = [];
    const params = {};

    if (filters.search) {
        conditions.push('(customer_name LIKE @search OR phone LIKE @search)');
        params.search = `%${filters.search}%`;
    }

    if (filters.region && filters.region.length) {
        // Multi-select for Region
        const regionPlaceholders = filters.region.map((_, i) => `@region${i}`).join(',');
        conditions.push(`region IN (${regionPlaceholders})`);
        filters.region.forEach((val, i) => params[`region${i}`] = val);
    }

    if (filters.gender && filters.gender.length) {
        const genderPlaceholders = filters.gender.map((_, i) => `@gender${i}`).join(',');
        conditions.push(`gender IN (${genderPlaceholders})`);
        filters.gender.forEach((val, i) => params[`gender${i}`] = val);
    }

    if (filters.category && filters.category.length) {
        const catPlaceholders = filters.category.map((_, i) => `@cat${i}`).join(',');
        conditions.push(`category IN (${catPlaceholders})`);
        filters.category.forEach((val, i) => params[`cat${i}`] = val);
    }

    if (filters.tags && filters.tags.length) {
        // Tags are stored as "Tag1, Tag2, Tag3". We need to check if the row contains ANY of the selected tags.
        // Using OR logic for tags (Row has Tag A OR Tag B)
        const tagConditions = filters.tags.map((_, i) => `tags LIKE @tag${i}`).join(' OR ');
        conditions.push(`(${tagConditions})`);
        filters.tags.forEach((val, i) => params[`tag${i}`] = `%${val}%`);
    }

    if (filters.payment_method && filters.payment_method.length) {
        const payPlaceholders = filters.payment_method.map((_, i) => `@pay${i}`).join(',');
        conditions.push(`payment_method IN (${payPlaceholders})`);
        filters.payment_method.forEach((val, i) => params[`pay${i}`] = val);
    }

    if (filters.age_min) {
        conditions.push('age >= @age_min');
        params.age_min = parseInt(filters.age_min);
    }

    if (filters.age_max) {
        conditions.push('age <= @age_max');
        params.age_max = parseInt(filters.age_max);
    }

    if (filters.date_from) {
        conditions.push('date >= @date_from');
        params.date_from = filters.date_from;
    }

    if (filters.date_to) {
        conditions.push('date <= @date_to');
        params.date_to = filters.date_to;
    }

    return {
        where: conditions.length ? 'WHERE ' + conditions.join(' AND ') : '',
        params
    };
}

const SalesModel = {
    findAll: (filters = {}, page = 1, limit = 10, sort = { field: 'date', order: 'DESC' }) => {
        const db = getDb();
        const { where, params } = buildWhereClause(filters);
        const offset = (page - 1) * limit;

        // Count Total (for pagination)
        const countQuery = `SELECT COUNT(*) as total FROM sales ${where}`;
        const totalResult = db.prepare(countQuery).get(params);
        const totalItems = totalResult ? totalResult.total : 0;
        const totalPages = Math.ceil(totalItems / limit);

        // Fetch Data
        // Whitelist sort fields to prevent SQL injection
        const allowedSortFields = ['date', 'quantity', 'customer_name', 'total_amount'];
        const sortField = allowedSortFields.includes(sort.field) ? sort.field : 'date';
        const sortOrder = sort.order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const dataQuery = `
            SELECT * FROM sales 
            ${where} 
            ORDER BY ${sortField} ${sortOrder} 
            LIMIT @limit OFFSET @offset
        `;

        const rows = db.prepare(dataQuery).all({ ...params, limit, offset });

        return {
            data: rows,
            meta: {
                totalItems,
                totalPages,
                currentPage: parseInt(page),
                itemsPerPage: parseInt(limit)
            }
        };
    },

    getFilterOptions: () => {
        const db = getDb();
        const tagsRaw = db.prepare('SELECT DISTINCT tags FROM sales WHERE tags IS NOT NULL').all().map(r => r.tags);
        // Split comma-separated tags and get unique values
        const uniqueTags = [...new Set(tagsRaw.flatMap(t => t.split(',').map(tag => tag.trim())))].sort();

        return {
            regions: db.prepare('SELECT DISTINCT region FROM sales WHERE region IS NOT NULL').all().map(r => r.region),
            categories: db.prepare('SELECT DISTINCT category FROM sales WHERE category IS NOT NULL').all().map(c => c.category),
            payment_methods: db.prepare('SELECT DISTINCT payment_method FROM sales WHERE payment_method IS NOT NULL').all().map(p => p.payment_method),
            tags: uniqueTags
        };
    }
};

module.exports = SalesModel;
