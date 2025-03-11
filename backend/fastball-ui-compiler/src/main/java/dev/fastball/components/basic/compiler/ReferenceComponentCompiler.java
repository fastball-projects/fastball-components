package dev.fastball.components.basic.compiler;

import com.google.auto.service.AutoService;
import dev.fastball.compile.AbstractComponentCompiler;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.compile.exception.CompilerException;
import dev.fastball.meta.component.ReferencedComponentInfo;
import dev.fastball.components.basic.ReferenceComponent;
import dev.fastball.components.basic.ReferenceComponentProps_AutoValue;
import dev.fastball.components.basic.config.ReferenceComponentConfig;

import java.util.HashSet;

/**
 * @author gr@fastball.dev
 * @since 2023/1/11
 */
@AutoService(value = ComponentCompiler.class)
public class ReferenceComponentCompiler extends AbstractComponentCompiler<ReferenceComponent, ReferenceComponentProps_AutoValue> {
    @Override
    protected ReferenceComponentProps_AutoValue buildProps(CompileContext compileContext) {
        String componentClassName = compileContext.getComponentElement().getQualifiedName().toString();
        ReferenceComponentConfig config = compileContext.getComponentElement().getAnnotation(ReferenceComponentConfig.class);
        if (config == null) {
            String message = String.format("Class [%s] implements ReferenceComponent, but not found annotation @ReferenceComponentConfig", componentClassName);
            throw new CompilerException(message);
        }
        ReferenceComponentProps_AutoValue props = new ReferenceComponentProps_AutoValue();
        ReferencedComponentInfo componentInfo = new ReferencedComponentInfo();
        componentInfo.setComponentClass(componentClassName);
        componentInfo.setComponent(config.componentName());
        componentInfo.setComponentPackage(config.npmPackage());
        componentInfo.setComponentPath(config.fromPath());
        componentInfo.setDefaultComponent(config.defaultComponent());
        if (props.referencedComponentInfoList() == null) {
            props.referencedComponentInfoList(new HashSet<>());
        }
        props.referencedComponentInfoList().add(componentInfo);
        props.component(componentInfo);
        return props;
    }

    @Override
    public String getComponentName() {
        return "ReferenceComponent";
    }
}
