function createJiraIssue(assigne, user, pass) {

  var ui = SpreadsheetApp.getUi(); // Same variations.

  var result = ui.alert(
    'Please confirm that All Test Details are correct',
      ui.ButtonSet.YES_NO);

  // Process the user's response.
  if (result == ui.Button.YES) {
    // User clicked "Yes".

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet1 = ss.getSheetByName(user);
    var dataRange1 = sheet1.getDataRange();
    var values1 = dataRange1.getValues();
    var len = values1.length;

    var testCaseArray = new Array();
    var jiraArray = new Array();

    for (var i = 1; i < len; i++) {
      testCaseArray.push(values1[i][0]);

      var testCaseId = values1[i][0]
      var summery = values1[i][1]
      var epicLink = values1[i][3]
      var e2eLink = values1[i][4]
      var projectKey = values1[i][5]
      var assign = assigne
      var userName = user
      var password = pass

      var formData = 
      '{"update":{"issuelinks":[{"add":{"outwardIssue":{"key":"' + e2eLink 
      + '"}, "type":{"inward":"relates", "name":"Relates", "outward":"relates to"}}}]}, "fields":{"summary":"C' + testCaseId 
      + ' - ' + summery 
      + '", "issuetype":{"name":"Integration Test"}, "project":{"key":"' + projectKey 
      + '"}, "description":"[https://testrail.devfactory.com//index.php?/cases/view/' + testCaseId 
      + ']", "assignee":{"name":"' + assign 
      + '"}, "priority":{"name":"Medium"}, "customfield_10002":"' + epicLink 
      + '", "labels":["AutomationNewTest"]}}'
      var options = {
      'method' : 'post',
      'payload' : formData,
      'contentType': 'application/json',
      'headers': {'Authorization': 'Basic ' + Utilities.base64Encode(userName + ':' + password)}
      };
      Logger.log(options);
      var response = UrlFetchApp.fetch("https://jira.devfactory.com/rest/api/2/issue", options);
      var json_bs = response.getContentText();
      Logger.log(json_bs)
      var data_bs = JSON.parse(json_bs); //parse text into json
      var jiraId = data_bs.key;
      var range = sheet1.getRange("A1:G" + len);
      var jiraCell = range.getCell(i+1,7);
      jiraCell.setValue(jiraId);

      jiraArray.push(jiraId);
    } // End of for loop
    emailDetails(testCaseArray, jiraArray);
    ui.alert('All Done! you will recieve an email with All the details.');
  } else {
    // User clicked "No" or X in the title bar.
    ui.alert('Please verify and click on Create JIRAs Button again');
  }
}