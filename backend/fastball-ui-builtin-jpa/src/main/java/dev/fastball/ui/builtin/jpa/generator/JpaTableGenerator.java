package dev.fastball.ui.builtin.jpa.generator;

import com.google.auto.service.AutoService;
import com.squareup.javapoet.*;
import dev.fastball.compile.FastballPreCompileGenerator;
import dev.fastball.core.annotation.*;
import dev.fastball.core.component.DataResult;
import dev.fastball.ui.builtin.jpa.BuiltinGenerator;
import dev.fastball.ui.components.table.SearchTable;
import dev.fastball.ui.components.table.param.TableSearchParam;
import lombok.RequiredArgsConstructor;
import org.springframework.util.ClassUtils;

import javax.annotation.processing.ProcessingEnvironment;
import javax.lang.model.element.Modifier;
import javax.lang.model.element.TypeElement;

import static dev.fastball.ui.builtin.jpa.FastballAptJpaConstants.*;
import static dev.fastball.ui.builtin.jpa.generator.JpaQueryModelProcessor.QUERY_MODEL_PACKAGE;
import static dev.fastball.ui.builtin.jpa.generator.JpaQueryModelProcessor.QUERY_MODEL_PREFIX;

@AutoService(FastballPreCompileGenerator.class)
public class JpaTableGenerator extends BuiltinGenerator {
    @Override
    protected String getClassSuffix() {
        return TABLE_COMPONENT_CLASS_NAME_SUFFIX;
    }

    @Override
    protected TypeSpec.Builder typeBuilder(TypeElement element, ProcessingEnvironment processingEnv) {
        TypeSpec.Builder typeBuilder = TypeSpec.classBuilder(buildClassName(element)).addModifiers(Modifier.PUBLIC);
        typeBuilder.addAnnotation(UIComponent.class);
        typeBuilder.addAnnotation(RequiredArgsConstructor.class);
        AnnotationSpec.Builder viewActionsAnnotation = AnnotationSpec.builder(ViewActions.class);
        addViewActionsAnnotation(viewActionsAnnotation, element, processingEnv, false);
        addViewActionsAnnotation(viewActionsAnnotation, element, processingEnv, true);
        typeBuilder.addAnnotation(viewActionsAnnotation.build());
        ClassName queryModel = ClassName.get(ClassUtils.getPackageName(element.getQualifiedName().toString()) + "." + QUERY_MODEL_PACKAGE, QUERY_MODEL_PREFIX + element.getSimpleName().toString());
        typeBuilder.addSuperinterface(ParameterizedTypeName.get(
                ClassName.get(SearchTable.class),
                TypeName.get(element.asType()),
                queryModel
        ));
        FieldSpec fieldSpec = FieldSpec.builder(ClassName.get(
                buildPackageName(element, processingEnv), buildBasicClassName(element) + JPA_REPO_CLASS_NAME_SUFFIX
        ), JPA_REPO_FIELD_NAME, Modifier.PROTECTED, Modifier.FINAL).build();
        typeBuilder.addField(fieldSpec);
        typeBuilder.addMethod(buildLoadDataMethod(element, queryModel));
        typeBuilder.addMethod(buildDeleteMethod(element));
        return typeBuilder;
    }

    private void addViewActionsAnnotation(AnnotationSpec.Builder viewActionsAnnotationBuilder, TypeElement element, ProcessingEnvironment processingEnv, boolean edit) {
        viewActionsAnnotationBuilder.addMember((edit ? "recordActions" : "actions"), "$L", AnnotationSpec.builder(ViewAction.class)
                        .addMember("key", "$S", edit ? TABLE_EDIT_VIEW_ACTION_KEY : TABLE_NEW_VIEW_ACTION_KEY)
                        .addMember("name", "$S", edit ? TABLE_EDIT_VIEW_ACTION_NAME : TABLE_NEW_VIEW_ACTION_NAME)
                        .addMember("popup", "$L", AnnotationSpec.builder(Popup.class)
                                .addMember("value", "$L", AnnotationSpec.builder(RefComponent.class)
                                        .addMember("value", "$T.class", ClassName.get(
                                                buildPackageName(element, processingEnv), buildBasicClassName(element) + FORM_COMPONENT_CLASS_NAME_SUFFIX
                                        ))
                                        .build())
                                .build())
                        .build())
                .build();
    }

    private MethodSpec buildLoadDataMethod(TypeElement element, ClassName queryModel) {
        CodeBlock codeBlock = CodeBlock.builder()
                .addStatement("org.springframework.data.domain.Page<" + element.toString() + "> page")
                .beginControlFlow("if(params.getSearch() == null)", "params.getSearch()")
                .addStatement("page = " + JPA_REPO_FIELD_NAME + ".findAll(dev.fastball.ui.builtin.jpa.query.QueryUtils.pageable(params))")
                .nextControlFlow("else")
                .addStatement("page = " + JPA_REPO_FIELD_NAME + ".findAll(params.getSearch().condition(), dev.fastball.ui.builtin.jpa.query.QueryUtils.pageable(params))")
                .endControlFlow()
                .addStatement("return dev.fastball.core.component.DataResult.build(page.getTotalElements(), page.getContent())")
                .build();
        return MethodSpec.methodBuilder(TABLE_LOAD_DATA_METHOD_NAME)
                .addAnnotation(Override.class)
                .addParameter(ParameterSpec.builder(ParameterizedTypeName.get(ClassName.get(TableSearchParam.class), queryModel), "params").build())
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
                .addMember("confirmMessage", "$S", TABLE_DELETE_ACTION_CONFIRM)
                .build();
        return MethodSpec.methodBuilder(TABLE_DELETE_METHOD_NAME)
                .addAnnotation(recordActionAnnotation)
                .addCode(codeBlock)
                .returns(TypeName.VOID)
                .addParameter(TypeName.get(element.asType()), COMPONENT_METHOD_PARAM_NAME).addModifiers(Modifier.PUBLIC)
                .build();
    }
}
