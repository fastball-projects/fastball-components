package dev.fastball.ui.components.tree;

import dev.fastball.core.annotation.UIApi;
import dev.fastball.core.component.Component;
import dev.fastball.core.component.DataResult;

/**
 * @author gr@fastball.dev
 * @since 2022/12/20
 */
public interface VariableTree<T, P> extends Component {

    /**
     * 树形组件获取数据的接口
     *
     * @param param 传入该组件的入参, 可用于组件间联动传递
     * @return 返回的数据
     */
    @UIApi
    DataResult<T> loadData(P param);
}
