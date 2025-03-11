package dev.fastball.component.builtin.jpa.generator;

import com.google.auto.service.AutoService;
import com.squareup.javapoet.*;
import dev.fastball.apt.SimpleQueryModelProcessor;
import dev.fastball.compile.FastballPreCompileGenerator;
import dev.fastball.component.builtin.jpa.query.JpaSimpleQueryModel;

import javax.annotation.processing.ProcessingEnvironment;
import javax.lang.model.element.Modifier;
import javax.lang.model.element.TypeElement;
import javax.lang.model.element.VariableElement;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author Xyf
 */
@AutoService(FastballPreCompileGenerator.class)
public class JpaSimpleQueryModelProcessor extends SimpleQueryModelProcessor {
    @Override
    protected TypeSpec.Builder typeBuilder(TypeSpec.Builder builder, TypeElement element, Map<String, VariableElement> fields, ProcessingEnvironment processingEnv) {
        TypeName eleTypeName = ClassName.get(element);
        builder.superclass(ParameterizedTypeName.get(
                ClassName.get(JpaSimpleQueryModel.class),
                eleTypeName));
        MethodSpec.Builder toPredicateBuilder = MethodSpec.methodBuilder("toPredicate")
                .addModifiers(Modifier.PROTECTED)
                .addAnnotation(Override.class)
                .returns(Predicate.class)
                .addParameter(ParameterizedTypeName.get(ClassName.get(Root.class), eleTypeName), "root")
                .addParameter(ParameterizedTypeName.get(ClassName.get(CriteriaQuery.class), WildcardTypeName.subtypeOf(Object.class)), "query")
                .addParameter(CriteriaBuilder.class, "criteriaBuilder")
                .addStatement("$T<Predicate> predicates = new $T<>()", List.class, ArrayList.class);
        fields.forEach((name, field) -> {
            toPredicateBuilder
                    .beginControlFlow("if ($L != null)", name)
                    .addStatement("predicates.add(predicateFn().get($L, $S, root, query, criteriaBuilder))", name, name)
                    .endControlFlow();
        });
        toPredicateBuilder.addStatement("return criteriaBuilder.and(predicates.toArray(predicates.toArray(new $T[0])))", Predicate.class);
        builder.addMethod(toPredicateBuilder.build());
        return builder;
    }
}
