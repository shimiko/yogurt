
//--- main
function temprature(reply_token, num){
  var reply_data;
  var res;
  var chart_file;
  var temp_data;
  var msg;
  var img_url;
  
  //get latest temprature data
  temp_data = getLatestTempData();

  if (temp_data == null) {
    msg = "最新データ取得に失敗";
  }
  else{
    msg = temp_data;
  }

  //creat chart file 
  chart_file = createChartFile();
  
  if (chart_file == null) {
    msg = msg + " !グラフを作るのに失敗";
  }
  else{
    img_url = DL_BASE_URL + chart_file.getId();
  }
  
  //send message 
  reply_data = {
    "replyToken":reply_token,
    "messages":[
        {
            "type": "text",
            "text": msg
        },
        {
            "type": "image",
            "originalContentUrl": img_url,
            "previewImageUrl": img_url
        }
    ]
  }
  replyMessage(createReplyParams(reply_data));


  //delete chart file
}

function getLatestTempData(){
  var lastest_data;

  // get Shpread Sheet
  var ss = SpreadsheetApp.openById(SPREAD_ID); 
  var sheet = ss.getSheetByName(SHEET_NAME); 
  
  // get Data
  latest_data = "<最新データ>\n"
                + sheet.getRange(1,SS_DATE_COL_NUM).getValue() + ":" 
                + sheet.getRange(2,SS_DATE_COL_NUM).getValue()
                + "\n"
                + sheet.getRange(1,SS_TEMP_COL_NUM).getValue() + ":" 
                + sheet.getRange(2,SS_TEMP_COL_NUM).getValue();
  
  return latest_data;
}

//-- not used
function createChartFile() {
  var chart_file;
  var chart_data;
  var chart_blob;

  // get Shpread Sheet
  var ss = SpreadsheetApp.openById(SPREAD_ID); 
  var sheet = ss.getSheetByName(SHEET_NAME); 

  // create chart data
  chart_data = Charts.newDataTable()
      .addColumn(Charts.ColumnType.DATE, '日時')
      .addColumn(Charts.ColumnType.NUMBER, '室温');

  for(var i = SS_TEMP_MAX_DATA+1; i > 1; i--){
    chart_data.addRow([sheet.getRange(i,SS_DATE_COL_NUM).getValue(),
                       sheet.getRange(i,SS_TEMP_COL_NUM).getValue()]);
  }
  chart_data.build();

  chart_blob = Charts.newLineChart()
      .setDataTable(chart_data)
      .setOption("hAxis.format", "M/d H:m")
      .setPointStyle(Charts.PointStyle.LARGE)
      .setRange(0, 38)
      .build()
      .getBlob();  

  var drive = DriveApp.getFolderById(FOLDER_ID);
  chart_file = drive.createFile(chart_blob);
  chart_file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  // メールで作成したグラフ画像を埋め込んで送信
  MailApp.sendEmail({
    to: 'shimizu.yum@gmail.com', // 自分用に変更する
    subject: '【test】GASでChart',
    htmlBody: "チャートサンプル：<img src='cid:sampleCharts'> です! "+ chart_file.getDownloadUrl() + "<br>",
    inlineImages: {
      sampleCharts: chart_blob
    }
  });

  return chart_file;
}
