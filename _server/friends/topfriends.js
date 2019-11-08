var l_remove = 'Remove from list';
var l_add = 'Add to list';
var l_all_slots = 'All Featured Friends slots are taken.  Remove one from the list to add a new friend.';

function copyFriend(source)
{
	var sform = document.getElementById('settings_id');
	var openslots = countOpenSlots();
	if(openslots.length > 0)
	{
		var from = document.getElementById(source);
		if(from)
		{
			var fromParentId = from.parentNode.id;
			var slot = document.getElementById(openslots[0]);
			slot.previousSibling.style.display="block";
			var tempNode = from.cloneNode(true);
			slot.appendChild(tempNode);
			var tmpslot = slot.firstChild.id;
			var tmpid = tmpslot.split("-");
			slot.firstChild.id = tmpid[0]+"-p";
			
			var srclinks = from.getElementsByTagName('a');
			var linkstr = "#";
			srclinks[3].href = linkstr;
			srclinks[3].style.display = "none";
			
			var seps = from.getElementsByTagName('span');
			seps[1].style.display = "none";
			
			var srcdivs = from.getElementsByTagName('div');
			srcdivs[0].className='featuredFriendBox';
			
			var links = slot.getElementsByTagName('a');
			linkstr = 'javascript:removeFriend(\''+slot.id+'\',\''+fromParentId+'\')';
			links[3].childNodes[0].nodeValue = l_remove;
			links[3].href = linkstr;			

			var divs = slot.getElementsByTagName('div');
			divs[1].className='featuredFriendBox';
		}
		else
		{
			window.location.reload()
		}
	}
	else alert(l_all_slots);
}

function removeFriend(sourcex,destx)
{
	var fromx = document.getElementById(sourcex);
	if(fromx)
	{
		var fromChild = fromx.firstChild;
		if(fromChild)
		{
			var fromChildId = fromChild.id;
			var oldFromTmp = fromChildId.split("-");
			var oldFromChildId = oldFromTmp[0];
			fromx.previousSibling.style.display="none";
			var srclinks = fromx.getElementsByTagName('a');
			var linkstr = 'javascript:copyFriend(\''+oldFromChildId+'\')';
			
			srclinks[3].childNodes[0].nodeValue = l_add;
			srclinks[3].href = linkstr;			
			srclinks[3].style.display = "";
					
			var srcdivs = fromx.getElementsByTagName('div');
			srcdivs[1].className='featuredFriendBox notFeatured';
			
			fromChild.id = oldFromChildId;

			var tox = document.getElementById(destx);			
			if(tox)
			{
				tox.innerHTML='';
				tox.appendChild(fromChild);
				//var seps = tox.getElementsByTagName('span');
				//seps[1].style.display = "";
			}
			else
			{
				fromx.innerHTML='';
			}
		}
		else
		{
			window.location.reload()
		}
	}
	else
	{
		window.location.reload()
	}
}

function countOpenSlots()
{
	var count = 0;
	var slots = document.getElementById('featureSlots');
	var feat = slots.getElementsByTagName('div');
	var openslots = new Array();
	for(i=0; i <= feat.length; i++)
	{
		if(feat[i])
		{
			var slotId = feat[i].id;
			if(slotId.substring(0,11) == 'featureSlot')
			{
				if(feat[i].childNodes.length == 0)
				{
					openslots[count] = feat[i].id;
					count++;
				}
			}
		}
	}
	return openslots;
}

function clearFeaturedList()
{
	var featuredlist = document.getElementById('featureSlots');
	var sform = document.getElementById('settings_id');
	var featslots = featuredlist.getElementsByTagName('div');
	for(i=0; i <= featslots.length; i++)
	{
		if(featslots[i])
		{
			var slotId = featslots[i].id;
			if((slotId.substring(0,11) == 'featureSlot') && (featslots[i].childNodes.length != 0))
			{
				var revtmp = featslots[i].firstChild.id;
				var revid = revtmp.split("-");
				if(document.getElementById(revid[0]))
				{
					var op = document.getElementById(revid[0]).parentNode;
					removeFriend(slotId,op.id);
				}
				featslots[i].innerHTML = '';
				featslots[i].previousSibling.style.display="none";
			}
		}
	}
}

function saveFeaturedList()
{
	var ff = getFeaturedList();
	var fform = document.getElementById('ffriends_id');
	var sform = document.getElementById('settings_id');
	fform.action.value = 'save';
	fform.list.value = ff;
	fform.submit();
}

function cacheFeaturedList()
{
	var ff = getFeaturedList();
	var fform = document.getElementById('ffriends_id');
	fform.action.value = 'cache';
	fform.list.value = ff;
	fform.submit();
}

function page(pgnum)
{
	var ff = getFeaturedList();
	var fform = document.getElementById('ffriends_id');
	fform.action.value = 'cache';
	fform.page.value = pgnum;
	fform.list.value = ff;
	fform.submit();
}

function getFeaturedList()
{
	var featuredlist = document.getElementById('featureSlots');
	var friends = new Array();
	var featslots = featuredlist.getElementsByTagName('div');
	var count = 0;
	var j = 0;
	for(i=0; i < featslots.length; i++)
	{
		var slotId = featslots[i].id;
		if(featslots[i].className == 'featureSlot')
		{
			if(featslots[i].childNodes.length > 0)
			{
				var sid = featslots[i].firstChild.id;
				if(sid.substring(0,3) == 'idf')
				{
					tmp = sid.substring(3,sid.length);
					tmp_arr = tmp.split("-");
					friends[j] = tmp_arr[0];
					j++;
				}
			}
			else
			{
				friends[j] = 0;
				j++;
			}
		}
	}
	var flist = friends.join(",");
	return flist;
}
