# Contributing to NOIR

Thank you for contributing to the NOIR Premium Streetwear E-Commerce project.

This document explains how to set up the project, create changes, edit products and website content, work with branches, submit pull requests, and maintain the project correctly.

---

# Table of Contents

* [Project Overview](#project-overview)
* [Technology Stack](#technology-stack)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)
* [Environment Variables](#environment-variables)
* [Editing Website Content](#editing-website-content)
* [Managing Products](#managing-products)
* [Adding a New Product](#adding-a-new-product)
* [Changing Product Prices](#changing-product-prices)
* [Changing Product Images](#changing-product-images)
* [Changing Product Stock](#changing-product-stock)
* [Changing Product Categories](#changing-product-categories)
* [Editing Frontend Content](#editing-frontend-content)
* [Editing Styles](#editing-styles)
* [Working with the API](#working-with-the-api)
* [Git Workflow](#git-workflow)
* [Branches](#branches)
* [Commit Messages](#commit-messages)
* [Pull Requests](#pull-requests)
* [Issues](#issues)
* [Testing](#testing)
* [Building the Application](#building-the-application)
* [Deployment](#deployment)
* [Environment and Security](#environment-and-security)
* [Code Guidelines](#code-guidelines)
* [Before Submitting a Pull Request](#before-submitting-a-pull-request)

---

# Project Overview

NOIR is a premium streetwear e-commerce website focused on hoodies and T-shirts.

The application provides:

* Product catalogue
* Product search
* Product filtering
* Product sorting
* Product detail pages
* Product variants
* Shopping cart
* Wishlist
* Checkout
* Order confirmation
* Form validation
* Responsive navigation
* API integration
* Authentication-ready functionality
* Stripe-ready payment architecture
* Responsive frontend
* Vercel deployment

The project is built using React, TypeScript and Vite.

---

# Technology Stack

## Frontend

* React
* TypeScript
* Vite
* React Router
* Tailwind CSS
* Zustand
* React Hook Form
* Zod
* Lucide React
* Axios

## Backend

The repository contains a Node-based server with routes for:

* Authentication
* Products
* Orders

The backend also contains product seed data and database-related files.

---

# Project Structure

The project is organised into frontend and backend sections.

```text
NOIR/
│
├── .github/
│   └── workflows/
│       └── builds.yml
│
├── public/
│   ├── _redirects
│   ├── favicon.svg
│   ├── icons.svg
│   ├── robots.txt
│   └── sitemap.xml
│
├── server/
│   ├── data/
│   │   ├── db.json
│   │   └── products.seed.json
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── orders.js
│   │   └── products.js
│   │
│   ├── db.js
│   └── index.js
│
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── store/
│   ├── types/
│   ├── utils/
│   │
│   ├── App.css
│   └── App.tsx
│
├── .env.example
├── .gitignore
├── index.html
├── LICENSE
├── package.json
└── README.md
```

---

# Getting Started

## 1. Clone the Repository

Clone the repository to your local machine.

```bash
git clone https://github.com/Darrenvandervelde/Merch-Ecommerce-Website.git
```

Move into the project directory:

```bash
cd Merch-Ecommerce-Website
```

---

## 2. Install Dependencies

Install the required packages:

```bash
npm install
```

---

## 3. Create the Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Update the environment variables if required.

---

# Environment Variables

The project uses environment variables for configuration.

Example:

```env
VITE_API_URL=
VITE_STRIPE_PUBLIC_KEY=
VITE_APP_NAME=NOIR
```

Do not commit your `.env` file.

Never commit:

```text
.env
.env.local
.env.production
```

Do not commit:

* API secrets
* Passwords
* Private keys
* Database credentials
* Stripe secret keys
* Authentication secrets

Only public frontend values should be exposed through `VITE_` variables.

---

# Editing Website Content

Website content can be located in different parts of the application depending on what you want to change.

Before changing content, search the `src/` directory for the text you want to modify.

For example, if you want to change:

```text
Shop Premium Streetwear
```

search the project for:

```text
Shop Premium Streetwear
```

This will help identify the component or page containing the content.

---

# Editing Product Content

The main product seed data is located at:

```text
server/data/products.seed.json
```

This file contains the product catalogue.

Each product contains information such as:

```json
{
  "id": "ts-001",
  "name": "Essential Black Tee",
  "slug": "essential-black-tee",
  "category": "tshirt",
  "description": "Our signature heavyweight cotton tee.",
  "price": 38,
  "images": [
    "https://example.com/image.jpg"
  ],
  "colours": [
    "Black",
    "White",
    "Charcoal"
  ],
  "sizes": [
    "S",
    "M",
    "L",
    "XL",
    "XXL"
  ],
  "stock": 120,
  "rating": 4.8,
  "reviewCount": 214,
  "featured": true,
  "bestseller": true,
  "newArrival": false
}
```

---

# Product Fields

## ID

The `id` uniquely identifies the product.

Example:

```json
"id": "ts-001"
```

Use a unique ID for every product.

For example:

```text
ts-001
ts-002
ts-003

hd-001
hd-002
hd-003
```

Do not give two products the same ID.

---

# Product Name

The `name` is the product name displayed to customers.

Example:

```json
"name": "Essential Black Tee"
```

To change it:

```json
"name": "Premium Black T-Shirt"
```

Keep product names clear and concise.

---

# Product Slug

The `slug` is normally used for the product URL.

Example:

```json
"slug": "essential-black-tee"
```

A good slug should:

* Use lowercase letters
* Use hyphens
* Avoid spaces
* Avoid unnecessary special characters

Example:

```text
premium-black-t-shirt
```

Avoid:

```text
Premium Black T-Shirt
```

If you change a slug, check that existing links and routes continue to work.

---

# Product Description

The `description` contains the main product description.

Example:

```json
"description": "Heavyweight cotton T-shirt with a relaxed streetwear fit."
```

Keep descriptions useful to customers.

Include information such as:

* Material
* Fit
* Design
* Features
* Intended use

---

# Product Price

The `price` controls the normal product price.

Example:

```json
"price": 38
```

If you want to change the price:

```json
"price": 42
```

Always use a number rather than a string.

Correct:

```json
"price": 42
```

Incorrect:

```json
"price": "$42"
```

The currency formatting should be handled by the application.

---

# Sale Price

Products can optionally have a `salePrice`.

Example:

```json
"price": 36,
"salePrice": 28
```

This means:

* Normal price: 36
* Sale price: 28

If a product is not on sale, the `salePrice` can be removed.

---

# Product Images

Images are stored inside the `images` array.

Example:

```json
"images": [
  "https://example.com/product-image.jpg"
]
```

Multiple images can be added:

```json
"images": [
  "https://example.com/front.jpg",
  "https://example.com/back.jpg",
  "https://example.com/side.jpg"
]
```

Make sure image URLs are publicly accessible.

Before committing an image URL:

1. Open the URL in your browser.
2. Confirm the image loads.
3. Confirm the image is the correct product.
4. Confirm the URL does not require authentication.

---

# Product Colours

Colours are stored as an array.

Example:

```json
"colours": [
  "Black",
  "White",
  "Charcoal"
]
```

To add another colour:

```json
"colours": [
  "Black",
  "White",
  "Charcoal",
  "Navy"
]
```

Use consistent colour naming throughout the catalogue.

---

# Product Sizes

Sizes are also stored as an array.

Example:

```json
"sizes": [
  "S",
  "M",
  "L",
  "XL",
  "XXL"
]
```

Only add sizes that are actually available.

---

# Product Stock

Stock is controlled through:

```json
"stock": 120
```

For example:

```json
"stock": 50
```

means that 50 units are available.

When updating stock, make sure the number reflects the actual available stock.

---

# Product Rating

Example:

```json
"rating": 4.8
```

Ratings should normally be between:

```text
0.0
```

and:

```text
5.0
```

---

# Review Count

Example:

```json
"reviewCount": 214
```

This represents the number of reviews associated with the product.

---

# Featured Products

Products can be marked as featured:

```json
"featured": true
```

Or:

```json
"featured": false
```

Use:

```json
"featured": true
```

when the product should appear in featured-product sections.

---

# Bestselling Products

Use:

```json
"bestseller": true
```

to identify a bestselling product.

Otherwise:

```json
"bestseller": false
```

---

# New Arrivals

Use:

```json
"newArrival": true
```

for new products.

Otherwise:

```json
"newArrival": false
```

---

# Adding a New Product

To add a new product, open:

```text
server/data/products.seed.json
```

Add a new object to the product array.

Example:

```json
{
  "id": "ts-009",
  "name": "Premium Grey Tee",
  "slug": "premium-grey-tee",
  "category": "tshirt",
  "description": "Premium heavyweight cotton T-shirt with a relaxed fit.",
  "price": 45,
  "images": [
    "https://example.com/premium-grey-tee.jpg"
  ],
  "colours": [
    "Grey",
    "Black"
  ],
  "sizes": [
    "S",
    "M",
    "L",
    "XL"
  ],
  "stock": 50,
  "rating": 4.7,
  "reviewCount": 0,
  "featured": false,
  "bestseller": false,
  "newArrival": true
}
```

Make sure the JSON remains valid.

---

# Important JSON Rules

JSON is strict.

Correct:

```json
{
  "name": "Premium Hoodie",
  "price": 90
}
```

Incorrect:

```json
{
  "name": "Premium Hoodie",
  "price": 90,
}
```

The final property must not have a trailing comma.

Also make sure:

* Property names use double quotes
* Strings use double quotes
* Arrays use `[ ]`
* Objects use `{ }`
* Commas separate properties

---

# Editing Frontend Content

Frontend pages are located under:

```text
src/pages/
```

Reusable UI components are located under:

```text
src/components/
```

If you need to change a specific page, look inside:

```text
src/pages/
```

If the same content appears across multiple pages, it may be inside:

```text
src/components/
```

Common examples include:

```text
Header
Footer
ProductCard
ProductGrid
Navigation
Buttons
Forms
```

Before creating a new component, check whether an existing component can be reused.

---

# Editing the Header

The header is part of the layout components.

Look inside:

```text
src/components/layout/
```

When changing navigation:

* Keep links consistent
* Test every link
* Check mobile navigation
* Check desktop navigation
* Make sure routes still exist

---

# Editing the Footer

The footer is also located within the layout components.

When changing footer content, check:

* Navigation links
* Social links
* Copyright information
* Contact information
* Legal links

Test every link after making changes.

---

# Editing Styles

The project uses Tailwind CSS.

Most styling should be handled through Tailwind utility classes.

Example:

```tsx
<div className="flex items-center justify-between p-6">
```

Avoid creating large amounts of custom CSS when an existing Tailwind utility can solve the problem.

Global application styling can also be found in:

```text
src/App.css
```

---

# Working With Images

Images can be stored locally in:

```text
src/assets/
```

Public static files can be stored in:

```text
public/
```

For product catalogue images, follow the existing product image approach unless the project architecture has been changed.

Always verify:

* Image loads correctly
* Image is appropriate for the product
* Image has suitable dimensions
* Image does not expose private information
* Image URL remains available

---

# API

The frontend contains an API layer under:

```text
src/api/
```

The current structure includes API modules for:

```text
auth.ts
client.ts
orders.ts
payments.ts
products.ts
```

The backend contains routes under:

```text
server/routes/
```

including:

```text
auth.js
orders.js
products.js
```

When changing API behaviour, make sure both the frontend API client and backend route continue to agree on:

* HTTP method
* URL
* Request body
* Response structure
* Error handling

---

# Git Workflow

All contributors should use branches when working on changes.

Do not make feature changes directly on the `main` branch unless you are specifically authorised to do so.

The default branch is:

```text
main
```

---

# Creating a Branch

Before creating a branch, update your local repository:

```bash
git checkout main
git pull origin main
```

Create a feature branch:

```bash
git checkout -b feature/add-new-product
```

Other examples:

```text
feature/update-homepage
feature/add-product
feature/update-checkout
fix/product-image
fix/cart-calculation
docs/update-readme
```

Use descriptive branch names.

---

# Branch Naming

Recommended format:

```text
feature/description
```

For bug fixes:

```text
fix/description
```

For documentation:

```text
docs/description
```

For refactoring:

```text
refactor/description
```

Examples:

```text
feature/add-summer-collection
fix/product-image-loading
docs/update-contributing-guide
refactor/product-card
```

---

# Making Changes

After making your changes, check what has changed:

```bash
git status
```

Review your changes:

```bash
git diff
```

Add the required files:

```bash
git add .
```

Create a commit:

```bash
git commit -m "feat: add new summer collection"
```

Push your branch:

```bash
git push -u origin feature/add-summer-collection
```

---

# Commit Messages

Use clear and meaningful commit messages.

Recommended prefixes:

```text
feat:
fix:
docs:
style:
refactor:
test:
chore:
```

Examples:

```text
feat: add new hoodie products
```

```text
fix: correct product image URL
```

```text
docs: update product editing guide
```

```text
refactor: improve product card component
```

Avoid vague messages such as:

```text
update
```

or:

```text
changes
```

A commit message should explain what was changed.

---

# Pull Requests

Once your work is complete, create a Pull Request into:

```text
main
```

Your Pull Request should explain:

## What changed?

Describe the changes made.

## Why was it changed?

Explain the reason for the change.

## Testing

Explain how the changes were tested.

Example:

```text
npm run lint
npm run build
```

## Screenshots

For visual changes, include screenshots where appropriate.

---

# Pull Request Example

```text
Title:

feat: add summer hoodie collection

Description:

## What Changed

- Added three new hoodie products
- Added product images
- Added new colour variants
- Updated product catalogue

## Testing

- npm run lint
- npm run build
- Tested product pages locally
- Tested cart functionality

## Screenshots

Added screenshots of the updated product pages.
```

---

# Issues

Use GitHub Issues to report:

* Bugs
* Feature requests
* Content problems
* Image problems
* UI issues
* Documentation improvements
* Performance problems

Before opening a new issue, search existing issues to avoid duplicates.

---

# Bug Report

When reporting a bug, include:

```text
## Description

Explain the problem.

## Steps to Reproduce

1. Open the website.
2. Navigate to the product page.
3. Select a product.
4. Click Add to Cart.
5. Observe the issue.

## Expected Behaviour

Explain what should happen.

## Actual Behaviour

Explain what actually happened.

## Environment

Browser:
Operating System:
Device:

## Screenshots

Add screenshots where appropriate.
```

---

# Testing

Before submitting changes, run:

```bash
npm run lint
```

Then build the application:

```bash
npm run build
```

If both commands complete successfully, test the application manually.

---

# Manual Testing

Depending on the change, test:

* Homepage
* Navigation
* Product catalogue
* Product filtering
* Product search
* Product detail pages
* Colour selection
* Size selection
* Add to cart
* Cart quantity
* Wishlist
* Checkout
* Form validation
* Order confirmation
* Mobile navigation
* Responsive layouts

---

# Building the Application

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

If the build fails, fix the issue before creating a Pull Request.

---

# Deployment

The application is configured for modern frontend hosting platforms such as Vercel, Netlify and Cloudflare Pages.

The current project uses a Vercel deployment.

After deployment, test:

* Homepage
* Product routes
* Product detail URLs
* Cart
* Checkout
* Refreshing nested routes
* Images
* API requests

---

# SPA Routing

Because this is a React single-page application, hosting must correctly handle client-side routes.

For Vercel, the project can use:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

For Netlify:

```text
/* /index.html 200
```

The project already contains a:

```text
public/_redirects
```

file for SPA routing.

---

# Security

Never commit sensitive information.

Do not commit:

```text
.env
```

Do not place secret API keys inside React components.

Never expose:

* Stripe secret keys
* Database passwords
* Authentication secrets
* Private API keys
* Tokens

Frontend environment variables beginning with:

```text
VITE_
```

can be exposed to the browser.

Only use public values in these variables.

---

# Database and Server Changes

The server contains:

```text
server/data/db.json
server/data/products.seed.json
server/db.js
```

and API routes:

```text
server/routes/auth.js
server/routes/orders.js
server/routes/products.js
```

Be careful when modifying backend data structures.

A change to the product schema may require updates to:

* Frontend types
* API functions
* Product components
* Product pages
* Backend routes
* Database data

Always test the full product flow after schema changes.

---

# Editing Existing Content Safely

Before changing content:

1. Identify where the content is stored.
2. Check whether the content is reused elsewhere.
3. Make the change on a feature branch.
4. Run linting.
5. Run a production build.
6. Test the affected page.
7. Check desktop and mobile layouts.
8. Commit the change.
9. Push the branch.
10. Open a Pull Request.

---

# Adding a New Product Checklist

Before submitting a new product, confirm:

```text
[ ] Unique product ID
[ ] Product name added
[ ] Unique slug added
[ ] Correct category
[ ] Product description added
[ ] Correct price
[ ] Sale price added if required
[ ] Product image added
[ ] Image URL tested
[ ] Colours added
[ ] Sizes added
[ ] Stock added
[ ] Rating added
[ ] Review count added
[ ] Featured status checked
[ ] Bestseller status checked
[ ] New arrival status checked
[ ] JSON syntax checked
[ ] npm run lint completed
[ ] npm run build completed
[ ] Product tested locally
```

---

# Before Submitting a Pull Request

Run:

```bash
git status
```

Review your changes:

```bash
git diff
```

Run:

```bash
npm run lint
```

Then:

```bash
npm run build
```

Finally, test the website manually.

Make sure:

* No unnecessary files are committed
* No `.env` files are committed
* No secrets are committed
* Product images work
* Links work
* Routes work
* Forms work
* Mobile layout works
* Desktop layout works
* Existing functionality has not been broken

---

# Recommended Workflow

The recommended workflow for contributors is:

```text
1. Pull latest main
        ↓
2. Create feature branch
        ↓
3. Make changes
        ↓
4. Test changes locally
        ↓
5. Run lint
        ↓
6. Run production build
        ↓
7. Commit changes
        ↓
8. Push branch
        ↓
9. Open Pull Request
        ↓
10. Review
        ↓
11. Make requested changes
        ↓
12. Merge into main
```

---

# Collaboration Principles

When contributing to NOIR:

* Keep changes focused.
* Avoid unrelated changes in the same Pull Request.
* Write clear commit messages.
* Test your changes before submitting them.
* Keep the code organised.
* Reuse existing components where possible.
* Do not commit secrets.
* Document important changes.
* Communicate clearly through Issues and Pull Requests.
* Review other contributors' work constructively.

---

# Final Goal

The goal of this workflow is to keep the NOIR project:

* Easy to maintain
* Easy to understand
* Easy to contribute to
* Consistent
* Secure
* Production ready

Every contribution should improve the project without unnecessarily breaking existing functionality.
