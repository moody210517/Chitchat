if (/(NetFront|PlayStation|hiptop|IEMobile|Smartphone|Windows CE|NetFront|PlayStation|Opera Mini|Opera)/i.test(navigator.userAgent)) {
	if (!(/(Opera)/i.test(navigator.userAgent))) {
		//document.write("<link rel=\"stylesheet\" href=\"css/_ie.css\" type=\"text/css\"/><link rel=\"stylesheet\" href=\"css/_ie6.css\" type=\"text/css\"/><link rel=\"stylesheet\" href=\"css/_iemobile.css\" type=\"text/css\"/><meta name=\"MobileOptimized\" content=\"220\"/>");
		document.write("<meta name=\"MobileOptimized\" content=\"220\"/>");
	} else if ((/(Opera)/i.test(navigator.userAgent))) {
		//document.write("<link rel=\"stylesheet\" href=\"css/_operadesktop.css\" type=\"text/css\"/>");
	}
}
if (/(WebKit)/i.test(navigator.userAgent)) {
	//document.write("<link rel=\"stylesheet\" href=\"css/_webkit.css\" type=\"text/css\" media=\"screen\" charset=\"utf-8\">");
	/*window.onload = function() {
		if(document.getElementById("notsafari")){document.getElementById("notsafari").style.display="none";};
		var aa = document.getElementById("URLtext");
		if(aa) {
			aa.value = "Enter file URL";
			aa.onfocus = function() {if(this.value=='Enter file URL'){this.value=''};;};
			aa.onblur = function() {if(this.value==''){this.value='Enter file URL'};;};
		}
	}*/
}

function updateDay(change,formName,yearName,monthName,dayName)
{
	var form = document.forms[formName];
	var yearSelect = form[yearName];
	var monthSelect = form[monthName];
	var daySelect = form[dayName];
	var year = yearSelect[yearSelect.selectedIndex].value;
	var month = monthSelect[monthSelect.selectedIndex].value;
	var day = daySelect[daySelect.selectedIndex].value;

	if (change == 'month' || (change == 'year' && month == 2))
	{
		var i = 31;
		var flag = true;
		while(flag)
		{
			var date = new Date(year,month-1,i);
			if (date.getMonth() == month - 1)
			{
				flag = false;
			}
			else
			{
				i = i - 1;
			}
		}

		daySelect.length = 0;
		daySelect.length = i;
		var j = 0;
		while(j < i)
		{
			daySelect[j] = new Option(j+1,j+1);
			j = j + 1;
		}
		if (day <= i)
		{
			daySelect.selectedIndex = day - 1;
		}
		else
		{
			daySelect.selectedIndex = daySelect.length - 1;
		}
	}
}
