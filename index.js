function id(idStr) {
  return document.getElementById(idStr);
}
function domClick(idStr, fuc) {
  id(idStr)?.addEventListener("click", fuc);
}
function getPermission() {
  Notification.requestPermission().then((permission) => {
    setText("loca-show", permission, true);
    if (permission === "granted") {
      alert("可以使用本地通知测试");
    }
  });
}
function displayNotification(title, options) {
    if(!Notification){
        alert('浏览器不支持通知！')
    }
    if (Notification.permission === "granted") {
      navigator.serviceWorker
        ?.getRegistration()
        .then(function (registration) {
          if (registration?.showNotification) {
            registration?.showNotification(title, options);
          } else {
            new Notification(title, options);
          }
        });
    }else{
        alert('无通知权限或权限被禁用！')
    }
  }

//本地推送测试
document.getElementById("msg_local_test").addEventListener("click", () => {
  const title = id("title_1").value;
  if (!title) {
    alert("请输入本地测试推送标题");
    return;
  }
  const cData = id("data_1").value;
  if (!cData) {
    alert("请输入本地测试推送内容");
    return;
  }
  try {
    const json = JSON.parse(cData);
    displayNotification(title,json)
  } catch (error) {
    alert("内容不是合法JSON字符串");
  }
});
function setText(idStr, text, notAdd = false) {
  let dom = id(idStr);
  dom.innerHTML = notAdd
    ? JSON.stringify(text)
    : dom.innerHTML + JSON.stringify(text) + "</br>";
}


function init() {
  let appkey = id("appkey").value;
  let userStr = id("userstr").value;
  if (!(appkey && userStr)) {
    alert("appkey与userstr都不能为空！");
    return 
  }
  //推送初始化
  MTpushInterface.init({
    appkey: appkey,
    user_str: userStr,
    fail(d) {
      setText("init-1", "在线推送创建失败:");
      setText("init-1", d);
    },
    success(d) {
      setText("init-1", "在线推送创建成功:");
      setText("init-1", d);
    },
    webPushcallback(code, tip) {
      setText("init-1", "状态码及提示code:" + code + " | tip:" + tip);
    },
    canGetInfo(d) {
      //此时可以得到RegId 也可以在d里面取到所有的数据
      setText("init-2", d);
      // MTpushInterface.setTagsAlias({ tags: ["test1", "test2"], alias: "swefgwwefwfwfwf" });
    },
    custom: (res) => {
      //当使用自定义提示配置时，需调用res来请求并配置权限
      domClick("subscribe", () => {
        if (Notification.permission === "default") {
          res();
        } else {
          if (Notification.permission === "denied") {
            alert("权限已禁用，无法申请权限！");
          } else {
            alert("已有通知权限无需申请！");
          }
        }
      });
    },
  });
}
//初始化
domClick('init',init);
//检查在线服务状态
domClick('checkserver',()=>{
    setText("mtserver", MTpushInterface.getPushAuthority());
});
//获取RegistrationID
domClick('getrid',()=>{
    setText("ridshow", MTpushInterface.getRegistrationID());
});
//检查浏览器通知权限
domClick("check", () => {
  setText("permission", MTpushInterface.getWebPermission(), true);
});
//给当前用户取消订阅停止推送
domClick("unSubscribe", () => {
  console.log(MTpushInterface.unSubscribe());
  alert("已申请取消订阅，该用户下次订阅前不会收到网站消息！");
});
domClick('clearnmsg',()=>{
    id('msgshow').innerHTML=''
})
domClick('clearnapi',()=>{
    ['init-1','init-2','mtserver','ridshow','permission'].forEach(str=>{
        id(str).innerHTML=''
    })
    
})
function addSdk(url, s = "script", d = document) {
  if (!document.getElementById(url)) {
    const j = d.createElement("script");
    j.async = true;
    j.src = url;
    j.id = url;
    const s0 = d.getElementsByTagName(s)[0];
    s0.parentNode.insertBefore(j, s0);
  }
}

addSdk("./webPushSdk.produce.min.2.1.9.js");
window.MTpushInterfaceReady = () => {
// 极光通道断开连接时的回调
MTpushInterface.mtPush.onDisconnect(function () {
  setText("init-2", 'onDisconnect,MT通道断开连接！');
});
//得到推送消息(web推送，浏览器厂商通道)
MTpushInterface.onMsgReceive((msgData) => {
  //msgData数据结构{data:{xxx},type:0} type:0是极光通道，1是系统通道
  setText("msgshow", '得到推送消息');
  setText("msgshow", msgData);
});
};

//基它接口示例
// MTpushInterface.setTagsAlias({ tags: ["test1", "test2"], alias: "swefgwwefwfwfwf" });
