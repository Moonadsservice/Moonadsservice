# MoonSips - A Google Sheet Powered Product Catalog

Welcome to MoonSips! This is a simple, mobile-friendly product catalog website that pulls its data from a Google Sheet. It's designed to be easy to set up, customize, and deploy for free.

## Features

-   Pulls product data directly from a public Google Sheet.
-   Clean, responsive grid layout.
-   Search and category filtering.
-   "Order on WhatsApp" button with pre-filled messages.
-   Easy to customize with your own branding and products.

---

## How to Set Up Your Product Catalog

Follow these steps to get your own version of MoonSips running with your products.

### Step 1: Prepare Your Google Sheet

Your product data lives in a Google Sheet. It's important to format it correctly.

1.  **Create a new Google Sheet.**
2.  **Name your columns exactly like this in the first row:**
    `Name`, `Description`, `Price`, `Image URL`, `Category`, `Status`

    -   `Name`: The name of your product (Required).
    -   `Description`: A short description of the product (Optional).
    -   `Price`: The price of the product. Leave this blank if the product is not yet for sale.
    -   `Image URL`: A direct link to an image for the product. The link should end in `.jpg`, `.png`, `.gif`, etc.
    -   `Category`: The category for the product (e.g., Tea, Coffee, Soda).
    -   `Status`: Use `Coming Soon` if the product isn't available. Otherwise, you can leave it blank.

3.  **Fill in your product data** starting from the second row.

    ![Google Sheet Example](https://i.imgur.com/example.png) <!-- Placeholder Image -->

### Step 2: Publish Your Google Sheet as a CSV

To let the website read your sheet, you need to publish it to the web.

1.  In your Google Sheet, go to `File` -> `Share` -> `Publish to web`.
2.  In the dialog box that appears:
    -   Under `Link`, select the sheet containing your products.
    -   Under `Web page`, change the dropdown to **`Comma-separated values (.csv)`**.
3.  Click the **Publish** button.
4.  Copy the generated URL. This is your public CSV link.

### Step 3: Configure the Website

Now you'll add your Google Sheet link and WhatsApp number to the website's code.

1.  Open the `script.js` file.
2.  At the very top of the file, you will see a **CONFIGURATION** section.
3.  Replace the placeholder `googleSheetCsvUrl` with the link you copied from Google Sheets.
4.  Replace the placeholder `whatsappNumber` with your full WhatsApp number, including the country code (e.g., `19876543210`). **Do not include `+`, `-`, or spaces.**

```javascript
// ------------------- CONFIGURATION -------------------
// Replace this with your own Google Sheet CSV link
const googleSheetCsvUrl = 'YOUR_GOOGLE_SHEET_LINK_HERE';

// Replace this with your WhatsApp number
const whatsappNumber = 'YOUR_WHATSAPP_NUMBER_HERE';
// -----------------------------------------------------
```

**Important:** After you've added your link, you need to enable the live data connection. In `script.js`, find the `fetchProducts` function and:
1.  **Uncomment** this line: `const response = await fetch(googleSheetCsvUrl);`
2.  **Uncomment** this line: `const csvText = await response.text();`
3.  **Delete** the block of dummy data that starts with `const csvText = \`Name,Description,Price...`.

This will switch the site from using the built-in sample data to your live Google Sheet.

---

## How to Deploy Your Website for Free

You can publish your website for free using Netlify.

1.  **Prepare Your Files:** Make sure your `index.html`, `style.css`, and `script.js` files are in a single folder on your computer.
2.  **Sign up for Netlify:** Go to [netlify.com](https://www.netlify.com/) and create a free account.
3.  **Drag and Drop:** Once you're logged into your Netlify dashboard, you'll see a section that says "Drag and drop your site folder here".
4.  **Deploy:** Drag your folder into that box. Netlify will automatically upload your files and deploy your site.
5.  **Done!** Your site is now live on a free `.netlify.app` URL. You can customize the site name in the Netlify settings.

---

## Customization

Feel free to change the styles in `style.css` and the layout in `index.html` to match your brand. The code is commented to help you understand how it works.
