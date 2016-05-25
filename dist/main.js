/**
 * Created by yangl on 2016/5/15.
 */
function getParams(key) {
    var keyList = [];
    var valueList = [];
    var hrefStr = decodeURIComponent(window.location.href);
    var strArray = hrefStr.split("?");
    var paramStr = strArray[1];
    if ((paramStr != null) && (paramStr != null)) {
        var paramArray = paramStr.split("&");
        for (var i = 0; i < paramArray.length; i++) {
            var param = paramArray[i];
            valueList.push(param.substr(param.indexOf("=") + 1));
            keyList.push(param.substr(0, param.indexOf("=")));
        }
        for (var j = 0; j < keyList.length; j++) {
            if (key == keyList[j]) {
                return valueList[j];
            }
        }
    }
}


function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  decodeURI(r[2]); return null;
}