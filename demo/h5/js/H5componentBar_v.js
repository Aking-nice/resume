/* 垂直柱状图表组件对象 */
var H5componentBar_v = function ( name, cfg ) {
	var component = new H5componentBar( name, cfg );

	var width = ( 100 / cfg.data.length ) >> 0 ;  // >> 0什么意思 (去掉小数)
	component.find('.line').width( width + '%');

	$.each( component.find('.rate') , function () {
		var w = $(this).css('width'); //这里用width()方法取出的数值不含%！
		$(this).height(w).width('');
	})

	$.each( component.find('.per') , function () {
		$(this).appendTo( $(this).prev() );
	})

	return component;
}