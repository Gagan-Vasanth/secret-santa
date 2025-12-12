# Secret Santa Backend - Google Apps Script Setup

This directory contains the Google Apps Script code that powers the Secret Santa backend.

## Setup Instructions

### 1. Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it "Secret Santa Database" or similar
3. Note the spreadsheet ID from the URL: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

### 2. Set Up the Sheets

Create two sheets in your spreadsheet:

#### Users Sheet
Columns:
- **Name** (A): Full name of the participant
- **DOB** (B): Date of birth in YYYY-MM-DD format
- **UserID** (C): Auto-generated unique identifier (leave empty initially)
- **HasPicked** (D): TRUE/FALSE indicating if user has picked (initially FALSE)
- **PickedRecipient** (E): Name of the recipient they picked (empty initially)

Example data:
```
Name          | DOB        | UserID | HasPicked | PickedRecipient
John Doe      | 1990-01-15 |        | FALSE     |
Jane Smith    | 1992-05-20 |        | FALSE     |
Bob Johnson   | 1988-11-30 |        | FALSE     |
Alice Williams| 1995-07-12 |        | FALSE     |
Charlie Brown | 1991-03-25 |        | FALSE     |
```

#### Assignments Sheet
Columns:
- **GiverID** (A): User ID of the person giving the gift
- **GiverName** (B): Name of the giver
- **RecipientID** (C): User ID of the recipient
- **RecipientName** (D): Name of the recipient
- **Timestamp** (E): When the assignment was made

This sheet will be populated automatically when users pick their Secret Santa.

### 3. Deploy the Google Apps Script

1. In your spreadsheet, go to **Extensions** → **Apps Script**
2. Delete any existing code in the editor
3. Copy the entire contents of `Code.gs` from this directory
4. Paste it into the Apps Script editor
5. Replace `YOUR_SPREADSHEET_ID` in the code with your actual spreadsheet ID
6. Save the project (File → Save or Ctrl+S)
7. Name your project "Secret Santa Backend"

### 4. Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Fill in the deployment settings:
   - **Description**: "Secret Santa API v1"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click **Deploy**
5. Review and authorize the permissions when prompted
6. Copy the **Web app URL** - you'll need this for the frontend

### 5. Test the Deployment

1. Open the Web app URL in your browser
2. You should see: `{"success":true,"message":"Secret Santa API is running"}`
3. If you see this, your backend is working!

### 6. Optional: Set Up Sample Data

You can use the `setupSampleData()` function to create sample data:

1. In the Apps Script editor, select `setupSampleData` from the function dropdown
2. Click the Run button (▶)
3. This will create the sheets and add sample users

### 7. Configure the Frontend

1. In the frontend directory, create a `.env` file
2. Add your Web app URL:
   ```
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

## Security Notes

- The script is deployed with "Anyone" access to allow frontend access
- User validation is done via name + DOB combination
- Each user can only pick once (enforced in the backend)
- All data is stored in your private Google Sheet
- Consider adding additional security measures for production use

## Troubleshooting

### "User not found" error
- Check that the user exists in the Users sheet
- Verify the name matches exactly (case-insensitive)
- Verify the DOB is in YYYY-MM-DD format

### "No recipients available" error
- All available recipients have been assigned
- Check the Assignments sheet to see who has been assigned

### CORS errors
- The script includes CORS headers
- Make sure you deployed as a web app with "Anyone" access
- Try redeploying the script

### Permission errors
- Make sure you authorized the script with the correct Google account
- The account must have edit access to the spreadsheet

## Updating the Script

If you make changes to the code:

1. Save the changes in the Apps Script editor
2. Click **Deploy** → **Manage deployments**
3. Click the pencil icon next to your deployment
4. Select a new version or click "New version"
5. Update the deployment
6. The Web app URL remains the same
