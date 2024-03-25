package dev.fastball.ui.components.compiler.description;

import com.google.auto.service.AutoService;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.ui.components.description.VariableDescription;
import dev.fastball.ui.components.metadata.description.DescriptionProps_AutoValue;

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
