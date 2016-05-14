function onOpen() {
  var ui = SpreadsheetApp.getUi(); // or DocumentApp or FormApp
  ui.createMenu('Anna\'s Taqueria')
      .addSubMenu(ui.createMenu('Email produce order...')
         .addItem('for Monday', 'mondayTrigger')
         .addItem('for Thursday', 'thursdayTrigger'))
      .addSubMenu(ui.createMenu('Override current staus and send produce order...')
         .addItem('for Monday', 'emailMonday')
         .addItem('for Thursday', 'emailThursday'))
      .addToUi();
}

function onChange() {
  mondayTrigger();
  thursdayTrigger();
}

function mondayTrigger() {
  
  checkmondaySafety();
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var statusSheet = ss.getSheetByName('Order Status');
  var activeCell = ss.getRange('P7');
  var cellValue = activeCell.getValue();
  
  if (cellValue == 8) { 
    emailMonday();
  }
  else {
    return;
  }
}

function thursdayTrigger() {
  
  checkthursdaySafety();

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var statusSheet = ss.getSheetByName('Order Status');
  var activeCell = ss.getRange('P30');
  var cellValue = activeCell.getValue();
  
  if (cellValue == 8) { 
    emailThursday();
  }
  else {
    return;
  }
}

function emailMonday() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Order Status');
  
  ss.setActiveSheet(sheet);
  
  var pdf = mondaySpreadsheetToPDF();
  
  DriveApp.createFile(pdf);
  
  var mondayDay = ( 1 + (new Date()).getDate());     // As this script is run every Sunday, this attributes the next day's date to the variable mondayDay
  var mondayMonth = ( 1 + (new Date()).getMonth());  // This attributes the current month to the variable mondayMonth
  var mondayYear = (new Date()).getYear();           // This attributes the current year to the variable mondayYear
  var emailToDriver = 'rodricarj@live.com,caesar@grubel.org';
  var subjectDriver = 'Produce Order for MONDAY';
  var messageDriver = "Rodriguez, \n \n Sigue la lista de lunes, " + mondayDay + "/" + mondayMonth + "/" + mondayYear + ". \n \n Muchas gracias. \n \n \n Caesar Grubel";
  var emailToStores = 'annastaqueria1@gmail.com,annastaqueria2@gmail.com,annastaqueria3@gmail.com,annastaqueria4@gmail.com,annastaqueria5@gmail.com,annastaqueria6@gmail.com,annastaqueria7@gmail.com';
  var subjectStores = 'Produce Order for MONDAY';
  var messageStores = "Greetings! \n \n Check your produce order for Monday, " + mondayMonth + "/" + mondayDay + "/" + mondayYear + ". \n \n Cheers. \n \n \n Caesar Grubel";
  var attach = pdf;
  
  MailApp.sendEmail(emailToDriver, subjectDriver, messageDriver, {attachments:[attach]});   // Send the freshly constructed email to the Driver
  MailApp.sendEmail(emailToStores, subjectStores, messageStores, {attachments:[attach]});   // Send the freshly constructed email to the Stores
  
  mondaysafetyOn();
  
  archivePDF();
  
  deletePDF();

  return;
}

