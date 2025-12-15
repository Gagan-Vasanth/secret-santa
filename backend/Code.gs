/**
 * Secret Santa Google Apps Script Backend
 *
 * This script handles:
 * 1. User validation against Google Sheets data
 * 2. Recipient assignment logic (ensuring unique picks)
 * 3. Data persistence to prevent re-entry
 *
 * Setup Instructions:
 * 1. Create a Google Sheet with two sheets: "Users" and "Assignments"
 * 2. Users sheet columns: Name | DOB | UserID (auto-generated) | HasPicked | PickedRecipient
 * 3. Assignments sheet columns: GiverID | GiverName | RecipientID | RecipientName | Timestamp
 * 4. Deploy this script as a web app with "Anyone" access
 * 5. Copy the deployment URL to the frontend .env file as VITE_APPS_SCRIPT_URL
 *
 * IMPORTANT: Replace 'YOUR_SPREADSHEET_ID' below with your actual Google Sheets ID
 * The spreadsheet ID can be found in the URL of your Google Sheet:
 * https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
 *
 * For production use, consider using PropertiesService for secure configuration:
 * const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
 */

// REQUIRED: Configure your spreadsheet ID here
// Find it in your Google Sheet URL: https://docs.google.com/spreadsheets/d/{THIS_IS_YOUR_ID}/edit
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID";

/**
 * Handle POST requests from the frontend
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    let response;

    switch (action) {
      case "validateUser":
        response = validateUser(data.name, data.dob);
        break;
      case "pickRecipient":
        response = pickRecipient(data.userId, data.name, data.dob);
        break;
      default:
        response = { success: false, message: "Invalid action" };
    }

    return ContentService.createTextOutput(
      JSON.stringify(response)
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        message: "Server error: " + error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing and CORS preflight)
 */
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      success: true,
      message: "Secret Santa API is running",
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Validate user credentials against the Users sheet
 */
function validateUser(name, dob) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const usersSheet = ss.getSheetByName("Users");

    if (!usersSheet) {
      return {
        success: false,
        message: "Users sheet not found. Please contact administrator.",
      };
    }

    const data = usersSheet.getDataRange().getValues();

    // Skip header row
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const userName = row[0] ? row[0].toString().trim().toLowerCase() : "";
      const userDob = row[1] ? formatDate(row[1]) : "";
      const userId = row[2] ? row[2].toString() : generateUserId(name);
      const hasPicked = row[3]
        ? row[3].toString().toLowerCase() === "true"
        : false;

      if (userName === name.toLowerCase() && userDob === dob) {
        // User found, check if they already picked
        if (hasPicked) {
          return {
            success: true,
            alreadyPicked: true,
            userId: userId,
            message: "You have already picked your Secret Santa!",
          };
        }

        // Update userId if not set
        if (!row[2]) {
          usersSheet.getRange(i + 1, 3).setValue(userId);
        }

        return {
          success: true,
          alreadyPicked: false,
          userId: userId,
        };
      }
    }

    return {
      success: false,
      message: "Invalid credentials. Please check your name and date of birth.",
    };
  } catch (error) {
    Logger.log("Error in validateUser: " + error.toString());
    return {
      success: false,
      message: "Error validating user: " + error.toString(),
    };
  }
}

/**
 * Pick a recipient for the user
 */
