package dev.fastball.ui.builtin.jpa.generator;

import com.google.auto.service.AutoService;
import com.squareup.javapoet.*;
import dev.fastball.auto.value.annotation.GeneratedFrom;
import dev.fastball.compile.FastballGenerateCompileGenerator;
import dev.fastball.compile.exception.CompilerException;
import dev.fastball.compile.utils.ElementCompileUtils;
import dev.fastball.core.annotation.Field;
import dev.fastball.core.annotation.Lookup;
import dev.fastball.core.annotation.TreeLookup;
import dev.fastball.core.field.Range;
import dev.fastball.meta.basic.DisplayType;
import dev.fastball.meta.basic.ValueType;
import dev.fastball.ui.builtin.jpa.annotation.DataManagement;
import dev.fastball.ui.builtin.jpa.query.JpaQueryModel;
import lombok.Getter;
import lombok.Setter;
import org.springframework.util.ClassUtils;
import org.springframework.util.StringUtils;

import javax.annotation.processing.ProcessingEnvironment;
import javax.lang.model.element.*;
import javax.lang.model.type.DeclaredType;
import javax.lang.model.type.TypeKind;
import javax.lang.model.type.TypeMirror;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.io.IOException;
import java.util.*;

import static dev.fastball.meta.basic.ValueType.*;

/**
 * @author GR
 */
@AutoService(FastballGenerateCompileGenerator.class)
public class JpaQueryModelProcessor implements FastballGenerateCompileGenerator {
    public static final String QUERY_MODEL_PACKAGE = "query";
    public static final String QUERY_MODEL_PREFIX = "Q";
    public static final String PREDICATE_METHOD_RETURN = "return criteriaBuilder.and(predicates.toArray(predicates.toArray(new $T[0])))";

    @Override
    public void generate(TypeElement element, ProcessingEnvironment processingEnv) {
        TypeSpec.Builder typeBuilder = typeBuilder(element);
        MethodSpec.Builder predicateBuilder = buildPredicateBuilder(element);
        ElementCompileUtils.getFields(element, processingEnv).entrySet().stream()
                .filter(fieldInfo -> fieldInfo.getValue().getAnnotation(DataManagement.QueryIgnore.class) == null)
                .map(fieldInfo -> buildQueryField(fieldInfo.getKey(), fieldInfo.getValue(), predicateBuilder, processingEnv))
                .filter(Objects::nonNull)
                .forEach(typeBuilder::addField);
        predicateBuilder.addStatement(PREDICATE_METHOD_RETURN, Predicate.class);
        typeBuilder.addMethod(predicateBuilder.build());
        typeBuilder.addMethod(modelClassBuilder(element));
        JavaFile queryModelFile = JavaFile.builder(getPackageName(element, processingEnv), typeBuilder.build()).build();
        try {
            queryModelFile.writeTo(processingEnv.getFiler());
        } catch (IOException e) {
            throw new CompilerException(e);
        }
    }

    private MethodSpec.Builder buildPredicateBuilder(TypeElement element) {
        return MethodSpec.methodBuilder("toPredicate")
                .addModifiers(Modifier.PROTECTED)
                .addAnnotation(Override.class)
                .returns(Predicate.class)
                .addParameter(ParameterizedTypeName.get(ClassName.get(Root.class), ClassName.get(element)), "root")
                .addParameter(ParameterizedTypeName.get(ClassName.get(CriteriaQuery.class), WildcardTypeName.subtypeOf(Object.class)), "query")
                .addParameter(CriteriaBuilder.class, "criteriaBuilder")
                .addStatement("$T<Predicate> predicates = new $T<>()", List.class, ArrayList.class);
    }

    private MethodSpec modelClassBuilder(TypeElement element) {
        return MethodSpec.methodBuilder("modelClass")
                .addModifiers(Modifier.PROTECTED)
                .addAnnotation(Override.class)
                .returns(ParameterizedTypeName.get(ClassName.get(Class.class), ClassName.get(element)))
                .addStatement("return $T.class", ClassName.get(element)).build();
    }

