package dev.fastball.components.tableform;

import dev.fastball.core.annotation.UIApi;
import dev.fastball.core.component.Component;

import java.util.Collection;

public interface TableForm<T> extends Component {
    /**
     * 获取表单初始化数据的接口
     *
     * @return 表单的初始化数据
     */
    @UIApi
    Collection<T> loadData();
}