function emailThursday() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Order Status');
  
  ss.setActiveSheet(sheet);
  
  var pdf = thursdaySpreadsheetToPDF();
  
  DriveApp.createFile(pdf);
  
  var thursdayDay = ( 1 + (new Date()).getDate());     // As this script is run every Wednesday, this attributes the next day's date to the variable thursdayDay
  var thursdayMonth = ( 1 + (new Date()).getMonth());  // This attributes the current month to the variable thursdayMonth
  var thursdayYear = (new Date()).getYear();           // This attributes the current year to the variable thursdayYear
  var emailToDriver = 'rodricarj@live.com,caesar@grubel.org';
  var subjectDriver = 'Produce Order for THURSDAY';
  var messageDriver = "Rodriguez, \n \n Sigue la lista de jueves, " + thursdayDay + "/" + thursdayMonth + "/" + thursdayYear + ". \n \n Muchas gracias. \n \n \n Caesar Grubel";
  var emailToStores = 'annastaqueria1@gmail.com,annastaqueria2@gmail.com,annastaqueria3@gmail.com,annastaqueria4@gmail.com,annastaqueria5@gmail.com,annastaqueria6@gmail.com,annastaqueria7@gmail.com';
  var subjectStores = 'Produce Order for THURSDAY';
  var messageStores = "Greetings! \n \n Check your produce order for Thursday, " + thursdayMonth + "/" + thursdayDay + "/" + thursdayYear + ". \n \n Cheers. \n \n \n Caesar Grubel";
  var attach = pdf;
  
  MailApp.sendEmail(emailToDriver, subjectDriver, messageDriver, {attachments:[attach]});   // Send the freshly constructed email to the Driver
  MailApp.sendEmail(emailToStores, subjectStores, messageStores, {attachments:[attach]});   // Send the freshly constructed email to the Stores
  
  thursdaysafetyOn();
  
  archivePDF();
  
  deletePDF();
  
  return;
}

function mondaySpreadsheetToPDF() {
  var spreadsheetId = '1nsgBcol0atxUpk1bpzWGKBZX_U8rQjx-9leVMHObRKE';
  var file = Drive.Files.get(spreadsheetId);
  var url = file.exportLinks['application/pdf'];
  var url_ext = '&size=letter'                                           // paper size
              + '&portrait=true'                                         // orientation, false for landscape
              + '&fitw=true'                                             // fit to width, false for actual size
              + '&sheetnames=false&printtitle=false&pagenumbers=false'   // hide optional headers and footers
              + '&gridlines=false'                                       // hide gridlines
              + '&fzr=false';                                            // do not repeat row headers (frozen rows) on each page
  var token = ScriptApp.getOAuthToken();
  var response = UrlFetchApp.fetch(url + url_ext, {
    headers: {
      'Authorization': 'Bearer ' +  token
    }
  });
  var pdf = response.getBlob();
  
  return pdf;
}

function thursdaySpreadsheetToPDF() {
  var spreadsheetId = '1cfWQD0CP4vJiIC0hwTR5fW4_hAH34kizfyl0o0WZ0iE';
  var file = Drive.Files.get(spreadsheetId);
  var url = file.exportLinks['application/pdf'];
  var url_ext = '&size=letter'                                           // paper size
              + '&portrait=true'                                         // orientation, false for landscape
              + '&fitw=true'                                             // fit to width, false for actual size
              + '&sheetnames=false&printtitle=false&pagenumbers=false'   // hide optional headers and footers
              + '&gridlines=false'                                       // hide gridlines
              + '&fzr=false';                                            // do not repeat row headers (frozen rows) on each page
  
  var token = ScriptApp.getOAuthToken();
  var response = UrlFetchApp.fetch(url + url_ext, {
    headers: {
      'Authorization': 'Bearer ' +  token
    }
  });
  var pdf = response.getBlob();
  
  return pdf;
}

function archivePDF(originalFile,destinationFolder) {

  var tomorrowDay = ( 1 + (new Date()).getDate());     // This attributes the next day's date to the variable tomorrowDay
  var tomorrowMonth = ( 1 + (new Date()).getMonth());  // This attributes the next day's corresponding month to the variable tomorrowMonth
  var tomorrowYear = (new Date()).getYear();           // This attributes the next day's corresponding year to the variable tomorrowYear
  var originalFiles = DriveApp.getFilesByName('export.pdf');
  var destinationFolder = DriveApp.getFolderById('0B-C7ja8tthE-Si1TdC1FNldRRkU');
  
  if ( tomorrowMonth < 10 ) {
    var newtomorrowMonth = '0' + tomorrowMonth;
  }
  else var newtomorrowMonth = tomorrowMonth;
  
  if ( tomorrowDay < 10 ) {
    var newtomorrowDay = '0' + tomorrowDay;
  }
  else var newtomorrowDay = tomorrowDay; 
  
  var newFilename = tomorrowYear + '-' + newtomorrowMonth + '-' + newtomorrowDay + ' - All Locations - Produce Order.pdf'

  while (originalFiles.hasNext()) {
    var originalFile = originalFiles.next();
    originalFile.makeCopy(newFilename, destinationFolder);
    DriveApp.removeFile(originalFile);
  }
  return;
}

