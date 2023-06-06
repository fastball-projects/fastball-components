package dev.fastball.ui.components.description;

import dev.fastball.core.annotation.UIApi;
import dev.fastball.core.component.Component;

/**
 * @author gr@fastball.dev
 * @since 2023/1/10
 */
@Deprecated
public interface VariableDescription<T, P> extends Component {
    /**
     * 获取详情页初始化数据的接口
     *
     * @param param 传入该组件的入参, 可用于数据初始化, 也可用于组件间联动传递
     * @return 详情页的数据
     */
    @UIApi
    T loadData(P param);
}
