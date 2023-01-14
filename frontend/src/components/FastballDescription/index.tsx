import * as React from 'react'
import { ProDescriptions, ProSchema, ProTable } from '@ant-design/pro-components'
import type { ProTableProps, ProCoreActionType, ProDescriptionsProps, ProDescriptionsItemProps } from '@ant-design/pro-components';
import type { FieldInfo, DescriptionProps } from '../../../types';
import { buildAction, doApiAction, filterEnabled, filterFormOnlyField, filterVisibled, getByPaths, processingField } from '../../common';

class FastballDescription extends React.Component<DescriptionProps, any> {
    ref = React.createRef<ProCoreActionType>();

    constructor(props: DescriptionProps) {
        super(props)

        // 第一次调用传入的 setActions 将按钮注册到 popup, 否则会导致循环更新
        if (props.setActions) {
            props.setActions(this.getActions())
        }
    }

    getActions() {
        const { componentKey, closePopup, input, actions } = this.props;
        const buttons = actions ? actions.filter(filterVisibled).map(action => {
            if (action.closePopupOnSuccess !== false && closePopup) {
                action.callback = () => {
                    closePopup()
                }
            } else if (action.refresh !== false) {
                action.callback = () => {
                    this.ref.current?.reload()
                }
            }
            return buildAction({ componentKey, ...action, data: input });
        }) : []
        return buttons;
    }

    buildTableColumns(fields: FieldInfo[]): ProSchema[] {
        return fields.filter(filterEnabled).map(field => {
            const column: ProSchema = {};
            processingField(field, column, this.props.__designMode);
            Object.assign(column, field);
            return column;
        })
    }

    buildColumns(fields: FieldInfo[], parentDataIndex?: string[]): ProDescriptionsItemProps[] {
        return fields.filter(filterEnabled).flatMap(field => {
            const column: ProDescriptionsItemProps = {};
            Object.assign(column, field, { hideInTable: true, hideInSetting: true });
            processingField(field, column, this.props.__designMode);
            if (field.validationRules) {
                column.formItemProps = {
                    rules: field.validationRules
                }
            }
            if (parentDataIndex) {
                column.dataIndex = [...parentDataIndex, ...field.dataIndex]
            }
            if (field.valueType === 'SubFields' && field.subFields) {
                return this.buildColumns(field.subFields!, field.dataIndex)
            }
            if (field.valueType === 'Array' && field.subFields) {
                column.span = this.props.column
                column.render = (_, record) => {
                    const records: Record<string, any> = getByPaths(record, field.dataIndex)
                    if (records && Array.isArray(records)) {
                        return <ProTable size='small' pagination={false} toolBarRender={false} search={false} dataSource={records} columns={this.buildTableColumns(field.subFields!)} />
                    }
                }
            }
            return column;
        })
    }

    getColumns(): ProDescriptionsItemProps[] {
        return this.buildColumns(this.props.fields);
    }

    render(): React.ReactNode {
        const { componentKey, fields = [], actions = [], input, column, variableDescription, setActions, __designMode, ...props } = this.props;

        const proDescriptionsProps: ProDescriptionsProps = { column };
        proDescriptionsProps.size = 'small'
        if (variableDescription && __designMode !== 'design') {
            proDescriptionsProps.request = async () => await doApiAction({ componentKey, type: 'API', actionKey: 'loadData', data: [input] })
        } else if (input) {
            proDescriptionsProps.dataSource = input
        }

        proDescriptionsProps.columns = this.getColumns();

        if (!setActions) {
            proDescriptionsProps.columns.push({
                title: '操作',
                valueType: 'option',
                render: () => this.getActions(),
            });
        }

        return <ProDescriptions layout="vertical" actionRef={this.ref} {...proDescriptionsProps} {...props} />
    }
}

export default FastballDescription;