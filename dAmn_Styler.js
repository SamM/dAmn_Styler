var Script_Request = Script_Request || function(id, url, query, parent){
	query = query || {};
	query['_random'] = Math.round(Math.random()*10000000).toString();
	if(el = document.getElementById(id)) el.parentNode.removeChild(el);
	with(S = document.createElement('script')){
		if(id!=null)S.id = id; S.type = 'text/javascript'; 
		S.src = url + (function(q){ var out = []; for(var k in q) out.push([k,q[k]].join('=')); return '?'+out.join('&'); })(query);
		(parent||document.body).appendChild(S);
		var self = function(onload_callback){ S.onload = function(){ onload_callback(S); return self; }; };
		return self; }};
		
var dAmn_Styler = {
		'init': function(){
			Whenever(window, 'dAmnChatTabs_activate', function(args){ return dAmnChatTab_active != args[0];})()(function(a){ dAmn_Styler.check_title(a[0][0]); });
			dAmn_Styler.check_title(dAmnChatTab_active);
		},
		'chatrooms': {},
		'stylesheets': {},
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
		'disable_current': function(){ this.current_stylesheet.disabled = true; },
		'fix_scroll': function(){
			var fix = function(){ dAmnChats[dAmn_Styler.current_room].onResize(true); };
			fix(); setTimeout(fix, 1000);
		},
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
		'check_title': function(chatroom){
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
				}
				if(!style_added) this.disable_current();
			}
		}
	};
Script_Request('whenever_events', 'http://github.com/SamM/dAmn_Styler/raw/master/whenever.js')(function(script){ dAmn_Styler.init(); });