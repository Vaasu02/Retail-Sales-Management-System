# Architecture Document

## 1. Backend Architecture
The backend is built using **Node.js** with an **Express** server, designed to handle high-throughput requests for a dataset of 1 million records.
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: SQLite (`better-sqlite3`) was chosen for its zero-configuration, serverless nature, and high performance with local file-based storage. It avoids the overhead of a separate database server while handling large read operations efficiently.
-   **Concurrency**: The server runs as a single process (node) but SQLite handles concurrent reads effectively. Write operations (seeding) are handled transactionally.

## 2. Frontend Architecture
The frontend is a Single Page Application (SPA) built with **React** and **Vite**.
-   **Framework**: React (v18)
-   **Build Tool**: Vite (for fast HMR and optimized production builds)
-   **Styling**: Tailwind CSS (Utility-first CSS framework for consistent design system)
-   **State Management**:
    -   **URL-Based State**: The application uses `react-router-dom`'s `useSearchParams` to persist all filter, sort, and pagination states in the URL. This ensures browser back/forward buttons work and views are shareable.
    -   **Local State**: React `useState` and Custom Hooks (`useSales`) manage data fetching and UI loading states.

## 3. Data Flow
1.  **Request**: User interacts with UI (Search, Filter, Sort).
2.  **Navigation**: The interaction updates the URL Query Parameters (e.g., `?q=John&sortBy=date`).
3.  **Fetch**: The `useSales` hook listens to URL changes and triggers an API request to `GET /api/sales` with these parameters.
4.  **Processing (Backend)**:
    -   `salesController.js` extracts query params.
    -   `salesModel.js` constructs a dynamic SQL query using safe parameterized inputs.
    -   SQLite executes the query (using Indexes for speed).
5.  **Response**: JSON data + Metadata (total items, pages) is returned to Frontend.
6.  **Render**: React updates the `SalesTable`, `FilterPanel`, and `Pagination` components.

## 4. Folder Structure
```
root/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Request logic (salesController.js)
│   │   ├── services/      # Business logic (salesService.js)
│   │   ├── utils/         # Helpers
│   │   ├── routes/        # API Routes (salesRoutes.js)
│   │   ├── models/        # database queries (salesModel.js)
│   │   ├── db/            # DB connection & init (init.js)
│   │   └── index.js       # Entry point
│   ├── sales.db           # SQLite Database file
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/    # UI Components (Table, Filters)
│   │   ├── hooks/         # Custom Hooks (useSales.js)
│   │   ├── main.jsx       # Entry point
│   │   └── App.jsx        # Main Layout
│   └── package.json
│
├── docs/
│   └── architecture.md    # This file
│
└── README.md              # Project documentation
```

## 5. Module Responsibilities
-   **Backend**:
    -   `init.js`: Parsers CSV and seeds database on first run. Creates Indexes.
    -   `salesController.js`: Validates input, formats response (JSON).
    -   `salesModel.js`: detailed SQL logic, `WHERE` clause generation, Pagination calculation.
-   **Frontend**:
    -   `App.jsx`: Main layout, orchestration of Filter/Table.
    -   `useSales.js`: Abstract data fetching, handles error/loading states.
    -   `FilterPanel.jsx`: Renders dynamic filters, updates URL.
    -   `SalesTable.jsx`: Renders data, handles Sorting UI.