    private FieldSpec buildQueryField(String name, VariableElement field, MethodSpec.Builder toPredicateBuilder, ProcessingEnvironment processingEnv) {
        String typeStr = getTypeAsStr(field.asType());
        Field fieldAnnotation = field.getAnnotation(Field.class);
        ValueType valueType = null;
        String fieldTitle = null;
        if (fieldAnnotation != null) {
            if (fieldAnnotation.display() != DisplayType.Show) {
                return null;
            }
            valueType = fieldAnnotation.type();
            fieldTitle = fieldAnnotation.title();
        }
        Lookup lookupAnnotation = field.getAnnotation(Lookup.class);
        if (lookupAnnotation != null) {
            TypeMirror lookupActionType = ElementCompileUtils.getTypeMirrorFromAnnotationValue(lookupAnnotation::value);
            return buildLookupField(name, fieldTitle, typeStr, field, Lookup.class, lookupActionType, toPredicateBuilder, processingEnv);
        }
        TreeLookup treeLookupAnnotation = field.getAnnotation(TreeLookup.class);
        if (treeLookupAnnotation != null) {
            TypeMirror lookupActionType = ElementCompileUtils.getTypeMirrorFromAnnotationValue(treeLookupAnnotation::value);
            return buildLookupField(name, fieldTitle, typeStr, field, TreeLookup.class, lookupActionType, toPredicateBuilder, processingEnv);
        }
        switch (field.asType().getKind()) {
            case LONG:
            case INT:
            case SHORT:
            case BYTE:
            case DOUBLE:
            case FLOAT:
            case CHAR:
                return buildRangeField(name, fieldTitle, DIGIT, typeStr, toPredicateBuilder);
            case BOOLEAN:
                return buildBooleanField(name, fieldTitle, toPredicateBuilder);
            case ARRAY:
                return null;
        }
        switch (typeStr) {
            // 附件和地址类暂时无法查询
            case "dev.fastball.core.field.Attachment":
            case "dev.fastball.core.field.Address":
                return null;
            case "java.lang.Boolean":
                return buildBooleanField(name, fieldTitle, toPredicateBuilder);
            case "java.lang.CharSequence":
            case "java.lang.String": {
                if (valueType == null || valueType == AUTO || valueType == TEXT) {
                    return buildStringField(name, fieldTitle, toPredicateBuilder);
                }
                if (valueType == TEXTAREA || valueType == RICH_TEXT || valueType == PASSWORD || valueType == AVATAR) {
                    return null;
                }
                // TODO range 还不知道怎么查? 有交集就行, between or between?
                if (valueType == TIME_RANGE || valueType == DATE_WEEK_RANGE || valueType == DATE_MONTH_RANGE || valueType == DATE_QUARTER_RANGE || valueType == DATE_YEAR_RANGE) {
                    return null;
                }
                // TODO 特殊时间查询
                if (valueType == DATE_WEEK || valueType == DATE_MONTH || valueType == DATE_QUARTER || valueType == DATE_YEAR) {
                    return null;
                }
                if (valueType == TIME || valueType == DATE || valueType == DATE_TIME) {
                    return buildRangeField(name, fieldTitle, valueType, typeStr, toPredicateBuilder);
                }
                return null;
            }
            case "java.time.LocalTime":
                return buildRangeField(name, fieldTitle, TIME, typeStr, toPredicateBuilder);
            case "java.time.LocalDate":
            case "java.time.LocalDateTime":
            case "java.util.Date":
                return buildRangeField(name, fieldTitle, valueType, typeStr, toPredicateBuilder);
            default:
                TypeMirror fieldType = field.asType();
                TypeElement typeElement = (TypeElement) ((DeclaredType) fieldType).asElement();
                // 集合类的, 也包括多选模式, 暂不支持
                if (ElementCompileUtils.isAssignableFrom(Collection.class, typeElement, processingEnv)) {
                    return null;
                }
                if (typeElement.getKind() == ElementKind.ENUM) {
                    return buildEnumField(name, fieldTitle, typeStr, toPredicateBuilder);
                }
                if (ElementCompileUtils.isAssignableFrom(Number.class, typeElement, processingEnv)) {
                    return buildRangeField(name, fieldTitle, DIGIT, typeStr, toPredicateBuilder);
                }
                return null;
        }
    }

