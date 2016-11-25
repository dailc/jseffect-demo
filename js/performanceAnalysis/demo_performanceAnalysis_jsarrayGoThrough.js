/**
 * 作者: dailc
 * 时间: 2016-11-23
 * 描述:  js性能分析之js数组遍历
 */
(function() {

	//集成模板，拓展自己的数据
	var performaceAnalysis = window.PerformaceAnalysisLitemlate.extend({
		/**
		 * @description 自定义初始化数据
		 */
		customInitParams: function() {
			var self = this;
			self.perCountDom.value = 10;
			self.allLoopCountDom.value = 10;
			self.retryCount = parseInt(self.allLoopCountDom.value);
			self.runTimesCount = parseInt(self.perCountDom.value) * self.retryCount;
		},
		/**
		 * @description 活动分析模式,返回键值对
		 */
		getCustumAnalysisType: function() {
			return {
				"loopCompare": "循环方式对比"
			};
		},
		getAllCustumPreCode: function() {
			return {
				"loopCompare": "var arr = [0,'1',2,'3',...,'99999',100000];"
			};
		},
		/**
		 * @description 得到默认的提示
		 */
		getCustomAttentionTips: function() {
			//默认什么都不做
			var html = '';
			html += '<p>循环方式对比是专门对比普通for循环和foreach,以及其它遍历方式在大量运算后的结果</p>';
			
			html += '<p>目前对比三大类型,for循环,forin,foreach以及for循环的几种不同运用</p>';
			
			html += '<p>可以看到,不同的方式差距较大</p>';
			
			html += '<p>同样,目前设置了最大可运行执行阈值,大于某个数后,执行耗时较长的就会自动隐藏</p>';
			
			html += '<p>其中,forin大于100就会隐藏,map大于500就会隐藏</p>';
			return html;
		},
		/**
		 * @description 初始化一些前提代码
		 */
		setCustomPreCode: function(callback) {
			var self = this;
			var a, b, tmp, arr;
			if(self.chooseType === 'loopCompare') {
				arr = [];
				//插入100000个数据
				for(var i = 0; i < 100000; i++) {
					if(i % 2 === 0) {
						arr.push(i);
					} else {
						arr.push(i + '');
					}
				}
			}
			callback && callback(a, b, tmp, arr);
		},
		/**
		 * @description 将详情显示出来
		 * @param {Number} sum 执行runTimesCount总共耗时多少毫秒
		 * @param {Number} perSecond 平均每秒执行多少次
		 * @param {Number} meanDeviationsPercent 平均差为百分之多少
		 */
		customeShowTips: function(sum, perSecond, meanDeviationsPercent, a, b, tmp, arr) {
			var self = this;
			var html = '';

			html += '<span class="block">';
			html += '总耗时:' + sum + 'ms';
			html += '</span>';
			html += '<span class="block">';
			html += '平均每秒执行:' + perSecond.toFixed(2) + '次';
			html += '</span>';
			html += '<span class="block">';
			html += '执行平均差:' + meanDeviationsPercent.toFixed(2) + '%';
			html += '</span>';

			return html;

		},
		getAllCustomData: function() {
			var allData = {
				//一个item
				"tmp_loopCompare_for": {
					//是否需要es6才会显示
					"needEs6": false,
					"supportType": "loopCompare",
					//显示的domID,必须唯一
					"domId": "tmp_loopCompare_for",
					'name': 'for循环执行代码<br/>第一种方式',
					"codeHtml": 'for(j = 0; j < arr.length; j++) {<br/>   <br/>}',
					"runCode": function(perCount, a, b, tmp, arr) {
						//防止干扰
						var a = a,
							b = b,
							tmp = tmp,
							arr = arr,
							perCount = perCount,
							i, j;
						var begin = (new Date()).getTime();
						for(i = 0; i < perCount; i++) {
							for(var j = 0; j < arr.length; j++) {

							}
						}
						var end = (new Date()).getTime();
						return {
							begin: begin,
							end: end,
							a: a,
							b: b,
							tmp: tmp,
							arr: arr
						};
					},
				},
				//一个item
				"tmp_loopCompare_for2": {
					//是否需要es6才会显示
					"needEs6": false,
					"supportType": "loopCompare",
					//显示的domID,必须唯一
					"domId": "tmp_loopCompare_for2",
					'name': 'for循环执行代码<br/>第二种方式',
					"codeHtml": 'for(j = 0,len=arr.length; j < len; j++) {<br/>   <br/>}',
					"runCode": function(perCount, a, b, tmp, arr) {
						//防止干扰
						var a = a,
							b = b,
							tmp = tmp,
							arr = arr,
							perCount = perCount,
							i, j, len;
						var begin = (new Date()).getTime();
						for(i = 0; i < perCount; i++) {
							for(var j = 0, len = arr.length; j < len; j++) {

							}
						}
						var end = (new Date()).getTime();
						return {
							begin: begin,
							end: end,
							a: a,
							b: b,
							tmp: tmp,
							arr: arr
						};
					},
				},
				//一个item
				"tmp_loopCompare_for3": {
					//是否需要es6才会显示
					"needEs6": false,
					"maxCount": 10000,
					"supportType": "loopCompare",
					//显示的domID,必须唯一
					"domId": "tmp_loopCompare_for3",
					'name': 'for循环执行代码<br/>第三种方式',
					"codeHtml": 'for(j = 0; arr[j]!=null; j++) {<br/>   <br/>}',
					"runCode": function(perCount, a, b, tmp, arr) {
						//防止干扰
						var a = a,
							b = b,
							tmp = tmp,
							arr = arr,
							perCount = perCount,
							i, j, len;
						var begin = (new Date()).getTime();
						for(i = 0; i < perCount; i++) {
							for(j = 0; arr[j] != null; j++) {}
						}
						var end = (new Date()).getTime();
						return {
							begin: begin,
							end: end,
							a: a,
							b: b,
							tmp: tmp,
							arr: arr
						};
					},
				},
				//一个item
				"tmp_loopCompare_forin": {
					//是否需要es6才会显示
					"needEs6": false,
					"maxCount": 100,
					"supportType": "loopCompare",
					//显示的domID,必须唯一
					"domId": "tmp_loopCompare_forin",
					'name': 'for in循环执行代码<br/>',
					"codeHtml": 'for(j in arr) {<br/>   <br/>}',
					"runCode": function(perCount, a, b, tmp, arr) {
						//防止干扰
						var a = a,
							b = b,
							tmp = tmp,
							arr = arr,
							perCount = perCount,
							i, j, len;
						var begin = (new Date()).getTime();
						for(i = 0; i < perCount; i++) {
							for(j in arr) {}
						}
						var end = (new Date()).getTime();
						return {
							begin: begin,
							end: end,
							a: a,
							b: b,
							tmp: tmp,
							arr: arr
						};
					},
				},
				//一个item
				"tmp_loopCompare_foreach": {
					//是否需要es6才会显示
					"needEs6": false,
					"maxCount": 1000,
					"supportType": "loopCompare",
					//显示的domID,必须唯一
					"domId": "tmp_loopCompare_foreach",
					'name': 'for each循环执行代码<br/>',
					"codeHtml": 'arr.forEach(function(e){  <br/>   <br/>});',
					"runCode": function(perCount, a, b, tmp, arr) {
						//防止干扰
						var a = a,
							b = b,
							tmp = tmp,
							arr = arr,
							perCount = perCount,
							i, j, len;
						var begin = (new Date()).getTime();
						for(i = 0; i < perCount; i++) {
							arr.forEach(function(e) {

							});
						}
						var end = (new Date()).getTime();
						return {
							begin: begin,
							end: end,
							a: a,
							b: b,
							tmp: tmp,
							arr: arr
						};
					},
				},
				//一个item,对于一些不支持map的,app.js里面有进行补全
				"tmp_loopCompare_formap": {
					//是否需要es6才会显示
					"needEs6": false,
					"maxCount": 500,
					"supportType": "loopCompare",
					//显示的domID,必须唯一
					"domId": "tmp_loopCompare_formap",
					'name': 'for map循环执行代码<br/>',
					"codeHtml": 'arr.map(function(n){  <br/>   <br/>});',
					"runCode": function(perCount, a, b, tmp, arr) {
						//防止干扰
						var a = a,
							b = b,
							tmp = tmp,
							arr = arr,
							perCount = perCount,
							i, j, len;
						var begin = (new Date()).getTime();
						for(i = 0; i < perCount; i++) {
							arr.map(function(n) {

							});
						}
						var end = (new Date()).getTime();
						return {
							begin: begin,
							end: end,
							a: a,
							b: b,
							tmp: tmp,
							arr: arr
						};
					},
				},
			};
			return allData;
		},
	});
	new performaceAnalysis();
})();