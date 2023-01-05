import { HideAbleArraySetter } from '../_setters'

const ActionMetaSetter = {
    componentName: HideAbleArraySetter,
    props: {
        itemSetter: {
            componentName: 'ObjectSetter',
            props: {
                config: {
                    items: [
                        {
                            name: 'actionName',
                            title: { label: '按钮名称', tip: 'name | 按钮名称' },
                            propType: 'string',
                            setter: 'StringSetter',
                            isRequired: true
                        },
                        {
                            name: 'type',
                            title: { label: '触发动作类型', tip: 'actionType | 触发动作类型' },
                            propType: 'string',
                            isRequired: true,
                            defaultValue: 'default',
                            setter: {
                                componentName: 'SelectSetter',
                                props: {
                                    options: [
                                        {
                                            title: '默认',
                                            value: 'default'
                                        },
                                        {
                                            title: '主按钮',
                                            value: 'primary'
                                        },
                                        {
                                            title: '次按钮',
                                            value: 'ghost'
                                        },
                                        {
                                            title: '虚线',
                                            value: 'dashed'
                                        },
                                        {
                                            title: '链接',
                                            value: 'link'
                                        },
                                        {
                                            title: '文本',
                                            value: 'text'
                                        },
                                    ]
                                }
                            }
                        },
                        {
                            name: 'actionType',
                            title: { label: '触发动作类型', tip: 'actionType | 触发动作类型' },
                            propType: 'string',
                            setter: {
                                componentName: 'SelectSetter',
                                props: {
                                    options: [
                                        {
                                            title: '调用服务',
                                            value: 'service'
                                        },
                                        {
                                            title: '抽屉',
                                            value: 'drawer'
                                        },
                                        {
                                            title: '弹窗',
                                            value: 'modal'
                                        },
                                        {
                                            title: '跳转页面',
                                            value: 'digit'
                                        },
                                    ]
                                }
                            }
                        }
                    ]
                }
            },
            initialValue: { title: '标题' }
        }
    }
}

export default ActionMetaSetter;