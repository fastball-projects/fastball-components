package dev.fastball.ui.components.description.compiler;

import com.google.auto.service.AutoService;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.ui.components.description.DescriptionProps_AutoValue;
import dev.fastball.ui.components.description.VariableDescription;

/**
 * @author gr@fastball.dev
 * @since 2023/1/9
 */
@AutoService(value = ComponentCompiler.class)
public class VariableDescriptionCompiler extends AbstractDescriptionCompiler<VariableDescription<?, ?>> {

    @Override
    protected DescriptionProps_AutoValue buildProps(CompileContext compileContext) {
        DescriptionProps_AutoValue props = new DescriptionProps_AutoValue();
        props.variableDescription(true);
        return props;
    }
}
