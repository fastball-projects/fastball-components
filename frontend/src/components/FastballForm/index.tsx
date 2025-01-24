import * as React from 'react'
import { EditableFormInstance, ProSchema, ProCard } from '@fastball/pro-components'
import { BetaSchemaForm } from '@fastball/pro-components';
import type { ProFormColumnsType, DrawerFormProps, ModalFormProps, ProFormInstance } from '@fastball/pro-components';
import { Data, FieldDependencyInfo, FormFieldInfo, FormProps } from '../../../types';
import { FastballFieldProvider, buildAction, doApiAction, filterEnabled, filterVisibled, getByPaths, processingField, setByPaths } from '../../common';
import { Button, Spin } from 'antd';
import dayjs, { ManipulateType } from 'dayjs';
import { EDIT_ID } from '../../common/components/SubTable';
import ViewWrapper, { FastballViewPathKey } from '../../common/components/ViewWrapper';
import { ComponentToPrint } from '../../common/components/Printer';
import { FastballContext } from '../FastballContext';

dayjs.extend((option, dayjsClass, dayjsFactory) => {
    dayjsClass.prototype.toJSON = function () {
        return this.format("YYYY-MM-DD HH:mm:ss")
    }
})

type ProFormProps = React.ComponentProps<typeof BetaSchemaForm> & DrawerFormProps & ModalFormProps

const checkCondition = (fieldDependencyInfo: FieldDependencyInfo, values: any): boolean => {
    if (fieldDependencyInfo.condition === 'Empty') {
        return !values[fieldDependencyInfo.field];
    }
    if (fieldDependencyInfo.condition === 'NotEmpty') {
        return !!values[fieldDependencyInfo.field];
    }
    if (!values || !values[fieldDependencyInfo.field]) {
        return false;
    }
    let targetValue: any = fieldDependencyInfo.value
    const value = values[fieldDependencyInfo.field]
    // 其他类型在 == 时会做类型处理, 比如数字类型, 但 Boolean 比较特殊, 因为 Java 的注解只能声明字符串来表达泛类型, 但是 true != 'true', false != 'false', 所以这里做了特殊处理
    if (typeof value === 'boolean') {
        targetValue = Boolean(targetValue)
    }
    if (fieldDependencyInfo.condition === 'Equals') {
        return value == targetValue;
    }
    if (fieldDependencyInfo.condition === 'NotEquals') {
        return value != targetValue;
    }
    if (fieldDependencyInfo.condition === 'GreaterThan') {
        return value > targetValue;
    }
    if (fieldDependencyInfo.condition === 'GreaterThanOrEquals') {
        return value >= targetValue;
    }
    if (fieldDependencyInfo.condition === 'LessThan') {
        return value < targetValue;
    }
    if (fieldDependencyInfo.condition === 'LessThanOrEquals') {
        return value <= targetValue;
    }
    return false;
}

type FormState = {
    valueChangeHandlerProcessing: boolean,
    dataSource: Data[] | null,
}

const buildGetParent = (formInstance: ProFormInstance, parentDataPath?: string[]) => (level?: number) => {
    if (!parentDataPath) {
        return formInstance.getFieldsValue();
    }
    let parentLevel = level;
    if (!parentLevel) {
        return formInstance.getFieldValue(parentDataPath || []);

    }
    if (parentLevel < 0 || parentDataPath.length < parentLevel) {
        return formInstance.getFieldsValue();
    }
    return formInstance.getFieldValue(parentDataPath.slice(0, parentDataPath.length - parentLevel));
};
const fieldChangeFunc = (field: FormFieldInfo, config: ProSchema<any>, formInstance: ProFormInstance, editableFormRef?: React.RefObject<EditableFormInstance>, parentDataPath?: string[]) => {
    const { dataIndex, rowIndex } = config;
    if (editableFormRef?.current && rowIndex !== undefined) {
        const rowData = editableFormRef.current?.getRowData?.(rowIndex);
        if (!rowData) {
            return;
        }
        const value = eval(`($$getParent, {${field.expression.fields.join(", ")}}) => ${field.expression.expression};`)(buildGetParent(formInstance, parentDataPath), rowData);
        if (getByPaths(rowData, dataIndex) !== value) {
            setByPaths(rowData, dataIndex, value);
            editableFormRef.current?.setRowData?.(rowIndex, rowData);
        }
        // const dataPath = [rowIndex, ...dataIndex]
        // editableFormRef.current?.setFieldValue(dataPath, value)
    } else if (formInstance) {
        const rowData = formInstance.getFieldsValue?.() || {};
        const value = eval(`($$getParent, {${field.expression.fields.join(", ")}}) => ${field.expression.expression};`)(buildGetParent(formInstance, parentDataPath), rowData);
        if (getByPaths(rowData, dataIndex) !== value) {
            setByPaths(rowData, dataIndex, value);
            formInstance.setFieldsValue?.(rowData);
        }
    }
}

