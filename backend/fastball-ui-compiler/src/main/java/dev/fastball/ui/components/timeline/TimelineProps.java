package dev.fastball.ui.components.timeline;

import dev.fastball.auto.value.annotation.AutoValue;
import dev.fastball.core.info.action.ActionInfo;
import dev.fastball.core.info.component.ComponentProps;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @author gr@fastball.dev
 * @since 2023/1/9
 */
@AutoValue
public interface TimelineProps extends ComponentProps {

    TimelineFieldNames fieldNames();

    List<ActionInfo> recordActions();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    final class TimelineFieldNames {
        public static final TimelineFieldNames DEFAULT = new TimelineFieldNames("id", "title", "time", "color");

        private String key;
        private String title;
        private String time;
        private String color;
    }
}
