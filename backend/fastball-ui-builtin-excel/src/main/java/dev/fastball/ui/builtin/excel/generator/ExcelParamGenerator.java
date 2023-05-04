package dev.fastball.ui.builtin.excel.generator;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import com.google.auto.service.AutoService;
import com.sun.source.util.TreePath;
import com.sun.source.util.Trees;
import com.sun.tools.javac.code.Symbol;
import com.sun.tools.javac.processing.JavacProcessingEnvironment;
import com.sun.tools.javac.tree.JCTree;
import com.sun.tools.javac.tree.TreeMaker;
import com.sun.tools.javac.tree.TreeTranslator;
import com.sun.tools.javac.util.Names;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.FastballCompileGenerator;
import dev.fastball.compile.utils.ElementCompileUtils;
import dev.fastball.core.annotation.Field;
import dev.fastball.core.annotation.Model;
import dev.fastball.core.info.basic.DisplayType;
import lombok.AllArgsConstructor;

import javax.annotation.processing.ProcessingEnvironment;
import javax.lang.model.element.Element;
import javax.lang.model.element.VariableElement;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Proxy;
import java.util.Collections;
import java.util.Set;

@AutoService(FastballCompileGenerator.class)
public class ExcelParamGenerator implements FastballCompileGenerator {
    @Override
    public void generate(CompileContext compileContext) {
        JavacProcessingEnvironment jpe = unwrapped(compileContext.getProcessingEnv());
        Trees trees = Trees.instance(jpe);
        Names names = Names.instance(jpe.getContext());
        TreeMaker treeMaker = TreeMaker.instance(jpe.getContext());
        ElementCompileUtils.getFields(compileContext.getComponentElement(), compileContext.getProcessingEnv()).values().forEach(field -> {
            ((JCTree) trees.getTree(field)).accept(new TreeTranslator() {
                @Override
                public void visitVarDef(JCTree.JCVariableDecl tree) {
                    Field fieldAnnotation = field.getAnnotation(Field.class);
                    JCTree.JCAnnotation excelPropertyAnnotation = treeMaker.Annotation(
                            treeMaker.Ident(names.fromString(ExcelProperty.class.getSimpleName())),
                            com.sun.tools.javac.util.List.of(treeMaker.Assign(treeMaker.Ident(names.fromString("value")),
                                    treeMaker.Literal(fieldAnnotation != null ? fieldAnnotation.title() : field.getSimpleName())))
                    );
                    tree.getModifiers().annotations = tree.getModifiers().annotations.append(excelPropertyAnnotation);
                    if(fieldAnnotation != null && fieldAnnotation.display() != DisplayType.Show){
                        JCTree.JCAnnotation fieldIgnoreAnnotation = treeMaker.Annotation(
                                treeMaker.Ident(names.fromString(ExcelIgnore.class.getSimpleName())),
                                com.sun.tools.javac.util.List.nil()
                        );
                        tree.getModifiers().annotations = tree.getModifiers().annotations.append(fieldIgnoreAnnotation);
                    }
                }
            });
        });
        JCTree.JCImport excelPropertyImport = treeMaker.Import(
                treeMaker.Select(
                        treeMaker.Ident(names.fromString(ExcelProperty.class.getPackage().getName())),
                        names.fromString(ExcelProperty.class.getSimpleName())),
                false);
        JCTree.JCImport excelIgnoreImport = treeMaker.Import(
                treeMaker.Select(
                        treeMaker.Ident(names.fromString(ExcelIgnore.class.getPackage().getName())),
                        names.fromString(ExcelIgnore.class.getSimpleName())),
                false);
        JCTree.JCCompilationUnit unit = toUnit(trees, compileContext.getComponentElement());
        unit.defs = unit.defs.append(excelPropertyImport).append(excelIgnoreImport);
    }

    public JCTree.JCCompilationUnit toUnit(Trees trees, Element element) {
        TreePath path = null;
        try {
            path = trees.getPath(element);
        } catch (NullPointerException e) {
            // ignored
        }
        if (path == null) {
            return null;
        }
        return (JCTree.JCCompilationUnit) path.getCompilationUnit();
    }

    private JavacProcessingEnvironment unwrapped(ProcessingEnvironment pe) {
        if (pe instanceof JavacProcessingEnvironment) {
            return (JavacProcessingEnvironment) pe;
        }
        JavacProcessingEnvironment delegate = getJavaProxyDelegateIfNecessary(pe);
        if (delegate == null) {
            throw new IllegalStateException("not found JavacProcessingEnvironment");
        }
        return delegate;
    }

    private JavacProcessingEnvironment getJavaProxyDelegateIfNecessary(ProcessingEnvironment pe) {
        try {
            InvocationHandler handler = Proxy.getInvocationHandler(pe);
            java.lang.reflect.Field delegateField = null;
            Class<?> handlerClass = handler.getClass();
            while (handlerClass != null) {
                try {
                    delegateField = handlerClass.getDeclaredField("val$delegateTo");
                    break;
                } catch (NoSuchFieldException e) {
                    // no field, ignore
                }
                handlerClass = handlerClass.getSuperclass();
            }
            if (delegateField == null) {
                return null;
            }
            delegateField.setAccessible(true);
            ProcessingEnvironment delegate = (ProcessingEnvironment) delegateField.get(handler);
            if (delegate != null) {
                return unwrapped(delegate);
            }
        } catch (Exception e) {
            // not a idea proxy, ignore
        }
        return null;
    }

    @Override
    public Set<String> getSupportedAnnotationTypes() {
        return Collections.singleton(Model.class.getCanonicalName());
    }
}
