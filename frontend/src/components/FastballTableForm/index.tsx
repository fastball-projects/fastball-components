import { ActionInfo, ApiActionInfo, Data, FormProps, TableData, TableFormFieldInfo, TableFormProps } from "../../../types";
import React from "react";
import { MD5 } from 'object-hash'
import { Button, Drawer, Space } from "antd";
import { EditableFormInstance, ProColumns, ProFormInstance, ProTable, ProTableProps, RowEditableConfig } from "@fastball/pro-components";
import { EditableProTable } from '@fastball/pro-table'
import FastballForm from "../FastballForm";
import { buildAction, doApiAction, filterVisibled, processingField } from "../../common";
import { ComponentToPrint } from "../../common/components/Printer";

const EDIT_ID = '__edit_id';

const buildTableColumn = (componentKey: string, field: TableFormFieldInfo, parentDataIndex?: string[], __designMode?: string): ProColumns | undefined => {
    if (field.valueType === 'Array') {
        return;
    }
    if (field.valueType === 'SubTable') {
        return;
    }
    const column: ProColumns = {}
    Object.assign(column, field, { hideInSearch: true });
    processingField(componentKey, field, column, __designMode);
    if (!field.editInTable) {
        column.readonly = true
    }
    if (parentDataIndex) {
        column.dataIndex = [...parentDataIndex, ...field.dataIndex]
    }
    if (field.valueType === 'SubFields' && field.subFields) {
        field.subFields.forEach(subField => buildTableColumn(componentKey, subField, field.dataIndex))
        return;
    }
    if (field.valueType === 'textarea') {
        column.ellipsis = true
    }
    column.sorter = field.sortable
    return column;
}

type TableFormState = {
    dataSource: TableData[]
    dataSourceMap: Record<string, TableData>
    selectedRowKeyMap: Record<string, boolean>
    formOpen: boolean
    dataIndex: number
}

const dataChangeFunc = (dataSource: TableData[], dataSourceMap: Record<string, TableData>) => dataSource.forEach(item => {
    dataSourceMap[item[EDIT_ID]] = item;
    if (item.children?.length) {
        dataChangeFunc(item.children, dataSourceMap)
    }
})

class FastballTableForm extends React.Component<TableFormProps, TableFormState> {
    formRef = React.createRef<ProFormInstance>();
    editableFormRef = React.createRef<EditableFormInstance>();
    ref = React.createRef();

    constructor(props: TableFormProps) {
        super(props)
        this.state = { dataSource: [], dataSourceMap: {}, selectedRowKeyMap: {}, formOpen: false, dataIndex: 0 }
        if (props.setActions) {
            props.setActions(this.getActions())
        }
    }

    buildButtons(buttons: any[], actions?: ActionInfo[]) {
        const { componentKey, closePopup, rowSelectable, input } = this.props;
        const loadData = async () => {
            const values = await this.editableFormRef.current!.validateFieldsReturnFormatValue!()
            const { dataSource, dataSourceMap, selectedRowKeyMap } = this.state;
            let data = dataSource;
            if (rowSelectable) {
                data = Object.keys(dataSourceMap).filter(key => selectedRowKeyMap[key]).map(key => dataSourceMap[key])
            }
            return [data, input];
        }
        actions?.filter(filterVisibled).forEach(action => {
            action.callback = () => {
                if (action.closePopupOnSuccess !== false && closePopup) {
                    closePopup()
                }
            }
            buttons.push(buildAction({ ref: this.ref, componentKey, ...action, needArrayWrapper: false, loadData }));
        })
    }

    getActions() {
        const { actions, recordActions } = this.props;

        const buttons: any[] = []
        this.buildButtons(buttons, recordActions);
        this.buildButtons(buttons, actions);
        return buttons;
    }

    onDataSourceChange(dataSource: TableData[]) {
        const dataSourceMap = { ...this.state.dataSourceMap }
        dataChangeFunc(dataSource, dataSourceMap)
        this.setState({ dataSource, dataSourceMap })
    }

