import { ActionInfo, ApiActionInfo, Data, FormProps, TableFormFieldInfo, TableFormProps } from "../../../types";
import React from "react";
import { MD5 } from 'object-hash'
import { Button, Drawer, Space } from "antd";
import { EditableFormInstance, ProColumns, ProFormInstance, ProTable, ProTableProps, RowEditableConfig } from "@ant-design/pro-components";
import { EditableProTable } from '@fastball/pro-table'
import FastballForm from "../FastballForm";
import { buildAction, doApiAction, filterVisibled, processingField } from "../../common";
import { ComponentToPrint } from "../../common/components/Printer";

const EDIT_ID = '__edit_id';

const buildTableColumn = (field: TableFormFieldInfo, parentDataIndex?: string[], __designMode?: string): ProColumns | undefined => {
    if (field.valueType === 'Array') {
        return;
    }
    if (field.valueType === 'SubTable') {
        return;
    }
    const column: ProColumns = {}
    Object.assign(column, field, { hideInSearch: true });
    processingField(field, column, __designMode);
    if (!field.editInTable) {
        column.readonly = true
    }
    if (parentDataIndex) {
        column.dataIndex = [...parentDataIndex, ...field.dataIndex]
    }
    if (field.valueType === 'SubFields' && field.subFields) {
        field.subFields.forEach(subField => buildTableColumn(subField, field.dataIndex))
        return;
    }
    if (field.valueType === 'textarea') {
        column.ellipsis = true
    }
    column.sorter = field.sortable
    return column;
}

type TableFormState = {
    dataSource: Data[]
    selectedRowKeyMap: Record<string, boolean>
    formOpen: boolean
    dataIndex: number
}

class FastballTableForm extends React.Component<TableFormProps, TableFormState> {
    formRef = React.createRef<ProFormInstance>();
    editableFormRef = React.createRef<EditableFormInstance>();
    ref = React.createRef();

    constructor(props: TableFormProps) {
        super(props)
        this.state = { dataSource: [], selectedRowKeyMap: {}, formOpen: false, dataIndex: 0 }
        if (props.setActions) {
            props.setActions(this.getActions())
        }
    }

    buildButtons(buttons: any[], actions?: ActionInfo[]) {
        const { componentKey, closePopup, rowSelectable, input } = this.props;
        const loadData = async () => {
            const values = await this.editableFormRef.current!.validateFieldsReturnFormatValue!()
            const { dataSource, selectedRowKeyMap } = this.state;
            let data = dataSource;
            if (rowSelectable) {
                data = dataSource.filter(record => selectedRowKeyMap[record[EDIT_ID]])
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

    onDataSourceChange(dataSource: Data[]) {
        this.setState({ dataSource })
    }

    buildTable() {
        const { fields, componentKey, onDataLoad, rowEditable, rowSelectable, input, __designMode } = this.props;
        const { dataSource } = this.state;

        let editable: RowEditableConfig<Record<string, any>> = {
            type: 'multiple',
            editableKeys: dataSource?.map((record, i) => i.toString()),
            actionRender: (_dom, { index }) => [<Button type='link' onClick={() => {
                this.setState({ dataIndex: index, formOpen: true })
                this.formRef.current?.resetFields
            }}>编辑</Button>],
            onValuesChange: (record, recordList) => {
                this.onDataSourceChange(recordList);
            },
        }

        const tableColumns: ProColumns[] = []
        fields.filter(filterVisibled).filter(({ hideInTable }) => !hideInTable).map(field => ({ ...field })).forEach(field => {
            const column = buildTableColumn(field, undefined, __designMode)
            if (column) {
                tableColumns.push(column)
            }
        })
        const tableProps: ProTableProps<Data, any> = { rowKey: EDIT_ID, search: false, columns: tableColumns }
        if (rowEditable) {
            tableColumns.push({
                title: '操作', valueType: 'option',
                render: (_dom, _record, dataIndex) => <Button type='link' onClick={() => {
                    this.setState({ dataIndex, formOpen: true })
                    this.formRef.current?.resetFields
                }}>编辑</Button>
            })
        }

        tableProps.request = async () => {
            const apiActionInfo: ApiActionInfo = { componentKey, type: 'API', actionKey: 'loadData', data: [input] }
            const result: Data[] = await doApiAction(apiActionInfo)
            result.forEach((record, i) => record[EDIT_ID] = i.toString())
            if (onDataLoad) {
                onDataLoad(result);
            }
            const state = { dataSource: result, selectedRowKeyMap: {} }
            if (rowSelectable) {
                result.forEach(record => state.selectedRowKeyMap[record[EDIT_ID]] = true)
            }
            this.setState(state)
            return result;
        }

        let rowSelection;
        if (rowSelectable) {
            rowSelection = {
                type: 'checkbox',
                onChange: (selectedRowKeys: React.Key[], selectedRows: Data[]) => {
                    const selectedRowKeyMap: Record<string, boolean> = {};
                    selectedRowKeys.forEach(k => selectedRowKeyMap[k] = true)
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