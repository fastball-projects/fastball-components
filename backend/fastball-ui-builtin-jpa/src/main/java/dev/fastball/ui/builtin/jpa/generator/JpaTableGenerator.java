package dev.fastball.ui.builtin.jpa.generator;

import com.squareup.javapoet.*;
import dev.fastball.core.annotation.*;
import dev.fastball.core.component.DataResult;
import dev.fastball.ui.builtin.jpa.AbstractJpaBuiltinGenerator;
import dev.fastball.ui.builtin.jpa.annotation.DataManagement;
import dev.fastball.ui.components.table.Table;
import lombok.RequiredArgsConstructor;

import javax.lang.model.element.Modifier;
import javax.lang.model.element.TypeElement;

import static dev.fastball.ui.builtin.jpa.FastballAptJpaConstants.*;

public class JpaTableGenerator extends AbstractJpaBuiltinGenerator {
    @Override
    protected TypeSpec.Builder typeBuilder(TypeElement element, DataManagement annotation) {
        TypeSpec.Builder typeBuilder = TypeSpec.classBuilder(buildClassName(element, annotation)).addModifiers(Modifier.PUBLIC);
        typeBuilder.addAnnotation(UIComponent.class);
        typeBuilder.addAnnotation(RequiredArgsConstructor.class);
        addViewActionsAnnotation(typeBuilder, element, false);
        addViewActionsAnnotation(typeBuilder, element, true);
        typeBuilder.addSuperinterface(ParameterizedTypeName.get(
                ClassName.get(Table.class),
                TypeName.get(element.asType())
        ));
        FieldSpec fieldSpec = FieldSpec.builder(ClassName.get(
                buildPackageName(element), element.getSimpleName() + JPA_REPO_CLASS_NAME_SUFFIX
        ), JPA_REPO_FIELD_NAME, Modifier.PROTECTED, Modifier.FINAL).build();
        typeBuilder.addField(fieldSpec);
        typeBuilder.addMethod(buildLoadDataMethod(element));
        typeBuilder.addMethod(buildDeleteMethod(element));
        return typeBuilder;
    }

    @Override
    protected String getClassSuffix() {
        return TABLE_COMPONENT_CLASS_NAME_SUFFIX;
    }

    private void addViewActionsAnnotation(TypeSpec.Builder typeBuilder, TypeElement element, boolean edit) {
        AnnotationSpec recordViewActionsAnnotation = AnnotationSpec.builder(edit ? RecordViewActions.class : ViewActions.class)
                .addMember("value", "$L", AnnotationSpec.builder(ViewAction.class)
                        .addMember("key", "$S", edit ? TABLE_EDIT_VIEW_ACTION_KEY : TABLE_NEW_VIEW_ACTION_KEY)
                        .addMember("name", "$S", edit ? TABLE_EDIT_VIEW_ACTION_NAME : TABLE_NEW_VIEW_ACTION_NAME)
                        .addMember("popup", "$L", AnnotationSpec.builder(Popup.class)
                                .addMember("value", "$L", AnnotationSpec.builder(RefComponent.class)
                                        .addMember("value", "$T.class", ClassName.get(
                                                buildPackageName(element), element.getSimpleName() + FORM_COMPONENT_CLASS_NAME_SUFFIX
                                        ))
                                        .build())
                                .build())
                        .build())
                .build();
        typeBuilder.addAnnotation(recordViewActionsAnnotation);
    }

    private MethodSpec buildLoadDataMethod(TypeElement element) {
        CodeBlock codeBlock = CodeBlock.builder()
                .addStatement("return dev.fastball.core.component.DataResult.build(" + JPA_REPO_FIELD_NAME + ".findAll())")
                .build();
        return MethodSpec.methodBuilder(TABLE_LOAD_DATA_METHOD_NAME)
                .addAnnotation(Override.class)
                .addCode(codeBlock)
                .returns(ParameterizedTypeName.get(ClassName.get(DataResult.class), TypeName.get(element.asType())))
                .addModifiers(Modifier.PUBLIC)
                .build();
    }
    protected MethodSpec buildDeleteMethod(TypeElement element) {
        CodeBlock codeBlock = CodeBlock.builder()
                .addStatement(JPA_REPO_FIELD_NAME + ".delete(" + COMPONENT_METHOD_PARAM_NAME + ")")
                .build();
        AnnotationSpec recordActionAnnotation = AnnotationSpec.builder(RecordAction.class)
                .addMember("key", "$S", TABLE_DELETE_METHOD_NAME)
                .addMember("name", "$S", TABLE_DELETE_ACTION_NAME)
                .build();
        return MethodSpec.methodBuilder(TABLE_DELETE_METHOD_NAME)
                .addAnnotation(recordActionAnnotation)
                .addCode(codeBlock)
                .returns(TypeName.VOID)
                .addParameter(TypeName.get(element.asType()), COMPONENT_METHOD_PARAM_NAME).addModifiers(Modifier.PUBLIC)
                .build();
    }
}
