package dev.fastball.ui.components.timeline;

import com.google.auto.service.AutoService;
import dev.fastball.compile.ComponentCompiler;

/**
 * @author gr@fastball.dev
 * @since 2023/2/6
 */
@AutoService(value = ComponentCompiler.class)
public class VariableTimelineCompiler extends AbstractTimelineCompiler<VariableTimeline<?, ?>> {
}
