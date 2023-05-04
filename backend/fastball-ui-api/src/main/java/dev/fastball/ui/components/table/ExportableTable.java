package dev.fastball.ui.components.table;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.ExcelWriter;

import java.io.File;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

public interface ExportableTable<T> {

    default ExcelWriter buildExcelWriter(File file) {
        return EasyExcel.write(file, getDataClass()).autoCloseStream(Boolean.FALSE).build();
    }

    default Class<T> getDataClass() {
        Class<T> clazz = getDataClass(this.getClass());
        if (clazz != null) {
            return clazz;
        }
        throw new RuntimeException("can't happened");
    }

    default Class<T> getDataClass(Type type) {
        if (type == Object.class) {
            return null;
        }
        if (type instanceof ParameterizedType) {
            ParameterizedType parameterizedType = (ParameterizedType) type;
            if (parameterizedType.getRawType() instanceof Class && ExportableTable.class.isAssignableFrom((Class<?>) parameterizedType.getRawType()) && parameterizedType.getActualTypeArguments()[0] instanceof Class) {
                return (Class<T>) parameterizedType.getActualTypeArguments()[0];
            }
        }
        if (((Class) type).getGenericSuperclass() != null) {
            Class<T> clazz = getDataClass(((Class) type).getGenericSuperclass());
            if (clazz != null) {
                return clazz;
            }
        }
        for (Type genericInterface : ((Class) type).getGenericInterfaces()) {
            Class<T> clazz = getDataClass(genericInterface);
            if (clazz != null) {
                return clazz;
            }
        }
        return null;
    }
}
