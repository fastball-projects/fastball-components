
import { ComponentMetadata, Snippet } from '@alilc/lowcode-types';

const FastballTableFormMeta: ComponentMetadata = {
  "componentName": "FastballTableForm",
  "title": "FastballTableForm",
  "docUrl": "",
  "screenshot": "",
  "devMode": "proCode",
  "npm": {
    "package": "fastball-components",
    "version": "0.5.0.1716197789",
    "exportName": "FastballTableForm",
    "main": "src/index.tsx",
    "destructuring": true,
    "subName": ""
  },
  "configure": {
    "props": [
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "fields",
            "zh-CN": "fields"
          }
        },
        "name": "fields",
        "setter": {
          "componentName": "MixedSetter",
          "isRequired": true,
          "props": {}
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "rowKey",
            "zh-CN": "rowKey"
          }
        },
        "name": "rowKey",
        "setter": {
          "componentName": "StringSetter",
          "isRequired": true,
          "initialValue": ""
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "childrenFieldName",
            "zh-CN": "childrenFieldName"
          }
        },
        "name": "childrenFieldName",
        "setter": {
          "componentName": "StringSetter",
          "isRequired": true,
          "initialValue": ""
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "rowEditable",
            "zh-CN": "rowEditable"
          }
        },
        "name": "rowEditable",
        "setter": {
          "componentName": "BoolSetter",
          "isRequired": true,
          "initialValue": false
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "rowSelectable",
            "zh-CN": "rowSelectable"
          }
        },
        "name": "rowSelectable",
        "setter": {
          "componentName": "BoolSetter",
          "isRequired": true,
          "initialValue": false
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "defaultSelected",
            "zh-CN": "defaultSelected"
          }
        },
        "name": "defaultSelected",
        "setter": {
          "componentName": "MixedSetter",
          "props": {
            "setters": [
              {
                "componentName": "ObjectSetter",
                "props": {
                  "config": {
                    "extraSetter": {
                      "componentName": "MixedSetter",
                      "isRequired": false,
                      "props": {}
                    }
                  }
                },
                "isRequired": false,
                "initialValue": {}
              },
              {
                "componentName": "BoolSetter",
                "isRequired": false,
                "initialValue": false
              }
            ]
          }
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "value",
            "zh-CN": "value"
          }
        },
        "name": "value",
        "setter": {
          "componentName": "MixedSetter",
          "props": {
            "setters": [
              {
                "componentName": "ObjectSetter",
                "props": {
                  "config": {
                    "extraSetter": {
                      "componentName": "MixedSetter",
                      "isRequired": false,
                      "props": {}
                    }
                  }
                },
                "isRequired": false,
                "initialValue": {}
              },
              {
                "componentName": "ArraySetter",
                "props": {
                  "itemSetter": {
                    "componentName": "ObjectSetter",
                    "props": {
                      "config": {
                        "extraSetter": {
                          "componentName": "ObjectSetter",
                          "props": {
                            "config": {
                              "extraSetter": {
                                "componentName": "MixedSetter",
                                "isRequired": false,
                                "props": {}
                              }
                            }
                          },
                          "isRequired": false,
                          "initialValue": {}
                        }
                      }
                    },
                    "initialValue": {}
                  }
                },
                "initialValue": []
              }
            ]
          }
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "onChange",
            "zh-CN": "onChange"
          }
        },
        "name": "onChange",
        "setter": {
          "componentName": "MixedSetter",
          "props": {
            "setters": [
              {
                "componentName": "ObjectSetter",
                "props": {
                  "config": {
                    "extraSetter": {
                      "componentName": "MixedSetter",
                      "isRequired": false,
                      "props": {}
                    }
                  }
                },
                "isRequired": false,
                "initialValue": {}
              },
              {
                "componentName": "FunctionSetter",
                "isRequired": false
              }
            ]
          }
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "formRef",
            "zh-CN": "formRef"
          }
        },
        "name": "formRef",
        "setter": {
          "componentName": "MixedSetter",
          "props": {
            "setters": [
              {
                "componentName": "ObjectSetter",
                "props": {
                  "config": {
                    "extraSetter": {
                      "componentName": "MixedSetter",
                      "isRequired": false,
                      "props": {}
                    }
                  }
                },
                "isRequired": false,
                "initialValue": {}
              }
            ]
          }
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "column",
            "zh-CN": "column"
          }
        },
        "name": "column",
        "setter": {
          "componentName": "MixedSetter",
          "props": {
            "setters": [
              {
                "componentName": "ObjectSetter",
                "props": {
                  "config": {
                    "extraSetter": {
                      "componentName": "MixedSetter",
                      "isRequired": false,
                      "props": {}
                    }
                  }
                },
                "isRequired": false,
                "initialValue": {}
              },
              {
                "componentName": "NumberSetter",
                "isRequired": false,
                "initialValue": 0
              }
            ]
          }
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "headerTitle",
            "zh-CN": "headerTitle"
          }
        },
        "name": "headerTitle",
        "setter": {
          "componentName": "MixedSetter",
          "props": {
            "setters": [
              {
                "componentName": "ObjectSetter",
                "props": {
                  "config": {
                    "extraSetter": {
                      "componentName": "MixedSetter",
                      "isRequired": false,
                      "props": {}
                    }
                  }
                },
                "isRequired": false,
                "initialValue": {}
              },
              {
                "componentName": "StringSetter",
                "isRequired": false,
                "initialValue": ""
              }
            ]
          }
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "showReset",
            "zh-CN": "showReset"
          }
        },
        "name": "showReset",
        "setter": {
          "componentName": "BoolSetter",
          "isRequired": true,
          "initialValue": false
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "variableForm",
            "zh-CN": "variableForm"
          }
        },
        "name": "variableForm",
        "setter": {
          "componentName": "BoolSetter",
          "isRequired": true,
          "initialValue": false
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "readonly",
            "zh-CN": "readonly"
          }
        },
        "name": "readonly",
        "setter": {
          "componentName": "BoolSetter",
          "isRequired": true,
          "initialValue": false
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "size",
            "zh-CN": "size"
          }
        },
        "name": "size",
        "setter": {
          "componentName": "MixedSetter",
          "props": {
            "setters": [
              {
                "componentName": "ObjectSetter",
                "props": {
                  "config": {
                    "extraSetter": {
                      "componentName": "MixedSetter",
                      "isRequired": false,
                      "props": {}
                    }
                  }
                },
                "isRequired": false,
                "initialValue": {}
              },
              {
                "componentName": "RadioGroupSetter",
                "props": {
                  "dataSource": [
                    {
                      "label": "middle",
                      "value": "middle"
                    },
                    {
                      "label": "small",
                      "value": "small"
                    },
                    {
                      "label": "large",
                      "value": "large"
                    }
                  ],
                  "options": [
                    {
                      "label": "middle",
                      "value": "middle"
                    },
                    {
                      "label": "small",
                      "value": "small"
                    },
                    {
                      "label": "large",
                      "value": "large"
                    }
                  ]
                },
                "initialValue": "middle"
              }
            ]
          }
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "actions",
            "zh-CN": "actions"
          }
        },
        "name": "actions",
        "setter": {
          "componentName": "MixedSetter",
          "props": {
            "setters": [
              {
                "componentName": "ObjectSetter",
                "props": {
                  "config": {
                    "extraSetter": {
                      "componentName": "MixedSetter",
                      "isRequired": false,
                      "props": {}
                    }
                  }
                },
                "isRequired": false,
                "initialValue": {}
              },
              {
                "componentName": "ArraySetter",
                "props": {
                  "itemSetter": {
                    "componentName": "ObjectSetter",
                    "props": {
                      "config": {
                        "extraSetter": {
                          "componentName": "MixedSetter",
                          "isRequired": false,
                          "props": {}
                        }
                      }
                    },
                    "isRequired": false,
                    "initialValue": {}
                  }
                },
                "initialValue": []
              }
            ]
          }
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "recordActions",
            "zh-CN": "recordActions"
          }
        },
        "name": "recordActions",
        "setter": {
          "componentName": "MixedSetter",
          "props": {
            "setters": [
              {
                "componentName": "ObjectSetter",
                "props": {
                  "config": {
                    "extraSetter": {
                      "componentName": "MixedSetter",
                      "isRequired": false,
                      "props": {}
                    }
                  }
                },
                "isRequired": false,
                "initialValue": {}
              },
              {
                "componentName": "ArraySetter",
                "props": {
                  "itemSetter": {
                    "componentName": "ObjectSetter",
                    "props": {
                      "config": {
                        "extraSetter": {
                          "componentName": "MixedSetter",
                          "isRequired": false,
                          "props": {}
                        }
                      }
                    },
                    "isRequired": false,
                    "initialValue": {}
                  }
                },
                "initialValue": []
              }
            ]
          }
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "valueChangeHandlers",
            "zh-CN": "valueChangeHandlers"
          }
        },
        "name": "valueChangeHandlers",
        "setter": {
          "componentName": "MixedSetter",
          "props": {
            "setters": [
              {
                "componentName": "ObjectSetter",
                "props": {
                  "config": {
                    "extraSetter": {
                      "componentName": "MixedSetter",
                      "isRequired": false,
                      "props": {}
                    }
                  }
                },
                "isRequired": false,
                "initialValue": {}
              },
              {
                "componentName": "ArraySetter",
                "props": {
                  "itemSetter": {
                    "componentName": "ObjectSetter",
                    "props": {
                      "config": {
                        "items": [
                          {
                            "title": {
                              "label": {
                                "type": "i18n",
                                "en-US": "watchFields",
                                "zh-CN": "watchFields"
                              }
                            },
                            "name": "watchFields",
                            "setter": {
                              "componentName": "ArraySetter",
                              "props": {
                                "itemSetter": {
                                  "componentName": "StringSetter",
                                  "isRequired": false,
                                  "initialValue": ""
                                }
                              },
                              "isRequired": true,
                              "initialValue": []
                            }
                          },
                          {
                            "title": {
                              "label": {
                                "type": "i18n",
                                "en-US": "handlerKey",
                                "zh-CN": "handlerKey"
                              }
                            },
                            "name": "handlerKey",
                            "setter": {
                              "componentName": "StringSetter",
                              "isRequired": true,
                              "initialValue": ""
                            }
                          }
                        ],
                        "extraSetter": {
                          "componentName": "MixedSetter",
                          "isRequired": false,
                          "props": {}
                        }
                      }
                    }
                  }
                },
                "initialValue": []
              }
            ]
          }
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "data",
            "zh-CN": "data"
          }
        },
        "name": "data",
        "setter": {
          "componentName": "MixedSetter",
          "props": {
            "setters": [
              {
                "componentName": "ObjectSetter",
                "props": {
                  "config": {
                    "extraSetter": {
                      "componentName": "MixedSetter",
                      "isRequired": false,
                      "props": {}
                    }
                  }
                },
                "isRequired": false,
                "initialValue": {}
              },
              {
                "componentName": "ObjectSetter",
                "props": {
                  "config": {
                    "extraSetter": {
                      "componentName": "ObjectSetter",
                      "props": {
                        "config": {
                          "extraSetter": {
                            "componentName": "MixedSetter",
                            "isRequired": false,
                            "props": {}
                          }
                        }
                      },
                      "isRequired": false,
                      "initialValue": {}
                    }
                  }
                },
                "initialValue": {}
              }
            ]
          }
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "initialValues",
            "zh-CN": "initialValues"
          }
        },
        "name": "initialValues",
        "setter": {
          "componentName": "MixedSetter",
          "props": {
            "setters": [
              {
                "componentName": "ObjectSetter",
                "props": {
                  "config": {
                    "extraSetter": {
                      "componentName": "MixedSetter",
                      "isRequired": false,
                      "props": {}
                    }
                  }
                },
                "isRequired": false,
                "initialValue": {}
              },
              {
                "componentName": "ObjectSetter",
                "props": {
                  "config": {
                    "extraSetter": {
                      "componentName": "ObjectSetter",
                      "props": {
                        "config": {
                          "extraSetter": {
                            "componentName": "MixedSetter",
                            "isRequired": false,
                            "props": {}
                          }
                        }
                      },
                      "isRequired": false,
                      "initialValue": {}
                    }
                  }
                },
                "initialValue": {}
              }
            ]
          }
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "componentKey",
            "zh-CN": "componentKey"
          }
        },
        "name": "componentKey",
        "setter": {
          "componentName": "StringSetter",
          "isRequired": true,
          "initialValue": ""
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "__designMode",
            "zh-CN": "__designMode"
          }
        },
        "name": "__designMode",
        "setter": {
          "componentName": "MixedSetter",
          "props": {
            "setters": [
              {
                "componentName": "ObjectSetter",
                "props": {
                  "config": {
                    "extraSetter": {
                      "componentName": "MixedSetter",
                      "isRequired": false,
                      "props": {}
                    }
                  }
                },
                "isRequired": false,
                "initialValue": {}
              },
              {
                "componentName": "StringSetter",
                "isRequired": false,
                "initialValue": ""
              }
            ]
          }
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "input",
            "zh-CN": "input"
          }
        },
        "name": "input",
        "setter": {
          "componentName": "MixedSetter",
          "isRequired": false,
          "props": {}
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "container",
            "zh-CN": "container"
          }
        },
        "name": "container",
        "setter": {
          "componentName": "MixedSetter",
          "isRequired": false,
          "props": {}
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "setActions",
            "zh-CN": "setActions"
          }
        },
        "name": "setActions",
        "setter": {
          "componentName": "MixedSetter",
          "props": {
            "setters": [
              {
                "componentName": "ObjectSetter",
                "props": {
                  "config": {
                    "extraSetter": {
                      "componentName": "MixedSetter",
                      "isRequired": false,
                      "props": {}
                    }
                  }
                },
                "isRequired": false,
                "initialValue": {}
              },
              {
                "componentName": "FunctionSetter",
                "isRequired": false
              }
            ]
          }
        }
      },
      {
        "title": {
          "label": {
            "type": "i18n",
            "en-US": "closePopup",
            "zh-CN": "closePopup"
          }
        },
        "name": "closePopup",
        "setter": {
          "componentName": "MixedSetter",
          "props": {
            "setters": [
              {
                "componentName": "ObjectSetter",
                "props": {
                  "config": {
                    "extraSetter": {
                      "componentName": "MixedSetter",
                      "isRequired": false,
                      "props": {}
                    }
                  }
                },
                "isRequired": false,
                "initialValue": {}
              },
              {
                "componentName": "FunctionSetter",
                "isRequired": false
              }
            ]
          }
        }
      }
    ],
    "supports": {
      "events": [
        {
          "name": "onDataLoad"
        }
      ],
      "style": true
    },
    "component": {}
  }
};
const snippets: Snippet[] = [
  {
    "title": "FastballTableForm",
    "screenshot": "",
    "schema": {
      "componentName": "FastballTableForm",
      "props": {}
    }
  }
];

export default {
  ...FastballTableFormMeta,
  snippets
};
