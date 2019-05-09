# angular-bootstrap-nav-tree-async


##进来接手了公司一个 ng1 的老项目，需求是需要异步加载树和为节点添加颜色，项目不能改动太大，所以我改写了原插件

##本插件改自 angularjs 的插件angular-bootstrap-nav-tree，我为满足公司需求为其添加了不是很正规的异步加载，controller 中也做了不少工作，总之是解决了需求

#文件夹中有三个文件

#abn-async-tree.css 是样式文件，其与原插件angular-bootstrap-nav-tree的样式文件完全一样，没有做修改。

#abn-async-tree.js 是指令文件，主要修改了叶子节点的小图标，添加了 i-click 函数 

#vm-add.js 是 controller 文件，作用是异步请求，数据格式化，添加颜色等

#html中的引入格式和最终 demo 截图为下
```JavaScript
<abn-tree-async tree-data="clone_data" tree-control="clone_tree" on-select="clone_tree_handler(branch)" expand-level="2" initial-selection="Granny Smith" icon-leaf="fa fa-file" icon-expand="fa fa-plus" icon-collapse="fa fa-minus">
</abn-tree-async>
```

![image](https://github.com/Levxn7/angular-bootstrap-nav-tree-async/blob/master/demo.jpg)
