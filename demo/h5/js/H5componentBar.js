/* 散点图表组件对象 */
var H5componentBar = function ( name, cfg ) {
	var component = new H5componentBase( name, cfg );

	// 输出每个point
	$.each( cfg.data , function ( idx , item ) {
		var line = $('<div class="line">');
		var name = $('<div class="name">');
		var rate = $('<div class="rate">');
		var per  = $('<div class="per">');

		var bgStyle = '';
		if (item[2]) {
			bgStyle = 'style="background-color:'+item[2]+'"';
		}
		var width = (item[1]*100)+'%';
		rate.html('<div class="bg" '+bgStyle+'></div>');
		rate.css( 'width',width );
		
		name.text( item[0] );
		per.text( width );
		line.append( name ).append( rate ).append( per );

		component.append( line );
		
	})

	return component;
}