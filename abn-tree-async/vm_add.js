(function() {
    app.controller('vmAddCtrl', function Ctrl($scope, $http, $q, $modal, $modalInstance, $cookieStore, i18nService, vmwareResService, resManageService, MainService, toaster, $timeout) {

        var tree;

        //初始化树
        $scope.initPoolTree = function(pool) {
            $scope.clone_tree = {};
            $scope.clone_data = [{
                label: pool.poolName,
                expanded: true,
                iconClass: "fa-pool",
                data: {
                    poolUuid: pool.uuid,
                    poolType: pool.poolType,
                    treeType: 'pool',
                    uuid: '0'
                },
                children: []
            }];
            // resManageService.relation_query({ "poolUuid": pool.uuid, "resourceTypes": ["zone", "cluster", "host"] }).then(function(response) {
            resManageService.relation_query({ "poolUuid": pool.uuid, "resourceTypes": ["zone"] }).then(function(response) {
                if (response.status || response.errorCode == 0) {
                    $scope.nodeArr = response.result;
                    if (response.result.length != 0) {
                        $scope.clone_data[0].noLeaf = false;
                    }
                    $scope.toTreeData(response.result, $scope.clone_data[0]);

                } else {
                    toaster.pop('error', '', '查询失败,请联系管理员!');
                }
            });
        };

        var pull_data = function(a) {
            if (a.branch.children.length < 1) {
                vmwareResService.relation_query({ "parentUuid": a.branch.data.uuid }).then(function(res) {
                    var b = tree.get_selected_branch();
                    if (res.result.length == 0) {
                        if (document.getElementById(a.label).className.match(/(?:^|\s)fa-plus(?!\S)/)) {
                            document.getElementById(a.label).className = "indented tree-icon fa fa-minus";
                        } else {
                            document.getElementById(a.label).className = "indented tree-icon fa fa-plus";
                        }

                    }
                    if (res.status || res.errorCode == 0) {
                        angular.forEach(res.result, function(value, key) {
                            $scope.getColor(value.resourceType, value.resourceUuid).then(function(result) {
                                var node = {
                                    label: value.resourceName,
                                    expanded: value.resourceType != "host",
                                    data: {
                                        uuid: value.uuid,
                                        parentUuid: value.parentUuid,
                                        poolUuid: value.poolUuid,
                                        poolType: value.poolType,
                                        treeType: value.resourceType,
                                        id: value.resourceUuid
                                    },
                                    children: [],
                                    noLeaf: true,
                                    scolor: result,
                                    i_click: pull_data
                                };
                                if (value.resourceType != "host") {
                                    node.noLeaf = false;
                                } else {
                                    node.noLeaf = true;
                                }
                                return tree.add_branch(b, node)
                            });
                        });
                    } else {}
                });
            }
        }

        //pid,id数据格式转换成[]嵌套
        $scope.toTreeData = function(data, parentNode) {
            var noLeaf;
            if (parentNode.data && parentNode.data.treeType != "host") {
                angular.forEach(data, function(value, i) {
                    $scope.getColor(value.resourceType, value.resourceUuid).then(function(result) {
                        if (value.parentUuid == parentNode.data.uuid) {
                            var node = {
                                label: value.resourceName,
                                expanded: value.resourceType != "host",
                                data: {
                                    uuid: value.uuid,
                                    parentUuid: value.parentUuid,
                                    poolUuid: value.poolUuid,
                                    poolType: value.poolType,
                                    treeType: value.resourceType,
                                    id: value.resourceUuid
                                },
                                children: [],
                                noLeaf: false,
                                scolor: result,
                                i_click: pull_data
                            };
                            parentNode.children.push(node);
                            // $scope.toTreeData(data, node);
                        }
                    });
                });

            } else {}
        };

        //树字体添加颜色
        $scope.getColor = function(rtype, ruuid) {
            var param = {
                type: rtype,
                ids: [ruuid]
            }
            var temp;
            var promise = vmwareResService.color_score(param).then(function(res) {
                if (res.status || res.errorCode == 0) {
                    if (res.result[0].score > 0 && res.result[0].score < 21) {
                        temp = "#f05050";
                    } else if (res.result[0].score > 20 && res.result[0].score < 41) {
                        temp = "yellow";
                    } else {
                        temp = "#27c24c";
                    }
                } else {}
                return temp;
            });
            return promise;
        }

        $scope.clone_tree_handler = function(branch) {
            if (branch && branch.data.treeType == "host") {
                $scope.isHost = true;
                $scope.vm_clone_param.poolUuid = branch.data.poolUuid; //资源池id
                $scope.vm_clone_param.hostId = branch.data.id; //主机id
                console.log(branch.data);
                //查询该主机网络列表
                var params = {
                    page: 1,
                    limit: 10000,
                    poolUuid: branch.data.poolUuid
                }
                $scope.loadNetList(params);
                // 查询存储
                $scope.loadStorData();
            } else {
                $scope.isHost = false;
            }
        };

        $scope.$watch('clone_tree', function(n, o, s) {
            tree = n;
            if (n && n.hasOwnProperty('select_first_branch')) {
                n.select_first_branch();
            }
        });

        $scope.currentPool = $cookieStore.get('currentPool');
        if ($scope.currentPool) {
            $scope.initPoolTree($scope.currentPool);
            // $scope.initZTree($scope.currentPool);
        }
        //选择存储
       
    });
})();