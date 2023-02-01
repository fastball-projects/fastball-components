package dev.fastball.ui.components.tree;

import dev.fastball.auto.value.annotation.AutoValue;
import dev.fastball.core.info.component.ComponentProps;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author gr@fastball.dev
 * @since 2022/12/20
 */
@AutoValue
public interface TreeProps extends ComponentProps {

    String headerTitle();

    TreeFieldNames fieldNames();

    boolean defaultExpandAll();

    boolean searchable();

    boolean asyncTree();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    final class TreeFieldNames {
        public static final TreeFieldNames DEFAULT = new TreeFieldNames("id", "title", "children");

        private String key;
        private String title;
        private String children;
    }
}
