/* 雷达图表组件对象 */
var H5componentRader = function ( name, cfg ) {
	var component = new H5componentBase( name, cfg );

	//创建网格线
	var w = cfg.width; //此处宽高不缩小，是因为在retina及高清屏下显示更清晰
	var h = cfg.height;
	//加入一个canvas画布
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	component.append(cns);

	var r = w/2;
	var step = cfg.data.length;

	//计算一个圆周上的坐标(计算多边形的坐标)
	//已知:圆心坐标(a,b)、半径r , 角度deg
	//rad = (2*Math.PI/360) * (360/step) * i;
	//x = a + Math.sin(rad)*r;
	//y = b + Math.cos(rad)*r;

	//绘制网格背景（分面绘制，分为10份）
	var isBlue=false;
	for (var s = 10; s > 0; s--) {
		ctx.beginPath();
		for (var i = 0; i < step; i++) {
			var rad = (2*Math.PI/360) * (360/step) * i;
			var x = r + Math.sin(rad)*r*(s /10);
			var y = r + Math.cos(rad)*r*(s /10);
			ctx.lineTo(x,y);
		}

		ctx.closePath();
		ctx.fillStyle = (isBlue = !isBlue) ? '#e02b2a' : '#f1f9ff' ;
		ctx.fill();
	}
	ctx.stroke();

	//绘制伞骨
	for (var i = 0; i < step; i++) {
		var rad = (2*Math.PI/360) * (360/step) * i;
		var x = r + Math.sin(rad)*r;
		var y = r + Math.cos(rad)*r;
		ctx.moveTo(r,r);
		ctx.lineTo(x,y);

		//输出项目文字
		var text = $('<div class="text">');
		text.text( cfg.data[i][0]);
		text.css( 'transition' , 'all .5s ' +i*.1 +'s'); //设置每个文本出现延迟(叠加)效果

		if ( x > w/2 ) {
			text.css( 'left',x/2 + 5 );
		} else {
			text.css( 'right',(w-x)/2 + 5 );
		}

		if ( y > h/2 ) {
			text.css( 'top',y/2 + 5 );
		} else {
			text.css( 'bottom',(h-y)/2 + 5 );
		}

		if ( cfg.data[i][2] ) {
			text.css( 'color', cfg.data[i][2] );
		} 
		text.css( 'opacity', 0 );	
		component.append(text);
	}
	ctx.strokeStyle = '#e0e0e0';
	ctx.stroke();

	//数据层开发
	//加入一个canvas画布（数据）
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	component.append(cns);

	var draw = function( per ) {//per为动画的倍率值
		if ( per >= 1 ) {
			component.find('.text').css( 'opacity', 1 );
		} 
		if ( per <= 1 ) {
			component.find('.text').css( 'opacity', 0 );
		} 
		//清除画布
		ctx.clearRect(0,0,w,h);
		//输出数据的折线
		ctx.beginPath();
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 5;
		for (var i = 0; i < step; i++) {
			var rad = (2*Math.PI/360) * (360/step) * i;

			var rate = cfg.data[i][1]*per;

			var x = r + Math.sin(rad)*r*rate;
			var y = r + Math.cos(rad)*r*rate;

			ctx.lineTo(x,y);
		}	
		ctx.closePath();
		ctx.stroke();

		//输出数据的点
		ctx.fillStyle = '#000';
		ctx.lineWidth = 1;
		for (var i = 0; i < step; i++) {
			var rad = (2*Math.PI/360) * (360/step) * i;
			var rate = cfg.data[i][1]*per;
			var x = r + Math.sin(rad) * r * rate;
			var y = r + Math.cos(rad) * r * rate;
			ctx.beginPath();
			ctx.lineTo(x,y);
			ctx.arc(x,y,5,0,2*Math.PI);
			ctx.closePath();
			ctx.fill();	
		}	

	}
	// ... 很多自定义的参数
	component.on('onLoad',function () {
        var s = 0;
        for (var i = 0; i < 100; i++) {
        	setTimeout(function () {
        		s += 0.01;
        		draw(s);
        	},i*10+500)
        }
    })
    component.on('onLeave',function () {
    	var s = 1;
        for (var i = 0; i < 100; i++) {
        	setTimeout(function () {
        		s -= 0.01;
        		draw(s);
        	},i*10)
        }
    })
	return component;
}