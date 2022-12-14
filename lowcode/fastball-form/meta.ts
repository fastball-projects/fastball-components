import ActionMetaSetter from '../_common/action-meta'
import FieldMetaSetter from '../_common/field-meta'

const FastballFormMeta = {
  componentName: 'FastballForm',
  title: '表单',
  docUrl: '',
  screenshot: '',
  devMode: 'proCode',
  group: '高级组件',
  category: '表单类',
  npm: {
    package: 'fastball-components',
    version: 'latest',
    exportName: 'FastballForm',
    main: '',
    destructuring: true,
    subName: ''
  },
  configure: {
    props: [
      {
        name: 'fields',
        title: { label: '字段', tip: '表单字段的配置描述，具体项见下表' },
        display: 'accordion',
        setter: FieldMetaSetter
      },
      {
        name: 'actions',
        title: { label: '操作', tip: '表单的按钮操作配置，具体项见下表' },
        display: 'accordion',
        extraProps: {
          "defaultCollapsed": true // 控制默认折叠
        },
        setter: ActionMetaSetter,
        defaultValue: []
      },

      {
        title: '外观',
        display: 'accordion',
        extraProps: {
          "defaultCollapsed": true // 控制默认折叠
        },
        type: 'group',
        items: [
          {
            title: {
              label: '表格名称'
            },
            name: 'headerTitle',
            setter: {
              componentName: 'StringSetter',
              isRequired: false
            }
          },
          {
            name: 'readonly',
            title: { label: '只读模式', tip: 'readonly | 只读模式' },
            propType: 'bool',
            setter: 'BoolSetter',
            defaultValue: false,
          },
        ]
      },
      {
        name: 'layoutType',
        title: { label: '布局方式', tip: 'layoutType | 布局方式' },
        propType: {
          type: 'oneOf',
          value: ['Form', 'ModalForm', 'DrawerForm', 'Embed']
        },
        defaultValue: 'left',
        setter: [
          {
            componentName: 'RadioGroupSetter',
            props: {
              options: [
                {
                  title: 'Form',
                  value: 'Form'
                },
                {
                  title: 'ModalForm',
                  value: 'ModalForm'
                },
                {
                  title: 'DrawerForm',
                  value: 'DrawerForm'
                },
                {
                  title: 'Embed',
                  value: 'Embed'
                }
              ]
            }
          },
          'VariableSetter'
        ]
      },
    ],
    supports: {
    },
    component: {}
  }
}

export default { ...FastballFormMeta }