const fieldChangeTimerMap: Record<string, any> = {}

class FastballForm extends React.Component<FormProps, FormState> {
    static contextType = FastballContext;

    formRef: React.RefObject<ProFormInstance>;
    componentRef = React.createRef();

    constructor(props: FormProps) {
        super(props)
        this.formRef = props.formRef || React.createRef<ProFormInstance>()
        this.state = { valueChangeHandlerProcessing: false, dataSource: null }
        // 第一次调用传入的 setActions 将按钮注册到 popup, 否则会导致循环更新
        if (props.setActions) {
            props.setActions(this.getActions())
        }
    }

    // shouldComponentUpdate(nextProps: Readonly<FormProps>, nextState: Readonly<FormState>, nextContext: any): boolean {
    //     return Object.keys(nextProps).filter(k => nextProps[k] !== this.props[k]).length > 0
    // }

    getActions() {
        const { componentKey, closePopup, showReset, input, actions, recordActions } = this.props;
        const buttons = recordActions ? recordActions.filter(filterVisibled).map(action => {
            action.callback = () => {
                this.formRef.current?.resetFields?.()
                if (action.closePopupOnSuccess !== false && closePopup) {
                    closePopup()
                }
            }
            return buildAction({
                ref: this.componentRef,
                componentKey, ...action, needArrayWrapper: false, loadData: async () => {
                    await this.formRef.current?.validateFields?.()
                    // const formData = await this.formRef.current?.validateFieldsReturnFormatValue?.()
                    const formData = await this.formRef.current?.getFieldsValue?.()
                    const data: Data = Object.assign({}, input, this.state.dataSource, formData)
                    return [data, input];
                }, loadInput: () => {
                    // const formData = await this.formRef.current?.validateFieldsReturnFormatValue?.()
                    const formData = this.formRef.current?.getFieldsValue?.()
                    const data: Data = Object.assign({}, input, this.state.dataSource, formData)
                    return data;
                }
            });
        }) : []
        actions?.filter(filterVisibled).forEach(action => {
            action.callback = () => {
                this.formRef.current?.resetFields()
                if (action.closePopupOnSuccess !== false && closePopup) {
                    closePopup()
                }
            }
            const button = buildAction({
                ref: this.componentRef,
                componentKey, ...action, needArrayWrapper: false, loadData: async () => {
                    // const formData = await this.formRef.current?.validateFieldsReturnFormatValue?.()
                    await this.formRef.current?.validateFields?.()
                    const formData = await this.formRef.current?.getFieldsValue?.()
                    const data: Data = Object.assign({}, this.state.dataSource, formData)
                    return [data, input];
                }, loadInput: async () => {
                    await this.formRef.current?.validateFields?.()
                    // const formData = await this.formRef.current?.validateFieldsReturnFormatValue?.()
                    const formData = await this.formRef.current?.getFieldsValue?.()
                    const data: Data = Object.assign({}, this.state.dataSource, formData)
                    return data;
                }
            });
            buttons.push(button);
        })
        if (showReset !== false) {
            buttons.push(<Button onClick={() => this.formRef.current?.resetFields()}>重置</Button>)
        }
        return buttons;
    }

    getColumns(): ProFormColumnsType<any, 'text'>[] {
        return this.buildColumns(this.props.componentKey, this.props.fields)
    }

