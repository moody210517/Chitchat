/*#############################################################
Name: Niceforms
Version: 2.0
Author: Lucian Slatineanu
URL: http://www.emblematiq.com/projects/niceforms/

Feel free to use and modify but please keep this copyright intact.
#################################################################*/


//Theme Variables - edit these to match your theme

var selectRightWidthSimple = 19;
var selectRightWidthScroll = 2;
var selectMaxHeight = 200;
var textareaTopPadding = 10;
var textareaSidePadding = 10;

//Global Variables
var ABK = new Array();
var isIE = false;
var resizeTest = 1;

//Initialization function
function ABKInit() {
	try {
		document.execCommand('BackgroundImageCache', false, true);
	} catch(e) {}
	if(!document.getElementById) {return false;}
	//alert("click me first");
	ABKDo('start');
}
function ABKDo(what) {
	var abkstyles = document.getElementsByTagName('form');
	var identifier = new RegExp('(^| )'+'nostyle'+'( |$)');
	if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
		var ieversion=new Number(RegExp.$1);
		if(ieversion < 6) {return false;} //exit script if IE6
		isIE = true;
	}
	for(var q = 0; q < abkstyles.length; q++) {if(!identifier.test(abkstyles[q].className)) {
		if(what == "start") { //Load  
			ABK[q] = new abkstyle(abkstyles[q]);
			abkstyles[q].start();
		}
		else { //Unload  
			abkstyles[q].unload();
			ABK[q] = "";
		}
	}}
}
function ABKFix() {
	ABKDo('stop');
	ABKDo('start');
}
function abkstyle(abk) {
	abk._inputText = new Array(); abk._inputRadio = new Array(); abk._inputCheck = new Array(); abk._inputSubmit = new Array(); abk._inputFile = new Array(); abk._textarea = new Array(); abk._select = new Array(); abk._multiselect = new Array();
	abk.add_inputText = function(obj) {this._inputText[this._inputText.length] = obj; inputText(obj);}
	abk.add_inputRadio = function(obj) {this._inputRadio[this._inputRadio.length] = obj; inputRadio(obj);}
	abk.add_inputCheck = function(obj) {this._inputCheck[this._inputCheck.length] = obj; inputCheck(obj);}
	abk.add_inputSubmit = function(obj) {this._inputSubmit[this._inputSubmit.length] = obj; inputSubmit(obj);}
	abk.add_inputFile = function(obj) {this._inputFile[this._inputFile.length] = obj; inputFile(obj);}
	abk.add_textarea = function(obj) {this._textarea[this._textarea.length] = obj; textarea(obj);}
	abk.add_select = function(obj) {this._select[this._select.length] = obj; selects(obj);}
	abk.add_multiselect = function(obj) {this._multiselect[this._multiselect.length] = obj; multiSelects(obj);}
	abk.start = function() {
		//Separate and assign elements
		var allInputs = this.getElementsByTagName('input');
		for(var w = 0; w < allInputs.length; w++) {
			switch(allInputs[w].type) {
				case "text": case "password": {this.add_inputText(allInputs[w]); break;}
				//case "radio": {this.add_inputRadio(allInputs[w]); break;}
				//case "checkbox": {this.add_inputCheck(allInputs[w]); break;}
				//case "submit": case "reset": case "button": {this.add_inputSubmit(allInputs[w]); break;}
				case "file": {this.add_inputFile(allInputs[w]); break;}
			}
		}
		var allButtons = this.getElementsByTagName('button');
		for(var w = 0; w < allButtons.length; w++) {
			this.add_inputSubmit(allButtons[w]);
		}
		var allTextareas = this.getElementsByTagName('textarea');
		for(var w = 0; w < allTextareas.length; w++) {
			this.add_textarea(allTextareas[w]);
		}
		var allSelects = this.getElementsByTagName('select');
		for(var w = 0; w < allSelects.length; w++) {
			if(allSelects[w].size != "2") {this.add_select(allSelects[w]);}
			else {this.add_multiselect(allSelects[w]);}
		}
		//Start
		for(w = 0; w < this._inputText.length; w++) {this._inputText[w].init();}
		for(w = 0; w < this._inputRadio.length; w++) {this._inputRadio[w].init();}
		for(w = 0; w < this._inputCheck.length; w++) {this._inputCheck[w].init();}
		for(w = 0; w < this._inputSubmit.length; w++) {this._inputSubmit[w].init();}
		for(w = 0; w < this._inputFile.length; w++) {this._inputFile[w].init();}
		for(w = 0; w < this._textarea.length; w++) {this._textarea[w].init();}
		for(w = 0; w < this._select.length; w++) {this._select[w].init(w);}
		for(w = 0; w < this._multiselect.length; w++) {this._multiselect[w].init(w);}
	}
	abk.unload = function() {
		//Stop
		for(w = 0; w < this._inputText.length; w++) {this._inputText[w].unload();}
		for(w = 0; w < this._inputRadio.length; w++) {this._inputRadio[w].unload();}
		for(w = 0; w < this._inputCheck.length; w++) {this._inputCheck[w].unload();}
		for(w = 0; w < this._inputSubmit.length; w++) {this._inputSubmit[w].unload();}
		for(w = 0; w < this._inputFile.length; w++) {this._inputFile[w].unload();}
		for(w = 0; w < this._textarea.length; w++) {this._textarea[w].unload();}
		for(w = 0; w < this._select.length; w++) {this._select[w].unload();}
		for(w = 0; w < this._multiselect.length; w++) {this._multiselect[w].unload();}
	}
}
function inputText(el) { //extent Text inputs
	el.oldClassName = el.className;
	el.left = document.createElement('div');
	el.left.className = "ABKTextLeft";	
	el.right = document.createElement('div');
	el.right.className = "ABKTextRight";
	
	input_width = el.style.width;
	new_width = new Number(input_width.replace("px",""));
	new_width = new_width + 14;
	el.right.style.width=new_width+"px";	
	
	el.dummy = document.createElement('div');
	el.dummy.className = "ABKTextCenter";
	el.onfocus = function() {
		this.dummy.className = "ABKTextCenter ABKh";
		this.left.className = "ABKTextLeft ABKh";
		this.right.className = "ABKTextRight ABKh";
	}
	el.onblur = function() {
		this.dummy.className = "ABKTextCenter";
		this.left.className = "ABKTextLeft";
		this.right.className = "ABKTextRight";
	}
	el.init = function() {
	
		this.right.appendChild(this.left);
		this.left.appendChild(this.dummy);	
	
		this.parentNode.appendChild(this.right);
		this.parentNode.insertBefore(this.right, this.nextSibling);
		this.dummy.appendChild(this);
		
		this.className = "ABKText";
		this.style.visibility = "visible";
	}
	el.unload = function() {
		this.parentNode.parentNode.appendChild(this);
		this.left.removeChild(this.dummy);
		this.right.removeChild(this.left);
		this.parentNode.removeChild(this.right);
		this.className = this.oldClassName;
	}
}
function inputRadio(el) { //extent Radio buttons
	el.oldClassName = el.className;
	el.dummy = document.createElement('div');
	if(el.checked) {el.dummy.className = "ABKRadio ABKh2";}
	else {el.dummy.className = "ABKRadio";}
	el.dummy.ref = el;
	//if(isIE == false) {el.dummy.style.left = findPosX(el) + 'px'; el.dummy.style.top = findPosY(el) + 'px';}
	//else {el.dummy.style.left = findPosX(el) + 4 + 'px'; el.dummy.style.top = findPosY(el) + 4 + 'px';}
	el.dummy.onclick = function() {
		if(!this.ref.checked) {
			var siblings = getInputsByName(this.ref.name);
			for(var q = 0; q < siblings.length; q++) {
				siblings[q].checked = false;
				siblings[q].dummy.className = "ABKRadio";
			}
			this.ref.checked = true;
			this.className = "ABKRadio ABKh2";
		}
	}
	el.onclick = function() {
		if(this.checked) {
			var siblings = getInputsByName(this.name);
			for(var q = 0; q < siblings.length; q++) {
				siblings[q].dummy.className = "ABKRadio";
			}
			this.dummy.className = "ABKRadio ABKh2";
		}
	}
	el.onfocus = function() {this.dummy.className += " ABKfocused";}
	el.onblur = function() {this.dummy.className = this.dummy.className.replace(/ ABKfocused/g, "");}
	el.init = function() {
		this.parentNode.insertBefore(this.dummy, this);
		el.className = "ABKhidden";
	}
	el.unload = function() {
		this.parentNode.removeChild(this.dummy);
		this.className = this.oldClassName;
	}
}
function inputCheck(el) { //extend Checkboxes
	el.oldClassName = el.className;
	el.dummy = document.createElement('img');
	el.dummy.src = imagesPath + "0.png";
	if(el.checked) {el.dummy.className = "ABKCheck ABKh2";}
	else {el.dummy.className = "ABKCheck";}
	el.dummy.ref = el;
	//if(isIE == false) {el.dummy.style.left = findPosX(el) + 'px'; el.dummy.style.top = findPosY(el) + 'px';}
	//else {el.dummy.style.left = findPosX(el) + 4 + 'px'; el.dummy.style.top = findPosY(el) + 4 + 'px';}
	el.dummy.onclick = function() {
		if(!this.ref.checked) {
			this.ref.checked = true;
			this.className = "ABKCheck ABKh2";
		}
		else {
			this.ref.checked = false;
			this.className = "ABKCheck";
		}
	}
	el.onclick = function() {
		if(this.checked) {this.dummy.className = "ABKCheck ABKh2";}
		else {this.dummy.className = "ABKCheck";}
	}
	el.onfocus = function() {this.dummy.className += " ABKfocused";}
	el.onblur = function() {this.dummy.className = this.dummy.className.replace(/ ABKfocused/g, "");}
	el.init = function() {
		this.parentNode.insertBefore(this.dummy, this);
		el.className = "ABKhiddenCheck";
	} 
	el.unload = function() {
		this.parentNode.removeChild(this.dummy);
		this.className = this.oldClassName;
	}
}
function inputSubmit(el) { //extend Buttons
	el.oldClassName = el.className;
	el.left = document.createElement('div');
	el.left.className = "ABKButtonLeft";

	el.right = document.createElement('img');
	el.right.src = imagesPath + "0.png";
	el.right.className = "ABKButtonRight";
	el.onmouseover = function() {
		this.className = "ABKButton ABKh";
		this.left.className = "ABKButtonLeft ABKh";
		this.right.className = "ABKButtonRight ABKh";
	}
	el.onmouseout = function() {
		this.className = "ABKButton";
		this.left.className = "ABKButtonLeft";
		this.right.className = "ABKButtonRight";
	}
	el.init = function() {
		this.parentNode.insertBefore(this.left, this);
		this.parentNode.insertBefore(this.right, this.nextSibling);
		this.className = "ABKButton";
	}
	el.unload = function() {
		this.parentNode.removeChild(this.left);
		this.parentNode.removeChild(this.right);
		this.className = this.oldClassName;
	}
}
function inputFile(el) { //extend File inputs
	el.oldClassName = el.className;
	el.dummy = document.createElement('div');
	el.dummy.className = "ABKFile";
	el.file = document.createElement('div');
	el.file.className = "ABKFileNew";
	el.center = document.createElement('div');
	el.center.className = "ABKTextCenter";
	el.clone = document.createElement('input');
	el.clone.type = "text";
	el.clone.className = "ABKText";
	el.clone.ref = el;

	el.button = document.createElement('img');
	el.button.src = imagesPath + "0.png";
	el.button.className = "ABKFileButton";
	el.button.ref = el;
	
	el.left = document.createElement('div');
	el.left.className = "ABKTextLeft";
	
	el.right = document.createElement('div');
	el.right.className = "ABKTextRight";
	el.init = function() {
		var top = this.parentNode;
		if(this.previousSibling) {var where = this.previousSibling;}
		else {var where = top.childNodes[0];}
		top.insertBefore(this.dummy, where);
		
		this.right.appendChild(this.left);
		//this.left.appendChild(this.dummy);

		this.file.appendChild(this.right);
		//this.parentNode.insertBefore(this.right, this.nextSibling);
		//this.dummy.appendChild(this);
		
		
//		this.dummy.appendChild(this);
		this.center.appendChild(this.clone);
		this.left.appendChild(this.center);
//		this.file.insertBefore(this.left, this.center);
		this.center.appendChild(this.button);
		this.dummy.appendChild(this.file);

		if(isIE) this.className = "ABKhidden2IE";
		else this.className = "ABKhidden2";
		this.relatedElement = this.clone;

	}
	el.unload = function() {
		this.parentNode.parentNode.appendChild(this);
		this.parentNode.removeChild(this.dummy);
		this.className = this.oldClassName;
	}
	el.onchange = el.onmouseout = function() {this.relatedElement.value = this.value;}
	el.onfocus = function() {
		this.left.className = "ABKTextLeft ABKh";
		this.center.className = "ABKTextCenter ABKh";
		this.button.className = "ABKFileButton ABKh";
	}
	el.onblur = function() {
		this.left.className = "ABKTextLeft";
		this.center.className = "ABKTextCenter";
		this.button.className = "ABKFileButton";
	}
	el.onselect = function() {
		this.relatedElement.select();
		this.value = '';
	}
}
function textarea(el) { //extend Textareas
	el.oldClassName = el.className;
	el.height = el.offsetHeight - textareaTopPadding;
	el.width = el.offsetWidth - textareaSidePadding;
	el.topLeft = document.createElement('img');
	el.topLeft.src = imagesPath + "0.png";
	el.topLeft.className = "ABKTextareaTopLeft";
	el.topRight = document.createElement('div');
	el.topRight.className = "ABKTextareaTop";
	el.bottomLeft = document.createElement('img');
	el.bottomLeft.src = imagesPath + "0.png";
	el.bottomLeft.className = "ABKTextareaBottomLeft";
	el.bottomRight = document.createElement('div');
	el.bottomRight.className = "ABKTextareaBottom";
	el.left = document.createElement('div');
	el.left.className = "ABKTextareaLeft";
	el.right = document.createElement('div');
	el.right.className = "ABKTextareaRight";
	el.init = function() {
		var top = this.parentNode;
		if(this.previousSibling) {var where = this.previousSibling;}
		else {var where = top.childNodes[0];}
		top.insertBefore(el.topRight, where);
		top.insertBefore(el.right, where);
		top.insertBefore(el.bottomRight, where);
		this.topRight.appendChild(this.topLeft);
		this.right.appendChild(this.left);
		this.right.appendChild(this);
		this.bottomRight.appendChild(this.bottomLeft);
		el.style.width = el.topRight.style.width = el.bottomRight.style.width = el.width + 'px';
		el.style.height = el.left.style.height = el.right.style.height = el.height + 'px';
		this.className = "ABKTextarea";
	}
	el.unload = function() {
		this.parentNode.parentNode.appendChild(this);
		this.parentNode.removeChild(this.topRight);
		this.parentNode.removeChild(this.bottomRight);
		this.parentNode.removeChild(this.right);
		this.className = this.oldClassName;
		this.style.width = this.style.height = "";
	}
	el.onfocus = function() {
		this.topLeft.className = "ABKTextareaTopLeft ABKh";
		this.topRight.className = "ABKTextareaTop ABKhr";
		this.left.className = "ABKTextareaLeftH";
		this.right.className = "ABKTextareaRightH";
		this.bottomLeft.className = "ABKTextareaBottomLeft ABKh";
		this.bottomRight.className = "ABKTextareaBottom ABKhr";
	}
	el.onblur = function() {
		this.topLeft.className = "ABKTextareaTopLeft";
		this.topRight.className = "ABKTextareaTop";
		this.left.className = "ABKTextareaLeft";
		this.right.className = "ABKTextareaRight";
		this.bottomLeft.className = "ABKTextareaBottomLeft";
		this.bottomRight.className = "ABKTextareaBottom";
	}
}
function selects(el) { //extend Selects
 
	el.oldClassName = el.className;
	oldID = el.id;
	el.dummy = document.createElement('div');
	el.dummy.className = "ABKSelect";
	el.dummy.style.width = el.offsetWidth + 'px';
	
	el.dummy.ref = el;
	el.left = document.createElement('div');

	el.left.className = "ABKSelectLeft";
	el.right = document.createElement('div');
	el.right.className = "ABKSelectRight";
	el.right.id = "selected_" + oldID;

	el.span = document.createElement('span');	
	el.txt = document.createTextNode(el.options[0].text);	
	
	el.bg = document.createElement('div');
	el.bg.className = "ABKSelectTarget";
	el.bg.style.display = "none";
	el.opt = document.createElement('ul');
	el.opt.className = "ABKSelectOptions";
	el.opt.id = "list_" + oldID;
	//el.dummy.style.left = findPosX(el) + 'px';
	//el.dummy.style.top = findPosY(el) + 'px';
	el.opts = new Array(el.options.length);
	el.init = function(pos) {
	debug_alert("SELECT INIT",el.id);
		this.dummy.appendChild(this.left);
		this.span.appendChild(this.txt);
		this.right.appendChild(this.span);
		this.dummy.appendChild(this.right);
		this.bg.appendChild(this.opt);
		this.dummy.appendChild(this.bg);
	debug_alert("SELECT INIT 2",el.id);
		for(var q = 0; q < this.options.length; q++) {
			this.opts[q] = new option(this.options[q], q);
			this.opt.appendChild(this.options[q].li);
			this.options[q].lnk.onclick = function() {
this._onclick();
				this.ref.dummy.getElementsByTagName('span')[0].childNodes[0].nodeValue = this.ref.options[this.pos].text;
this.ref.options[this.pos].selected = "selected";
				for(var w = 0; w < this.ref.options.length; w++) {this.ref.options[w].lnk.className = "";}
				this.ref.options[this.pos].lnk.className = "ABKOptionActive";			
			 	 
				//this._onclick();
				//alert(this.ref.options[this.pos].text);
				//alert(this.ref.dummy.getElementsByTagName('div')[0].innerHTML);
				//alert(this.ref.dummy.getElementsByTagName('div')[0]);
				//update_div = this.ref.dummy.getElementsByTagName('div')[0];
				//document.getElementById("selected_age_from").childNodes[0].nodeValue="222";
				
				//document.getElementById("selected_age_from").innerHTML = "";
				//document.getElementById("selected_age_from").innerText = "2";
				//document.getElementById("selected_age_from").innerHTML += this.ref.options[this.pos].text;
				
				//alert(update_div.innerHTML);
							
				 
				if(this.ref.onchange) this.ref.onchange();
				 
				
				 
				
			}
		}
debug_alert("SELECT INIT 3",el.id);
			
		if(this.options.selectedIndex) {
		debug_alert("SELECT INIT 4",el.id);
			this.dummy.getElementsByTagName('span')[0].childNodes[0].nodeValue = this.options[this.options.selectedIndex].text;
			debug_alert("SELECT INIT 5",oldID);
			this.options[this.options.selectedIndex].lnk.className = "ABKOptionActive";
		}
		debug_alert("SELECT INIT 6",el.id);
		this.dummy.style.zIndex = 999 - 998;
		debug_alert("SELECT INIT 7",el.id);	
		this.parentNode.insertBefore(this.dummy, this);
		debug_alert("SELECT INIT 8",el.id);
		this.className = "ABKhidden";
		debug_alert("SELECT INIT 9",el.id);
		this.style.margin = '0px 0px 0px -' + el.offsetWidth + 'px';
debug_alert("SELECT INIT END",el.id);
			
	}
	el.unload = function() {
		this.parentNode.removeChild(this.dummy);
		this.className = this.oldClassName;
	}
	el.dummy.onclick = function() {
		var allDivs = document.getElementsByTagName('div'); for(var q = 0; q < allDivs.length; q++) {if((allDivs[q].className == "ABKSelectTarget") && (allDivs[q] != this.ref.bg)) {allDivs[q].style.display = "none";}}
		if(this.ref.bg.style.display == "none") {this.ref.bg.style.display = "block";}
		else {this.ref.bg.style.display = "none";}
		if(this.ref.opt.offsetHeight > selectMaxHeight) {
			this.ref.bg.style.width = this.ref.offsetWidth - selectRightWidthScroll + 33 + 'px';
			this.ref.opt.style.width = this.ref.offsetWidth - selectRightWidthScroll + 'px';
		}
		else {
			this.ref.bg.style.width = this.ref.offsetWidth - selectRightWidthSimple + 33 + 'px';
			this.ref.opt.style.width = this.ref.offsetWidth - selectRightWidthSimple + 'px';
		}
	}
	el.bg.onmouseout = function(e) {
		if (!e) var e = window.event;
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
		var reltg = (e.relatedTarget) ? e.relatedTarget : e.toElement;
		
		if(reltg) {
		
		if((reltg.nodeName == 'A') || (reltg.nodeName == 'LI') || (reltg.nodeName == 'UL')) return;
		if((reltg.nodeName == 'DIV') || (reltg.className == 'ABKSelectTarget')) return;
		else{this.style.display = "none";}
		}
		
	}
	el.dummy.onmouseout = function(e) {
		if (!e) var e = window.event;
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
		var reltg = (e.relatedTarget) ? e.relatedTarget : e.toElement;
		if((reltg.nodeName == 'A') || (reltg.nodeName == 'LI') || (reltg.nodeName == 'UL')) return;
		if((reltg.nodeName == 'DIV') || (reltg.className == 'ABKSelectTarget')) return;
		else{this.ref.bg.style.display = "none";}
	}
	el.onfocus = function() {this.dummy.className += " ABKfocused";}
	el.onblur = function() {this.dummy.className = this.dummy.className.replace(/ ABKfocused/g, "");}
	el.onkeydown = function(e) {
		if (!e) var e = window.event;
		var thecode = e.keyCode;
		var active = this.selectedIndex;
		switch(thecode){
			case 40: //down
				if(active < this.options.length - 1) {
					for(var w = 0; w < this.options.length; w++) {this.options[w].lnk.className = "";}
					var newOne = active + 1;
					this.options[newOne].selected = "selected";
					this.options[newOne].lnk.className = "ABKOptionActive";
					this.dummy.getElementsByTagName('div')[0].innerHTML = this.options[newOne].text;
				}
				return false;
				break;
			case 38: //up
				if(active > 0) {
					for(var w = 0; w < this.options.length; w++) {this.options[w].lnk.className = "";}
					var newOne = active - 1;
					this.options[newOne].selected = "selected";
					this.options[newOne].lnk.className = "ABKOptionActive";
					this.dummy.getElementsByTagName('div')[0].innerHTML = this.options[newOne].text;
				}
				return false;
				break;
			default:
				break;
		}
	}
}
function multiSelects(el) { //extend Multiple Selects
	el.oldClassName = el.className;
	el.height = el.offsetHeight;
	el.width = el.offsetWidth;
	el.topLeft = document.createElement('img');
	el.topLeft.src = imagesPath + "0.png";
	el.topLeft.className = "ABKMultiSelectTopLeft";
	el.topRight = document.createElement('div');
	el.topRight.className = "ABKMultiSelectTop";
	el.bottomLeft = document.createElement('img');
	el.bottomLeft.src = imagesPath + "0.png";
	el.bottomLeft.className = "ABKMultiSelectBottomLeft";
	el.bottomRight = document.createElement('div');
	el.bottomRight.className = "ABKMultiSelectBottom";
	el.left = document.createElement('div');
	el.left.className = "ABKMultiSelectLeft";
	el.right = document.createElement('div');
	el.right.className = "ABKMultiSelectRight";
	el.init = function() {
		var top = this.parentNode;
		if(this.previousSibling) {var where = this.previousSibling;}
		else {var where = top.childNodes[0];}
		top.insertBefore(el.topRight, where);
		top.insertBefore(el.right, where);
		top.insertBefore(el.bottomRight, where);
		this.topRight.appendChild(this.topLeft);
		this.right.appendChild(this.left);
		this.right.appendChild(this);
		this.bottomRight.appendChild(this.bottomLeft);
		el.style.width = el.topRight.style.width = el.bottomRight.style.width = el.width + 'px';
		el.style.height = el.left.style.height = el.right.style.height = el.height + 'px';
		el.className = "ABKMultiSelect";
	}
	el.unload = function() {
		this.parentNode.parentNode.appendChild(this);
		this.parentNode.removeChild(this.topRight);
		this.parentNode.removeChild(this.bottomRight);
		this.parentNode.removeChild(this.right);
		this.className = this.oldClassName;
		this.style.width = this.style.height = "";
	}
	el.onfocus = function() {
		this.topLeft.className = "ABKMultiSelectTopLeft ABKh";
		this.topRight.className = "ABKMultiSelectTop ABKhr";
		this.left.className = "ABKMultiSelectLeftH";
		this.right.className = "ABKMultiSelectRightH";
		this.bottomLeft.className = "ABKMultiSelectBottomLeft ABKh";
		this.bottomRight.className = "ABKMultiSelectBottom ABKhr";
	}
	el.onblur = function() {
		this.topLeft.className = "ABKMultiSelectTopLeft";
		this.topRight.className = "ABKMultiSelectTop";
		this.left.className = "ABKMultiSelectLeft";
		this.right.className = "ABKMultiSelectRight";
		this.bottomLeft.className = "ABKMultiSelectBottomLeft";
		this.bottomRight.className = "ABKMultiSelectBottom";
	}
}
function option(el, no) { //extend Options
	el.li = document.createElement('li');
	el.lnk = document.createElement('a');
	el.lnk.href = "javascript:;";
	el.lnk.ref = el.parentNode;
	el.lnk.pos = no;
	el.lnk._onclick = el.onclick || function () {};
	el.txt = document.createTextNode(el.text);
	el.lnk.appendChild(el.txt);
	el.li.appendChild(el.lnk);
}

//Get Position
function findPosY(obj) {
	var posTop = 0;
	do {posTop += obj.offsetTop;} while (obj = obj.offsetParent);
	return posTop;
}
function findPosX(obj) {
	var posLeft = 0;
	do {posLeft += obj.offsetLeft;} while (obj = obj.offsetParent);
	return posLeft;
}
//Get Siblings
function getInputsByName(name) {
	var inputs = document.getElementsByTagName("input");
	var w = 0; var results = new Array();
	for(var q = 0; q < inputs.length; q++) {if(inputs[q].name == name) {results[w] = inputs[q]; ++w;}}
	return results;
}

//Add events
var existingLoadEvent = window.onload || function () {};
var existingResizeEvent = window.onresize || function() {};
window.onload = function () {
    existingLoadEvent();
    ABKInit();
}
window.onresize = function() {
	if(resizeTest != document.documentElement.clientHeight) {
		existingResizeEvent();
		//ABKFix();
	}
	resizeTest = document.documentElement.clientHeight;
}

function debug_alert(message,element_id){
//alert(element_id);
//if(element_id=="state") alert(message);
}