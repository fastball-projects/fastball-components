package dev.fastball.components.compiler.tableform;

import com.google.auto.service.AutoService;
import dev.fastball.compile.CompileContext;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.components.tableform.metadata.TableFormProps_AutoValue;
import dev.fastball.components.tableform.VariableTableForm;

/**
 * @author gr@fastball.dev
 * @since 2023/1/9
 */
@AutoService(value = ComponentCompiler.class)
public class VariableTableFormCompiler extends AbstractTableFormCompiler<VariableTableForm<?, ?>> {

    @Override
    protected TableFormProps_AutoValue buildProps(CompileContext compileContext) {
        TableFormProps_AutoValue props = new TableFormProps_AutoValue();
        props.variableForm(true);
        return props;
    }
}
