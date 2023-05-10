package dev.fastball.ui.components.description.compiler;

import dev.fastball.compile.AbstractComponentCompiler;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.utils.TypeCompileUtils;
import dev.fastball.core.component.Component;
import dev.fastball.ui.components.description.DescriptionProps_AutoValue;
import dev.fastball.ui.components.description.config.DescriptionConfig;
import dev.fastball.ui.components.description.config.DescriptionField;
import dev.fastball.ui.components.description.config.DescriptionSize;

import javax.lang.model.element.TypeElement;
import java.util.List;

/**
 * @author gr@fastball.dev
 * @since 2022/12/14
 */
public abstract class AbstractDescriptionCompiler<T extends Component> extends AbstractComponentCompiler<T, DescriptionProps_AutoValue> {
    private static final String COMPONENT_TYPE = "FastballDescription";

    @Override
    protected DescriptionProps_AutoValue buildProps(CompileContext compileContext) {
        return new DescriptionProps_AutoValue();
    }

    @Override
    protected void compileProps(DescriptionProps_AutoValue props, CompileContext compileContext) {
        List<TypeElement> genericTypes = getGenericTypeElements(compileContext);
        props.fields(TypeCompileUtils.compileTypeFields(genericTypes.get(0), compileContext.getProcessingEnv(), props, (field, fieldInfo) -> {
            DescriptionField descriptionField = field.getAnnotation(DescriptionField.class);
            if(descriptionField != null) {
                fieldInfo.setDisplay(descriptionField.display());
            }
        }));
        DescriptionConfig config = compileContext.getComponentElement().getAnnotation(DescriptionConfig.class);
        if (config != null) {
            props.size(config.size());
            props.column(config.column());
        } else {
            props.size(DescriptionSize.Default);
            props.column(2);
        }
    }

    @Override
    public String getComponentName() {
        return COMPONENT_TYPE;
    }
}
