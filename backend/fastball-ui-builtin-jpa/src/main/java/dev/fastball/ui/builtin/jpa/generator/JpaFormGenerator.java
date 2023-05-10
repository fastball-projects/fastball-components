package dev.fastball.ui.builtin.jpa.generator;

import com.google.auto.service.AutoService;
import com.squareup.javapoet.*;
import dev.fastball.compile.FastballPreCompileGenerator;
import dev.fastball.core.annotation.RecordAction;
import dev.fastball.core.annotation.UIComponent;
import dev.fastball.ui.builtin.jpa.BuiltinGenerator;
import dev.fastball.ui.builtin.jpa.annotation.DataManagement;
import dev.fastball.ui.components.form.Form;
import lombok.RequiredArgsConstructor;

import javax.annotation.processing.ProcessingEnvironment;
import javax.lang.model.element.Modifier;
import javax.lang.model.element.TypeElement;

import java.util.Set;

import static dev.fastball.ui.builtin.jpa.FastballAptJpaConstants.*;

@AutoService(FastballPreCompileGenerator.class)
public class JpaFormGenerator extends BuiltinGenerator {

    @Override
    protected String getClassSuffix() {
        return FORM_COMPONENT_CLASS_NAME_SUFFIX;
    }

    @Override
    protected TypeSpec.Builder typeBuilder(TypeElement element, ProcessingEnvironment processingEnv) {
        TypeSpec.Builder typeBuilder = TypeSpec.classBuilder(buildClassName(element)).addModifiers(Modifier.PUBLIC);
        typeBuilder.addAnnotation(UIComponent.class);
        typeBuilder.addAnnotation(RequiredArgsConstructor.class);
        typeBuilder.addSuperinterface(ParameterizedTypeName.get(
                ClassName.get(Form.class),
                TypeName.get(element.asType())
        ));
        FieldSpec fieldSpec = FieldSpec.builder(ClassName.get(
                buildPackageName(element, processingEnv), buildBasicClassName(element) + JPA_REPO_CLASS_NAME_SUFFIX
        ), JPA_REPO_FIELD_NAME, Modifier.PROTECTED, Modifier.FINAL).build();
        typeBuilder.addField(fieldSpec);
        typeBuilder.addMethod(buildSubmitMethod(element));
        return typeBuilder;
    }

    protected MethodSpec buildSubmitMethod(TypeElement element) {
        CodeBlock codeBlock = CodeBlock.builder()
                .addStatement(JPA_REPO_FIELD_NAME + ".save(" + COMPONENT_METHOD_PARAM_NAME + ")")
                .build();
        AnnotationSpec recordActionAnnotation = AnnotationSpec.builder(RecordAction.class)
                .addMember("name", "$S", FORM_SUBMIT_ACTION_NAME)
                .build();
        return MethodSpec.methodBuilder(FORM_SUBMIT_METHOD_NAME)
                .addAnnotation(recordActionAnnotation)
                .addCode(codeBlock)
                .returns(TypeName.VOID)
                .addParameter(TypeName.get(element.asType()), COMPONENT_METHOD_PARAM_NAME).addModifiers(Modifier.PUBLIC)
                .build();
    }
}
