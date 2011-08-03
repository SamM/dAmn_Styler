var dAmn_Styler = {
		'init': function(){
			dAmn_Styler.check_title(dAmnChatTab_active);
			var dCT_activate = dAmnChatTabs_activate;
			window.dAmnChatTabs_activate = function(){
				dAmn_Styler.check_title(arguments[0]);
				return dCT_activate.apply(this, [].slice.call(arguments,0));
			};
		},
		'DEBUG': false,
		'chatrooms': {},
		'stylesheets': {},
		'current_stylesheet': null,
		'current_css_url': null,
		'current_room': null,
		
		'stylesheet_request': function(id, url, parent){
			var S = document.createElement('link');
			if(id) S.id = id;
			S.href 	= url; //+'?'+Math.round(Math.random()*10000000).toString();
			S.rel	= "stylesheet";
			S.type	= "text/css";
			parent = parent || document.body;
			parent.appendChild(S);
			return S;
		},
		'disable_current': function(){ if(this.current_stylesheet) this.current_stylesheet.disabled = true; },
		'fix_scroll': function(){
			var fix = function(){ dAmnChats[dAmn_Styler.current_room].onResize(true); };
			fix(); setTimeout(fix, 1000);
		},
		'chatroom_stylesheet': function(chatroom, url){
			if(chatroom == this.current_room && url == this.current_css_url) return;
			if(url.indexOf('http')<0) url = 'http://'+url;
			if(this.current_stylesheet) this.current_stylesheet.disabled = true;
			this.current_room = chatroom;
			this.current_css_url = url;
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

if(dAmn_Client_Username) dAmn_Styler.init();
else{
var old_body_onload = document.body.onload || function(){};
document.body.onload = function(e){ dAmn_Styler.init(); old_body_onload(e); }
}