function removePDF() {  // Removes the file, but sends it to the Trash folder

  var originalFiles = DriveApp.getFilesByName('export.pdf');
  
  while (originalFiles.hasNext()) {
    var originalFile = originalFiles.next();
    DriveApp.removeFile(originalFile);
  }
  return;
}

function deletePDF() {  // Removes the file without sending it to the Trash folder

  var targetFile = DriveApp.getFilesByName('export.pdf');

  while (targetFile.hasNext()) {
    var eachFile = targetFile.next();
    var targetId = eachFile.getId();
    Logger.log('ID of target file: ' + targetId);
    Drive.Files.remove(targetId);
  }
}

function checkmondaySafety() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var statusSheet = ss.getSheetByName('Order Status');
  var activeCell = ss.getRange('P22');
  var cellValue = activeCell.getValue();
  
  if (cellValue == 'NOT SENT') { 
    return;
  }
  else {
    onChange();
  }
}

function checkthursdaySafety() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var statusSheet = ss.getSheetByName('Order Status');
  var activeCell = ss.getRange('P45');
  var cellValue = activeCell.getValue();
  
  if (cellValue == 'NOT SENT') { 
    return;
  }
  else {
    onChange();
  }
}

function mondaysafetyOn() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var statusSheet = ss.getSheetByName('Order Status');
    
  ss.getRange('P22').setValue('SENT');
  
  return;
}

function thursdaysafetyOn() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var statusSheet = ss.getSheetByName('Order Status');
    
  ss.getRange('P45').setValue('SENT');
  
  return;
}

function mondaysafetyOff() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var statusSheet = ss.getSheetByName('Order Status');
    
  ss.getRange('P22').setValue('NOT SENT');
  
  return;
}

function thursdaysafetyOff() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var statusSheet = ss.getSheetByName('Order Status');
    
  ss.getRange('P45').setValue('NOT SENT');
  
  return;
}

// From this point: Past due reminders for each party on each order day

