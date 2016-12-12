/**
 * @description js模拟链表
 * 实现循环链表和非循环链表 
 * 单向链表与双向链表
 * @author dailc
 * @version 1.0
 * @time 2016-12-08
 */
(function(exports) {
	//node模块
	(function() {
		/**
		 * @description 链表中的node
		 * @param {Object} data
		 */
		function Node(data) {
			//节点的数据
			this.data = data;
			//直接前驱节点
			this._prev = null;
			//直接后继节点
			this._next = null;
		}
		exports.Node = Node;
	})();
	//双向链表模块
	(function() {
		/**
		 * @constructor 链表的构造函数
		 * @description 构造的变量由参数绝对，
		 * @param {JSON} options 额外的参数
		 * isLoop 是否是为循环链表,默认为false
		 */
		function LinkList(options) {
			options = options || {};
			//链表的头节点
			this.head = null;
			//链表的尾节点
			this.tail = null;
			//options参数的配置
			//isLoop,默认为非循环链表
			this.isLoop = options.isLoop || false;
		}

		/**
		 * @description 链表的append
		 * @param {Node} node DataStruct中的Node节点
		 */
		LinkList.prototype.append = function(node) {
			if(!this.head) {
				//如果不存在头节点,头和尾巴同时赋值
				this.head = node;
				this.tail = node;
			} else {
				//节点插入尾节点后面,并重新定义尾节点
				this.tail._next = node;
				node._prev = this.tail;
				this.tail = node;
			}
			if(this.isLoop) {
				//如果是循环链表，头和尾互相指向
				this.tail._next = this.head;
				this.head._prev = this.tail;
			}
		};

		/**
		 * @description 链表的remove
		 * @param {Node} node DataStruct中的Node节点
		 */
		LinkList.prototype.remove = function(node) {
			if(node._next) {
				node._next._prev = node._prev;
			}
			if(node._prev) {
				node._prev._next = node._next;
			}

			node._next = null;
			node._prev = null;
		};

		/**
		 * @description 链表的 traversal(遍历)
		 * @param {Function} callback 回调
		 */
		LinkList.prototype.traversal = function(callback) {
			//从头节点开始往后找
			var iterator = this.head;
			var isEnd = false;
			//终止函数
			var done = function() {
				isEnd = true;
			};

			while(iterator) {
				callback(iterator, done);
				iterator = iterator._next;
				//如果已经结束
				if(isEnd || iterator === this.head) {
					return;
				}
				
			}
		};
		//默认就是LinkList
		exports.LinkList = LinkList;
	})();
	
	//单向链表模块
	(function() {
	     /**
		 * @constructor 链表的构造函数
		 * @description 构造的变量由参数绝对，
		 * 单向链表用不到_prev
		 * @param {JSON} options 额外的参数
		 * isLoop 是否是为循环链表,默认为false
		 */
		function LinkList(options) {
			options = options || {};
			//链表的头节点
			this.head = null;
			//一个临时变量,记录当前节点
			this.current = null;
			//options参数的配置
			//isLoop,默认为非循环链表
			this.isLoop = options.isLoop || false;
		}

		/**
		 * @description 链表的append
		 * @param {Node} node DataStruct中的Node节点
		 */
		LinkList.prototype.append = function(node) {
			if(!this.head) {
				//如果不存在头节点
				this.head = node;
				this.current = this.head;
			} else {
				//节点插入当前节点后面，并更改当前节点的指向
				this.current._next = node;
				this.current = this.current._next;
			}
			if(this.isLoop) {
				//如果是循环链表，当前节点执行头节点
				this.current._next = this.head;
			}
		};

		/**
		 * @description 链表的remove
		 * @param {Node} node DataStruct中的Node节点
		 */
		LinkList.prototype.remove = function(node) {
			//需要遍历整个链表
			this.traversal(function(tmpNode,done){
				if(tmpNode._next === node){
					//如果当前节点的下一个节点为node
					//直接将当前的节点执行下下节点即可
					tmpNode._next = tmpNode._next._next;
					node._next = null;
					done();
				}
			});
		};

		/**
		 * @description 链表的 traversal(遍历)
		 * @param {Function} callback 回调
		 */
		LinkList.prototype.traversal = function(callback) {
			//从头节点开始往后找
			var iterator = this.head;
			var isEnd = false;
			//终止函数
			var done = function() {
				isEnd = true;
			};
			while(iterator) {
				callback(iterator, done);
				iterator = iterator._next;
				//如果已经结束
				if(isEnd || iterator === this.head) {
					return;
				}
				
			}
		};
		
		exports.SingleLinkList = LinkList;
	})();

})(window.DataStruct = {});