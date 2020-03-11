var EBOOK_JS_VERSION="3.2.1.75";
var e_isIEBrowser=true;
var e_isSafari=false;
var e_absHref="";
var e_absURL="";
var e_docBaseURL="";
var e_fitZoomLevel=0;
var e_viewRatio=1;
var e_spage=1;
var e_initComplete=false;
var e_initLinkComplete=false;
var e_screenColorDepth=32;
var e_isUnload=false;
var e_arrAppendFrame=new Array();
var e_oReadBin;
var e_localPath="";
var e_bReadBinUse=false;
var e_bRemovedDefEventListner=false;
var e_RClick;
var e_o={
dBook:function(){return document.getElementById("dBook");},
getObj:function(id, byName){
	if(typeof(byName)=="undefined" || byName==null) byName=false;
	var ret=document.getElementById(id);
	if(ret) return ret;
	else if(!byName) return ret;
		
	var cols=document.getElementsByName(id);
	if(cols.length>0) return cols[0];
	else return null;
},
browser:null,
arrEvent:new Array(),
arrRequestVar:new Array(),
curOption:{link:"y",memo:"y",pen:"y",background:"", inited:false},
isAlerted:false,
initOption: function () {
    var skinColor = document.getElementById("skin_menu");
    skinColor.style.backgroundColor = "#656774";
	if(e_o.browser.mobile) return;
	if( typeof(skin_sideMenu)=="undefined" ) skin_sideMenu="";
	if( typeof(skin_bOption_Button)=="undefined" ) skin_bOption_Button=false;
	if( (skin_sideMenu=="left" || skin_sideMenu=="right") && skin_bOption_Button && e_initLinkComplete && e_initComplete && !e_o.curOption.inited){
		var option_link_view=e_o.dBook().handle_getLocalSharedObject("option_link_view");
		var option_memo_view=e_o.dBook().handle_getLocalSharedObject("option_memo_view");
		var option_pen_view=e_o.dBook().handle_getLocalSharedObject("option_pen_view");
		var option_background=e_o.dBook().handle_getLocalSharedObject("option_background");
		e_o.curOption.link=(option_link_view=="n")?"n":"y";
		e_o.curOption.memo=(option_memo_view=="n")?"n":"y";
		e_o.curOption.pen=(option_pen_view=="n")?"n":"y";
		e_o.curOption.background=(option_background.length>0)?option_background:"";
		e_o.curOption.inited=true;
		
		if(e_o.curOption.link=="n") e_o.setOption("link","n", false);
		if(e_o.curOption.memo=="n") e_o.setOption("memo","n", false);
		if(e_o.curOption.pen=="n") e_o.setOption("pen","n", false);
		if(e_o.curOption.background.length>0) e_o.setOption("background",e_o.curOption.background, false);
		else if(document.body.style.backgroundColor.length>0) e_o.setOption("background",document.body.style.backgroundColor, false);
		else if(document.body.style.backgroundImage.length>0) e_o.setOption("background",document.body.style.backgroundImage, false);
		else document.body.style.backgroundColor="transparent";
	}
},
setOption: function (div, val, bSet, ref) {
    if (typeof (bSet) == "undefined") bSet = true;
    if (typeof (ref) == "undefined") ref = "";
	var bHide=(val=="n");
	if(div=="link"){
		e_o.curOption.link=val;
		if(bSet) e_o.dBook().handle_saveLocalSharedObject("option_link_view",val);
		e_o.dBook().handle_hideEmbeds(bHide,"memo;pen;postit;", true);			
	}else if(div=="memo"){
		e_o.curOption.memo=val;
		if(bSet) e_o.dBook().handle_saveLocalSharedObject("option_memo_view",val);
		e_o.dBook().handle_hideEmbeds(bHide,"memo;postit;");			
	}else if(div=="pen"){
		e_o.curOption.pen=val;
		if(bSet) e_o.dBook().handle_saveLocalSharedObject("option_pen_view",val);
		e_o.dBook().handle_hideEmbeds(bHide,"pen;");		
	}else if(div=="background"){
		e_o.curOption.background=val;
		if(bSet){
			e_o.dBook().handle_saveLocalSharedObject("option_background",val);
			var isColor = (val.indexOf("url(") < 0);
			var tgtObj, tgtIndexBar;
			if (ref == "menubar") {
			    tgtObj = document.getElementById("skin_menu");
			} else if (ref == "sidebar") {
			    tgtObj = document.getElementById("smenu_tab_btn_box");
			    tgtIndexBar = document.getElementById("index_menuBar");
			} else if (ref == "body") {
			    tgtObj = document.body;
			}
			if (isColor) {
			    tgtObj.style.backgroundColor = val;
			    tgtObj.style.backgroundImage = "none";
			    if (tgtIndexBar) {
			        tgtIndexBar.style.backgroundColor = val;
			        tgtIndexBar.style.backgroundImage = "none";
			    }
			}else{
			    tgtObj.style.backgroundColor = "transparent";
			    tgtObj.style.backgroundImage = val;
			    tgtObj.style.backgroundPosition = "0% 0%";
			    tgtObj.style.backgroundRepeat = "repeat";
			    if (tgtIndexBar) {
			        tgtIndexBar.style.backgroundColor = "transparent";
			        tgtIndexBar.style.backgroundImage = val;
			        tgtIndexBar.style.backgroundPosition = "0% 0%";
			        tgtIndexBar.style.backgroundRepeat = "repeat";
			    }
			}
		}
	}
},
initRequestVar:function(){
	var strHref=document.location.href;
	if(strHref.lastIndexOf("?")>0){
		strHref = strHref.substring( strHref.lastIndexOf("?")+1 );
		var arr_1 = strHref.split("&");
		for(var i=0; i<arr_1.length;i++){
			var arr_2 = arr_1[i].split("=");
			if(arr_2.length==2){
				var oParam = {name:arr_2[0].toLowerCase(),value:arr_2[1]};
				e_o.arrRequestVar.push(oParam);
			}
		}
	}		
},
getRequestVar:function(name){
	var ret="";
	var sName = name.toLowerCase();
	for(var i=0;i<e_o.arrRequestVar.length;i++){
		if(sName=="startpage"){
			if( e_o.arrRequestVar[i].name=="startpage" ||  e_o.arrRequestVar[i].name=="page"){
				ret = e_o.arrRequestVar[i].value;
				break;
			}else if(e_o.arrRequestVar[i].name=="rpage"){
				try{
					ret=parseInt(e_o.arrRequestVar[i].value)+ebook_getPageFix();
					break;
				}catch(e){break;}
			}
		}else if( e_o.arrRequestVar[i].name==sName){
			ret = e_o.arrRequestVar[i].value;
			break;
		}
	}
	return ret;
},
writeLoadingImage:function(){
	var oElement=document.createElement("img");
	oElement.id="ebook_loading";
	oElement.src=e_iconDirectory = "images";+"/load_album.gif";
	oElement.border=0;
	oElement.galleryImg="no";
	oElement.style.position="absolute";
	oElement.style.top="0px";
	oElement.style.visibility="hidden";

	oElement.onselect=function(evt){return false;};
	oElement.onload=function(evt){
		if(e_initComplete || oElement.style.visibility!="hidden"){
			setTimeout("e_o.clearLoading()",500);
		}
		e_o.setLoadPos();
		return false;
	};
	try{document.body.appendChild(oElement);}catch(e){}	
},
setLoadPos:function(){
	var obj=e_o.getObj("ebook_loading");
	var rect=e_o.getElementRect(obj);
	var bndRect=e_o.getElementRect(e_o.getObj("mainTable"));
	if(rect.w>0 && rect.h>0){
		obj.style.visibility="visible";
		obj.style.left=(bndRect.w-rect.w)/2 + "px";
		obj.style.top=(bndRect.h-rect.h)/2 + "px";
	}else{
		setTimeout("e_o.setLoadPos();",100);
	}
},
clearLoading:function(){
	try{
		var obj=e_o.getObj("ebook_loading");
		document.body.removeChild(obj);
		obj.onload=null;
		obj=null;
	}catch(e){}
},
bCommandDliver:function(){
	if(e_initComplete && !e_isUnload) return true;
	else return false
},
getEvtLsnrIdx:function(name,func){
	for(var i=0; i<e_o.arrEvent.length;i++){
		var oEvt = e_o.arrEvent[i];
		if(oEvt.name==name.toLowerCase() && oEvt.func==func) return i;
	}
	return -1;
},
addEventListener:function(name,func, obj){
	if(e_o.getEvtLsnrIdx(name,func)<0){
		var oEvent ={name:name.toLowerCase(),func:func,obj:obj};
		e_o.arrEvent.push(oEvent);
	}		
},
removeEventListener:function(name,func){
	var idx=e_o.getEvtLsnrIdx(name,func);
	if(idx>=0){
		var arrPre = e_o.arrEvent.slice(0, idx);
		var arrNext = e_o.arrEvent.slice(idx+1,e_o.arrEvent.length);
		e_o.arrEvent = arrPre.concat(arrNext);
	}		
},
dispatchEvent:function(){
	var args = e_o.dispatchEvent.arguments;
	var name = args[0].toLowerCase();
	var arr=new Array();
	var sArg="";
	for(var i=1;i<args.length;i++){
		arr.push(args[i]);
		sArg += "'" + args[i] + "'"
		if(i<args.length-1) sArg += ",";
	}
	for(var i=0; i<e_o.arrEvent.length;i++){
		var oEvt = e_o.arrEvent[i];
		if(oEvt.name==name){
			
			if(typeof(oEvt.func)=="function" || typeof(oEvt.func)=="object"){
				try{oEvt.func.apply(oEvt.obj, arr);}catch(e){}
			}else{
				var command = oEvt.func + "(";
				command+=sArg;
				command += ")";
				try{eval(command);}catch(e){};
			}
		}
	}		
},
getElementRect:function(obj){
	var ret={x:0,y:0,w:0,h:0};
	try{
		if(obj.getBoundingClientRect){
			var rect = obj.getBoundingClientRect();
			ret.x=rect.left;
			ret.y=rect.top;
			ret.w=rect.right-rect.left;
			ret.h=rect.bottom-rect.top;
		}else{
			ret.x=obj.offsetLeft;
			ret.y=obj.offsetTop;
			var parent = obj.offsetParent;
			while(parent!=null){
				ret.x = ret.x + parent.offsetLeft;
				ret.y = ret.y + parent.offsetTop;
				parent=parent.offsetParent;
			}
			ret.w = obj.offsetWidth;
			ret.h = obj.offsetHeight;
		}
	}catch(e){}
	return ret;
},
pressZoom:function(zoomDir,obj, dir){
	if(obj.id=="menu_Btn_zoomIn"){
	e_o.getObj(obj.id).src="./images/btn_zoom_in_on.png";
	}else if(obj.id=="menu_Btn_zoomOut"){
	e_o.getObj(obj.id).src="./images/btn_zoom_out_on.png";
	}

	if(typeof(dir)=="undefined") dir="all";
	var vRect=e_o.getElementRect(e_o.getObj("viewerDiv"));
	var rect=e_o.dBook().handle_getCurViewArea();
	var scale=e_o.dBook().handle_getCurScale();
	var bndState=e_o.dBook().handle_getBoundState();	
	var curZoom=e_o.dBook().handle_getCurrZoomStep();
	
	var maxZoom=e_maxZoomLevel+e_ghostZoomLevel;
	if(zoomDir==0) return;
	else if(curZoom<0 && zoomDir<0) return;
	else if(curZoom>=maxZoom && zoomDir>0) return;
	
	var x=(rect.x<0)?-rect.x/scale:0;
	var y=(rect.y<0)?-rect.y/scale:0;
	if(bndState!="all" || (dir!="all" && curZoom<0)){
		var sState=(bndState=="all")?dir:bndState;
		if(e_isVerticalTurn){
			if(sState=="right" && rect.h<vRect.h) y=y+rect.h/(2*scale);
			
			rect.h=rect.h/2;
		}else{
			if(sState=="right" && rect.w<vRect.w) x=x+rect.w/(2*scale);
			rect.w=rect.w/2;
		}
	}
	rect.w=(rect.w<vRect.w)?rect.w:vRect.w;
	rect.h=(rect.h<vRect.h)?rect.h:vRect.h;
	x=x+ rect.w/(2*scale);
	y=y+ rect.h/(2*scale);
	
	if(curZoom<0) curZoom=0;
	curZoom=zoomDir+curZoom;
	e_o.dBook().handle_pressZoomN(curZoom, x, y);	
},
scaleToZoom:function(scale, zMax){
	var dScale=1.02;
	if(scale<0.8) return -1;
	for(var i=0;i<=zMax;i++){
		var z_min=Math.pow(2,i)*dScale;
		if(scale<=z_min){
			return i;
		}else if(i==zMax){
			return i;
		}
	}
	return -1;
},
mouseDown:function(mx, my, button){
	e_o.dispatchEvent("mouseDown", mx, my, button);
},
mouseUp:function(mx, my, button){
	e_o.dispatchEvent("mouseUp", mx, my, button);
},
rollOver:function(){
	e_o.dispatchEvent("rollOver");
},
rollOut:function(){
	e_o.dispatchEvent("rollOut");
},
mouseMove:function(mx, my, button){
	e_o.dispatchEvent("mouseMove", mx, my, button);
},
startAutoFlip:function(){
	e_o.dispatchEvent("startAutoFlip");
},
endAutoFlip:function(){
	e_o.dispatchEvent("endAutoFlip");
},
overLimitPage:function(){
	e_o.dispatchEvent("overLimitPage");
},
mouseLinkOver:function(linkid){
	setTimeout("try{link_mouseOver("+linkid+");}catch(e){}",1);
},
mouseLinkOut:function(linkid){
	setTimeout("try{link_mouseOut("+linkid+");}catch(e){}",1);
},
linkPlayState:function(type, linkid){
	setTimeout("try{link_playStateHandler('"+type+"',"+linkid+");}catch(e){}",10);
},
linkHide:function(linkid, hide){
	setTimeout("try{link_hideHandler("+linkid+",'"+hide+"');}catch(e){}",10);
},
scroll:function(){
	setTimeout("try{link_resize();}catch(e){}",0);
	e_o.dispatchEvent("scroll");
},
stageResize:function(){
	e_o.dispatchEvent("stageResize");
},
resize:function(){
	setTimeout("try{link_resize();}catch(e){}",0);
	e_o.dispatchEvent("resize");
},
turnResize:function(scale,preBndStr,curBndStr, isFirstSlide){
	e_o.dispatchEvent("turnResize", scale,preBndStr,curBndStr, isFirstSlide);
},
startFlip:function(){
	if(!e_o.bCommandDliver()) return;
	try{link_hide();}catch(e){}
	e_o.dispatchEvent("startFlip");
},
endFlip:function(){
	if(!e_o.bCommandDliver()) return;
	if(e_initLinkComplete) setTimeout("try{link_display();}catch(e){}",1);
	e_o.dispatchEvent("endFlip");
},
highlight:function(bSet){
	e_o.dispatchEvent("highlight", bSet);
},
endInitLink:function(){
	e_initLinkComplete = true;
	if(e_initComplete) setTimeout("try{link_reload("+e_initLinkComplete+");}catch(e){}",1);
	e_o.dispatchEvent("endInitLink");
	setTimeout("e_o.initOption()",12);
},	
initEnd:function(){
	if(!e_initComplete){
		try{
			var rpage=parseInt(e_o.getRequestVar("rpage"));
			if(rpage>0){
				var arr=e_o.getRequestVar("coords").split(";");
				if(arr.length==4){
					setTimeout("try{ebook_setHighright("+rpage+","+arr[0]+","+arr[1]+","+arr[2]+","+arr[3]+");}catch(ae){}",500);
				}
			}
		}catch(e){}
	}
	e_initComplete=true;
	setTimeout("e_o.initOption()",12);
	setTimeout("e_o.clearLoading()",500);
	try{
		if(top.e_strFullScreen=="init"){
			ebook_showFrame("frame_fullscreen","appendix/fullscreen.htm",true, true);
			try{frame_fullscreen.init();}catch(e){}
		}
	}catch(e){}
	e_o.dispatchEvent("initEnd");
	try{
		var flip=parseInt(e_o.getRequestVar("flip"));
		if(flip>0) setTimeout("e_o.dBook().handle_pressAutoFlip("+flip+",1);",1000);
	}catch(e){}
	e_o.dBook().focus();
},
zoomOccure:function(inOrOut, bndState){
	e_o.dispatchEvent("zoomOccure", inOrOut, bndState);
},
setLinkEdit:function(type,bReverse, isOwner, UserID){
	try{
		try{link_hide();}catch(ae){}
		try{
			var oFrame = document.getElementById("album_board");
			if(oFrame && oFrame.style.display=="") oFrame.style.display="none";
		}catch(ae){}
		if(e_o.dBook().handle_isLinkEditMode()){
			if(e_o.bCommandDliver()){
				if(typeof(type)=="undefined" || type=="") e_o.dBook().handle_editLink(false, "reload");
				else e_o.dBook().handle_editLink(false, type);
			}
		}else{
			if(e_o.bCommandDliver()){
				if(typeof(type)=="undefined" || type=="") e_o.dBook().handle_editLink(true);
				else e_o.dBook().handle_editLink(true, type,bReverse, isOwner, UserID);
			}
		}
	}catch(e){} 		
},
embedAdded:function(linkid){
	e_o.dispatchEvent("embedAdded",linkid);
},
embedRemoved:function(linkid){
	e_o.dispatchEvent("embedRemoved",linkid);
},
linkSelect:function(linkid){
	e_o.dispatchEvent("linkSelect",linkid);
},
linkResize:function(linkid, x1, y1, x2, y2, isOrgRatio, rotation, alpha){
	if(typeof(rotation)=="undefined") rotation=0;
	if(typeof(alpha)=="undefined") alpha=100;
	e_o.dispatchEvent("linkResize",linkid, x1, y1, x2, y2, isOrgRatio, true, rotation, alpha);
},
formSubSelect:function(linkid, type, seq, isetc){
	e_o.dispatchEvent("formSubSelect",linkid, type, seq, isetc);
},
formSubResize:function(linkid, type, seq, x1, y1, w,h, isetc){
	e_o.dispatchEvent("formSubResize",linkid, type, seq, x1, y1, w,h, isetc);
},
formSubmit:function(unic){
	e_o.dispatchEvent("formSubmit",unic);
},
linkShape:function(linkid, shape, isOnlyRect){
	e_o.dispatchEvent("linkShape",linkid, shape, isOnlyRect);
},
linkIconPos:function(linkid, iconPos, x, y, w, h, bSave){
	if(typeof(w)=="undefined") w=0;
	if(typeof(h)=="undefined") h=0;
	if(typeof(bSave)=="undefined") bSave=true;
	e_o.dispatchEvent("linkIconPos", linkid, iconPos, x, y, w, h, bSave);
},
linkCloseUpPos:function(linkid, x, y){
	e_o.dispatchEvent("linkCloseUpPos", linkid, x, y);
},
linkComplete:function(error){
	e_o.dispatchEvent("linkComplete", error);
},
penDrawEnd:function(penid){
	e_o.dispatchEvent("penDrawEnd", penid);
},
textCapture:function(pos,arr){
	e_o.dispatchEvent("textCapture", pos, arr);
},
imgCapture:function(pos,state, imgPath){
	e_o.dispatchEvent("imgCapture", pos, state, imgPath);
},
chgLangCode:function(lang){
	e_o.dispatchEvent("chgLangCode", lang);
},
bgSound:function(bPlay, url, bRepeat){
	e_o.dispatchEvent("bgSound", bPlay, url, bRepeat);
},
scriptStatus:function(status, time, total){
	//1:play start, 10:playing, 11:pause, 100: complete, 101:last_script end, 110 close
	e_o.dispatchEvent("scriptStatus", status, time, total);
},
actionSelected:function(stepUnic, actionUnic){
	e_o.dispatchEvent("actionSelected", stepUnic, actionUnic);
},
actionPoint:function(div, stepUnic, actionUnic, x, y){
	e_o.dispatchEvent("actionPoint", div, stepUnic, actionUnic, x, y);
},
actionTime:function(time){
	e_o.dispatchEvent("actionTime", time);
},
enterFrame:function(){
	e_o.dispatchEvent("enterFrame");
},
setDisable:function(mode,bLink, color,alpha){
	if(mode!=true && mode!=false) mode=!e_o.dBook().handle_isDisable();
	if(bLink!=true && bLink!=false) bLink=true;
	if(isNaN(color)) color=0x999999;
	if(isNaN(alpha)) alpha=0.5;
	e_o.dBook().handle_setDisable(mode, bLink, color,alpha);
	return mode;
},
volume:function(vol){
	if(vol<0.0) vol=0.0;
	else if(vol>1.0) vol=1.0;
	e_o.dBook().handle_setVolume(vol);
	link_volume(vol);
},
getABSURL:function(url){
	if(url.toLowerCase().indexOf("http:")!=0 && url.toLowerCase().indexOf("https:")!=0 && url.toLowerCase().indexOf("rtmp:")!=0 && url.toLowerCase().indexOf("file:")!=0  && url.indexOf("/")!=0){
		var tmp=e_absHref;
		if(url.indexOf("../")==0){
			tmp=tmp.substring(0, tmp.length-1);
			url= tmp.substring(0, tmp.lastIndexOf("/"))+url.substr(2);
		}else if(url.indexOf("./")==0){
			url= tmp+url.substr(2);
		}else if(url.indexOf(e_dataDirectory+"/link/")<0){
			url=e_absHref+e_dataDirectory+"/link/"+url;
		}else url = e_absHref + url;
	}
	return url;	
},
init:function(){
	var userAgent = window.navigator.userAgent.toLowerCase();
	var platform=navigator.platform.toLowerCase();
	this.browser = {
		win:/\bwin\b/.test(userAgent) || /\bwindows\b/.test(userAgent),
		mac:/\bmac\b/.test(userAgent) || /\bmacintosh\b/.test(userAgent),
		android:/\bandroid\b/.test(userAgent),
		symbian:(/\bsymbian\b/.test(userAgent) || /\bseries60\b/.test(userAgent)) && /webkit/.test(userAgent),
		wince:/windows ce/.test(userAgent) || /wince/.test(platform),
		blackberry:/\bblackberry\b/.test(userAgent),
		iphone:/\biphone\b/.test(userAgent),
		ipad:/\bipad\b/.test(userAgent),
		version: (userAgent.match(/.+(?:rv|it|ra|msie)[\/: ]([\d.]+)/) || [])[1],
		safari: /\bapplewebkit\b/.test(userAgent) && /\bsafari\b/.test(userAgent),
		opera: /\bopera\b/.test(userAgent),
		msie: /\bmsie\b/.test(userAgent) && !/opera/.test(userAgent),
		netscape:/\bnetscape\b/.test(userAgent),
		mozilla: /\bmozilla\b/.test(userAgent) && !/(compatible|webkit)/.test(userAgent),
		chrome: /\bchrome\b/.test(userAgent)
	};
	if(!this.browser.msie)  this.browser.msie = /\btrident\b/.test(userAgent) &&  /\brv\b/.test(userAgent);
	this.browser.mobile=this.browser.android || this.browser.symbian || this.browser.wince || this.browser.blackberry || this.browser.iphone || this.browser.ipad;
	e_isIEBrowser = this.browser.msie;
	e_isSafari =  this.browser.safari;
	e_isMobile=this.browser.mobile;
	this.browser.zoom=(e_isIEBrowser && screen.deviceXDPI)?screen.deviceXDPI/((screen.systemXDPI)?screen.systemXDPI:96):1;
	this.browser.version = parseInt((this.browser.version.indexOf(".")>0)?this.browser.version.substring(0,this.browser.version.indexOf(".")):this.browser.version);
	this.initRequestVar();
}
}
e_o.init();
function ebook_addEventListener(name,func){e_o.addEventListener(name,func);}
function ebook_removeEventListener(name,func){e_o.removeEventListener(name,func);}
function ebook_getRequestVar(name){return e_o.getRequestVar(name);}
function ebook_getElementRect(obj){return e_o.getElementRect(obj);}

