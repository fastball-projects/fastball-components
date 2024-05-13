package dev.fastball.ui.components.form;

import com.google.auto.service.AutoService;
import dev.fastball.compile.ComponentCompiler;

/**
 * @author gr@fastball.dev
 * @since 2023/1/9
 */
@AutoService(value = ComponentCompiler.class)
public class FormCompiler extends AbstractFormCompiler<Form<?>> {
}