    private final static Map<ValueType, ValueType> rangeValueTypeMap = new HashMap<ValueType, ValueType>() {{
        put(DIGIT, DIGIT_RANGE);
        put(TIME, TIME_RANGE);
        put(DATE, DATE_RANGE);
        put(DATE_TIME, DATE_TIME_RANGE);
        put(DATE_WEEK, DATE_WEEK_RANGE);
        put(DATE_MONTH, DATE_MONTH_RANGE);
        put(DATE_QUARTER, DATE_QUARTER_RANGE);
        put(DATE_YEAR, DATE_YEAR_RANGE);
    }};

    private FieldSpec buildBooleanField(String name, String title, MethodSpec.Builder toPredicateBuilder) {
        TypeName typeName = ClassName.get(String.class);
        AnnotationSpec fieldAnnotation = AnnotationSpec.builder(Field.class).addMember("title", "$S", title != null ? title : "").build();
        toPredicateBuilder
                .beginControlFlow("if ($L != null)", name)
                .addStatement("predicates.add(equalPredicate($L, $S, root, criteriaBuilder))", name, name)
                .endControlFlow();
        return FieldSpec.builder(typeName, name, Modifier.PRIVATE).addAnnotation(fieldAnnotation).build();
    }

    private FieldSpec buildStringField(String name, String title, MethodSpec.Builder toPredicateBuilder) {
        TypeName typeName = ClassName.get(String.class);
        AnnotationSpec fieldAnnotation = AnnotationSpec.builder(Field.class).addMember("title", "$S", title != null ? title : "").build();
        toPredicateBuilder
                .beginControlFlow("if ($L != null)", name)
                .addStatement("predicates.add(likePredicate($L, $S, root, criteriaBuilder))", name, name)
                .endControlFlow();
        return FieldSpec.builder(typeName, name, Modifier.PRIVATE).addAnnotation(fieldAnnotation).build();
    }

    private FieldSpec buildRangeField(String name, String title, ValueType valueType, String typeStr, MethodSpec.Builder toPredicateBuilder) {
        TypeName typeName = ParameterizedTypeName.get(
                ClassName.get(Range.class),
                ClassName.get(ClassUtils.getPackageName(typeStr), ClassUtils.getShortName(typeStr))
        );
        AnnotationSpec.Builder fieldAnnotationBuilder = AnnotationSpec.builder(Field.class);
        if (StringUtils.hasLength(title)) {
            fieldAnnotationBuilder.addMember("title", "$S", title);
        }
        if (valueType != null && valueType != AUTO) {
            ValueType rangeType = rangeValueTypeMap.get(valueType);
            fieldAnnotationBuilder.addMember("type", ValueType.class.getCanonicalName() + "." + (rangeType != null ? rangeType.toString() : valueType.toString()));
        }
        toPredicateBuilder
                .beginControlFlow("if ($L != null)", name)
                .addStatement("predicates.add(rangePredicate($L, $S, root, criteriaBuilder))", name, name)
                .endControlFlow();
        return FieldSpec.builder(typeName, name, Modifier.PRIVATE).addAnnotation(fieldAnnotationBuilder.build()).build();
    }


