This Sandbox is proprietary software.
Please do not modify or redistribute without written permission.

```js
// This code is MIT-licensed. You can do whatever you want :))
function requestFullScreen(element) {
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

    if (requestMethod) { 
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { 
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

var elem = document.getElementsByTagName("html")[0];
requestFullScreen(elem);
```
