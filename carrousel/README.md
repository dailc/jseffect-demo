## 滑动、轮播组件
一个通用的滑动、轮播组件，同时支持3D效果和2D效果。
可以拓展成图片轮播，旋转木马，页面滑动等等

### 使用步骤

#### 1.引入js和css文件

```
<link rel="stylesheet" href="EffectLib.Carrousel.css" />
<script src="EffectLib.Carrousel.js"></script>
```

#### 2.html结构
或者，例如自行拓展的GallerySlider进一步把Html也封装了，变为通过传入数据，动态生成Html结构

```
<div class="dai-carrousel-state">
    <div class="dai-carrousel-container">
        <div class="dai-carrousel-item" >
            <img src="img/bg1.jpg" />
        </div>
        <div class="dai-carrousel-item" >
            <img src="img/bg2.jpg" />
        </div>
        ...
    </div>
</div>
```

#### 3.初始化3d滑动

```
var slider = new EffectLib.Carrousel({
'containerSelector': '.show-3d-gallery-slider .gallery-slider',
'is3D': true,
'isLoop': true,
'itemWidth': '50%',
//强制固定高度
//'itemHeight': '160px',
//item的img样式,默认是 auto，也可以设置为 100%
//只有当item是div,并且存在img子级才有用
'itemImgHeight': '',
//如果设置了这个参数,就代表会自动轮播
//'interval':2000,
//自动轮播时默认的动画持续时间
'animationDuration': 1000,

});
```

#### 调用相关开放的API
支持链式调用

```
//重置,这时候可以重新设置options
slider.reset(options);

//prev,上一个item
slider.prev(duration);

//next,下一个item
slider.next(duration);

//moveTo,移动到某一个指定item,会寻找最短路径
slider.moveTo(duration);

//绑定item切换的监听回调
slider.bindItemTapHandler(handler);

//解绑item的tap监听，会取消所有的item的tap事件以及item内部的tap
slider.unBindItemTapHandler();

//绑定item内部某元素的tap事件，单独提供了tap监听函数
slider.tap(dom,fn);

```
更多请参考示例代码

### 注意事项

1. item内部的点击事件，请尽量用```slider.tap(dom,fn);```来进行绑定监听
2. 支持纵向滑动(意思是,当内容超出一屏时，在组件内部纵向滑动可以改变页面的scrollTop)

### 效果图
![](https://dailc.github.io/showDemo/staticresource/carrousel/demo_js_carrousel_1.png)
![](https://dailc.github.io/showDemo/staticresource/carrousel/demo_js_carrousel_2.png)

### 示例页面
[通用滑动组件实现示例(2D,3D)](https://dailc.github.io/showDemo/carrousel/demo_carrousel_index.html)

## 滑动、轮播组件的拓展
基于这个组件，拓展了一个图片轮播组件，简化了使用

### 示例页面
[3d图片轮播组件示例(2D,3D)](https://dailc.github.io/showDemo/carrousel/demo_carrousel_gallerySlider.html)

### 相关博文
[一个H5的3D滑动组件实现(兼容2D模式)](https://dailc.github.io/2016/12/13/carrouselEffect.html)

## License

MIT