    private FieldSpec buildLookupField(String name, String title, String typeStr, VariableElement field, Class<?> lookupAnnotationClass, TypeMirror lookupActionType, MethodSpec.Builder toPredicateBuilder, ProcessingEnvironment processingEnv) {
        TypeName typeName = ParameterizedTypeName.get(
                ClassName.get(List.class),
                ClassName.get(ClassUtils.getPackageName(typeStr), ClassUtils.getShortName(typeStr))
        );
        AnnotationSpec.Builder fieldAnnotationBuilder = AnnotationSpec.builder(Field.class);
        if (StringUtils.hasLength(title)) {
            fieldAnnotationBuilder.addMember("title", "$S", title);
        }
        AnnotationMirror lookupMirror = field.getAnnotationMirrors().stream()
                .filter(annotationMirror -> annotationMirror.getAnnotationType().asElement().toString().equals(lookupAnnotationClass.getCanonicalName()))
                .findFirst().orElseThrow(() -> new CompilerException("can't happened"));
        TypeElement lookupActionElement = (TypeElement) processingEnv.getTypeUtils().asElement(lookupActionType);
        if (lookupActionElement == null) {
            throw new CompilerException("can't happened");
        }
        AnnotationSpec.Builder lookupAnnotationBuilder = AnnotationSpec.get(lookupMirror).toBuilder();
        lookupAnnotationBuilder.members.put("value", Collections.singletonList(CodeBlock.of("$L", lookupActionElement.getQualifiedName() + ".class")));
        lookupAnnotationBuilder.members.put("extraFillFields", Collections.singletonList(CodeBlock.of("$L", "{}")));
        toPredicateBuilder
                .beginControlFlow("if ($L != null && !$L.isEmpty())", name, name)
                .addStatement("predicates.add(inPredicate($L, $S, root, criteriaBuilder))", name, name)
                .endControlFlow();
        return FieldSpec.builder(typeName, name, Modifier.PRIVATE)
                .addAnnotation(lookupAnnotationBuilder.build())
                .addAnnotation(fieldAnnotationBuilder.build())
                .build();
    }

    private FieldSpec buildEnumField(String name, String title, String typeStr, MethodSpec.Builder toPredicateBuilder) {
        TypeName typeName = ParameterizedTypeName.get(
                ClassName.get(List.class),
                ClassName.get(ClassUtils.getPackageName(typeStr), ClassUtils.getShortName(typeStr))
        );
        AnnotationSpec.Builder fieldAnnotationBuilder = AnnotationSpec.builder(Field.class);
        if (StringUtils.hasLength(title)) {
            fieldAnnotationBuilder.addMember("title", "$S", title);
        }
        toPredicateBuilder
                .beginControlFlow("if ($L != null && !$L.isEmpty())", name, name)
                .addStatement("predicates.add(inPredicate($L, $S, root, criteriaBuilder))", name, name)
                .endControlFlow();
        return FieldSpec.builder(typeName, name, Modifier.PRIVATE)
                .addAnnotation(fieldAnnotationBuilder.build())
                .build();
    }

    @Override
    public Set<String> getSupportedAnnotationTypes() {
        return Collections.singleton(DataManagement.class.getCanonicalName());
    }

    private String getPackageName(TypeElement element, ProcessingEnvironment processingEnv) {
        PackageElement packageElement = processingEnv.getElementUtils().getPackageOf(element);
        if (packageElement != null) {
            return packageElement.getQualifiedName().toString() + "." + QUERY_MODEL_PACKAGE;
        }
        return "";
    }

    protected TypeSpec.Builder typeBuilder(TypeElement element) {
        TypeSpec.Builder typeBuilder = TypeSpec.classBuilder(buildClassName(element)).addModifiers(Modifier.PUBLIC);
        typeBuilder.superclass(ParameterizedTypeName.get(ClassName.get(JpaQueryModel.class), ClassName.get(element)));
        AnnotationSpec generatedFromAnnotation = AnnotationSpec.builder(GeneratedFrom.class).addMember("value", element.getQualifiedName().toString() + ".class").build();
        typeBuilder.addAnnotation(generatedFromAnnotation);
        typeBuilder.addAnnotation(Getter.class);
        typeBuilder.addAnnotation(Setter.class);
        return typeBuilder;
    }

    protected String buildClassName(TypeElement element) {
        return QUERY_MODEL_PREFIX + element.getSimpleName();
    }

    private static String getTypeAsStr(TypeMirror typeMirror) {
        if (typeMirror.getKind() == TypeKind.DECLARED) {
            DeclaredType declaredType = (DeclaredType) typeMirror;
            return declaredType.asElement().toString();
        } else {
            return typeMirror.toString();
        }
    }
}
