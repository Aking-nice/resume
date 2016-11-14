/* 内容管理对象 */
var H5 = function () {
	this.id = ( 'h5_c_'+Math.random() ).replace('.','_');
	this.el = $('<div class="h5" id="'+this.id+'">').hide();
	this.page = [];
	$('body').append( this.el );

	/**
	 * 新增一个页
	 * @param  {string} name 组件的名称，会加入到中ClamsName中
	 * @param  {[string]} text 页内的默认文本
	 * @return {[type]} H5对象，可以重复使用H5对象支持的方法
	 */
	this.addpage = function ( name , text ) {
		var page = $('<div class="h5_page section">');

		if ( name != undefined ) {
			page.addClass('h5_page_'+name); //添加每页名称
		};
		if ( text != undefined ) { 
			page.text(text);
		};
		this.el.append(page); //注意this指向
		this.page.push(page); //将当前的页面存储到数组
		if ( typeof this.whenAddPage === 'function' ) { 
			this.whenAddPage();
		};
		return this;		
	}
	/* 新增一个组件 */
	this.addComponent = function ( name , cfg ) {
		var cfg = cfg || {};
		cfg = $.extend({ //如没有cfg 则设为基础配置
			type:'base'
		},cfg)

		var component; //定义一个变量，存储 组件元素
		var page = this.page.slice(-1)[0];//获取当前的page
		switch( cfg.type ){
			case'base' :
				component = new H5componentBase(name,cfg);
			break;
			case'Polyline' :
				component = new H5componenPolyline(name,cfg);
			break;
			case'pie' :
				component = new H5componentPie(name,cfg);
			break;
			case'bar' :
				component = new H5componentBar(name,cfg);
			break;
			case'bar_v' :
				component = new H5componentBar_v(name,cfg);
			break;
			case'Rader' :
				component = new H5componentRader(name,cfg);
			break;
			case'ring' :
				component = new H5componentRing(name,cfg);
			break;
			case'point' :
				component = new H5componentPoint(name,cfg);
			break;

			default:
		}	
		page.append(component);
		return this;
	}
	/* H5对象初始化呈现 (所有资源加载完)*/
	this.loader = function ( firstPage ) {  //firstPage调试时将页面跳转到某页
		this.el.fullpage({
			onLeave:function ( index, nextIndex, direction ) {
				$(this).find('.h5_component').trigger('onLeave');
			},
			afterLoad:function ( anchorLink , index ) {
				$(this).find('.h5_component').trigger('onLoad');
			}
		});
		this.page[0].find('.h5_component').trigger('onLoad');
		this.el.show();
		if ( firstPage ) {
			$.fn.fullpage.moveTo( firstPage );
		}
	}
	this.loader = typeof loading == 'function' ? loading : this.loader;
	return this;
}
