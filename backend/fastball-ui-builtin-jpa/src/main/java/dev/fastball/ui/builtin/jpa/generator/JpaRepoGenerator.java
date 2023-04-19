package dev.fastball.ui.builtin.jpa.generator;

import com.google.auto.service.AutoService;
import com.squareup.javapoet.ClassName;
import com.squareup.javapoet.ParameterizedTypeName;
import com.squareup.javapoet.TypeName;
import com.squareup.javapoet.TypeSpec;
import dev.fastball.compile.FastballPreCompileGenerator;
import dev.fastball.ui.builtin.jpa.BuiltinGenerator;
import org.springframework.stereotype.Repository;

import javax.annotation.processing.ProcessingEnvironment;
import javax.lang.model.element.Modifier;
import javax.lang.model.element.TypeElement;

import static dev.fastball.ui.builtin.jpa.FastballAptJpaConstants.JPA_REPO_CLASS_NAME_SUFFIX;

@AutoService(FastballPreCompileGenerator.class)
public class JpaRepoGenerator extends BuiltinGenerator {
    @Override
    protected String getClassSuffix() {
        return JPA_REPO_CLASS_NAME_SUFFIX;
    }

    @Override
    protected TypeSpec.Builder typeBuilder(TypeElement element, ProcessingEnvironment processingEnv) {
            TypeSpec.Builder typeBuilder = TypeSpec.interfaceBuilder(buildClassName(element)).addModifiers(Modifier.PUBLIC);
            typeBuilder.addAnnotation(Repository.class);
            typeBuilder.addSuperinterface(ParameterizedTypeName.get(
                    ClassName.get("org.springframework.data.jpa.repository", "JpaRepository"),
                    TypeName.get(element.asType()), TypeName.LONG.box()
            ));
            typeBuilder.addSuperinterface(ParameterizedTypeName.get(
                    ClassName.get("org.springframework.data.jpa.repository", "JpaSpecificationExecutor"),
                    TypeName.get(element.asType())
            ));
            return typeBuilder;
        }
}
