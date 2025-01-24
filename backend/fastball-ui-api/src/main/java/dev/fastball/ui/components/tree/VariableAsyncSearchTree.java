package dev.fastball.ui.components.tree;

import dev.fastball.core.annotation.UIApi;
import dev.fastball.core.component.Component;
import dev.fastball.core.component.DataResult;
import dev.fastball.ui.components.tree.param.ExpandedTreeData;

/**
 * @author Geng Rong
 */
public interface VariableAsyncSearchTree<T, S, P> extends Component {

    /**
     * 树形组件获取数据的接口
     *
     * @param parent 用于查询的父节点, 如果为 null, 则查询根节点
     * @param param  传入该组件的入参, 可用于组件间联动传递
     * @return 返回的数据
     */
    @UIApi(needRecordFilter = true)
    DataResult<T> loadData(T parent, P param);

    /**
     * 根据搜索关键字, 加载可被搜索的数据
     *
     * @param searchText 用于搜索的关键字
     * @return 返回的数据
     */
    @UIApi
    DataResult<S> loadSearchData(String searchText, P param);

    /**
     * 根据搜索数据, 返回展开的树形数据, 理论上应该包括搜索的节点以及其祖先节点
     *
     * @param search 被选中的搜索数据
     * @return 返回的数据
     */
    @UIApi
    ExpandedTreeData<T> loadExpandedTreeData(S search, P param);
}
