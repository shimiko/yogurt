function peso(reply_token, id, peso){
  var peso_data;
  var res;
  var diff_peso;
  var msg;
  var reply_data;
  //var name = getUserName(id);
  var name = "";
  
  //egist peso
  peso_data = {
    "method" : "post",
    "contentType" : "application/json",
    "payload" : JSON.stringify({"id":id, "peso":peso})
  }
  
  res = UrlFetchApp.fetch(PESO_URL, peso_data);
  if (res.getResponseCode() != 200){
    UrlFetchApp.fetch(REPLY_URL, createReplyErrParams());
    return;
  }
  
  //set message
  diff_peso = JSON.parse(res).diff_peso;
  
  if (diff_peso > 0) {
    msg = name + " " + diff_peso + " 増えとる(｀Д´)";
  }
  else if (diff_peso < 0) {
    msg　= name + " " + -1 * diff_peso + " 減っとる( ﾟдﾟ )";
  }
  else if (diff_peso == 0) {
    msg = name + "変わっとらん(・ω・)";
  }
  else {
    msg　= name + "痩せるといいね(・ω・)";
  }
    
  //reply
  reply_data = {
    "replyToken":reply_token,
    "messages":[
        {
            "type":"text",
            "text":"登録しました(｀Д´)  "+msg
        },
        {
            "type":"text",
            "text":PESO_GLAPH
        }
    ]
  }
  replyMessage(createReplyParams(reply_data));
}
