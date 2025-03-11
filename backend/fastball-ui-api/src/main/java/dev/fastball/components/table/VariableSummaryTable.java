package dev.fastball.components.table;

import dev.fastball.core.annotation.UIApi;
import dev.fastball.core.component.Component;
import dev.fastball.components.table.param.SummaryTableResult;

/**
 * @author gr@fastball.dev
 * @since 2022/12/9
 */
public interface VariableSummaryTable<T, P> extends Component {

    /**
     * 列表获取数据的接口
     *
     * @param param 传入该组件的入参, 可用于组件间联动传递
     * @return 返回的数据
     */
    @UIApi(needRecordFilter = true)
    SummaryTableResult<T> loadData(P param);
}