    buildColumns(componentKey: string, fields: FormFieldInfo[], parentDataIndex?: string[], parentDataPath?: string[], editableFormRef?: React.RefObject<EditableFormInstance>, ignoreParentDataIndex?: boolean): ProFormColumnsType<any, 'text'>[] {
        const { readonly, column } = this.props;

        let container = this.props.container;
        if (!container) {
            container = this.context?.container;
        }

        const columnSpan = 24 / (column || 2);
        const getRootValues = () => this.formRef.current?.getFieldsValue()
        return fields.filter(filterEnabled).filter(field => field.valueType).sort((f1, f2) => f1.order - f2.order).map(field => {
            const formColumn: ProFormColumnsType = {};
            const parentPath = (Array.isArray(parentDataPath) ? [...parentDataPath] : []).concat(field.dataIndex)
            Object.assign(formColumn, { ...field, parentPath, getRootValues });
            formColumn['@class'] = null;
            const fieldViewPath = {
                [FastballViewPathKey]: JSON.stringify({
                    type: 'Field',
                    field: field.dataIndex,
                })
            }
            Object.assign(formColumn, field, {
                hideInSearch: true,
                'RC_TABLE_INTERNAL_COL_DEFINE': fieldViewPath
            });
            formColumn.fieldProps = Object.assign(formColumn.fieldProps || {}, { ...fieldViewPath, parentPath })
            formColumn.formItemProps = Object.assign(formColumn.formItemProps || {}, fieldViewPath)
            formColumn.colProps = { span: field.entireRow ? 24 : columnSpan }
            processingField(container, componentKey, field, formColumn as ProSchema, parentDataIndex, this.props.__designMode, editableFormRef);
            if (!ignoreParentDataIndex && parentDataIndex) {
                formColumn.dataIndex = [...parentDataIndex, ...field.dataIndex]
            }
            formColumn.name = formColumn.dataIndex
            if (typeof formColumn.fieldProps !== 'function') {
                const fieldProps: ProFormColumnsType['fieldProps'] = {
                    name: formColumn.dataIndex,
                }
                if (field.subTableCreatorButtonText) {
                    formColumn.fieldProps = Object.assign(formColumn.fieldProps || {}, {
                        creatorButtonProps: {
                            creatorButtonText: field.subTableCreatorButtonText
                        }
                    })
                }
                if (field.addonAfter?.length) {
                    fieldProps.addonAfter = field.addonAfter
                }
                if (field.addonBefore?.length) {
                    fieldProps.addonBefore = field.addonBefore
                }
                formColumn.fieldProps = Object.assign(formColumn.fieldProps || {}, fieldProps)
            }
            if (field.validationRules) {
                formColumn.formItemProps = Object.assign(formColumn.formItemProps || {}, {
                    rules: field.validationRules
                })
            }
            if (field.valueType === 'Digit') {
                formColumn.fieldProps = Object.assign(formColumn.formItemProps || {}, {
                    precision: field.digitPrecision || 2
                })
            }
            if (!readonly && (field.valueType === 'dateTime' || field.valueType === 'date')) {
                if (field.dateDefaultValue) {
                    let date;
                    if (field.dateDefaultValue.defaultValue === 'TODAY') {
                        date = dayjs().startOf('day');
                    } else if (field.dateDefaultValue.defaultValue === 'MONTH_START') {
                        date = dayjs().startOf('month');
                    } else if (field.dateDefaultValue.defaultValue === 'MONTH_END') {
                        date = dayjs().endOf('month');
                    } else if (field.dateDefaultValue.defaultValue === 'YEAR_START') {
                        date = dayjs().startOf('year');
                    } else if (field.dateDefaultValue.defaultValue === 'YEAR_END') {
                        date = dayjs().endOf('year');
                    } else if (field.dateDefaultValue.defaultValue === 'CURRENT_WEEK_MONDAY') {
                        date = dayjs().startOf('week');
                    } else if (field.dateDefaultValue.defaultValue === 'CURRENT_WEEK_TUESDAY') {
                        date = dayjs().startOf('week').add(1, 'day');
                    } else if (field.dateDefaultValue.defaultValue === 'CURRENT_WEEK_WEDNESDAY') {
                        date = dayjs().startOf('week').add(2, 'day');
                    } else if (field.dateDefaultValue.defaultValue === 'CURRENT_WEEK_THURSDAY') {
                        date = dayjs().startOf('week').add(3, 'day');
                    } else if (field.dateDefaultValue.defaultValue === 'CURRENT_WEEK_FRIDAY') {
                        date = dayjs().startOf('week').add(4, 'day');
                    } else if (field.dateDefaultValue.defaultValue === 'CURRENT_WEEK_SATURDAY') {
                        date = dayjs().startOf('week').add(5, 'day');
                    } else if (field.dateDefaultValue.defaultValue === 'CURRENT_WEEK_SUNDAY') {
                        date = dayjs().startOf('week').add(6, 'day');
                    } else {
                        date = dayjs()
                    }
                    if (field.dateDefaultValue.offset) {
                        // type DateOffsetUnit = 'SECONDS' | 'MINUTES' | 'HOURS' | 'DAYS' | 'WEEKS' | 'MONTHS' | 'YEARS'
                        let addUnit: ManipulateType = 'second';
                        if (field.dateDefaultValue.offsetUnit === 'SECONDS') {
                            addUnit = 'second'
                        } else if (field.dateDefaultValue.offsetUnit === 'MINUTES') {
                            addUnit = 'minute'
                        } else if (field.dateDefaultValue.offsetUnit === 'HOURS') {
                            addUnit = 'hour'
                        } else if (field.dateDefaultValue.offsetUnit === 'DAYS') {
                            addUnit = 'day'
                        } else if (field.dateDefaultValue.offsetUnit === 'WEEKS') {
                            addUnit = 'week'
                        } else if (field.dateDefaultValue.offsetUnit === 'MONTHS') {
                            addUnit = 'month'
                        } else if (field.dateDefaultValue.offsetUnit === 'YEARS') {
                            addUnit = 'year'
                        }
                        date = date.add(field.dateDefaultValue.offset, addUnit)
                    }
                    formColumn.initialValue = date
                }
            }
            if (field.valueType === 'SubFields' && field.subFields) {
                formColumn.valueType = 'group'
                formColumn.columns = this.buildColumns(componentKey, field.subFields, field.dataIndex, parentPath, editableFormRef)
            }
            if (field.valueType === 'SubTable' && field.subFields) {
                const editableFormRef = React.createRef<EditableFormInstance>()
                formColumn.fieldProps = Object.assign(formColumn.fieldProps || {}, {
                    columns: this.buildColumns(componentKey, field.subFields, field.dataIndex, parentPath, editableFormRef, true),
                    title: formColumn.title,
                    name: formColumn.name,
                    parentName: parentDataIndex,
                    editableFormRef,
                    recordActions: field.subTableRecordActions,
                    creatorButtonText: field.subTableCreatorButtonText
                })
                formColumn.initialValue = []
                formColumn.title = null;
            }
            if (field.autoComplete) {
                if (field.autoComplete.dependencyFields?.length) {
                    formColumn.dependencies = field.autoComplete.dependencyFields
                    formColumn.fieldProps = (formInstance, config): any => {
                        const { rowIndex } = config;
                        let input;
                        if (editableFormRef && rowIndex !== undefined) {
                            const rowData = editableFormRef.current?.getRowData?.(rowIndex);
                            input = rowData
                        } else if (formInstance) {
                            if (parentDataPath) {
                                input = formInstance.getFieldValue?.(parentDataPath) || {};
                            } else {
                                input = formInstance.getFieldsValue?.() || {};
                            }
                        }
                        return Object.assign(formColumn.fieldProps || {}, field.autoComplete, { input });
                    }
                } else {
                    formColumn.fieldProps = Object.assign(formColumn.fieldProps || {}, field.autoComplete)
                }
            }
            if (field.expression) {
                formColumn.dependencies = field.expression.fields;
                const fieldFormItemProps = formColumn.formItemProps;
                formColumn.formItemProps = (formInstance, config): any => {
                    const fieldKey = `${parentDataPath?.join('.')}:${config.rowIndex}:${field.dataIndex.join('.')}`
                    if (!fieldChangeTimerMap[fieldKey]) {
                        fieldChangeTimerMap[fieldKey] = setTimeout(() => fieldChangeFunc(field, config, formInstance, editableFormRef, parentDataPath), 300);
                    }
                    clearTimeout(fieldChangeTimerMap[fieldKey])
                    return fieldFormItemProps;
                }
            }
            if (field.valueType === 'Array' && field.subFields) {
                formColumn.valueType = 'formList'
                formColumn.formItemProps = {
                    itemRender: ({ listDom, action }, { index }) => <ProCard
                        bordered title={`${field.title || ''} - ${index + 1}`} style={{ marginBlockEnd: 8 }} extra={action}
                    >{listDom}</ProCard>
                }
                const subFieldColumn: ProFormColumnsType = {};

                subFieldColumn.valueType = 'group'
                subFieldColumn.columns = (config) => {
                    const getGroupColumns = (groupFieldProps: any) => {
                        const parentPath = (Array.isArray(parentDataPath) ? [...parentDataPath] : []).concat(field.dataIndex).concat(groupFieldProps.rowIndex)
                        return this.buildColumns(componentKey, field.subFields!, field.dataIndex, parentPath, editableFormRef, true).map(c => {
                            c.rowIndex = groupFieldProps.rowIndex;
                            return c;
                        })
                    }
                    const groupColumns = getGroupColumns(config);
                    return groupColumns;
                };
                formColumn.columns = [subFieldColumn]
                if (readonly || field.readonly) {
                    formColumn.fieldProps = Object.assign(formColumn.fieldProps || {}, {
                        copyIconProps: false,
                        deleteIconProps: false,
                        creatorButtonProps: false
                    })
                }
            }
            // FIXME 这代码简直了....
            if (field.fieldDependencyInfoList && field.fieldDependencyInfoList.length > 0) {
                if (!editableFormRef) {
                    const dependencyFieldNames = field.fieldDependencyInfoList.map((fieldDependencyInfo) => {
                        if (parentDataPath?.length) {
                            return [...parentDataPath, fieldDependencyInfo.field];
                        }
                        return fieldDependencyInfo.field;
                    });
                    const dependencyField: ProFormColumnsType = {
                        title: formColumn.title, valueType: 'dependency', name: dependencyFieldNames, columns: (originValues) => {
                            const values = parentDataPath?.length ? getByPaths(originValues, parentDataPath) : originValues;
                            if (field.conditionComposeType === 'Or' && field.fieldDependencyInfoList?.find(fieldDependInfo => checkCondition(fieldDependInfo, values))) {
                                return [{ ...formColumn }]
                            } else if (!field.fieldDependencyInfoList?.find(fieldDependInfo => !checkCondition(fieldDependInfo, values))) {
                                return [{ ...formColumn }]
                            }
                            if (field.fieldDependencyType === 'Readonly') {
                                return [{ ...formColumn, readonly: true }]
                            }
                            return [];
                        },
                    };
                    return dependencyField;
                }
                formColumn.editable = (text, values) => {
                    let record = values;
                    if (editableFormRef && values[EDIT_ID] !== undefined && values[EDIT_ID] !== null) {
                        record = editableFormRef?.current?.getRowData?.(values[EDIT_ID]) || values
                    }
                    if (field.conditionComposeType === 'Or' && field.fieldDependencyInfoList?.find(fieldDependInfo => checkCondition(fieldDependInfo, record))) {
                        return true
                    } else if (!field.fieldDependencyInfoList?.find(fieldDependInfo => !checkCondition(fieldDependInfo, record))) {
                        return true
                    }
                    return false
                }
            }
            return formColumn;
        })
    }

