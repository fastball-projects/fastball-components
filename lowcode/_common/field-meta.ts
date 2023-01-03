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
const AllowClear = {
    name: 'fieldProps.allowClear',
    title: {
        label: '支持清除',
        tip: 'allowClear | 是否允许清除',
    },
    propType: 'bool',
    defaultValue: true,
    setter: 'BoolSetter',
}
const Bordered = {
    name: 'fieldProps.bordered',
    title: { label: '显示边框', tip: '是否有边框' },
    propType: 'bool',
    defaultValue: true,
    setter: 'BoolSetter',
}
const Disable = {
    name: 'fieldProps.disabled',
    title: { label: '是否禁用', tip: '是否为禁用状态' },
    propType: 'bool',
    defaultValue: false,
    setter: 'BoolSetter',
}
const Placeholder = {
    name: 'fieldProps.placeholder',
    title: { label: '占位提示', tip: '占位提示' },
    propType: 'string',
    defaultValue: '请输入',
    setter: 'StringSetter'
}

const Required = {
    name: 'fieldProps.required',
    title: {
        label: '必填标记',
        tip: '必填样式设置。如不设置，则会根据校验规则自动生成',
    },
    propType: 'bool',
    defaultValue: false,
    setter: 'BoolSetter',
    supportVariable: true
}

const commonFieldProps = [Placeholder, AllowClear, Bordered, Disable, Required]


const MaxLength = {
    name: 'fieldProps.maxLength',
    title: { label: '最大长度', tip: '最大长度' },
    propType: 'number',
    setter: 'NumberSetter',
}
const Size = {
    name: 'fieldProps.size',
    title: { label: '控件大小', tip: '控件大小' },
    setter: {
        componentName: 'RadioGroupSetter',
        props: {
            options: [
                {
                    title: '大',
                    value: 'large',
                },
                {
                    title: '中',
                    value: 'middle',
                },
                {
                    title: '小',
                    value: 'small',
                },
            ],
        },
    },
    propType: { type: 'oneOf', value: ['large', 'middle', 'small'] },
    defaultValue: 'middle',
}
const AddonAfter = {
    name: 'fieldProps.addonAfter',
    title: { label: '后置标签', tip: '后置标签' },
    propType: 'string',
    setter: 'StringSetter'
}
const AddonBefore = {
    name: 'fieldProps.addonBefore',
    title: { label: '前置标签', tip: '前置标签' },
    propType: 'string',
    setter: 'StringSetter'
}
const Prefix = {
    name: 'fieldProps.prefix',
    title: { label: '前缀', tip: '前缀' },
    propType: 'string',
    setter: 'StringSetter'
}
const Suffix = {
    name: 'fieldProps.suffix',
    title: { label: '后缀', tip: '后缀' },
    propType: 'string',
    setter: 'StringSetter'
}
const NumberControls = {
    name: 'fieldProps.controls',
    title: { label: '是否显示增减按钮', tip: '是否显示增减按钮' },
    propType: 'bool',
    defaultValue: true,
    setter: 'BoolSetter'
}
const ShowCount = {
    name: 'fieldProps.showCount',
    title: { label: '展示字数', tip: '是否展示字数' },
    propType: 'bool',
    defaultValue: false,
    setter: 'BoolSetter'
}
const AutoSize = {
    name: 'fieldProps.autoSize',
    title: { label: '高度自适应设置', tip: '高度自适应设置' },
    propType: {
        type: 'oneOfType',
        value: [
            'bool',
            {
                type: 'shape',
                value: [
                    {
                        name: 'fieldProps.minRows',
                        title: '最小行数',
                        setter: 'NumberSetter',
                        defaultValue: 3,
                    },
                    {
                        name: 'fieldProps.maxRows',
                        title: '最大行数',
                        setter: 'NumberSetter',
                        defaultValue: 3,
                    },
                ],
            },
        ],
    },
    defaultValue: false,
}
const Precision = {
    name: 'fieldProps.precision',
    title: { label: '数值精度', tip: '数值精度' },
    propType: 'number',
    setter: 'NumberSetter'
}
const Step = {
    name: 'fieldProps.step',
    title: { label: '单步长', tip: '每次改变步数' },
    propType: 'number',
    setter: 'NumberSetter'
}


const DateFormat = {
    name: 'fieldProps.format',
    title: {
        label: '格式',
        tip: 'format|日期值的格式（用于限定用户输入和展示）',
    },
    propType: 'string',
    setter: 'StringSetter',
    description: 'format|日期值的格式（用于限定用户输入和展示）',
    defaultValue: 'YYYY-MM-DD',
}