    buildTable() {
        const { fields, componentKey, onDataLoad, rowEditable, rowSelectable, childrenFieldName, input, __designMode } = this.props;
        const { dataSource, dataSourceMap } = this.state;

        let editable: RowEditableConfig<Record<string, any>> = {
            type: 'multiple',
            editableKeys: Object.keys(dataSourceMap),
            actionRender: (_dom, { index }) => [<Button type='link' onClick={() => {
                this.setState({ dataIndex: index, formOpen: true })
                this.formRef.current?.resetFields
            }}>编辑</Button>],
            onValuesChange: (record, recordList) => {
                this.onDataSourceChange(recordList);
            },
        }

        const tableColumns: ProColumns[] = []
        fields.filter(filterVisibled).filter(({ hideInTable }) => !hideInTable).map(field => ({ ...field })).sort((f1, f2) => f1.order - f2.order).forEach(field => {
            const column = buildTableColumn(componentKey, field, undefined, __designMode)
            if (column) {
                tableColumns.push(column)
            }
        })
        const tableProps: ProTableProps<Data, any> = { rowKey: EDIT_ID, search: false, columns: tableColumns, expandable: {} }


        tableProps.expandable = {}

        if (childrenFieldName) {
            tableProps.expandable.childrenColumnName = childrenFieldName
        } else {
            // antd 的 table 默认展开字段是 children, 暂时没找到关闭机制, 所以设置一个特殊值规避, 否则当 children 不是数组时, 会导致渲染挂掉
            tableProps.expandable.childrenColumnName = "__Fastball__Children__Column__"
        }

        if (rowEditable) {
            tableColumns.push({
                title: '操作', valueType: 'option',
                render: (_dom, _record, dataIndex) => <Button type='link' onClick={() => {
                    this.setState({ dataIndex, formOpen: true })
                    this.formRef.current?.resetFields
                }}>编辑</Button>
            })
        }

        const dataConvert = (data: TableData[], dataSourceMap: Record<string, TableData>) => {
            data.forEach((record, i) => {
                record[EDIT_ID] = record.id?.toString() || i.toString();
                dataSourceMap[record[EDIT_ID]] = record;
                if (record.children && record.children.length) {
                    dataConvert(record.children, dataSourceMap)
                }
            })
        }

        const selectConvert = (data: TableData[], selectedRowKeyMap: Record<string, boolean>) => {
            data.forEach(record => {
                selectedRowKeyMap[record[EDIT_ID]] = true
                if (record.children && record.children.length) {
                    selectConvert(record.children, selectedRowKeyMap)
                }
            })
        }

        tableProps.request = async () => {
            const apiActionInfo: ApiActionInfo = { componentKey, type: 'API', actionKey: 'loadData', data: [input] }
            const result: TableData[] = await doApiAction(apiActionInfo)
            const dataSourceMap = {}
            dataConvert(result, dataSourceMap)
            if (onDataLoad) {
                onDataLoad(result);
            }
            const state = { dataSource: result, selectedRowKeyMap: {}, dataSourceMap }
            if (rowSelectable) {
                selectConvert(result, state.selectedRowKeyMap)
            }
            this.setState(state)
            return result;
        }


        const selectFunc = (selectedRowKeys: React.Key[], selectedRowKeyMap: Record<string, boolean>) => {
            selectedRowKeys.forEach(k => {
                selectedRowKeyMap[k] = true
                this.state.dataSourceMap[k]?.children?.forEach?.(selectFunc)
            })
        }

        const selectChildren = (record: TableData, selectedRowKeyMap: Record<string, boolean>) => {
            if (record && record[EDIT_ID]) {
                selectedRowKeyMap[record[EDIT_ID]] = true
                record.children?.forEach(item => {
                    selectChildren(item, selectedRowKeyMap)
                })
            }
        }

        let rowSelection;
        if (rowSelectable) {
            const selectedRowKeyMap = this.state.selectedRowKeyMap;
            rowSelection = {
                selectedRowKeys: Object.keys(selectedRowKeyMap).filter(key => selectedRowKeyMap[key]),
                type: 'checkbox',
                onChange: (selectedRowKeys: React.Key[], selectedRows: Data[]) => {
                    const selectedRowKeyMap: Record<string, boolean> = {};
                    selectedRowKeys.forEach(k => selectChildren(this.state.dataSourceMap[k], selectedRowKeyMap))
                    this.setState({ selectedRowKeyMap })
                },
                getCheckboxProps: (record: Data) => ({
                    defaultChecked: true,
                    name: record.name,
                }),
            }
        }

        return <EditableProTable editableFormRef={this.editableFormRef} rowSelection={rowSelection} recordCreatorProps={false} value={dataSource} editable={editable} {...tableProps} />
    }

    closeForm() {
        this.setState({ formOpen: false })
    }

    render(): React.ReactNode {
        const { fields, componentKey, value, onChange } = this.props;
        const { dataSource, dataIndex, formOpen } = this.state;

        const input = dataSource?.[dataIndex]
        const formFields = fields.filter(({ hideInForm }) => !hideInForm).map(field => ({ ...field, readonly: !field.editInForm }))
        const formProps: FormProps = { componentKey, formRef: this.formRef, input, fields: formFields, showReset: false, variableForm: false, readonly: false }
        const onSave = () => {
            const values = this.formRef.current?.getFieldsValue()
            this.editableFormRef.current?.setRowData?.(dataIndex, values)
            this.closeForm()
        }

        const footerButtons = <Space>
            <Button onClick={() => onSave()}>保存</Button>
            <Button onClick={() => this.closeForm()}>取消</Button>
        </Space>

        return <ComponentToPrint ref={this.ref}>
            <Drawer placement="right" width="75%" onClose={() => this.closeForm()} open={formOpen} footer={footerButtons}>
                <FastballForm key={input ? MD5(input) : ""} {...formProps} />
            </Drawer>
            {this.buildTable()}
        </ComponentToPrint>
    }

}

export default FastballTableForm;