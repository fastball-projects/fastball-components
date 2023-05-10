package dev.fastball.ui.builtin.jpa;

public interface FastballAptJpaConstants {
    String GENERATE_PACKAGE = "builtin";
    String JPA_REPO_CLASS_NAME_SUFFIX = "Repo";
    String JPA_REPO_FIELD_NAME = "repo";
    String LOOKUP_ACTION_CLASS_NAME_SUFFIX = "LookupAction";
    String LOOKUP_ACTION_METHOD_PARAM_NAME = "query";
    String LOOKUP_ACTION_METHOD_NAME = "loadLookupItems";
    String BUILT_IN_COMPONENT_CLASS_NAME = "Builtin";
    String FORM_COMPONENT_CLASS_NAME_SUFFIX = "Form";
    String COMPONENT_METHOD_PARAM_NAME = "record";
    String FORM_SUBMIT_ACTION_NAME = "提交";
    String FORM_SUBMIT_METHOD_NAME = "submit";
    String TABLE_COMPONENT_CLASS_NAME_SUFFIX = "Table";
    String TABLE_LOAD_DATA_METHOD_NAME = "loadData";
    String TABLE_NEW_VIEW_ACTION_KEY = "new";
    String TABLE_NEW_VIEW_ACTION_NAME = "新建";
    String TABLE_EDIT_VIEW_ACTION_KEY = "edit";
    String TABLE_EDIT_VIEW_ACTION_NAME = "编辑";
    String TABLE_DELETE_METHOD_NAME = "delete";
    String TABLE_DELETE_ACTION_NAME = "删除";
}