function pickRecipient(userId, name, dob) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const usersSheet = ss.getSheetByName("Users");
    const assignmentsSheet = ss.getSheetByName("Assignments");

    if (!usersSheet || !assignmentsSheet) {
      return {
        success: false,
        message: "Required sheets not found. Please contact administrator.",
      };
    }

    // Verify user again
    const userData = usersSheet.getDataRange().getValues();
    let userRow = -1;

    for (let i = 1; i < userData.length; i++) {
      if (userData[i][2] && userData[i][2].toString() === userId) {
        userRow = i;
        break;
      }
    }

    if (userRow === -1) {
      return { success: false, message: "User not found" };
    }

    // Check if user already picked
    if (
      userData[userRow][3] &&
      userData[userRow][3].toString().toLowerCase() === "true"
    ) {
      return {
        success: false,
        message: "You have already picked your Secret Santa!",
      };
    }

    // Get list of available recipients (not already assigned and not self)
    const assignmentData = assignmentsSheet.getDataRange().getValues();
    const alreadyAssignedIds = new Set();

    // Skip header row
    for (let i = 1; i < assignmentData.length; i++) {
      if (assignmentData[i][2]) {
        // RecipientID column
        alreadyAssignedIds.add(assignmentData[i][2].toString());
      }
    }

    // Find available recipients
    const availableRecipients = [];
    for (let i = 1; i < userData.length; i++) {
      const recipientId = userData[i][2] ? userData[i][2].toString() : "";
      const recipientName = userData[i][0] ? userData[i][0].toString() : "";

      if (
        recipientId &&
        recipientId !== userId &&
        !alreadyAssignedIds.has(recipientId) &&
        recipientName
      ) {
        availableRecipients.push({
          id: recipientId,
          name: recipientName,
          row: i,
        });
      }
    }

    if (availableRecipients.length === 0) {
      return {
        success: false,
        message:
          "No recipients available. All Secret Santas have been assigned!",
      };
    }

    // Pick a random recipient
    const randomIndex = Math.floor(Math.random() * availableRecipients.length);
    const recipient = availableRecipients[randomIndex];

    // Record the assignment
    const timestamp = new Date();
    assignmentsSheet.appendRow([
      userId,
      name,
      recipient.id,
      recipient.name,
      timestamp,
    ]);

    // Update user's HasPicked status and PickedRecipient
    usersSheet.getRange(userRow + 1, 4).setValue("TRUE");
    usersSheet.getRange(userRow + 1, 5).setValue(recipient.name);

    return {
      success: true,
      recipient: recipient.name,
    };
  } catch (error) {
    Logger.log("Error in pickRecipient: " + error.toString());
    return {
      success: false,
      message: "Error picking recipient: " + error.toString(),
    };
  }
}

/**
 * Generate a unique user ID based on name
 */
function generateUserId(name) {
  const timestamp = new Date().getTime();
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleanName + "_" + timestamp;
}

/**
 * Format date to YYYY-MM-DD
 */
function formatDate(date) {
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return date.toString();
}

/**
 * Test function to set up sample data
 */
function setupSampleData() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  // Create Users sheet
  let usersSheet = ss.getSheetByName("Users");
  if (!usersSheet) {
    usersSheet = ss.insertSheet("Users");
    usersSheet.appendRow([
      "Name",
      "DOB",
      "UserID",
      "HasPicked",
      "PickedRecipient",
    ]);
    usersSheet.getRange("A1:E1").setFontWeight("bold");

    // Add sample users
    usersSheet.appendRow(["John Doe", "1990-01-15", "", "FALSE", ""]);
    usersSheet.appendRow(["Jane Smith", "1992-05-20", "", "FALSE", ""]);
    usersSheet.appendRow(["Bob Johnson", "1988-11-30", "", "FALSE", ""]);
    usersSheet.appendRow(["Alice Williams", "1995-07-12", "", "FALSE", ""]);
    usersSheet.appendRow(["Charlie Brown", "1991-03-25", "", "FALSE", ""]);
  }

  // Create Assignments sheet
  let assignmentsSheet = ss.getSheetByName("Assignments");
  if (!assignmentsSheet) {
    assignmentsSheet = ss.insertSheet("Assignments");
    assignmentsSheet.appendRow([
      "GiverID",
      "GiverName",
      "RecipientID",
      "RecipientName",
      "Timestamp",
    ]);
    assignmentsSheet.getRange("A1:E1").setFontWeight("bold");
  }

  Logger.log("Sample data setup complete!");
}