const DateTimeFormat = {
    name: 'fieldProps.format',
    title: {
        label: '格式',
        tip: 'format|日期值的格式（用于限定用户输入和展示）',
    },
    propType: 'string',
    setter: 'StringSetter',
    description: 'format|日期值的格式（用于限定用户输入和展示）',
    defaultValue: 'YYYY-MM-DD HH:mm:ss',
}

const TimeFormat = {
    name: 'fieldProps.format',
    title: {
        label: '格式',
        tip: 'format|日期值的格式（用于限定用户输入和展示）',
    },
    propType: 'string',
    setter: 'StringSetter',
    description: 'format|日期值的格式（用于限定用户输入和展示）',
    defaultValue: 'HH:mm:ss',
}


const StringDefaultValue = {
    name: 'fieldProps.defaultValue',
    title: { label: '默认值', tip: '默认内容' },
    propType: 'string',
    setter: 'StringSetter',
}

const DateDefaultValue = {
    name: 'fieldProps.defaultValue',
    title: { label: '默认值', tip: '默认内容' },
    propType: 'date',
    setter: 'DateSetter',
}

const DateTimeDefaultValue = {
    name: 'fieldProps.defaultValue',
    title: { label: '默认值', tip: '默认内容' },
    propType: 'datetime',
    setter: 'DateTimeSetter',
}

const TimeDefaultValue = {
    name: 'fieldProps.defaultValue',
    title: { label: '默认值', tip: '默认内容' },
    propType: 'time',
    setter: 'TimeSetter',
}

const NumberDefaultValue = {
    name: 'fieldProps.defaultValue',
    title: { label: '默认值', tip: '默认内容' },
    propType: 'number',
    setter: 'NumberSetter'
}

const FieldMetaMap = {
    'link': [StringDefaultValue, AddonAfter, AddonBefore, Prefix, Suffix, MaxLength, Size],
    'text': [StringDefaultValue, AddonAfter, AddonBefore, Prefix, Suffix, MaxLength, Size],
    'textarea': [StringDefaultValue, AddonAfter, AddonBefore, Prefix, Suffix, MaxLength, Size, ShowCount, AutoSize],

    'date': [DateDefaultValue, DateFormat],
    'dateRange': [DateDefaultValue, DateFormat],
    'dateTime': [DateTimeDefaultValue, DateTimeFormat],
    'dateTimeRange': [DateTimeDefaultValue, DateTimeFormat],
    'time': [TimeDefaultValue, TimeFormat],
    'timeRange': [TimeDefaultValue, TimeFormat],
    'dateWeek': [],
    'dateMonth': [],
    'dateQuarter': [],
    'dateYear': [],
    'fromNow': [],

    'digit': [NumberDefaultValue, AddonAfter, AddonBefore, Prefix, Suffix, NumberControls, Step, Precision],
    'money': [NumberDefaultValue, AddonAfter, AddonBefore, Prefix, Suffix, NumberControls, Step, Precision],
    'percent': [NumberDefaultValue, AddonAfter, AddonBefore, Prefix, Suffix, NumberControls, Step, Precision],
    'progress': [NumberDefaultValue, AddonAfter, AddonBefore, Prefix, Suffix, NumberControls, Step, Precision],

    'switch': [ValueEnum],
    'select': [ValueEnum],
    'radio': [ValueEnum],
    'checkbox': [ValueEnum],

    'avatar': [],
    'image': [],

    'password': [],
    // 'jsonCode': [],
    // 'code': [],
    // 'color': []
}

const typedFieldMeta = {}

Object.keys(FieldMetaMap).forEach(valueType => {
    FieldMetaMap[valueType].forEach(meta => {
        if (!typedFieldMeta[meta.name]) {
            meta.valueTypes = {}
            typedFieldMeta[meta.name] = meta;
        }
        typedFieldMeta[meta.name].valueTypes[valueType] = true;
    })
})

const FieldProps = Object.keys(typedFieldMeta).map(fieldMetaName => {
    const fieldMeta = typedFieldMeta[fieldMetaName];
    fieldMeta.condition = (target) => {
        return fieldMeta.valueTypes[target.getProps().getPropValue(target.path[0])[target.path[1]].valueType] === true;
    }
    return fieldMeta;
})

const FieldMetaSetter = {
    componentName: HideAbleArraySetter,
    props: {
        itemSetter: {
            componentName: 'ObjectSetter',
            props: {
                config: {
                    items: [
                        DataIndex, Title, Width, FieldType, Tooltip, Align,
                        ...commonFieldProps,
                        ...FieldProps
                    ]
                }
            },
            initialValue: { title: '标题' }
        }
    }
}

export default FieldMetaSetter;