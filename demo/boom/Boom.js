/*****     B  O  O  M     ****/
(function(window, undefined) {
	var 
		// css参数预设
		cssOption = {
			position: 'absolute',
			width: 0,
			height: 0,
			left: 0,
			top: 0
		},
		// 存储图片地址
		imgUrl = "",
		// 暴露的最终变量
		boom = function(elems, options) {
			return new boom.prototype.init(elems, options);
		},
		// 图片集
		imgArr = [],
		// 传入的图片个数
		imgLength = 0,
		// 动画效果预设参数
		argOptions = {
			// 缩放值
			'scaleLevel': 3,
			// 模糊值
			'blurLevel': 3,
			// 弹射距离
			'boomLevel': 4,
			// 爆炸时长
			'boomTime': 800,
			// 是否打开日志，所有日志写在 log 方法里
			'isOpenLog': false
		},
		// 偏移距离
		arrRandomOffset = [1, -4, 8, -12, 16, -20, 24, -28, 32];

		// 计算坐标并添加新的层覆盖在原图上
		// 返回一个 jQuery 对象（dom 节点，是一个和图片高宽绝对定位坐标一致的 div）
		function calcPosition(elem){
			imgUrl = elem.attr('src') || "";

			//转化为js对象
			var obj = elem[0];

			// getBoundingClientRect 方法返回元素的大小及其相对于视口的位置
			// 这是个 JS 对象方法，注意下文和 jQuery 对象的相互转换
			var posi = obj.getBoundingClientRect(),
				elemCss = {
					width: obj.width,
					height: obj.height,
					top: posi.top,
					left: posi.left
				},
				realCss = $.extend(cssOption , elemCss);

			var newDiv = $(document.createElement('div'));

			newDiv.css(realCss);

			$('body').append(newDiv);
			return newDiv;
		}

		/**
		 * 计算 boom 动画轨迹终止点
		 * @param  center 图片中心坐标
		 * @param  div    将要运动的图片坐标
		 * @return {x,y}  返回点 div 的动画轨迹终止点
		 */
		function ramdomPosition(center, div){
			var 
			//直线率
				slope = 0,
				//爆炸范围
				randomBoomDis = Math.random() * 5;
				//距离 此处是当div位于中心点对称的x轴或者y轴
				distance = randomBoomDis * (center.x > center.y ? center.x : center.y),
				//结果
				result = {
					x: 0,
					y: 0
				}

				if (center.x != div.x && center.y != div.y) {
					slope = (center.y -div.y) / (center.x -div.x);

					//直线公式 ： y=kx+b
					var b = center.y - (slope*center.x),
						randomPosX = Math.random(),
						randomPosY = Math.random();
					//轨迹终止的Y点
					result.y=((2*div.y - center.y)) + ((randomPosX > 0.5 ? randomPosX * 4 : -randomPosX * 4)),
					//轨迹终止的X点
					result.x=((result.y -b) / slope) + ((randomPosY > 0.5 ? randomPosY * 4 : -randomPosY * 4));
					return result;
				} else if (center.x == div.x) {
					if (center.y > div.y) {
						return {
							x: center.x,
							y: center.y - distance
						}
					} else {
						return {
							x: center.x,
							y: center.y + distance
						}
					}
				} else if(center.y == div.y) {
					if (center.x > div.x) {
						return {
							x: center.x - distance,
							y: center.y
						}
					} else {
						return {
							x: center.x + distance,
							y: center.y
						}
					}
				} else {
					return;
				}
		}

		/**
		 * 在原图上生成小的 div 块
		 * @param elem 原图的 jQuery 对象
		 */
		function insertSmallDiv(elem){
			var obj = elem,
				width = elem.width(),
				height = elem.height(),
				miniNum = 10,
				widthNum = 0,
				heightNum = 0,
				//小div的宽度
				newElemWidth = 0,
				i = 0,  //i和j是为了小div定位设置
				j = 0,
				elemArr = [];
			if (width <= 10 && height <= 10) {
				return;
			} 

			//宽度大于高时用高算小div的个数，其他反之 是为了div的大小比例协调
			var basePoint = width >height ? height : width ; 

			if (basePoint == width) {
				newElemWidth = Math.floor(width / miniNum);
				heightNum = Math.floor(height / newElemWidth);
				widthNum = miniNum;
			} else {
				newElemWidth = Math.floor(height / miniNum);
				heightNum = Math.floor(width / newElemWidth);
				widthNum = miniNum;
			}

			//比较宽高大小，确定行数
			if (height > width) {
				widthNum = widthNum*heightNum;
				heightNum = widthNum/heightNum;
				widthNum = widthNum/heightNum;
			} 
			

			//插入每个div块，并定位
			for (; i < widthNum; i++) {
				for (; j < heightNum; j++) {
					var randomSize = Math.random() * argOptions.scaleLevel,
						randomBlur = Math.random() * argOptions.blurLevel,
						newElem = document.createElement('div'),
						cssTop = i * newElemWidth,
						cssLeft = j * newElemWidth,
						posiElemCss = {
							'background-image': 'url('+imgUrl+')',
							'background-repeat': 'no-repeat',
							'background-position': '-' + cssLeft + 'px '+'-' + cssTop + 'px',
							'position': 'absolute',
							'width': newElemWidth,
							'height': newElemWidth,
							'border-radius': '100%',
							'top': cssTop,
							'left': cssLeft,
							// 每个小块随机缩放，看上去更加真实
							'transform': 'scale('+randomSize+')',
							'-webkit-filter': 'blur('+randomBlur+'px)',
							'-moz-filter': 'blur('+randomBlur+'px)',
							'filter': 'blur('+randomBlur+'px)',
						}
						$(newElem).css(posiElemCss);
						elemArr.push(newElem);
				}
				j = 0; //i值不变，所以只重置j
			}
			elem.append(elemArr);
		}
		boom.prototype = {
			init: function(elems , options){
				var arrLength = arguments.length;

				if (arguments[0] !== undefined) {
					this.boom(elems);
				}

				argOptions = $.extend(argOptions , options);

				return this;
			},
			boom: function(elems) {
					var elemLength = elems.length;

					if (!elemLength) {
						return;
					} else {
						elem = elems.eq(imgLength++).css({
							"opacity": "1"
						});
					}

					if (imgLength == elemLength) {
						imgLength = 0;
					}

					var randomNum = Math.random() * 2,
						centerPonit = { //中心点
							x: Math.floor(elem.width() / 2) + randomNum,
							y: Math.floor(elem.height() / 2) - randomNum
						},
						newWrap = calcPosition(elem); //新图覆盖在原图上

					// insertSmallDiv(newWrap);
					// elem.hide();
					elem
						.delay(200, 'shake') //延迟两秒原图消失
						.queue('shake', function(next) {
							// 300s 后隐藏原图
							$(this).animate({
									opacity: 0
								}, {
									duration: 1
								})
								// 这里移除 shake 是为了二次触发
								.removeClass('shake');

							next();
						})
						// 摇晃效果
						.dequeue('shake')
						.addClass('shake')
						.queue('shake', function() {
							insertSmallDiv(newWrap);

							var divs = newWrap.find('div'),
								length = divs.length,
								i = 0;

							for (; i < length; i++) {
								var div = divs.eq(i),
									divPoint = {
										x: parseInt(div.css('left')),
										y: parseInt(div.css('top'))
									}

								// 一些随机数添加
								var resultPoint = ramdomPosition(centerPonit, divPoint);
								var randomOffset = arrRandomOffset[i % 9];

								divs.eq(i).animate({
									left: resultPoint.x + (Math.random() > 0.5 ? randomOffset : -randomOffset),
									top: resultPoint.y + (Math.random() > 0.5 ? randomOffset : -randomOffset),
									opacity: 0
								}, argOptions.boomTime);
							}
						});
			}
		}
		boom.prototype.init.prototype = boom.prototype; 
		window.boom = boom;
})(window)
