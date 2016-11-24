/**
 * 作者: dailc
 * 时间: 2016-11-23
 * 描述:  性能分析系列，核心代码提取成模板，便于拓展多个性能分析页面
 * 封装了业务
 */
(function() {
	//创建一个分析模板，后续各类分析都基于这个进行继承
	//由于是用来给自己用，所以页面的id都固定不传了，定制一些关键代码足矣
	//需要变动的仅仅是分析模式以及
	window.PerformaceAnalysisLitemlate = app.Class.extend({
		/**
		 * @description 页面初始化,对象创建时会默认执行
		 * @param {JSON} 传入的一些配置参数
		 * isUseEs6
		 */
		init: function(options) {
			var self = this;
			options = options || {};
			self.options = options;
			self.initParams();
			self.initAllItems();
			self.initListeners();
			
		},
		/**
		 * @description 初始化分析模式
		 */
		initAnalysisType: function() {
			var self = this;
			//初始化分析模式
			var analysisType = self.getCustumAnalysisType();
			var html = '';
			for(var item in analysisType) {
				html += '<option value="' + item + '">' + analysisType[item] + '</option>';
			}
			document.querySelector('.exchange-type').innerHTML = html;
		},
		/**
		 * @description 初始化参数
		 */
		initParams: function() {
			var self = this;
			self.initAnalysisType();
			var selectType = document.querySelector('.exchange-type');
			var index = selectType.selectedIndex; // 选中索引
			var value = selectType.options[index].value; // 选中文本
			self.chooseType = value;

			var es6Type = document.querySelector('.es6-support');
			var index = es6Type.selectedIndex; // 选中索引
			var value2 = es6Type.options[index].value; // 选中文本

			if(value2 === 'es6') {
				self.isSupportEs6 = true;
			} else {
				self.isSupportEs6 = false;
			}
			//是否强行关闭的flag,设为true,在下一次判断时会中断
			self.isForceStopFlag = false;
			//当前没有执行
			self.isRunning = false;
			//输入框
			self.perCountDom = document.getElementById('per-run-count');
			self.allLoopCountDom = document.getElementById('all-loop-count');
			self.retryCount = parseInt(self.allLoopCountDom.value);
			//总执行的次数，不会小于100
			self.runTimesCount = parseInt(self.perCountDom.value) * self.retryCount;

			//判断系统
			var osInfo = app.getOSInfo();
			var browserInfo = app.getBrowserInfo();
			console.log(osInfo + ',~' + browserInfo);
			var sysInfoHtml = '测试环境:' + osInfo + '&nbsp;&nbsp;&nbsp;&nbsp;浏览器信息:' + browserInfo;
			document.querySelector('#test-table caption').innerHTML = sysInfoHtml;
			self.showAttentionTips();
			self.customInitParams();
		},
		/**
		 * @description 显示默认的提示
		 */
		showAttentionTips: function() {
			var self = this;
			//默认什么都不做
			var tips = self.getCustomAttentionTips();
			document.querySelector('.attention-tions').innerHTML = tips;
		},
		/**
		 * @description 初始化监听
		 */
		initListeners: function() {
			var self = this;
			app.bindEvent('.exchange-type, .es6-support', function() {
				var index = this.selectedIndex; // 选中索引
				var value = this.options[index].value; // 选中文本
				//console.log("选择:" + value);

				self.typeChangeCallback && self.typeChangeCallback(value);
				self.createAllItemHtml(self.chooseType, self.isSupportEs6);
			}, 'change');

			app.bindEvent('#per-run-count,#all-loop-count', function() {
				self.retryCount = parseInt(self.allLoopCountDom.value);
				//总执行的次数，不会小于100
				self.runTimesCount = parseInt(self.perCountDom.value) * self.retryCount;
				self.createAllItemHtml(self.chooseType, self.isSupportEs6);
			}, 'change');
			//执行按钮
			app.bindEvent('#btn-run', function() {
				console.log("开始执行");
				if(!self.isRunning) {
					self.isForceStopFlag = false;
					//如果没有开始执行
					self.run();
				} else {
					//否则，强行停止
					self.isForceStopFlag = true;
				}

			}, 'click');

		},
		/**
		 * @description 创建html,将所有的item显示出来
		 * @param {String} type 当前类别，number,string,object或array
		 * @param {Boolean} isEs6 当前是否支持es6
		 */
		createAllItemHtml: function(type, isEs6) {
			var self = this;
			//代码前提显示文本 
			var preCode = self.getAllCustumPreCode();
			//当前的运行队列
			var currentRunQueue = [];
			for(var item in self.allData) {
				//必须支持es6
				if((!self.allData[item].needEs6 || isEs6) && self.allData[item].supportType.indexOf(type) !== -1) {
					if(self.allData[item].maxCount && self.runTimesCount > self.allData[item].maxCount) {

						continue;
					}
					currentRunQueue.push(self.allData[item]);
				}
			}
			//创建html
			var createHtml = function() {
				var html = '';
				for(var i = 0, len = currentRunQueue.length; i < len; i++) {
					var tmp = currentRunQueue[i];
					html += '<tr id="' + tmp.domId + '" >';
					html += '<th >';
					html += '<div>' + tmp.name + '</div>';
					html += '</th>';
					html += '<td class="code">';
					html += '<pre><code>' + tmp.codeHtml + '</code></pre>';
					html += '</td>';
					html += '<td class="results" >';
					html += '等待执行';

					html += '</td>';
					html += '</tr>';
				}

				return html;
			};

			//先显示前提代码
			if(preCode[type]) {
				document.getElementById('pre-code-tips').innerHTML = preCode[type].trim();
			}

			var html = createHtml();
			document.getElementById('run-code-content').innerHTML = html;
			self.currentRunQueue = currentRunQueue;
			//console.log("当前执行队列:"+JSON.stringify(currentRunQueue));
		},
		/**
		 * @description 根据传入的domId,选择result
		 * @param {String} domId
		 */
		selectorResult: function(domId) {
			return document.querySelector('#' + domId + ' .results');
		},
		/**
		 * @description 显示进度
		 * @param{Number} index 当前执行第几次循环
		 * @param {String} domId 分析完后需要显示的dom的id
		 */
		showProgress: function(index, domId) {
			this.selectorResult(domId).innerHTML = '当前第' + index + '次循环';
		},
		/**
		 * @description 对结果进行分析
		 * @param {Function} callback 分析完后,回调回去
		 * @param {Array} countArray 计算出来的数组
		 * @param {String} domId 分析完后需要显示的dom的id
		 */
		analysis: function(callback, countArray, domId, a, b, tmp, arr) {
			var self = this;
			

			var sum = 0;
			var len = countArray.length;
			countArray.forEach(function(item, index) {
				sum += item;
			});
			//计算平均数
			var avage = sum / len;
			//计算平均差
			var meanDeviationsSum = 0;
			countArray.forEach(function(item, index) {
				meanDeviationsSum += Math.abs(avage - item);
			});
			var meanDeviations = meanDeviationsSum / len;
			var meanDeviationsPercent = meanDeviations * 100 / avage;

			//计算每秒执行
			var perSecond = self.runTimesCount * 1000 / sum;

			var html = self.customeShowTips(sum, perSecond, meanDeviationsPercent, a, b, tmp, arr);
			self.selectorResult(domId).innerHTML = html;
			callback && callback(sum);
		},

		/**
		 * @description 执行代码
		 * @param {JSON} 执行代码的目标code
		 * @param {Function} callback 执行完毕后的回调
		 */
		runCode: function(item, callback) {
			var self = this;
			self.setCustomPreCode(function(a, b, tmp, arr) {
				//默认执行100次
				//每次循环执行的次数
				var perCount = self.runTimesCount / self.retryCount;
				//数组记录所有的时间
				var countArray = [];
				var i, k, index = 0;
				//每次计算后使用新的变量继续计算
				var loop = function(a, b, tmp, arr) {
					//各自的执行代码,只计算核心部分，无关语句都不纳入计算范围
					var result = item.runCode(perCount, a, b, tmp, arr);
					countArray[index] = (result.end - result.begin);
					index++;
					self.showProgress(index, item.domId);
					if(self.isForceStopFlag) {
						//直接中断的
						callback && callback();
						return;
					}
					if(index < self.retryCount) {
						//继续loop,设置延迟防止锁死
						setTimeout(function() {
							loop(result.a, result.b, result.tmp, result.arr);
						}, 0);
					} else {
						//完成了
						self.analysis(function(sum) {
							callback && callback(sum);
						}, countArray, item.domId, result.a, result.b, result.tmp, result.arr);
					}
				};
				loop(a, b, tmp, arr);
			});

		},
		/**
		 * @description 开始执行代码
		 * 异步执行，但是计算的代码是在同步for循环里计算的
		 */
		run: function() {
			var self = this;
			if(!self.currentRunQueue){
				return ;
			}
			var btnDom = document.getElementById('btn-run');
			//先置空所有的状态
			self.currentRunQueue.forEach(function(item, index) {
				self.selectorResult(item.domId).innerHTML = '等待执行';
				//置空状态
				self.selectorResult(item.domId).style.cssText = '';
			});
			self.isRunning = true;
			btnDom.innerText = '停止测试';
			var index = 0;
			//存储所有sum的array
			var countArray = [];
			//每一个item执行完毕后也需要判断是否中断
			var loop = function(callback) {
				var tmp = self.currentRunQueue[index];
				var resultDom = self.selectorResult(tmp.domId);
				if(self.isForceStopFlag) {
					callback && callback();
				} else {
					resultDom.innerHTML = '执行中...';
					setTimeout(function() {
						//设置延迟防止锁死
						self.runCode(tmp, function(sum) {
							countArray[index] = sum;
							index++;
							if(index < self.currentRunQueue.length) {
								loop(callback);
							} else {
								callback && callback();
							}
						});

					}, 0);
				}
			};
			//loop完毕后执行回调
			loop(function() {
				self.isRunning = false;
				btnDom.innerText = '执行测试';
				if(!self.isForceStopFlag) {
					//如果没有被打断
					self.showResultColors(countArray);
				}
			});
		},
		/**
		 * @description 根据最终的统计数组，给不同的item涂色，比如最慢的，最快的
		 * @param {Array} countArray
		 */
		showResultColors: function(countArray) {
			var self = this;
			var max = Math.max.apply(null, countArray);
			var min = Math.min.apply(null, countArray);
			var maxIndex = countArray.indexOf(max);
			var minIndex = countArray.indexOf(min);
			//console.log("min:"+min+',minIndex:'+minIndex+',max:'+max+'，maxIndex:'+maxIndex);
			self.selectorResult(self.currentRunQueue[maxIndex].domId).style.background = 'pink';
			self.selectorResult(self.currentRunQueue[minIndex].domId).style.background = 'rgb(156, 238, 130)';
		},
		/**
		 * @description 初始化所有item
		 * 这里面的code数据才是本次探讨的核心，其它都是为它们服务的代码
		 */
		initAllItems: function() {
			var self = this;
			//获取所有的数据,可以自行拓展
			var allData = self.getAllCustomData();
			self.allData = allData;
			//创建，默认创建number类型，非es6
			self.createAllItemHtml(self.chooseType, self.isSupportEs6);

		},
		/**
		 * @description 活动分析模式,返回键值对
		 */
		getCustumAnalysisType: function() {
			return {
				"default": "default"
			};
		},
		/**
		 * @description 获取用户自定义代码前提
		 */
		getAllCustumPreCode: function() {
			return {
				"default": "暂无代码前提"
			};
		},
		/**
		 * @description 获取所有数据,自行拓展,默认为无
		 */
		getAllCustomData: function() {
			//返回一个默认数据
			return {
				//一个item
				"default": {
					//是否需要es6才会显示
					"needEs6": false,
					"supportType": "default",
					//显示的domID,必须唯一
					"domId": "tmp_default_default",
					'name': '当前没有执行代码',
					"codeHtml": '当前没有代码',
					"runCode": function(perCount, a, b, tmp, arr) {
						//什么都不执行
						return {
							begin: 0,
							end: 0
						}
					},
				}
			};
		},
		/**
		 * @description 自定义初始化数据
		 */
		customInitParams: function(){
			
		},
		/**
		 * @description 初始化一些前提代码
		 */
		setCustomPreCode: function(callback) {
			//默认什么都不做
			callback && callback();
		},
		/**
		 * @description 将详情显示出来
		 * @param {Number} sum 执行runTimesCount总共耗时多少毫秒
		 * @param {Number} perSecond 平均每秒执行多少次
		 * @param {Number} meanDeviationsPercent 平均差为百分之多少
		 */
		customeShowTips: function(sum, perSecond, meanDeviationsPercent, a, b, tmp, arr) {
			var self = this;
			var html = '没有有效代码执行';
			return html;
		},
		/**
		 * @description 得到默认的提示
		 */
		getCustomAttentionTips: function() {
			//默认什么都不做
			return '默认模板,这里放置自己的提示';
		},
		/**
		 * @description 类别切换时的回调
		 */
		typeChangeCallback: function(type) {
			//默认什么都不做
		},
	});
})();