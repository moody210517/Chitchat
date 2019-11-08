var req;
var g_lastLine=g_enter="entered_room";
var g_lastTime = 0;
var g_nick = "";
var g_delay = 5000;
var g_chair_max = 12;
var g_avatar_max = 9;
var g_bubble_max = 5;
var g_avatar_choice = 1;
var g_baseUrl = "./process.php?";
var g_updateTimeout = -1;
var g_assertTimeout = -1;

function goTo(dir) {
    var cl = '.room_',
        btn = $(cl+g_room_tag)[dir]('a');
    if (btn.length) {
        btn.click();
    } else {
        if (dir == 'next') {
            $(cl+rooms[0]).click();
        } else {
            $(cl+rooms[rooms.length-1]).click();
        }
    }
	//$('.'+g_room_tag)[dir]('a').click();
	return false
}
function chRoom(room) {
	$('.nick, .avatar, .bubble').fadeOut(function(){$('.bubble').remove()});
	var bg0=$('img.bg:last').fadeTo(400, .5);
	$('<img class=bg src="'+urlBg+room+'.jpg">').insertAfter(bg0).load(function(){
		$(this).fadeTo(500, 1, function(){bg0.remove()});
        g_room_tag=room;
        tryEnter();
	})
    return false;
}
function processChat() {
	if (req.readyState == 4) {
		if (req.status == 200) {
			$('chatline', req.responseXML).each(function(i){
				var pos = this.getAttribute("position")*1,
					time=this.getAttribute('time')*1,
					bubbleN = this.getAttribute("bubble")*1;
				//console.log(time, g_lastTime, pos, $('.p'+pos+'.t'+time)[0])
				if (!pos) return;
				if (time>=g_lastTime && !$('.p'+pos+'.t'+time)[0]) { //console.log(time)
					g_lastTime=time;
					var text = this.firstChild.data;
                    text = text.replace(/%/g, '&#037;');
					var said = decodeURIComponent(text);
					//said = toXml(said);
					if (said == g_enter) {
						//said = "[<i>" + said.replace(/\[|\]/g, '') + "&thinsp;</i>]";
                        //console.log(l_entered_room);
                        said = l_entered_room;
						if ($('.p'+pos)[0]) return
					}
                    //autolink(said)
					$('<div class="bubble p'+pos+' t'+time+'"><span>'+said+'</span></div>')
					 .css({left:getPosX(pos)}).appendTo('.bubbles')
				}
				var bno=$('.bubble:not(.old)')
				if (bno.length>g_bubble_max)
					bno.eq(0).addClass('old').stop().hide(400, function(){$(this).remove()})
			})
			$('.bubble:not(.old):hidden').eq(0).show(250, function next(){
				$(this).next().show(250, next)
			})

			var visitorCount = 0;
			$("chair", req.responseXML).each(function(){
				var pos = this.getAttribute("position"),
				 avatar = this.getAttribute("avatar"),
				 $avatar=$('#avatar'+pos),
				 src='./avatar/'+avatar+'.png';
				//console.log('avatar'+pos, avatar);
				if (avatar==0) {
					$('#avatar'+pos).stop().fadeTo(400,0,function(){this.src=''});
					$('.p'+pos).hide(350, function(){$(this).remove()});
				}else if ($avatar.is('[src!="'+src+'"]')) {
					var ready=$avatar.is(':hidden'), load=function(){
						//console.log('ready', ready)
						if (ready++) $avatar.stop().attr('src',src).fadeTo(400,1)
					};
					if (!ready) $avatar.stop().fadeTo(400,0,load);
					$(new Image()).load(load)[0].src=src
				} else {$avatar.stop().fadeTo(400, 1)}//
				var nick = $("#nick" + pos);
				var sNick = this.getAttribute("nick");
				nick.html('<a href="../../search_results.php?display=profile&name='+sNick+'" target="_blank">'+sNick+'</a>').stop().fadeTo(400,1);
				if (sNick) visitorCount++
				else nick.stop().fadeTo(400,0)
			})

			//document.title = ucfirst(g_room_tag) + " Chat With " + visitorCount;
			//visitors.innerHTML = "In the room: " + visitorCount;
			g_lastLine = "";
			clearTimeout(g_updateTimeout);
			g_updateTimeout = setTimeout("updateChat()", g_delay);

			d = req.responseXML.getElementsByTagName("order");
			if (d.length > 0)
			{
				for (var n = 0; n < d.length; n++)
				{
					switch ( d[n].getAttribute("action") )
					{
						case "exit":
							//clearTimeout(g_updateTimeout);
						break;
					}
				}
			}

		}
	}
}

