package dev.fastball.components.table.config;

import dev.fastball.core.annotation.ViewAction;
import dev.fastball.core.component.Component;
import dev.fastball.components.table.param.RecordTriggerType;
import dev.fastball.components.table.param.TableSize;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author gr@fastball.dev
 * @since 2023/1/9
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface TableConfig {
    String title() default "";

    /**
     * @return 表格的大小, 默认为最小
     */
    TableSize size() default TableSize.Default;

    /**
     * 如果希望是一个树状列表, 可以配置自己录字段名, 并保证该字段类型为当前类型的集合
     *
     * @return 属性表格的子记录字段名
     */
    String childrenFieldName() default "";

    /**
     * 记录触发的类型, 比如 Layout 类型的组件, 该 Table 为触发组件, 啧当点击记录时, 会触发该事件, 影响子组件的入参变化
     *
     * @return 记录触发的类型
     */
    RecordTriggerType recordTriggerType() default RecordTriggerType.OnRecordClick;

    /**
     * 是否支持关键字搜索, 如开启, 入参需要使用 {@link dev.fastball.components.common.metadata.query.TableSearchParam} 包装
     *
     * @return 是否支持关键字搜索
     */
    boolean keywordSearch() default false;

    /**
     * 是否开启横向滚动, 如果开启, 列表将会自动适应宽度, 默认为 False
     *
     * @return 是否开启横向滚动
     */
    boolean horizontalScroll() default false;

    /**
     * 是否开启表格分页, 默认为 True
     *
     * @return 是否开启表格分页
     */
    boolean pageable() default true;

    /**
     * 是否开启查询, 默认为 True
     *
     * @return 是否开启查询
     */
    boolean queryable() default true;

    /**
     * 是否开启数据序号显示
     *
     * @return 是否开启表格数据序号显示
     */
    boolean showRowIndex() default false;

    /**
     * 是否开启表格 Excel 导出
     *
     * @return 开启表格 Excel 导出
     */
    boolean exportable() default false;

    /**
     * 是否开启轻量搜索表单, 即以轻量表单形式展示搜索条件, 默认为 False
     *
     * @return 开启轻量搜索表单
     */
    boolean lightQuery() default false;


    TableFieldConfig[] columnsConfig() default {};

    TableFieldConfig[] queryFieldsConfig() default {};

    ViewAction[] selectionViewActions() default {};

    Class<? extends Component> rowExpandedComponent() default Component.class;
}
