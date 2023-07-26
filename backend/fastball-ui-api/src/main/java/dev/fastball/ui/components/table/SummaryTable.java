package dev.fastball.ui.components.table;

import dev.fastball.core.annotation.UIApi;
import dev.fastball.core.component.Component;
import dev.fastball.ui.components.table.param.SummaryTableResult;

/**
 * @author gr@fastball.dev
 * @since 2022/12/9
 */
public interface SummaryTable<T> extends Component {

    /**
     * 列表获取数据的接口
     *
     * @return 返回的数据
     */
    @UIApi(needRecordFilter = true)
    SummaryTableResult<T> loadData();
}
