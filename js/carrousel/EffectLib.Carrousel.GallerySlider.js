/**
 * @description  基于通用滑动组件进一步封装的图片轮播组件
 * 具体使用时,也可以将这个和carrousel进行合并,减少引用文件的数量
 * @author dailc
 * @version 1.0
 * @time 2016-12-13 
 * https://github.com/dailc
 */
(function() {
	//拓展 Carrousel 的 handleCustomData

	/**
	 * @description 自定义处理数据,可以通过重写这个方法来实现不同的类库
	 * 比如图片轮播组件就需要重写这个方案
	 * @param {HTMLElement} mainContainer 目标最外层容器
	 * 自定义数据时,可以在对这个容器进行任意操作,比如新增数据等等
	 * @param {JSON} options 配置参数,这样方便使用配置参数里面的值
	 */
	EffectLib.Carrousel.prototype.handleCustomData = function(mainContainer, options) {
		if(!options.imgData) {
			return;
		}
		var self = this;
		//开始拓展,基于数据生成html
		var html = generateGallerySliderHtmlByData(options.imgData);
		mainContainer.innerHTML = html;
		//这里由于innerHtml重新设置了,所以  self.isBindTouch要重置
		self.isBindTouch = false;

		

		if(options.isShowIndicator) {
			var oldIndex = 0;
			var indicator = document.querySelector('.dai-carrousel-slider-indicator');
			//内部的item变化
			self.innerItemChangeHandler = function(preIndex, currentIndex) {
				if(!indicator) {
					return;
				}
				var indicators = indicator.querySelectorAll('.dai-carrousel-indicator');
				if(indicators && indicators[oldIndex]) {
					indicators[oldIndex].classList.remove('active');
				}
				if(indicators && indicators[preIndex]) {
					indicators[preIndex].classList.remove('active');
				}
				if(indicators && indicators[currentIndex]) {
					indicators[currentIndex].classList.add('active');
					oldIndex = currentIndex;
				}
			};
		}

		//判断图片是否加载完毕,加载完毕后再进行reize
		waitImgLoaded(mainContainer, function() {
			self.resize();
		});
	};

	/**
	 * @description 等待container里的img加载
	 * @param {HTMLElement} dom 目标dom
	 * @param {Function} callback
	 */
	function waitImgLoaded(dom, callback) {
		var self = this;
		var imgArray = dom.querySelectorAll('img');
		var len = imgArray.length;
		var count = 0;
		Array.prototype.forEach.call(imgArray, function(el) {
			if(el.complete) {
				count++;
			} else {
				var countFun = function() {
					count++
					if(count >= len) {
						callback && callback();
						return;
					}
				};
				el.onload = countFun;
				el.onerror = countFun;
			}
		});
		if(count >= len) {
			callback && callback();
		}

	}
	/**
	 * @description 基于数据生成图片轮播的html
	 * @param {Array} data
	 */
	function generateGallerySliderHtmlByData(data) {
		var html = '';
		//首先生成容器的html
		html += '<div class="dai-carrousel-state">';
		html += '<div class="dai-carrousel-container">';
		var indicators = '';
		for(var i = 0, len = data.length; i < len; i++) {
			var tmp = data[i];
			html += '<div class="dai-carrousel-item">';
			html += '<img src="' + tmp.url + '" />';
			html += '</div>';

			var isactive = (i === 0) ? 'active' : ''
			indicators += '<div class="dai-carrousel-indicator ' + isactive + '" ></div>';
		}

		html += '</div>';
		html += '</div>';

		//slider-indicator
		html += '<div class="dai-carrousel-slider-indicator ">';

		html += indicators;

		html += '</div>';
		return html;
	}

})();