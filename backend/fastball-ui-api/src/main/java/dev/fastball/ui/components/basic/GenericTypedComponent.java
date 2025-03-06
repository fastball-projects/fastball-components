package dev.fastball.ui.components.basic;

import dev.fastball.core.component.Component;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

public interface GenericTypedComponent<T> extends Component {

    Class<?> getSelfClass();

    default Class<T> getActualType(int index) {
        return getActualType(getClass(), index);
    }

    default Class<T> getActualType(Type type, int index) {
        if (type == Object.class) {
            return null;
        }
        if (type instanceof ParameterizedType) {
            ParameterizedType parameterizedType = (ParameterizedType) type;
            if (parameterizedType.getRawType() instanceof Class && getSelfClass().isAssignableFrom((Class<?>) parameterizedType.getRawType()) && parameterizedType.getActualTypeArguments()[index] instanceof Class) {
                return (Class<T>) parameterizedType.getActualTypeArguments()[index];
            }
        }
        if (((Class) type).getGenericSuperclass() != null) {
            Class<T> clazz = getActualType(((Class) type).getGenericSuperclass(), index);
            if (clazz != null) {
                return clazz;
            }
        }
        for (Type genericInterface : ((Class) type).getGenericInterfaces()) {
            Class<T> clazz = getActualType(genericInterface, index);
            if (clazz != null) {
                return clazz;
            }
        }
        return null;
    }
}
