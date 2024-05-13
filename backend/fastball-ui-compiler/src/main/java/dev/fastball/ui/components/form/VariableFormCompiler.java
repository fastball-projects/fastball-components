package dev.fastball.ui.components.form;

import com.google.auto.service.AutoService;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.ComponentCompiler;

/**
 * @author gr@fastball.dev
 * @since 2023/1/9
 */
@AutoService(value = ComponentCompiler.class)
public class VariableFormCompiler extends AbstractFormCompiler<VariableForm<?, ?>> {

    @Override
    protected FormProps_AutoValue buildProps(CompileContext compileContext) {
        FormProps_AutoValue props = new FormProps_AutoValue();
        props.variableForm(true);
        return props;
    }
}
