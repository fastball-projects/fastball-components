package dev.fastball.components.tree;

import dev.fastball.core.annotation.UIApi;
import dev.fastball.core.component.Component;
import dev.fastball.core.component.DataResult;

/**
 * @author gr@fastball.dev
 * @since 2022/12/20
 */
public interface Tree<T> extends Component {

    /**
     * 树形组件获取数据的接口
     *
     * @return 返回的数据
     */
    @UIApi(needRecordFilter = true)
    DataResult<T> loadData();
}
