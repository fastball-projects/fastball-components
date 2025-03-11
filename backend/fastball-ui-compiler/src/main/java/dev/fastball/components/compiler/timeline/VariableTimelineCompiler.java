package dev.fastball.components.compiler.timeline;

import com.google.auto.service.AutoService;
import dev.fastball.compile.ComponentCompiler;
import dev.fastball.components.timeline.VariableTimeline;

/**
 * @author gr@fastball.dev
 * @since 2023/2/6
 */
@AutoService(value = ComponentCompiler.class)
public class VariableTimelineCompiler extends AbstractTimelineCompiler<VariableTimeline<?, ?>> {
}
