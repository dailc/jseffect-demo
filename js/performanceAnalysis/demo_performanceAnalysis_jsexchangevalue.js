/**
 * 作者: dailc
 * 时间: 2016-11-21
 * 描述:  js性能分析之js数值交换示例代码
 */
(function() {
	
	//集成模板，拓展自己的数据
	var performaceAnalysis = window.PerformaceAnalysisLitemlate.extend({
		/**
		 * @description 活动分析模式,返回键值对
		 */
		getCustumAnalysisType: function(){
			return {
				"number":"number",
				"string":"string",
				"object":"object",
				"array":"array"
			};
		},
		getAllCustumPreCode: function(){
			return {
				"number": "var a=1,b=2,tmp;",
				"string": "var a='111',b='222',tmp;",
				"object": 'var a={"s1":1},b={"s2":2},tmp;',
				"array": 'var arr = [{"s0":"1"},{"s1":"1"},{"s2":"1"}],tmp;'
				
			};
		},
		/**
		 * @description 得到默认的提示
		 */
		getCustomAttentionTips: function() {
			//默认什么都不做
			var html = '<p>es6下可以使用[a, b] = [b, a]方式(但是分析工具中默认把这段代码注释掉了)</p>';
			html += '<p>其中的array模式，只是用来测试数组中元素调换的性能，和普通模式有区别</p>';		
			html += '<p>eval模式由于太过于耗时，所以只允许执行次数小于100万次时出现</p>';		
			html += '<p>可以放心的时，所有的计时只针对于特定的运算，其它任何有影响的操作都不会纳入到计时范围</p>';
			
			return html;
		},
		/**
		 * @description type改变后,这里可以更改显示逻辑
		 * @param {String} type 类别
		 */
		typeChangeCallback: function(type){
			var self = this;
			if(type === 'es6') {
				//显示es6
				self.isSupportEs6 = true;
				self.perCountDom.value = 10000
				self.allLoopCountDom.value = 100;
				self.retryCount = parseInt(self.allLoopCountDom.value);
				self.runTimesCount = parseInt(self.perCountDom.value) * self.retryCount;
			} else if(type === 'noes6') {
				self.isSupportEs6 = false;
			} else {
				self.chooseType = type;
				if(self.chooseType === 'array') {
					//改变默认值，要不然执行速度会很慢
					self.perCountDom.value = 10000;
					self.runTimesCount = parseInt(self.perCountDom.value) * self.retryCount;
				} else {
					self.perCountDom.value = 1000000;
					self.allLoopCountDom.value = 100;
					self.retryCount = parseInt(self.allLoopCountDom.value);
					self.runTimesCount = parseInt(self.perCountDom.value) * self.retryCount;
				}
			}
		},
		/**
		 * @description 初始化一些前提代码
		 */
		setCustomPreCode: function(callback) {
			var self = this;
			var a, b, tmp, arr;
			if(self.chooseType === 'number') {
				a = 1;
				b = 2;
			} else if(self.chooseType === 'string') {
				a = '111';
				b = '222';
			} else if(self.chooseType === 'object') {
				a = {
					"s1": 1
				};
				b = {
					"s2": 2
				};
			} else if(self.chooseType === 'array') {
				arr = [{
					"s0": "1"
				}, {
					"s1": "1"
				}, {
					"s2": "1"
				}];
			} 
			callback&&callback(a, b, tmp, arr);
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
			html += '<span class="block">';
			if(self.chooseType === 'array') {
				html += '交换后array的值:' + JSON.stringify(arr);
			} else {
				if(self.chooseType === 'object') {
					a = JSON.stringify(a);
					b = JSON.stringify(b);
				}
				html += '交换后:a=' + a + ';b=' + b;

			}

			html += '</span>';
			
			return html;
			
		},
		getAllCustomData: function(){
			var allData = {
				//一个item
				"tmp_normal": {
					//是否需要es6才会显示
					"needEs6": false,
					"supportType": "number_string_object",
					//显示的domID,必须唯一
					"domId": "tmp_normal",
					'name': '普通Tmp变量交换方式',
					"codeHtml": 'tmp = a;<br/>a = b;<br/>b = tmp;',
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
							tmp = a;
							a = b;
							b = tmp;
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
				//一个item，normal方法，凡事变量是临时创建的
				"tmp_normal2": {
					//是否需要es6才会显示
					"needEs6": false,
					"supportType": "number_string_object",
					//显示的domID,必须唯一
					"domId": "tmp_normal2",
					'name': '普通Tmp变量交换方式<br/>但是tmp每次都用var声明<br/>(从这点我们可以看出JS解析引擎的顺序<br/>，var声明都是提前了的)',
					"codeHtml": 'var tmp = a;<br/>a = b;<br/>b = tmp;',
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
							var tmp = a;
							a = b;
							b = tmp;
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
				"tmp_objectChange1": {
					//是否需要es6才会显示
					"needEs6": false,
					"supportType": "number_string_object",
					//显示的domID,必须唯一
					"domId": "tmp_objectChange1",
					'name': '利用创建一个新的对象来进行数据交换',
					"codeHtml": 'a = {a : b, b : a};<br/>b = a.b;<br/>a = a.a;',
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
							a = {
								a: b,
								b: a
							};
							b = a.b;
							a = a.a;
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
				"tmp_arrayChange1": {
					//是否需要es6才会显示
					"needEs6": false,
					"supportType": "number_string_object",
					//显示的domID,必须唯一
					"domId": "tmp_arrayChange1",
					'name': '利用创建一个新的数组来进行数据交换<br/>交换方式1',
					"codeHtml": 'a = [b, b=a][0];<br/>',
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
							a = [b, b = a][0];
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
					}
				},
//				//一个item,es6这段代码在普通浏览器里编译不过
//				"tmp_arrayChange2": {
//					//是否需要es6才会显示
//					"needEs6": true,
//					"supportType": "number_string_object",
//					//显示的domID,必须唯一
//					"domId": "tmp_arrayChange2",
//					'name': '利用创建一个新的数组来进行数据交换,交换方式2(需要es6支持)',
//					"codeHtml": '[a, b] = [b, a];<br/>',
//					"runCode": function(perCount, a, b, tmp, arr) {
//						window.evalArrayChange2Result = {};
//						//eval执行影响效率，直接放置出错，所以暂时注释
//						//eval('var begin=(new Date()).getTime();for(i=0;i<perCount;i++){[a,b]=[b,a]}var end=(new Date()).getTime();evalArrayChange2Result={begin:begin,end:end,a:a,b:b,tmp:tmp,arr:arr};');
//						//return window.evalArrayChange2Result;
////												var begin = (new Date()).getTime();
////												for(i = 0; i < perCount; i++) {
////													[a, b] = [b, a];
////												}
////												var end = (new Date()).getTime();
////												return {
////													begin: begin,
////													end: end,
////													a: a,
////													b: b,
////													tmp: tmp,
////													arr: arr
////												};
//						
//					}
//				},
				//一个item
				"tmp_xor1": {
					//是否需要es6才会显示
					"needEs6": false,
					"supportType": "number_string",
					//显示的domID,必须唯一
					"domId": "tmp_xor1",
					'name': '数值(或字符串)之间的异或操作交换变量<br/>第一种方式',
					"codeHtml": 'a = (b = (a ^= b) ^ b) ^ a;<br/>',
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
							a = (b = (a ^= b) ^ b) ^ a;
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
					}
				},
				//一个item
				"tmp_xor2": {
					//是否需要es6才会显示
					"needEs6": false,
					"supportType": "number_string",
					//显示的domID,必须唯一
					"domId": "tmp_xor2",
					'name': '数值(或字符串)之间的异或操作交换变量<br/>第二种方式',
					"codeHtml": 'a ^=b;<br/>b ^=a;<br/>a ^=b; ',
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
							a ^= b;
							b ^= a;
							a ^= b;
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
					}
				},
				//一个item
				"tmp_plusAndMinus1": {
					//是否需要es6才会显示
					"needEs6": false,
					"supportType": "number",
					//显示的domID,必须唯一
					"domId": "tmp_plusAndMinus1",
					'name': '利用数字之间的加减运算来实现<br/>第一种加减方式',
					"codeHtml": 'a = a + b;<br/>b = a - b; <br/>a = a - b; ',
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
							a = a + b;
							b = a - b;
							a = a - b;
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
					}
				},
				//一个item
				"tmp_plusAndMinus2": {
					//是否需要es6才会显示
					"needEs6": false,
					"supportType": "number",
					//显示的domID,必须唯一
					"domId": "tmp_plusAndMinus2",
					'name': '利用数字之间的加减运算来实现<br/>第二种加减方式',
					"codeHtml": 'a = b -a +(b = a);<br/>',
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
							a = b - a + (b = a);
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
					}
				},
				//一个item
				"tmp_other1": {
					//是否需要es6才会显示
					"needEs6": false,
					//最大执行次数,设置了后超过它不会显示
					"maxCount": 100000000,
					"supportType": "number_string_object",
					//显示的domID,必须唯一
					"domId": "tmp_other1",
					'name': '其它比较偏门而且不实用的方案<br/>方案一,利用try catch交换',
					"codeHtml": 'a=(function(){;<br/>    try{return b}<br/>    finally{b=a}}<br/>)();',
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
							a = (function() {
								try {
									return b
								} finally {
									b = a
								}
							})();
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
					}
				},
				//一个item
				"tmp_other2": {
					//是否需要es6才会显示
					"needEs6": false,
					//最大执行次数,设置了后超过它不会显示
					"maxCount": 1000000,
					"supportType": "number_string",
					//显示的domID,必须唯一
					"domId": "tmp_other2",
					'name': '其它比较偏门而且不实用的方案<br/>方案二,利用eval<br/>(有毒，慎入，这种模式执行一万次耗时等于其它执行一亿次...)',
					"codeHtml": 'eval("a="+b+";b="+a);<br/>',
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
							eval("a=" + b + ";b=" + a + ';');
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
					}
				},
				//一个item,以下只是数组交换的对比
				"tmp_arrayItemExchange_arrayslice": {
					//是否需要es6才会显示
					"needEs6": false,
					"supportType": "array",
					//显示的domID,必须唯一
					"domId": "tmp_arrayItemExchange_arrayslice",
					'name': '数组中，交换两个特定位置元素的值<br/>这里默认交换的是第0个位置和第2个位置的值',
					"codeHtml": 'arr[0] = arr.splice(2, 1, arr[0])[0];<br/>',
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
							arr[0] = arr.splice(2, 1, arr[0])[0];
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
					}
				},
				//一个item,以下只是数组交换的对比
				"tmp_arrayItemExchange_tmpvalue": {
					//是否需要es6才会显示
					"needEs6": false,
					"supportType": "array",
					//显示的domID,必须唯一
					"domId": "tmp_arrayItemExchange_tmpvalue",
					'name': '普通Tmp变量交换数组第0个和第2个元素',
					"codeHtml": 'tmp = arr[0];<br/>arr[0]  = arr[2];<br/>arr[2] = tmp;',
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
							tmp = arr[0];
							arr[0] = arr[2];
							arr[2] = tmp;
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
					}
				},
				
			};
			return allData;
		},
	});
	new performaceAnalysis();
	
})();