function tryEnter() {
	g_chRoom=1; g_lastTime=0; g_lastLine=g_enter;
	var url=g_baseUrl+"&mode=enter&room_tag="+encodeURIComponent(g_room_tag)+getCachePrevent();
	debug(url);
	if (window.XMLHttpRequest)
	{
		req = new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{
		req = new ActiveXObject("Microsoft.XMLHTTP");
	}
	req.onreadystatechange = processEnter;
	req.open("GET", url, true);
	req.send(null);
}

function processEnter() {
	if (req.readyState == 4)
	{
		if (req.status == 200)
		{
			g_chRoom=0;
			var isSuccess = false;
			var d = req.responseXML.getElementsByTagName("status");
			if (d.length > 0)
			{
				for (var n = 0; n < d.length; n++)
				{
					if ( d[n].getAttribute("success") == 1 )
					{
						isSuccess = true;
						// alert("You entered the chat bar.");
						showLayer("chatform");
					}
					else
					{
						alert(d[n].firstChild.data);
					}
				}
			}
			if (isSuccess) {
				processChat();
			}
		}
		else
		{
			//alert("Can't retrieve XML: " + req.statusText);
		}
	}
}

function updateChat() {
	clearTimeout(g_updateTimeout);
	if(window.g_chRoom) return;
	var url=g_baseUrl+"mode=update&line="+encodeURIComponent(g_lastLine)+"&room_tag="+encodeURIComponent(g_room_tag)+getCachePrevent();
	debug(url);
	//alert(url);
	if (window.XMLHttpRequest)
	{
		req = new XMLHttpRequest();
	}
	else if (window.ActiveXObject)
	{
		req = new ActiveXObject("Microsoft.XMLHTTP");
	}
	req.onreadystatechange = processChat;
	req.open("GET", url, true);
	req.send(null);
}

function debug(s)
{
	var elm = document.getElementById("debug");
	if (elm)
	{
		elm.innerHTML = "Debug: " + s;
	}
}

function showLayer(s)
{
	var elm = document.getElementById(s);
	if (elm)
	{
		elm.style.display = "block";
	}
}

function hideLayer(s)
{
	var elm = document.getElementById(s);
	if (elm)
	{
		elm.style.display = "none";
	}
}

function changeAvatar(avatar)
{
	g_avatar_choice = avatar;
}

function ucfirst(s)
{
	return s.substr(0, 1).toUpperCase() + s.substr(1, s.length);
}

function saidSomething()
{
	if (g_lastLine == "")
	{
		var elm = document.getElementById("chatinput");
		g_lastLine = elm.value;
		if (g_lastLine != "")
		{
			clearTimeout(g_updateTimeout);
			g_updateTimeout = -1;
			elm.value = "";
			updateChat();
		}
	}

	return false;
}

function checkKey(e)
{
	var returnKey = 13;
	var characterCode = -1;

	if(e && e.which)
	{
		e = e;
		characterCode = e.which;
	}
	else
	{
		e = event;
		characterCode = e.keyCode;
	}

	if(characterCode == returnKey)
	{
		saidSomething();
	}
	return false;
}

function getCachePrevent(){return "&rand="+(new Date)*1}

function autolink(s) {
	var regURL = new RegExp("(http|https|ftp)://([-/.a-zA-Z0-9_~#%$?&=:200-377()]+)", "gi");
	s = s.replace(regURL, "<a href='$1://$2' rel='nofollow' target='_blank'>$1://$2</a>");
	return s;
}

function doReplace(s, a, b) {
	var regex = new RegExp(a, "g");
	s = s.replace(regex, b);
	return  s.replace(/<\/?[^>]+>/gi, '');
}

function toXml(s) {
    s = doReplace(s, "&#037;", "%");
	s = doReplace(s, "&", "&#38;");
	s = doReplace(s, "<", "&lt;");
	s = doReplace(s, ">", "&gt;");

	return s;
}

function getPosX(pos)
{
	var x = 0;
	switch (pos + "")
	{
		case "1": x = -56; break;
		case "2": x = 6; break;
		case "3": x = 68; break;
		case "4": x = 130; break;
		case "5": x = 192; break;
		case "6": x = 254; break;
		case "7": x = 316; break;
		case "8": x = 378; break;
		case "9": x = 440; break;
	  case "10": x = 502; break;
	  case "11": x = 564; break;
	  case "12": x = 626; break;
		default: x = 0;
	}
	return x;
}
function chat_window(parentLocation){

// FIND CENTER OF BROWSER

	wh = window.outerHeight || parent.document.body.clientHeight;
	ww = window.outerWidth || parent.document.body.clientWidth;

	wx = window.screenX || window.screenLeft;
	wy = window.screenY || window.screenTop;

	if(wx===undefined) wx = 0;
	if(wy===undefined) wy = 0;

	w = wx + ww/2 - 373;
	h = wy + wh/2 - 214;

	// IE only
	if(window.outerHeight === undefined) {
	w = wx;
	h = wy;
	}

	if (window.navigator.userAgent.indexOf("Opera") >= 0)
	{
	w = wx;
	h = wy;
	}

	//alert(wx+"::"+wy+"::"+ww+"::"+wh);
	//return false;

	window.open ('index.php?mode=window&room_tag='+g_room_tag, 'chat', 'width=746,height=427,left='+w+',top='+h+',scrollbars=no,resizable=no,location=no,toolbar=no,status=no,directories=no,menubar=no');
	parent.location.href=parentLocation;
}
tryEnter();