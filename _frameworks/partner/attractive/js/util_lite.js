var MSG_INVALID_DATE_FORMAT = 'Invalid date format.  Must be of the form MM/DD/YYYY.';
var MSG_INVALID_MONTH       = 'Invalid date: %1 month must be in the range 1 - 12';
var MSG_INVALID_DAY         = 'Invalid date: %1 day not valid.';
var MSG_INVALID_YEAR        = 'Invalid date: %1 year must be greater than 1900.';
var MSG_INVALID_EMAIL       = 'Invalid email address: %1';
var MSG_INVALID_DOMAIN      = 'Invalid domain name: %1. The value must be of the form \'mydomain.com\'.';
var MSG_INVALID_PASSWORD    = 'Passwords must be at 6-10 alphanumeric characters!';
var MSG_INVALID_USERID      = 'Usernames may only contain alphanumeric characters and \'_\'!';
var MSG_INVALID_ALPHANUMERIC= 'This field may only contain alphanumeric characters, \'_\' and \'-\'!';
var MSG_INVALID_ALPHANUMERIC_WS= 'This field may only contain alphanumeric characters, \'_\', \'-\' and spaces!';
var MSG_INVALID_URL         = 'URL cannot contain *, " or \'';
var MSG_REQ_FIELD           = '%1 is a required field.';
var MSG_AT_LEAST_ONE_FIELD  = 'At least one of %1 or %2 must be specified.';
var MSG_AT_LEAST_ONE_FIELD_CHANGED  = 'At least one of %1 or %2 must be changed.';
var MSG_MAX_LENGTH			= '%1 may only be a maximum of %2 characters long.';
var MSG_MIN_LENGTH			= '%1 must be a minimum of %2 characters long.';
var MSG_ALPHA_NUMERIC		= '%1 may only contain alphanumeric characters.';
var MSG_ALPHA 				= '%1 may only contain alphabetic characters.';
var MSG_NAME				= '%1 may only contain alphanumeric characters, periods and exclaimation marks.';
var MSG_NUMERIC             = '%1 may only contain numeric characters!';
var MSG_LONG             = '%1 may only contain numeric characters!';
var MSG_TWO_FIELDS			= '%1 and %2 must be the same.';
var MSG_CONFIRM_TWO_FIELDS  = 'Your new password is the same as the old one. Do you want to proceed?';
var MSG_NOT_TWO_FIELDS      = '%1 and %2 may not have the same value.';
var MSG_REQUIRED_SELECT		= 'Please select a value for %1.';
var MSG_FIELD_INVALID       = '%1 is invalid.';
var MSG_TO_AGE_MUST_BIGGER  = 'Please select an Age Range from lowest to highest.';
var MSG_CONFIRM_TRANSACTION = "You are about to process a secure transaction that may take a minute to complete.Please do not click 'Back' on your web browser during the processing,as you will not receive confirmation of your transaction. Do you want to proceed?"
var MSG_INVALID_ZIP_CODE_FORMAT = 'Invalid Zip Code';
var MSG_INVALID_POSTAL_CODE_FORMAT = 'Invalid Postal code';
var MSG_ZIP_5_OR_9='Zip Code must be 5 or 9 numbers.';
var MSG_ZIP_5='Zip Code must be 5 numbers.';
var MSG_TOO_MANY_EMAILS_ADDRESSES='%1 may only contain a maximum of %2 email addresses';
var MSG_PHONE_NUMBER_VALID_CHARACTERS = '%1 may only contain the following the digits 0-9';
var MSG_PHONE_NUMBER_NORTH_AMERICA_INVALID_FORMAT = '%1 must be of the format NXX-NXX-XXXX where N is the digits 2-9 and X is any digit.';
var MSG_PHONE_NUMBER_NORTH_AMERICA_RESERVED_AREA_CODE =  'Reserved area codes, such as 800, 888, 900, etc,  and emergency service numbers, such as 411, 911, etc,  are not permitted.';
var MSG_PHONE_NUMBER_VALID_CHARACTERS = '%1 may only contain the following characters: 0-9()-.';
var MSG_PHONE_NUMBER_NORTH_AMERICA  = '%1 must contain 10 digits.';
var MSG_MOBILE_NUMBER_VALID_CHARACTERS = '%1 may only contain the following the digits 0-9 (Note: The Date Mobile section is optional and can be left blank)';
var MSG_MOBILE_NUMBER_NORTH_AMERICA_INVALID_FORMAT = '%1 must be of the format NXX-NXX-XXXX where N is the digits 2-9 and X is any digit. (Note: The Date Mobile section is optional and can be left blank)';
var MSG_MOBILE_NUMBER_NORTH_AMERICA_RESERVED_AREA_CODE =  'Reserved area codes, such as 800, 888, 900, etc,  and emergency service numbers, such as 411, 911, etc,  are not permitted. (Note: The Date Mobile section is optional and can be left blank)';
var MSG_TOO_MANY_DOMAINS='%1 may only contain a maximum of %2 email addresses';
var MSG_MOBILE_NUMBER_VALID_CHARACTERS = '%1 may only contain the following characters: 0-9()-. (Note: The Date Mobile section is optional and can be left blank)';
var MSG_MOBILE_NUMBER_NORTH_AMERICA  = '%1 must contain 10 digits. (Note: The Date Mobile section is optional and can be left blank)';
var MSG_NUMERIC_MIN          = '%1 must be greater than or equal to %2'
var MSG_NUMERIC_MAX          = '%1 must be less than or equal to %2'
var MSG_MAX_LENGTH_COUNTER	= 'You have reached the maximum of %1 characters for this field.';
var MSG_NON_EMPTY_DEPENDENCY = '%1 has been completed. %2 cannot be empty if %1 has been completed.';
var MSG_SAVED_SEARCH_EMPTY = 'You have selected to save this search but failed to provide a saved search name. Please provide a saved search name.';
var MSG_REGISTRATION_UPLOAD_PHOTO_SKIP_STEP = 'You have filled out the form to upload a photo. Are you sure you want to skip this step?'

