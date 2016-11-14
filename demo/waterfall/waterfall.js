window.onload = function () {
	waterfall("main","pic");
	var dataInt=[];
	for (var i = 1; i < 12; i++) {
		var src="./img/480 ("+i+").jpg";
		dataInt.push(src);
	}
	window.onscroll = function () {
		if ( checkscrollTop() ) {
			var oParent=document.getElementById("main");
			for (var i = 0; i < dataInt.length; i++) {
				var picDiv=document.createElement("div");
				var boxDiv=document.createElement("div");
				var creImg=document.createElement("img");
				picDiv.className="pic";
				boxDiv.className="box";
				creImg.src=dataInt[i];
				boxDiv.appendChild(creImg);
				picDiv.appendChild(boxDiv);
				oParent.appendChild(picDiv);
			};
			waterfall("main","pic");
		}
	}
	//鼠标滚动事件

	//检查是否达到滚动条件（最后图片的一半高度加上自身到页面顶部的高度<滚动条的高度）
	function checkscrollTop() {
		var oParent=document.getElementById("main");
		var aPic=getClassObj(oParent,"pic");
		var lastPicH=aPic[aPic.length-1].offsetTop+Math.floor(aPic[aPic.length-1].offsetHeight/2);
		var scrollTop=document.documentElement.scrollTop || document.body.scrollTop;
		var documentH=document.documentElement.clientHeight;
		return (lastPicH < scrollTop + documentH)?true:false;
	}

	//waterfall
	function waterfall(parent,className) {
		var oParent=document.getElementById(parent);
		var aPic=getClassObj(oParent,className);
		var aPicW=aPic[0].offsetWidth;
		var num=Math.floor(document.documentElement.clientWidth/aPicW);
		oParent.style.cssText="width:"+num*aPicW+"px;margin:0 auto;";

		var picArray=[]; //每列的高度
		for (var i = 0; i < aPic.length; i++) {
			var PicH=aPic[i].offsetHeight;
			if (i<num) {
				picArray[i]=PicH;
			} else {
				var minH=Math.min.apply(null,picArray);
				var minIndex=getIndexMin(picArray,minH);
				aPic[i].style.position="absolute";
				aPic[i].style.left=aPic[minIndex].offsetLeft+"px";
				aPic[i].style.top=minH+"px";
				picArray[minIndex]+=aPic[i].offsetHeight;
			}
		};
	}

	//获取最小值在数组的索引值
	function getIndexMin(arr,minH) {
		for (var i in arr) {
			if ( arr[i] == minH ) {
				return i;
			}
		};
	}
	//获取父级的所有指定class子集
	function getClassObj(parent,className) {
		var obj=parent.getElementsByTagName('*');
		var pinS=[];
		for (var i = 0; i < obj.length; i++) {
			if ( obj[i].className == className ) {
				pinS.push(obj[i]);
			}
		};
		return pinS;
	}

}