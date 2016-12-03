//源地址:https://github.com/dead-horse/js-linklist
//模拟链表
var linklist = {
	init: function(list) {
		list = list || {};
		list._idleNext = list;
		list._idlePrev = list;
		return list;
	},
	peek: function(list) {
		if(!list || list._idlePrev == list) return null;
		return list._idlePrev;
	},
	append: function(list, item) {
		this.remove(item);
		item._idleNext = list._idleNext;
		list._idleNext._idlePrev = item;
		item._idlePrev = list;
		list._idleNext = item;
	},
	remove: function(item) {
		if(item._idleNext) {
			item._idleNext._idlePrev = item._idlePrev;
		}

		if(item._idlePrev) {
			item._idlePrev._idleNext = item._idleNext;
		}

		item._idleNext = null;
		item._idlePrev = null;
	},
	traversal: function(list, fn) {
		var iterator = next(list);
		if(!iterator) {
			return;
		}
		var end = false;
		var done = function() {
			end = true;
		}
		while(iterator !== list) {
			var tmp = next(iterator);
			fn(iterator, done);
			if(end) {
				return;
			}
			iterator = tmp;
		}
	},
	reTraversal: function(list, fn) {
		var iterator = this.peek(list);
		if(!iterator) {
			return;
		}
		var end = false;
		var done = function() {
			end = true;
		}
		while(iterator !== list) {
			var tmp = this.peek(iterator);
			fn(iterator, done);
			if(end) {
				return;
			}
			iterator = tmp;
		}
	}
};