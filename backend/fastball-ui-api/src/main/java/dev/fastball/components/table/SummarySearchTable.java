package dev.fastball.components.table;

import dev.fastball.components.common.metadata.query.TableSearchParam;
import dev.fastball.core.annotation.UIApi;
import dev.fastball.core.component.Component;
import dev.fastball.components.table.param.SummaryTableResult;

/**
 * @author gr@fastball.dev
 * @since 2022/12/9
 */
public interface SummarySearchTable<T, S> extends Component {

    /**
     * 列表获取数据的接口
     *
     * @param search 用于搜索的条件
     * @return 返回的数据
     */
    @UIApi(needRecordFilter = true)
    SummaryTableResult<T> loadData(TableSearchParam<S> search);
}
