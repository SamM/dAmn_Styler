// ==UserScript==
// @name          dAmn Styler Three
// @namespace     http://github.com/SamM/dAmn_Styler
// @description   User-defined Stylesheets for dAmn Chatrooms
// @version       3
// @include http://chat.deviantart.com/chat/*
// ==/UserScript==

var Script_Request = function(id, url, query, parent){
	query = query || {};
	query['_random'] = Math.round(Math.random()*10000000).toString();
	if(el = document.getElementById(id)) el.parentNode.removeChild(el);
	with(S = document.createElement('script')){
		if(id!=null)S.id = id; S.type = 'text/javascript'; 
		S.src = url + (function(q){ var out = []; for(var k in q) out.push([k,q[k]].join('=')); return '?'+out.join('&'); })(query);
		(parent||document.body).appendChild(S);
		var self = function(onload_callback){ S.onload = function(){ onload_callback(S); return self; }; };
		return self; }};
		
var dAmn = dAmn || {},
	dAmn_Styler = {
		'current_stylesheet': null,
		'current_room': null,
		'stylesheet_request': function(id, url, parent){
			with(S = document.createElement('link')){
				if(id) S.id = id;
				S.href 	= url+'?'+Math.round(Math.random()*10000000).toString();
				S.rel	= "stylesheet";
				S.type	= "text/css";
			(parent||document.body).appendChild(S);
			return S;
			}
		},
		'fix_scroll': function(){
			var fix = function(){ dAmnChats[dAmn_Styler.current_room].onResize(true); };
			fix();
			setTimeout(fix, 1000);
		},
		'chatrooms': {},
		'stylesheets': {},
		'chatroom_stylesheet': function(chatroom, url){
			if(url.indexOf('http')<0) url = 'http://'+url;
			if(this.current_stylesheet) this.current_stylesheet.disabled = true;
			this.current_room = chatroom;
			if(this.stylesheets[chatroom] && this.chatrooms[chatroom] == url){
				this.current_stylesheet = this.stylesheets[chatroom];
				this.current_stylesheet.disabled = false;
			}else{
				this.chatrooms[chatroom] = url;
				this.stylesheets[chatroom] = this.current_stylesheet = this.stylesheet_request('dAmn_styler/'+chatroom, url);
			}
			dAmn_Styler.fix_scroll();
		},
		'check_title_for_abbr': function(chatroom){
			var room = dAmnChats[chatroom];
			if(room){
				var title_abbrs = room.title_el.getElementsByTagName("abbr"),
					abbr_title = '', style_added = false;
				for(var abbr=0; abbr<title_abbrs.length; abbr++){
					abbr_title = title_abbrs[abbr].title;
					if(abbr_title.indexOf('stylesheet:'>-1)){
						dAmn_Styler.chatroom_stylesheet(chatroom, abbr_title.substring(11,abbr_title.length));
						style_added = true;
					}
					if(!style_added) this.remove_stylesheet();
				}
			}
		}
	};
Script_Request('whenever_events', 'http://github.com/SamM/dAmn_Styler/raw/master/whenever.js')(function(script){
	dAmn['switch_tab'] = function(a){ return a; };
	Whenever(window, 'dAmnChatTabs_activate', function(args){ return dAmnChatTab_active != args[0];})()(function(a){dAmn['switch_tab'](a[0])});
	Whenever(dAmn, 'switch_tab')()(function(a){ dAmn_Styler.check_title_for_abbr(a[0]); });
	dAmn['switch_tab'](dAmnChatTab_active);
});