
//---
function oraErr(reply_token, num){
  var reply_data;
  var res;
  var msg;
  
  res = UrlFetchApp.fetch(ORAERR_URL_BASE + 'ora/' + num);
  if (res.getResponseCode() != 200){
    replyMessage(createReplyErrParams());
    return;
  } 
  
  if (JSON.parse(res.getContentText()).msg.match(/not found/)) {
    msg = "そんなんありませんけど(｀Д´)";
  }
  else{
    msg = JSON.parse(res.getContentText()).msg;
  }
  
  reply_data = {
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
