import * as React from 'react'
import { ProConfigProvider, ProDescriptions, ProSchema, ProTable } from '@fastball/pro-components'
import type { ProTableProps, ProCoreActionType, ProDescriptionsProps, ProDescriptionsItemProps } from '@fastball/pro-components';
import type { FieldInfo, DescriptionProps } from '../../../types';
import { buildAction, doApiAction, filterEnabled, filterFormOnlyField, filterVisibled, getByPaths, processingField } from '../../common';
import SubTable from '../../common/components/SubTable';
import { ComponentToPrint } from '../../common/components/Printer';
import { FastballContext } from '../FastballContext';


type DescriptionState = {
    data?: Record<string, any>
}

class FastballDescription extends React.Component<DescriptionProps, DescriptionState> {
    static contextType = FastballContext;

    ref = React.createRef<ProCoreActionType>();
    componentRef = React.createRef();

    constructor(props: DescriptionProps) {
        super(props)
        this.state = { data: props.input }
        // 第一次调用传入的 setActions 将按钮注册到 popup, 否则会导致循环更新
        if (props.setActions) {
            props.setActions(this.getActions())
        }
    }

    getActions() {
        const { componentKey, closePopup, input, actions, recordActions } = this.props;
        const { data } = this.state;
        const buttons = recordActions ? recordActions.filter(filterVisibled).map(action => {
            if (action.closePopupOnSuccess !== false && closePopup) {
                action.callback = () => {
                    closePopup()
                }
            } else if (action.refresh !== false) {
                action.callback = () => {
                    this.ref.current?.reload()
                }
            }
            return buildAction({ componentKey, ...action, data });
        }) : []
        actions?.filter(filterVisibled).forEach(action => {
            if (action.closePopupOnSuccess !== false && closePopup) {
                action.callback = () => {
                    closePopup()
                }
            } else if (action.refresh !== false) {
                action.callback = () => {
                    this.ref.current?.reload()
                }
            }
            buttons.push(buildAction({ ref: this.componentRef, componentKey, ...action }));
        })
        return buttons;
    }

    buildTableColumns(container: Element, fields: FieldInfo[]): ProSchema[] {
        return fields.filter(filterEnabled).map(field => {
            const column: ProSchema = {};
            processingField(container, field, column, this.props.__designMode);
            Object.assign(column, field);
            return column;
        })
    }

    buildColumns(container: Element, fields: FieldInfo[], parentDataIndex?: string[]): ProDescriptionsItemProps[] {
        return fields.filter(filterEnabled).flatMap(field => {
            const column: ProDescriptionsItemProps = {};
            Object.assign(column, field, { hideInTable: true, hideInSetting: true });
            processingField(container, field, column, this.props.__designMode);
            if (field.validationRules) {
                column.formItemProps = {
                    rules: field.validationRules
                }
            }
            if (parentDataIndex) {
                column.dataIndex = [...parentDataIndex, ...field.dataIndex]
            }
            if (field.valueType === 'SubFields' && field.subFields) {
                return this.buildColumns(container, field.subFields!, field.dataIndex)
            }
            if (field.valueType === 'SubTable' && field.subFields) {
                const columns = this.buildColumns(container, field.subFields.filter(({ display }) => display === 'Show'))
                columns.forEach(c => c.hideInTable = false)
                column.fieldProps = Object.assign(column.fieldProps || {}, {
                    columns,
                    title: column.title
                })
                column.title = null;
            }
            if (field.valueType === 'Array' && field.subFields) {
                column.span = this.props.column
                column.render = (_, record) => {
                    const records: Record<string, any> = getByPaths(record, field.dataIndex)
                    if (records && Array.isArray(records)) {
                        return <ProTable size='small' pagination={false} toolBarRender={false} search={false} dataSource={records} columns={this.buildTableColumns(container, field.subFields!)} />
                    }
                }
            }
            return column;
        })
    }

    getColumns(container: Element): ProDescriptionsItemProps[] {
        return this.buildColumns(container, this.props.fields);
    }

    render(): React.ReactNode {
        const { componentKey, input, column, variableDescription, setActions, onDataLoad, __designMode, ...props } = this.props;
        
        let container = this.props.container;
        if(!container) {
            container = this.context?.container;
        }

        const proDescriptionsProps: ProDescriptionsProps = { column };
        proDescriptionsProps.size = 'small'
        if (variableDescription && __designMode !== 'design') {
            proDescriptionsProps.request = async () => {
                try {
                    const data = await doApiAction({ componentKey, type: 'API', actionKey: 'loadData', data: [input] })
                    if (onDataLoad) {
                        onDataLoad(data);
                    }
                    this.setState({ data })
                    return { data, success: true }
                } catch (e) {
                    return { success: false }
                }
            }
        } else if (input) {
            if (onDataLoad) {
                onDataLoad(input);
            }
            proDescriptionsProps.dataSource = input
        }

        proDescriptionsProps.columns = this.getColumns(container);

        if (!setActions) {
            proDescriptionsProps.columns.push({
                title: '操作',
                valueType: 'option',
                render: () => this.getActions(),
            });
        }

        const getPopupContainer = container ? () => container : undefined;
        return <ComponentToPrint ref={this.componentRef}>
                <ProConfigProvider
                    getPopupContainer={getPopupContainer}
                    valueTypeMap={{
                        SubTable: {
                            render: (data, props) => <SubTable size="small" {...props} {...props.fieldProps} value={data} readonly />,
                        },
                        Address: {
                            render: (text) => text,
                        }
                    }}
                >
                    <ProDescriptions size="small" actionRef={this.ref} {...proDescriptionsProps} {...props} />
                </ProConfigProvider>
        </ComponentToPrint>
    }
}

export default FastballDescription;