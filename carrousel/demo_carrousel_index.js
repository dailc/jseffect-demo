/**
 * 作者: dailc
 * 时间: 2016-12-12
 * 描述:  通用滑动组件示例的脚本
 * 这里不与其他库耦合,使用原生js
 */
(function(exports) {
	exports.init = function(options, arrayData) {
		//下标
		var indicator = document.querySelector('.dai-carrousel-slider-indicator');
		var oldIndex =0;
		
		//初始化slider,普通的使用只需要这段代码即可,初始化,其它可自行探索
		var slider = new EffectLib.Carrousel(options).bindItemChangedHandler(function(preIndex, currentIndex) {
			console.log("preIndex：" + preIndex + ',currentIndex:' + currentIndex);
			if(arrayData){
				//图片轮播自行处理
				return ;
			}
			var indicators;
			if(indicator) {
				indicators = indicator.querySelectorAll('.dai-carrousel-indicator');
			}
			if(indicators && indicators[preIndex]) {
				indicators[preIndex].classList.remove('active');
			}
			if(indicators && indicators[oldIndex]) {
				indicators[oldIndex].classList.remove('active');
			}
			if(indicators && indicators[currentIndex]) {
				indicators[currentIndex].classList.add('active');
				oldIndex = currentIndex;
			}
		}).bindItemTapHandler(function(i, e) {
			console.log("点击:" + i);
		});
		
		
		//一些api测试
		bindEvent(".btn-prev", function() {
			slider.prev();
		}, "click");

		bindEvent(".btn-next", function() {
			slider.next();
		}, "click");

		bindEvent(".btn-random", function() {
			slider.moveTo(Math.floor(Math.random() * 4));
			//slider.moveTo(4);
		}, "click");

		var autoDom = document.querySelector(".btn-change-auto");
		bindEvent(autoDom, function() {
			if(options.interval) {
				autoDom.innerText = '是否自动轮播(不自动now)';
				options.interval = 0;

			} else {
				autoDom.innerText = '是否自动轮播(自动now)';
				options.interval = 2000;
			}
			resetCustom(options);
		}, "click");

		//btn-img-fill
		var imgDom = document.querySelector(".btn-img-fill");
		bindEvent(imgDom, function() {
			if(options.itemImgHeight && options.itemImgHeight !== 'auto') {
				options.itemImgHeight = '';
				imgDom.innerText = '是否img填充的切换(不填充now)';
			} else {
				options.itemImgHeight = '100%';
				imgDom.innerText = '是否img填充的切换(填充now)';
			}
			appendNew();
			appendNew();

			resetCustom(options);
		}, "click");

		var heightDom = document.querySelector(".btn-change-height");
		bindEvent(heightDom, function() {
			if(options.itemHeight) {
				options.itemHeight = '';
				heightDom.innerText = '是否固定高度的切换(不固定now)';
			} else {
				options.itemHeight = '200px';
				heightDom.innerText = '是否固定高度的切换(固定now)';
			}
			appendNew();
			appendNew();

			resetCustom(options);
		}, "click");

		bindEvent(".btn-append", function() {
			appendNew();
			//container.innerHTML += litemplate;
			//这次重置不更新options
			resetCustom();
		}, "click");

		bindEvent(".btn-append-img", function() {
			if(arrayData) {
				arrayData.push({
					url: "img/bg3.jpg"
				});
				//这次重置不更新options
				resetCustom();
			}

		}, "click");

		bindEvent(".btn-change-mode", function() {
			if(options.is3D) {
				//3d变2d
				options.is3D = false;
			} else {
				//2d变3d
				options.is3D = true;
			}
			//先解绑才能继续监听,否则就算reset了也不能
			//手动解绑后,item 内部的监听又会清除,所以需要再次加上
			resetCustom(options).unBindItemTapHandler().bindItemTapHandler(function(i) {
				console.log("mode点击:" + i);
			}).tap('.custom-item a,#helloword', innerClickHandler);
		}, "click");

		var rangeDom = document.querySelector('#widthChange');
		bindEvent(rangeDom, function() {
			options.itemWidth = rangeDom.value + '%';
			resetCustom(options);
		}, "input");

		//使用tap事件,因为内部的click被屏蔽了
		//a标签,因为默认的事件已经被阻止了的
		var innerClickHandler = function(e) {
			var href = this.getAttribute('href');
			if(this.id === 'helloword') {
				alert('Hello World!');
			} else if(href) {
				if(window.opener) {
					window.open(href, '_blank');
				} else {
					window.location.href = href;
				}

			}
		};
		slider.tap('.custom-item a,#helloword', innerClickHandler);

		//由于reset后,innerClick会被手动清除(只会保持最原始的item监听),所以我们手动再次加上inner监听
		var resetCustom = function(options) {
			return slider.reset(options).tap('.custom-item a,#helloword', innerClickHandler);
		}

	};

	//以下函数都与api无关,只是一些常用函数
	function appendNew() {
		var litemplate =
			'<div class="dai-carrousel-item custom-item" style="background: {{COLOR}};height: {{HEIGHT}}px;"></div>';
		litemplate = litemplate.replace('{{COLOR}}', randomColor()).replace('{{HEIGHT}}', ~~(Math.random() * 100 + 100));

		var container = document.querySelector('.dai-carrousel-container');
		appendHtmlChildCustom(container, litemplate);
		
	}

	function bindEvent(dom, callback, event) {
		if(typeof dom === 'string') {
			dom = document.querySelector(dom);
		}
		if(dom) {
			dom.addEventListener(event, callback, false);
		}
	}

	function randomColor() {
		var colorElements = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";
		var colorArray = colorElements.split(",");
		var color = "#";
		for(var i = 0; i < 6; i++) {
			color += colorArray[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	/**
	 * @description 将string字符串转为html对象,默认创一个div填充
	 * @param {String} strHtml 目标字符串
	 * @return {HTMLElement} 返回处理好后的html对象,如果字符串非法,返回null
	 */
	function pareseStringToHtml(strHtml) {
		if(strHtml == null || typeof(strHtml) != "string") {
			return null;
		}
		//创一个灵活的div
		var i, a = document.createElement("div");
		var b = document.createDocumentFragment();
		a.innerHTML = strHtml;
		while(i = a.firstChild) b.appendChild(i);
		return b;
	};
	/**
	 * @description给html对象添加子元素
	 * @param {HTMLElement} targetObj 目标dom，必须是原生对象
	 * @param {HTMLElement||String} childElem 目标html的字符串或者是dom对象
	 */
	function appendHtmlChildCustom(targetObj, childElem) {
		if(typeof targetObj === 'string') {
			targetObj = document.querySelector(targetObj);
		}
		if(targetObj == null || childElem == null || !(targetObj instanceof HTMLElement)) {
			return;
		}
		if(childElem instanceof HTMLElement) {
			targetObj.appendChild(childElem);
		} else {
			//否则,创建dom对象然后添加
			var tmpDomObk = pareseStringToHtml(childElem);
			if(tmpDomObk != null) {
				targetObj.appendChild(tmpDomObk);
			}
		}
	};
})(window.carrousel_biz = {});