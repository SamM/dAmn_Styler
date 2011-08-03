// ==UserScript==
// @name          dAmn Styler Three
// @namespace     http://github.com/SamM/dAmn_Styler
// @description   User-defined Stylesheets for dAmn Chatrooms
// @version       3
// @include http://chat.deviantart.com/chat/*
// ==/UserScript==

var Script_Request = Script_Request || function(id, url, query, parent){
	query = query || {};
	query['_random'] = Math.round(Math.random()*10000000).toString();
    
    var el = document.getElementById(id);
	if(el) el.parentNode.removeChild(el);
    
    var S = document.createElement('script');
	if(id!=null) S.id = id;
    S.type = 'text/javascript'; 
	S.src = url + (function(q){ var out = []; for(var k in q) out.push([k,q[k]].join('=')); return '?'+out.join('&'); })(query);
    
	parent = parent || document.body;
    parent.appendChild(S);
    
	return function(onload_callback){ S.onload = function(){ onload_callback(S); }; };
};
		
var load_styler = Script_Request('dAmn_Styler', 'http://github.com/SamM/dAmn_Styler/raw/master/dAmn_Styler.js');