var minId = -1;
var globalJson = [];

function search() {
    let entries;
    let username = document.querySelector("#username").value.trim();
	if(!username){ pop_error('User name is empty.'); return;}

	entries = getEntries(username);

	if(entries){
		let json = JSON.parse(entries);
		let u;
		let retry = true;
		let preId = minId;
		
		if (json.error) {pop_error(json.error); return false;}
		json.forEach( (toot) => {
			u = toot.account.username;
			if ('@'+u == username || u == username) {
				showEntries(toot);
				globalJson.push(toot);
				retry = false;
			}
			minId = toot.id;
			console.log(minId);
		});
		
		if (retry) {
			document.querySelector('#result').innerHTML +=
				"<div class='toot'>もう一度読み込んでください。</div>";
		}
		
		if (preId == minId) {
			document.querySelector('#result').innerHTML +=
				"<div class='toot'>EOF</div>";
		}
	}
}

function getJson() {
	var href = "data:application/octet-stream," + encodeURIComponent(JSON.stringify(globalJson));
	location.href = href;
}

function getEntries(username) {
	let instance = document.querySelector('#instance').value;
	let token = document.querySelector('#token').value;
	if(!instance){pop_error('Instance is empty.'); return false;}
	if(!token){pop_error('Token is empty.'); return false;}
	
	let strMaxId = "";
	if (minId >= 0) strMaxId = "&max_id="+minId;
	let r = new XMLHttpRequest();
	r.open("GET",instance+'/api/v1/timelines/home/?local=true&limit=40'+strMaxId,false);
	r.setRequestHeader("Authorization", "Bearer " + token);
	r.send(null);
	console.log(r.responseText);

	return r.responseText;
}

function getImages(toot) {
	var imagesUrl = new Array();
	toot.media_attachments.forEach( (item) => {
		imagesUrl.push(item.preview_url + " " + item.url);
	});
	
	let retValue = "";
	let index = 1;
	imagesUrl.forEach( (elem) => {
		console.log(elem);
		let tmp = elem.split(" ");
		console.log(tmp[0],tmp[1]);
		retValue += "<a href='" + tmp[1] + "' target='_brank'><img src='" + tmp[0] + "' width='256' height='256' alt='添付画像" + index++ + "'></a>";
	});
	
	return retValue;
}

function pop_error(msg){
    console.log(msg);
    alert(msg);
}

function showEntries(toot){
	document.querySelector('#result').innerHTML 
		+= "<div class='toot'>"
		+ "<p><span>"
		+ toot.account.username 
		+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;toot id:" 
		+ toot.id + "</span></p>"
		+ "<p>" + toot.content + "</p>"
		+ "<p>" + getImages(toot) + "</p>"
		+ "</div>";
}