function mondayPastDue() {
   
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  ss.getSheetByName('Order Status');

  statusOne = ss.getRange('F4').getValue();
  statusTwo = ss.getRange('F7').getValue();
  statusThree = ss.getRange('F10').getValue();
  statusFour = ss.getRange('F13').getValue();
  statusFive = ss.getRange('F16').getValue();
  statusSix = ss.getRange('F19').getValue();
  statusSeven = ss.getRange('F22').getValue();
  statusRob = ss.getRange('N16').getValue();

  if ( statusOne == 0) { 
    MailApp.sendEmail('annastaqueria1@gmail.com,caesar@grubel.org', 'Produce Order Past Due Reminder', "Greetings!\n \nThe produce order for Anna\'s Taqueria #1 is PAST DUE.\n \nPlease, enter your order information as soon as possible.\n \nCheers!\n \n \nCaesar Grubel\n \nPS: This message was generated by an automated system and does not accept replies.", noReply=true);   // Sends the past due reminder email to location #1
  }
  else if ( statusTwo == 0) { 
    MailApp.sendEmail('annastaqueria2@gmail.com,caesar@grubel.org', 'Produce Order Past Due Reminder', "Greetings!\n \nThe produce order for Anna\'s Taqueria #2 is PAST DUE.\n \nPlease, enter your order information as soon as possible.\n \nCheers!\n \n \nCaesar Grubel\n \nPS: This message was generated by an automated system and does not accept replies.", noReply=true);   // Sends the past due reminder email to location #2
  }
  else if ( statusThree == 0) { 
    MailApp.sendEmail('annastaqueria3@gmail.com,caesar@grubel.org', 'Produce Order Past Due Reminder', "Greetings!\n \nThe produce order for Anna\'s Taqueria #3 is PAST DUE.\n \nPlease, enter your order information as soon as possible.\n \nCheers!\n \n \nCaesar Grubel\n \nPS: This message was generated by an automated system and does not accept replies.", noReply=true);   // Sends the past due reminder email to location #3
  }
  else if ( statusFour == 0) { 
    MailApp.sendEmail('annastaqueria4@gmail.com,caesar@grubel.org', 'Produce Order Past Due Reminder', "Greetings!\n \nThe produce order for Anna\'s Taqueria #4 is PAST DUE.\n \nPlease, enter your order information as soon as possible.\n \nCheers!\n \n \nCaesar Grubel\n \nPS: This message was generated by an automated system and does not accept replies.", noReply=true);   // Sends the past due reminder email to location #4
  }
  else if ( statusFive == 0) { 
    MailApp.sendEmail('annastaqueria5@gmail.com,caesar@grubel.org', 'Produce Order Past Due Reminder', "Greetings!\n \nThe produce order for Anna\'s Taqueria #5 is PAST DUE.\n \nPlease, enter your order information as soon as possible.\n \nCheers!\n \n \nCaesar Grubel\n \nPS: This message was generated by an automated system and does not accept replies.", noReply=true);   // Sends the past due reminder email to location #5
  }
  else if ( statusSix == 0) { 
    MailApp.sendEmail('annastaqueria6@gmail.com,caesar@grubel.org', 'Produce Order Past Due Reminder', "Greetings!\n \nThe produce order for Anna\'s Taqueria #6 is PAST DUE.\n \nPlease, enter your order information as soon as possible.\n \nCheers!\n \n \nCaesar Grubel\n \nPS: This message was generated by an automated system and does not accept replies.", noReply=true);   // Sends the past due reminder email to location #6
  }
  else if ( statusSeven == 0) { 
    MailApp.sendEmail('annastaqueria7@gmail.com,caesar@grubel.org', 'Produce Order Past Due Reminder', "Greetings!\n \nThe produce order for Anna\'s Taqueria #7 is PAST DUE.\n \nPlease, enter your order information as soon as possible.\n \nCheers!\n \n \nCaesar Grubel\n \nPS: This message was generated by an automated system and does not accept replies.", noReply=true);   // Sends the past due reminder email to location #7
  }
  else if ( statusRob == 0) { 
    MailApp.sendEmail('rob@annastaqueria.com,caesar@grubel.org', 'Produce Order Past Due Reminder', "Greetings!\n \nThe produce prices confirmation for today is PAST DUE.\n \nPlease, confirm the pricing information for each produce vendor ASAP.\n \nCheers!\n \n \nCaesar Grubel\n \nPS: This message was generated by an automated system and does not accept replies.", noReply=true);   // Sends the past due reminder email to Rob Favuzza
  }
  else {
    return;
  }
}