function ebook_calcZoomRect(zoomLevel){
	var ret = new Object();
	ret.x=0;
	ret.y=0;
	ret.w=0;
	ret.h=0;
	return ret;
}

function ebook_gotoPage(page){
	var toPage = parseInt(page);
	if(!isNaN(toPage)){
		e_o.dBook().handle_inputGotoPage(toPage);
	}
}
function ebook_pressAutoFlip(delay){
	if(typeof(delay)=="undefined" || isNaN(delay)) delay=1;
	if(delay<0.1) delay=0.1;
	e_o.dBook().handle_pressAutoFlip(delay*1000,1);
}
function ebook_stopAutoFlip(){
	e_o.dBook().handle_stopAutoFlip();
}

function ebook_pressFullScreen(){ try{if(e_o.bCommandDliver()) e_o.dBook().handle_pressFullScreen();}catch(e){} }
function ebook_pressPause(){ try{if(e_o.bCommandDliver()) e_o.dBook().handle_pressPause();}catch(e){} }
function ebook_closeUp(){ 
	if(e_o.dBook().handle_isLinkEditMode()) return;
	try{if(e_o.bCommandDliver() && !e_bRemovedDefEventListner) e_o.dBook().handle_pressCloseUp();}catch(e){} 
}
function ebook_pressLeftZoom(){e_o.pressZoom(1,"left");}
function ebook_pressRightZoom(){e_o.pressZoom(1,"right");}
function ebook_pressZoom(dir,x,y){if(e_o.bCommandDliver())  try{e_o.dBook().handle_pressZoom(dir,x,y);}catch(e){}}
function ebook_pressScroll(x,y){if(e_o.bCommandDliver()) try{e_o.dBook().handle_pressScroll(x,y);}catch(e){}}
function ebook_pressLeftEndPage(){if(e_o.bCommandDliver())  try{e_o.dBook().handle_pressLeftEndPage();}catch(e){} }
function ebook_pressLeftPage(){if(e_o.bCommandDliver())  try{e_o.dBook().handle_pressLeftPage();}catch(e){} }
function ebook_pressRightPage(){if(e_o.bCommandDliver())  try{e_o.dBook().handle_pressRightPage();}catch(e){} }
function ebook_pressRightEndPage(){if(e_o.bCommandDliver())  try{e_o.dBook().handle_pressRightEndPage();}catch(e){} }
function ebook_getPageFix(){return e_pageFix}
function ebook_getConfigVar(val){
	var ret="";
	try{ret=eval(val);}catch(e){}
	return ret;
}
function ebook_getCurZoomRect(){
	return e_o.dBook().handle_getCurViewArea();
}
function ebook_getLeftSlidePage(){return e_o.dBook().handle_getLeftSlidePage();}
function ebook_getRightSlidePage(){return e_o.dBook().handle_getRightSlidePage();}
function ebook_getSlideTotal(){return e_o.dBook().handle_getSlideTotal();}
function ebook_getCurrZoomStep(){ try{ return e_o.dBook().handle_getCurrZoomStep();}catch(e){return e_fitZoomLevel;} }
function ebook_cursor(cur){if(viewerDiv.css){viewerDiv.css.cursor=cur; }else{viewerDiv.style.cursor=cur;}}
function ebook_getViewBoundRect(){
	var ret;
	ret=e_o.getElementRect(viewerDiv);
	return ret;
}
function ebook_setCfgVar(obj){
		e_totalPage=obj.e_totalPage;
		e_pageFix=obj.e_pageFix;
		e_startPage=obj.e_startPage;
		e_endPage=obj.e_endPage;
		e_limitPage=obj.e_limitPage;
		e_bCoverSlide=obj.e_bCoverSlide;
		e_isDoublePage=obj.e_isDoublePage;
		e_isOldTurn=obj.e_isOldTurn;
		e_isOneImgTwoPage=obj.e_isOneImgTwoPage;
		e_isVerticalTurn=obj.e_isVerticalTurn;
		e_sizeFitMode=obj.e_sizeFitMode;
		e_flipType=obj.e_flipType;
		e_isRemote=obj.e_isRemote;
		
		e_isDoublePage_org = e_isDoublePage;
		e_isOldTurn_org = e_isOldTurn;
		e_isOneImgTwoPage_org = e_isOneImgTwoPage;
		e_isVerticalTurn_org = e_isVerticalTurn;
		e_bFitViewerToWindow_org = e_bFitViewerToWindow;
		e_sizeFitMode_org = e_sizeFitMode;
		e_bDbookExtend_org = e_bDbookExtend;
		e_flipType_org = e_flipType;
}
function ebook_init(){
	e_screenColorDepth=window.screen.colorDepth;
	if( typeof(e_configPath)=="undefined" ) e_configPath="config";
	if( typeof(e_arrAppendFrame)=="undefined") e_arrAppendFrame=new Array();
	if( typeof(e_bFitViewerToWindow)=="undefined" ) e_bFitViewerToWindow=false;
	if( typeof(e_bDbookExtend)=="undefined" ) e_bDbookExtend=false;
	if( typeof(e_bZoomOnePage)=="undefined" ) e_bZoomOnePage=false;
	if( typeof(e_bCoverSlide)=="undefined" ) e_bCoverSlide=false;
	if( typeof(e_bCenterView)=="undefined" ) e_bCenterView=false;
	if( typeof(e_pageFix)=="undefined" ) e_pageFix=0;
	if( typeof(e_cursorType)=="undefined" ) e_cursorType="default";
	if( typeof(e_strFullScreen)=="undefined" ) e_strFullScreen="n";
	if( typeof(e_borderThick)=="undefined" ) e_borderThick=1;
	if( typeof(e_borderColor)=="undefined" ) e_borderColor="#eeeeee";
	if( typeof(e_bSupportMouseWheel)=="undefined" ) e_bSupportMouseWheel=true;
	if( typeof(e_ghostZoomLevel)=="undefined") e_ghostZoomLevel=0;
	if( typeof(e_bViewBorderImg)=="undefined") e_bViewBorderImg=true;
	if( typeof(e_fitRatio)=="undefined") e_fitRatio=1.2;
	if( typeof(e_bUseAntiAlias)=="undefined") e_bUseAntiAlias=true;
	if( typeof(e_bMouseBtnChg)=="undefined") e_bMouseBtnChg=false;
	if( typeof(e_bLinkTargetOne)=="undefined") e_bLinkTargetOne=false;
	if( typeof(e_timeOutSec)=="undefined" ) e_timeOutSec=8;
	if( typeof(e_bHavePlayer)=="undefined" ) e_bHavePlayer=false;
	if( typeof(e_bAutoPlayer)=="undefined" ) e_bAutoPlayer=false;
	if( typeof(g_sWork)=="undefined" ) g_sWork="";
	if( typeof(e_coverType)=="undefined" ) e_coverType=0;
	if( typeof(e_zoomBorder)=="undefined" ) e_zoomBorder="line";
	if( typeof(e_limitPage)=="undefined" ) e_limitPage=0;
	
	if( typeof(g_isEditable)=="undefined" ) g_isEditable=false;
	if( typeof(e_bSecureView)=="undefined" ) e_bSecureView=false;
	if( typeof(e_DBookPW)=="undefined" ) e_DBookPW="";

	try{
		if(e_strFullScreen!="x" && (top.e_strFullScreen=="y" || top.e_strFullScreen=="init") ){
			if(window==top){
				window.moveTo(0,0);
				window.resizeTo(screen.availWidth, screen.availHeight);
			}
		}
	}catch(e){}

	if(e_bFitViewerToWindow) e_bDbookExtend=true;
	
	var strHost, strAbsURL;
	var nStart,nEnd;
	var strHref=document.location.href;
	var oBaseColl = document.getElementsByTagName('BASE');
	var strBase=(oBaseColl && oBaseColl.length) ? oBaseColl[0].href : "";
	strHost=document.location.host;
	if(strBase!=""){
		if(strHost.length>0 && strBase.indexOf(strHost)>=0) strHref=strBase;
		else{ alert("BASE Error"); return false;}
	}
	
	if(e_absURL.length==0){
		nEnd = strHref.lastIndexOf("/");
		if(strHref.indexOf("http://")==0 || strHref.indexOf("https://")==0){
			nStart = strHref.indexOf("/", strHref.indexOf(strHost)+2);
			e_absURL = strHref.substring( nStart, nEnd+1);
		}else{
			strHref = strHref.replace("\\", "/");
			nEnd = strHref.lastIndexOf("/");
			if(strHref.indexOf("file://")==0)
				e_absURL = strHref.substring( 0, nEnd+1);
		}
		e_absHref = strHref.substring( 0, nEnd+1);
	}else{
		e_absHref=e_absURL;
	}
	if( typeof(e_indexFileName)=="undefined") e_docBaseURL=document.location.href;
	else e_docBaseURL=e_absHref+e_indexFileName;
	
	if( typeof(e_copyrightInfoURL)!="undefined") e_linkFile=e_copyrightInfoURL;
	
	if(e_bSecureView && !g_isEditable) return false;
	
	return true;
}
function ebook_getFlashVars(){
	var ret="e_configPath="+e_configPath;
	ret+="&e_isIEBrowser="+e_o.browser.msie;
	ret+="&e_isSafari="+e_o.browser.safari;
	var tmp=location.href.split("?");
	if(tmp.length>=2){
		var qry=tmp[1].split("&");
		for (var i=0; i<qry.length; i++){
			var ele=qry[i].split("=");
			
			if(ele.length>=2){
				var eleId=ele[0];
				var eleVal=ele[1];
		
				if (eleId=="scode" || eleId=="e_BookNo" || eleId=="e_PageNo" || eleId=="e_ViewType"){
					ret+="&"+ eleId +"="+ eleVal;
				}
			}
		}
	}
	return ret;
}
function ebook_getObjectHtml(){
	var fVars=ebook_getFlashVars();
	var ret='';
	if(typeof(pc_swfURL)=="undefined") pc_swfURL="appendix/eBook.swf";
	var swfURL=pc_swfURL + "?"+fVars;
	if(e_o.browser.mobile){
		ret+='<div id="viewerDiv" name="viewerDiv" style="width:100%;height:100%;">';
		if(window.ActiveXObject){
			ret+='<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="dBook" name="dBook" style="width:100%;height:100%;" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,2,0,0" border="0" onselect="javascript:return false;" oncontextmenu="javascript:return false;">';
			ret += '<param name="movie" value="'+swfURL+'" />';
			ret += '<param name="wmode" value="transparent" />';
			ret += '<param name="allowScriptAccess" value="sameDomain" />';
			ret += '<param name="allowFullScreen" value="true" />';
			ret += '</object>';
		}else{
			ret+='<embed src="'+swfURL+'" quality="high" wmode="transparent" bgcolor="#ffffff"id="dBook" name="dBook" style="width:100%;height:100%;" align="middle" type="application/x-shockwave-flash" allowScriptAccess="sameDomain" allowFullScreen="true" pluginspage="http://www.macromedia.com/go/getflashplayer"/>'
		}
		ret += '</div>';
	}else{
		ret+='<div id="viewerDiv" name="viewerDiv" style="width:100%;height:100%;">';
		if(window.ActiveXObject){
			ret+='<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="dBook" name="dBook" style="width:100%;height:100%;" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,2,0,0" border="0" onselect="javascript:return false;" oncontextmenu="javascript:return false;">';
			ret += '<param name="movie" value="'+swfURL+'" />';
			ret += '<param name="wmode" value="transparent" />';
			ret += '<param name="allowScriptAccess" value="sameDomain" />';
			ret += '<param name="allowFullScreen" value="true" />';
			ret += '</object>';
		}else{
			ret+='<embed src="'+swfURL+'" quality="high" wmode="transparent" bgcolor="#ffffff" id="dBook" name="dBook" style="width:100%;height:100%;" align="middle" type="application/x-shockwave-flash" allowScriptAccess="sameDomain" allowFullScreen="true" pluginspage="http://www.macromedia.com/go/getflashplayer">';
		}
		ret += '<div id="ebook_htmlTip"  name="ebook_htmlTip" onmouseover="javascript:link_tipOver(event);" onmouseout="javascript:link_tipOut(event);"  onresize="javascript:link_tipResize(event);"></div>';
		ret += '</div>';
	}
	return ret;
}
var e_arrMenuDisplay;
function ebook_fullscreen(isFullScreen){
	if(typeof(skin_sideMenuHideByFullScreen)=="undefined") skin_sideMenuHideByFullScreen=true;
	
	var skin_MenuTop=e_o.getObj("skin_MenuTop");
	var skin_MenuBottom=e_o.getObj("skin_MenuBottom");
	var skin_MenuLeft=e_o.getObj("skin_MenuLeft");
	var skin_MenuRight=e_o.getObj("skin_MenuRight");
	var td_viewerLeft=e_o.getObj("td_viewerLeft");
	var td_viewerRight=e_o.getObj("td_viewerRight");
	var smenu_bnd=e_o.getObj("smenu_bnd");
	if(isFullScreen){
		e_arrMenuDisplay=new Array();
		e_arrMenuDisplay.push(skin_MenuTop.style.display);
		e_arrMenuDisplay.push(skin_MenuBottom.style.display);
		e_arrMenuDisplay.push(skin_MenuLeft.style.display);
		e_arrMenuDisplay.push(skin_MenuRight.style.display);

		skin_MenuTop.style.display="none";
		skin_MenuBottom.style.display="none";
		skin_MenuLeft.style.display="none";
		skin_MenuRight.style.display="none";
		if(skin_sideMenuHideByFullScreen){
			e_arrMenuDisplay.push(td_viewerLeft.style.display);
			e_arrMenuDisplay.push(td_viewerRight.style.display);
			td_viewerLeft.style.display="none";
			td_viewerRight.style.display="none";
			if(smenu_bnd){
				e_arrMenuDisplay.push(smenu_bnd.style.display);
				try{
					if(smenu_o.curTab.length>0) smenu_o.tabClick(smenu_o.curTab);
				}catch(e){}
				smenu_bnd.style.display="none";
			}
		}
	}else{
		skin_MenuTop.style.display=e_arrMenuDisplay[0];
		skin_MenuBottom.style.display=e_arrMenuDisplay[1];
		skin_MenuLeft.style.display=e_arrMenuDisplay[2];
		skin_MenuRight.style.display=e_arrMenuDisplay[3];
		if(skin_sideMenuHideByFullScreen){
			td_viewerLeft.style.display=e_arrMenuDisplay[4];
			td_viewerRight.style.display=e_arrMenuDisplay[5];
		}
	}
}
function ebook_checkCommunication(bChk){
	var major=9;
	var minor=0;
	if(navigator.plugins!=null && navigator.plugins.length>0){
		try{
			var ver2=navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
			var desc=navigator.plugins["Shockwave Flash" + ver2].description;
			var arrDesc=desc.split(" ");
			var arrMajor=arrDesc[2].split(".");			
			major=parseInt(arrMajor[0]);
			minor=parseInt(arrMajor[1]);
		}catch(e){}
	}else if(window.ActiveXObject){
		try {
			var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
			var ver=axo.GetVariable("$version");
			var arr=ver.split(" ");
			var temp=arr[1];
			var arr2=temp.split(",");
			major=parseInt(arr2[0]);
			minor=parseInt(arr2[1]);
		}catch(e){}
	}
	
	if(major<10 || (major==10 && minor<2)){
		e_o.clearLoading();
		return;
	}
	if(e_initComplete) return;
	if(bChk) try{var chk=e_o.dBook().handle_checkCommunication();}catch(e){document.location.replace(e_absURL+"appendix/guide.htm");}
	else setTimeout("ebook_checkCommunication(true)", e_timeOutSec*1000);
}
function ebook_write(){
	var sReq=e_o.getRequestVar("zoombox");
	if(sReq=="n") e_zoomBox="no";
	sReq=e_o.getRequestVar("iconview");
	if(sReq=="n") e_iconView="no";
	sReq=e_o.getRequestVar("centerview");
	if(sReq=="n") e_bCenterView=false;
	else if(sReq=="y") e_bCenterView=true;
	sReq=e_o.getRequestVar("pagelabel");
	if(sReq=="n") e_pageLabel="";
	sReq=e_o.getRequestVar("extend");
	if(sReq=="n") e_bDbookExtend=false;
	else if(sReq=="y") e_bDbookExtend=true;
	sReq=e_o.getRequestVar("fit");
	if(sReq=="n" || sReq=="none"){
		e_bFitViewerToWindow=false;
		e_sizeFitMode = "none";
	}else if(sReq=="y" || sReq=="whole"){
		e_bFitViewerToWindow=true;
		e_sizeFitMode = "whole";
	}else if(sReq=="width"){
		e_bFitViewerToWindow=true;
		e_sizeFitMode = "width";		
	}else if(sReq=="height"){
		e_bFitViewerToWindow=true;
		e_sizeFitMode = "height";		
	}
	sReq=e_o.getRequestVar("fliptype");
	if(sReq=="hard" || sReq=="soft" || sReq=="deluxe" || sReq=="scroll" || sReq=="slideshow"){
		e_flipType=sReq;
	}
	sReq=e_o.getRequestVar("fscreen");
	if(sReq=="n" || sReq=="y" || sReq=="init" || sReq=="x") e_strFullScreen=sReq;
	sReq=e_o.getRequestVar("zoomone");
	if(sReq=="y") e_bZoomOnePage=true;
	else if(sReq=="n") e_bZoomOnePage=false;
	sReq=e_o.getRequestVar("border");
	if(sReq=="y") e_bViewBorderImg=true;
	else if(sReq=="n") e_bViewBorderImg=false;
	sReq=e_o.getRequestVar("dpage");
	if(sReq=="y") e_isDoublePage=true;
	else if(sReq=="n") e_isDoublePage=false;
	sReq=e_o.getRequestVar("oturn");
	if(sReq=="y") e_isOldTurn=true;
	else if(sReq=="n") e_isOldTurn=false;	
	sReq=e_o.getRequestVar("vturn");
	if(sReq=="y") e_isVerticalTurn=true;
	else if(sReq=="n") e_isVerticalTurn=false;
	sReq=e_o.getRequestVar("onetwo");
	if(sReq=="y") e_isOneImgTwoPage=true;
	else if(sReq=="n") e_isOneImgTwoPage=false;
	sReq=e_o.getRequestVar("cover");
	if(sReq=="y") e_bCoverSlide=true;
	else if(sReq=="n") e_bCoverSlide=false;
	sReq=e_o.getRequestVar("antialias");
	if(sReq=="y") e_bUseAntiAlias=true;
	else if(sReq=="n") e_bUseAntiAlias=false;
	
	sReq=parseInt(e_o.getRequestVar("spage"));
	if(sReq>0) e_startPage=sReq;
	
	sReq=parseInt(e_o.getRequestVar("epage"));
	if(sReq>0) e_endPage=sReq;
	
	if(ebook_init()){
		e_spage=parseInt(e_o.getRequestVar("rpage"));		
		if(isNaN(e_spage) || e_spage<=0){
			e_spage=parseInt(e_o.getRequestVar("startpage"));
			
			if(isNaN(e_spage) || e_spage<=0) e_spage=1;
			else{
				e_spage=e_spage-e_pageFix;
				if(e_isDoublePage && e_isOneImgTwoPage) e_spage=(e_bCoverSlide)?Math.ceil((e_spage+1)/2):Math.ceil(e_spage/2);
				
				if(e_spage<=0) e_spage=1;
			}
		}
		if(window.ActiveXObject && e_infoSize>5000 && e_absURL.indexOf("file://")==0){
			try{
				e_oReadBin = new ActiveXObject( "AlbummaniaKDMparser.Parser" );
				if( e_absURL.indexOf("file:///")==0 ) e_localPath = e_absURL.substring( "file:///".length );
				else e_localPath = "//" + e_absURL.substring( "file://".length );
				
				var re = new RegExp("/","g");
				e_localPath=e_localPath.replace(re, "\\");
				e_localPath = unescape( e_localPath );
				e_bReadBinUse=true;	
			}catch(e){
				document.write('<object classid="clsid:B21E0736-C2DD-4F68-A174-54801A7C5D77" width="1" height="1" codebase="'+e_absURL+'appendix/AlbummaniaKDMparser.cab#version=1,1,0,0"></object>');
				setTimeout("ebook_reload(0);", 2000);
				return;
			}
		}
		var html = ebook_getObjectHtml();
		document.write(html);
		ebook_addDefEventListner();
		e_RClick={
			init: function (){
				this.FlashObjectID = "dBook";
				this.FlashContainerID = "viewerDiv";
				this.Cache = this.FlashObjectID;
								
				if(window.addEventListener){
					document.addEventListener("mousedown", e_RClick.onGeckoMouseDown(), true);
					document.addEventListener("mouseup", e_RClick.onGeckoMouseUp(), false);
					if(e_o.browser.msie){
						document.getElementById(this.FlashContainerID).addEventListener("contextmenu", e_RClick.onContextMenu);
					}
					if(e_bSupportMouseWheel && !e_o.browser.msie){
						if(e_o.browser.mozilla)
							document.addEventListener('DOMMouseScroll', e_RClick.onMouseWheel, false);
						else 
							document.addEventListener('mousewheel', e_RClick.onMouseWheel, false);
					}
				}else{
					document.getElementById(this.FlashContainerID).onmouseup=e_RClick.onIEMouseUp;
					document.oncontextmenu = function(){ 
						if(window.event.srcElement.id == e_RClick.FlashObjectID) { return false; } else { e_RClick.Cache = "nan"; }
						if(window.event.srcElement.id == e_RClick.FlashContainerID) { return false; }
					}
					document.getElementById(this.FlashContainerID).onmousedown=e_RClick.onIEMouseDown;
					
					if(e_bSupportMouseWheel && !e_o.browser.msie) document.onmousewheel = e_RClick.onMouseWheel;
				}
			},
			killEvents: function(eventObject){
				if(eventObject){
					if (eventObject.stopPropagation) eventObject.stopPropagation();
					if (eventObject.preventDefault) eventObject.preventDefault();
					if (eventObject.preventCapture) eventObject.preventCapture();
					if (eventObject.preventBubble) eventObject.preventBubble();
				}
			},
			onContextMenu: function(evt){
				evt = evt || window.event;
				evt.preventDefault();
				e_RClick.Cache = "nan";
				return false;
			},
			onMouseWheel:function(ev){
				ev = ev || event;
				var tid = (ev.target)?ev.target.id:ev.srcElement.id;
				if(tid ==  e_RClick.FlashObjectID){
					var delta = 0;
					if(ev.wheelDelta)		delta = ev.wheelDelta;
					else if(ev.detail)		delta = -ev.detail;
					e_o.dBook().handle_mouseScroll(0, delta);
					e_RClick.killEvents(ev);
					
				}
			},
			onGeckoMouseDown: function(ev){
				return function(ev){
					if (ev.button>1){
						e_RClick.killEvents(ev);
						if(ev.target.id == e_RClick.FlashObjectID) {
							if(ev.layerX) e_RClick.call(true, ev.layerX, ev.layerY);
							else e_RClick.call(true, ev.offsetX, ev.offsetY);
							
							try{
								if(e_o.browser.msie){
									document.getElementById(e_RClick.FlashContainerID).setCapture(true);
								}
							}catch(e){}
							
						}
						e_RClick.Cache = ev.target.id;
						return false;
					}
				}
			},
			onGeckoMouseUp: function(ev){
				return function(ev){
					try{
						if(e_o.browser.msie){
							document.getElementById(e_RClick.FlashContainerID).releaseCapture();
							e_RClick.Cache = "nan";
						}
					}catch(e){}
					if (ev.button>1){
						if(ev.target.id== e_RClick.FlashObjectID || ev.target.id== e_RClick.FlashContainerID) {
							if(ev.layerX) e_RClick.call(false, ev.layerX, ev.layerY);
							else e_RClick.call(false, ev.offsetX, ev.offsetY);
						}
					}
				}
			},
			onIEMouseDown: function(){
				if (event.button>1){
					if(window.event.srcElement.id == e_RClick.FlashObjectID){
						e_RClick.call(true, event.offsetX, event.offsetY); 
					}
					try{
						document.getElementById(e_RClick.FlashContainerID).setCapture(true);
					}catch(e){}
					if(window.event.srcElement.id)
						e_RClick.Cache = window.event.srcElement.id;
				}
			},
			onIEMouseUp: function(){
				document.getElementById(e_RClick.FlashContainerID).releaseCapture();
				if (event.button>1){
					if(window.event.srcElement.id == e_RClick.FlashObjectID){
						e_RClick.call(false, event.offsetX, event.offsetY); 
					}
				}
			},
			call: function(isDown, mx, my) {
				document.getElementById(e_RClick.FlashObjectID).ext_mouseRight(isDown, mx,my);
			}
		}
		if(!e_o.browser.mobile) e_RClick.init();
	}
	setTimeout("e_o.writeLoadingImage();",12);
	setTimeout("ebook_checkCommunication(false);", 5000);

}
function ebook_reload(num){
	try{
		e_oReadBin = new ActiveXObject( "AlbummaniaKDMparser.Parser" );
		document.location.reload();
	}catch(e){
		setTimeout("ebook_reload("+(num+1)+");", 2000);
	}
}
function ebook_setDragZoom(mode, bStop){
	if(typeof(bStop)=="undefined") bStop=true;
	try{
		var bSet = !e_o.dBook().handle_getDragZoomState() && !e_o.dBook().handle_isLinkEditMode();
		
		if(bSet){
			e_o.dBook().handle_setDragZoom(true, mode, bStop);
			return true;
		}else{
			e_o.dBook().handle_setDragZoom(false, mode, bStop);
			return false;
		}
	}catch(e){return false;}	
}
function ebook_setTextCapture(){
	try{
		var bSet = !e_o.dBook().handle_getTextCaptureState() && !e_o.dBook().handle_isLinkEditMode();
		
		if(bSet){
			e_o.dBook().handle_setTextCapture(true);
			return true;
		}else{
			e_o.dBook().handle_setTextCapture(false);
			return false;
		}
	}catch(e){return false;}
}
function ebook_setImgCapture(){
	var bSet = !e_o.dBook().handle_getImgCaptureState() && !e_o.dBook().handle_isLinkEditMode();

	if(typeof(e_imgCaptureMode)!="string"){
		e_imgCaptureMode = "save";
	}
	if(e_imgCaptureMode=="save"){
		e_o.dBook().handle_setImgCapture(bSet, e_imgCaptureMode);
		return bSet;
	}else{
		if(!window.ActiveXObject) return false;
		if(bSet){
			if(typeof(e_oImgBox)=="undefined"){
				var sHtml='<object classid="clsid:5220cb21-c88d-11cf-b347-00aa00a28331">';
				sHtml+='<param name="LPKPath" value="appendix/csxImage.lpk"/>';
				sHtml+='</object>';
				sHtml+='<object id="e_oImgBox" name="e_oImgBox" classid="clsid:62E57FC5-1CCD-11D7-8344-00C1261173F0" CODEBASE="appendix/csxImage.cab#version=2,2,0,0" style="position:absolute;top:0px;left:0px;width:0px;height:0px;">';
				sHtml+="</object>";
				document.body.insertAdjacentHTML("beforeEnd",sHtml);
			}
			if(typeof(e_oImgBox.Visible)!="undefined"){
				e_o.dBook().handle_setImgCapture(true);
				return true;
			}else{
				return false;
			}
		}else{
			e_o.dBook().handle_setImgCapture(false);
			return false;
		}
	}
}
function ebook_saveCaptureImg(x,y,width,height){
	setTimeout("ebook_saveCaptureImgDelay("+x+","+y+","+width+","+height+");", 24);
}
function ebook_saveCaptureImgDelay(x,y,width,height){
	try{
		var viewRect=e_o.getElementRect(dBook);
		var left = window.screenLeft + viewRect.x + x+2;
		var top = window.screenTop + viewRect.y + y+2;
		e_oImgBox.CaptureScreen();
		e_oImgBox.Crop(left, top, left+width-1, top+height-1);
		e_oImgBox.UseSelection=false;
		e_oImgBox.Copy();
		alert(MSG_IMG_CAPTURE);
	}catch(e){}
}
function ebook_readBin(start, end){
	var ret = e_oReadBin.Bin_Dump(e_localPath+e_dataDirectory+"\\" + e_imgFile, start, end-start,  "");
	ret = ret.replace( /\\/g, "\\\\" );
	return  ret;
}
function ebook_deleteBin(path){
	path.replace(/\\/g, "\\\\");
	try{e_oReadBin.Bin_Delete(path);}catch(e){}
}
function ebook_block(evt){window.isblocked=true;}
function ebook_unload(){
	/*
	if(e_o.browser.msie && !window.isblocked){
		e_isUnload=true;
		for(var i=0;i<3;i++) try{e_o.dBook().handle_unload();}catch(e){}
	}
	*/
	window.isblocked=false;
}
function ebook_addDefEventListner(){
	if(viewerDiv.attachEvent){
		viewerDiv.attachEvent("onscroll",ebook_protectScroll);
	}
	e_bRemovedDefEventListner=false;
}
function ebook_protectScroll(evt){
	evt.srcElement.scrollTop=0;
	evt.srcElement.scrollLeft=0;
}
function ebook_removeDefEventListner(obj){
	if(window.detachEvent){
		window.detachEvent("onbeforeunload", ebook_unload);
		document.detachEvent("onclick", ebook_block);
	}
	e_bRemovedDefEventListner=true;
}
function ebook_setHighright(page, x1,y1,x2,y2){
	e_o.dBook().handle_setFocusArea(false, page, x1,y1,x2,y2, "blink=1&borderThick=3&bgColor=#EEEEEE", true, false);
}
function ebook_showFrame(frameID,url, bTrans, bView, bHideBg){
	if(typeof(bHideBg)=="undefinde") bHideBg = false;
	var oFrame = document.getElementById(frameID);
	if(oFrame){
		var strSrc = oFrame.src;
		if( strSrc.indexOf(e_absHref)>=0 ) strSrc=strSrc.substring(e_absHref.length, strSrc.length);
		
		if(strSrc==url){
			if(oFrame.style.visibility=="hidden") oFrame.style.visibility="visible";
			else if(!bView) oFrame.style.visibility="hidden";
			
			oFrame.style.display="";
		}else oFrame.src=url;
			
		try{
			if(oFrame.style.visibility=="visible"){
				if(document.frames) document.frames[frameID].frm_obj.focus();
				else if(window.frames) window.frames[frameID].frm_obj.focus();
				else oFrame.frm_obj.focus();
			}
		}catch(e){}
	}else{
		var oElement = document.createElement("iframe");
		oElement.id=frameID;
		oElement.name=frameID;
		oElement.frameBorder=0;
		oElement.scrolling="auto";
		oElement.style.position="absolute";
		oElement.style.left="0px";
		oElement.style.top="0px";
		oElement.style.visibility="hidden";
		oElement.allowTransparency=bTrans;
		if(!bHideBg){ 
			oElement.style.backgroundColor="#ffffff";
			oElement.style.filter = "Alpha(Opacity=90)"; 
			oElement.style.opacity=0.9;
		}
		document.getElementById("viewerDiv").appendChild(oElement);
		oElement.src = url;
		e_arrAppendFrame.push(frameID);
	}
}
function ebook_pressPrint(){
	e_o.dBook().handle_pressPrint();
}
function ebook_getOSType(){
	try{
		var ret = "unknown";
		var uagt = window.navigator.userAgent;
		uagt = uagt.toLowerCase();
		if(uagt.indexOf("win")>=0){
			if(uagt.indexOf("win95")>=0 || uagt.indexOf("windows 95")>=0) ret="Windows 95";
			else if(uagt.indexOf("win98")>=0 || uagt.indexOf("windows 98")>=0) ret="Windows 98";
			else if(uagt.indexOf("win 9x 4.90")>=0) uagt="Windows ME";
			else if(uagt.indexOf("windows nt 5.0")>=0) ret="Windows 2000";
			else if(uagt.indexOf("windows nt 5.1")>=0) ret="Windows XP";
			else if(uagt.indexOf("windows nt 5.2")>=0) ret="Windows 2003";
			else if(uagt.indexOf("windows nt 6.0")>=0) ret="Windows Vista";
			else if(uagt.indexOf("windows nt 6.1")>=0) ret="Windows 7";
			else if(uagt.indexOf("winnt")>=0 || ret.indexOf("windows nt")>=0) ret="Windows NT";
			else ret= window.navigator.platform;
		}else ret= window.navigator.platform;
		return ret;
	}catch(e){ return "unknown"; }
}
function ebook_isWindowOs(){
	try{
		if(window.navigator.platform.toLowerCase().indexOf("win")>=0) return true;
		else return false;
	}catch(e){}
	return false;
}
function ebook_preventEvtBubble(evt){
	try{if(evt.stopPropagation) evt.stopPropagation();}catch(e){}
	try{if(evt.preventDefault) evt.preventDefault();}catch(e){}
	try{if(evt.preventCapture) evt.preventCapture();}catch(e){}
	try{if(evt.preventBubble) evt.preventBubble();}catch(e){}
	try{
		evt.cancelBubble=true;
		evt.returnValue=false;
	}catch(e){}
}
function ebook_alert(str){
	if(e_o.isAlerted) return;
	e_o.isAlerted=true;
	setTimeout("try{alert(unescape('"+escape(str)+"'));e_o.isAlerted=false;}catch(e){e_o.isAlerted=false;}",10);
}
function ebook_debug(){
	try{
		var args=ebook_debug.arguments;
		var str="";
		for(var i=0;i<args.length;i++){
			var tmp=(typeof(args[i])=="undefined")?"":args[i].toString();
			if(i==0) str=tmp;
			else str=str+","+tmp;
		}
		document.frm.txtarea_debug.value = str + "\r\n" + document.frm.txtarea_debug.value;
	}catch(e){}
}
// 메모 삭제
function ebook_deletePostit(){
	if(confirm(MSG_MEMO_DEL)){
		return "y";
	}else{
		return "n";
	}
}
// 전체 삭제
function ebook_removeAllInPage(){
	if(confirm(MSG_MEMO_DELALL)) return "y";
	else return "n";
}

e_iconDirectory = "images";