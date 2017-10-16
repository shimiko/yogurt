function randomMsg(reply_token){
  var recv_message;
  var reply_data;
  var msgs=["お腹減った","(・ω・)","お腹減った(｀Д´)","ぼくもうねむいよ","ﾌｰﾝ","( ﾟдﾟ )ﾎｹﾞｪ…","ﾓｸﾞﾓｸﾞ"];
  
  reply_data = {
    "replyToken":reply_token,
    "messages":[
        {
            "type":"text",
            "text":msgs[Math.floor(Math.random()*7)]
        }
    ]
  }
  replyMessage(createReplyParams(reply_data));
}

