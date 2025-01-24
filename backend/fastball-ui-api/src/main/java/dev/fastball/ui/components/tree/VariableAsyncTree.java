package dev.fastball.ui.components.tree;

import dev.fastball.core.annotation.UIApi;
import dev.fastball.core.component.Component;
import dev.fastball.core.component.DataResult;

/**
 * @author gr@fastball.dev
 * @since 2023/01/08
 */
public interface VariableAsyncTree<T, P> extends Component {

    /**
     * 树形组件获取数据的接口
     *
     * @param parent 用于查询的父节点
     * @param param  传入该组件的入参, 可用于组件间联动传递
     * @return 返回的数据
     */
    @UIApi(needRecordFilter = true)
    DataResult<T> loadData(T parent, P param);
}
