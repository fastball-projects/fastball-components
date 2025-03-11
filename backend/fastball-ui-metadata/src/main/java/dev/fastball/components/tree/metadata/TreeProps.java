package dev.fastball.components.tree.metadata;

import dev.fastball.auto.value.annotation.AutoValue;
import dev.fastball.meta.basic.FieldInfo;
import dev.fastball.meta.component.ComponentProps;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @author gr@fastball.dev
 * @since 2022/12/20
 */
@AutoValue
public interface TreeProps extends ComponentProps {

    String headerTitle();

    TreeFieldNames fieldNames();

    List<FieldInfo> searchDataTableFields();

    boolean defaultExpandAll();

    boolean searchable();

    boolean asyncTree();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    final class TreeFieldNames {
        public static final TreeFieldNames DEFAULT = new TreeFieldNames("id", "title", "children", "hasChildren", "id", "title");

        private String key;
        private String title;
        private String children;
        private String hasChildren;
        private String searchDataKey;
        private String searchDataTitle;
    }
}
