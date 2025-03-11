package dev.fastball.components.tree;

import dev.fastball.core.annotation.UIApi;
import dev.fastball.core.component.Component;
import dev.fastball.core.component.DataResult;
import dev.fastball.components.tree.param.ExpandedTreeData;

/**
 * @author gr@fastball.dev
 * @since 2022/12/20
 */
public interface SearchTree<T, S> extends Component {

    /**
     * 树形组件获取数据的接口
     *
     * @return 返回的数据
     */
    @UIApi(needRecordFilter = true)
    DataResult<T> loadData();

    /**
     * 根据搜索关键字, 加载可被搜索的数据
     *
     * @param searchText 用于搜索的关键字
     * @return 返回的数据
     */
    @UIApi
    DataResult<S> loadSearchData(String searchText);

    /**
     * 根据搜索数据, 返回展开的树形数据, 理论上应该包括搜索的节点以及其祖先节点
     *
     * @param search 被选中的搜索数据
     * @return 返回的数据
     */
    @UIApi
    ExpandedTreeData<T> loadExpandedTreeData(S search);
}
