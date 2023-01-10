package dev.fastball.ui.components.table;

import dev.fastball.core.annotation.UIApi;
import dev.fastball.core.component.Component;

/**
 * @author gr@fastball.dev
 * @since 2022/12/9
 */
public interface VariableTable<T, P> extends Component {

    /**
     * 列表获取数据的接口
     *
     * @param param 传入该组件的入参, 可用于组件间联动传递
     * @return 返回的数据
     */
    @UIApi
    TableDataResult<T> loadData(P param);
}
