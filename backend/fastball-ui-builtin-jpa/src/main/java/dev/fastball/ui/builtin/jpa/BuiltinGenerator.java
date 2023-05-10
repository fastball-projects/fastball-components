package dev.fastball.ui.builtin.jpa;

import com.squareup.javapoet.AnnotationSpec;
import com.squareup.javapoet.JavaFile;
import com.squareup.javapoet.TypeSpec;
import dev.fastball.compile.FastballPreCompileGenerator;
import dev.fastball.compile.exception.CompilerException;
import dev.fastball.ui.builtin.jpa.annotation.DataManagement;
import dev.fastball.ui.builtin.jpa.annotation.GeneratedFrom;

import javax.annotation.Generated;
import javax.annotation.processing.ProcessingEnvironment;
import javax.lang.model.element.PackageElement;
import javax.lang.model.element.TypeElement;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.Set;

import static dev.fastball.ui.builtin.jpa.FastballAptJpaConstants.BUILT_IN_COMPONENT_CLASS_NAME;
import static dev.fastball.ui.builtin.jpa.FastballAptJpaConstants.GENERATE_PACKAGE;

public abstract class BuiltinGenerator implements FastballPreCompileGenerator {
    @Override
    public void generate(TypeElement typeElement, ProcessingEnvironment processingEnv) {
        JavaFile javaFile = buildJavaFile(typeElement, processingEnv);
        try {
            javaFile.writeTo(processingEnv.getFiler());
        } catch (IOException e) {
            throw new CompilerException(e);
        }
    }

    @Override
    public Set<String> getSupportedAnnotationTypes() {
        return Collections.singleton(DataManagement.class.getCanonicalName());
    }

    protected JavaFile buildJavaFile(TypeElement element, ProcessingEnvironment processingEnv) {
        return JavaFile.builder(buildPackageName(element, processingEnv), buildType(element, processingEnv)).build();
    }

    protected TypeSpec buildType(TypeElement element, ProcessingEnvironment processingEnv) {
        AnnotationSpec generatedAnnotation = AnnotationSpec.builder(Generated.class)
                .addMember("value", "$S", this.getClass().getName())
                .addMember("date", "$S", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()))
                .build();
        AnnotationSpec generatedFromAnnotation = AnnotationSpec.builder(GeneratedFrom.class)
                .addMember("value", element.getQualifiedName().toString() + ".class")
                .build();
        TypeSpec.Builder typeBuilder = typeBuilder(element, processingEnv);
        typeBuilder.addAnnotation(generatedAnnotation);
        typeBuilder.addAnnotation(generatedFromAnnotation);
        return typeBuilder.build();
    }

    protected String buildPackageName(TypeElement element, ProcessingEnvironment processingEnv) {
        PackageElement packageElement = processingEnv.getElementUtils().getPackageOf(element);
        if (packageElement != null) {
            return packageElement.getQualifiedName().toString() + "." + GENERATE_PACKAGE;
        }
        return "";
    }

    protected String buildClassName(TypeElement element) {
        return buildBasicClassName(element) + getClassSuffix();
    }

    protected String buildBasicClassName(TypeElement element) {
        return element.getSimpleName() + BUILT_IN_COMPONENT_CLASS_NAME;
    }

    abstract protected String getClassSuffix();

    protected abstract TypeSpec.Builder typeBuilder(TypeElement element, ProcessingEnvironment processingEnv);
}
