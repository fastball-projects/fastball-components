import ActionMetaSetter from '../_common/action-meta'
import FieldMetaSetter from '../_common/field-meta'

const FastballTableMeta = {
  componentName: 'FastballTable',
  title: '高级表格',
  docUrl: '',
  screenshot: '',
  devMode: 'proCode',
  group: '高级组件',
  category: '表格类',
  npm: {
    package: 'fastball-components',
    version: 'latest',
    exportName: 'FastballTable',
    main: '',
    destructuring: true,
    subName: ''
  },
  configure: {
    props: [
      {
        name: 'queryFields',
        title: { label: '搜索字段', tip: '表格搜索字段的配置描述，具体项见下表' },
        display: 'accordion',
        setter: FieldMetaSetter
      },
      {
        name: 'columns',
        title: { label: '表格列', tip: '表格列的配置描述，具体项见下表' },
        display: 'accordion',
        setter: FieldMetaSetter
      },
      {
        name: 'actions',
        title: { label: '操作', tip: '表格的操作配置，具体项见下表' },
        display: 'accordion',
        extraProps: {
          "defaultCollapsed": true // 控制默认折叠
        },
        setter: ActionMetaSetter,
        defaultValue: []
      },

      {
        name: 'recordActions',
        title: { label: '行数据操作', tip: '表格行数据的操作配置，具体项见下表' },
        display: 'accordion',
        extraProps: {
          "defaultCollapsed": true // 控制默认折叠
        },
        setter: ActionMetaSetter
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
            name: 'showHeader',
            title: { label: '显示表头', tip: 'showHeader | 是否显示表头' },
            propType: 'bool',
            setter: 'BoolSetter',
            defaultValue: true
          },
          {
            name: 'bordered',
            title: {
              label: '显示边框',
              tip: 'bordered | 是否展示外边框和列边框'
            },
            propType: 'bool',
            setter: 'BoolSetter'
          },
          {
            name: 'size',
            title: { label: '表格大小', tip: 'size | 表格大小' },
            propType: {
              type: 'oneOf',
              value: ['default', 'middle', 'small']
            },
            setter: [
              {
                componentName: 'RadioGroupSetter',
                props: {
                  options: [
                    {
                      title: '默认',
                      value: 'default'
                    },
                    {
                      title: '中',
                      value: 'middle'
                    },
                    {
                      title: '小',
                      value: 'small'
                    }
                  ]
                }
              },
              'VariableSetter'
            ],
            defaultValue: 'small'
          },
          {
            name: 'tableLayout',
            title: { label: '表格布局', tip: 'tableLayout | 表格布局' },
            defaultValue: '',
            propType: {
              type: 'oneOf',
              value: ['', 'auto', 'fixed']
            },
            setter: [
              {
                componentName: 'RadioGroupSetter',
                props: {
                  options: [
                    {
                      title: '默认',
                      value: ''
                    },
                    {
                      title: '自动',
                      value: 'auto'
                    },
                    {
                      title: '固定',
                      value: 'fixed'
                    }
                  ]
                }
              },
              'VariableSetter'
            ]
          }
        ]
      },
      {
        title: '分页',
        display: 'accordion',
        extraProps: {
          "defaultCollapsed": true // 控制默认折叠
        },
        type: 'group',
        items: [
          {
            name: 'pagination',
            title: { label: '显示分页', tip: 'pagination | 显示分页' },
            propType: 'bool',
            setter: 'BoolSetter',
            extraProps: {
              setValue: (target, value) => {
                if (value) {
                  target.parent.setPropValue('pagination', {
                    pageSize: 10
                  })
                }
              }
            }
          },
          {
            name: 'pagination.pageSize',
            title: { label: '每页条数', tip: 'pagination.pageSize | 每页条数' },
            propType: 'number',
            setter: 'NumberSetter',
            condition: {
              type: 'JSFunction',
              value: 'target => !!target.getProps().getPropValue("pagination")'
            }
          },
          {
            name: 'pagination.defaultCurrent',
            title: {
              label: '默认当前页',
              tip: 'pagination.defaultCurrent | 默认的当前页数'
            },
            propType: 'number',
            setter: 'NumberSetter',
            condition: {
              type: 'JSFunction',
              value: 'target => !!target.getProps().getPropValue("pagination")'
            }
          },
          {
            name: 'pagination.showSizeChanger',
            title: {
              label: '页数切换',
              tip: 'pagination.showSizeChanger | 是否展示 pageSize 切换器'
            },
            propType: 'bool',
            setter: 'BoolSetter',
            defaultValue: false,
            condition: {
              type: 'JSFunction',
              value: 'target => !!target.getProps().getPropValue("pagination")'
            }
          },
          {
            name: 'pagination.showQuickJumper',
            title: {
              label: '快速跳转',
              tip: 'pagination.showQuickJumper | 是否可以快速跳转至某页'
            },
            propType: 'bool',
            setter: 'BoolSetter',
            defaultValue: false,
            condition: {
              type: 'JSFunction',
              value: 'target => !!target.getProps().getPropValue("pagination")'
            }
          },
          {
            name: 'pagination.simple',
            title: { label: '简单分页', tip: 'pagination.simple | 简单分页' },
            propType: 'bool',
            setter: 'BoolSetter',
            defaultValue: false,
            condition: {
              type: 'JSFunction',
              value: 'target => !!target.getProps().getPropValue("pagination")'
            }
          },
          {
            name: 'pagination.size',
            title: { label: '分页尺寸', tip: 'pagination.size | 分页尺寸' },
            propType: {
              type: 'oneOf',
              value: ['default', 'small']
            },
            setter: [
              {
                componentName: 'RadioGroupSetter',
                props: {
                  options: [
                    {
                      title: '默认',
                      value: 'default'
                    },
                    {
                      title: '小',
                      value: 'small'
                    }
                  ]
                }
              },
              'VariableSetter'
            ],
            defaultValue: 'small',
            condition: {
              type: 'JSFunction',
              value: 'target => !!target.getProps().getPropValue("pagination")'
            }
          },
        ]
      },
      {
        title: '滚动',
        display: 'accordion',
        extraProps: {
          "defaultCollapsed": true // 控制默认折叠
        },
        type: 'group',
        items: [
          {
            name: 'scroll.scrollToFirstRowOnChange',
            title: {
              label: '自动滚动',
              tip: 'scroll.scrollToFirstRowOnChange | 是否自动滚动到表格顶部'
            },
            propType: 'bool',
            setter: 'BoolSetter',
            defaultValue: true
          },
          {
            name: 'scroll.x',
            title: {
              label: '横向滚动',
              tip: 'scroll.x | 	设置横向滚动，也可用于指定滚动区域的宽，可以设置为像素值，百分比，true 和 max-content'
            },
            propType: { type: 'oneOfType', value: ['number', 'bool'] },
            setter: ['NumberSetter', 'BoolSetter', 'VariableSetter']
          },
          {
            name: 'scroll.y',
            title: {
              label: '纵向滚动',
              tip: 'scroll.y | 	设置纵向滚动，也可用于指定滚动区域的高，可以设置为像素值'
            },
            propType: 'number',
            setter: ['NumberSetter', 'VariableSetter']
          }
        ]
      },
      {
        title: '行选择器',
        display: 'accordion',
        extraProps: {
          "defaultCollapsed": true // 控制默认折叠
        },
        type: 'group',
        items: [
          {
            name: 'rowSelection',
            title: { label: '行选择', tip: 'rowSelection | 行选择' },
            propType: 'bool',
            setter: 'BoolSetter',
            defaultValue: false,
            extraProps: {
              setValue: (target, value) => {
                if (value) {
                  target.parent.setPropValue('rowSelection', {
                    type: 'radio'
                  })
                }
              }
            }
          },
          {
            name: 'rowSelection.type',
            title: {
              label: '行选择类型',
              tip: 'rowSelection.type | 多选/单选'
            },
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
                      title: '多选',
                      value: 'checkbox'
                    },
                    {
                      title: '单选',
                      value: 'radio'
                    }
                  ]
                }
              },
              'VariableSetter'
            ],
            condition: {
              type: 'JSFunction',
              value:
                'target => !!target.getProps().getPropValue("rowSelection")'
            }
          },
          {
            name: 'rowSelection.preserveSelectedRowKeys',
            title: {
              label: '缓存选项',
              tip: 'rowSelection.preserveSelectedRowKeys | 当数据被删除时仍然保留选项'
            },
            propType: 'bool',
            setter: 'BoolSetter',
            condition: {
              type: 'JSFunction',
              value:
                'target => !!target.getProps().getPropValue("rowSelection")'
            }
          },
          {
            name: 'rowSelection.fixed',
            title: {
              label: '固定左边',
              tip: 'rowSelection.fixed | 把选择框列固定在左边'
            },
            propType: 'bool',
            setter: 'BoolSetter',
            condition: {
              type: 'JSFunction',
              value:
                'target => !!target.getProps().getPropValue("rowSelection")'
            }
          },
          {
            name: 'rowSelection.selectedRowKeys',
            title: {
              label: '选中行Key',
              tip: 'rowSelection.selectedRowKeys | 指定选中项的 key 数组'
            },
            propType: 'object',
            setter: 'JsonSetter',
            condition: {
              type: 'JSFunction',
              value:
                'target => !!target.getProps().getPropValue("rowSelection")'
            }
          },
          {
            name: 'rowSelection.getCheckboxProps',
            title: {
              label: '默认属性',
              tip: 'rowSelection.getCheckboxProps | 选择框的默认属性配置'
            },
            propType: 'func',
            setter: [
              {
                componentName: 'FunctionSetter',
                props: {
                  template:
                    'getCheckboxProps(record,${extParams}){\n// 选择框的默认属性配置\nreturn { disabled: false };\n}'
                }
              },
              'VariableSetter'
            ],
            condition: {
              type: 'JSFunction',
              value:
                'target => !!target.getProps().getPropValue("rowSelection")'
            }
          },
          {
            name: 'rowSelection.onChange',
            title: {
              label: 'onChange',
              tip: 'rowSelection.onChange | 选中项发生变化时的回调'
            },
            propType: 'func',
            setter: [
              {
                componentName: 'FunctionSetter',
                props: {
                  template:
                    'onChange(record,${extParams}){\n// 选择框的默认属性配置\nreturn { disabled: false };\n}'
                }
              },
              'VariableSetter'
            ],
            condition: {
              type: 'JSFunction',
              value:
                'target => !!target.getProps().getPropValue("rowSelection")'
            }
          },
          {
            name: 'rowSelection.onSelect',
            title: {
              label: 'onSelect',
              tip: 'rowSelection.onSelect | 	用户手动选择/取消选择某行的回调'
            },
            propType: 'func',
            setter: [
              {
                componentName: 'FunctionSetter',
                props: {
                  template:
                    'onSelect(record,${extParams}){\n// 选择框的默认属性配置\nreturn { disabled: false };\n}'
                }
              },
              'VariableSetter'
            ],
            condition: {
              type: 'JSFunction',
              value:
                'target => !!target.getProps().getPropValue("rowSelection")'
            }
          },
          {
            name: 'rowSelection.onSelectAll',
            title: {
              label: 'onSelectAll',
              tip: 'rowSelection.onSelectAll | 	用户手动选择/取消选择所有行的回调'
            },
            propType: 'func',
            setter: [
              {
                componentName: 'FunctionSetter',
                props: {
                  template:
                    'onSelectAll(record,${extParams}){\n// 选择框的默认属性配置\nreturn { disabled: false };\n}'
                }
              },
              'VariableSetter'
            ],
            condition: {
              type: 'JSFunction',
              value:
                'target => !!target.getProps().getPropValue("rowSelection")'
            }
          },
          {
            name: 'rowSelection.onSelectInvert',
            title: {
              label: 'onSelectInvert',
              tip: 'rowSelection.onSelectInvert | 用户手动选择反选的回调'
            },
            propType: 'func',
            setter: [
              {
                componentName: 'FunctionSetter',
                props: {
                  template:
                    'onSelectInvert(record,${extParams}){\n// 选择框的默认属性配置\nreturn { disabled: false };\n}'
                }
              },
              'VariableSetter'
            ],
            condition: {
              type: 'JSFunction',
              value:
                'target => !!target.getProps().getPropValue("rowSelection")'
            }
          },
          {
            name: 'rowSelection.onSelectNone',
            title: {
              label: 'onSelectNone',
              tip: 'rowSelection.onSelectNone | 用户清空选择的回调'
            },
            propType: 'func',
            setter: [
              {
                componentName: 'FunctionSetter',
                props: {
                  template:
                    'onSelectNone(record,${extParams}){\n// 选择框的默认属性配置\nreturn { disabled: false };\n}'
                }
              },
              'VariableSetter'
            ],
            condition: {
              type: 'JSFunction',
              value:
                'target => !!target.getProps().getPropValue("rowSelection")'
            }
          }
        ]
      },


      {
        title: '搜索设置',
        display: 'accordion',
        extraProps: {
          "defaultCollapsed": true // 控制默认折叠
        },
        type: 'group',
        items: [
          {
            name: 'search',
            title: { label: '搜索', tip: 'search | 搜索' },
            propType: 'bool',
            setter: 'BoolSetter',
            defaultValue: true,
            extraProps: {
              setValue: (target, value) => {
                if (value) {
                  target.parent.setPropValue('search', {
                    defaultCollapsed: true
                  })
                }
              }
            }
          },
          {
            name: 'search.filterType',
            title: { label: '过滤表单模式', tip: 'filterType | 过滤表单模式' },
            defaultValue: 'query',
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
                      title: '默认模式',
                      value: 'query'
                    },
                    {
                      title: '轻量模式',
                      value: 'light'
                    }
                  ]
                }
              },
              'VariableSetter'
            ],
          },
          {
            title: {
              label: '查询按钮的文本',
              tip: 'searchText | 查询按钮的文本'
            },
            name: 'search.searchText',
            setter: {
              componentName: 'StringSetter',
              isRequired: false,
              initialValue: ''
            },
            condition: {
              type: 'JSFunction',
              value: 'target => !!target.getProps().getPropValue("search")'
            }
          },
          {
            title: {
              label: '重置按钮的文本',
              tip: 'resetText | 重置按钮的文本'
            },
            name: 'search.resetText',
            setter: {
              componentName: 'StringSetter',
              isRequired: false,
              initialValue: ''
            },
            condition: {
              type: 'JSFunction',
              value: 'target => !!target.getProps().getPropValue("search")'
            }
          }
        ]
      },
    ],
    supports: {
    },
    component: {},
    advanced: {
      callbacks: {
        onNodeAdd: (dragment, currentNode) => {
          // const comps = [
          //   'Input',
          //   'Select',
          //   'Radio',
          //   'Checkbox',
          //   'Switch',
          //   'Upload',
          //   'Datepicker',
          //   'Rate',
          //   'Transfer',
          // ];

          // if (
          //   !dragment ||
          //   !dragment.componentMeta ||
          //   !dragment.componentMeta.npm ||
          //   !dragment.componentMeta.npm.package ||
          //   dragment.componentMeta.npm.package.indexOf('@alilc/antd-lowcode-materials') === -1 ||
          //   comps.every((comp) => dragment.componentName.indexOf(comp) === -1)
          // ) {
          //   return;
          // }

          // 为目标元素包裹一层P
          const layoutPNode = currentNode.document.createNode({
            componentName: 'FastballTable.Column',
            props: {
              label: '表格列: ',
            },
            children: [dragment.exportSchema()],
          });
          // 当前dragment还未添加入node子节点,需要setTimeout处理
          setTimeout(() => {
            currentNode.replaceChild(
              dragment,
              layoutPNode.exportSchema(),
              // 避免生成新的 nodeId
              { reserveSchemaNodeId: true },
            );
          }, 1);
        },
      },
    },
  }
}

export default {
  ...FastballTableMeta,
}
