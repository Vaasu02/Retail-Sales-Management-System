# Retail Sales Management System

## 1. Overview
A full-stack sales management dashboard built with Node.js and React, designed to handle 1 million+ records efficiently. It features a responsive UI with real-time filtering, searching, and sorting capabilities backed by a high-performance SQLite database.

## 2. Tech Stack
**Frontend**: React (Vite), Tailwind CSS, React Router, Lucide Icons.
**Backend**: Node.js, Express.js, better-sqlite3 (SQLite).
**Tools**: Postman, Git.

## 3. Search Implementation Summary
Full-text search is implemented on **Customer Name** and **Phone Number** fields. The backend uses SQL `LIKE` queries with wildcards (`%query%`) inside a parameterized statement. The search is case-insensitive and works in conjunction with all active filters.

## 4. Filter Implementation Summary
Supports multi-select filtering for **Region**, **Product Category**, **Gender**, **Payment Method**, and **Tags**. Also supports Range filtering for **Age** and **Date**. The implementation uses URL query parameters to persist state, checking for overlap (OR logic) within categories and intersection (AND logic) between different categories.

## 5. Sorting Implementation Summary
Sorting is available for **Date**, **Quantity**, and **Customer Name**. The backend whitelists sort fields to prevent SQL injection and applies `ORDER BY` clauses dynamically. The frontend provides a dropdown UI that updates the `sortBy` and `order` URL parameters.

## 6. Pagination Implementation Summary
Server-side pagination is implemented with a strict limit of 10 items per page. The backend calculates `OFFSET` based on the requested page number. The frontend `Pagination` component renders Next/Previous buttons and "Page X of Y" indicators, updating the `page` URL parameter.

## 7. Setup Instructions
**Backend:**
1. Navigate to backend: `cd backend`
2. Install dependencies: `npm install`
3. Start server: `npm run dev` (Runs on port 5000, seeds DB automatically)

**Frontend:**
1. Navigate to frontend: `cd frontend`
2. Install dependencies: `npm install`
3. Start app: `npm run dev` (Runs on http://localhost:5173)
