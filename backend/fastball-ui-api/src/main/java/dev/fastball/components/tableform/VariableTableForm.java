package dev.fastball.components.tableform;

import dev.fastball.core.annotation.UIApi;
import dev.fastball.core.component.Component;

import java.util.Collection;

public interface VariableTableForm<T, P> extends Component {
    /**
     * 获取表单初始化数据的接口
     *
     * @param param 传入该组件的入参, 可用于数据初始化, 也可用于组件间联动传递
     * @return 表单的初始化数据
     */
    @UIApi
    Collection<T> loadData(P param);
}
