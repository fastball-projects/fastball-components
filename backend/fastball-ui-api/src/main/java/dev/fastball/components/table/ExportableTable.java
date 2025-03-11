package dev.fastball.components.table;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.ExcelWriter;
import dev.fastball.components.basic.GenericTypedComponent;

import java.io.File;

public interface ExportableTable<T> extends GenericTypedComponent<T> {

    default ExcelWriter buildExcelWriter(File file) {
        return EasyExcel.write(file, getActualType(0)).autoCloseStream(Boolean.FALSE).build();
    }

    @Override
    default Class<?> getSelfClass() {
        return ExportableTable.class;
    }
}
