function emailDetails(testcases, jiras) {
  
  // Send the PDF of the spreadsheet to this email address
  var email = Session.getActiveUser().getEmail()
  
  // Subject of email message
  var subject = testcases; 
  
  var allJiras = ''
  var allTCs = ''
  for (var i = 0; i < jiras.length; i++) {
    allJiras = allJiras + '<br>https://jira.devfactory.com/browse/' +jiras[i]
    allTCs = allTCs + '<br>https://testrail.devfactory.com//index.php?/cases/view/' +testcases[i]
  }
  
  // Email Body can  be HTML too with your logo image - see ctrlq.org/html-mail
  var body = "Hello There,<br> Here is the list of Test Cases and JIRAs you just created.<br>"
  + "<br>JIRAs:" + allJiras
  + "<br>TestCases:" + allTCs

  // If allowed to send emails, send the email with the PDF attachment
  if (MailApp.getRemainingDailyQuota() > 0) {
    GmailApp.sendEmail(email, subject, body, {
      htmlBody: body,  
    }); 
  }
}