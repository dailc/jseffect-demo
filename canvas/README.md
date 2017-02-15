## 说明
canvas文件夹内的系列demo都是基于canvas的一些组件封装，如模拟360加速球效果等等

## 360加速球效果

### API说明

#### generate

```
var ball = SpeedBall.generate 生成一个加速球对象
```

#### change

```
ball.change(percent)   
change事件,改变加速球的百分比

percent 需要变动的percent
```

#### shake

```
ball.shake(freq, duration)   
shake事件,调用这个事件后，360加速球会抖动,抖动频率和时间根据传入参数,抖动幅度就是默认的wave,注意,连续调用shake也可进行叠加

freq 频率,数字越大,抖动的越厉害,默认为3
duration 持续时间,单位毫秒,默认为1000毫米
```

#### dispose

```
ball.dispose()   
销毁，释放加速球对象，此时会终止所有的动画
```

这个组件的初衷只是在做canvas展示时发现e-charts里面没有这个功能，于是自己造了一个轮子，可能还不太完善，更多可自行完善

### 实现效果

#### 效果图
![](https://dailc.github.io/showDemo/staticresource/canvas/demo_js_360speedball_1.png)

#### 示例页面
[360加速球效果](https://dailc.github.io/showDemo/canvas/demo_canvas_speedBall.html)


## License

MIT