var popup=null;
function setFocus(form,field){
 if (form!='') {
	try	{document.forms[form][field].focus();} catch(e) {}
 }
 else {
	try	{document.forms[0][field].focus();} catch(e) {}
 }
}
function winpop(loc,w,h,scroll) {
	var name = loc.replace(/\W/g, "");
	window.open(loc,name,'width='+w+', height='+h+', location=no, directories=no, menubar=no, scrollbars='+scroll+', resizable=no, status=no, toolbar=no');
}
var gOnload = new Array();
function addOnload(f){
 if(window.onload){
	if (window.onload != runOnload){
	 gOnload[0] = window.onload;
	 window.onload = runOnload;
	}
	gOnload[gOnload.length] = f;
 }
 else window.onload = f;
}
function runOnload()
{
	for (var i=0;i<gOnload.length;i++)
		gOnload[i]();
}

function checkCR(formName,e)
{
	if (e.keyCode == 13) {
		if(eval('validate'+formName+'()'))
		document.forms[formName].submit();
	}
}

function trim(str){	return str.replace(/^\s+/,'').replace(/\s+$/,'');}
function strtrim(){	return trim(this);}
String.prototype.trim=strtrim;
function submitForm(form, action){
 form.action=action;
 form.submit();
}
function isCheckBoxChecked(field){
 if(field[0]){
	for(i=0;i<field.length;i++){
	 theField=field[i];
	 if(theField.checked) return true;
	}
	return false;
 }else{
	if(!field.checked) return false;
 }
 return true;
}
function isEmpty(field) {
 if (field.type=='checkbox'||(field[0]&&field[0].type=='checkbox')) {
	return !isCheckBoxChecked(field);
 }
 if (field.type=='radio'||(field[0]&&field[0].type=='radio')) {
	return !isCheckBoxChecked(field);
 }
 try{field.value=field.value.trim();}catch(e) {}
 if (field.value.length==0) return true;
}
function validateRequiredField(field, name){
 try {field.value=field.value.trim();}catch(e) {}
 if (field.value.length == 0){
	alert(MSG_REQ_FIELD.replace('%1', name));
	try{field.focus();}catch(e){}
	return false;
 }
 return true;
}
function validateRequiredCheckbox(field, name, msg) {
 if (!isCheckBoxChecked(field)) {
	alert(msg.replace('%1', name));
	try{field.focus();}catch(e){}
	return false;
 }
 return true;
}
function validateRequiredSelect(field, name, defaultValue) {
 if (field.value == null || field.value == '' || field.value == defaultValue) {
	alert(MSG_REQUIRED_SELECT.replace('%1', name));
	try{field.focus();}catch(e){}
	return false;
 }
 return true;
}
function validateMaxLength(field, name, maxLength){

	var value = field.value;
	var originalVal = value;	//store a copy with the \n's in it
	var newVal = "";	//new value with any extra characters removed from it so as not to go over maxLength
	var character = null;
	value = value.replace(/\n/g,'**'); // bug #4830 when the javascript validates it sees \n's and java validates it sees \r\n's so a string may pass javascript validation but fail java validation, solution validate on a copy of the string with all \n's replaced with 2 characters to simulate the java length

 if (field.value.length > maxLength){

	//loop through the string getting one character at a time.
	//If we encounter a \n we have to count it as 2 characters due to bug #4830
	for(var i=0, count=1; count<=maxLength; i++, count++){
			character = originalVal.charAt(i);

			//if this is a new line char make sure we have 2 spaces available in the new string
			if(character == "\n" && count<=maxLength-1){
				newVal = newVal.concat(character);
				count++;
			}else{
				newVal = newVal.concat(character);
			}
	}

	var msg=MSG_MAX_LENGTH.replace('%1', name);
	msg=msg.replace('%2', maxLength);
	alert(msg);
	try{
		//substitute in the shortened string into the field.
		field.value = newVal;
		field.focus();
	}catch(e){}

	return false;
 }
 return true;
}
function validateMinLength(field, name, minLength) {
 if (field.value.length < minLength) {
	var msg=MSG_MIN_LENGTH.replace('%1', name);
	msg=msg.replace('%2', minLength);
	alert(msg);
	try{field.focus();}catch(e){}
	return false;
 }
 return true;
}
function validateAlphaNumeric(field, name){
 var mask=/^[_0-9a-zA-Z-]*[_0-9a-zA-Z-]$/
 if (!mask.test(field.value)) {
	alert(MSG_ALPHA_NUMERIC.replace('%1', name));
	try{field.focus();}catch(e){}
	return false;
 }
 return true;
}
/** Checks that a field contains only alphanumeric values and dot*/
function validateAlphaNumericDot(field, name)
{
	var mask = /^[_0-9a-zA-Z-\.]*[_0-9a-zA-Z-\.]$/
	if (!mask.test(field.value)) {
		alert(MSG_ALPHA_NUMERIC.replace('%1', name));
		try{field.focus();}catch(e){}
		return false;
	}
	return true;
}
function validateEmailField(emailField, name){
 emailField.value = emailField.value.trim();
 if (!checkEmail(emailField.value)) {
  alert(MSG_INVALID_EMAIL.replace('%1', emailField.value));
  try{emailField.focus();}catch(e){}
  return false;
 }
 return true;
}
function validateMultipleEmailField(field, name, max) {
 field.value=field.value.trim();
 field.value=field.value.replace(/;/g, ',');
 field.value=field.value.replace(/,+/g, ',');
 field.value=field.value.replace(/^,/, '');
 field.value=field.value.replace(/,$/, '');
 //TODO: could check for duplicates...
 var array=field.value.split(",");
 if (array.length > max) {
	alert(MSG_TOO_MANY_EMAILS_ADDRESSES.replace('%1', field.name).replace('%2', max));
	try{field.focus();}catch(e){}
	return false;
 }
 for (var i=0 ; i < array.length ; i++) {
	array[i]=array[i].trim();
	if (!checkEmail(array[i])) {
	 alert(MSG_INVALID_EMAIL.replace('%1', array[i]));
	 try{field.focus();}catch(e){}
	 return false;
	}
 }
 return true;
}
function validateDomainField(domainField, name){
 domainField.value = domainField.value.trim();
 if (!checkDomain(domainField.value)) {
  alert(MSG_INVALID_DOMAIN.replace('%1', domainField.value));
  try{domainField.focus();}catch(e){}
  return false;
 }
 return true;
}
function validateMultipleDomainField(field, name, max) {
 field.value=field.value.trim();
 field.value=field.value.replace(/;/g, ',');
 field.value=field.value.replace(/,+/g, ',');
 field.value=field.value.replace(/^,/, '');
 field.value=field.value.replace(/,$/, '');
 //TODO: could check for duplicates...
 var array=field.value.split(",");
 if (array.length > max) {
	alert(MSG_TOO_MANY_DOMAINS.replace('%1', field.name).replace('%2', max));
	try{field.focus();}catch(e){}
	return false;
 }
 for (var i=0 ; i < array.length ; i++) {
	array[i]=array[i].trim();
	if (!checkDomain(array[i])) {
	 alert(MSG_INVALID_DOMAIN.replace('%1', array[i]));
	 try{field.focus();}catch(e){}
	 return false;
	}
 }
 return true;
}
function validateTwoFields(field,name,field2,name2) {
	if (field.value != field2.value){
		var msg=MSG_TWO_FIELDS.replace('%1', name);
		msg=msg.replace('%2', name2);
		alert(msg);
		try{field.focus();}catch(e){}
		return false;
	}
	return true;
}
function validateTwoFieldsIgnoreCase(field,name,field2,name2) {
	if (field.value.toLowerCase() != field2.value.toLowerCase()){
		var msg=MSG_TWO_FIELDS.replace('%1', name);
		msg=msg.replace('%2', name2);
		alert(msg);
		try{field.focus();}catch(e){}
		return false;
	}
	return true;
}
function validateNotTwoFields(field,name,field2,name2) {
	if (field.value == field2.value){
		var msg=MSG_NOT_TWO_FIELDS.replace('%1', name);
		msg=msg.replace('%2', name2);
		alert(msg);
		try{field.focus();}catch(e){}
		return false;
	}
	return true;
}
/**
 * Reference: Sandeep V. Tamhankar (stamhankar@hotmail.com),
 * http://javascript.internet.com
 */
