// JavaScript Document

// 获取html标签
var oHtml = document.documentElement;
 getSize();
function getSize(){
	// 获取屏幕的宽度
	var ascreen=oHtml.clientWidth;
	if (ascreen<=319) {
		oHtml.style.fontSize = '20px';
	} else if(ascreen>=640){
		oHtml.style.fontSize = '40px';
	}else{
		oHtml.style.fontSize=ascreen/16+"px";
	};		
}
// 当窗口发生改变的时候调用
window.onresize = function(){
	getSize();

}


//封装点击事件

window.wbl = {};
wbl.tap = function(dom,callback){

	if(typeof dom == 'object'){
		var isMove = false;
		var time = 0;
		dom.addEventListener('touchstart',function(e){
			time = Date.now();
		});
		dom.addEventListener('touchmove',function(e){
			isMove = true;
		});
		window.addEventListener('touchend',function(e){

			if(!isMove && (Date.now()-time) < 150){

				callback && callback(e);
			}

			isMove = false;
			time = 0;

		});

	}
}
