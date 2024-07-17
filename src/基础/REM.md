# REM

## 示例

REM是一个适用于QUIK插件开发的模块化系统。基本使用方式是用`_REQUIRE_(filepath)`链接文件，如下：

假如有以下文件目录结构：
```
util/
 - c.js
a.js
b.js
```

a.js：
```javascript
var c=_REQUIRE_('./util/c.js');
console.log(c('01'));
_REQUIRE_('./b.js')
```

b.js:
```javascript
console.log(c('02'));
```

util/c.js:
```javascript
(function(){
    function c(str){
        return str.replaceAll('0','');
    }
    return c;
})()
```

以a.js为解析入口，最终输出的即为：
```javascript
var c=(function(){
    function c(str){
        return str.replaceAll('0','');
    }
    return c;
})()
console.log(c('01'));
console.log(c('02'));
```

没错，REM所做的就是把几个文件的代码简单拼接起来，虽然比较简陋，但对于一个插件的开发已经完全够了。

## 使用方式

在使用时，在代码中嵌入`_REQUIRE_('./module.js')`，REM就会把`./module.js`中的代码原封不动地替换掉`_REQUIRE_('./module.js')`。

使用REM时也需要注意一些东西：

1. 在使用`_REQUIRE_('./module.js')`时，`./`不可省略。
2. `_REQUIRE_(filepath)`中filepath不可与原js交互
    ```javascript
    // 错误写法
    var modulepath='./module.js';
    var module=_REQUIRE_(modulepath);

    // 正确写法
    var module=_REQUIRE_('./module.js');
    ```
    因为`_REQUIRE_()`里的参数是独立解析的，不会根据原js的环境而改变，所以你在使用时只往里面放一个单纯的字符串就好，`""`,`''`,`\`\``均可
3. `_REQUIRE_(filepath)`中filepath的定位是相对于所在的文件的，比如在如下文件目录结构中：
    ```
    util/
     - a.js
    modules/
     - m.js
    index.js
    ```
    无论解析入口是什么，`modules/m.js`要引用`util/a.js`也要像这样`_REQUIRE_('../util/a.js')`

4. REM并未对循环引用做出阻止，若出现类似a引用b，b也引用a的情况，就会卡死。

REM不只可以引用js，对于json也可以直接引用，因为json可以直接拼接在变量后面。（如下）
```javascript
var list=_REQUIRE_('./list.json')
```

REM也可以引用其他文本类文件，如css,html等，会以字符串的形式引用到代码中（如下）。同时，在打包时，也会对引用的css,html进行压缩处理。
```javascript
var listhtml=_REQUIRE_('./list.html')
var liststyle=_REQUIRE_('./list.css')
```

## 建议

在实际开发中，我们建议除了解析入口的js以外，其他模块都按照这样的写法：
```javascript
// module.js
(function(){
    // code...
    return //...
})();
```

```javascript
// index.js
var module=_REQUIRE_('./module.js');
```

这样就基本满足了模块化的性质，整个QUIK起始页本身也是这样开发的。

同时对于样式的css也建议独立开来，设一个`index.css`然后引用到js中再添加样式。