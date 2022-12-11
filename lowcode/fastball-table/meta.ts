import { ReadOnlySetter, HideAbleArraySetter } from '../_setters'

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
        name: 'query',
        title: { label: '搜索字段', tip: '表格搜索字段的配置描述，具体项见下表' },
        display: 'accordion',
        setter: {
          componentName: HideAbleArraySetter,
          props: {
            itemSetter: {
              componentName: 'ObjectSetter',
              props: {
                config: {
                  items: [
                    {
                      name: 'dataIndex',
                      title: { label: '数据字段', tip: 'dataIndex | 数据字段' },
                      propType: 'string',
                      setter: ReadOnlySetter,
                      isRequired: true
                    },
                    {
                      name: 'title',
                      title: { label: '字段标题', tip: 'title | 字段标题' },
                      propType: 'string',
                      setter: 'StringSetter',
                      isRequired: true
                    },
                    {
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
                              title: '开关',
                              value: 'switch'
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
                          ]
                        }
                      }
                    },
                    {
                      name: 'valueEnum',
                      title: {
                        label: '枚举定义',
                        tip: 'valueEnum | 值的枚举，会自动转化把值当成 key 来取出要显示的内容'
                      },
                      propType: 'object',
                      setter: 'JsonSetter'
                    },
                    {
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
                    },
                    {
                      name: 'width',
                      title: { label: '宽度', tip: 'width | 宽度' },
                      propType: {
                        type: 'oneOfType',
                        value: ['number', 'string']
                      },
                      setter: ['NumberSetter', 'StringSetter', 'VariableSetter']
                    },
                    {
                      name: 'tooltip',
                      title: {
                        label: '气泡提示',
                        tip: 'tooltip	| 气泡提示'
                      },
                      propType: 'string',
                      setter: 'StringSetter'
                    },
                    {
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
                    },
                  ]
                }
              },
              initialValue: { title: '标题' }
            }
          }
        }
      },

      {
        name: 'columns',
        title: { label: '表格列', tip: '表格列的配置描述，具体项见下表' },
        display: 'accordion',
        setter: {
          componentName: HideAbleArraySetter,
          props: {
            itemSetter: {
              componentName: 'ObjectSetter',
              props: {
                config: {
                  items: [
                    {
                      name: 'dataIndex',
                      title: { label: '数据字段', tip: 'dataIndex | 数据字段' },
                      propType: 'string',
                      setter: ReadOnlySetter,
                      isRequired: true
                    },
                    {
                      name: 'title',
                      title: { label: '列标题', tip: 'title | 列标题' },
                      propType: 'string',
                      setter: 'StringSetter',
                      isRequired: true
                    },
                    {
                      name: 'valueType',
                      title: { label: '数据类型', tip: 'valueType | 数据类型' },
                      propType: 'string',
                      setter: {
                        componentName: 'SelectSetter',
                        props: {
                          options: [
                            {
                              title: '操作',
                              value: 'option'
                            },
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
                    },
                    {
                      name: 'renderTag',
                      title: {
                        label: '使用 Tag 渲染',
                        tip: 'renderTag | 是否使用 Tag 渲染'
                      },
                      propType: 'bool',
                      setter: 'BoolSetter'
                    },
                    {
                      name: 'valueEnum',
                      title: {
                        label: '枚举定义',
                        tip: 'valueEnum | 值的枚举，会自动转化把值当成 key 来取出要显示的内容'
                      },
                      propType: 'object',
                      setter: 'JsonSetter'
                    },
                    {
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
                    },
                    {
                      name: 'width',
                      title: { label: '宽度', tip: 'width | 宽度' },
                      propType: {
                        type: 'oneOfType',
                        value: ['number', 'string']
                      },
                      setter: ['NumberSetter', 'StringSetter', 'VariableSetter']
                    },
                    {
                      name: 'tooltip',
                      title: {
                        label: '气泡提示',
                        tip: 'tooltip	| 气泡提示'
                      },
                      propType: 'string',
                      setter: 'StringSetter'
                    },
                    {
                      name: 'ellipsis',
                      title: {
                        label: '是否自动缩略',
                        tip: 'ellipsis | 是否自动缩略'
                      },
                      propType: 'bool',
                      setter: 'BoolSetter'
                    },
                    {
                      name: 'copyable',
                      title: {
                        label: '是否可复制',
                        tip: 'copyable | 是否可复制'
                      },
                      propType: 'bool',
                      setter: 'BoolSetter'
                    },
                    {
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
                    },
                    {
                      name: 'fixed',
                      title: { label: '列是否固定', tip: 'fixed | 列是否固定' },
                      description:
                        '（IE 下无效）列是否固定，可选 true (等效于 left) left right',
                      defaultValue: '',
                      propType: {
                        type: 'oneOf',
                        value: ['', 'left', 'right']
                      },
                      setter: [
                        {
                          componentName: 'RadioGroupSetter',
                          props: {
                            options: [
                              {
                                title: '不固定',
                                value: ''
                              },
                              {
                                title: '固定在左侧',
                                value: 'left'
                              },
                              {
                                title: '固定在右侧',
                                value: 'right'
                              }
                            ]
                          }
                        },
                        'VariableSetter'
                      ]
                    },
                    {
                      name: 'className',
                      title: {
                        label: '列样式类名',
                        tip: 'className | 列样式类名'
                      },
                      propType: 'string',
                      setter: 'StringSetter'
                    },
                    {
                      name: 'sorter',
                      title: {
                        label: '排序规则',
                        tip: 'sorter | 排序函数，本地排序使用一个函数，需要服务端排序可设为 true'
                      },
                      propType: { type: 'oneOfType', value: ['bool', 'func'] },
                      setter: ['BoolSetter', 'FunctionSetter', 'VariableSetter']
                    },
                    {
                      name: 'key',
                      title: {
                        label: 'React key',
                        tip: 'key | React需要的key'
                      },
                      propType: 'string',
                      setter: 'StringSetter'
                    },
                    {
                      name: 'order',
                      title: {
                        label: '排序',
                        tip: 'order | 查询表单中的权重，权重大排序靠前'
                      },
                      propType: 'number',
                      setter: 'NumberSetter'
                    },
                    {
                      name: 'filters',
                      title: {
                        label: '筛选菜单项',
                        tip: 'filters | 表头的筛选菜单项'
                      },
                      propType: 'object',
                      setter: 'JsonSetter'
                    },
                    {
                      name: 'fieldProps.showSearch',
                      title: {
                        label: '下拉框支持搜索',
                        tip: 'fieldProps.showSearch | 下拉框支持搜索'
                      },
                      propType: 'bool',
                      setter: 'BoolSetter'
                    },
                    {
                      name: 'render',
                      title: {
                        label: '自定义渲染',
                        tip: 'render | 插槽内的物料表达式可通过this.record获取当前行数据，this.index获取索引'
                      },
                      propType: 'func',
                      setter: [
                        {
                          componentName: 'SlotSetter',
                          title: '单元格插槽',
                          initialValue: {
                            type: 'JSSlot',
                            params: ['text', 'record', 'index'],
                            value: []
                          }
                        },
                        'VariableSetter'
                      ]
                    }
                  ]
                }
              },
              initialValue: { title: '标题' }
            }
          }
        }
      },
      {
        name: 'actions',
        title: { label: '操作', tip: '表格的操作配置，具体项见下表' },
        display: 'accordion',
        extraProps: {
          "defaultCollapsed": true // 控制默认折叠
        },
        setter: {
          componentName: HideAbleArraySetter,
          props: {
            itemSetter: {
              componentName: 'ObjectSetter',
              props: {
                config: {
                  items: [
                    {
                      name: 'name',
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
        },
        defaultValue: []
      },

      {
        name: 'recordActions',
        title: { label: '行数据操作', tip: '表格行数据的操作配置，具体项见下表' },
        display: 'accordion',
        extraProps: {
          "defaultCollapsed": true // 控制默认折叠
        },
        setter: {
          componentName: HideAbleArraySetter,
          props: {
            itemSetter: {
              componentName: 'ObjectSetter',
              props: {
                config: {
                  items: [
                    {
                      name: 'name',
                      title: { label: '按钮名称', tip: 'name | 按钮名称' },
                      propType: 'string',
                      setter: 'StringSetter',
                      isRequired: true
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
    component: {}
  }
}

export default {
  ...FastballTableMeta,
}
