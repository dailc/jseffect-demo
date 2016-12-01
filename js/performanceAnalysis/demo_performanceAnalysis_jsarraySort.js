/**
 * 作者: dailc
 * 时间: 2016-11-27
 * 描述:  JS中几种常用数组排序方式分析比较
 */
(function() {
	"use strict";
	//集成模板，拓展自己的数据
	var performaceAnalysis = window.PerformaceAnalysisLitemlate.extend({
		/**
		 * @description 自定义初始化数据
		 */
		customInitParams: function() {
			var self = this;
			//默认只执行一次
			self.perCountDom.value = 1;
			self.allLoopCountDom.value = 10;
			self.retryCount = parseInt(self.allLoopCountDom.value);
			self.runTimesCount = parseInt(self.perCountDom.value) * self.retryCount;
			self.initArrayParams();

		},
		/**
		 * @description 初始化数组相关参数
		 */
		initArrayParams: function() {
			var self = this;
			//默认的数组长度
			self.arrayLength = 3000;
			self.bucketCountDom = document.getElementById('bucket-count');
			//默认100桶
			self.bucketCount = self.bucketCountDom.value;
			self.resetArray();
			//数组长度变化
			app.event.bindEvent('#array-length', function() {
				self.arrayLength = parseInt(this.value);
				self.resetArray();
				self.resetRunQueue();
			}, 'change');
			//桶排序的分桶数
			app.event.bindEvent('#bucket-count', function() {
				self.bucketCount = self.bucketCountDom.value;
			}, 'change');

			//默认的几种类别
			app.event.bindEvent('.array-length-type', function() {
				var index = this.selectedIndex; // 选中索引
				var value = this.options[index].value; // 选中文本
				document.getElementById('array-length').value = value;
				self.arrayLength = parseInt(value);
				self.resetArray();
				self.resetRunQueue();
			}, 'change');

		},
		/**
		 * @description 重置数组
		 */
		resetArray: function() {
			var self = this;
			self.testArray = [];
			//插入self.arrayLength个随机数
			for(var i = 0; i < self.arrayLength; i++) {
				if(self.chooseType === 'sortString') {
					self.testArray.push(app.common.uuid(8));
				} else if(self.chooseType === 'bucketOnly') {
					//self.testArray.push(Math.floor(Math.random()*1000));
					self.testArray.push(Math.random()*10000);
				} else {
					self.testArray.push(parseInt(Math.random() * (1 << 16)));
				}

			}
			//代码前提显示文本 
			var preCode = self.getAllCustumPreCode();
			//先显示前提代码
			if(preCode['arraySort']) {
				document.getElementById('pre-code-tips').innerHTML = preCode['arraySort'].trim();
			}
		},
		/**
		 * @description type改变后,这里可以更改显示逻辑
		 * @param {String} type 类别
		 */
		typeChangeCallback: function(type) {
			var self = this;
			var bucketChooseDom = document.querySelector('.bucket-only');
			if(this.chooseType === 'bucketOnly') {
				document.getElementById('array-length').value = 100000;
				self.arrayLength = 100000;
				bucketChooseDom.classList.remove('hide');
			} else {
				bucketChooseDom.classList.add('hide');
			}
			this.resetArray();
		},
		resetRunQueue: function() {
			var self = this;
			//执行队列也必须重置,否则会在隐藏的执行
			var currentRunQueue = [];
			//有一些排序控制不让数字过大
			for(var item in self.allData) {
				var dom = document.getElementById(self.allData[item].domId);
				if(self.allData[item].maxLength && self.allData[item].maxLength < self.arrayLength) {
					dom && (dom.style.display = 'none');
				} else {

					if((!self.allData[item].needEs6 || isEs6) && self.allData[item].supportType.indexOf(self.chooseType) !== -1) {
						if(self.allData[item].maxCount && self.runTimesCount > self.allData[item].maxCount) {
							continue;
						}
						dom && (dom.style.display = 'table-row');
						currentRunQueue.push(self.allData[item]);
					}
				}
			}
			self.currentRunQueue = currentRunQueue;
		},
		/**
		 * @description 活动分析模式,返回键值对
		 */
		getCustumAnalysisType: function() {
			return {
				"arraySort": "数字数组排序比较",
				"sortString": "字符串数组排序比较",
				"bucketOnly": "仅有桶排序"
			};
		},
		getAllCustumPreCode: function() {
			var self = this;
			var html = self.getArrayShow(self.testArray);
			return {
				"arraySort": "var arr = " + html + ";",
				"sortString": "var arr = " + html + ";"
			};
		},
		/**
		 * @description 得到一个很长数组的省略显示
		 * @param {Array} arr
		 */
		getArrayShow: function(arr, isStr) {
			var self = this;
			var html = '[随机数组]';
			var count = 9;

			if(arr) {
				html = '[';
				for(var i = 0, len = arr.length;
					(i < len - 1) && i < count; i++) {
					html += arr[i] + ',';
					if(self.chooseType === 'sortString' && i !== 0 && i % 3 === 0) {
						html += '<br/>';
					} else if(self.chooseType === 'bucketOnly' &&i % 2 === 1) {
						html += '<br/>';
					} 
				}
				if(arr.length > (count + 1)) {
					html += '...省略' + (arr.length - count - 1) + '个元素...,';
					if(self.chooseType === 'sortString'||self.chooseType === 'bucketOnly') {
						html += '<br/>';
					}
				}

				html += arr[arr.length - 1] + ']';
			}
			return html;
		},
		/**
		 * @description 得到默认的提示
		 */
		getCustomAttentionTips: function() {
			//默认什么都不做
			var html = '';
			html += '<p>几种数组排序方式方式的比较</p>';

			html += '<p>目前对比几大类型:冒泡,冒泡优化版,插入，选择，归并，快速，希尔，堆排序，桶排序，计数排序，基数排序，自带sort等等</p>';

			html += '<p>每种排序都默认只执行10次(可以改变)，数组为随机数字数组，长度默认为3000</p>';

			html += '<p>可以看到,不同的方式差距较大</p>';

			html += '<p>注意,目前针对各自的性能，数组长度分别超过以下几个级别后会隐藏性能消耗较大的,3万级别,10万级别,50万级别,100万级别</p>';

			html += '<p>比如1000001，则会隐藏所有代码</p>';

			html += '<p>注意，桶排序中，分桶数要合理</p>';
			
			html += '<p>可以看出，几种不同的桶排序写法么，在不同分桶，长度的情况下的比较</p>';
			return html;
		},
		/**
		 * @description 初始化一些前提代码
		 */
		setCustomPreCode: function(callback) {
			var self = this;
			var a, b, tmp, arr;
			if(self.chooseType === 'arraySort' || self.chooseType === 'bucketOnly') {
				//使用相同的数组,防止数据源不同而有所干扰
				arr = self.testArray;
			} else if(self.chooseType === 'sortString') {
				//使用相同的数组,防止数据源不同而有所干扰
				arr = self.testArray;
			}
			callback && callback(a, b, tmp, arr);
		},
		/**
		 * @description 将详情显示出来
		 * @param {Number} sum 执行runTimesCount总共耗时多少毫秒
		 * @param {Number} perSecond 平均每秒执行多少次
		 * @param {Number} meanDeviationsPercent 平均差为百分之多少
		 */
		customeShowTips: function(sum, perSecond, meanDeviationsPercent, a, b, tmp, arr, finalArr) {
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
			html += '最终数组:';
			html += '</span>';
			html += '<span class="block">';
			html += self.getArrayShow(finalArr);
			html += '</span>';
			return html;

		},
		/**
		 * @description 获取代码内部的gap
		 * @param {Number} number
		 */
		gapTxt: function(number) {
			var txt = '';
			for(var i = 0; i < number; i++) {
				txt += '&nbsp;';
			}
			return txt;
		},
		getAllCustomData: function() {
			var self = this;
			var allData = {
				//自带sort
				"tmp_arraySort_sysSort": {
					//是否需要es6才会显示
					"needEs6": false,
					//当数组长度超过这个时,自动隐藏
					"maxLength": 1000000,
					"supportType": "sortString",
					//显示的domID,必须唯一
					"domId": "tmp_arraySort_sysSort",
					'name': '默认的sort方法<br/>',
					"codeHtml": function() {
						return document.getElementById('code-sysSort').innerHTML;
					},
					"runCode": function(perCount, a, b, tmp, arrV) {
						//防止干扰,深复制
						var arr = arrV.slice(0);
						var begin = (new Date()).getTime();
						//默认是对字符串排序,数字需要自己重写
						arr.sort();
						var end = (new Date()).getTime();
						//保证每次的数据源都一样,没有被污染,使用的是拷贝进行排序
						return {
							begin: begin,
							end: end,
							arr: arrV,
							finalArr: arr
						};
					},
				},
				//自带sort
				"tmp_arraySort_sysSort_number": {
					//是否需要es6才会显示
					"needEs6": false,
					//当数组长度超过这个时,自动隐藏
					"maxLength": 1000000,
					"supportType": "arraySort",
					//显示的domID,必须唯一
					"domId": "tmp_arraySort_sysSort_number",
					'name': '数字数组的sort方法<br/>',
					"codeHtml": function() {
						return document.getElementById('code-sysSort-number').innerHTML;
					},
					"runCode": function(perCount, a, b, tmp, arrV) {
						//防止干扰,深复制
						var arr = arrV.slice(0);
						var begin = (new Date()).getTime();
						//默认是对字符串排序,数字需要自己重写
						arr.sort(function(a, b) {
							return a - b;
						});
						var end = (new Date()).getTime();
						//保证每次的数据源都一样,没有被污染,使用的是拷贝进行排序
						return {
							begin: begin,
							end: end,
							arr: arrV,
							finalArr: arr
						};
					},
				},
				/* 冒泡排序默认
				 * 最坏时间复杂度：O（n^2）
				 * 稳定性：稳定
				 * 空间复杂度：O(1)
				 */

				"tmp_arraySort_bubble": {
					//是否需要es6才会显示
					"needEs6": false,
					//当数组长度超过这个时,自动隐藏
					"maxLength": 30000,
					"supportType": "arraySort_sortString",
					//显示的domID,必须唯一
					"domId": "tmp_arraySort_bubble",
					'name': '冒泡排序<br/>默认实现',
					"codeHtml": function() {
						return document.getElementById('code-bubblesort-default').innerHTML;
					},
					"runCode": function(perCount, a, b, tmp, arrV) {
						//防止干扰,深复制
						var arr = arrV.slice(0);;

						var begin = (new Date()).getTime();
						//获取长度也要作为耗时计算,因为不同方法获取长度次数不一样,js变量声明是提前的,不影响
						var len = arr.length;
						for(var i = 0; i < len; i++) {
							for(var j = 0; j < len; j++) {
								if(arr[i] < arr[j]) {
									var tmp = arr[i];
									arr[i] = arr[j];
									arr[j] = tmp;
								}
							}
						}
						var end = (new Date()).getTime();
						//保证每次的数据源都一样,没有被污染,使用的是拷贝进行排序
						return {
							begin: begin,
							end: end,
							arr: arrV,
							finalArr: arr
						};
					},
				},
				//冒泡排序,优化1
				"tmp_arraySort_bubbleOptimize1": {
					//是否需要es6才会显示
					"needEs6": false,
					//当数组长度超过这个时,自动隐藏
					"maxLength": 30000,
					"supportType": "arraySort_sortString",
					//显示的domID,必须唯一
					"domId": "tmp_arraySort_bubbleOptimize1",
					'name': '冒泡排序<br/>第一种优化方案',
					"codeHtml": function() {
						return document.getElementById('code-bubblesort-optimize1').innerHTML;
					},
					"runCode": function(perCount, a, b, tmp, arrV) {
						//防止干扰,深复制
						var arr = arrV.slice(0);
						var begin = (new Date()).getTime();
						//获取长度也要作为耗时计算,因为不同方法获取长度次数不一样
						var len = arr.length,
							pos;
						for(var i = len - 1; i > 0; i = pos) {
							//每次默认为没有交换
							pos = 0;
							for(var j = 0; j < i; j++) {
								if(arr[j] > arr[j + 1]) {
									var tmp = arr[j];
									arr[j] = arr[j + 1];
									arr[j + 1] = tmp;
									pos = j;
								}
							}
						}
						var end = (new Date()).getTime();
						//保证每次的数据源都一样,没有被污染,使用的是拷贝进行排序
						return {
							begin: begin,
							end: end,
							arr: arrV,
							finalArr: arr
						};
					},
				},
				//冒泡排序,优化2
				"tmp_arraySort_bubbleOptimize2": {
					//是否需要es6才会显示
					"needEs6": false,
					//当数组长度超过这个时,自动隐藏
					"maxLength": 30000,
					"supportType": "arraySort_sortString",
					//显示的domID,必须唯一
					"domId": "tmp_arraySort_bubbleOptimize2",
					'name': '冒泡排序<br/>第二种优化方案',
					"codeHtml": function() {
						return document.getElementById('code-bubblesort-optimize2').innerHTML;
					},
					"runCode": function(perCount, a, b, tmp, arrV) {
						//防止干扰,深复制
						var arr = arrV.slice(0);
						var begin = (new Date()).getTime();
						//获取长度也要作为耗时计算,因为不同方法获取长度次数不一样
						var len = arr.length,
							j;
						//设置一个低位，一个高位
						var low = 0,
							high = len - 1; //设置变量的初始值	
						while(low < high) {
							for(j = low; j < high; ++j) {
								//正向冒泡,找到最大
								if(arr[j] > arr[j + 1]) {
									tmp = arr[j];
									arr[j] = arr[j + 1];
									arr[j + 1] = tmp;
								}
							}
							--high; //修改high值, 前移一位
							for(j = high; j > low; --j) {
								//反向冒泡,找到最小
								if(arr[j] < arr[j - 1]) {
									tmp = arr[j];
									arr[j] = arr[j - 1];
									arr[j - 1] = tmp;
								}
							}
							++low; //修改low值,后移一位
						}
						var end = (new Date()).getTime();
						//保证每次的数据源都一样,没有被污染,使用的是拷贝进行排序
						return {
							begin: begin,
							end: end,
							arr: arrV,
							finalArr: arr
						};
					},
				},
				/* 选择排序-因为交换的次数比冒泡的要少,所以反而没那么占用时间
				 * 最坏时间复杂度：O(n^2)
				 * 平均时间复杂度：O(n^2)
				 * 稳定性：稳定
				 * 空间复杂度：O(1)
				 */
				"tmp_arraySort_selectionSort": {
					//是否需要es6才会显示
					"needEs6": false,
					"maxLength": 30000,
					"supportType": "arraySort_sortString",
					//显示的domID,必须唯一
					"domId": "tmp_arraySort_selectionSort",
					'name': '选择排序<br/>',
					"codeHtml": function() {
						return document.getElementById('code-selectionsort').innerHTML;
					},
					"runCode": function(perCount, a, b, tmp, arrV) {
						//防止干扰,深复制
						var arr = arrV.slice(0);

						var begin = (new Date()).getTime();
						var len = arr.length,
							minIndex;
						for(var i = 0; i < len - 1; i++) {
							minIndex = i;
							for(var j = i + 1; j < len; j++) {
								if(arr[j] < arr[minIndex]) {
									minIndex = j;
								}
							}
							var tmp = arr[i];
							arr[i] = arr[minIndex];
							arr[minIndex] = tmp;
						}
						var end = (new Date()).getTime();
						//保证每次的数据源都一样,没有被污染,使用的是拷贝进行排序
						return {
							begin: begin,
							end: end,
							arr: arrV,
							finalArr: arr
						};
					},
				},
				/* 快速排序 -最应该掌握的,效率很高，而且不复杂
				 * 从数组中取一个值为基准值，并将剩下的值与之比较，小于基准值的放到左边，大于基准值的放到右边，
				 * 并再次对左右两边进行快速排序，直至左右两边只剩一个元素。
				 * 最坏时间复杂度：O（n^2） 当选择的基准值为最大值或最小值时
				 * 稳定性：不稳定
				 * 平均时间复杂度：O(n*log2n)
				 */
				"tmp_arraySort_quickSort": {
					//是否需要es6才会显示
					"needEs6": false,
					//当数组长度超过这个时,自动隐藏
					"maxLength": 500000,
					"supportType": "arraySort_sortString",
					//显示的domID,必须唯一
					"domId": "tmp_arraySort_quickSort",
					'name': '快速排序<br/>',
					"codeHtml": function() {
						return document.getElementById('code-quicksort').innerHTML;
					},
					"runCode": function(perCount, a, b, tmp, arrV) {
						//防止干扰,深复制
						var arr = arrV.slice(0);
						//quick的递归函数	
						var quick = function(arr) {
							var len = arr.length;
							if(len <= 1) {
								return arr;
							}
							var index = Math.floor(len / 2), //向下取整 根据中间的值作为比较对象  
								pindex = arr.splice(index, 1)[0], //需要删除中间值，以缩小排序的数组大小  
								left = [], //定义左右两个数组 左大右小  
								right = [];
							for(var i = 0; i < len - 1; i++) { //遍历整个数组 大放右 小放左  
								if(arr[i] >= pindex) {
									right.push(arr[i]);
								} else {
									left.push(arr[i]);
								}
							}
							return quick(left).concat([pindex], quick(right)); //继续递归并将数组合并  
						};
						var begin = (new Date()).getTime();
						arr = quick(arr);
						var end = (new Date()).getTime();
						//保证每次的数据源都一样,没有被污染,使用的是拷贝进行排序
						return {
							begin: begin,
							end: end,
							arr: arrV,
							finalArr: arr
						};
					},
				},
				/* 插入排序 
				 * 从数组第二个值开始，依次将后续的数值经过比较与前面排序后的序列比较后插入
				 * 最坏时间复杂度：O(n2)：
				 * 当数组是从大到小排列时，插入第一个元素需要移动一次，插入第二个需要移动两次，
				 * 以此类推，所以一共为1+2+3+4+......+（n-1）,与冒泡排序相同
				 * 最优时间复杂度：最好的情况是数组已经由小到大排好，则为O(n)
				 * 稳定性：稳定
				 * 空间复杂度：O(1)
				 */
				"tmp_arraySort_insertionSort": {
					//是否需要es6才会显示
					"needEs6": false,
					//当数组长度超过这个时,自动隐藏
					"maxLength": 30000,

					"supportType": "arraySort_sortString",
					//显示的domID,必须唯一
					"domId": "tmp_arraySort_insertionSort",
					'name': '插入排序<br/>',
					"codeHtml": function() {
						return document.getElementById('code-insertionsort').innerHTML;
					},
					"runCode": function(perCount, a, b, tmp, arrV) {
						//防止干扰,深复制
						var arr = arrV.slice(0);

						var begin = (new Date()).getTime();
						var len = arr.length,
							key;
						for(var i = 1; i < len; i++) {
							key = arr[i];
							var j = i - 1;
							while(arr[j] > key) {
								arr[j + 1] = arr[j];
								j--;
							}
							arr[j + 1] = key;
						}
						var end = (new Date()).getTime();
						//保证每次的数据源都一样,没有被污染,使用的是拷贝进行排序
						return {
							begin: begin,
							end: end,
							arr: arrV,
							finalArr: arr
						};
					},
				},
				//插入排序,优化1
				"tmp_arraySort_insertionSortOptimize1": {
					//是否需要es6才会显示
					"needEs6": false,
					//当数组长度超过这个时,自动隐藏
					"maxLength": 100000,
					"supportType": "arraySort_sortString",
					//显示的domID,必须唯一
					"domId": "tmp_arraySort_insertionSortOptimize1",
					'name': '插入排序<br/>优化方案1(二分查找)',
					"codeHtml": function() {
						return document.getElementById('code-insertionsort-optimize1').innerHTML;
					},
					"runCode": function(perCount, a, b, tmp, arrV) {
						//防止干扰,深复制
						var arr = arrV.slice(0);

						var begin = (new Date()).getTime();
						var len = arr.length,
							key, left, right, middle;
						for(var i = 1; i < len; i++) {
							key = arr[i], left = 0, right = i - 1;
							while(left <= right) {
								middle = parseInt((left + right) / 2);
								if(key < arr[middle]) {
									right = middle - 1;
								} else {
									left = middle + 1;
								}
							}
							for(var j = i - 1; j >= left; j--) {
								arr[j + 1] = arr[j];
							}
							arr[left] = key;
						}
						var end = (new Date()).getTime();
						//保证每次的数据源都一样,没有被污染,使用的是拷贝进行排序
						return {
							begin: begin,
							end: end,
							arr: arrV,
							finalArr: arr
						};
					},
				},
				/* 希尔排序-缩小增量排序
				 * 由于直接插入排序每一次插入新值都要与之前已经序列化的部分进行比较，越往后所需要比较的次数越多，
				 * 所以希尔排序通过设置步长，将整个数组依照步长分为一个个分块儿，将分块序列化之后再将整个数组进行插入排序。
				 * 时间复杂度：希尔排序的时间复杂度和其增量序列有关系，这涉及到数学上尚未解决的难题；
				 * 不过在某些序列中复杂度可以为O(n1.3);
				 * 稳定性：不稳定
				 * 空间复杂度：O(1)
				 */
				"tmp_arraySort_shellSort": {
					//是否需要es6才会显示
					"needEs6": false,
					//当数组长度超过这个时,自动隐藏
					"maxLength": 1000000,
					"supportType": "arraySort_sortString",
					//显示的domID,必须唯一
					"domId": "tmp_arraySort_shellSort",
					'name': '希尔排序<br/>又名缩小增量排序',
					"codeHtml": function() {
						return document.getElementById('code-shellsort').innerHTML;
					},
					"runCode": function(perCount, a, b, tmp, arrV) {
						//防止干扰,深复制
						var arr = arrV.slice(0);

						var begin = (new Date()).getTime();
						var gap = 1,
							key, i, j, tmp;
						var len = arr.length;
						//动态定义间隔序列
						while(gap < len / 5) {
							gap = gap * 5 + 1;
						}
						for(; gap > 0; gap = Math.floor(gap / 5)) {
							for(i = gap; i < len; i++) {
								tmp = arr[i];
								for(j = i - gap; j >= 0 && arr[j] > tmp; j -= gap) {
									arr[j + gap] = arr[j];
								}
								arr[j + gap] = tmp;
							}
						}
						var end = (new Date()).getTime();
						//保证每次的数据源都一样,没有被污染,使用的是拷贝进行排序
						return {
							begin: begin,
							end: end,
							arr: arrV,
							finalArr: arr
						};
					},
				},
				//归并排序
				"tmp_arraySort_mergeSort": {
					//是否需要es6才会显示
					"needEs6": false,
					//当数组长度超过这个时,自动隐藏
					"maxLength": 500000,
					"supportType": "arraySort_sortString",
					//显示的domID,必须唯一
					"domId": "tmp_arraySort_mergeSort",
					'name': '归并排序<br/>',
					"codeHtml": function() {
						return document.getElementById('code-mergesort').innerHTML;
					},
					"runCode": function(perCount, a, b, tmp, arrV) {
						//防止干扰,深复制
						var arr = arrV.slice(0);
						var merge = function(left, right) {
							var result = [];
							while(left.length && right.length) {
								if(left[0] <= right[0]) {
									result.push(left.shift());
								} else {
									result.push(right.shift());
								}
							}
							while(left.length)
								result.push(left.shift());
							while(right.length)
								result.push(right.shift());
							return result;
						};
						var mergeSort = function(arr) {
							var len = arr.length;
							if(len < 2) {
								return arr;
							}
							var middle = Math.floor(len / 2),
								left = arr.slice(0, middle),
								right = arr.slice(middle);
							return merge(mergeSort(left), mergeSort(right));
						};
						var begin = (new Date()).getTime();
						arr = mergeSort(arr);
						var end = (new Date()).getTime();
						//保证每次的数据源都一样,没有被污染,使用的是拷贝进行排序
						return {
							begin: begin,
							end: end,
							arr: arrV,
							finalArr: arr
						};
					},
				},
				//堆排序
				"tmp_arraySort_heapSort": {
					//是否需要es6才会显示
					"needEs6": false,
					//当数组长度超过这个时,自动隐藏
					"maxLength": 1000000,
					"supportType": "arraySort_sortString",
					//显示的domID,必须唯一
					"domId": "tmp_arraySort_heapSort",
					'name': '堆排序<br/>',
					"codeHtml": function() {
						return document.getElementById('code-heapsort').innerHTML;
					},
					"runCode": function(perCount, a, b, tmp, arrV) {
						//防止干扰,深复制
						var arr = arrV.slice(0);
						//维护堆
						var heapify = function(arr, x, len) {
							var l = 2 * x + 1,
								r = 2 * x + 2,
								largest = x,
								tmp;
							if(l < len && arr[l] > arr[largest]) {
								largest = l;
							}
							if(r < len && arr[r] > arr[largest]) {
								largest = r;
							}
							if(largest != x) {
								tmp = arr[x];
								arr[x] = arr[largest];
								arr[largest] = tmp;
								heapify(arr, largest, len);
							}
						};
						var heapSort = function(arr) {
							//建堆
							var heapSize = arr.length,
								tmp;
							for(var i = Math.floor(heapSize / 2) - 1; i >= 0; i--) {
								heapify(arr, i, heapSize);
							}
							//堆排序
							for(var j = heapSize - 1; j >= 1; j--) {
								tmp = arr[0];
								arr[0] = arr[j];
								arr[j] = tmp;
								heapify(arr, 0, --heapSize);
							}
							return arr;
						};
						var begin = (new Date()).getTime();
						arr = heapSort(arr);
						var end = (new Date()).getTime();
						//保证每次的数据源都一样,没有被污染,使用的是拷贝进行排序
						return {
							begin: begin,
							end: end,
							arr: arrV,
							finalArr: arr
						};
					},
				},
				//计数排序，只能对整数进行排序。
				"tmp_arraySort_countingSort": {
					//是否需要es6才会显示
					"needEs6": false,
					//当数组长度超过这个时,自动隐藏
					"maxLength": 1000000,
					"supportType": "arraySort",
					//显示的domID,必须唯一
					"domId": "tmp_arraySort_countingSort",
					'name': '计数排序<br/>(只能对整数进行排序)',
					"codeHtml": function() {
						return document.getElementById('code-countingsort').innerHTML;
					},
					"runCode": function(perCount, a, b, tmp, arrV) {
						//防止干扰,深复制
						var arr = arrV.slice(0);
						var countingSort = function(arr) {
							//额外开辟空间
							var B = [],
								C = [],
								min = arr[0],
								max = arr[0];
							var len = arr.length;
							for(var i = 0; i < len; i++) {
								min = min <= arr[i] ? min : arr[i];
								max = max >= arr[i] ? max : arr[i];
								C[arr[i]] = C[arr[i]] ? C[arr[i]] + 1 : 1;
							}
							for(var j = min; j < max; j++) {
								C[j + 1] = (C[j + 1] || 0) + (C[j] || 0);
							}
							for(var k = len - 1; k >= 0; k--) {
								B[C[arr[k]] - 1] = arr[k];
								C[arr[k]]--;
							}
							return B;
						};
						var begin = (new Date()).getTime();
						arr = countingSort(arr);
						var end = (new Date()).getTime();
						//保证每次的数据源都一样,没有被污染,使用的是拷贝进行排序
						return {
							begin: begin,
							end: end,
							arr: arrV,
							finalArr: arr
						};
					},
				},
				//桶排序,主要适用于独立均匀分布的数据，可以计算的数据量很大，而且符合线性期望时间
				"tmp_arraySort_bucketSort": {
					//是否需要es6才会显示
					"needEs6": false,
					//当数组长度超过这个时,自动隐藏
					"maxLength": 500000,
					"supportType": "arraySort_bucketOnly",
					//显示的domID,必须唯一
					"domId": "tmp_arraySort_bucketSort",
					'name': '桶排序<br/>',
					"codeHtml": function() {
						return document.getElementById('code-bucketsort').innerHTML;
					},
					"runCode": function(perCount, a, b, tmp, arrV) {
						//防止干扰,深复制
						var arr = arrV.slice(0);
						//只适用于数字
						var bucketSort = function(arr, bucketCount) {
							if(arr.length <= 1) {
								return arr;
							}
							bucketCount = bucketCount || 10;
							//初始化桶
							var len = arr.length,
								buckets = [],
								result = [],
								max = arr[0],
								min = arr[0];
							for(var i = 1; i < len; i++) {
								min = min <= arr[i] ? min : arr[i];
								max = max >= arr[i] ? max : arr[i];
							}
							//求出每一个桶的数值范围
							var space = (max - min + 1) / bucketCount;
							//将数值装入桶中
							for(var i = 0; i < len; i++) {
								//找到相应的桶序列
								var index = Math.floor((arr[i] - min) / space);
								//判断是否桶中已经有数值
								if(buckets[index]) {
									//数组从小到大排列
									var bucket = buckets[index];
									var k = bucket.length - 1;
									while(k >= 0 && buckets[index][k] > arr[i]) {
										buckets[index][k + 1] = buckets[index][k];
										k--
									}
									buckets[index][k + 1] = arr[i];
								} else {
									//新增数值入桶，暂时用数组模拟链表
									buckets[index] = [];
									buckets[index].push(arr[i]);
								}
							}
							//开始合并数组
							var n = 0;
							while(n < bucketCount) {
								if(buckets[n]){
									result = result.concat(buckets[n]);
								}	
								n++;
							}
							return result;
						};

						var begin = (new Date()).getTime();
						arr = bucketSort(arr, self.bucketCount);
						var end = (new Date()).getTime();
						//保证每次的数据源都一样,没有被污染,使用的是拷贝进行排序
						return {
							begin: begin,
							end: end,
							arr: arrV,
							finalArr: arr
						};
					},
				},
				//桶排序的js特别
				"tmp_arraySort_bucketSortOptimize1": {
					//是否需要es6才会显示
					"needEs6": false,
					//当数组长度超过这个时,自动隐藏
					"maxLength": 500000,
					"supportType": "arraySort_bucketOnly",
					//显示的domID,必须唯一
					"domId": "tmp_arraySort_bucketSortOptimize1",
					'name': '桶排序<br/>(js特别优化版)',
					"codeHtml": function() {
						return document.getElementById('code-bucketsort-optimize1').innerHTML;
					},
					"runCode": function(perCount, a, b, tmp, arrV) {
						//防止干扰,深复制
						var arr = arrV.slice(0);
						//只适用于数字
						var bucketSort = function(arr, bucketCount) {
							if(arr.length <= 1) {
								return arr;
							}
							bucketCount = bucketCount || 10;
							//初始化桶
							var len = arr.length,
								buckets = [],
								result = [],
								max = Math.max.apply(null, arr),
								min = Math.min.apply(null, arr);
							//求出每一个桶的数值范围
							var space = (max - min + 1) / bucketCount;
							//将数值装入桶中
							for(var i = 0; i < len; i++) {
								//找到相应的桶序列
								var index = Math.floor((arr[i] - min) / space);
								//判断是否桶中已经有数值
								if(buckets[index]) {
									//数组从小到大排列
									var bucket = buckets[index];
									var k = bucket.length - 1;
									while(k >= 0 && buckets[index][k] > arr[i]) {
										k--
									}
									//js中可以使用自己的api,splice
									buckets[index].splice(k + 1, 0, arr[i]);
								} else {
									//新增数值入桶，暂时用数组模拟链表
									buckets[index] = [];
									buckets[index].push(arr[i]);
								}
							}
							//开始合并数组
							var n = 0;
							while(n < bucketCount) {
								if(buckets[n]){
									result = result.concat(buckets[n]);			
								}	
								n++;
							}
							return result;
						};

						var begin = (new Date()).getTime();
						arr = bucketSort(arr, self.bucketCount);
						var end = (new Date()).getTime();
						//保证每次的数据源都一样,没有被污染,使用的是拷贝进行排序
						return {
							begin: begin,
							end: end,
							arr: arrV,
							finalArr: arr
						};
					},
				},
				//桶排序的空间事先分配版,因为分配空间会耗时，实际排序时空间假设已经分配好
				"tmp_arraySort_bucketSortOptimize2": {
					//是否需要es6才会显示
					"needEs6": false,
					//当数组长度超过这个时,自动隐藏
					"maxLength": 500000,
					"supportType": "arraySort_bucketOnly",
					//显示的domID,必须唯一
					"domId": "tmp_arraySort_bucketSortOptimize2",
					'name': '桶排序<br/>(事先创建数组版)',
					"codeHtml": function() {
						return document.getElementById('code-bucketsort-optimize2').innerHTML;
					},
					"runCode": function(perCount, a, b, tmp, arrV) {
						//防止干扰,深复制
						var arr = arrV.slice(0);
						//初始化桶
						var len = arr.length,
							buckets = [],
							result = [],
							max = Math.max.apply(null, arr),
							min = Math.min.apply(null, arr);
						var bucketCount = self.bucketCount;
						//每一个都创建一个数组
						for(var i=0;i<bucketCount;i++){
							buckets[i] = [];
						}
						//只适用于数字
						var bucketSort = function(arr) {
							if(arr.length <= 1) {
								return arr;
							}
							
							//求出每一个桶的数值范围
							var space = (max - min + 1) / bucketCount;
							
							//将数值装入桶中
							for(var i = 0; i < len; i++) {
								var tmp = arr[i];
								//找到相应的桶序列
								var index = Math.floor((tmp - min) / space);
								var bucket = buckets[index];
								//判断是否桶中已经有数值
								if(bucket.length>0) {
									//数组从小到大排列	
									var k = bucket.length - 1;
									while(k >= 0 && bucket[k] > tmp) {
										k--
									}
									//js中可以使用自己的api,splice
									bucket.splice(k + 1, 0, tmp);
								} else {
									bucket.push(tmp);
								}
							}
							//开始合并数组
							var n = 0;
							while(n < bucketCount) {
								if(buckets[n].length){
									result = result.concat(buckets[n]);
								}	
								
								n++;
							}
							return result;
						};

						var begin = (new Date()).getTime();
						arr = bucketSort(arr);
						var end = (new Date()).getTime();
						//保证每次的数据源都一样,没有被污染,使用的是拷贝进行排序
						return {
							begin: begin,
							end: end,
							arr: arrV,
							finalArr: arr
						};
					},
				},
				//基数排序
				"tmp_arraySort_radixSort": {
					//是否需要es6才会显示
					"needEs6": false,
					//当数组长度超过这个时,自动隐藏
					"maxLength": 500000,
					"supportType": "arraySort",
					//显示的domID,必须唯一
					"domId": "tmp_arraySort_radixSort",
					'name': '基数排序<br/>(每一个数值都要大于等于0,并知道数组中最大位数)',
					"codeHtml": function() {
						return document.getElementById('code-radixsort').innerHTML;
					},
					"runCode": function(perCount, a, b, tmp, arrV) {
						//防止干扰,深复制
						var arr = arrV.slice(0);
						var radixSort = function(arr, maxDigit) {
							var mod = 10;
							var dev = 1;
							var counter = [];
							for(var i = 0; i < maxDigit; i++, dev *= 10, mod *= 10) {
								for(var j = 0; j < arr.length; j++) {
									var bucket = parseInt((arr[j] % mod) / dev);
									if(counter[bucket] == null) {
										counter[bucket] = [];
									}
									counter[bucket].push(arr[j]);
								}
								var pos = 0;
								for(var j = 0; j < counter.length; j++) {
									var value = null;
									if(counter[j] != null) {
										while((value = counter[j].shift()) != null) {
											arr[pos++] = value;
										}
									}
								}
							}
							return arr;
						}
						var begin = (new Date()).getTime();
						arr = radixSort(arr, 7);
						var end = (new Date()).getTime();
						//保证每次的数据源都一样,没有被污染,使用的是拷贝进行排序
						return {
							begin: begin,
							end: end,
							arr: arrV,
							finalArr: arr
						};
					},
				},
			};
			return allData;
		},
	});
	new performaceAnalysis();

})();