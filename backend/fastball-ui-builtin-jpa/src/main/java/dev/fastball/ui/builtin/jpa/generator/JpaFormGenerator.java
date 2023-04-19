package dev.fastball.ui.builtin.jpa.generator;

import com.squareup.javapoet.*;
import dev.fastball.core.annotation.RecordAction;
import dev.fastball.core.annotation.UIComponent;
import dev.fastball.core.component.LookupAction;
import dev.fastball.ui.builtin.jpa.AbstractJpaBuiltinGenerator;
import dev.fastball.ui.builtin.jpa.annotation.DataManagement;
import dev.fastball.ui.components.form.Form;
import lombok.RequiredArgsConstructor;

import javax.annotation.Generated;
import javax.lang.model.element.Modifier;
import javax.lang.model.element.TypeElement;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Date;

import static dev.fastball.ui.builtin.jpa.FastballAptJpaConstants.*;

public class JpaFormGenerator extends AbstractJpaBuiltinGenerator {
    @Override
    protected TypeSpec.Builder typeBuilder(TypeElement element, DataManagement annotation) {
        TypeSpec.Builder typeBuilder = TypeSpec.classBuilder(buildClassName(element, annotation)).addModifiers(Modifier.PUBLIC);
        typeBuilder.addAnnotation(UIComponent.class);
        typeBuilder.addAnnotation(RequiredArgsConstructor.class);
        typeBuilder.addSuperinterface(ParameterizedTypeName.get(
                ClassName.get(Form.class),
                TypeName.get(element.asType())
        ));
        FieldSpec fieldSpec = FieldSpec.builder(ClassName.get(
                buildPackageName(element), element.getSimpleName() + JPA_REPO_CLASS_NAME_SUFFIX
        ), JPA_REPO_FIELD_NAME, Modifier.PROTECTED, Modifier.FINAL).build();
        typeBuilder.addField(fieldSpec);
        typeBuilder.addMethod(buildSubmitMethod(element));
        return typeBuilder;
    }

    @Override
    protected String getClassSuffix() {
        return FORM_COMPONENT_CLASS_NAME_SUFFIX;
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