function checkEmail(emailStr) {
	var emailPat=/^(.+)@(.+)$/;
	var specialChars="\\(\\)><@,;:\\\\\\\"\\.\\[\\]!%";
	var validChars="\[^\\s" + specialChars + "\]";
	var quotedUser="(\"[^\"]*\")";
	var ipDomainPat=/^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/;
	var atom=validChars + '+';
	var word="(" + atom + "|" + quotedUser + ")";
	var userPat=new RegExp("^" + word + "(\\." + word + ")*$");
	var domainPat=new RegExp("^" + atom + "(\\." + atom +")*$");

	var matchArray=emailStr.match(emailPat);

	if (matchArray==null) {
		return false;
	}
	var user=matchArray[1];
	var domain=matchArray[2];

	for (i=0; i<user.length; i++) {
		if (user.charCodeAt(i)>127) {
			return false;
		}
	}
	for (i=0; i<domain.length; i++) {
		if (domain.charCodeAt(i)>127) {
			return false;
	   }
	}

	if (user.match(userPat)==null) {
		return false;
	}

	var IPArray=domain.match(ipDomainPat);
	if (IPArray!=null) {
		for (var i=1;i<=4;i++) {
			if (IPArray[i]>255) {
				return false;
			}
		}
		return true;
	}

	var atomPat=new RegExp("^" + atom + "$");
	var domArr=domain.split(".");
	var len=domArr.length;
	for (i=0;i<len;i++) {
		if (domArr[i].search(atomPat)==-1) {
			return false;
		}
	}

	if (domArr[len-1].length < 2) {
		return false;
	}

	if (len<2) {
		return false;
	}

	var mask=/@(date.com|date.net|matchmaker.com|matchmaker.net|matchmaker.org|matchmaker.biz|mm.org|gay.com|wellsfargo.com|spamhole.com|mailinator.com|klassmaster.com|fakeinformation.com|sogetthis.com|spambob.com|spamgourmet.com|spamex.com)/i;

	if (mask.test(emailStr.toLowerCase())) {
		return false;
	}
	/*mask=/^(root|abuse|webmaster|help|postmaster|sales|resumes|contact|advertising|spam|spamtrap|nospam|noc|admin|support|daemon|listserve|listserver|autoreply)@/i;
	if (mask.test(emailStr.toLowerCase())) {
		return false;
	}*/

	return true;
}
function checkDomain(domain) {
	var specialChars="\\(\\)><@,;:\\\\\\\"\\.\\[\\]!%";
	var validChars="\[^\\s" + specialChars + "\]";
	var ipDomainPat=/^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/;
	var atom=validChars + '+';
	var domainPat=new RegExp("^" + atom + "(\\." + atom +")*$");

	for (i=0; i<domain.length; i++) {
		if (domain.charCodeAt(i)>127) {
			return false;
	   }
	}

	var IPArray=domain.match(ipDomainPat);
	if (IPArray!=null) {
		for (var i=1;i<=4;i++) {
			if (IPArray[i]>255) {
				return false;
			}
		}
		return true;
	}

	var atomPat=new RegExp("^" + atom + "$");
	var domArr=domain.split(".");
	var len=domArr.length;
	for (i=0;i<len;i++) {
		if (domArr[i].search(atomPat)==-1) {
			return false;
		}
	}

	if (domArr[len-1].length < 2) {
		return false;
	}

	if (len<2) {
		return false;
	}

	var mask=/date.com/i;
	if (mask.test(domain.toLowerCase())) {
		return false;
	}
	mask=/date.net/i;
	if (mask.test(domain.toLowerCase())) {
		return false;
	}
	mask=/date.info/i;
	if (mask.test(domain.toLowerCase())) {
		return false;
	}

	return true;
}
var bname=navigator.appName;
var bver=parseInt(navigator.appVersion);
function giveFocus(frm, elm){eval("document."+frm+"."+elm+".focus()");}
function updateDay(change,formName,yearName,monthName,dayName){
 var form=document.forms[formName];
 var yearSelect=form[yearName];
 var monthSelect=form[monthName];
 var daySelect=form[dayName];
 var year=yearSelect[yearSelect.selectedIndex].value;
 var month=monthSelect[monthSelect.selectedIndex].value;
 var day=daySelect[daySelect.selectedIndex].value;
 if (change=='month'||(change=='year'&&month==2)){
	var i=31;
	var flag=true;
	while(flag){
	 var date=new Date(year,month-1,i);
	 if (date.getMonth()==month-1){flag=false;}
	 else{i=i-1;}
	}
	daySelect.length=0;
	daySelect.length=i;
	var j=0;
	while(j<i){
	 daySelect[j]=new Option(j+1,j+1);
	 j=j+1;
	}
	if (day<=i)	{
	 daySelect.selectedIndex=day-1;
	}else{
	 daySelect.selectedIndex=daySelect.length-1;
	}
 }
}
function checkIt(obj){
	if(obj==null) return;
	obj.checked='true';
}
//pop-under
var flag="1";
function clearFlag(){flag="0";}
function pop(){if(flag == '0'){winme=window.open('/jsp/common/popad.jsp','','toolbar=no,location=no,scrollbars=no,resizable=no');}}

