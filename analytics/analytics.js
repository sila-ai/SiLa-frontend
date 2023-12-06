const startTime = new Date();
var scripts = document.getElementsByTagName("script");
let lastScript = scripts[scripts.length - 1].src.split('=');
if(lastScript.length > 0) lastScript = lastScript[1];
const device = navigator.userAgent;
const url = window.location.href;
document.addEventListener('visibilitychange', function logData() {
  if(document.visibilityState === 'hidden') {
    const totalTime = (new Date() - startTime) / 1000;
    navigator.sendBeacon(`https://api.silasuite.com/analytics?id=${lastScript}&device=${device}&url=${url}&time=${totalTime}`);
  }
});