    render(): React.ReactNode {
        const { componentKey, input, variableForm, setActions, onDataLoad, valueChangeHandlers, __designMode, ...props } = this.props;
        props['@class'] = null;
        const { dataSource } = this.state;
        const container = this.context?.container;
        const proFormProps: ProFormProps = { grid: true, layout: "vertical", rowProps: { gutter: [16, 16] }, scrollToFirstError: true };

        if (variableForm && __designMode !== 'design') {
            if (dataSource == null) {
                const loadData = async () => {
                    const data = await doApiAction({ componentKey, type: 'API', actionKey: 'loadData', needArrayWrapper: false, data: [input] })
                    if (onDataLoad) {
                        onDataLoad(data);
                    }
                    this.setState({ dataSource: data || [] })
                }

                loadData();
                return <Spin />
            }
            proFormProps.initialValues = dataSource
        } else if (input) {
            if (onDataLoad) {
                onDataLoad(input);
            }
            proFormProps.initialValues = input
        }
        // if (variableForm && __designMode !== 'design') {
        //     proFormProps.request = async () => {
        //         const data = await doApiAction({ componentKey, type: 'API', actionKey: 'loadData', needArrayWrapper: false, data: [input] })
        //         if (onDataLoad) {
        //             onDataLoad(data);
        //         }
        //         return data;
        //     }
        // } else if (input) {
        //     if (onDataLoad) {
        //         onDataLoad(input);
        //     }
        //     proFormProps.initialValues = input
        // }

        proFormProps.columns = this.getColumns();

        if (setActions) {
            proFormProps.submitter = false;
        } else {
            proFormProps.submitter = { render: () => this.getActions() }
        }
        if (valueChangeHandlers && valueChangeHandlers.length > 0) {
            proFormProps.onValuesChange = async (change, values) => {
                const changeFields = Object.keys(change)
                const handler = valueChangeHandlers.find(({ watchFields }) => changeFields.find(changeField => watchFields.includes(changeField)))
                if (handler) {
                    const data = await doApiAction({ componentKey, type: 'API', actionKey: handler.handlerKey, data: [values] })
                    this.formRef.current?.setFieldsValue({ ...data })
                }
            }
        }
        const fastballViewPath = {
            componentKey,
            componentType: 'FastballForm',
            type: 'Component',
        }
        return (
            <ComponentToPrint ref={this.componentRef}>
                <FastballFieldProvider container={container}>
                    <ViewWrapper fastballViewPath={fastballViewPath}>
                        <BetaSchemaForm formRef={this.formRef} {...proFormProps} {...props} />
                    </ViewWrapper>
                </FastballFieldProvider>
            </ComponentToPrint>
        )
    }
}

export default FastballForm;
