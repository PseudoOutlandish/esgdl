window.$ = window.jQuery = require('jquery');
const request = require('request');
const path = require("path");
const fs = require("fs");
const http = require("http");
const https = require("https");
const shell = require('electron').shell
var elerem = require('electron').remote;
var dialog = elerem.dialog;
var app = elerem.app;

$(function() {
	
	refreshList();
});

function refreshList() {
	request('https://www.elsensee-gymnasium.de/schule-gemeinschaft/kollegium/', { json: false }, (err, res, body) => {
	  if (err) { return console.log(err); }
	  //console.log(body);
	  parseDocument(body);
	});
}

function parseDocument(data) {
	
	
	/*const { window2 } = new JSDOM();
	const { document2 } = (new JSDOM(data)).window;
	global.document2 = document2;

	var virtjq = require('jquery')(window2);*/
	
	var esgdom = $.parseHTML(data);
	
	//console.log($(esgdom).find("#persons_list").attr("class"));
	
	var esgjq = $(esgdom);
	
	var teachers = [];
	
	esgjq.find("#persons_list > .personchip").each(function(index, el) {
		var name = $(el).find(".text.information > .mb-1").text();
		name = name.trim();
		var imgurl = $(el).find(".personenfoto").css("background-image");
		imgurl = imgurl.replace('url(','').replace(')','').replace(/\"/gi, "");
		
		if(!imgurl.includes("dummies/dummy")) {
			//console.log(name, imgurl);
			teachers.push({
				name: name,
				img: imgurl
			});
		}
	});
	
	makeList(teachers);
	
	
}

function makeList(teachers) {
	$("#teacherlist").empty();
	teachers.forEach(function(teacher) {
		$("#teacherlist").append('<div class="mdl-list__item">' +
					'<span class="mdl-list__item-primary-content">'+
						'<i class="material-icons mdl-list__item-avatar">person</i>'+
						'<span>'+teacher.name+'</span>'+
					'</span>'+
					'<a class="mdl-list__item-secondary-action" href="'+teacher.img+'" target="_blank"><i class="material-icons">visibility</i></a>'+
					'<a class="mdl-list__item-secondary-action dlclick" href="#" data-url="'+teacher.img+'" target="_blank"><i class="material-icons">get_app</i></a>'+
				'</div>');
	});
	
	redoClickables();
}

function redoClickables() {
	$(".dlclick").click(function(ev) {
		ev.preventDefault();
		var target = ev.currentTarget;
		var url = $(target).attr("data-url");
		var toLocalPath = path.resolve(app.getPath("downloads"), path.basename(url));
		var userChosenPath = dialog.showSaveDialog({ defaultPath: toLocalPath });
		//var userChosenPath = toLocalPath;
		if(userChosenPath){
			download (url, userChosenPath, downloadComplete)
		}
		//shell.openExternal(url);
		//console.log(url);
	});
}

function downloadComplete(val) {
	console.log(val);
}

function download (url, dest, cb) {
    var file = fs.createWriteStream(dest);
    var request = https.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb); // close() is async, call cb after close completes.
			shell.showItemInFolder(dest);
        });
    }).on('error', function(err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        if (cb) cb(err.message);
    });
}