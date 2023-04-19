package dev.fastball.ui.builtin.jpa;

import dev.fastball.ui.builtin.jpa.annotation.DataManagement;

import javax.annotation.processing.SupportedSourceVersion;
import javax.lang.model.SourceVersion;
import javax.lang.model.element.TypeElement;

import static dev.fastball.ui.builtin.jpa.FastballAptJpaConstants.GENERATE_PACKAGE;

@SupportedSourceVersion(SourceVersion.RELEASE_8)
public abstract class AbstractJpaBuiltinGenerator extends AnnotationJavaFileGenerator<DataManagement> {

    @Override
    protected String buildPackageName(TypeElement element) {
        return super.buildPackageName(element) + "." + GENERATE_PACKAGE;
    }

    @Override
    protected String buildClassName(TypeElement element, DataManagement annotation) {
        return element.getSimpleName().toString() + getClassSuffix();
    }

    abstract protected String getClassSuffix();
}
