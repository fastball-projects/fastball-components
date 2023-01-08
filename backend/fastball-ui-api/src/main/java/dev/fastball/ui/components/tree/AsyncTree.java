package dev.fastball.ui.components.tree;

import dev.fastball.core.annotation.UIApi;
import dev.fastball.core.component.Component;

/**
 * @author gr@fastball.dev
 * @since 2023/01/08
 */
public interface AsyncTree<T, Q> extends Component {

    /**
     * 树形组件获取数据的接口
     *
     * @param parent  用于查询的父节点
     * @param querier 用于查询的额外条件
     * @return 返回的数据
     */
    @UIApi
    TreeDataResult<T> loadData(T parent, Q querier);
}