function thursdayPastDue() {
   
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  ss.getSheetByName('Order Status');

  statusOne = ss.getRange('F27').getValue();
  statusTwo = ss.getRange('F30').getValue();
  statusThree = ss.getRange('F33').getValue();
  statusFour = ss.getRange('F36').getValue();
  statusFive = ss.getRange('F39').getValue();
  statusSix = ss.getRange('F42').getValue();
  statusSeven = ss.getRange('F45').getValue();
  statusRob = ss.getRange('N39').getValue();

  if ( statusOne == 0) { 
    MailApp.sendEmail('annastaqueria1@gmail.com,caesar@grubel.org', 'Produce Order Past Due Reminder', "Greetings!\n \nThe produce order for Anna\'s Taqueria #1 is PAST DUE.\n \nPlease, enter your order information as soon as possible.\n \nCheers!\n \n \nCaesar Grubel\n \nPS: This message was generated by an automated system and does not accept replies.", noReply=true);   // Sends the past due reminder email to location #1
  }
  else if ( statusTwo == 0) { 
    MailApp.sendEmail('annastaqueria2@gmail.com,caesar@grubel.org', 'Produce Order Past Due Reminder', "Greetings!\n \nThe produce order for Anna\'s Taqueria #2 is PAST DUE.\n \nPlease, enter your order information as soon as possible.\n \nCheers!\n \n \nCaesar Grubel\n \nPS: This message was generated by an automated system and does not accept replies.", noReply=true);   // Sends the past due reminder email to location #2
  }
  else if ( statusThree == 0) { 
    MailApp.sendEmail('annastaqueria3@gmail.com,caesar@grubel.org', 'Produce Order Past Due Reminder', "Greetings!\n \nThe produce order for Anna\'s Taqueria #3 is PAST DUE.\n \nPlease, enter your order information as soon as possible.\n \nCheers!\n \n \nCaesar Grubel\n \nPS: This message was generated by an automated system and does not accept replies.", noReply=true);   // Sends the past due reminder email to location #3
  }
  else if ( statusFour == 0) { 
    MailApp.sendEmail('annastaqueria4@gmail.com,caesar@grubel.org', 'Produce Order Past Due Reminder', "Greetings!\n \nThe produce order for Anna\'s Taqueria #4 is PAST DUE.\n \nPlease, enter your order information as soon as possible.\n \nCheers!\n \n \nCaesar Grubel\n \nPS: This message was generated by an automated system and does not accept replies.", noReply=true);   // Sends the past due reminder email to location #4
  }
  else if ( statusFive == 0) { 
    MailApp.sendEmail('annastaqueria5@gmail.com,caesar@grubel.org', 'Produce Order Past Due Reminder', "Greetings!\n \nThe produce order for Anna\'s Taqueria #5 is PAST DUE.\n \nPlease, enter your order information as soon as possible.\n \nCheers!\n \n \nCaesar Grubel\n \nPS: This message was generated by an automated system and does not accept replies.", noReply=true);   // Sends the past due reminder email to location #5
  }
  else if ( statusSix == 0) { 
    MailApp.sendEmail('annastaqueria6@gmail.com,caesar@grubel.org', 'Produce Order Past Due Reminder', "Greetings!\n \nThe produce order for Anna\'s Taqueria #6 is PAST DUE.\n \nPlease, enter your order information as soon as possible.\n \nCheers!\n \n \nCaesar Grubel\n \nPS: This message was generated by an automated system and does not accept replies.", noReply=true);   // Sends the past due reminder email to location #6
  }
  else if ( statusSeven == 0) { 
    MailApp.sendEmail('annastaqueria7@gmail.com,caesar@grubel.org', 'Produce Order Past Due Reminder', "Greetings!\n \nThe produce order for Anna\'s Taqueria #7 is PAST DUE.\n \nPlease, enter your order information as soon as possible.\n \nCheers!\n \n \nCaesar Grubel\n \nPS: This message was generated by an automated system and does not accept replies.", noReply=true);   // Sends the past due reminder email to location #7
  }
  else if ( statusRob == 0) { 
    MailApp.sendEmail('rob@annastaqueria.com,caesar@grubel.org', 'Produce Order Past Due Reminder', "Greetings!\n \nThe produce prices confirmation for today is PAST DUE.\n \nPlease, confirm the pricing information for each produce vendor ASAP.\n \nCheers!\n \n \nCaesar Grubel\n \nPS: This message was generated by an automated system and does not accept replies.", noReply=true);   // Sends the past due reminder email to Rob Favuzza
  }
  else {
    return;
  }
}
