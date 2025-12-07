const Database = require('better-sqlite3');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { execSync } = require('child_process');
const AdmZip = require('adm-zip');

const dbPath = path.join(__dirname, '../../sales.db');
const csvPath = path.join(__dirname, '../../truestate_assignment_dataset.csv');

let db;

function getDb() {
    if (!db) {
        db = new Database(dbPath, { verbose: null });
        db.pragma('journal_mode = WAL');
        db.pragma('synchronous = NORMAL');
    }
    return db;
}

function initDatabase() {
    return new Promise((resolve, reject) => {
        const db = getDb();

        // Create Table
        db.exec(`
            CREATE TABLE IF NOT EXISTS sales (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                transaction_id TEXT,
                date TEXT,
                customer_id TEXT,
                customer_name TEXT,
                phone TEXT,
                gender TEXT,
                age INTEGER,
                region TEXT,
                customer_type TEXT,
                product_id TEXT,
                product_name TEXT,
                brand TEXT,
                category TEXT,
                tags TEXT,
                quantity INTEGER,
                price_per_unit REAL,
                discount REAL,
                total_amount REAL,
                final_amount REAL,
                payment_method TEXT,
                order_status TEXT,
                delivery_type TEXT,
                store_id TEXT,
                store_location TEXT,
                salesperson_id TEXT,
                employee_name TEXT
            )
        `);

        // Check if data exists
        const count = db.prepare('SELECT count(*) as count FROM sales').get();
        if (count.count > 0) {
            console.log('Data already exists, skipping seed.');
            resolve();
            return;
        }

        console.log('Seeding database from CSV...');
        const insert = db.prepare(`
            INSERT INTO sales (
                transaction_id, date, customer_id, customer_name, phone, gender, age, region, customer_type,
                product_id, product_name, brand, category, tags, quantity, price_per_unit, discount,
                total_amount, final_amount, payment_method, order_status, delivery_type, store_id,
                store_location, salesperson_id, employee_name
            ) VALUES (
                @transaction_id, @date, @customer_id, @customer_name, @phone, @gender, @age, @region, @customer_type,
                @product_id, @product_name, @brand, @category, @tags, @quantity, @price_per_unit, @discount,
                @total_amount, @final_amount, @payment_method, @order_status, @delivery_type, @store_id,
                @store_location, @salesperson_id, @employee_name
            )
        `);

        const insertMany = db.transaction((rows) => {
            for (const row of rows) insert.run(row);
        });
        const rows = [];
        let rowCount = 0;

        const csvFile = path.resolve(__dirname, '../../../truestate_assignment_dataset.csv');
        const zipFile = path.resolve(__dirname, '../../../truestate_assignment_dataset.zip');

        if (!fs.existsSync(csvFile)) {
            if (fs.existsSync(zipFile)) {
                console.log('CSV not found, attempting to extract from ZIP...');
                try {
                    console.log('Using native unzip...');
                    execSync(`unzip -o "${zipFile}" -d "${path.dirname(csvFile)}"`);
                    console.log('Native unzip complete.');
                } catch (err) {
                    console.log('Native unzip failed, falling back to adm-zip...');
                    try {
                        const zip = new AdmZip(zipFile);
                        zip.extractAllTo(path.dirname(csvFile), true);
                        console.log('adm-zip extraction complete.');
                    } catch (zipErr) {
                        console.error('Extraction failed:', zipErr);
                        reject(zipErr);
                        return;
                    }
                }
            } else {
                console.error(`CSV file not found at ${csvFile} and no ZIP found at ${zipFile}`);
                resolve();
                return;
            }
        }

        fs.createReadStream(csvFile)
            .pipe(csv())
            .on('data', (data) => {

                const cleanRow = {
                    transaction_id: data['Transaction ID'],
                    date: data['Date'],
                    customer_id: data['Customer ID'],
                    customer_name: data['Customer Name'],
                    phone: data['Phone Number'],
                    gender: data['Gender'],
                    age: parseInt(data['Age']) || 0,
                    region: data['Customer Region'],
                    customer_type: data['Customer Type'],
                    product_id: data['Product ID'],
                    product_name: data['Product Name'],
                    brand: data['Brand'],
                    category: data['Product Category'],
                    tags: data['Tags'],
                    quantity: parseInt(data['Quantity']) || 0,
                    price_per_unit: parseFloat(data['Price per Unit']) || 0,
                    discount: parseFloat(data['Discount Percentage']) || 0,
                    total_amount: parseFloat(data['Total Amount']) || 0,
                    final_amount: parseFloat(data['Final Amount']) || 0,
                    payment_method: data['Payment Method'],
                    order_status: data['Order Status'],
                    delivery_type: data['Delivery Type'],
                    store_id: data['Store ID'],
                    store_location: data['Store Location'],
                    salesperson_id: data['Salesperson ID'],
                    employee_name: data['Employee Name']
                };
                rows.push(cleanRow);
                rowCount++;
                if (rows.length >= 1000) {
                    insertMany(rows);
                    rows.length = 0;
                    if (rowCount % 10000 === 0) console.log(`Processed ${rowCount} rows...`);
                }
            })
            .on('end', () => {
                if (rows.length > 0) insertMany(rows);

                // Indexes for performance
                console.log('Creating Indexes...');
                db.exec(`
                    CREATE INDEX IF NOT EXISTS idx_customer_name ON sales(customer_name);
                    CREATE INDEX IF NOT EXISTS idx_phone ON sales(phone);
                    CREATE INDEX IF NOT EXISTS idx_region ON sales(region);
                    CREATE INDEX IF NOT EXISTS idx_category ON sales(category);
                    CREATE INDEX IF NOT EXISTS idx_date ON sales(date);
                `);

                console.log('Database seeding completed.');
                resolve();
            })
            .on('error', (err) => reject(err));
    });
}

module.exports = { getDb, initDatabase };
