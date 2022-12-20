import { ReadOnlySetter, HideAbleArraySetter } from '../_setters'

const DataIndex = {
    name: 'dataIndex',
    title: { label: '数据字段', tip: 'dataIndex | 数据字段' },
    propType: 'string',
    setter: ReadOnlySetter,
    isRequired: true
}

const Title = {
    name: 'title',
    title: { label: '字段标题', tip: 'title | 字段标题' },
    propType: 'string',
    setter: 'StringSetter',
    isRequired: true
}

const Width = {
    name: 'colProps.span',
    title: { label: '字段宽度', tip: 'col | 字段宽度' },
    propType: {
        type: 'oneOf',
        value: ['checkbox', 'radio']
    },
    setter: [
        {
            componentName: 'RadioGroupSetter',
            props: {
                options: [
                    {
                        title: '1/4',
                        value: 6
                    },
                    {
                        title: '1/3',
                        value: 8
                    },
                    {
                        title: '1/2',
                        value: 12
                    },
                    {
                        title: '1',
                        value: 24
                    },
                ]
            },
            defaultValue: 8,
        },
        'VariableSetter'
    ],
}

const FieldType = {
    name: 'valueType',
    title: { label: '数据类型', tip: 'valueType | 数据类型' },
    propType: 'string',
    setter: {
        componentName: 'SelectSetter',
        props: {
            options: [
                {
                    title: '文本',
                    value: 'text'
                },
                {
                    title: '标签',
                    value: 'tag'
                },
                {
                    title: '数字',
                    value: 'digit'
                },
                {
                    title: '密码输入框',
                    value: 'password'
                },
                {
                    title: '金额',
                    value: 'money'
                },
                {
                    title: '日期',
                    value: 'date'
                },
                {
                    title: '日期时间',
                    value: 'dateTime'
                },
                {
                    title: '日期区间',
                    value: 'dateRange'
                },
                {
                    title: '日期时间区间',
                    value: 'dateTimeRange'
                },
                {
                    title: '链接',
                    value: 'link'
                },
                // {
                //   title: '标签',
                //   value: 'tag',
                // },
                {
                    title: '头像',
                    value: 'avatar'
                },
                {
                    title: '开关',
                    value: 'switch'
                },
                {
                    title: '百分比',
                    value: 'percent'
                },
                {
                    title: '进度条',
                    value: 'progress'
                },
                {
                    title: '下拉框',
                    value: 'select'
                },
                {
                    title: '单选框',
                    value: 'radio'
                },
                {
                    title: '多选框',
                    value: 'checkbox'
                },
                {
                    title: '图片',
                    value: 'image'
                },
                {
                    title: 'JSON代码框',
                    value: 'jsonCode'
                },
                {
                    title: '代码框',
                    value: 'code'
                },
                {
                    title: '颜色选择器',
                    value: 'color'
                }
            ]
        }
    }
}

const ValueEnum = {
    name: 'valueEnum',
    title: {
        label: '枚举定义',
        tip: 'valueEnum | 值的枚举，会自动转化把值当成 key 来取出要显示的内容'
    },
    propType: 'object',
    setter: 'JsonSetter'
}

const Request = {
    title: {
        label: {
            type: 'i18n',
            'en-US': 'request',
            'zh-CN': '远程获取枚举'
        },
        tip: 'request | 远程获取枚举'
    },
    name: 'request',
    description: '远程获取枚举',
    setter: {
        componentName: 'FunctionSetter',
        isRequired: false
    }
}

const Tooltip = {
    name: 'tooltip',
    title: {
        label: '气泡提示',
        tip: 'tooltip	| 气泡提示'
    },
    propType: 'string',
    setter: 'StringSetter'
}

const Align = {
    name: 'align',
    title: { label: '对齐方式', tip: 'align | 对齐方式' },
    propType: {
        type: 'oneOf',
        value: ['left', 'right', 'center']
    },
    defaultValue: 'left',
    setter: [
        {
            componentName: 'RadioGroupSetter',
            props: {
                options: [
                    {
                        title: 'left',
                        value: 'left'
                    },
                    {
                        title: 'right',
                        value: 'right'
                    },
                    {
                        title: 'center',
                        value: 'center'
                    }
                ]
            }
        },
        'VariableSetter'
    ]
}

const FieldMetaSetter = {
    componentName: HideAbleArraySetter,
    props: {
        itemSetter: {
            componentName: 'ObjectSetter',
            props: {
                config: {
                    items: [
                        DataIndex,
                        Title,
                        Width,
                        FieldType,
                        ValueEnum,
                        Request,
                        Tooltip,
                        Align
                    ]
                }
            },
            initialValue: { title: '标题' }
        }
    }
}

export default FieldMetaSetter;