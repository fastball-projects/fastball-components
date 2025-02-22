package dev.fastball.ui.components.metadata.table;

import dev.fastball.auto.value.annotation.AutoValue;
import dev.fastball.meta.action.ActionInfo;
import dev.fastball.meta.basic.FieldInfo;
import dev.fastball.meta.component.ComponentProps;
import dev.fastball.meta.component.ReferencedComponentInfo;
import dev.fastball.ui.components.table.param.RecordTriggerType;
import dev.fastball.ui.components.table.param.TableSize;

import java.util.List;

/**
 * @author gr@fastball.dev
 * @since 2022/12/9
 */
@AutoValue
public interface TableProps extends ComponentProps {

    String headerTitle();

    String childrenFieldName();

    RecordTriggerType recordTriggerType();

    boolean searchable();

    boolean pageable();

    boolean showRowIndex();

    boolean lightQuery();

    boolean wrappedSearch();

    boolean keywordSearch();

    boolean horizontalScroll();

    TableSize size();

    int pageSize();

    ReferencedComponentInfo rowExpandedComponent();

    List<ColumnInfo> columns();

    List<FieldInfo> queryFields();

    List<ActionInfo> selectionActions();

    List<ActionInfo> selectionViewActions();
}
