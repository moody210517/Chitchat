var d = document;
var winIE = (navigator.userAgent.indexOf("Opera")==-1 && (d.getElementById &&  d.documentElement.behaviorUrns))  ? true : false;

function bodySize(){
	if(winIE && d.documentElement.clientWidth) {
		sObj = d.getElementById("min-width").style;
		sObj.width = (d.documentElement.clientWidth<=940) ? "940px" : "100%";
	}
}
function init(){
	if(winIE) { bodySize(); }
 }
 
onload = init;

if(winIE) { onresize = bodySize; }