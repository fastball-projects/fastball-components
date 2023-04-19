package dev.fastball.ui.builtin.jpa.generator;

import com.google.auto.service.AutoService;
import com.squareup.javapoet.*;
import dev.fastball.compile.FastballPreCompileGenerator;
import dev.fastball.core.annotation.UIComponent;
import dev.fastball.core.component.LookupAction;
import dev.fastball.ui.builtin.jpa.BuiltinGenerator;
import dev.fastball.ui.builtin.jpa.annotation.DataManagement;
import lombok.RequiredArgsConstructor;

import javax.annotation.processing.ProcessingEnvironment;
import javax.lang.model.element.Modifier;
import javax.lang.model.element.TypeElement;

import java.util.Collection;

import static dev.fastball.ui.builtin.jpa.FastballAptJpaConstants.*;

@AutoService(FastballPreCompileGenerator.class)
public class JpaLookupActionGenerator extends BuiltinGenerator {
    @Override
    protected String getClassSuffix() {
        return LOOKUP_ACTION_CLASS_NAME_SUFFIX;
    }

    @Override
    protected TypeSpec.Builder typeBuilder(TypeElement element, ProcessingEnvironment processingEnv) {
        TypeSpec.Builder typeBuilder = TypeSpec.classBuilder(buildClassName(element)).addModifiers(Modifier.PUBLIC);
        typeBuilder.addAnnotation(UIComponent.class);
        typeBuilder.addAnnotation(RequiredArgsConstructor.class);
        typeBuilder.addSuperinterface(ParameterizedTypeName.get(
                ClassName.get(LookupAction.class),
                TypeName.get(element.asType()), TypeName.OBJECT
        ));
        FieldSpec fieldSpec = FieldSpec.builder(ClassName.get(
                buildPackageName(element, processingEnv), element.getSimpleName() + JPA_REPO_CLASS_NAME_SUFFIX
        ), JPA_REPO_FIELD_NAME, Modifier.PROTECTED, Modifier.FINAL).build();
        typeBuilder.addField(fieldSpec);
        typeBuilder.addMethod(buildLoadLookupItemsMethod(element));
        return typeBuilder;
    }

    protected MethodSpec buildLoadLookupItemsMethod(TypeElement element) {
        CodeBlock codeBlock = CodeBlock.builder()
                .addStatement("return " + JPA_REPO_FIELD_NAME + ".findAll()")
                .build();
        return MethodSpec.methodBuilder(LOOKUP_ACTION_METHOD_NAME).addCode(codeBlock)
                .addAnnotation(Override.class)
                .returns(ParameterizedTypeName.get(ClassName.get(Collection.class), TypeName.get(element.asType())))
                .addParameter(TypeName.OBJECT, LOOKUP_ACTION_METHOD_PARAM_NAME).addModifiers(Modifier.PUBLIC)
                .build();
    }
}
