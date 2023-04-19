package dev.fastball.ui.builtin.jpa;

import com.squareup.javapoet.TypeSpec;

import javax.annotation.processing.RoundEnvironment;
import javax.annotation.processing.SupportedSourceVersion;
import javax.lang.model.SourceVersion;
import javax.lang.model.element.TypeElement;
import java.lang.annotation.Annotation;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Stream;

@SupportedSourceVersion(SourceVersion.RELEASE_8)
public abstract class AnnotationJavaFileGenerator<T extends Annotation> extends JavaFileGenerator {

    @Override
    protected Stream<TypeElement> loadElements(RoundEnvironment roundEnv) {
        return roundEnv.getElementsAnnotatedWith(getAnnotationClass()).stream()
                .map(TypeElement.class::cast)
                .filter(this::needProcess);
    }

    @Override
    protected TypeSpec.Builder typeBuilder(TypeElement element) {
        return typeBuilder(element, element.getAnnotation(getAnnotationClass()));
    }

    @Override
    protected String buildClassName(TypeElement element) {
        return buildClassName(element, element.getAnnotation(getAnnotationClass()));
    }

    @Override
    public Set<String> getSupportedAnnotationTypes() {
        return Collections.singleton(getAnnotationClass().getName());
    }

    public Class<T> getAnnotationClass() {
        Type genericSuperclass = this.getClass().getGenericSuperclass();
        while (genericSuperclass != null) {
            if (genericSuperclass instanceof ParameterizedType) {
                ParameterizedType parameterizedType = (ParameterizedType) genericSuperclass;
                if (parameterizedType.getRawType() instanceof Class && AnnotationJavaFileGenerator.class.isAssignableFrom((Class<?>) parameterizedType.getRawType()) && parameterizedType.getActualTypeArguments()[0] instanceof Class) {
                    return (Class<T>) parameterizedType.getActualTypeArguments()[0];
                }
                genericSuperclass = parameterizedType.getRawType();
            } else if (genericSuperclass instanceof Class) {
                genericSuperclass = ((Class<?>) genericSuperclass).getGenericSuperclass();
            }
        }
        throw new RuntimeException("can't happened");
    }

    protected abstract TypeSpec.Builder typeBuilder(TypeElement element, T annotation);

    protected abstract String buildClassName(TypeElement element, T annotation);


}
