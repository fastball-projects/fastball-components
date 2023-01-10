import * as React from 'react';
import { Component, Fragment } from 'react';
import { common, SettingField } from '@alilc/lowcode-engine';
import { Button, Message, Menu, Dropdown } from '@alifd/next';
import { SetterType, FieldConfig, SetterConfig } from '@alilc/lowcode-types';
import Sortable from './sortable';
import CustomIcon from '../custom-icon';
import './style.less';
const { editorCabin, skeletonCabin } = common;
const { Title } = editorCabin;
const { createSettingFieldView, PopupContext } = skeletonCabin;

interface ArraySetterState {
  items: SettingField[];
}

interface ArraySetterProps {
  value: any[];
  field: SettingField;
  itemSetter?: SetterType;
  columns?: FieldConfig[];
  multiValue?: boolean;
  hideDescription?: boolean;
  onChange?: Function;
  extraProps: { renderFooter?: (options: ArraySetterProps & { onAdd: (val?: {}) => any }) => any }
}

export class ListSetter extends Component<ArraySetterProps, ArraySetterState> {
  state: ArraySetterState = {
    items: [],
  };

  private scrollToLast = false;

  constructor(props: ArraySetterProps) {
    super(props);
    this.init();
  }

  init() {
    const { value, field } = this.props;
    const items: SettingField[] = [];
    const valueLength = value && Array.isArray(value) ? value.length : 0;

    for (let i = 0; i < valueLength; i++) {
      const item = field.createField({
        name: i,
        setter: this.props.itemSetter,
        forceInline: 1,
        extraProps: {
          defaultValue: value[i],
          setValue: this.onItemChange,
        },
      });
      items.push(item);
    }
    field.setValue(value);
    this.state = { items };
  }

  /**
   * onItemChange 用于 ArraySetter 的单个 index 下的数据发生变化，
   * 因此 target.path 的数据格式必定为 [propName1, propName2, arrayIndex, key?]。
   *
   * @param target
   * @param value
   */
  onItemChange = (target: SettingField) => {
    const targetPath: Array<string | number> = target?.path;
    if (!targetPath || targetPath.length < 2) {
      console.warn(
        `[ArraySetter] onItemChange 接收的 target.path <${targetPath || 'undefined'
        }> 格式非法需为 [propName, arrayIndex, key?]`,
      );
      return;
    }
    const { field } = this.props;
    const { items } = this.state;
    const { path } = field;
    if (path[0] !== targetPath[0]) {
      console.warn(
        `[ArraySetter] field.path[0] !== target.path[0] <${path[0]} !== ${targetPath[0]}>`,
      );
      return;
    }
    const fieldValue = field.getValue();
    try {
      const index = +targetPath[targetPath.length - 2];
      if (typeof index === 'number' && !isNaN(index)) {
        fieldValue[index] = items[index].getValue();
        field?.extraProps?.setValue?.call(field, field, fieldValue);
      }
    } catch (e) {
      console.warn('[ArraySetter] extraProps.setValue failed :', e);
    }
  };

  onSort(sortedIds: Array<string | number>) {
    const { field } = this.props;
    const { items } = this.state;
    const values: any[] = [];
    const oldValues = field.getValue();
    const newItems: SettingField[] = [];
    sortedIds.map((id, index) => {
      const item = items[+id];
      item.setKey(index);
      values[index] = oldValues[id];
      newItems[index] = item;
      return id;
    });
    field.setValue(values);
    this.setState({ items: newItems });
  }

  onAdd(newValue?: { [key: string]: any }) {
    const { items = [] } = this.state;
    const { itemSetter, field } = this.props;
    const values = field.getValue() || [];
    const { initialValue } = itemSetter;
    const defaultValue = newValue ? newValue : (typeof initialValue === 'function' ? initialValue(field) : initialValue);
    const item = field.createField({
      name: items.length,
      setter: itemSetter,
      forceInline: 1,
      extraProps: {
        defaultValue,
        setValue: this.onItemChange,
      },
    });
    values.push(defaultValue);

    items.push(item);
    this.scrollToLast = true;
    field?.setValue(values);
    this.setState({ items });
  }

  onShow(field: SettingField) {
    field.setPropValue('display', 'Show');
  }

  onHidden(field: SettingField) {
    field.setPropValue('display', 'Hidden');
  }

  onDisable(field: SettingField) {
    field.setPropValue('display', 'Disabled');
  }

  componentWillUnmount() {
    this.state.items.forEach((field) => {
      field.purge();
    });
  }