/**
 * Function for DA-7088, popup survey for when people exit the
 * second join page of the registration process.
 */
function surveyPop(url){
	winme=window.open(url);
}

function setFlag(){flag++;}

function validateZipCode(field, name) {
	// Remove hyphen and white space
	var value = field.value.replace(/[-\s]+/,"");
	for (i=0;i<value.length;++i) {
		value= value.replace(/[-\s]+/,"");
	}
	field.value = value;

	if(value.length==5){
		var expr = new RegExp("^[0123456789]{5}");
	} else if(value.length==9){
		var expr = new RegExp("^[0123456789]{9}");
	} else {
		alert(MSG_ZIP_5);
		errormessage=true;
		try{field.focus();}catch(e){}
		return false;
	}

	if (!expr.test(value)){
		alert(MSG_INVALID_ZIP_FORMAT);
		errormessage=true;
		try{field.focus();}catch(e){}
		return false;
	}
	return true;
}
var mes_disable_right="Function not supported.";
function disable_right_click()
{
	if (document.layers)
	{
		document.captureEvents(Event.MOUSEDOWN);
		document.onmousedown=clickNS4;
	}else if (document.all&&!document.getElementById)
	{
		document.onmousedown=clickIE4;
	}
	document.oncontextmenu=new Function("alert(mes_disable_right);return false")
}


/**
 * This checks to make sure that field1 is non-empty. If it is non-empty then
 * field2 must be non-empty. If field1 is empty then we don't care
 * if field2 is empty or not. Basically, a check of field2 is only
 * dependent on field1 being empty or not.
 */
function nonEmptyDependency(field1, field1Name, field2, field2Name, message){
	if(!isEmpty(field1) && isEmpty(field2)){
		alert(message);
		return false;
	}else{
		return true;
	}
}


