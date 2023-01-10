package dev.fastball.ui.components.tree;

import dev.fastball.core.annotation.UIApi;
import dev.fastball.core.component.Component;

/**
 * @author gr@fastball.dev
 * @since 2022/12/20
 */
public interface SearchableTree<T, S> extends Component {

    /**
     * 树形组件获取数据的接口
     *
     * @param search 用于搜索的条件
     * @return 返回的数据
     */
    @UIApi
    TreeDataResult<T> loadData(S search);
}