  render() {
    const { hideDescription } = this.props;
    let columns: any = null;
    const { items } = this.state;
    const { scrollToLast } = this;
    this.scrollToLast = false;
    if (this.props.columns) {
      columns = this.props.columns.map((column) => (
        <Title key={column.name} title={column.title || (column.name as string)} />
      ));
    }

    const lastIndex = items.length - 1;

    const content =
      items.length > 0 ? (
        <div className="lc-setter-list-scroll-body">
          <Sortable itemClassName="lc-setter-list-card" onSort={this.onSort.bind(this)}>
            {items.map((field, index) => (
              <ArrayItem
                key={index}
                scrollIntoView={scrollToLast && index === lastIndex}
                field={field}
                onHidden={this.onHidden.bind(this, field)}
                onShow={this.onShow.bind(this, field)}
                onDisable={this.onDisable.bind(this, field)}
              />
            ))}
          </Sortable>
        </div>
      ) : (
        <div className="lc-setter-list-notice">
          {this.props.multiValue ? (
            <Message type="warning">当前选择了多个节点，且值不一致，修改会覆盖所有值</Message>
          ) : (
            <Message type="notice" size="medium" shape="inline">
              暂时还没有添加内容
            </Message>
          )}
        </div>
      );

    return (
      <div className="lc-setter-list lc-block-setter">
        {!hideDescription && columns && items.length > 0 ? (
          <div className="lc-setter-list-columns">{columns}</div>
        ) : null}
        {content}
      </div>
    );
  }
}

class ArrayItem extends Component<{
  field: SettingField;
  onHidden: () => void;
  onShow: () => void;
  onDisable: () => void;
  scrollIntoView: boolean;
}> {
  private shell?: HTMLDivElement | null;

  componentDidMount() {
    if (this.props.scrollIntoView && this.shell) {
      this.shell.parentElement!.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  render() {
    const { onHidden, onShow, onDisable, field } = this.props;

    const menu = (
      <Menu>
        <Menu.Item onClick={onShow}><CustomIcon type="icon-fastball-eye" size="small" />可见</Menu.Item>
        <Menu.Item onClick={onHidden}><CustomIcon type="icon-fastball-eye-close" size="small" />隐藏</Menu.Item>
        <Menu.Item onClick={onDisable}><CustomIcon type="icon-fastball-disabled" size="small" />禁用</Menu.Item>
      </Menu>
    );

    let showDropdownTrigger;
    if (field.getValue().display == 'Show') {
      showDropdownTrigger = (
        <Button size="small" ghost="light" onClick={onHidden} className="lc-listitem-action">
          <i class="iconfont icon-fastball-eye"></i>
        </Button>
      )
    } else if (field.getValue().display == 'Hidden') {
      showDropdownTrigger = (
        <Button size="small" ghost="light" onClick={onShow} className="lc-listitem-action">
          <i class="iconfont icon-fastball-eye-close"></i>
        </Button>
      )
    } else {
      showDropdownTrigger = (
        <Button size="small" ghost="light" onClick={onShow} className="lc-listitem-action">
          <i class="iconfont icon-fastball-disabled"></i>
        </Button>
      ) 
    }

    let showButten = <Dropdown
      trigger={showDropdownTrigger}
      onVisibleChange={console.log}
      triggerType={["hover"]}
      afterOpen={() => console.log("after open")}
    >
      {menu}
    </Dropdown>

    return (
      <div
        className="lc-listitem"
        ref={(ref) => {
          this.shell = ref;
        }}
      >
        <div className="lc-listitem-body">{createSettingFieldView(field, field.parent)}</div>
        <div className="lc-listitem-actions">
          {showButten}
          <Button draggable size="small" ghost="light" className="lc-listitem-handler">
            <CustomIcon type="icon-fastball-sort" size="small" />
          </Button>
        </div>
      </div>
    );
  }
}

class TableSetter extends ListSetter {
  // todo:
  // forceInline = 1
  // has more actions
}

export default class ArraySetter extends Component<{
  value: any[];
  field: SettingField;
  itemSetter?: SetterType;
  mode?: 'popup' | 'list';
  forceInline?: boolean;
  multiValue?: boolean;
}> {
  static contextType = PopupContext;

  private pipe: any;

  render() {
    const { mode, forceInline, ...props } = this.props;
    const { field, itemSetter } = props;
    let columns: FieldConfig[] | undefined;
    if ((itemSetter as SetterConfig)?.componentName === 'ObjectSetter') {
      const items: FieldConfig[] = (itemSetter as any).props?.config?.items;
      if (items && Array.isArray(items)) {
        columns = items.filter(
          (item) => item.isRequired || item.important || (item.setter as any)?.isRequired,
        );
        if (columns.length > 4) {
          columns = columns.slice(0, 4);
        }
      }
    }

    if (mode === 'popup' || forceInline) {
      const title = (
        <Fragment>
          编辑：
          <Title title={field.title} />
        </Fragment>
      );
      if (!this.pipe) {
        let width = 360;
        if (columns) {
          if (columns.length === 3) {
            width = 480;
          } else if (columns.length > 3) {
            width = 600;
          }
        }
        this.pipe = this.context.create({ width });
      }

      this.pipe.send(<TableSetter key={field.id} {...props} columns={columns} />, title);
      return (
        <Button
          type={forceInline ? 'normal' : 'primary'}
          onClick={(e) => {
            this.pipe.show((e as any).target, field.id);
          }}
        >
          <CustomIcon type="icon-fastball-edit" size="small" />
          {forceInline ? title : '编辑数组'}
        </Button>
      );
    } else {
      return <ListSetter {...props} columns={columns?.slice(0, 4)} />;
    }
  }
}
