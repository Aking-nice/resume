/* 折线图表组件对象 */
var H5componenPolyline = function ( name, cfg ) {
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
	var step = 10;//水平网格线 100分为10份
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#999';

	window.ctx = ctx;

	for (var i = 0; i < step + 1; i++) {
		var y = h/step * i ;
		ctx.moveTo(0,y);
		ctx.lineTo(w,y);
	}
	//垂直网格线（根据项目个数瓜分）
	step = cfg.data.length+1;
	var text_w = w/step >>0;
	var tiemr =null;
	for (var i = 0; i < step + 1; i++) {
		var x = w/step * i ;
		ctx.moveTo(x,0);
		ctx.lineTo(x,h);
		if ( cfg.data[i] ) {
			var text = $('<div class="text"></div>');
			text.text( cfg.data[i][0] ); 
			text.css( 'width' , text_w/2 ).css( 'left' , x/2 + text_w/4 ); 
			component.append( text );  
		}
	}
	ctx.stroke();

	//加入画布 - 数据层
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	cns.width = ctx.width = w;
	cns.height = ctx.height = h;
	component.append(cns);

	/**
     *绘制折线图以及对应的数据和阴影	
     *	@param {floot} per 0到1之间的数据，会根据这个值绘制最终数的中间状态
     *	@return {DOM} component元素
     */	
	var draw = function( per ) {//per为动画的倍率值
		//清除画布
		ctx.clearRect(0,0,w,h);
		//绘制折线数据
		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#ff8878';
	
		var x = 0; 
		var y = 0;
		//画点
		for( i in cfg.data ){
			var item = cfg.data[i];
			var row_w = ( w / (cfg.data.length +1) );
			x = row_w*i + row_w;
			y =h*(1-item[1]*per); 
	
			ctx.moveTo(x,y);
			ctx.arc(x,y,5,0,2*Math.PI);
		}
	
		//连线
			//移动画笔到第一个数据点位置
			ctx.moveTo( row_w , h*(1-cfg.data[0][1]*per) );
		for( i in cfg.data ){
			var item = cfg.data[i];
			x = row_w*i + row_w;
			y =h*(1-item[1]*per); 
			ctx.lineTo(x,y);
		}
		ctx.stroke();
	
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgba(255,255,255,0)';
	
		//绘制阴影
		ctx.lineTo(x,h);
		ctx.lineTo(row_w,h);
		ctx.fillStyle = 'rgba(255,136,120,0.2)';
		ctx.fill();
	
		//写数据
		for( i in cfg.data ){
			var item = cfg.data[i];
			var row_w = ( w / (cfg.data.length +1) );
			x = row_w*i + row_w;
			y =h*(1-item[1]*per); 
			ctx.fillStyle = item[2] ? item[2]: '#595959';
			ctx.moveTo(x,y);
			ctx.fillText( (item[1]*100 >> 0 ) +'%' , x-10 , y-10 );
		}
		ctx.stroke();
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