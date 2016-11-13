# showDemo

自己写的一些精选功能点效果类库，如瀑布流，360加速球等效果

## 瀑布流效果
网页实现瀑布流效果的几种实现,包括
* js元素实现瀑布流效果(封装的一个js类库,不依赖于第三方插件),功能有
	* 初始化页面,将已有的dom以瀑布流形式展现
	* 在已有的瀑布流后面添加新的元素
	* 每次resize后js都会动态计算,以绝对布局absolute进行布局,适用于pc和移动端
	* 便于拓展,有相应拓展示例
* css3实现瀑布流效果(基于css3属性column-width),功能有
	* css3普通横线瀑布流
	* css3固定两列瀑布流

### js元素实现瀑布流效果
#### 效果图
![](https://dailc.github.io/showDemo/staticresource/waterfallflow/demo_js_waterfallflow_1.png)
#### 示例页面
[js瀑布流效果](https://dailc.github.io/showDemo/html/waterfallflow/demo_waterfall_flow_js.html)
#### 源码
[https://github.com/dailc/showDemo/blob/master/html/waterfallflow/demo_waterfall_flow_js.html](https://github.com/dailc/showDemo/blob/master/html/waterfallflow/demo_waterfall_flow_js.html)

### css3实现瀑布流效果
#### 效果图
![](https://dailc.github.io/showDemo/staticresource/waterfallflow/demo_js_waterfallflow_3.png)
#### 示例页面
[css3瀑布流效果](https://dailc.github.io/showDemo/html/waterfallflow/demo_waterfall_flow_css3.html)
#### 源码
[https://github.com/dailc/showDemo/blob/master/html/waterfallflow/demo_waterfall_flow_css3.html](https://github.com/dailc/showDemo/blob/master/html/waterfallflow/demo_waterfall_flow_css3.html)


## 相关博文
暂无

## License

MIT