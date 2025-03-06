package dev.fastball.ui.components.table;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.ExcelWriter;
import dev.fastball.ui.components.basic.GenericTypedComponent;

import java.io.File;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

public interface ExportableTable<T> extends GenericTypedComponent<T> {

    default ExcelWriter buildExcelWriter(File file) {
        return EasyExcel.write(file, getActualType(0)).autoCloseStream(Boolean.FALSE).build();
    }

    @Override
    default Class<?> getSelfClass() {
        return ExportableTable.class;
    }
}
