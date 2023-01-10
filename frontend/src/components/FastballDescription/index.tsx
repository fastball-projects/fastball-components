import * as React from 'react'
import { ProDescriptions } from '@ant-design/pro-components'
import type { ProCoreActionType, ProDescriptionsProps, ProDescriptionsItemProps } from '@ant-design/pro-components';
import type { FieldInfo, DescriptionProps, LookupActionInfo } from '../../../types';
import { buildAction, doLookupAction, doApiAction, filterEnabled, filterVisibled } from '../../common';
import FastballPopup from '../../common/Popup';

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

    getColumns(): ProDescriptionsItemProps[] {
        const fields: FieldInfo[] = this.props.fields;

        return fields.filter(filterEnabled).map(field => {
            const column: ProDescriptionsItemProps = {};
            Object.assign(column, field, { hideInTable: true, hideInSetting: true });
            if (field.display === 'Hidden') {
                column.hideInDescriptions = true;
            }
            if (field.validationRules) {
                column.formItemProps = {
                    rules: field.validationRules
                }
            }
            if (field.lookupAction) {
                const lookupAction: LookupActionInfo = field.lookupAction;
                column.request = () => doLookupAction(lookupAction)
            }
            if (field.valueType === 'popup' && field.popupInfo) {
                column.render = (dom, record) => {
                    const { popupTitle, popupComponent, popupType, placementType, width } = field.popupInfo!;
                    return <FastballPopup width={width} title={popupTitle} trigger={<a>{dom}</a>} popupComponent={popupComponent} popupType={popupType} placementType={placementType} input={record} />;
                }
            }
            return column;
        })
    }

    render(): React.ReactNode {
        const { componentKey, fields = [], actions = [], input, column, variableDescription, setActions, ...props } = this.props;

        const proDescriptionsProps: ProDescriptionsProps = { column };
        proDescriptionsProps.size = 'small'
        if (variableDescription) {
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

        return <ProDescriptions actionRef={this.ref} {...proDescriptionsProps} {...props} />
    }
}

export default FastballDescription;