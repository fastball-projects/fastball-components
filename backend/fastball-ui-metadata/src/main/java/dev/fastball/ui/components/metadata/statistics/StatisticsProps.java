package dev.fastball.ui.components.metadata.statistics;


import dev.fastball.auto.value.annotation.AutoValue;
import dev.fastball.meta.component.ComponentProps;

import java.util.List;

/**
 * @author gr@fastball.dev
 */
@AutoValue
public interface StatisticsProps extends ComponentProps {
    boolean variableStatistics();

    List<StatisticsFieldInfo> fields();
}
