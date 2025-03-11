package dev.fastball.components.compiler.form;

import com.google.auto.service.AutoService;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.components.form.VariableForm;
import dev.fastball.components.form.metadata.FormProps_AutoValue;
import dev.fastball.components.form.metadata.WebFormProps_AutoValue;

/**
 * @author gr@fastball.dev
 * @since 2023/1/9
 */
@AutoService(value = ComponentCompiler.class)
public class VariableFormCompiler extends AbstractFormCompiler<VariableForm<?, ?>> {

    @Override
    protected WebFormProps_AutoValue buildProps(CompileContext compileContext) {
        WebFormProps_AutoValue props = new WebFormProps_AutoValue();
        props.variableForm(true);
        return props;
    }
}
