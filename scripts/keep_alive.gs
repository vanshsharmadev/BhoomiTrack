/**
 * =========================================================================
 * BhoomiTrack / NLAMS Render Server Keep-Alive Google Apps Script
 * =========================================================================
 * 
 * Purpose: Prevents Render free tier web service from spinning down (sleeping)
 * by pinging the /health endpoint every 5-10 minutes.
 * 
 * Target URL: https://bhoomitrack-p5nb.onrender.com/health
 * 
 * Setup Instructions:
 * 1. Open https://script.google.com/
 * 2. Click "New Project" and name it "BhoomiTrack Keep Alive"
 * 3. Replace the default code with this script
 * 4. Click the "Save" icon (Floppy disk)
 * 5. Click "Run" once to test and authorize permissions
 * 6. In the left sidebar, click the "Triggers" (Alarm Clock icon)
 * 7. Click "+ Add Trigger" (bottom right):
 *    - Function to run: keepServerAlive
 *    - Event source: Time-driven
 *    - Type of time based trigger: Minutes timer
 *    - Select minute interval: Every 5 minutes (or Every 10 minutes)
 * 8. Click "Save" — Done! Your server will now stay awake 24/7!
 */

const SERVER_HEALTH_URL = "https://bhoomitrack-p5nb.onrender.com/health";

function keepServerAlive() {
  const startTime = new Date().getTime();
  
  try {
    const options = {
      method: "get",
      muteHttpExceptions: true,
      headers: {
        "User-Agent": "GoogleAppsScript-KeepAlive/1.0"
      }
    };
    
    const response = UrlFetchApp.fetch(SERVER_HEALTH_URL, options);
    const statusCode = response.getResponseCode();
    const durationMs = new Date().getTime() - startTime;
    
    if (statusCode >= 200 && statusCode < 300) {
      Logger.log(`[SUCCESS] Server pinged at ${new Date().toISOString()} | HTTP ${statusCode} | Latency: ${durationMs}ms`);
    } else {
      Logger.log(`[WARNING] Server returned HTTP ${statusCode} | Latency: ${durationMs}ms | Response: ${response.getContentText().substring(0, 100)}`);
    }
  } catch (error) {
    Logger.log(`[ERROR] Failed to ping server: ${error.message}`);
  }
}
