function onInstall() {
  onOpen();
}

function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .createMenu('Custom Menu')
      .addItem('Show sidebar', 'showSidebar')
      .addToUi();
}

function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Create JIRAs')
      .setWidth(300);
  SpreadsheetApp.getUi()
      .showSidebar(html);
}

function showAlert(user, password) {
  var ui = SpreadsheetApp.getUi(); // Same variations.

  var result = ui.alert(
    'User:' + user,
    'Password' + password,
      ui.ButtonSet.YES_NO);

  // Process the user's response.
  if (result == ui.Button.YES) {
    // User clicked "Yes".
    ui.alert('Confirmation received.');
  } else {
    // User clicked "No" or X in the title bar.
    ui.alert('Permission denied.');
  }
}

function populateTestCaseDetails(user, pass, testCases, project, epic, e2e, assign) {
  // Create New Sheet Every Time with TimeStamp
  var timestamp = new Date();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  try {
    var insertSheet = ss.insertSheet(user)
    var sheet1 = ss.getSheetByName(user);
  }catch(e){
    var sheet2 = ss.getSheetByName(user)
    sheet2.activate()
    ss.deleteActiveSheet();
    var insertSheet = ss.insertSheet(user)
    var sheet1 = ss.getSheetByName(user);
  }
  sheet1.setColumnWidth(2, 350);
  sheet1.setColumnWidth(3, 150);
  var headerRange = sheet1.getRange("A1:G1");
  headerRange.getCell(1, 1).setValue('TC ID')
  headerRange.getCell(1, 2).setValue('Title')
  headerRange.getCell(1, 3).setValue('Status')
  headerRange.getCell(1, 4).setValue('EPIC')
  headerRange.getCell(1, 5).setValue('E2E')
  headerRange.getCell(1, 6).setValue('Project Key')
  headerRange.getCell(1, 7).setValue('JIRA ID')
  headerRange.setBackground('#1155cc')
  .setFontColor('#ffffff')
  .setFontWeight('bold');

  // convert Comma seprated TCs into array, put all TCs in first column one by one
  var range = sheet1.getRange("A1:G10");
  range.setNumberFormat('@');
  var testCaseArray = new Array();
  testCaseArray = testCases.split(",");
  var numberOfTCs = testCaseArray.length;
  for (var j = 0; j < numberOfTCs; j++) {
    var testCaseID = testCaseArray[j].trim();
    var putTitleToCell = range.getCell(j+2,1);
    var putEpicToCell = range.getCell(j+2,4);
    var putE2EToCell = range.getCell(j+2,5);
    var putProjectToCell = range.getCell(j+2,6);
    putTitleToCell.setValue(testCaseID);
    putEpicToCell.setValue(epic);
    putE2EToCell.setValue(e2e);
    putProjectToCell.setValue(project);
  }

  var dataRange1 = sheet1.getDataRange();
  var values1 = dataRange1.getValues();
  var len = values1.length;
  for (var i = 1; i < len; i++) {
    try {
      var testCaseId = values1[i][0]
      var userName = user
      var password = pass
      Logger.log(testCaseId)
      Logger.log(userName)
      Logger.log(password)
      var options = {
        'method' : 'get',
        'contentType': 'application/json',
        'headers': {'Authorization': 'Basic ' + Utilities.base64Encode(userName + ':' + password)}
      };
      Logger.log(options);
      var response = UrlFetchApp.fetch("https://testrail.devfactory.com//index.php?/api/v2/get_case/" + testCaseId.toString(), options);
      var json_bs = response.getContentText();
      var data_bs = JSON.parse(json_bs); //parse text into json
      var title = data_bs.title;
      var status = data_bs.custom_tc_status;
      var preCondition = data_bs.custom_tc_status;
      var range = sheet1.getRange("A1:C" + len);
      var titleCell = range.getCell(i+1,2);
      var statusCell = range.getCell(i+1,3);
      titleCell.setValue(title);
      var statusString ='';
      Logger.log(status);
      switch (status)  {
        case 7.0:
          statusString = "Automation in progress";
          break;
        case 3.0:
          statusString = "Approved for Automation";
          break;
        case 9.0:
          statusString = "Approved for Testing";
          break;
        case 5.0:
          statusString = "Automated";
          break;
      }
      statusCell.setValue(statusString);
    }catch(e){
      console.log("Wrong ID");
      ui.alert(e.message);
    }
  }
}

function deleteCreatedSheet(user) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet1 = ss.getSheetByName(user);
  sheet1.activate()
  ss.deleteActiveSheet();
}

function testArray() {
  // conver Comma seprated TCs into array
  var str = "kiran1,kiran2, kiran3"
  var testCaseArray = new Array();
  testCaseArray = str.split(",");
  var numberOfTCs = testCaseArray.length;
  for (var i = 0; i < numberOfTCs; i++) {
      Logger.log(testCaseArray[i].trim());
  }
}

function getCurrentDate() {
  var fromDate = new Date();
  Logger.log(fromDate);
}

function testPopulation() {
  populateTestCaseDetails('kiran.jiwrakh', 'Lum3dx@2018', '15478848, 15478850')
}