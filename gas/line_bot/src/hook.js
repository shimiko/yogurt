
function doGet() {
   return ContentService.createTextOutput("test1");
}

function doPost(e) {
  var reply_token;
  var recv_message;
  
  // get request data
  reply_token = JSON.parse(e.postData.contents).events[0].replyToken;
  recv_message = JSON.parse(e.postData.contents).events[0].message.text;
  
  if (recv_message.match(/^[0-9]+$/)){
    oraErr(reply_token, recv_message);
  } 
  else if (recv_message.match(/室温/)){
    temprature(reply_token);
  }
  else if (recv_message.match(/しみこ/)){
    randomMsg(reply_token);
  }
  else if (recv_message.match(/[0-9]+[ペソ|ぺそ|ﾍﾟｿ]/)){
    //peso(reply_token, JSON.parse(e.postData.contents).events[0].source.userId, recv_message.replace(/[ペソ|ぺそ|ﾍﾟｿ]/g, ""));
    peso(reply_token, "shimizu", recv_message.replace(/[ペソ|ぺそ|ﾍﾟｿ]/g, ""));
  }
  
  return ContentService.createTextOutput("");
}

//-- util ---------------------------------------------------------------------
function replyMessage(reply_params){
  UrlFetchApp.fetch(REPLY_URL, reply_params);
}

//------
function createReplyParams(reply_data){
  var reply_params = {
    "method" : "post",
    "contentType" : "application/json",
    "headers" : {'Authorization' : 'Bearer ' +  TOKEN},
    "payload" : JSON.stringify(reply_data)
  };
  
  return reply_params;
}

//-----
function createReplyErrParams(){
  var reply_data = {
    "replyToken":reply_token,
    "messages":[
        {
            "type":"text",
            "text":"いまちょっと忙しいから無理(｀Д´)"
        }
    ]
  };
  var reply_params = {
    "method" : "post",
    "contentType" : "application/json",
    "headers" : {'Authorization' : 'Bearer ' +  TOKEN},
    "payload" : JSON.stringify(reply_data)
  };
  
  return reply_params;
}

//-----
function getUserName(id){
  var reply_params = {
    "method" : "get",
    "headers" : {'Authorization' : 'Bearer ' +  TOKEN}
  };
  
  var res = UrlFetchApp.fetch(BASE_URL + id, reply_params);
  if (res.getResponseCode() != 200){
    return "***";
  }
  
  return JSON.parse(res).displayName;
}

//------
function test(reply_token, msg){
  var reply_data = {
    "replyToken":reply_token,
    "messages":[
        {
            "type":"text",
            "text":msg
        }
    ]
  }
  replyMessage(createReplyParams(reply_data));
}
