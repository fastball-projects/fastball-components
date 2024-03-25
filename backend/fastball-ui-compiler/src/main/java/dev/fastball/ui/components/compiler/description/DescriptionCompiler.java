package dev.fastball.ui.components.compiler.description;

import com.google.auto.service.AutoService;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.ui.components.description.Description;

/**
 * @author gr@fastball.dev
 * @since 2023/1/9
 */
@AutoService(value = ComponentCompiler.class)
public class DescriptionCompiler extends AbstractDescriptionCompiler<Description<?>> {
}
